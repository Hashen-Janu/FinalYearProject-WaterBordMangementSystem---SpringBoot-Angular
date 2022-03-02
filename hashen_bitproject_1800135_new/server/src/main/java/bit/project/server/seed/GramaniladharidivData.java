package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class GramaniladharidivData extends AbstractSeedClass {

    public GramaniladharidivData(){

        Hashtable<String, Object> d1 = new Hashtable();
        d1.put("id", 1);
        d1.put("name", "Kiula Uthura");
        d1.put("village_id", 1 );
        addData(d1);

        Hashtable<String, Object> d2 = new Hashtable();
        d2.put("id", 2);
        d2.put("name", "Kiula Dakuna");
        d2.put("village_id", 1);
        addData(d2);

        Hashtable<String, Object> d3 = new Hashtable();
        d3.put("id", 3);
        d3.put("name", "Bataatha Dakuna");
        d3.put("village_id", 3);
        addData(d3);

        Hashtable<String, Object> d4 = new Hashtable();
        d4.put("id", 4);
        d4.put("name", "Bataatha Uthura");
        d4.put("village_id", 3);
        addData(d4);

        Hashtable<String, Object> d5 = new Hashtable();
        d5.put("id", 5);
        d5.put("name", "Kanukatya Dakuna");
        d5.put("village_id", 2);
        addData(d5);

        Hashtable<String, Object> d6 = new Hashtable();
        d6.put("id", 6);
        d6.put("name", "Kanukatya Uthura");
        d6.put("village_id", 2);
        addData(d6);

    }

}