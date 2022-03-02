package bit.project.server.dao;

import bit.project.server.entity.Civilstatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface CivilstatusDao extends JpaRepository<Civilstatus, Integer>{
}