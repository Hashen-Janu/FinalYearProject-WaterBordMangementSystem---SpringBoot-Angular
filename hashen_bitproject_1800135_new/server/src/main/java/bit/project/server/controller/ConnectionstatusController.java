package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Connectionstatus;
import bit.project.server.dao.ConnectionstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/connectionstatuses")
public class ConnectionstatusController{

    @Autowired
    private ConnectionstatusDao connectionstatusDao;

    @GetMapping
    public List<Connectionstatus> getAll(){
        return connectionstatusDao.findAll();
    }
}