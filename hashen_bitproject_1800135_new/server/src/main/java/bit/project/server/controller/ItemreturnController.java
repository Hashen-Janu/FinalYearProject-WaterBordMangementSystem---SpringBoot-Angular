package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import bit.project.server.entity.Itemreturn;
import bit.project.server.dao.ItemreturnDao;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import bit.project.server.entity.Itemreturnitem;
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
@RequestMapping("/itemreturns")
public class ItemreturnController{

    @Autowired
    private ItemreturnDao itemreturnDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ItemreturnController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("itemreturn");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("IR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Itemreturn> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all itemreturns", UsecaseList.SHOW_ALL_ITEMRETURNS);

        if(pageQuery.isEmptySearch()){
            return itemreturnDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Itemreturn> itemreturns = itemreturnDao.findAll(DEFAULT_SORT);
        Stream<Itemreturn> stream = itemreturns.parallelStream();

        List<Itemreturn> filteredItemreturns = stream.filter(itemreturn -> {
            if(code!=null)
                if(!itemreturn.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredItemreturns, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Itemreturn> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all itemreturns' basic data", UsecaseList.SHOW_ALL_ITEMRETURNS);
        return itemreturnDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Itemreturn get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get itemreturn", UsecaseList.SHOW_ITEMRETURN_DETAILS);
        Optional<Itemreturn> optionalItemreturn = itemreturnDao.findById(id);
        if(optionalItemreturn.isEmpty()) throw new ObjectNotFoundException("Itemreturn not found");
        return optionalItemreturn.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete itemreturns", UsecaseList.DELETE_ITEMRETURN);

        try{
            if(itemreturnDao.existsById(id)) itemreturnDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this itemreturn already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Itemreturn itemreturn, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new itemreturn", UsecaseList.ADD_ITEMRETURN);

        itemreturn.setTocreation(LocalDateTime.now());
        itemreturn.setCreator(authUser);
        itemreturn.setId(null);

        for(Itemreturnitem itemreturnitem : itemreturn.getItemreturnitemList()) itemreturnitem.setItemreturn(itemreturn);

        EntityValidator.validate(itemreturn);

        PersistHelper.save(()->{
            itemreturn.setCode(codeGenerator.getNextId(codeConfig));
            return itemreturnDao.save(itemreturn);
        });

        return new ResourceLink(itemreturn.getId(), "/itemreturns/"+itemreturn.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Itemreturn itemreturn, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update itemreturn details", UsecaseList.UPDATE_ITEMRETURN);

        Optional<Itemreturn> optionalItemreturn = itemreturnDao.findById(id);
        if(optionalItemreturn.isEmpty()) throw new ObjectNotFoundException("Itemreturn not found");
        Itemreturn oldItemreturn = optionalItemreturn.get();

        itemreturn.setId(id);
        itemreturn.setCode(oldItemreturn.getCode());
        itemreturn.setCreator(oldItemreturn.getCreator());
        itemreturn.setTocreation(oldItemreturn.getTocreation());

        for(Itemreturnitem itemreturnitem : itemreturn.getItemreturnitemList()) itemreturnitem.setItemreturn(itemreturn);

        EntityValidator.validate(itemreturn);

        itemreturn = itemreturnDao.save(itemreturn);
        return new ResourceLink(itemreturn.getId(), "/itemreturns/"+itemreturn.getId());
    }

}