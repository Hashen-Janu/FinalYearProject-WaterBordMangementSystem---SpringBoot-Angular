package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;
import javax.persistence.*;
import javax.persistence.Id;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Taskallocation{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate date;

    private LocalTime time;

    private String pobox;

    private String street;

    @Lob
    private String remarks;

    @Lob
    private String title;

    private LocalDateTime tocreation;


    @ManyToOne
    private Tasktype tasktype;

    @ManyToOne
    private Gramaniladharidiv gramaniladharidiv;

    @ManyToOne
    private Connectionrequest connectionrequest;

    @ManyToOne
    private Disconnectionrequest disconnectionrequest;

    @ManyToOne
    private Reconnectionrequest reconnectionrequest;

    @ManyToOne
    private Modificationrequest modificationrequest;

    @ManyToOne
    private Complaint complaint;

    @ManyToOne
    private Taskallocationstatus taskallocationstatus;

    @OneToMany(mappedBy="taskallocation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Taskallocationitem> taskallocationitemList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @ManyToMany
        @JoinTable(
        name="taskallocationvehicle",
        joinColumns=@JoinColumn(name="taskallocation_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="vehicle_id", referencedColumnName="id")
    )
    private List<Vehicle> vehicleList;

    @ManyToMany
        @JoinTable(
        name="taskallocationemployee",
        joinColumns=@JoinColumn(name="taskallocation_id", referencedColumnName="id"),
        inverseJoinColumns=@JoinColumn(name="employee_id", referencedColumnName="id")
    )
    private List<Employee> employeeList;


    public Taskallocation(Integer id){
        this.id = id;
    }

    public Taskallocation(Integer id, String code, Gramaniladharidiv gramaniladharidiv, Connectionrequest connectionrequest, Taskallocationstatus taskallocationstatus){
        this.id = id;
        this.code = code;
        this.gramaniladharidiv = gramaniladharidiv;
        this.connectionrequest = connectionrequest;
        this.taskallocationstatus = taskallocationstatus;
    }

}