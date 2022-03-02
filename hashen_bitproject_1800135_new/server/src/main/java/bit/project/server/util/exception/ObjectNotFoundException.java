package bit.project.server.util.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class ObjectNotFoundException extends ResponseStatusException {
    public ObjectNotFoundException(String message, Exception exception){
        super(HttpStatus.NOT_FOUND, message, exception);
    }

    public ObjectNotFoundException(){
        this("Not Found",null);
    }

    public ObjectNotFoundException(String message){
        this(message,null);
    }
}
