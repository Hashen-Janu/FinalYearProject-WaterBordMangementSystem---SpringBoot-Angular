package bit.project.server.dao;

import bit.project.server.entity.Connectionrequeststatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ConnectionrequeststatusDao extends JpaRepository<Connectionrequeststatus, Integer>{
}