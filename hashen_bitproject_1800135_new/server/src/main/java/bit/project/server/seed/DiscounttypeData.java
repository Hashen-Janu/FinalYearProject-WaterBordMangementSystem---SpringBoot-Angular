package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class DiscounttypeData extends AbstractSeedClass {

    public DiscounttypeData(){
        addIdNameData(1, "Fixed Amount");
        addIdNameData(2, "Percentage");
    }

}