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
public class Item{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private BigDecimal price;

    private Integer qty;

    private Integer rop;

    private String photo;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private List<Connectionrequestitem> connectionrequestitemList;

    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private List<Connectionitem> connectionitemList;

    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private List<Disposalitem> disposalitemList;

    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private List<Orderitem> orderitemList;

    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private List<Itemreciveitem> itemreciveitemList;

    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private List<Itemreturnitem> itemreturnitemList;

    @JsonIgnore
    @OneToMany(mappedBy = "item")
    private List<Taskallocationitem> taskallocationitemList;


    public Item(Integer id){
        this.id = id;
    }

    public Item(Integer id, String code, String name, BigDecimal price){
        this.id = id;
        this.code = code;
        this.name = name;
        this.price = price;
    }

}