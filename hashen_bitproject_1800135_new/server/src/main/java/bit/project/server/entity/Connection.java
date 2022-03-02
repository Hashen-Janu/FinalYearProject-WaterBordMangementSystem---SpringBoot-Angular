package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import java.time.LocalDate;
import javax.persistence.Id;
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
public class Connection{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String mobile;

    private String land;

    private String pobox;

    private String street;

    private String meterno;

    private String meterseelno;

    private String metercircular;

    private String metersize;

    private String watersupplysize;

    private String initmeterreading;

    private LocalDate supplieddate;

    private String description;

    private LocalDateTime tocreation;


    @ManyToOne

    private Consumer consumer;

    @ManyToOne
    private Gramaniladharidiv gramaniladharidiv;

    @ManyToOne
    private Placetype placetype;

    @ManyToOne
    private Ownershiptype ownershiptype;

    @ManyToOne
    private Connectionstatus connectionstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "connection")
    private List<Complaint> connectionComplaintList;

    @JsonIgnore
    @OneToMany(mappedBy = "connection")
    private List<Disconnectionrequest> connectionDisconnectionrequestList;

    @JsonIgnore
    @OneToMany(mappedBy = "connection")
    private List<Modificationrequest> connectionModificationrequestList;

    @JsonIgnore
    @OneToMany(mappedBy = "connection")
    private List<Reconnectionrequest> connectionReconnectionrequestList;


    public Connection(Integer id){
        this.id = id;
    }

    public Connection(Integer id, String code, Consumer consumer, String mobile, Gramaniladharidiv gramaniladharidiv){
        this.id = id;
        this.code = code;
        this.consumer = consumer;
        this.mobile = mobile;
        this.gramaniladharidiv = gramaniladharidiv;
    }

}