package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class VillageData extends AbstractSeedClass {

    public VillageData(){

        Hashtable<String, Object> d1 = new Hashtable();
        d1.put("id", 1);
        d1.put("name", "Hadunkatiya");
        d1.put("city_id", 1 );
        addData(d1);

        Hashtable<String, Object> d2 = new Hashtable();
        d2.put("id", 2);
        d2.put("name", "Kanukatiya");
        d2.put("city_id", 1);
        addData(d2);

        Hashtable<String, Object> d3 = new Hashtable();
        d3.put("id", 3);
        d3.put("name", "Bataatha");
        d3.put("city_id", 2);
        addData(d3);

    }

}