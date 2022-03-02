package bit.project.server.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import bit.project.server.entity.Reconnectionrequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ReconnectionrequestDao extends JpaRepository<Reconnectionrequest, Integer>{
    @Query("select new Reconnectionrequest (r.id,r.code,r.connection) from Reconnectionrequest r")
    Page<Reconnectionrequest> findAllBasic(PageRequest pageRequest);

    Reconnectionrequest findByCode(String code);

    @Query("select r from Reconnectionrequest r where r.reconnectionrequeststatus.name = 'Pending'") Page<Reconnectionrequest> getAllPendingReconnectionrequest(PageRequest pageRequet);
}