package bit.project.server.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Gramaniladharidiv;
import bit.project.server.dao.GramaniladharidivDao;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/gramaniladharidivs")
public class GramaniladharidivController{

    @Autowired
    private GramaniladharidivDao gramaniladharidivDao;

    @GetMapping
    public List<Gramaniladharidiv> getAll(){
        return gramaniladharidivDao.findAll();
    }
}