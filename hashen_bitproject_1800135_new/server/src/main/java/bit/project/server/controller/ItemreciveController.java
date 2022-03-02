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
import bit.project.server.entity.Itemrecive;
import bit.project.server.dao.ItemreciveDao;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import bit.project.server.entity.Itemreciveitem;
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
@RequestMapping("/itemrecives")
public class ItemreciveController{

    @Autowired
    private ItemreciveDao itemreciveDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ItemreciveController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("itemrecive");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("IT");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Itemrecive> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all itemrecives", UsecaseList.SHOW_ALL_ITEMRECIVES);

        if(pageQuery.isEmptySearch()){
            return itemreciveDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer iorderId = pageQuery.getSearchParamAsInteger("iorder");

        List<Itemrecive> itemrecives = itemreciveDao.findAll(DEFAULT_SORT);
        Stream<Itemrecive> stream = itemrecives.parallelStream();

        List<Itemrecive> filteredItemrecives = stream.filter(itemrecive -> {
            if(code!=null)
                if(!itemrecive.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(iorderId!=null)
                if(!itemrecive.getIorder().getId().equals(iorderId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredItemrecives, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Itemrecive> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all itemrecives' basic data", UsecaseList.SHOW_ALL_ITEMRECIVES);
        return itemreciveDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Itemrecive get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get itemrecive", UsecaseList.SHOW_ITEMRECIVE_DETAILS);
        Optional<Itemrecive> optionalItemrecive = itemreciveDao.findById(id);
        if(optionalItemrecive.isEmpty()) throw new ObjectNotFoundException("Itemrecive not found");
        return optionalItemrecive.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete itemrecives", UsecaseList.DELETE_ITEMRECIVE);

        try{
            if(itemreciveDao.existsById(id)) itemreciveDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this itemrecive already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Itemrecive itemrecive, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new itemrecive", UsecaseList.ADD_ITEMRECIVE);

        itemrecive.setTocreation(LocalDateTime.now());
        itemrecive.setCreator(authUser);
        itemrecive.setId(null);

        for(Itemreciveitem itemreciveitem : itemrecive.getItemreciveitemList()) itemreciveitem.setItemrecive(itemrecive);

        EntityValidator.validate(itemrecive);

        PersistHelper.save(()->{
            itemrecive.setCode(codeGenerator.getNextId(codeConfig));
            return itemreciveDao.save(itemrecive);
        });

        return new ResourceLink(itemrecive.getId(), "/itemrecives/"+itemrecive.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Itemrecive itemrecive, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update itemrecive details", UsecaseList.UPDATE_ITEMRECIVE);

        Optional<Itemrecive> optionalItemrecive = itemreciveDao.findById(id);
        if(optionalItemrecive.isEmpty()) throw new ObjectNotFoundException("Itemrecive not found");
        Itemrecive oldItemrecive = optionalItemrecive.get();

        itemrecive.setId(id);
        itemrecive.setCode(oldItemrecive.getCode());
        itemrecive.setCreator(oldItemrecive.getCreator());
        itemrecive.setTocreation(oldItemrecive.getTocreation());

        for(Itemreciveitem itemreciveitem : itemrecive.getItemreciveitemList()) itemreciveitem.setItemrecive(itemrecive);

        EntityValidator.validate(itemrecive);

        itemrecive = itemreciveDao.save(itemrecive);
        return new ResourceLink(itemrecive.getId(), "/itemrecives/"+itemrecive.getId());
    }

}