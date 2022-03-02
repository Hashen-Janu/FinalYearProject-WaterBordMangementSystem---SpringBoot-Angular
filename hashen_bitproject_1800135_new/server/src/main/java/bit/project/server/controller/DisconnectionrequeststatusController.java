package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Disconnectionrequeststatus;
import bit.project.server.dao.DisconnectionrequeststatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/disconnectionrequeststatuses")
public class DisconnectionrequeststatusController{

    @Autowired
    private DisconnectionrequeststatusDao disconnectionrequeststatusDao;

    @GetMapping
    public List<Disconnectionrequeststatus> getAll(){
        return disconnectionrequeststatusDao.findAll();
    }
}