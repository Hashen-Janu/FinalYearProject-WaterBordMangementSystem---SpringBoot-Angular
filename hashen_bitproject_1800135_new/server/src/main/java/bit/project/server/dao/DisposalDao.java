package bit.project.server.dao;

import bit.project.server.entity.Disposal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface DisposalDao extends JpaRepository<Disposal, Integer>{
    @Query("select new Disposal (d.id,d.code) from Disposal d")
    Page<Disposal> findAllBasic(PageRequest pageRequest);

    Disposal findByCode(String code);
}