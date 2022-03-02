package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Reconnectionrequeststatus;
import bit.project.server.dao.ReconnectionrequeststatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/reconnectionrequeststatuses")
public class ReconnectionrequeststatusController{

    @Autowired
    private ReconnectionrequeststatusDao reconnectionrequeststatusDao;

    @GetMapping
    public List<Reconnectionrequeststatus> getAll(){
        return reconnectionrequeststatusDao.findAll();
    }
}