package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Nametitle;
import bit.project.server.dao.NametitleDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/nametitles")
public class NametitleController{

    @Autowired
    private NametitleDao nametitleDao;

    @GetMapping
    public List<Nametitle> getAll(){
        return nametitleDao.findAll();
    }
}