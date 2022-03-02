package bit.project.server.util.seed;

import java.util.Hashtable;
import java.util.LinkedList;

public abstract class AbstractSeedClass {

    private final LinkedList<Hashtable<String, Object>> data = new LinkedList<>();

    protected void addData(Hashtable<String, Object> dataitem){
        this.data.add(dataitem);
    }

    protected void addIdNameData(int id, String name){
        Hashtable<String, Object> t = new Hashtable();
        t.put("id", id);
        t.put("name", name);
        addData(t);
    }
}
