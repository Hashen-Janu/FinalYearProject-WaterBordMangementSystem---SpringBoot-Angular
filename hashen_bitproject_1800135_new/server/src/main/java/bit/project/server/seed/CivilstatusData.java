package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class CivilstatusData extends AbstractSeedClass {

    public CivilstatusData(){
        addIdNameData(1, "Single");
        addIdNameData(2, "Married");
        addIdNameData(3, "Other");
    }

}