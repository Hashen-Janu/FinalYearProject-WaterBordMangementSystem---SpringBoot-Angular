package bit.project.server.dao;

import bit.project.server.entity.Consumer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RepositoryRestResource(exported=false)
public interface ConsumerDao extends JpaRepository<Consumer, Integer>{
    @Query("select new Consumer (c.id,c.code,c.consumertype,c.nametitle,c.firstname,c.lastname,c.contact1,c.contact2,c.address) from Consumer c")
    Page<Consumer> findAllBasic(PageRequest pageRequest);

    Consumer findByCode(String code);

    @Query("select count (c) from Consumer c where c.doregisterd>=:startdate and c.doregisterd<=:enddate")
    Long getConsumerCountByRange(@Param("startdate") LocalDate startdate, @Param("enddate")LocalDate enddate);
}