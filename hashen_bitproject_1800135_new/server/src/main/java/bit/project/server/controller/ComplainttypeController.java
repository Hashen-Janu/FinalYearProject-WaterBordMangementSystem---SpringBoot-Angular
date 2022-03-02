package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Complainttype;
import bit.project.server.dao.ComplainttypeDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/complainttypes")
public class ComplainttypeController{

    @Autowired
    private ComplainttypeDao complainttypeDao;

    @GetMapping
    public List<Complainttype> getAll(){
        return complainttypeDao.findAll();
    }
}