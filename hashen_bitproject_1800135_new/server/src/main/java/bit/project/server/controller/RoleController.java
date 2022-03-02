package bit.project.server.controller;

import bit.project.server.UsecaseList;
import bit.project.server.dao.RoleDao;
import bit.project.server.entity.Role;
import bit.project.server.entity.User;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;
import bit.project.server.util.helper.PageHelper;
import bit.project.server.util.security.AccessControlManager;
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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping("/roles")
public class RoleController {

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");

    @Autowired private RoleDao roleDao;
    @Autowired private AccessControlManager accessControlManager;

    @GetMapping
    public Page<Role> getAll(PageQuery pageQuery, HttpServletRequest request) {

        accessControlManager.authorize(request, "No privilege to get all roles", UsecaseList.SHOW_ALL_ROLES);

        if(pageQuery.isEmptySearch()){
            return roleDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }else{

            String name = pageQuery.getSearchParam("name");

            List<Role> roles = roleDao.findAll(DEFAULT_SORT);
            Stream<Role> stream = roles.parallelStream();

            List<Role> filteredUsers = stream.filter(role -> {
                if(name!=null)
                    if(!role.getName().toLowerCase().contains(name.toLowerCase())) return false;
                return true;
            }).collect(Collectors.toList());

            return PageHelper.getAsPage(filteredUsers, pageQuery.getPage(), pageQuery.getSize());
        }
    }

    @GetMapping("/basic")
    public Page<Role> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all roles' basic data", UsecaseList.SHOW_ALL_ROLES, UsecaseList.ADD_USER, UsecaseList.UPDATE_USER);
        return roleDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Role get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get role",  UsecaseList.SHOW_ROLE_DETAILS);
        Optional<Role> optionalRole = roleDao.findById(id);
        if(optionalRole.isEmpty()) throw new ObjectNotFoundException("Role not found");
        return optionalRole.get();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Role role, HttpServletRequest request){
        User authUser = accessControlManager.authorize(request, "No privilege to add new role",  UsecaseList.ADD_ROLE);

        role.setTocreation(LocalDateTime.now());
        role.setCreator(authUser);

        EntityValidator.validate(role);

        ValidationErrorBag errorBag = new ValidationErrorBag();
        Role roleByName = roleDao.findByName(role.getName());
        if(roleByName!=null) errorBag.add("name","Name already exists");
        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        roleDao.save(role);
        return new ResourceLink(role.getId(), "/roles/"+role.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Role role, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to update role details",  UsecaseList.UPDATE_ROLE);

        Optional<Role> optionalRole = roleDao.findById(id);
        if(optionalRole.isEmpty()) throw new ObjectNotFoundException("Role not found");
        Role oldRole = optionalRole.get();

        role.setId(id);
        role.setCreator(oldRole.getCreator());
        role.setTocreation(oldRole.getTocreation());
        EntityValidator.validate(role);

        ValidationErrorBag errorBag = new ValidationErrorBag();
        Role roleByName = roleDao.findByName(role.getName());
        if(roleByName!=null) if(!roleByName.getId().equals(id)) errorBag.add("name","Name already exists");
        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        roleDao.save(role);
        return new ResourceLink(role.getId(), "/roles/"+role.getId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete roles",  UsecaseList.DELETE_ROLE);

        try{
            if(roleDao.existsById(id)) roleDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this role already used in another module");
        }
    }
}
