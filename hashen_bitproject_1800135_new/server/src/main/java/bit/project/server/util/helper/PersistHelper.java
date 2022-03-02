package bit.project.server.util.helper;

import java.util.function.Supplier;

public abstract class PersistHelper {

    public static <T> T save(Supplier<T> func) throws InterruptedException {
        return save(func, 3);
    }

    public static <T> T save(Supplier<T> func, int tryCount) throws InterruptedException {
        int c = 1;
        while (true){
            try{
                return func.get();
            } catch (Exception e){
                if(c >= tryCount) throw e;
                Thread.sleep(100);
                c++;
            }
        }
    }

}
