package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class ReconnectionrequeststatusData extends AbstractSeedClass {

    public ReconnectionrequeststatusData(){
        addIdNameData(1, "Pending");
        addIdNameData(2, "Done");
        addIdNameData(3, "Cancelled");
    }

}