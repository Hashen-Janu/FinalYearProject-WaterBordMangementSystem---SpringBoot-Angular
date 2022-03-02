package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class EmployeestatusData extends AbstractSeedClass {

    public EmployeestatusData(){
        addIdNameData(1, "Working");
        addIdNameData(2, "Resigned");
        addIdNameData(3, "Suspended");
    }

}