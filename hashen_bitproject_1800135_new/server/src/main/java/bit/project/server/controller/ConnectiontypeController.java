package bit.project.server.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.Connection;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.entity.Connectiontype;
import bit.project.server.dao.ConnectiontypeDao;
import bit.project.server.util.dto.ResourceLink;
import bit.project.server.entity.Connectionitem;
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
@RequestMapping("/connectiontypes")
public class ConnectiontypeController{

    @Autowired
    private ConnectiontypeDao connectiontypeDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ConnectiontypeController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("connectiontype");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("CT");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Connectiontype> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all connectiontypes", UsecaseList.SHOW_ALL_CONNECTIONTYPES);

        if(pageQuery.isEmptySearch()){
            return connectiontypeDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Connectiontype> connectiontypes = connectiontypeDao.findAll(DEFAULT_SORT);
        Stream<Connectiontype> stream = connectiontypes.parallelStream();

        List<Connectiontype> filteredConnectiontypes = stream.filter(connectiontype -> {
            if(code!=null)
                if(!connectiontype.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredConnectiontypes, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Connectiontype> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all connectiontypes' basic data", UsecaseList.SHOW_ALL_CONNECTIONTYPES, UsecaseList.ADD_CONNECTIONREQUEST, UsecaseList.UPDATE_CONNECTIONREQUEST, UsecaseList.ADD_DISCOUNT, UsecaseList.UPDATE_DISCOUNT);
        return connectiontypeDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Connectiontype get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get connectiontype", UsecaseList.SHOW_CONNECTIONTYPE_DETAILS);
        Optional<Connectiontype> optionalConnectiontype = connectiontypeDao.findById(id);
        if(optionalConnectiontype.isEmpty()) throw new ObjectNotFoundException("Connectiontype not found");
        return optionalConnectiontype.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete connectiontypes", UsecaseList.DELETE_CONNECTIONTYPE);

        try{
            if(connectiontypeDao.existsById(id)) connectiontypeDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this connectiontype already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Connectiontype connectiontype, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new connectiontype", UsecaseList.ADD_CONNECTIONTYPE);

        connectiontype.setTocreation(LocalDateTime.now());
        connectiontype.setCreator(authUser);
        connectiontype.setId(null);

        for(Connectionitem connectionitem : connectiontype.getConnectionitemList()) connectionitem.setConnectiontype(connectiontype);

        EntityValidator.validate(connectiontype);

        PersistHelper.save(()->{
            connectiontype.setCode(codeGenerator.getNextId(codeConfig));
            return connectiontypeDao.save(connectiontype);
        });

        return new ResourceLink(connectiontype.getId(), "/connectiontypes/"+connectiontype.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Connectiontype connectiontype, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update connectiontype details", UsecaseList.UPDATE_CONNECTIONTYPE);

        Optional<Connectiontype> optionalConnectiontype = connectiontypeDao.findById(id);
        if(optionalConnectiontype.isEmpty()) throw new ObjectNotFoundException("Connectiontype not found");
        Connectiontype oldConnectiontype = optionalConnectiontype.get();

        connectiontype.setId(id);
        connectiontype.setCode(oldConnectiontype.getCode());
        connectiontype.setCreator(oldConnectiontype.getCreator());
        connectiontype.setTocreation(oldConnectiontype.getTocreation());

        for(Connectionitem connectionitem : connectiontype.getConnectionitemList()) connectionitem.setConnectiontype(connectiontype);

        EntityValidator.validate(connectiontype);

        connectiontype = connectiontypeDao.save(connectiontype);
        return new ResourceLink(connectiontype.getId(), "/connectiontypes/"+connectiontype.getId());
    }


}