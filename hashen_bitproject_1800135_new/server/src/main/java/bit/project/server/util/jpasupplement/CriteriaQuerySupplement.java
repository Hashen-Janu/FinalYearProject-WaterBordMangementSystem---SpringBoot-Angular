package bit.project.server.util.jpasupplement;

import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaDelete;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.CriteriaUpdate;

public interface CriteriaQuerySupplement<T>{
    CriteriaBuilder getCriteriaBuilder();
    <T> TypedQuery<T> createQuery(CriteriaQuery<T> criteriaQuery);
    Query createQuery(CriteriaUpdate updateQuery);
    Query createQuery(CriteriaDelete deleteQuery);
}
