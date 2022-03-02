package bit.project.server.util.dto;

import bit.project.server.util.exception.BadRequestException;
import bit.project.server.util.helper.StringHelper;

import java.math.BigDecimal;
import java.util.HashMap;

public class PageQuery {
    private Integer page;
    private Integer size;
    private HashMap<String,String> query;

    public PageQuery(){
        page = 0;
        size = Integer.MAX_VALUE;
        query = new HashMap<>();
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(String pageParam) {
        if(pageParam==null) return;
        try {
            Integer value = Integer.valueOf(pageParam.trim());
            if(value<0) return;
            this.page = value;
        }catch (Exception ignored){}
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(String sizeParam) {
        if(sizeParam==null) return;
        try {
            Integer value = Integer.valueOf(sizeParam.trim());
            if(value<1) return;
            this.size = value;
        }catch (Exception ignored){}
    }

    public void setQuery(String queryParam) {
        if(queryParam == null) return;
        queryParam = queryParam.trim();
        if(queryParam.isEmpty()) return;
        try {
            String[] querySegments = StringHelper.splitByCharacter(queryParam.trim(), ',');

            for (String querySegment : querySegments) {
                querySegment = querySegment.replace("\\,", ",");
                String[] paramSegments = StringHelper.splitByCharacter(querySegment.trim(), ':');
                if (paramSegments.length == 1)
                    query.put(paramSegments[0].trim().replace("\\:", ":"), null);
                else
                    query.put(
                        paramSegments[0].trim().replace("\\:", ":"),
                        paramSegments[1].trim().replace("\\:", ":")
                    );
            }
        }catch (Exception e){
            throw new BadRequestException("Query parameters are not in well-formed", e);
        }
    }

    public boolean isSearchParamExists(String param){
        return query.containsKey(param);
    }

    public String getSearchParam(String param){
        return query.get(param);
    }

    public Integer getSearchParamAsInteger(String param){
        if(!isSearchParamExists(param)) return null;
        try{
            return Integer.valueOf(query.get(param));
        }catch(NumberFormatException e){
            throw new BadRequestException(param+" parameter not well-formed", e);
        }
    }

    public BigDecimal getSearchParamAsDecimal(String param){
        if(!isSearchParamExists(param)) return null;
        try{
            return new BigDecimal(query.get(param));
        }catch(NumberFormatException e){
            throw new BadRequestException(param+" parameter not well-formed", e);
        }
    }

    public Boolean getSearchParamAsBoolean(String param){
        if(!isSearchParamExists(param)) return null;
        try{
            String value = query.get(param);
            return value.equalsIgnoreCase("true") ||
                    value.equals("1") ||
                    value.equalsIgnoreCase("yes");
        }catch(Exception e){
            throw new BadRequestException(param+" parameter not well-formed",e);
        }
    }

    public boolean isEmptySearch(){
        return query.isEmpty();
    }
}
