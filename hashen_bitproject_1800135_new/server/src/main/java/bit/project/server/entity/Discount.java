package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
import java.math.BigDecimal;
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
public class Discount{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private BigDecimal value;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Discountstatus discountstatus;

    @ManyToOne
    private Discounttype discounttype;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @ManyToMany(mappedBy = "discountList")
    private List<Connectionrequest> connectionrequestList;

    @ManyToMany
        @JoinTable(
        name="discountconnectiontype",
        joinColumns=@JoinColumn(name="discount_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="connectiontype_id", referencedColumnName="id")
    )
    private List<Connectiontype> connectiontypeList;


    public Discount(Integer id){
        this.id = id;
    }

    public Discount(Integer id, String code, String name){
        this.id = id;
        this.code = code;
        this.name = name;
    }

}