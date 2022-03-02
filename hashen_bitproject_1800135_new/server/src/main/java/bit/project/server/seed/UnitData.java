package bit.project.server.seed;

import bit.project.server.util.seed.AbstractSeedClass;
import bit.project.server.util.seed.SeedClass;

import java.util.Hashtable;

@SeedClass
public class UnitData extends AbstractSeedClass {

    public UnitData(){

        addIdNameData(1, "Normal");
        addIdNameData(2, "Emergency");

    }

}
