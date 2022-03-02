package bit.project.server.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.EmployeeDao;
import bit.project.server.dao.NotificationDao;
import bit.project.server.dao.UserDao;
import bit.project.server.entity.*;
import bit.project.server.dao.ComplaintDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/complaints")
public class ComplaintController{

    @Autowired
    private ComplaintDao complaintDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    @Autowired
    private EmployeeDao employeeDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private NotificationDao notificationDao;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ComplaintController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("complaint");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("CM");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Complaint> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all complaints", UsecaseList.SHOW_ALL_COMPLAINTS);

        if(pageQuery.isEmptySearch()){
            return complaintDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer connectionId = pageQuery.getSearchParamAsInteger("connection");
        Integer complainttypeId = pageQuery.getSearchParamAsInteger("complainttype");
        Integer complaintstatusId = pageQuery.getSearchParamAsInteger("complaintstatus");

        List<Complaint> complaints = complaintDao.findAll(DEFAULT_SORT);
        Stream<Complaint> stream = complaints.parallelStream();

        List<Complaint> filteredComplaints = stream.filter(complaint -> {
            if(code!=null)
                if(!complaint.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(connectionId!=null)
                if(!complaint.getConnection().getId().equals(connectionId)) return false;
            if(complainttypeId!=null)
                if(!complaint.getComplainttype().getId().equals(complainttypeId)) return false;
            if(complaintstatusId!=null)
                if(!complaint.getComplaintstatus().getId().equals(complaintstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredComplaints, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Complaint> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all complaints' basic data", UsecaseList.SHOW_ALL_COMPLAINTS, UsecaseList.ADD_TASKALLOCATION, UsecaseList.UPDATE_TASKALLOCATION);
        return complaintDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Complaint get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get complaint", UsecaseList.SHOW_COMPLAINT_DETAILS);
        Optional<Complaint> optionalComplaint = complaintDao.findById(id);
        if(optionalComplaint.isEmpty()) throw new ObjectNotFoundException("Complaint not found");
        return optionalComplaint.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete complaints", UsecaseList.DELETE_COMPLAINT);

        try{
            if(complaintDao.existsById(id)) complaintDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this complaint already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Complaint complaint, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new complaint", UsecaseList.ADD_COMPLAINT);

        complaint.setTocreation(LocalDateTime.now());
        complaint.setCreator(authUser);
        complaint.setId(null);
        complaint.setComplaintstatus(new Complaintstatus(1));;
        complaint.setDate(LocalDate.now());


        EntityValidator.validate(complaint);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(complaint.getContact() != null){
            Complaint complaintByContact = complaintDao.findByContact(complaint.getContact());
            if(complaintByContact!=null) errorBag.add("contact","contact already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            complaint.setCode(codeGenerator.getNextId(codeConfig));
            return complaintDao.save(complaint);
        });


        List<Employee> employees = employeeDao.findAll();
        ArrayList<Employee> employeeList = new ArrayList<>();
        employees.forEach(employee -> {
            if (employee.getDesignation().getId().equals(1)){
                employeeList.add(employee);
            }
        });
        employeeList.forEach(employee -> {
            Notification notification = new Notification();
            notification.setId(UUID.randomUUID().toString());
            notification.setDosend(LocalDateTime.now());

            notification.setUser(userDao.findByEmployee(employee));
            notification.setMessage("New complaint request is waiting");
            notificationDao.save(notification);
        });

        return new ResourceLink(complaint.getId(), "/complaints/"+complaint.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Complaint complaint, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update complaint details", UsecaseList.UPDATE_COMPLAINT);

        Optional<Complaint> optionalComplaint = complaintDao.findById(id);
        if(optionalComplaint.isEmpty()) throw new ObjectNotFoundException("Complaint not found");
        Complaint oldComplaint = optionalComplaint.get();

        complaint.setId(id);
        complaint.setCode(oldComplaint.getCode());
        complaint.setCreator(oldComplaint.getCreator());
        complaint.setTocreation(oldComplaint.getTocreation());


        EntityValidator.validate(complaint);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(complaint.getContact() != null){
            Complaint complaintByContact = complaintDao.findByContact(complaint.getContact());
            if(complaintByContact!=null)
                if(!complaintByContact.getId().equals(id))
                    errorBag.add("contact","contact already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        complaint = complaintDao.save(complaint);
        return new ResourceLink(complaint.getId(), "/complaints/"+complaint.getId());
    }


    @GetMapping("/getAllPendingComplains")
    public Page<Complaint> getAllPendingComplains(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all complaints' basic data", UsecaseList.SHOW_ALL_COMPLAINTS);
        return complaintDao.getAllPendingComplains(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }


}