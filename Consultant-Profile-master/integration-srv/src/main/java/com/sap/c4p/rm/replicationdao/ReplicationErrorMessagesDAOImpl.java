package com.sap.c4p.rm.replicationdao;

import static com.sap.c4p.rm.utils.Constants.REPLICATION_ERROR_CODE_CACHE_NAME;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Repository;

import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.utils.Constants;

import com.sap.resourcemanagement.consultantprofile.integration.ReplicationErrorMessages;
import com.sap.resourcemanagement.consultantprofile.integration.ReplicationErrorMessages_;

/**
 * Class to implement {@link ReplicationErrorMessagesDAO}.
 */
@Repository
public class ReplicationErrorMessagesDAOImpl implements ReplicationErrorMessagesDAO {

    private final PersistenceService persistenceService;
    private final CacheManager cacheManager;

    @Autowired
    public ReplicationErrorMessagesDAOImpl(final PersistenceService persistenceService,
            final CacheManager cacheManager) {
        this.persistenceService = persistenceService;
        this.cacheManager = cacheManager;
    }

    @Override
    @Cacheable(cacheNames = REPLICATION_ERROR_CODE_CACHE_NAME)
    public Map<String, String> getReplicationErrorMessages() {
        CqnSelect cqnSelect = Select.from(ReplicationErrorMessages_.CDS_NAME);
        Result results = this.persistenceService.run(cqnSelect);
        Map<String, String> replicationErrorMessages = new HashMap<>();
        if (results.rowCount() > 0) {
            results.listOf(ReplicationErrorMessages.class)
                    .forEach(result -> replicationErrorMessages.put(result.getCode(), result.getErrorMessage()));
            return replicationErrorMessages;
        } else {
            return Collections.emptyMap();
        }
    }

    @Scheduled(fixedRate = Constants.CACHE_CLEAN_INTERVAL)
    public void removeReplicationErrorMessage() {
        Cache cache = this.cacheManager.getCache(REPLICATION_ERROR_CODE_CACHE_NAME);
        if (cache != null)
            cache.clear();
    }

}
