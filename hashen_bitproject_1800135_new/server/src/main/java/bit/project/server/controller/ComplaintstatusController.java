package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Complaintstatus;
import bit.project.server.dao.ComplaintstatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/complaintstatuses")
public class ComplaintstatusController{

    @Autowired
    private ComplaintstatusDao complaintstatusDao;

    @GetMapping
    public List<Complaintstatus> getAll(){
        return complaintstatusDao.findAll();
    }
}