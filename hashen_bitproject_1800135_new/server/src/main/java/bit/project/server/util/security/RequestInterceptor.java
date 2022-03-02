package bit.project.server.util.security;

import bit.project.server.dao.ServicelogDao;
import bit.project.server.entity.Servicelog;
import bit.project.server.entity.Token;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Component
public class RequestInterceptor extends HandlerInterceptorAdapter {

    private final ServicelogDao servicelogDao;

    public RequestInterceptor(ServicelogDao servicelogDao) {
        this.servicelogDao = servicelogDao;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "*");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "*");
        response.setHeader("Access-Control-Allow-Credentials", "*");
        response.setHeader("Connection", "close");
        return super.preHandle(request, response, handler);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception exception) throws Exception {
        Servicelog servicelog = new Servicelog();
        servicelog.setHandler(handler.toString());
        servicelog.setMethod(request.getMethod());
        if(request.getQueryString()==null) servicelog.setUrl(request.getRequestURI());
        else servicelog.setUrl(request.getRequestURI()+"?"+request.getQueryString());
        servicelog.setResponsecode(response.getStatus());
        servicelog.setIp(request.getRemoteAddr());
        servicelog.setTorequest(LocalDateTime.now());
        if(request.getAttribute("token")!=null) servicelog.setToken((Token) request.getAttribute("token"));
        servicelog.setId(UUID.randomUUID().toString());
        servicelogDao.save(servicelog);
    }
}
