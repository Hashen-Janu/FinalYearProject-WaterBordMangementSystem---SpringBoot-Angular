package bit.project.server.dao;

import bit.project.server.entity.Itemreturn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ItemreturnDao extends JpaRepository<Itemreturn, Integer>{
    @Query("select new Itemreturn (i.id,i.code) from Itemreturn i")
    Page<Itemreturn> findAllBasic(PageRequest pageRequest);

    Itemreturn findByCode(String code);
}