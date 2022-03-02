package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Taskallocationstatus;
import bit.project.server.dao.TaskallocationstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/taskallocationstatuses")
public class TaskallocationstatusController{

    @Autowired
    private TaskallocationstatusDao taskallocationstatusDao;

    @GetMapping
    public List<Taskallocationstatus> getAll(){
        return taskallocationstatusDao.findAll();
    }
}