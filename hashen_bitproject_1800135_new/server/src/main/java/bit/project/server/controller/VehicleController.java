package bit.project.server.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.TaskallocationDao;
import bit.project.server.entity.Employee;
import bit.project.server.entity.Taskallocation;
import bit.project.server.entity.User;
import bit.project.server.entity.Vehicle;
import bit.project.server.dao.VehicleDao;
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
@RequestMapping("/vehicles")
public class VehicleController{

    @Autowired
    private VehicleDao vehicleDao;

    @Autowired
    private TaskallocationDao taskallocationDao;

    @Autowired
    private AccessControlManager accessControlManager;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");

    @GetMapping
    public Page<Vehicle> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all vehicles", UsecaseList.SHOW_ALL_VEHICLES);

        if(pageQuery.isEmptySearch()){
            return vehicleDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String no = pageQuery.getSearchParam("no");
        Integer vehicletypeId = pageQuery.getSearchParamAsInteger("vehicletype");
        String model = pageQuery.getSearchParam("model");

        List<Vehicle> vehicles = vehicleDao.findAll(DEFAULT_SORT);
        Stream<Vehicle> stream = vehicles.parallelStream();

        List<Vehicle> filteredVehicles = stream.filter(vehicle -> {
            if(no!=null)
                if(!vehicle.getNo().toLowerCase().contains(no.toLowerCase())) return false;
            if(vehicletypeId!=null)
                if(!vehicle.getVehicletype().getId().equals(vehicletypeId)) return false;
            if(model!=null)
                if(!vehicle.getModel().toLowerCase().contains(model.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredVehicles, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Vehicle> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all vehicles' basic data", UsecaseList.SHOW_ALL_VEHICLES, UsecaseList.ADD_TASKALLOCATION, UsecaseList.UPDATE_TASKALLOCATION);
        return vehicleDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Vehicle get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get vehicle", UsecaseList.SHOW_VEHICLE_DETAILS);
        Optional<Vehicle> optionalVehicle = vehicleDao.findById(id);
        if(optionalVehicle.isEmpty()) throw new ObjectNotFoundException("Vehicle not found");
        return optionalVehicle.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete vehicles", UsecaseList.DELETE_VEHICLE);

        try{
            if(vehicleDao.existsById(id)) vehicleDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this vehicle already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Vehicle vehicle, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new vehicle", UsecaseList.ADD_VEHICLE);

        vehicle.setTocreation(LocalDateTime.now());
        vehicle.setCreator(authUser);
        vehicle.setId(null);


        EntityValidator.validate(vehicle);

        vehicle = vehicleDao.save(vehicle);

        return new ResourceLink(vehicle.getId(), "/vehicles/"+vehicle.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Vehicle vehicle, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update vehicle details", UsecaseList.UPDATE_VEHICLE);

        Optional<Vehicle> optionalVehicle = vehicleDao.findById(id);
        if(optionalVehicle.isEmpty()) throw new ObjectNotFoundException("Vehicle not found");
        Vehicle oldVehicle = optionalVehicle.get();

        vehicle.setId(id);
        vehicle.setCreator(oldVehicle.getCreator());
        vehicle.setTocreation(oldVehicle.getTocreation());


        EntityValidator.validate(vehicle);

        vehicle = vehicleDao.save(vehicle);
        return new ResourceLink(vehicle.getId(), "/vehicles/"+vehicle.getId());
    }

    @GetMapping("/byunitforallocation/{id}")
    public List<Vehicle> getAllByUnitForAllocation(@PathVariable Integer id, PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all vehicles' basic data", UsecaseList.SHOW_ALL_VEHICLES, UsecaseList.ADD_TASKALLOCATION, UsecaseList.UPDATE_TASKALLOCATION);
        List<Vehicle> vehicleList =  vehicleDao.getAllByUnit(id);
        List<Taskallocation> taskallocations = taskallocationDao.findAllByStatus(1);
        ArrayList<Vehicle> vehicles = new ArrayList<>();
        if (taskallocations != null){
            System.out.println("n1");
            taskallocations.forEach(taskallocation -> {
                if (taskallocation.getVehicleList() != null){
                    System.out.println("ss");
                    taskallocation.getVehicleList().forEach(vehicle -> {
                        vehicles.add(vehicle);
                    });
                }
            });
        }
        vehicleList.removeAll(vehicles);
        return vehicleList;
    }



}
