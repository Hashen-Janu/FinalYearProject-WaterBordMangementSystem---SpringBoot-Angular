package bit.project.server.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Iorder;
import bit.project.server.dao.IorderDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import bit.project.server.entity.Orderitem;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.entity.Iorderstatus;
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
@RequestMapping("/iorders")
public class IorderController{

    @Autowired
    private IorderDao iorderDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public IorderController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("iorder");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("IO");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Iorder> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all iorders", UsecaseList.SHOW_ALL_IORDERS);

        if(pageQuery.isEmptySearch()){
            return iorderDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer iorderstatusId = pageQuery.getSearchParamAsInteger("iorderstatus");

        List<Iorder> iorders = iorderDao.findAll(DEFAULT_SORT);
        Stream<Iorder> stream = iorders.parallelStream();

        List<Iorder> filteredIorders = stream.filter(iorder -> {
            if(code!=null)
                if(!iorder.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(iorderstatusId!=null)
                if(!iorder.getIorderstatus().getId().equals(iorderstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredIorders, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Iorder> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all iorders' basic data", UsecaseList.SHOW_ALL_IORDERS, UsecaseList.ADD_ITEMRECIVE, UsecaseList.UPDATE_ITEMRECIVE);
        return iorderDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Iorder get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get iorder", UsecaseList.SHOW_IORDER_DETAILS);
        Optional<Iorder> optionalIorder = iorderDao.findById(id);
        if(optionalIorder.isEmpty()) throw new ObjectNotFoundException("Iorder not found");
        return optionalIorder.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete iorders", UsecaseList.DELETE_IORDER);

        try{
            if(iorderDao.existsById(id)) iorderDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this iorder already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Iorder iorder, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new iorder", UsecaseList.ADD_IORDER);

        iorder.setTocreation(LocalDateTime.now());
        iorder.setCreator(authUser);
        iorder.setId(null);
        iorder.setIorderstatus(new Iorderstatus(1));;
        iorder.setDoordered(LocalDate.now());

        for(Orderitem orderitem : iorder.getOrderitemList()) orderitem.setIorder(iorder);

        EntityValidator.validate(iorder);

        PersistHelper.save(()->{
            iorder.setCode(codeGenerator.getNextId(codeConfig));
            return iorderDao.save(iorder);
        });

        return new ResourceLink(iorder.getId(), "/iorders/"+iorder.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Iorder iorder, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update iorder details", UsecaseList.UPDATE_IORDER);

        Optional<Iorder> optionalIorder = iorderDao.findById(id);
        if(optionalIorder.isEmpty()) throw new ObjectNotFoundException("Iorder not found");
        Iorder oldIorder = optionalIorder.get();

        iorder.setId(id);
        iorder.setCode(oldIorder.getCode());
        iorder.setCreator(oldIorder.getCreator());
        iorder.setTocreation(oldIorder.getTocreation());

        for(Orderitem orderitem : iorder.getOrderitemList()) orderitem.setIorder(iorder);

        EntityValidator.validate(iorder);

        iorder = iorderDao.save(iorder);
        return new ResourceLink(iorder.getId(), "/iorders/"+iorder.getId());
    }

}