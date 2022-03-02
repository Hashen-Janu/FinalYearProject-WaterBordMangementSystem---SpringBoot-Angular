package bit.project.server.dao;

import bit.project.server.entity.Complaint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ComplaintDao extends JpaRepository<Complaint, Integer>{
    @Query("select new Complaint (c.id,c.code,c.connection,c.title,c.location) from Complaint c")
    Page<Complaint> findAllBasic(PageRequest pageRequest);

    Complaint findByCode(String code);
    Complaint findByContact(String contact);

    @Query("select c from Complaint c where c.complaintstatus.name = 'Pending'")
    Page<Complaint> getAllPendingComplains(PageRequest pageRequest);
}