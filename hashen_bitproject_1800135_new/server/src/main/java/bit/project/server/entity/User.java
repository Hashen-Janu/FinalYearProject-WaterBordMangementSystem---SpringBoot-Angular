package bit.project.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    @Size(min=0, max=50, message="Maximum character count is 50")
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Size(min=0, max=255, message="Maximum character count is 255")
    private String password;

    @NotNull
    private String status;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime tocreation;

    @JsonIgnore
    private LocalDateTime tolocked;

    @JsonIgnore
    private Integer failedattempts;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"creator"})
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private User creator;

    private String photo;


    @ManyToOne
    @JsonIgnoreProperties({"creator","tocreation","civilstatus","fullname","dobirth","gender","nic","mobile","land","email","address","designation","dorecruit","employeestatus","description"})
    private Employee employee;

    @JsonIgnore
    @OneToMany(mappedBy="user")
    private List<Notification> notificationList;

    @JsonIgnore
    @OneToMany(mappedBy="creator")
    private List<Role> roleListBycreator;

    @JsonIgnore
    @OneToMany(mappedBy="user")
    private List<Token> tokenList;

    @JsonIgnore
    @OneToMany(mappedBy="creator")
    private List<User> userListBycreator;

    @ManyToMany
    @JoinTable(
            name="userrole",
            joinColumns=@JoinColumn(name="user_id", referencedColumnName="id"),
            inverseJoinColumns=@JoinColumn(name="role_id", referencedColumnName="id")
    )
    @JsonIgnoreProperties({"creator","tocreation","usecaseList","userList"})
    private List<Role> roleList;

    public User(Integer id){
        this.id = id;
    }


    public User(Integer id, String username, Employee employee){
        this.id = id;
        this.username = username;
    }

    @Transient
    @JsonIgnore
    public boolean isSuperAdmin(){
        if (this.employee != null) return false;
        return true;
    }

}