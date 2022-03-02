package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class NametitleData extends AbstractSeedClass {

    public NametitleData(){
        addIdNameData(1, "Mr.");
        addIdNameData(2, "Miss");
        addIdNameData(3, "Mrs.");
        addIdNameData(4, "Rev.");
        addIdNameData(5, "Dr.");
    }

}