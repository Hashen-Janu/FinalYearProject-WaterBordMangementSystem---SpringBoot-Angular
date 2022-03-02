package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class DisconnectiontypeData extends AbstractSeedClass {

    public DisconnectiontypeData(){
        addIdNameData(1, "Temporary");
        addIdNameData(2, "Permanent");
    }

}