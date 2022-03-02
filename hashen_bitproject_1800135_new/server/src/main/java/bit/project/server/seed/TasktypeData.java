package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class TasktypeData extends AbstractSeedClass {

    public TasktypeData(){
        addIdNameData(1, "New Connection");
        addIdNameData(2, "Consumer Complain");
        addIdNameData(3, "Consumer Modification");
        addIdNameData(4, "Connection Disconnection");
        addIdNameData(5, "Connection Reconnection");
    }

}