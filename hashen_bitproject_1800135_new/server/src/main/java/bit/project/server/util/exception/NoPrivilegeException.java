package bit.project.server.util.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class NoPrivilegeException extends ResponseStatusException {
    public NoPrivilegeException(String message, Exception exception){
        super(HttpStatus.FORBIDDEN, message, exception);
    }

    public NoPrivilegeException(){
        this("No Privilege",null);
    }

    public NoPrivilegeException(String message){
        this(message,null);
    }
}
