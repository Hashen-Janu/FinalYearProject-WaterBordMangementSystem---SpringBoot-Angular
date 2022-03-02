package bit.project.server.dao;

import bit.project.server.entity.Connection;
import bit.project.server.util.dto.GramaniladhariDivWiseConnection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDate;
import java.util.List;

@RepositoryRestResource(exported=false)
public interface ConnectionDao extends JpaRepository<Connection, Integer>{
    @Query("select new Connection (c.id,c.code,c.consumer,c.mobile,c.gramaniladharidiv) from Connection c")
    Page<Connection> findAllBasic(PageRequest pageRequest);

    Connection findByCode(String code);
    Connection findByMobile(String mobile);
    Connection findByMeterno(String meterno);
    Connection findByMeterseelno(String meterseelno);


    @Query("select count (c) from Connection c where c.supplieddate>=:startdate and c.supplieddate<=:enddate")
    Long getConnectionCountByRange(@Param("startdate") LocalDate startdate, @Param("enddate")LocalDate enddate);

    @Query( value = "SELECT (select g.name from gramaniladharidiv g where g.id = ( select c.gramaniladharidiv_id from gramaniladharidiv g where g.id = c.gramaniladharidiv_id )) as gramaniladharidiv, count(c.id) as count FROM " +
            "connection c group by  gramaniladharidiv", nativeQuery = true)
    List<GramaniladhariDivWiseConnection> gdivconnectionCount();


}