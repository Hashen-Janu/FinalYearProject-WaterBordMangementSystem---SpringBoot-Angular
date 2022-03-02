package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Vehicletype;
import bit.project.server.dao.VehicletypeDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/vehicletypes")
public class VehicletypeController{

    @Autowired
    private VehicletypeDao vehicletypeDao;

    @GetMapping
    public List<Vehicletype> getAll(){
        return vehicletypeDao.findAll();
    }
}