package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class TaskallocationInsert extends Trigger{

    @Override
    public String getName() {
        return "taskallocation_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "taskallocationitem";
    }

    public TaskallocationInsert(){
        addBodyLine("    update item set qty = qty - NEW.qty where id = NEW.item_id;");
    }

}