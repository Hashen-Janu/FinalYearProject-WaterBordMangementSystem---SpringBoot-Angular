package bit.project.server.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.Employee;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import bit.project.server.entity.Connection;
import bit.project.server.dao.ConnectionDao;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import bit.project.server.entity.Connectionstatus;
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
@RequestMapping("/connections")
public class ConnectionController{

    @Autowired
    private ConnectionDao connectionDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ConnectionController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("connection");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("CN");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Connection> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all connections", UsecaseList.SHOW_ALL_CONNECTIONS);

        if(pageQuery.isEmptySearch()){
            return connectionDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer consumerId = pageQuery.getSearchParamAsInteger("consumer");
        Integer gramaniladharidivId = pageQuery.getSearchParamAsInteger("gramaniladharidiv");
        String meterseelno = pageQuery.getSearchParam("meterseelno");
        Integer placetypeId = pageQuery.getSearchParamAsInteger("placetype");

        List<Connection> connections = connectionDao.findAll(DEFAULT_SORT);
        Stream<Connection> stream = connections.parallelStream();

        List<Connection> filteredConnections = stream.filter(connection -> {
            if(code!=null)
                if(!connection.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(consumerId!=null)
                if(!connection.getConsumer().getId().equals(consumerId)) return false;
            if(gramaniladharidivId!=null)
                if(!connection.getGramaniladharidiv().getId().equals(gramaniladharidivId)) return false;
            if(meterseelno!=null)
                if(!connection.getMeterseelno().toLowerCase().contains(meterseelno.toLowerCase())) return false;
            if(placetypeId!=null)
                if(!connection.getPlacetype().getId().equals(placetypeId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredConnections, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Connection> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all connections' basic data", UsecaseList.SHOW_ALL_CONNECTIONS, UsecaseList.ADD_COMPLAINT, UsecaseList.UPDATE_COMPLAINT, UsecaseList.ADD_DISCONNECTIONREQUEST, UsecaseList.UPDATE_DISCONNECTIONREQUEST, UsecaseList.ADD_MODIFICATIONREQUEST, UsecaseList.UPDATE_MODIFICATIONREQUEST, UsecaseList.ADD_RECONNECTIONREQUEST, UsecaseList.UPDATE_RECONNECTIONREQUEST);
        return connectionDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Connection get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get connection", UsecaseList.SHOW_CONNECTION_DETAILS);
        Optional<Connection> optionalConnection = connectionDao.findById(id);
        if(optionalConnection.isEmpty()) throw new ObjectNotFoundException("Connection not found");
        return optionalConnection.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete connections", UsecaseList.DELETE_CONNECTION);

        try{
            if(connectionDao.existsById(id)) connectionDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this connection already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Connection connection, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new connection", UsecaseList.ADD_CONNECTION);

        connection.setTocreation(LocalDateTime.now());
        connection.setCreator(authUser);
        connection.setId(null);
        connection.setConnectionstatus(new Connectionstatus(1));;


        EntityValidator.validate(connection);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(connection.getMobile() != null){
            Connection connectionByMobile = connectionDao.findByMobile(connection.getMobile());
            if(connectionByMobile!=null) errorBag.add("mobile","mobile already exists");
        }
        if(connection.getMeterno() != null){
            Connection connectionByMeterno = connectionDao.findByMeterno(connection.getMeterno());
            if(connectionByMeterno!=null) errorBag.add("meterno","Meter no already exists");
        }
        if(connection.getMeterseelno() != null){
            Connection connectionByMeterseelno = connectionDao.findByMeterseelno(connection.getMeterseelno());
            if(connectionByMeterseelno!=null) errorBag.add("meterseelno","Meter seel no already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            connection.setCode(codeGenerator.getNextId(codeConfig));
            return connectionDao.save(connection);
        });

        return new ResourceLink(connection.getId(), "/connections/"+connection.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Connection connection, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update connection details", UsecaseList.UPDATE_CONNECTION);

        Optional<Connection> optionalConnection = connectionDao.findById(id);
        if(optionalConnection.isEmpty()) throw new ObjectNotFoundException("Connection not found");
        Connection oldConnection = optionalConnection.get();

        connection.setId(id);
        connection.setCode(oldConnection.getCode());
        connection.setCreator(oldConnection.getCreator());
        connection.setTocreation(oldConnection.getTocreation());


        EntityValidator.validate(connection);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(connection.getMobile() != null){
            Connection connectionByMobile = connectionDao.findByMobile(connection.getMobile());
            if(connectionByMobile!=null)
                if(!connectionByMobile.getId().equals(id))
                    errorBag.add("mobile","mobile already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        connection = connectionDao.save(connection);
        return new ResourceLink(connection.getId(), "/connections/"+connection.getId());
    }

    @GetMapping("byconsumer/{id}")
    public List<Connection> getAllByConsumer(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all connections' basic data", UsecaseList.SHOW_ALL_CONNECTIONS, UsecaseList.ADD_COMPLAINT, UsecaseList.UPDATE_COMPLAINT, UsecaseList.ADD_DISCONNECTIONREQUEST, UsecaseList.UPDATE_DISCONNECTIONREQUEST, UsecaseList.ADD_MODIFICATIONREQUEST, UsecaseList.UPDATE_MODIFICATIONREQUEST, UsecaseList.ADD_RECONNECTIONREQUEST, UsecaseList.UPDATE_RECONNECTIONREQUEST);
        List<Connection> connections =  connectionDao.findAll();
        ArrayList<Connection> filterdConnection = new ArrayList<>();
        connections.forEach(connection -> {
            if (connection.getConsumer().getId().equals(id)){
                filterdConnection.add(connection);
            }
        });
        filterdConnection.forEach(connection -> {
            System.out.println(connection.getConsumer().getFirstname().toString());
        });
        return connections;
    }

}