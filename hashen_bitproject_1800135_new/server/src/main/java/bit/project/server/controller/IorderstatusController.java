package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Iorderstatus;
import bit.project.server.dao.IorderstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/iorderstatuses")
public class IorderstatusController{

    @Autowired
    private IorderstatusDao iorderstatusDao;

    @GetMapping
    public List<Iorderstatus> getAll(){
        return iorderstatusDao.findAll();
    }
}