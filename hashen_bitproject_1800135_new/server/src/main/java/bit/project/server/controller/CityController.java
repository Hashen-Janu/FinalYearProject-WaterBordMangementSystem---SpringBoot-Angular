package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.City;
import bit.project.server.dao.CityDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/cities")
public class CityController{

    @Autowired
    private CityDao cityDao;

    @GetMapping
    public List<City> getAll(){
        return cityDao.findAll();
    }
}