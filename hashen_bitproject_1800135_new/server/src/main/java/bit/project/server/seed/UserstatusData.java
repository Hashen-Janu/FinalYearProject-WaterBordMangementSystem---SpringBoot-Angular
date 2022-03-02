package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class UserstatusData extends AbstractSeedClass {

    public UserstatusData(){
        addIdNameData(1, "Active");
        addIdNameData(2, "Locked");
        addIdNameData(3, "Deactivated");
    }

}