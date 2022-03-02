package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class ComplainttypeData extends AbstractSeedClass {

    public ComplainttypeData(){
        addIdNameData(1, "Private");
        addIdNameData(2, "Public");
    }

}