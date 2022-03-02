package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Discountstatus;
import bit.project.server.dao.DiscountstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/discountstatuses")
public class DiscountstatusController{

    @Autowired
    private DiscountstatusDao discountstatusDao;

    @GetMapping
    public List<Discountstatus> getAll(){
        return discountstatusDao.findAll();
    }
}