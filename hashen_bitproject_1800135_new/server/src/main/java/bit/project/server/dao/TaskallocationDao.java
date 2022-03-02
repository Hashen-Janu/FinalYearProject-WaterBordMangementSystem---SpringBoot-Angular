package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Taskallocation;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import javax.transaction.Transactional;
import java.util.List;

@RepositoryRestResource(exported=false)
public interface TaskallocationDao extends JpaRepository<Taskallocation, Integer>{
    @Query("select new Taskallocation (t.id,t.code,t.gramaniladharidiv,t.connectionrequest, t.taskallocationstatus) from Taskallocation t")
    Page<Taskallocation> findAllBasic(PageRequest pageRequest);

    @Query("select t from Taskallocation t where t.taskallocationstatus.id =:id")
    List<Taskallocation> findAllByStatus(@Param("id") Integer id);


    @Transactional
    @Modifying
    @Query(value = "UPDATE taskallocation t set taskallocationstatus_id = 2 where id =?;", nativeQuery = true)
    Integer setStatus(Integer id);

    Taskallocation findByCode(String code);
}
