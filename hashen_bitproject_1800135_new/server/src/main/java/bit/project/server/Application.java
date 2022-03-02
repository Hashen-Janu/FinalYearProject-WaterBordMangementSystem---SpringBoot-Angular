package bit.project.server;

import bit.project.server.util.seed.Seeder;
import bit.project.server.util.trigger.TriggerInjector;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class Application {


	public static void main(String[] args) throws Exception {

		ApplicationContext context = SpringApplication.run(Application.class, args);

		Seeder seeder = context.getBean(Seeder.class);
		seeder.seed();

		TriggerInjector triggerInjector = context.getBean(TriggerInjector.class);
		triggerInjector.inject();
	}

}
