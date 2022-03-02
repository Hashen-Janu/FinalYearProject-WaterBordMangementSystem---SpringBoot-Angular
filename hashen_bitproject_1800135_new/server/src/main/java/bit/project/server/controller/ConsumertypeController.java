package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Consumertype;
import bit.project.server.dao.ConsumertypeDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/consumertypes")
public class ConsumertypeController{

    @Autowired
    private ConsumertypeDao consumertypeDao;

    @GetMapping
    public List<Consumertype> getAll(){
        return consumertypeDao.findAll();
    }
}