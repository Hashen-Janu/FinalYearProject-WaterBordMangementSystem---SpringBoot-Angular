package bit.project.server.dao;

import bit.project.server.entity.Itemrecive;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ItemreciveDao extends JpaRepository<Itemrecive, Integer>{
    @Query("select new Itemrecive (i.id,i.code) from Itemrecive i")
    Page<Itemrecive> findAllBasic(PageRequest pageRequest);

    Itemrecive findByCode(String code);
}