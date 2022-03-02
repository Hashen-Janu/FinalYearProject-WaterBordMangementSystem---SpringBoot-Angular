package bit.project.server.dao;

import bit.project.server.entity.Complaint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import bit.project.server.entity.Modificationrequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ModificationrequestDao extends JpaRepository<Modificationrequest, Integer>{
    @Query("select new Modificationrequest (m.id,m.code,m.connection) from Modificationrequest m")
    Page<Modificationrequest> findAllBasic(PageRequest pageRequest);

    Modificationrequest findByCode(String code);


    @Query("select m from Modificationrequest m where m.modificationrequeststatus.name = 'Pending'")
    Page<Modificationrequest> getAllPendingModificationrequest(PageRequest pageRequest);
}