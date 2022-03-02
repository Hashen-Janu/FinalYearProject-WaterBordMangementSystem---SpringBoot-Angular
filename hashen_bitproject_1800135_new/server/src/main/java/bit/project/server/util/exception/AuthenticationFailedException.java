package bit.project.server.util.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class AuthenticationFailedException extends ResponseStatusException {
    public AuthenticationFailedException(String message, Exception exception){
        super(HttpStatus.UNAUTHORIZED, message, exception);
    }

    public AuthenticationFailedException(){
        this("Authentication Failed",null);
    }

    public AuthenticationFailedException(String message){
        this(message,null);
    }
}
