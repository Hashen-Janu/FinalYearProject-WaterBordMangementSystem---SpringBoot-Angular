package bit.project.server.controller;

import java.util.UUID;
import java.time.LocalDateTime;
import bit.project.server.dao.UserDao;
import bit.project.server.entity.User;
import bit.project.server.util.seed.Seeder;
import org.springframework.http.HttpStatus;
import bit.project.server.dao.NotificationDao;
import bit.project.server.entity.Notification;
import bit.project.server.util.dto.ClientToken;
import bit.project.server.util.dto.LoginRequest;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.security.Userstatus;
import java.lang.reflect.InvocationTargetException;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.security.AccessControlManager;
import bit.project.server.util.validation.ValidationErrorBag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.server.ResponseStatusException;
import bit.project.server.util.exception.DataValidationException;

@CrossOrigin
@RestController
@RequestMapping("/configuration")
public class ConfigurationController {

    @Autowired
    UserDao userDao;

    @Autowired
    AccessControlManager accessControlManager;

    @Autowired
    AuthenticationController authenticationController;

    @Autowired
    NotificationDao notificationDao;

    @Autowired
    Seeder seeder;

    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.HEAD)
    public void checkConfiguration() {
        User superUser = userDao.getSuperUser();
        if (superUser == null) throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public ClientToken config(@RequestBody User user) throws IllegalAccessException, NoSuchFieldException, ClassNotFoundException, NoSuchMethodException, InstantiationException, InvocationTargetException{
        user.setTocreation(LocalDateTime.now());
        user.setStatus("Active");
        user.setEmployee(null);
        user.setTolocked(null);
        user.setFailedattempts(0);
        user.setUsername("Administrator");

        String textPassword = user.getPassword();
        user.setPassword(accessControlManager.getHashedPassword(textPassword));

        EntityValidator.validate(user);
        ValidationErrorBag errorBag = new ValidationErrorBag();
        if(!accessControlManager.isStrongPassword(textPassword)) errorBag.add("password","Please enter a strong password like P@ssw0rd");
        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        userDao.save(user);
        seeder.seed();

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setRememberMe(false);
        loginRequest.setPassword(textPassword);
        loginRequest.setUsername(user.getUsername());

        Notification notification = new Notification();
        notification.setId(UUID.randomUUID().toString());
        notification.setUser(user);
        notification.setDosend(LocalDateTime.now());
        notification.setMessage("Successfully setup administrator's password");
        notificationDao.save(notification);

        return authenticationController.generate(loginRequest);
    }
}