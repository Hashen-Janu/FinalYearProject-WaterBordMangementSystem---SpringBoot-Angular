package bit.project.server.entity;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;
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
public class Consumer{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String firstname;

    private String lastname;

    private String nic;

    private String contact1;

    private String contact2;

    private String fax;

    private String email;

    private LocalDate doregisterd;

    private String landdeedno;

    private String landdeedphoto;

    private String companyname;

    private String designation;

    private String grcphoto;

    @Lob
    private String address;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Consumertype consumertype;

    @ManyToOne
    private Nametitle nametitle;

    @ManyToOne
    private Gender gender;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @OneToMany(mappedBy = "consumer")
    @JsonIgnoreProperties({"creator","tocreation","consumer"})
    private List<Connection> consumerConnectionList;

    @JsonIgnore
    @OneToMany(mappedBy = "consumer")
    private List<Connectionrequest> consumerConnectionrequestList;


    public Consumer(Integer id){
        this.id = id;
    }

    public Consumer(Integer id, String code, Consumertype consumertype, Nametitle nametitle, String firstname,
                    String lastname, String contact1, String contact2,String address){
        this.id = id;
        this.code = code;
        this.consumertype = consumertype;
        this.nametitle = nametitle;
        this.firstname = firstname;
        this.lastname = lastname;
        this.contact1 = contact1;
        this.contact2 = contact2;
        this.address = address;
    }

}