package bit.project.server.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.FileDao;
import bit.project.server.entity.*;
import bit.project.server.util.helper.FileHelper;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import bit.project.server.dao.ConnectionrequestDao;
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
@RequestMapping("/connectionrequests")
public class ConnectionrequestController{

    @Autowired
    private ConnectionrequestDao connectionrequestDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    @Autowired
    FileDao fileDao;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ConnectionrequestController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("connectionrequest");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("CR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Connectionrequest> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all connectionrequests", UsecaseList.SHOW_ALL_CONNECTIONREQUESTS);

        if(pageQuery.isEmptySearch()){
            return connectionrequestDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer consumerId = pageQuery.getSearchParamAsInteger("consumer");
        String street = pageQuery.getSearchParam("street");
        Integer gramaniladharidivId = pageQuery.getSearchParamAsInteger("gramaniladharidiv");
        Integer placetypeId = pageQuery.getSearchParamAsInteger("placetype");

        List<Connectionrequest> connectionrequests = connectionrequestDao.findAll(DEFAULT_SORT);
        Stream<Connectionrequest> stream = connectionrequests.parallelStream();

        List<Connectionrequest> filteredConnectionrequests = stream.filter(connectionrequest -> {
            if(code!=null)
                if(!connectionrequest.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(consumerId!=null)
                if(!connectionrequest.getConsumer().getId().equals(consumerId)) return false;
            if(street!=null)
                if(!connectionrequest.getStreet().toLowerCase().contains(street.toLowerCase())) return false;
            if(gramaniladharidivId!=null)
                if(!connectionrequest.getGramaniladharidiv().getId().equals(gramaniladharidivId)) return false;
            if(placetypeId!=null)
                if(!connectionrequest.getPlacetype().getId().equals(placetypeId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredConnectionrequests, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Connectionrequest> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all connectionrequests' basic data", UsecaseList.SHOW_ALL_CONNECTIONREQUESTS, UsecaseList.ADD_TASKALLOCATION, UsecaseList.UPDATE_TASKALLOCATION);
        return connectionrequestDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Connectionrequest get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get connectionrequest", UsecaseList.SHOW_CONNECTIONREQUEST_DETAILS);
        Optional<Connectionrequest> optionalConnectionrequest = connectionrequestDao.findById(id);
        if(optionalConnectionrequest.isEmpty()) throw new ObjectNotFoundException("Connectionrequest not found");
        return optionalConnectionrequest.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete connectionrequests", UsecaseList.DELETE_CONNECTIONREQUEST);

        try{
            if(connectionrequestDao.existsById(id)) connectionrequestDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this connectionrequest already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Connectionrequest connectionrequest, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new connectionrequest", UsecaseList.ADD_CONNECTIONREQUEST);

        connectionrequest.setTocreation(LocalDateTime.now());
        connectionrequest.setCreator(authUser);
        connectionrequest.setId(null);

        //        stats set kralama yawanwa
        connectionrequest.setConnectionrequeststatus(new Connectionrequeststatus(1));;

        for(Connectionrequestitem connectionrequestitem : connectionrequest.getConnectionrequestitemList()) connectionrequestitem.setConnectionrequest(connectionrequest);

        if (connectionrequest.getPayslip() != null) fileDao.updateIsusedById(connectionrequest.getPayslip(), true);

        EntityValidator.validate(connectionrequest);

        ValidationErrorBag errorBag = new ValidationErrorBag();

//        if(connectionrequest.getMobile() != null){
//            Connectionrequest connectionrequestByMobile = connectionrequestDao.findByMobile(connectionrequest.getMobile());
//            if(connectionrequestByMobile!=null) errorBag.add("mobile","mobile already exists");
//        }
//
//        if(connectionrequest.getLand() != null){
//            Connectionrequest connectionrequestByLand = connectionrequestDao.findByLand(connectionrequest.getLand());
//            if(connectionrequestByLand!=null) errorBag.add("land","land already exists");
//        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            connectionrequest.setCode(codeGenerator.getNextId(codeConfig));
            return connectionrequestDao.save(connectionrequest);
        });

        return new ResourceLink(connectionrequest.getId(), "/connectionrequests/"+connectionrequest.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Connectionrequest connectionrequest, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update connectionrequest details", UsecaseList.UPDATE_CONNECTIONREQUEST);

        Optional<Connectionrequest> optionalConnectionrequest = connectionrequestDao.findById(id);
        if(optionalConnectionrequest.isEmpty()) throw new ObjectNotFoundException("Connectionrequest not found");
        Connectionrequest oldConnectionrequest = optionalConnectionrequest.get();

        connectionrequest.setId(id);
        connectionrequest.setCode(oldConnectionrequest.getCode());
        connectionrequest.setCreator(oldConnectionrequest.getCreator());
        connectionrequest.setTocreation(oldConnectionrequest.getTocreation());

        for(Connectionrequestitem connectionrequestitem : connectionrequest.getConnectionrequestitemList()) connectionrequestitem.setConnectionrequest(connectionrequest);

        String oldPayslip = oldConnectionrequest.getPayslip();
        String newPayslip = connectionrequest.getPayslip();
        if (oldPayslip != newPayslip){
            fileDao.updateIsusedById(oldPayslip, false);
            fileDao.updateIsusedById(newPayslip, true);
        }
        EntityValidator.validate(connectionrequest);

        ValidationErrorBag errorBag = new ValidationErrorBag();

//        if(connectionrequest.getMobile() != null){
//            Connectionrequest connectionrequestByMobile = connectionrequestDao.findByMobile(connectionrequest.getMobile());
//            if(connectionrequestByMobile!=null)
//                if(!connectionrequestByMobile.getId().equals(id))
//                    errorBag.add("mobile","mobile already exists");
//        }
//
//        if(connectionrequest.getLand() != null){
//            Connectionrequest connectionrequestByLand = connectionrequestDao.findByLand(connectionrequest.getLand());
//            if(connectionrequestByLand!=null)
//                if(!connectionrequestByLand.getId().equals(id))
//                    errorBag.add("land","land already exists");
//        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        connectionrequest = connectionrequestDao.save(connectionrequest);
        return new ResourceLink(connectionrequest.getId(), "/connectionrequests/"+connectionrequest.getId());
    }
    @GetMapping("/{id}/payslip")
    public HashMap getPhoto(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get employee photo", UsecaseList.SHOW_ALL_CONNECTIONREQUESTS);

        Optional<Connectionrequest> optionalConnectionrequest = connectionrequestDao.findById(id);
        if(optionalConnectionrequest.isEmpty()) throw new ObjectNotFoundException("connection Request not found");
        Connectionrequest connectionrequest = optionalConnectionrequest.get();

        Optional<File> optionalFile = fileDao.findFileById(connectionrequest.getPayslip());

        if(optionalFile.isEmpty()) {
            throw new ObjectNotFoundException("Photo not found");
        }

        File photo = optionalFile.get();
        HashMap<String, String> data = new HashMap<>();

        data.put("file", FileHelper.byteArrayToBase64(photo.getFile(), photo.getFilemimetype()));

        return data;
    }


    @GetMapping("/get_connectionrequests/{id}")
    public Connectionrequest getAllHolder(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to all holders", UsecaseList.SHOW_ALL_CONNECTIONREQUESTS);
        Connectionrequest connectionrequests = connectionrequestDao.findAllConReqByConsumer_Id(id);
        return connectionrequests;
    }

    @GetMapping("/getalldonerequests")
    public Page<Connectionrequest> getAllDoneRequests(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all connectionrequests' basic data", UsecaseList.SHOW_ALL_CONNECTIONREQUESTS);
        return connectionrequestDao.getAllDoneRequests(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

}