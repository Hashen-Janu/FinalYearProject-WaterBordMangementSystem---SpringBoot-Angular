package bit.project.server.util.security;

import bit.project.server.UsecaseList;
import bit.project.server.dao.TokenDao;
import bit.project.server.dao.UserDao;
import bit.project.server.entity.*;
import bit.project.server.util.dto.ClientToken;
import bit.project.server.util.dto.LoginRequest;
import bit.project.server.util.exception.AuthenticationFailedException;
import bit.project.server.util.exception.LockedException;
import bit.project.server.util.exception.NoPrivilegeException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;

import javax.persistence.NoResultException;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class AccessControlManager {
    private static final String SECRET_KEY = "123465";
    private static final long USER_LOCKED_PERIOD_MILLIS = 5*60*1000;
    private static final long TOKEN_EXPIRATION_PERIOD_HOURS = 6;

    @Autowired private TokenDao tokenDao;
    @Autowired private UserDao userDao;

    private Token getActiveToken(HttpServletRequest request){
        String tokenString = request.getHeader("Authorization");

        if (tokenString == null) throw new AuthenticationFailedException("Authentication token is missing");
        try{
            Claims body = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(tokenString).getBody();
            String tokenId = body.get("id").toString();

            Optional<Token> tokenOptional = tokenDao.findById(tokenId);
            if (tokenOptional.isEmpty()) throw new AuthenticationFailedException();

            Token token = tokenOptional.get();

            if(!token.getStatus().equals(Tokenstatus.ACTIVE.toString())){
                throw new AuthenticationFailedException();
            }

            return token;
        }catch (MalformedJwtException e){
            throw new AuthenticationFailedException("Incorrect authentication token");
        }
    }

    private User getUserByUsername(String username){
        CriteriaBuilder criteriaBuilder = userDao.getCriteriaBuilder();
        CriteriaQuery<User> criteriaQuery = criteriaBuilder.createQuery(User.class);
        Root<User> root = criteriaQuery.from(User.class);
        criteriaQuery.select(root).where(criteriaBuilder.equal(root.get("username"), username));
        TypedQuery<User> query = userDao.createQuery(criteriaQuery);
        try{
            return query.getSingleResult();
        }catch (NoResultException ex){
            return null;
        }
    }

    public User authenticate(HttpServletRequest request){
        try {
            Token token = getActiveToken(request);


            if(token.getToexpiration()!=null){
                LocalDateTime expAt = token.getToexpiration();
                if(LocalDateTime.now().compareTo(expAt) > 0){
                    token.setStatus(Tokenstatus.EXPIRED.toString());
                    tokenDao.save(token);
                    throw new AuthenticationFailedException();
                }
            }

            request.setAttribute("token", token);
            return token.getUser();
        }catch (AuthenticationFailedException e) {
            throw e;
        } catch (Exception e) {
            throw new AuthenticationFailedException();
        }
    }

    public User authorize(HttpServletRequest request, UsecaseList usecaseId, UsecaseList... usecaseIds){
        return authorize(request, "No appropriate privileges granted", usecaseId, usecaseIds);
    }

    public User authorize(HttpServletRequest request, String message, UsecaseList usecaseId, UsecaseList... usecaseIds){
        User authenticatedUser = authenticate(request);

        List<Integer> usecaseIdList = new ArrayList<>();
        for (UsecaseList uid: usecaseIds) usecaseIdList.add(uid.value);
        usecaseIdList.add(usecaseId.value);

        if(!authenticatedUser.isSuperAdmin()){
            boolean authorized = false;
            List<Usecase> usecases = getUsecases(authenticatedUser);
            top:
            for(Integer uid: usecaseIdList){
                for(Usecase usecase: usecases){
                    if(usecase.getId().equals(uid)){
                        authorized = true;
                        break top;
                    }
                }
            }
            if(!authorized) throw new NoPrivilegeException(message);
        }

        return authenticatedUser;
    }

    public List<Usecase> getUsecases(User user){
        List<Role> roles = user.getRoleList();
        List<Usecase> privileges = new ArrayList<>();
        for(Role role : roles) privileges.addAll(role.getUsecaseList());
        return privileges.stream().distinct().collect(Collectors.toList());
    }

    public ClientToken getToken(LoginRequest loginRequest) {

        User user = getUserByUsername(loginRequest.getUsername());
        if(user==null) throw new AuthenticationFailedException();

        if(!BCrypt.checkpw(loginRequest.getPassword(),user.getPassword())){
            int attempts = user.getFailedattempts()==null ? 1 : user.getFailedattempts()+1;
            if(attempts<3) user.setFailedattempts(attempts);
            else if(attempts==3){
                user.setStatus(Userstatus.LOCKED.toString());
                user.setTolocked(LocalDateTime.now());
            }
            userDao.save(user);
            throw new AuthenticationFailedException();
        }

        String status = user.getStatus();

        if(status.equals(Userstatus.DEACTIVATED.toString())) throw new AuthenticationFailedException("User is Deactivated");

        if(status.equals(Userstatus.LOCKED.toString())){

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime lockedAt = user.getTolocked();
            LocalDateTime unlockAt = lockedAt.plusSeconds(USER_LOCKED_PERIOD_MILLIS/1000);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");

            long period = ChronoUnit.MILLIS.between(lockedAt, now);
            if(period < USER_LOCKED_PERIOD_MILLIS){
                throw new LockedException("User is temporary locked.\nYou have to wait until "+unlockAt.format(formatter));
            }else{
                user.setStatus(Userstatus.ACTIVE.toString());
                user.setTolocked(null);
                user.setFailedattempts(0);
                userDao.save(user);
            }
        }

        ClientToken clientToken = new ClientToken();
        Token token = new Token();

        token.setUser(user);
        token.setTocreation(LocalDateTime.now());
        token.setStatus(Tokenstatus.ACTIVE.toString());

        if(!loginRequest.isRememberMe()){
            token.setToexpiration(LocalDateTime.now().plusHours(TOKEN_EXPIRATION_PERIOD_HOURS));
            clientToken.setToexpired(token.getToexpiration());
        }

        token.setId(UUID.randomUUID().toString());
        tokenDao.save(token);

        clientToken.setText(generateToken(token));
        clientToken.setTocreated(LocalDateTime.now());
        clientToken.setUserlink("/users/"+user.getId());

        return clientToken;
    }

    public void destroyActiveToken(HttpServletRequest request) {
        Token token = getActiveToken(request);
        token.setStatus(Tokenstatus.DELETED.toString());
        tokenDao.save(token);
    }

    public List<Token> getActiveTokensByUser(User user){

        CriteriaBuilder criteriaBuilder = tokenDao.getCriteriaBuilder();
        CriteriaQuery<Token> criteriaQuery = criteriaBuilder.createQuery(Token.class);
        Root<Token> root = criteriaQuery.from(Token.class);
        criteriaQuery.select(root)
                .where(criteriaBuilder.equal(root.get("status"), Tokenstatus.ACTIVE.toString()))
                .where(criteriaBuilder.equal(root.get("user_id"),user.getId()));

        TypedQuery<Token> query = tokenDao.createQuery(criteriaQuery);

        List<Token> activeTokens = query.getResultList();
        List<Token> updatedActiveTokens = new ArrayList<>();
        for(Token token : activeTokens){
            if(token.getToexpiration() != null){

                LocalDateTime now = LocalDateTime.now();
                LocalDateTime expAt = token.getToexpiration();

                long period = ChronoUnit.MILLIS.between(expAt, now);

                if(period > 0){
                    token.setStatus(Tokenstatus.EXPIRED.toString());
                    tokenDao.save(token);
                    continue;
                }
            }
            updatedActiveTokens.add(token);
        }
        return updatedActiveTokens;
    }

    public void destroyTokens(List<Token> tokens) {
        for(Token token: tokens) destroyToken(token);
    }

    public void destroyToken(Token token){
        if(token.getStatus().equals(Tokenstatus.ACTIVE.toString())){
            if(token.getToexpiration()!=null){

                LocalDateTime now = LocalDateTime.now();
                LocalDateTime expAt = token.getToexpiration();
                long period = ChronoUnit.MILLIS.between(expAt, now);

                if(period > 0){
                    token.setStatus(Tokenstatus.EXPIRED.toString());
                    tokenDao.save(token);
                    return;
                }
            }
            token.setStatus(Tokenstatus.DELETED.toString());
            tokenDao.save(token);
        }
    }

    private String generateToken(Token token) {
        Claims claims = Jwts.claims().setSubject(token.getId());
        claims.put("id", token.getId());
        return Jwts.builder().setClaims(claims).signWith(SignatureAlgorithm.HS512, SECRET_KEY).compact();
    }

    public boolean isStrongPassword(String password){
        int score = 0;

        if( password.length() >= 6 ) score += 1;
        if( password.length() >= 8 ) score += 2;

        if( password.matches("(?=.*[0-9]).*") ) score += 1;
        if( password.matches("(?=.*[a-z]).*") ) score += 1;
        if( password.matches("(?=.*[A-Z]).*") ) score += 1;
        if( password.matches("(?=.*[~`!@#$,\\.%\\/^\\\\&\\?*\\|()_\\-+=\\{\\}\\[\\]]).*") ) score += 2;

        return score >= 8;
    }

    public String getHashedPassword(String plainPassword){
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt());
    }

    public Boolean isMatchedHashPassword(String plainText, String hashedText){
        return BCrypt.checkpw(plainText, hashedText);
    }
}
