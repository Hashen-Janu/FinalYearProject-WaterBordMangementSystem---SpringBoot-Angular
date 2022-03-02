package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class DesignationData extends AbstractSeedClass {

    public DesignationData(){
        addIdNameData(1, "OIC");
        addIdNameData(2, "Technical Officer");
        addIdNameData(3, "Technical engineer");
        addIdNameData(4, "Labour");
        addIdNameData(5, "Management Assistant");
    }

}