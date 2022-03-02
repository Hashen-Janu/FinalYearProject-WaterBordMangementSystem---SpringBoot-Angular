package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class ConnectionstatusData extends AbstractSeedClass {

    public ConnectionstatusData(){
        addIdNameData(1, "Connected");
        addIdNameData(2, "Temporary Disconnected");
        addIdNameData(3, "Disconnected");
    }

}