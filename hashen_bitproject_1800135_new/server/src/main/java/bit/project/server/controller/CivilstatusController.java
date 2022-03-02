package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Civilstatus;
import bit.project.server.dao.CivilstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/civilstatuses")
public class CivilstatusController{

    @Autowired
    private CivilstatusDao civilstatusDao;

    @GetMapping
    public List<Civilstatus> getAll(){
        return civilstatusDao.findAll();
    }
}