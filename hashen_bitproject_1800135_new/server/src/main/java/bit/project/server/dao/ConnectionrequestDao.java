package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Connectionrequest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported=false)
public interface ConnectionrequestDao extends JpaRepository<Connectionrequest, Integer>{
    @Query("select new Connectionrequest (c.id,c.code,c.consumer,c.gramaniladharidiv,c.payslip,c.pobox,c.street) from Connectionrequest c")
    Page<Connectionrequest> findAllBasic(PageRequest pageRequest);

    Connectionrequest findByCode(String code);
    Connectionrequest findByMobile(String mobile);
    Connectionrequest findByLand(String land);

    @Query("select c.pobox, c.street,c.gramaniladharidiv from Connectionrequest c where c.consumer.id = :id")
    Connectionrequest findAllConReqByConsumer_Id(@Param("id")Integer id);

    @Query("select c from Connectionrequest c where c.connectionrequeststatus.name = 'Done'")
    Page<Connectionrequest> getAllDoneRequests(PageRequest pageRequest);
}