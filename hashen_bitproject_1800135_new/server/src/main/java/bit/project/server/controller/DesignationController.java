package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Designation;
import bit.project.server.dao.DesignationDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/designations")
public class DesignationController{

    @Autowired
    private DesignationDao designationDao;

    @GetMapping
    public List<Designation> getAll(){
        return designationDao.findAll();
    }
}