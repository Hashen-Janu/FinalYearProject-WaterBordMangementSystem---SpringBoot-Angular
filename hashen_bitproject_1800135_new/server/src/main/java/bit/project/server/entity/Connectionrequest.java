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
public class Connectionrequest{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String mobile;

    private String land;

    private String pobox;

    private String street;

    @Lob
    private String postaladdress;

    private BigDecimal appicationfee;

    private BigDecimal connectionfee;

    private BigDecimal laborcost;

    private BigDecimal vat;

    private String payslip;

    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Consumer consumer;

    @ManyToOne
    private Gramaniladharidiv gramaniladharidiv;

    @OneToMany(mappedBy="connectionrequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Connectionrequestitem> connectionrequestitemList;

    @ManyToOne
    private Placetype placetype;

    @ManyToOne
    private Ownershiptype ownershiptype;

    @ManyToOne
    private Connectiontype connectiontype;

    @ManyToOne
    private Connectionrequeststatus connectionrequeststatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "connectionrequest")
    private List<Taskallocation> connectionrequestTaskallocationList;


    @ManyToMany
        @JoinTable(
        name="connectionrequestdiscount",
        joinColumns=@JoinColumn(name="connectionrequest_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="discount_id", referencedColumnName="id")
    )
    private List<Discount> discountList;


    public Connectionrequest(Integer id){
        this.id = id;
    }

    public Connectionrequest(Integer id, String code, Consumer consumer, Gramaniladharidiv gramaniladharidiv, String payslip, String pobox, String street){
        this.id = id;
        this.code = code;
        this.consumer = consumer;
        this.gramaniladharidiv = gramaniladharidiv;
        this.payslip = payslip;
        this.pobox = pobox;
        this.street = street;
    }

}