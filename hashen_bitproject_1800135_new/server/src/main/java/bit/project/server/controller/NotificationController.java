package bit.project.server.controller;

import bit.project.server.dao.NotificationDao;
import bit.project.server.entity.Notification;
import bit.project.server.entity.User;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.exception.NoPrivilegeException;
import bit.project.server.util.exception.ObjectNotFoundException;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "dosend");
    @Autowired private NotificationDao notificationDao;
    @Autowired private AccessControlManager accessControlManager;

    @GetMapping("/latest")
    public List<Notification> latest(HttpServletRequest request) {
        User authUser = accessControlManager.authenticate(request);
        return notificationDao.findAllByUser( authUser, PageRequest.of(0, 4, DEFAULT_SORT)).getContent();
    }

    @GetMapping("/unread/count")
    public HashMap<String, Long> unreadcount(HttpServletRequest request) {
        User authUser = accessControlManager.authenticate(request);
        Long count = notificationDao.countByUserAndDoread(authUser, null);
        HashMap<String, Long> data = new HashMap<>();
        data.put("count", count);

        return data;
    }

    @GetMapping
    public Page<Notification> all(PageQuery pageQuery, HttpServletRequest request) {
        User authUser = accessControlManager.authenticate(request);
        return notificationDao
                .findAllByUser( authUser, PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Notification get(@PathVariable String id, HttpServletRequest request) {
        User authUser = accessControlManager.authenticate(request);
        Optional<Notification> optionalNotification = notificationDao.findById(id);
        if(optionalNotification.isEmpty()) throw new ObjectNotFoundException("Notification not found");
        Notification notification = optionalNotification.get();

        if(!notification.getUser().getId().equals(authUser.getId()))
            throw new NoPrivilegeException("You have no privilege to see others' notifications");

        return notification;
    }

    @PutMapping("/{id}/delivered")
    public void setDeliveredDate(@PathVariable String id, HttpServletRequest request) {
        User authUser = accessControlManager.authenticate(request);
        Optional<Notification> optionalNotification = notificationDao.findById(id);
        if(optionalNotification.isEmpty()) throw new ObjectNotFoundException("Notification not found");
        Notification notification = optionalNotification.get();

        if(!notification.getUser().getId().equals(authUser.getId()))
            throw new NoPrivilegeException("You have no privilege to update others' notifications");

        notification.setDodelivered(LocalDateTime.now());
        notificationDao.save(notification);
    }

    @PutMapping("/{id}/read")
    public void setReadDate(@PathVariable String id, HttpServletRequest request) {
        User authUser = accessControlManager.authenticate(request);
        Optional<Notification> optionalNotification = notificationDao.findById(id);
        if(optionalNotification.isEmpty()) throw new ObjectNotFoundException("Notification not found");
        Notification notification = optionalNotification.get();

        if(!notification.getUser().getId().equals(authUser.getId()))
            throw new NoPrivilegeException("You have no privilege to update others' notifications");

        notification.setDoread(LocalDateTime.now());
        notificationDao.save(notification);
    }

}
