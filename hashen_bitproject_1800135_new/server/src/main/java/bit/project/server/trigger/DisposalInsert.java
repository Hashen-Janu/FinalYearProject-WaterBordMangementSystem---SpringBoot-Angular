package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class DisposalInsert extends Trigger{

    @Override
    public String getName() {
        return "disposal_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "disposalitem";
    }

    public DisposalInsert(){
        addBodyLine("    update item set qty = qty - NEW.qty where id = NEW.item_id;");
    }

}