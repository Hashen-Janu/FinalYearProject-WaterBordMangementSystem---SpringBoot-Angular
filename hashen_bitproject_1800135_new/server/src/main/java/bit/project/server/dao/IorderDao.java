package bit.project.server.dao;

import bit.project.server.entity.Iorder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface IorderDao extends JpaRepository<Iorder, Integer>{
    @Query("select new Iorder (i.id,i.code) from Iorder i")
    Page<Iorder> findAllBasic(PageRequest pageRequest);

    Iorder findByCode(String code);
}