package bit.project.server.util.exception;


import bit.project.server.util.validation.ValidationErrorBag;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class DataValidationException extends ResponseStatusException {
    public DataValidationException(ValidationErrorBag errorBag, Exception exception){
        super(HttpStatus.BAD_REQUEST, errorBag.toString(), exception);
    }

    public DataValidationException(ValidationErrorBag errorBag){
        this(errorBag,null);
    }
}
