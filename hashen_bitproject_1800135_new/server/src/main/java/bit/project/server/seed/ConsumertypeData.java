package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class ConsumertypeData extends AbstractSeedClass {

    public ConsumertypeData(){
        addIdNameData(1, "Person");
        addIdNameData(2, "Company");
    }

}