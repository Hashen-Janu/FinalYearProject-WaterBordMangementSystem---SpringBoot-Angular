package bit.project.server.controller;


import bit.project.server.dao.TokenDao;
import bit.project.server.entity.Token;
import bit.project.server.entity.User;
import bit.project.server.util.dto.ClientToken;
import bit.project.server.util.dto.LoginRequest;
import bit.project.server.util.exception.NoPrivilegeException;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/authentication")
public class AuthenticationController {

    @Autowired private TokenDao tokenDao;
    @Autowired private AccessControlManager accessControlManager;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClientToken generate(@RequestBody LoginRequest loginRequest){
        return accessControlManager.getToken(loginRequest);
    }

    @GetMapping
    public List<Token> getAll(HttpServletRequest request){
        User me = accessControlManager.authenticate(request);
        return accessControlManager.getActiveTokensByUser(me);
    }

    @DeleteMapping(value = {"","/{id}"})
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void destroy(HttpServletRequest request, @PathVariable(required = false) String id){
        if(id==null){
            accessControlManager.authenticate(request);
            accessControlManager.destroyActiveToken(request);
        }else{
            User loginUser = accessControlManager.authenticate(request);
            Optional<Token> tokenOptional = tokenDao.findById(id);
            if(tokenOptional.isEmpty()) return;
            Token token = tokenOptional.get();
            if(!token.getUser().equals(loginUser)) throw new NoPrivilegeException("Unauthorized Request");
            accessControlManager.destroyToken(token);
        }
    }

    @DeleteMapping("/all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void destroyAll(HttpServletRequest request){
        User me = accessControlManager.authenticate(request);
        List<Token> tokens = accessControlManager.getActiveTokensByUser(me);
        accessControlManager.destroyTokens(tokens);
    }


}
