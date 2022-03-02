package bit.project.server.dao;

import bit.project.server.entity.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ItemDao extends JpaRepository<Item, Integer>{
    @Query("select new Item (i.id,i.code,i.name, i.price) from Item i")
    Page<Item> findAllBasic(PageRequest pageRequest);

    Item findByCode(String code);
}