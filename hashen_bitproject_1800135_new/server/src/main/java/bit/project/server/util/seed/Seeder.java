package bit.project.server.util.seed;

import bit.project.server.UsecaseList;
import bit.project.server.util.helper.StringHelper;
import bit.project.server.util.security.SystemModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.*;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.*;

@Component
public class Seeder {

    @Autowired
    EntityManager entityManager;

    @Transactional
    public void seed() throws IllegalAccessException, ClassNotFoundException, NoSuchFieldException, NoSuchMethodException, InvocationTargetException, InstantiationException {
        seedUsecases();

        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter(new AnnotationTypeFilter(SeedClass.class));

        Set<BeanDefinition> classes = scanner.findCandidateComponents(getClass().getPackageName().split("\\.")[0]);

        entityManager.createNativeQuery("SET FOREIGN_KEY_CHECKS=0").executeUpdate();

        for (BeanDefinition bd : classes) {
            Class cls = Class.forName(bd.getBeanClassName());
            String className = cls.getSimpleName();
            if(className.equalsIgnoreCase("UsecaseList")) continue;

            String tableName = StringHelper.PascalCaseToLowerSnakeCase(className.substring(0, className.length()-4));
            SeedClass seedClass = (SeedClass) cls.getAnnotation(SeedClass.class);

            entityManager.createNativeQuery("delete from "+tableName).executeUpdate();


            Object object = cls.getDeclaredConstructor().newInstance();
            Field dataField = cls.getSuperclass().getDeclaredField("data");
            dataField.setAccessible(true);
            LinkedList<Hashtable<String, Object>> data = (LinkedList<Hashtable<String, Object>>) dataField.get(object);

            for (Hashtable<String, Object> row : data) {

                StringJoiner columnList = new StringJoiner(",");
                StringJoiner questionList = new StringJoiner(",");
                ArrayList<Object> dataList = new ArrayList<>();


                for (Map.Entry<String, Object> entry : row.entrySet()) {
                    columnList.add(entry.getKey());
                    questionList.add("?");
                    dataList.add(entry.getValue());
                }

                String queryText = "insert into "+tableName+"("+columnList.toString()+") values("+questionList.toString()+")";
                Query query = entityManager.createNativeQuery(queryText);

                int c = 1;
                for (Object d : dataList) {
                    query.setParameter(c, d);
                    c++;
                }
                query.executeUpdate();
            }

        }

        entityManager.createNativeQuery("SET FOREIGN_KEY_CHECKS=1").executeUpdate();

    }

    private void seedUsecases() throws IllegalAccessException {
        HashMap<String, ArrayList<Tuple>> existingRoleusecases = new HashMap<>();
        Query roleusecaseQuery = entityManager.createNativeQuery("select r.usecase_id, r.role_id, u.task from roleusecase r inner join usecase u on r.usecase_id=u.id", Tuple.class);
        roleusecaseQuery.getResultStream().forEach((t)->{
            Tuple tuple = (Tuple) t;
            if(!existingRoleusecases.containsKey(tuple.get("task").toString())){
                existingRoleusecases.put(tuple.get("task").toString(), new ArrayList<>());
            }
            existingRoleusecases.get(tuple.get("task").toString()).add(tuple);
        });

        entityManager.createNativeQuery("delete from roleusecase").executeUpdate();
        entityManager.createNativeQuery("delete from usecase").executeUpdate();
        entityManager.createNativeQuery("delete from systemmodule").executeUpdate();

        Field[] declaredFields = UsecaseList.class.getDeclaredFields();
        HashMap<String, Integer> systemmodules = new HashMap<>();

        for (Field field : declaredFields) {
            if (java.lang.reflect.Modifier.isStatic(field.getModifiers())) {

                String systemModuleName;

                try{
                    systemModuleName = field.getAnnotation(SystemModule.class).value();
                }catch(NullPointerException e){
                    continue;
                }

                if(!systemmodules.containsKey(systemModuleName)){

                    String systemmoduleQueryText = "insert into systemmodule(id,name) values(?,?)";
                    Query systemmoduleQuery = entityManager.createNativeQuery(systemmoduleQueryText);
                    systemmoduleQuery.setParameter(1, systemmodules.size()+1);
                    systemmoduleQuery.setParameter(2, systemModuleName);
                    systemmoduleQuery.executeUpdate();
                    systemmodules.put(systemModuleName, systemmodules.size()+1);
                }

                String usecaseName = StringHelper.SnakeCaseToSentenceCase(field.getName());
                Integer usecaseId = ((UsecaseList)field.get(null)).value;

                String usecaseQueryText = "insert into usecase(id,task,systemmodule_id) values(?,?,?)";
                Query usecaseQuery = entityManager.createNativeQuery(usecaseQueryText);
                usecaseQuery.setParameter(1, usecaseId);
                usecaseQuery.setParameter(2, usecaseName);
                usecaseQuery.setParameter(3, systemmodules.get(systemModuleName));
                usecaseQuery.executeUpdate();

                if (existingRoleusecases.containsKey(usecaseName)){
                    for (Tuple tuple: existingRoleusecases.get(usecaseName)){
                        entityManager
                                .createNativeQuery("insert into roleusecase(role_id, usecase_id) values(?,?)")
                                .setParameter(1, Integer.valueOf(tuple.get("role_id").toString()))
                                .setParameter(2, usecaseId)
                                .executeUpdate();
                    }
                }

            }
        }
    }


}
