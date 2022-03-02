package bit.project.server.util.validation;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;
import java.util.*;

public class ValidationErrorBagSerializer extends StdSerializer<ValidationErrorBag> {


    protected ValidationErrorBagSerializer() {
        this(null);
    }

    protected ValidationErrorBagSerializer(Class<ValidationErrorBag> t) {
        super(t);
    }

    @Override
    public void serialize(ValidationErrorBag ob, JsonGenerator gen, SerializerProvider provider) throws IOException {

        HashMap<String,ArrayList> errors = ob.getErrors();
        gen.writeStartObject();
        Iterator iterator = errors.entrySet().iterator();

        while (iterator.hasNext()) {
            Map.Entry property = (Map.Entry)iterator.next();
            gen.writeObjectField(property.getKey().toString(),property.getValue());
        }
        gen.writeEndObject();
    }
}
