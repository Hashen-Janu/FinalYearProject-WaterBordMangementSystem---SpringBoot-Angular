package bit.project.server.util.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class ConflictException extends ResponseStatusException {
    public ConflictException(String message, Exception exception){
        super(HttpStatus.CONFLICT, message, exception);
    }

    public ConflictException(){
        this("Conflict",null);
    }

    public ConflictException(String message){
        this(message,null);
    }
}
