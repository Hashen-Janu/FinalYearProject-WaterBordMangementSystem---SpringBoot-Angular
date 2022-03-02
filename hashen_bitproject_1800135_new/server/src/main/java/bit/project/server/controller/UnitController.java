package bit.project.server.controller;

import bit.project.server.dao.GenderDao;
import bit.project.server.dao.UnitDao;
import bit.project.server.entity.Gender;
import bit.project.server.entity.Unit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/units")
public class UnitController {

    @Autowired
    private UnitDao unitDao;

    @GetMapping
    public List<Unit> getAll(){
        return unitDao.findAll();
    }
}
