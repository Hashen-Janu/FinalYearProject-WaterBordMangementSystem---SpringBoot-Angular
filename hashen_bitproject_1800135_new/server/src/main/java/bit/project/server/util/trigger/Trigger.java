package bit.project.server.util.trigger;

import java.util.ArrayList;

public abstract class Trigger {

    public enum Event{
        AFTER_INSERT,
        BEFORE_INSERT,
        AFTER_DELETE,
        BEFORE_DELETE,
        AFTER_UPDATE,
        BEFORE_UPDATE;
    }

    public abstract String getName();
    public abstract Event getEvent();
    public abstract String getTableName();

    private ArrayList<String> bodyLines = new ArrayList<>();

    public final void addBodyLine(String line){
        bodyLines.add(line);
    }

    public final String getTriggerBody() {
        StringBuilder text = new StringBuilder();
        for (String line: bodyLines) {
            text.append(line).append("\n");
        }
        return text.toString();
    }

}
