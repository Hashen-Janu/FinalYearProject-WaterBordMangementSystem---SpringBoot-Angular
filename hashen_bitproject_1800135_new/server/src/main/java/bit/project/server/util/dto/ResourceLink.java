package bit.project.server.util.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResourceLink{
    private Object id;
    private String link;

    public ResourceLink(Object id, String link){
        this.id = id;
        this.link = link;
    }
}
