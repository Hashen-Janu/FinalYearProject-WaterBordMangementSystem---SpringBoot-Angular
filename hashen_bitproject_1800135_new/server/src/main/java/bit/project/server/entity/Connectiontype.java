package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
import java.math.BigDecimal;
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
public class Connectiontype{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private BigDecimal fee;

    private BigDecimal value;

    private BigDecimal secdeposit;

    private BigDecimal nonrefdeposit;

    private LocalDateTime tocreation;


    @OneToMany(mappedBy="connectiontype", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Connectionitem> connectionitemList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "connectiontype")
    private List<Connectionrequest> connectiontypeConnectionrequestList;


    @JsonIgnore
    @ManyToMany(mappedBy = "connectiontypeList")
    private List<Discount> discountList;


    public Connectiontype(Integer id){
        this.id = id;
    }

    public Connectiontype(Integer id, String code, String name){
        this.id = id;
        this.code = code;
        this.name = name;
    }

}