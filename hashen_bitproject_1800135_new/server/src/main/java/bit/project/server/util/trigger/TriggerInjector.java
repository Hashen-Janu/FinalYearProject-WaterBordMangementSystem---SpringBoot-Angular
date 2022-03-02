package bit.project.server.util.trigger;

import bit.project.server.util.helper.StringHelper;
import bit.project.server.util.seed.SeedClass;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AssignableTypeFilter;
import org.springframework.stereotype.Component;
import org.springframework.transaction.UnexpectedRollbackException;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceException;
import javax.persistence.Query;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.*;

@Component
public class TriggerInjector {

    @Autowired
    EntityManager entityManager;

    @Transactional
    public void inject() throws IllegalAccessException, ClassNotFoundException, NoSuchMethodException, InvocationTargetException, InstantiationException{
        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter(new AssignableTypeFilter(Trigger.class));

        Set<BeanDefinition> classes = scanner.findCandidateComponents(getClass().getPackageName().split("\\.")[0]);

        for (BeanDefinition bd : classes) {
            Class cls = Class.forName(bd.getBeanClassName());
            String className = cls.getSimpleName();
            Trigger trigger = (Trigger) cls.getDeclaredConstructor().newInstance();
            String tableName = trigger.getTableName();
            String triggerName = trigger.getName();
            String triggerBody = trigger.getTriggerBody();
            Trigger.Event event = trigger.getEvent();

            String dropQuery = "DROP TRIGGER IF EXISTS `"+triggerName+"`";
            String createQuery = "CREATE TRIGGER `"+triggerName+"`\n";
            switch (event){
                case AFTER_DELETE: createQuery += "AFTER DELETE "; break;
                case AFTER_UPDATE: createQuery += "AFTER UPDATE "; break;
                case AFTER_INSERT: createQuery += "AFTER INSERT "; break;
                case BEFORE_DELETE: createQuery += "BEFORE DELETE "; break;
                case BEFORE_UPDATE: createQuery += "BEFORE UPDATE "; break;
                case BEFORE_INSERT: createQuery += "BEFORE INSERT "; break;
            }
            createQuery += "ON `"+tableName+"` FOR EACH ROW\n";
            createQuery += "BEGIN\n";
            createQuery += triggerBody;
            createQuery += "END;";

            try{
                entityManager.createNativeQuery(dropQuery).executeUpdate();
                entityManager.createNativeQuery(createQuery).executeUpdate();
            }catch (PersistenceException | UnexpectedRollbackException e){
                System.out.println("\u001B[31mWrong trigger at "+className+" class\u001B[33m");
                System.out.println(createQuery);
                System.out.println("\u001B[0m");
            }

        }
    }

}
