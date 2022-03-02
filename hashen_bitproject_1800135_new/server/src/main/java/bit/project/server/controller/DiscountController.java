package bit.project.server.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.Connection;
import bit.project.server.entity.Discount;
import bit.project.server.entity.User;
import bit.project.server.entity.Discount;
import bit.project.server.dao.DiscountDao;
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
@RequestMapping("/discounts")
public class DiscountController{

    @Autowired
    private DiscountDao discountDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public DiscountController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("discount");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("DC");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Discount> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all discounts", UsecaseList.SHOW_ALL_DISCOUNTS);

        if(pageQuery.isEmptySearch()){
            return discountDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String name = pageQuery.getSearchParam("name");

        List<Discount> discounts = discountDao.findAll(DEFAULT_SORT);
        Stream<Discount> stream = discounts.parallelStream();

        List<Discount> filteredDiscounts = stream.filter(discount -> {
            if(code!=null)
                if(!discount.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(name!=null)
                if(!discount.getName().toLowerCase().contains(name.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredDiscounts, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Discount> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all discounts' basic data", UsecaseList.SHOW_ALL_DISCOUNTS, UsecaseList.ADD_CONNECTIONREQUEST, UsecaseList.UPDATE_CONNECTIONREQUEST);
        return discountDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Discount get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get discount", UsecaseList.SHOW_DISCOUNT_DETAILS);
        Optional<Discount> optionalDiscount = discountDao.findById(id);
        if(optionalDiscount.isEmpty()) throw new ObjectNotFoundException("Discount not found");
        return optionalDiscount.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete discounts", UsecaseList.DELETE_DISCOUNT);

        try{
            if(discountDao.existsById(id)) discountDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this discount already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Discount discount, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new discount", UsecaseList.ADD_DISCOUNT);

        discount.setTocreation(LocalDateTime.now());
        discount.setCreator(authUser);
        discount.setId(null);


        EntityValidator.validate(discount);

        PersistHelper.save(()->{
            discount.setCode(codeGenerator.getNextId(codeConfig));
            return discountDao.save(discount);
        });

        return new ResourceLink(discount.getId(), "/discounts/"+discount.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Discount discount, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update discount details", UsecaseList.UPDATE_DISCOUNT);

        Optional<Discount> optionalDiscount = discountDao.findById(id);
        if(optionalDiscount.isEmpty()) throw new ObjectNotFoundException("Discount not found");
        Discount oldDiscount = optionalDiscount.get();

        discount.setId(id);
        discount.setCode(oldDiscount.getCode());
        discount.setCreator(oldDiscount.getCreator());
        discount.setTocreation(oldDiscount.getTocreation());


        EntityValidator.validate(discount);

        discount = discountDao.save(discount);
        return new ResourceLink(discount.getId(), "/discounts/"+discount.getId());
    }

}