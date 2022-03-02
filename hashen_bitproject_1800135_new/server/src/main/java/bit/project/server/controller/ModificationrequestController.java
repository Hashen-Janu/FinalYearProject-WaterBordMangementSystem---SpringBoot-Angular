package bit.project.server.controller;

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
import bit.project.server.dao.ModificationrequestDao;
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
@RequestMapping("/modificationrequests")
public class ModificationrequestController{

    @Autowired
    private ModificationrequestDao modificationrequestDao;

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

    public ModificationrequestController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("modificationrequest");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("MR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Modificationrequest> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all modificationrequests", UsecaseList.SHOW_ALL_MODIFICATIONREQUESTS);

        if(pageQuery.isEmptySearch()){
            return modificationrequestDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer connectionId = pageQuery.getSearchParamAsInteger("connection");
        Integer modificationrequeststatusId = pageQuery.getSearchParamAsInteger("modificationrequeststatus");

        List<Modificationrequest> modificationrequests = modificationrequestDao.findAll(DEFAULT_SORT);
        Stream<Modificationrequest> stream = modificationrequests.parallelStream();

        List<Modificationrequest> filteredModificationrequests = stream.filter(modificationrequest -> {
            if(code!=null)
                if(!modificationrequest.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(connectionId!=null)
                if(!modificationrequest.getConnection().getId().equals(connectionId)) return false;
            if(modificationrequeststatusId!=null)
                if(!modificationrequest.getModificationrequeststatus().getId().equals(modificationrequeststatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredModificationrequests, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Modificationrequest> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all modificationrequests' basic data", UsecaseList.SHOW_ALL_MODIFICATIONREQUESTS, UsecaseList.ADD_TASKALLOCATION, UsecaseList.UPDATE_TASKALLOCATION);
        return modificationrequestDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Modificationrequest get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get modificationrequest", UsecaseList.SHOW_MODIFICATIONREQUEST_DETAILS);
        Optional<Modificationrequest> optionalModificationrequest = modificationrequestDao.findById(id);
        if(optionalModificationrequest.isEmpty()) throw new ObjectNotFoundException("Modificationrequest not found");
        return optionalModificationrequest.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete modificationrequests", UsecaseList.DELETE_MODIFICATIONREQUEST);

        try{
            if(modificationrequestDao.existsById(id)) modificationrequestDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this modificationrequest already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Modificationrequest modificationrequest, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new modificationrequest", UsecaseList.ADD_MODIFICATIONREQUEST);

        modificationrequest.setTocreation(LocalDateTime.now());
        modificationrequest.setCreator(authUser);
        modificationrequest.setId(null);
        modificationrequest.setModificationrequeststatus(new Modificationrequeststatus(1));;


        EntityValidator.validate(modificationrequest);

        PersistHelper.save(()->{
            modificationrequest.setCode(codeGenerator.getNextId(codeConfig));
            return modificationrequestDao.save(modificationrequest);
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
            notification.setMessage("New Modification request is waiting");
            notificationDao.save(notification);
        });

        return new ResourceLink(modificationrequest.getId(), "/modificationrequests/"+modificationrequest.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Modificationrequest modificationrequest, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update modificationrequest details", UsecaseList.UPDATE_MODIFICATIONREQUEST);

        Optional<Modificationrequest> optionalModificationrequest = modificationrequestDao.findById(id);
        if(optionalModificationrequest.isEmpty()) throw new ObjectNotFoundException("Modificationrequest not found");
        Modificationrequest oldModificationrequest = optionalModificationrequest.get();

        modificationrequest.setId(id);
        modificationrequest.setCode(oldModificationrequest.getCode());
        modificationrequest.setCreator(oldModificationrequest.getCreator());
        modificationrequest.setTocreation(oldModificationrequest.getTocreation());


        EntityValidator.validate(modificationrequest);

        modificationrequest = modificationrequestDao.save(modificationrequest);
        return new ResourceLink(modificationrequest.getId(), "/modificationrequests/"+modificationrequest.getId());
    }

    @GetMapping("/getAllPendingModificationrequest")
    public Page<Modificationrequest> getAllPendingModificationrequest(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all complaints' basic data", UsecaseList.SHOW_ALL_MODIFICATIONREQUESTS);
        return modificationrequestDao.getAllPendingModificationrequest(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

}