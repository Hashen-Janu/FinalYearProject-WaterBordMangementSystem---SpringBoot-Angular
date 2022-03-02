package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class ConnectionrequeststatusData extends AbstractSeedClass {

    public ConnectionrequeststatusData(){
        addIdNameData(1, "Pending");
        addIdNameData(2, "Paid");
        addIdNameData(3, "Done");
    }

}