package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class CityData extends AbstractSeedClass {

    public CityData(){

        Hashtable<String, Object> d1 = new Hashtable();
        d1.put("id", 1);
        d1.put("name", "Agunukolapalassa");
        d1.put("divsecretariat_id", 1 );
        addData(d1);

        Hashtable<String, Object> d2 = new Hashtable();
        d2.put("id", 2);
        d2.put("name", "Hungama");
        d2.put("divsecretariat_id", 1);
        addData(d2);

        Hashtable<String, Object> d3 = new Hashtable();
        d3.put("id", 3);
        d3.put("name", "Ranna");
        d3.put("divsecretariat_id", 1);
        addData(d3);

    }

}