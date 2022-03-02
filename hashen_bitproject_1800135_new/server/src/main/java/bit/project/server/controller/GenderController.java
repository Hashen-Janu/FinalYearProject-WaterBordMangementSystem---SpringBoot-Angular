package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Gender;
import bit.project.server.dao.GenderDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/genders")
public class GenderController{

    @Autowired
    private GenderDao genderDao;

    @GetMapping
    public List<Gender> getAll(){
        return genderDao.findAll();
    }
}