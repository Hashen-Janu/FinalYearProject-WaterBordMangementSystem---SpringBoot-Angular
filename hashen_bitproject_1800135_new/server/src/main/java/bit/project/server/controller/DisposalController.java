package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Disposal;
import bit.project.server.dao.DisposalDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.entity.Disposalitem;
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
@RequestMapping("/disposals")
public class DisposalController{

    @Autowired
    private DisposalDao disposalDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public DisposalController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("disposal");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("DS");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Disposal> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all disposals", UsecaseList.SHOW_ALL_DISPOSALS);

        if(pageQuery.isEmptySearch()){
            return disposalDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Disposal> disposals = disposalDao.findAll(DEFAULT_SORT);
        Stream<Disposal> stream = disposals.parallelStream();

        List<Disposal> filteredDisposals = stream.filter(disposal -> {
            if(code!=null)
                if(!disposal.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredDisposals, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Disposal> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all disposals' basic data", UsecaseList.SHOW_ALL_DISPOSALS);
        return disposalDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Disposal get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get disposal", UsecaseList.SHOW_DISPOSAL_DETAILS);
        Optional<Disposal> optionalDisposal = disposalDao.findById(id);
        if(optionalDisposal.isEmpty()) throw new ObjectNotFoundException("Disposal not found");
        return optionalDisposal.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete disposals", UsecaseList.DELETE_DISPOSAL);

        try{
            if(disposalDao.existsById(id)) disposalDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this disposal already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Disposal disposal, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new disposal", UsecaseList.ADD_DISPOSAL);

        disposal.setTocreation(LocalDateTime.now());
        disposal.setCreator(authUser);
        disposal.setId(null);

        for(Disposalitem disposalitem : disposal.getDisposalitemList()) disposalitem.setDisposal(disposal);

        EntityValidator.validate(disposal);

        PersistHelper.save(()->{
            disposal.setCode(codeGenerator.getNextId(codeConfig));
            return disposalDao.save(disposal);
        });

        return new ResourceLink(disposal.getId(), "/disposals/"+disposal.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Disposal disposal, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update disposal details", UsecaseList.UPDATE_DISPOSAL);

        Optional<Disposal> optionalDisposal = disposalDao.findById(id);
        if(optionalDisposal.isEmpty()) throw new ObjectNotFoundException("Disposal not found");
        Disposal oldDisposal = optionalDisposal.get();

        disposal.setId(id);
        disposal.setCode(oldDisposal.getCode());
        disposal.setCreator(oldDisposal.getCreator());
        disposal.setTocreation(oldDisposal.getTocreation());

        for(Disposalitem disposalitem : disposal.getDisposalitemList()) disposalitem.setDisposal(disposal);

        EntityValidator.validate(disposal);

        disposal = disposalDao.save(disposal);
        return new ResourceLink(disposal.getId(), "/disposals/"+disposal.getId());
    }

}