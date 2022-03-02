package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Village;
import bit.project.server.dao.VillageDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/villages")
public class VillageController{

    @Autowired
    private VillageDao villageDao;

    @GetMapping
    public List<Village> getAll(){
        return villageDao.findAll();
    }
}