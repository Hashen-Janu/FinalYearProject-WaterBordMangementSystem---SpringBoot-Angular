package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class PlacetypeData extends AbstractSeedClass {

    public PlacetypeData(){
        addIdNameData(1, "Domestic");
        addIdNameData(2, "Non Domestic");
    }

}