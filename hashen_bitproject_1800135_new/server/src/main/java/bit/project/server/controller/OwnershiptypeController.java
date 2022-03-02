package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Ownershiptype;
import bit.project.server.dao.OwnershiptypeDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/ownershiptypes")
public class OwnershiptypeController{

    @Autowired
    private OwnershiptypeDao ownershiptypeDao;

    @GetMapping
    public List<Ownershiptype> getAll(){
        return ownershiptypeDao.findAll();
    }
}