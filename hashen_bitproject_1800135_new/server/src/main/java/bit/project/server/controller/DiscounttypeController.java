package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Discounttype;
import bit.project.server.dao.DiscounttypeDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/discounttypes")
public class DiscounttypeController{

    @Autowired
    private DiscounttypeDao discounttypeDao;

    @GetMapping
    public List<Discounttype> getAll(){
        return discounttypeDao.findAll();
    }
}