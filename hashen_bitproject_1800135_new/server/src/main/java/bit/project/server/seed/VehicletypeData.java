package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class VehicletypeData extends AbstractSeedClass {

    public VehicletypeData(){
        addIdNameData(1, "Lorry");
        addIdNameData(2, "Cab");
        addIdNameData(3, "Tractor");
        addIdNameData(4, "Bruoser");
    }

}