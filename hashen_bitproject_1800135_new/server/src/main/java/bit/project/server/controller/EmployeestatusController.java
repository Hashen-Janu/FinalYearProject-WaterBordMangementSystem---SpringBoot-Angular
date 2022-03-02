package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Employeestatus;
import bit.project.server.dao.EmployeestatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/employeestatuses")
public class EmployeestatusController{

    @Autowired
    private EmployeestatusDao employeestatusDao;

    @GetMapping
    public List<Employeestatus> getAll(){
        return employeestatusDao.findAll();
    }
}