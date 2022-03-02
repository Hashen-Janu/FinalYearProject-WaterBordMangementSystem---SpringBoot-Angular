package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Modificationrequeststatus;
import bit.project.server.dao.ModificationrequeststatusDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/modificationrequeststatuses")
public class ModificationrequeststatusController{

    @Autowired
    private ModificationrequeststatusDao modificationrequeststatusDao;

    @GetMapping
    public List<Modificationrequeststatus> getAll(){
        return modificationrequeststatusDao.findAll();
    }
}