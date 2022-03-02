package bit.project.server.controller;

import bit.project.server.UsecaseList;
import bit.project.server.dao.*;
import bit.project.server.entity.*;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.NoPrivilegeException;
import bit.project.server.util.exception.ObjectNotFoundException;
import bit.project.server.util.helper.FileHelper;
import bit.project.server.util.helper.PageHelper;
import bit.project.server.util.security.AccessControlManager;
import bit.project.server.util.security.Userstatus;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.validation.ValidationErrorBag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import javax.persistence.RollbackException;
import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import bit.project.server.dao.EmployeeDao;
import bit.project.server.entity.Employee;

@CrossOrigin
@RestController
@RequestMapping("/users")
public class UserController {

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");

    @Autowired private UserDao userDao;
    @Autowired private UsecaseDao usecaseDao;
    @Autowired private AccessControlManager accessControlManager;
    @Autowired private FileDao fileDao;
    @Autowired private EmployeeDao employeeDao;

    @GetMapping
    public Page<User> getAll(PageQuery pageQuery, HttpServletRequest request) {

        accessControlManager.authorize(request, "No privilege to get all users",  UsecaseList.SHOW_ALL_USERS);

        String userstatus = pageQuery.getSearchParam("userstatus");
        String username = pageQuery.getSearchParam("username");
        String displayName = pageQuery.getSearchParam("displayname");

        List<User> users = userDao.findAll(DEFAULT_SORT);
        Stream<User> stream = users.parallelStream();

        List<User> filteredUsers = stream.filter(user -> {
            if(user.isSuperAdmin()) return false;
            if(userstatus!=null)
                if(!user.getStatus().equalsIgnoreCase(userstatus)) return false;
            if(username!=null)
                if(!user.getUsername().toLowerCase().contains(username.toLowerCase())) return false;

            if(displayName != null){
                String dname = "";
                Employee employee = user.getEmployee();
                if(employee != null) dname = employee.getCode() + "-" + employee.getNametitle().getName() + " " + employee.getCallingname();
                if(!dname.toLowerCase().contains(displayName.toLowerCase())) return false;
            }


            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredUsers, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<User> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all users' basic data",  UsecaseList.SHOW_ALL_USERS);
        Page<User> userPage = userDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        Stream<User> stream = userPage.getContent().parallelStream();
        List<User> filteredUsers = stream.filter(user -> !user.isSuperAdmin()).collect(Collectors.toList());
        return PageHelper.getAsPage(filteredUsers, pageQuery.getPage(), pageQuery.getSize());
    }

    @GetMapping("/{id}")
    public User get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get user",  UsecaseList.SHOW_USER_DETAILS);
        Optional<User> optionalUser = userDao.findById(id);
        if(optionalUser.isEmpty()) throw new ObjectNotFoundException("User not found");
        User user = optionalUser.get();
        if(user.isSuperAdmin()){
            throw new NoPrivilegeException("No privilege to retrieve super admin data");
        }
        return user;
    }

    @GetMapping("/employees")
    public List<Employee> getAllUserEmployees(HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get user employees",  UsecaseList.ADD_USER);
        return userDao.findAllUserEmployees();
    }

    @GetMapping("/nonuser/employees")
    public List<Employee> getAllNonUserEmployees(HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get non user employees",  UsecaseList.ADD_USER);
        return userDao.findAllNonUserEmployees();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody User user, HttpServletRequest request){
        User authUser = accessControlManager.authorize(request, "No privilege to add new user",  UsecaseList.ADD_USER);

        String textPassword = user.getPassword();
        user.setTocreation(LocalDateTime.now());
        user.setCreator(authUser);
        user.setStatus(Userstatus.ACTIVE.toString());
        String hashedPassword = accessControlManager.getHashedPassword(textPassword);
        user.setPassword(hashedPassword);

        EntityValidator.validate(user);
        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(user.getEmployee()!=null){
            Optional<Employee> optionalEmployee = employeeDao.findById(user.getEmployee().getId());
            if(optionalEmployee.isEmpty()){
                errorBag.add("employee","The selected employee is not a valid employee");
            }else{
                Employee employee = optionalEmployee.get();
                user.setUsername(employee.getCode());
                User userByEmployee = userDao.findByEmployee(employee);
                if(userByEmployee!=null) errorBag.add("employee","The selected employee is already a user");
            }
        }else {
            errorBag.add("employee","Employee is required");
        }

        if(!accessControlManager.isStrongPassword(textPassword)) errorBag.add("password","Please enter a strong password like P@ssw0rd");
        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        userDao.save(user);
        fileDao.updateIsusedById(user.getPhoto(), true);

        return new ResourceLink(user.getId(), "/users/"+user.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody User user, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to update user details",  UsecaseList.UPDATE_USER);
        User oldUser = getUser(id);

        if(oldUser.isSuperAdmin()){
            throw new NoPrivilegeException("No privilege to update super admin data");
        }

        user.setEmployee(oldUser.getEmployee());
        user.setId(id);
        user.setPassword(oldUser.getPassword());
        user.setUsername(oldUser.getUsername());
        user.setTocreation(oldUser.getTocreation());
        user.setCreator(oldUser.getCreator());

        if(user.getStatus().equals(Userstatus.ACTIVE.toString()))
        if(oldUser.getStatus().equals(Userstatus.LOCKED.toString())){
            user.setFailedattempts(0);
            user.setTolocked(null);
        }

        EntityValidator.validate(user);

        String oldPhotoId = oldUser.getPhoto();
        String newPhotoId = user.getPhoto();

        userDao.save(user);
        fileDao.updateIsusedById(oldPhotoId, false);
        fileDao.updateIsusedById(newPhotoId, true);

        return new ResourceLink(user.getId(), "/users/"+user.getId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete users",  UsecaseList.DELETE_USER);

        Optional<User> userOptional = userDao.findById(id);
        if(userOptional.isEmpty()) return;
        User user = userOptional.get();

        if(user.isSuperAdmin()){
            throw new NoPrivilegeException("No privilege to delete super admin");
        }

        try{
            userDao.deleteById(id);
            fileDao.updateIsusedById(user.getPhoto(), false);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this user already used in another module");
        }
    }

    @PutMapping("/{id}/password")
    public ResourceLink resetPassword(@PathVariable Integer id, @RequestBody HashMap<String, String> data, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to reset user password",  UsecaseList.RESET_USER_PASSWORDS);

        User user = getUser(id);

        if(user.isSuperAdmin()){
            throw new NoPrivilegeException("No privilege to reset super admin password");
        }

        String newPassword = data.getOrDefault("password","");
        if(!accessControlManager.isStrongPassword(newPassword)){
            ValidationErrorBag errorBag = new ValidationErrorBag();
            errorBag.add("password","Please enter a strong password like P@ssw0rd");
            throw new DataValidationException(errorBag);
        }

        user.setPassword(accessControlManager.getHashedPassword(newPassword));
        user = userDao.save(user);
        return new ResourceLink(user.getId(), "/users/"+user.getId());
    }

    @GetMapping("/me")
    public User me(HttpServletRequest request) {
        return accessControlManager.authenticate(request);
    }

    @GetMapping("/me/usecases")
    public List<Usecase> meUsecases(HttpServletRequest request) {
        User user = accessControlManager.authenticate(request);
        if(user.isSuperAdmin()){
            return usecaseDao.findAll();
        }else{
            return accessControlManager.getUsecases(user);
        }
    }

    @PutMapping("/me/password")
    public ResourceLink changeMyPassword(@RequestBody HashMap<String, String> data, HttpServletRequest request){
        User user = accessControlManager.authenticate(request);

        String newPassword = data.getOrDefault("newPassword","");
        String oldPassword = data.getOrDefault("oldPassword","");

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(!accessControlManager.isStrongPassword(newPassword)){
            errorBag.add("newPassword","Please enter a strong password like P@ssw0rd");
        }

        if(!accessControlManager.isMatchedHashPassword(oldPassword, user.getPassword())){
            errorBag.add("oldPassword","Existing password is not matched");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        user.setPassword(accessControlManager.getHashedPassword(newPassword));
        user = userDao.save(user);

        return new ResourceLink(user.getId(), "/users/me");
    }

    @PutMapping("/me/photo")
    public ResourceLink changeMyPhoto(@RequestBody HashMap<String, String> data, HttpServletRequest request){
        User user = accessControlManager.authenticate(request);

        String photo = data.getOrDefault("photo", null);

        fileDao.updateIsusedById(user.getPhoto(), false);
        fileDao.updateIsusedById(photo, true);

        user.setPhoto(photo);
        user = userDao.save(user);

        return new ResourceLink(user.getId(), "/users/me");
    }

    @GetMapping("/{id}/photo")
    public HashMap<String, String> getPhoto(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get user photo", UsecaseList.SHOW_USER_DETAILS);

        User user = getUser(id);

        Optional<File> optionalFile = fileDao.findFileById(user.getPhoto());

        if(optionalFile.isEmpty()) {
            throw new ObjectNotFoundException("Photo not found");
        }

        File photo = optionalFile.get();
        HashMap<String, String> data = new HashMap<>();

        data.put("file", FileHelper.byteArrayToBase64(photo.getFile(), photo.getFilemimetype()));

        return data;
    }

    private User getUser(Integer id){
        Optional<User> userOptional = userDao.findById(id);
        if(userOptional.isEmpty()) throw new ObjectNotFoundException("User not found");
        return userOptional.get();
    }
}