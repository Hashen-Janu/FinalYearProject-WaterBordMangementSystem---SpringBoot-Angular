package bit.project.server.dao;

import bit.project.server.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported=false)
public interface VehicleDao extends JpaRepository<Vehicle, Integer>{
    @Query("select new Vehicle (v.id,v.no,v.vehicletype) from Vehicle v")
    Page<Vehicle> findAllBasic(PageRequest pageRequest);

    @Query("select v from Vehicle v where  v.unit.id =:id")
    List<Vehicle> getAllByUnit(@Param("id") Integer id);

}
