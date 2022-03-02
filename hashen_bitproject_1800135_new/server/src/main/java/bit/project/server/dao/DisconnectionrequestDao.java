package bit.project.server.dao;

import bit.project.server.entity.Modificationrequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import bit.project.server.entity.Disconnectionrequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface DisconnectionrequestDao extends JpaRepository<Disconnectionrequest, Integer>{
    @Query("select new Disconnectionrequest (d.id,d.code,d.connection) from Disconnectionrequest d")
    Page<Disconnectionrequest> findAllBasic(PageRequest pageRequest);

    Disconnectionrequest findByCode(String code);


    @Query("select d from Disconnectionrequest d where d.disconnectionrequeststatus.name = 'Pending'")
    Page<Disconnectionrequest> getAllPendingDisconnectionrequest(PageRequest pageRequest);
}