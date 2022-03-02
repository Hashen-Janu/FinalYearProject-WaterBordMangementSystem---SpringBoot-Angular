package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
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
public class Gramaniladharidiv{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @ManyToOne(optional=false)
    private Village village;


    @JsonIgnore
    @OneToMany(mappedBy = "gramaniladharidiv")
    private List<Connection> gramaniladharidivConnectionList;

    @JsonIgnore
    @OneToMany(mappedBy = "gramaniladharidiv")
    private List<Connectionrequest> gramaniladharidivConnectionrequestList;

    @JsonIgnore
    @OneToMany(mappedBy = "gramaniladharidiv")
    private List<Taskallocation> gramaniladharidivTaskallocationList;


    public Gramaniladharidiv(Integer id){
        this.id = id;
    }

}