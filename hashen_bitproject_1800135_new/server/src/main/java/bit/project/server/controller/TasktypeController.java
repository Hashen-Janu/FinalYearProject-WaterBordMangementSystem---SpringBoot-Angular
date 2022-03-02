package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Tasktype;
import bit.project.server.dao.TasktypeDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/tasktypes")
public class TasktypeController{

    @Autowired
    private TasktypeDao tasktypeDao;

    @GetMapping
    public List<Tasktype> getAll(){
        return tasktypeDao.findAll();
    }
}