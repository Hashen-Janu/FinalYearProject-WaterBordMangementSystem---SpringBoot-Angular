package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Complaint{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String contact;

    private LocalDate date;

    @Lob
    private String title;

    @Lob
    private String location;

    @Lob
    private String description;

    private String complainername;

    private LocalDateTime tocreation;


    @ManyToOne
    private Connection connection;

    @ManyToOne
    private Complainttype complainttype;

    @ManyToOne
    private Complaintstatus complaintstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "complaint")
    private List<Taskallocation> complaintTaskallocationList;


    public Complaint(Integer id){
        this.id = id;
    }

    public Complaint(Integer id, String code, Connection connection, String title, String location){
        this.id = id;
        this.code = code;
        this.connection = connection;
        this.title = title;
        this.location = location;
    }

}