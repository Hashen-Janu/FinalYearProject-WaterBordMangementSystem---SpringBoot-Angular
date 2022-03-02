package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Connectionrequeststatus;
import bit.project.server.dao.ConnectionrequeststatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/connectionrequeststatuses")
public class ConnectionrequeststatusController{

    @Autowired
    private ConnectionrequeststatusDao connectionrequeststatusDao;

    @GetMapping
    public List<Connectionrequeststatus> getAll(){
        return connectionrequeststatusDao.findAll();
    }
}