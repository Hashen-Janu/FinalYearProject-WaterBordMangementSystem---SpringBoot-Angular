package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.Taskallocationstatus;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.entity.Taskallocation;
import bit.project.server.dao.TaskallocationDao;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.entity.Taskallocationitem;
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
@RequestMapping("/taskallocations")
public class TaskallocationController{

    @Autowired
    private TaskallocationDao taskallocationDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public TaskallocationController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("taskallocation");
        codeConfig.setColumnName("code");
        codeConfig.setLength(9);
        codeConfig.setPrefix("TA");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Taskallocation> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all taskallocations", UsecaseList.SHOW_ALL_TASKALLOCATIONS);

        if(pageQuery.isEmptySearch()){
            return taskallocationDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer tasktypeId = pageQuery.getSearchParamAsInteger("tasktype");
        Integer gramaniladharidivId = pageQuery.getSearchParamAsInteger("gramaniladharidiv");

        List<Taskallocation> taskallocations = taskallocationDao.findAll(DEFAULT_SORT);
        Stream<Taskallocation> stream = taskallocations.parallelStream();

        List<Taskallocation> filteredTaskallocations = stream.filter(taskallocation -> {
            if(code!=null)
                if(!taskallocation.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(tasktypeId!=null)
                if(!taskallocation.getTasktype().getId().equals(tasktypeId)) return false;
            if(gramaniladharidivId!=null)
                if(!taskallocation.getGramaniladharidiv().getId().equals(gramaniladharidivId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredTaskallocations, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Taskallocation> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all taskallocations' basic data", UsecaseList.SHOW_ALL_TASKALLOCATIONS);
        return taskallocationDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Taskallocation get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get taskallocation", UsecaseList.SHOW_TASKALLOCATION_DETAILS);
        Optional<Taskallocation> optionalTaskallocation = taskallocationDao.findById(id);
        if(optionalTaskallocation.isEmpty()) throw new ObjectNotFoundException("Taskallocation not found");
        return optionalTaskallocation.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete taskallocations", UsecaseList.DELETE_TASKALLOCATION);

        try{
            if(taskallocationDao.existsById(id)) taskallocationDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this taskallocation already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Taskallocation taskallocation, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new taskallocation", UsecaseList.ADD_TASKALLOCATION);

        taskallocation.setTocreation(LocalDateTime.now());
        taskallocation.setCreator(authUser);
        taskallocation.setId(null);
        taskallocation.setTaskallocationstatus(new Taskallocationstatus(1));

        if (taskallocation.getTaskallocationitemList() != null){
            for(Taskallocationitem taskallocationitem : taskallocation.getTaskallocationitemList()) taskallocationitem.setTaskallocation(taskallocation);
        }

        EntityValidator.validate(taskallocation);

        PersistHelper.save(()->{
            taskallocation.setCode(codeGenerator.getNextId(codeConfig));
            return taskallocationDao.save(taskallocation);
        });

        return new ResourceLink(taskallocation.getId(), "/taskallocations/"+taskallocation.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Taskallocation taskallocation, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update taskallocation details", UsecaseList.UPDATE_TASKALLOCATION);

        Optional<Taskallocation> optionalTaskallocation = taskallocationDao.findById(id);
        if(optionalTaskallocation.isEmpty()) throw new ObjectNotFoundException("Taskallocation not found");
        Taskallocation oldTaskallocation = optionalTaskallocation.get();

        taskallocation.setId(id);
        taskallocation.setCode(oldTaskallocation.getCode());
        taskallocation.setCreator(oldTaskallocation.getCreator());
        taskallocation.setTocreation(oldTaskallocation.getTocreation());

        for(Taskallocationitem taskallocationitem : taskallocation.getTaskallocationitemList()) taskallocationitem.setTaskallocation(taskallocation);

        EntityValidator.validate(taskallocation);

        taskallocation = taskallocationDao.save(taskallocation);
        return new ResourceLink(taskallocation.getId(), "/taskallocations/"+taskallocation.getId());
    }


    //lakshan

    @GetMapping("done/{id}")
    public Taskallocation done(@PathVariable Integer id, HttpServletRequest request) {
        System.out.println("td");
        accessControlManager.authorize(request, "No privilege to get taskallocation", UsecaseList.SHOW_TASKALLOCATION_DETAILS);
        taskallocationDao.setStatus(id);
        return null;
    }

}
