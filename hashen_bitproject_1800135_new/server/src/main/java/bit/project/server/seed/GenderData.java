package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class GenderData extends AbstractSeedClass {

    public GenderData(){
        addIdNameData(1, "Male");
        addIdNameData(2, "Female");
    }

}