package bit.project.server.controller;

import bit.project.server.UsecaseList;
import bit.project.server.dao.RoleDao;
import bit.project.server.dao.SystemmoduleDao;
import bit.project.server.entity.Role;
import bit.project.server.entity.Systemmodule;
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
@RequestMapping("/systemmodules")
public class SystemmoduleController {

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.ASC, "id");

    @Autowired private SystemmoduleDao systemmoduleDao;
    @Autowired private AccessControlManager accessControlManager;

    @GetMapping
    public List<Systemmodule> getAll(HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all system modules", UsecaseList.ADD_ROLE, UsecaseList.UPDATE_ROLE);
        return systemmoduleDao.findAll(DEFAULT_SORT);
    }
}
