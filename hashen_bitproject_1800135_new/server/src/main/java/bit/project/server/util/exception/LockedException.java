package bit.project.server.util.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class LockedException extends ResponseStatusException {
    public LockedException(String message, Exception exception){
        super(HttpStatus.LOCKED, message, exception);
    }

    public LockedException(){
        this("Locked",null);
    }

    public LockedException(String message){
        this(message,null);
    }
}
