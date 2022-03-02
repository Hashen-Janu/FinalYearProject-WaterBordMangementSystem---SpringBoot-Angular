package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import java.time.LocalDate;
import javax.persistence.*;
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
public class Iorder{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate doordered;

    private LocalDate dorequired;

    private LocalDate dorecived;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Iorderstatus iorderstatus;

    @OneToMany(mappedBy="iorder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Orderitem> orderitemList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "iorder")
    private List<Itemrecive> iorderItemreciveList;


    public Iorder(Integer id){
        this.id = id;
    }

    public Iorder(Integer id, String code){
        this.id = id;
        this.code = code;
    }

}