package bit.project.server.util.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class InternalServerErrorException extends ResponseStatusException {
    public InternalServerErrorException(String message, Exception exception){
        super(HttpStatus.INTERNAL_SERVER_ERROR, message, exception);
    }

    public InternalServerErrorException(){
        this("Internal Server Error",null);
    }

    public InternalServerErrorException(String message){
        this(message,null);
    }
}
