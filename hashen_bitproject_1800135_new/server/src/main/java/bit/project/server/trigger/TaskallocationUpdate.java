package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class TaskallocationUpdate extends Trigger{

    @Override
    public String getName() {
        return "taskallocation_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "taskallocationitem";
    }

    public TaskallocationUpdate(){
        addBodyLine("    DECLARE deference int(4) DEFAULT 0;");
        addBodyLine("");
        addBodyLine("    IF OLD.taskallocationitem.qty != NEW.taskallocationitem.qty THEN");
        addBodyLine("        SET deference = NEW.taskallocationitem.qty - OLD.taskallocationitem.qty;");
        addBodyLine("        update item set qty = qty + deference where id = NEW.taskallocationitem.item_id;");
        addBodyLine("    END IF;");
    }

}