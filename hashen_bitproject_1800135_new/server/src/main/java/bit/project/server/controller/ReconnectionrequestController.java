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
import bit.project.server.dao.ReconnectionrequestDao;
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
@RequestMapping("/reconnectionrequests")
public class ReconnectionrequestController{

    @Autowired
    private ReconnectionrequestDao reconnectionrequestDao;

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

    public ReconnectionrequestController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("reconnectionrequest");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("RR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Reconnectionrequest> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all reconnectionrequests", UsecaseList.SHOW_ALL_RECONNECTIONREQUESTS);

        if(pageQuery.isEmptySearch()){
            return reconnectionrequestDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer connectionId = pageQuery.getSearchParamAsInteger("connection");
        Integer reconnectionrequeststatusId = pageQuery.getSearchParamAsInteger("reconnectionrequeststatus");

        List<Reconnectionrequest> reconnectionrequests = reconnectionrequestDao.findAll(DEFAULT_SORT);
        Stream<Reconnectionrequest> stream = reconnectionrequests.parallelStream();

        List<Reconnectionrequest> filteredReconnectionrequests = stream.filter(reconnectionrequest -> {
            if(code!=null)
                if(!reconnectionrequest.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(connectionId!=null)
                if(!reconnectionrequest.getConnection().getId().equals(connectionId)) return false;
            if(reconnectionrequeststatusId!=null)
                if(!reconnectionrequest.getReconnectionrequeststatus().getId().equals(reconnectionrequeststatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredReconnectionrequests, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Reconnectionrequest> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all reconnectionrequests' basic data", UsecaseList.SHOW_ALL_RECONNECTIONREQUESTS, UsecaseList.ADD_TASKALLOCATION, UsecaseList.UPDATE_TASKALLOCATION);
        return reconnectionrequestDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Reconnectionrequest get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get reconnectionrequest", UsecaseList.SHOW_RECONNECTIONREQUEST_DETAILS);
        Optional<Reconnectionrequest> optionalReconnectionrequest = reconnectionrequestDao.findById(id);
        if(optionalReconnectionrequest.isEmpty()) throw new ObjectNotFoundException("Reconnectionrequest not found");
        return optionalReconnectionrequest.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete reconnectionrequests", UsecaseList.DELETE_RECONNECTIONREQUEST);

        try{
            if(reconnectionrequestDao.existsById(id)) reconnectionrequestDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this reconnectionrequest already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Reconnectionrequest reconnectionrequest, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new reconnectionrequest", UsecaseList.ADD_RECONNECTIONREQUEST);

        reconnectionrequest.setTocreation(LocalDateTime.now());
        reconnectionrequest.setCreator(authUser);
        reconnectionrequest.setId(null);
        reconnectionrequest.setReconnectionrequeststatus(new Reconnectionrequeststatus(1));;


        EntityValidator.validate(reconnectionrequest);

        PersistHelper.save(()->{
            reconnectionrequest.setCode(codeGenerator.getNextId(codeConfig));
            return reconnectionrequestDao.save(reconnectionrequest);
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
            notification.setMessage("New Reconnection  request is waiting");
            notificationDao.save(notification);
        });

        return new ResourceLink(reconnectionrequest.getId(), "/reconnectionrequests/"+reconnectionrequest.getId());
    }
    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Reconnectionrequest reconnectionrequest, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update reconnectionrequest details", UsecaseList.UPDATE_RECONNECTIONREQUEST);

        Optional<Reconnectionrequest> optionalReconnectionrequest = reconnectionrequestDao.findById(id);
        if(optionalReconnectionrequest.isEmpty()) throw new ObjectNotFoundException("Reconnectionrequest not found");
        Reconnectionrequest oldReconnectionrequest = optionalReconnectionrequest.get();

        reconnectionrequest.setId(id);
        reconnectionrequest.setCode(oldReconnectionrequest.getCode());
        reconnectionrequest.setCreator(oldReconnectionrequest.getCreator());
        reconnectionrequest.setTocreation(oldReconnectionrequest.getTocreation());


        EntityValidator.validate(reconnectionrequest);

        reconnectionrequest = reconnectionrequestDao.save(reconnectionrequest);
        return new ResourceLink(reconnectionrequest.getId(), "/reconnectionrequests/"+reconnectionrequest.getId());
    }


    @GetMapping("/getAllPendingReconnectionrequest")
    public Page<Reconnectionrequest> getAllPendingReconnectionrequest(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all reconnectionrequests' basic data", UsecaseList.SHOW_ALL_RECONNECTIONREQUESTS);
        return reconnectionrequestDao.getAllPendingReconnectionrequest(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }
//hashen
    //nadira gamage jjgshhgsjhjhjhndh inadihrhaxhnadira jjjjjjjjjjjnnnnnnnnnn nadira

}