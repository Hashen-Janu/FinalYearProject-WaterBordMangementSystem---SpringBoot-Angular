package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Divsecretariat;
import bit.project.server.dao.DivsecretariatDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/divsecretariats")
public class DivsecretariatController{

    @Autowired
    private DivsecretariatDao divsecretariatDao;

    @GetMapping
    public List<Divsecretariat> getAll(){
        return divsecretariatDao.findAll();
    }
}