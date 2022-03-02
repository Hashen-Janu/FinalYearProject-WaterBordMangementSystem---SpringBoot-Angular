package bit.project.server.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.FileDao;
import bit.project.server.entity.File;
import bit.project.server.entity.User;
import bit.project.server.entity.Consumer;
import bit.project.server.dao.ConsumerDao;
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
@RequestMapping("/consumers")
public class ConsumerController{

    @Autowired
    private ConsumerDao consumerDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private FileDao fileDao;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ConsumerController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("consumer");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("CM");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Consumer> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all consumers", UsecaseList.SHOW_ALL_CONSUMERS);

        if(pageQuery.isEmptySearch()){
            return consumerDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer consumertypeId = pageQuery.getSearchParamAsInteger("consumertype");
        String firstname = pageQuery.getSearchParam("firstname");
        String nic = pageQuery.getSearchParam("nic");

        List<Consumer> consumers = consumerDao.findAll(DEFAULT_SORT);
        Stream<Consumer> stream = consumers.parallelStream();

        List<Consumer> filteredConsumers = stream.filter(consumer -> {
            if(code!=null)
                if(!consumer.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(consumertypeId!=null)
                if(!consumer.getConsumertype().getId().equals(consumertypeId)) return false;
            if(firstname!=null)
                if(!consumer.getFirstname().toLowerCase().contains(firstname.toLowerCase())) return false;
            if(nic!=null)
                if(!consumer.getNic().toLowerCase().contains(nic.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredConsumers, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Consumer> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all consumers' basic data", UsecaseList.SHOW_ALL_CONSUMERS, UsecaseList.ADD_CONNECTION, UsecaseList.UPDATE_CONNECTION, UsecaseList.ADD_CONNECTIONREQUEST, UsecaseList.UPDATE_CONNECTIONREQUEST);
        return consumerDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Consumer get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get consumer", UsecaseList.SHOW_CONSUMER_DETAILS);
        Optional<Consumer> optionalConsumer = consumerDao.findById(id);
        if(optionalConsumer.isEmpty()) throw new ObjectNotFoundException("Consumer not found");
        return optionalConsumer.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete consumers", UsecaseList.DELETE_CONSUMER);

        try{
            if(consumerDao.existsById(id)) consumerDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this consumer already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Consumer consumer, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new consumer", UsecaseList.ADD_CONSUMER);

        consumer.setTocreation(LocalDateTime.now());
        consumer.setCreator(authUser);
        consumer.setId(null);
//        consumer.setDoregisterd(LocalDate.now());

        if (consumer.getLanddeedphoto() != null) fileDao.updateIsusedById(consumer.getLanddeedphoto(), true);
        if (consumer.getGrcphoto() != null) fileDao.updateIsusedById(consumer.getGrcphoto(), true);
        EntityValidator.validate(consumer);

        PersistHelper.save(()->{
            consumer.setCode(codeGenerator.getNextId(codeConfig));
            return consumerDao.save(consumer);
        });

        return new ResourceLink(consumer.getId(), "/consumers/"+consumer.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Consumer consumer, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update consumer details", UsecaseList.UPDATE_CONSUMER);

        Optional<Consumer> optionalConsumer = consumerDao.findById(id);
        if(optionalConsumer.isEmpty()) throw new ObjectNotFoundException("Consumer not found");
        Consumer oldConsumer = optionalConsumer.get();

        consumer.setId(id);
        consumer.setCode(oldConsumer.getCode());
        consumer.setCreator(oldConsumer.getCreator());
        consumer.setTocreation(oldConsumer.getTocreation());


        String oldLanddeedphoto = oldConsumer.getLanddeedphoto();
        String newLanddeedphoto = consumer.getLanddeedphoto();
        if (oldLanddeedphoto != newLanddeedphoto){
            fileDao.updateIsusedById(oldLanddeedphoto, false);
            fileDao.updateIsusedById(newLanddeedphoto, true);
        }
        String oldGrcphoto = oldConsumer.getGrcphoto();
        String newGrcphoto = consumer.getGrcphoto();
        if (oldGrcphoto != newGrcphoto){
            fileDao.updateIsusedById(oldGrcphoto, false);
            fileDao.updateIsusedById(newGrcphoto, true);
        }
        EntityValidator.validate(consumer);

        consumer = consumerDao.save(consumer);
        return new ResourceLink(consumer.getId(), "/consumers/"+consumer.getId());
    }
    @GetMapping("/{id}/landdeedphoto")
    public HashMap getLanddeedphoto(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get landdeed photo ", UsecaseList.SHOW_ALL_CONSUMERS);

        Optional<Consumer> optionalConsumer = consumerDao.findById(id);
        if (optionalConsumer.isEmpty()) throw new ObjectNotFoundException("Consumer not found");
        Consumer consumer = optionalConsumer.get();

        Optional<File> optionalFile = fileDao.findFileById(consumer.getLanddeedphoto());

        if (optionalFile.isEmpty()) {
            throw new ObjectNotFoundException("Photo not found");
        }

        File photo = optionalFile.get();
        HashMap<String, String> data = new HashMap<>();

        data.put("file", FileHelper.byteArrayToBase64(photo.getFile(), photo.getFilemimetype()));

        return data;
    }
    @GetMapping("/{id}/grcphoto")
    public HashMap getGrcphoto(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get Gramaniladhari crtificate photo", UsecaseList.SHOW_ALL_CONSUMERS);

        Optional<Consumer> optionalConsumer = consumerDao.findById(id);
        if (optionalConsumer.isEmpty()) throw new ObjectNotFoundException("Consumer not found");
        Consumer consumer = optionalConsumer.get();

        Optional<File> optionalFile = fileDao.findFileById(consumer.getGrcphoto());

        if (optionalFile.isEmpty()) {
            throw new ObjectNotFoundException("Photo not found");
        }

        File photo = optionalFile.get();
        HashMap<String, String> data = new HashMap<>();

        data.put("file", FileHelper.byteArrayToBase64(photo.getFile(), photo.getFilemimetype()));

        return data;
    }

}