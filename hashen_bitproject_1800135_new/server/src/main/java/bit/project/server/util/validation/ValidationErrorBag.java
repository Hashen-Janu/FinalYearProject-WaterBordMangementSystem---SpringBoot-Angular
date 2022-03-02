package bit.project.server.util.validation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.*;

@JsonSerialize(using = ValidationErrorBagSerializer.class)
public class ValidationErrorBag {
    private HashMap<String, ArrayList> errors;

    public ValidationErrorBag(){
        errors = new HashMap<>();
    }

    public void merge(ValidationErrorBag bag){
        Iterator iterator = bag.getErrors().entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry ele = (Map.Entry)iterator.next();
            if(!errors.containsKey(ele.getKey())){
                errors.put(ele.getKey().toString(),new ArrayList());
            }

            List<String> oldValues = errors.get(ele.getKey());
            List<String> newValues = (ArrayList)ele.getValue();
            for(String newValue : newValues){
                if(!oldValues.contains(newValue)){
                    errors.get(ele.getKey()).add(newValues);
                }
            }
        }
    }

    public void add(String property, String message){
        if(!errors.containsKey(property)){
            errors.put(property,new ArrayList());
        }

        errors.get(property).add(message);
    }

    public HashMap<String,ArrayList> getErrors(){
        return errors;
    }

    public int count(){
        return errors.size();
    }

    @Override
    public String toString() {
        try {
            return new ObjectMapper().writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "";
        }
    }
}
