package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class OwnershiptypeData extends AbstractSeedClass {

    public OwnershiptypeData(){
        addIdNameData(1, "Owner");
        addIdNameData(2, "Tenant");
        addIdNameData(3, "Lender");
    }

}