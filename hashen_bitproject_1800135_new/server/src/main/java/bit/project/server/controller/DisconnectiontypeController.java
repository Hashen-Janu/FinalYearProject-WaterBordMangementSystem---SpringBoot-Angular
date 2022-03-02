package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Disconnectiontype;
import bit.project.server.dao.DisconnectiontypeDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/disconnectiontypes")
public class DisconnectiontypeController{

    @Autowired
    private DisconnectiontypeDao disconnectiontypeDao;

    @GetMapping
    public List<Disconnectiontype> getAll(){
        return disconnectiontypeDao.findAll();
    }
}