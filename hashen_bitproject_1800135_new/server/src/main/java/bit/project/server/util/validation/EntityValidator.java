package bit.project.server.util.validation;

import bit.project.server.util.exception.DataValidationException;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.ValidatorFactory;
import java.util.Set;

public class EntityValidator {

    public static void validate(Object object){
        ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory();
        javax.validation.Validator validator = validatorFactory.getValidator();
        ValidationErrorBag errorBag = new ValidationErrorBag();

        Set<ConstraintViolation<Object>> violations;

        try{
             violations = validator.validate(object);
        }catch (Exception e){
            e.printStackTrace();
            throw e;
        }

        for (ConstraintViolation v : violations) {
            errorBag.add(v.getPropertyPath().toString(), v.getMessage());
        }

        if(errorBag.count()>0){ throw new DataValidationException(errorBag); }
    }

}
