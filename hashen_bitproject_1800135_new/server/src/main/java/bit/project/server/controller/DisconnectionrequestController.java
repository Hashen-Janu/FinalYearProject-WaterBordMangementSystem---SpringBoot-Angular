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
import javassist.expr.NewArray;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotNull;

import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.dao.DisconnectionrequestDao;
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
@RequestMapping("/disconnectionrequests")
public class DisconnectionrequestController{

    @Autowired
    private DisconnectionrequestDao disconnectionrequestDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    @Autowired
    UserDao userDao;

    @Autowired
    EmployeeDao employeeDao;


    @Autowired
    private NotificationDao notificationDao;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public DisconnectionrequestController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("disconnectionrequest");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("DR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Disconnectionrequest> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all disconnectionrequests", UsecaseList.SHOW_ALL_DISCONNECTIONREQUESTS);

        if(pageQuery.isEmptySearch()){
            return disconnectionrequestDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer connectionId = pageQuery.getSearchParamAsInteger("connection");

        List<Disconnectionrequest> disconnectionrequests = disconnectionrequestDao.findAll(DEFAULT_SORT);
        Stream<Disconnectionrequest> stream = disconnectionrequests.parallelStream();

        List<Disconnectionrequest> filteredDisconnectionrequests = stream.filter(disconnectionrequest -> {
            if(code!=null)
                if(!disconnectionrequest.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(connectionId!=null)
                if(!disconnectionrequest.getConnection().getId().equals(connectionId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredDisconnectionrequests, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Disconnectionrequest> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all disconnectionrequests' basic data", UsecaseList.SHOW_ALL_DISCONNECTIONREQUESTS, UsecaseList.ADD_TASKALLOCATION, UsecaseList.UPDATE_TASKALLOCATION);
        return disconnectionrequestDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Disconnectionrequest get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get disconnectionrequest", UsecaseList.SHOW_DISCONNECTIONREQUEST_DETAILS);
        Optional<Disconnectionrequest> optionalDisconnectionrequest = disconnectionrequestDao.findById(id);
        if(optionalDisconnectionrequest.isEmpty()) throw new ObjectNotFoundException("Disconnectionrequest not found");
        return optionalDisconnectionrequest.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete disconnectionrequests", UsecaseList.DELETE_DISCONNECTIONREQUEST);

        try{
            if(disconnectionrequestDao.existsById(id)) disconnectionrequestDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this disconnectionrequest already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Disconnectionrequest disconnectionrequest, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new disconnectionrequest", UsecaseList.ADD_DISCONNECTIONREQUEST);

        disconnectionrequest.setTocreation(LocalDateTime.now());
        disconnectionrequest.setCreator(authUser);
        disconnectionrequest.setId(null);
        disconnectionrequest.setDisconnectionrequeststatus(new Disconnectionrequeststatus(1));;


        EntityValidator.validate(disconnectionrequest);



        PersistHelper.save(()->{
            disconnectionrequest.setCode(codeGenerator.getNextId(codeConfig));
            return disconnectionrequestDao.save(disconnectionrequest);

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
            notification.setMessage("New disconnection request is waiting");
            notificationDao.save(notification);
        });




        return new ResourceLink(disconnectionrequest.getId(), "/disconnectionrequests/"+disconnectionrequest.getId());


    }


    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Disconnectionrequest disconnectionrequest, HttpServletRequest request) {
        User authUser = accessControlManager.authorize(request, "No privilege to update disconnectionrequest details", UsecaseList.UPDATE_DISCONNECTIONREQUEST);

        Optional<Disconnectionrequest> optionalDisconnectionrequest = disconnectionrequestDao.findById(id);
        if(optionalDisconnectionrequest.isEmpty()) throw new ObjectNotFoundException("Disconnectionrequest not found");
        Disconnectionrequest oldDisconnectionrequest = optionalDisconnectionrequest.get();

        disconnectionrequest.setId(id);
        disconnectionrequest.setCode(oldDisconnectionrequest.getCode());
        disconnectionrequest.setCreator(oldDisconnectionrequest.getCreator());
        disconnectionrequest.setTocreation(oldDisconnectionrequest.getTocreation());

        EntityValidator.validate(disconnectionrequest);

        if (disconnectionrequest.getDisconnectionrequeststatus().getId().equals(2)){

            Notification notification = new Notification();
            notification.setId(UUID.randomUUID().toString());
            notification.setDosend(LocalDateTime.now());
            notification.setUser(authUser);
            notification.setMessage("Successfully Updated");
            notificationDao.save(notification);;

        }

        disconnectionrequest = disconnectionrequestDao.save(disconnectionrequest);
        return new ResourceLink(disconnectionrequest.getId(), "/disconnectionrequests/"+disconnectionrequest.getId());


    }


    @GetMapping("/getAllPendingDisconnectionrequest")
    public Page<Disconnectionrequest> getAllPendingDisconnectionrequest(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all disconnectionrequests' basic data", UsecaseList.SHOW_ALL_DISCONNECTIONREQUESTS);
        return disconnectionrequestDao.getAllPendingDisconnectionrequest(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }


//    User x = userDao.findByUsername("EM210001");
//
//    Notification notification = new Notification();
//            notification.setId(UUID.randomUUID().toString());
//            notification.setDosend(LocalDateTime.now());
//
//            notification.setUser(x);
//            notification.setMessage("Successfully Updated");
//            notificationDao.save(notification);



}