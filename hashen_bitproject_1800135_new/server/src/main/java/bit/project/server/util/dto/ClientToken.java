package bit.project.server.util.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ClientToken {
    private String text;
    private LocalDateTime tocreated;
    private LocalDateTime toexpired;
    private String userlink;
}
