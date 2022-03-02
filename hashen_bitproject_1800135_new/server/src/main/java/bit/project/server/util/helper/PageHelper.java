package bit.project.server.util.helper;

import bit.project.server.util.dto.PageQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public abstract class PageHelper{
    public static Page getAsPage(List data){
        return new PageImpl(data, PageRequest.of(0, data.size()), data.size());
    }

    public static Page getAsPage(List data, Integer page, Integer size){
        int start = page * size;
        int end = start + size < data.size() ? start + size : data.size();
        start = data.size() == 0 ? 0 : start;
        return new PageImpl(data.subList(start,end), PageRequest.of(page, size), data.size());
    }

    public static Page getAsPage(List data, PageQuery pageQuery){
        int page = pageQuery.getPage();
        int size = pageQuery.getSize();
        int start = page * size;
        int end = start + size < data.size() ? start + size : data.size();
        return new PageImpl(data.subList(start,end), PageRequest.of(page, size), data.size());
    }
}
