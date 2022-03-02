package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Connectiontype;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ConnectiontypeDao extends JpaRepository<Connectiontype, Integer>{
    @Query("select new Connectiontype (c.id,c.code,c.name) from Connectiontype c")
    Page<Connectiontype> findAllBasic(PageRequest pageRequest);

    Connectiontype findByCode(String code);
}