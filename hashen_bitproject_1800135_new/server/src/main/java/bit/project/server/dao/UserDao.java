package bit.project.server.dao;

import bit.project.server.entity.User;
import bit.project.server.util.jpasupplement.CriteriaQuerySupplement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import java.util.List;
import bit.project.server.entity.Employee;

@RepositoryRestResource(exported=false)
public interface UserDao extends JpaRepository<User, Integer>, CriteriaQuerySupplement<User> {
    @Query("select new User(u.id, u.username, u.employee) from User u")
    Page<User> findAllBasic(PageRequest pageRequest);

    @Query("select u from User u where  u.employee is null")
    User getSuperUser();

    User findByEmployee(Employee employee);
    User findByUsername(String username);

    @Query("select new Employee(em.id, em.code, em.nametitle, em.callingname, em.photo) from Employee em where EXISTS (select u from User u where u.employee.id = em.id)")
    List<Employee> findAllUserEmployees();

    @Query("select u from User u where u.username = 'x'")
    Employee findAllEmployees();

    @Query("select new Employee(em.id, em.code, em.nametitle, em.callingname, em.photo) from Employee em where NOT EXISTS (select u from User u where u.employee.id = em.id)")
    List<Employee> findAllNonUserEmployees();


}