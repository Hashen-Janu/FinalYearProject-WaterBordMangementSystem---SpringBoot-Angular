package bit.project.server.util.helper;

import lombok.Data;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;

@Component
public class CodeGenerator {

    private EntityManager em;
    private DateFormat dateFormat = new SimpleDateFormat("yy");

    public CodeGenerator(EntityManager em){
        this.em = em;
    }

    public String getNextId(CodeGeneratorConfig config){

        int prefixLength = config.prefix.length();
        int numericLength = config.length - prefixLength;

        String queryText = "select max(substr("+config.columnName+","+(prefixLength+1)+","+numericLength+")) as c from "+config.tableName;
        Query query = em.createNativeQuery(queryText);
        String c = (String) query.getSingleResult();

        if(!config.yearlyRenew){
            if(c == null){
                return config.prefix + String.format("%0"+numericLength+"d", 1);
            }else{
                return config.prefix + String.format("%0"+numericLength+"d", Integer.parseInt(c)+1);
            }
        }

        numericLength -= 2;

        String currentYear = dateFormat.format(Calendar.getInstance().getTime());

        if(c == null) return config.prefix + currentYear + String.format("%0"+numericLength+"d", 1);

        String maxIdYear = c.substring(0,2);
        Integer numericSegment = Integer.parseInt(c.substring(2));

        if(currentYear.equals(maxIdYear)){
            return config.prefix + currentYear + String.format("%0"+numericLength+"d", numericSegment+1);
        }

        return config.prefix + currentYear + String.format("%0"+numericLength+"d", 1);
    }

    @Data
    public static class CodeGeneratorConfig{

        private String tableName;
        private String columnName;
        private Integer length;
        private String prefix;
        private Boolean yearlyRenew;

        public CodeGeneratorConfig(String tableName){
            this.tableName = tableName;
            this.columnName = "code";
            this.length = 10;
            this.prefix = "";
            this.yearlyRenew = true;
        }
    }

}
