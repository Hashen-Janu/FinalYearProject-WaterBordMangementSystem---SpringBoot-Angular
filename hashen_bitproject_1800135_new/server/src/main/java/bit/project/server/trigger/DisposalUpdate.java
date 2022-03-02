package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class DisposalUpdate extends Trigger {

    @Override
    public String getName() {
        return "disposal_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "disposalitem";
    }

    public DisposalUpdate() {
        addBodyLine("    DECLARE deference int(11) DEFAULT 0;");
//        addBodyLine("    IF OLD.item_id = NEW.item_id THEN");
        addBodyLine("       IF OLD.qty != NEW.qty THEN");
        addBodyLine("           SET deference = NEW.qty - OLD.qty;");
        addBodyLine("           update item set qty = qty - deference where id = NEW.item_id;");
        addBodyLine("       END IF;");
//        addBodyLine("    END IF;");
//
//        addBodyLine("    IF OLD.item_id != NEW.item_id THEN");
//        addBodyLine("       update item set qty = qty + NEW.qty where id = NEW.item_id;");
//        addBodyLine("       update item set qty = qty - OLD.qty where id = OLD.item_id;");
//        addBodyLine("    END IF;");


//        addBodyLine("    DECLARE deference int(11) DEFAULT 0;");
//        addBodyLine("    IF OLD.item_id = NEW.item_id THEN");
//        addBodyLine("       IF OLD.qty != NEW.qty THEN");
//        addBodyLine("           SET deference = NEW.qty - OLD.qty;");
//        addBodyLine("           update item set qty = qty + deference where id = NEW.item_id;");
//        addBodyLine("       END IF;");
//        addBodyLine("    END IF;");
//
//        addBodyLine("    IF OLD.item_id != NEW.item_id THEN");
//        addBodyLine("       update item set qty = qty + NEW.qty where id = NEW.item_id;");
//        addBodyLine("       update item set qty = qty - OLD.qty where id = OLD.item_id;");
//        addBodyLine("    END IF;");

    }

}