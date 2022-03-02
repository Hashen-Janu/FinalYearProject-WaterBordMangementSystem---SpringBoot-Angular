package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Userstatus;
import bit.project.server.dao.UserstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/userstatuses")
public class UserstatusController{

    @Autowired
    private UserstatusDao userstatusDao;

    @GetMapping
    public List<Userstatus> getAll(){
        return userstatusDao.findAll();
    }
}