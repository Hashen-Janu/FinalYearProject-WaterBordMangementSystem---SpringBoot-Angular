package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Placetype;
import bit.project.server.dao.PlacetypeDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/placetypes")
public class PlacetypeController{

    @Autowired
    private PlacetypeDao placetypeDao;

    @GetMapping
    public List<Placetype> getAll(){
        return placetypeDao.findAll();
    }
}