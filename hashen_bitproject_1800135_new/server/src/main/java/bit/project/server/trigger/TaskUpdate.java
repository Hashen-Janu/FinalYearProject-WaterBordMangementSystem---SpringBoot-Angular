package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class TaskUpdate extends Trigger{

    @Override
    public String getName() {
        return "task_update";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_UPDATE;
    }

    @Override
    public String getTableName() {
        return "taskallocation";
    }

    public TaskUpdate(){

        addBodyLine("    IF NEW.tasktype_id = 2 THEN");
        addBodyLine("       IF NEW.taskallocationstatus_id = 2 THEN");
        addBodyLine("           update complaint set complaintstatus_id = 2  where id = NEW.complaint_id;");
        addBodyLine("       END IF;");
        addBodyLine("    END IF;");
        addBodyLine("    IF NEW.tasktype_id = 4 THEN");
        addBodyLine("       IF NEW.taskallocationstatus_id = 2 THEN");
        addBodyLine("           update disconnectionrequest set disconnectionrequeststatus_id = 2  where id = NEW.disconnectionrequest_id;");
        addBodyLine("       END IF;");
        addBodyLine("    END IF;");
        addBodyLine("    IF NEW.tasktype_id = 1 THEN");
        addBodyLine("       IF NEW.taskallocationstatus_id = 2 THEN");
        addBodyLine("           update connectionrequest set connectionrequeststatus_id = 2  where id = NEW.connectionrequest_id;");
        addBodyLine("       END IF;");
        addBodyLine("    END IF;");
        addBodyLine("    IF NEW.tasktype_id = 3 THEN");
        addBodyLine("       IF NEW.taskallocationstatus_id = 2 THEN");
        addBodyLine("           update modificationrequest set modificationrequeststatus_id = 2  where id = NEW.modificationrequest_id;");
        addBodyLine("       END IF;");
        addBodyLine("    END IF;");
        addBodyLine("    IF NEW.tasktype_id = 5 THEN");
        addBodyLine("       IF NEW.taskallocationstatus_id = 2 THEN");
        addBodyLine("           update reconnectionrequest set reconnectionrequeststatus_id = 2  where id = NEW.reconnectionrequest_id;");
        addBodyLine("       END IF;");
        addBodyLine("    END IF;");
    }

}