package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.entity.Item;
import bit.project.server.dao.ItemDao;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
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
@RequestMapping("/items")
public class ItemController{

    @Autowired
    private ItemDao itemDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ItemController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("item");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("IT");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Item> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all items", UsecaseList.SHOW_ALL_ITEMS);

        if(pageQuery.isEmptySearch()){
            return itemDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String name = pageQuery.getSearchParam("name");

        List<Item> items = itemDao.findAll(DEFAULT_SORT);
        Stream<Item> stream = items.parallelStream();

        List<Item> filteredItems = stream.filter(item -> {
            if(code!=null)
                if(!item.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(name!=null)
                if(!item.getName().toLowerCase().contains(name.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredItems, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Item> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all items' basic data", UsecaseList.SHOW_ALL_ITEMS);
        return itemDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Item get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get item", UsecaseList.SHOW_ITEM_DETAILS);
        Optional<Item> optionalItem = itemDao.findById(id);
        if(optionalItem.isEmpty()) throw new ObjectNotFoundException("Item not found");
        return optionalItem.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete items", UsecaseList.DELETE_ITEM);

        try{
            if(itemDao.existsById(id)) itemDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this item already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Item item, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new item", UsecaseList.ADD_ITEM);

        item.setTocreation(LocalDateTime.now());
        item.setCreator(authUser);
        item.setId(null);


        EntityValidator.validate(item);

        PersistHelper.save(()->{
            item.setCode(codeGenerator.getNextId(codeConfig));
            return itemDao.save(item);
        });

        return new ResourceLink(item.getId(), "/items/"+item.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Item item, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update item details", UsecaseList.UPDATE_ITEM);

        Optional<Item> optionalItem = itemDao.findById(id);
        if(optionalItem.isEmpty()) throw new ObjectNotFoundException("Item not found");
        Item oldItem = optionalItem.get();

        item.setId(id);
        item.setCode(oldItem.getCode());
        item.setCreator(oldItem.getCreator());
        item.setTocreation(oldItem.getTocreation());


        EntityValidator.validate(item);

        item = itemDao.save(item);
        return new ResourceLink(item.getId(), "/items/"+item.getId());
    }

}