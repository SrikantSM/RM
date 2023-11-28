package com.sap.c4p.rm.replicationdao;

import static com.sap.c4p.rm.utils.Constants.REPLICATION_ERROR_CODE_CACHE_NAME;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Collections;

import org.json.JSONObject;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.InitMocks;

import com.sap.resourcemanagement.consultantprofile.integration.ReplicationErrorMessages;

public class ReplicationErrorMessagesDAOTest extends InitMocks {

    @Mock
    PersistenceService persistenceService;

    @Mock
    CacheManager cacheManager;

    @Mock
    Cache cache;

    @Mock
    Result result;

    @Autowired
    @InjectMocks
    ReplicationErrorMessagesDAOImpl classUnderTest;

    @Test
    @DisplayName("test getReplicationErrorMessages when no result is returned")
    public void testGetReplicationErrorMessagesTokenWhenNoResultIsReturned() {
        when(this.result.rowCount()).thenReturn(Long.valueOf(0));
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        assertEquals(Collections.emptyMap(), this.classUnderTest.getReplicationErrorMessages());
    }

    @Test
    @DisplayName("test getReplicationErrorMessages when result have data returned")
    public void testGetDeltaTokenWhenReturnedResultDoesNotHaveAnyRow() {
        ReplicationErrorMessages replicationErrorMessage = ReplicationErrorMessages.create();
        replicationErrorMessage.setCode(ReplicationErrorMessages.CODE);
        replicationErrorMessage.setErrorMessage(ReplicationErrorMessages.DESCRIPTION);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put(ReplicationErrorMessages.CODE, ReplicationErrorMessages.DESCRIPTION);
        when(this.result.listOf(ReplicationErrorMessages.class))
                .thenReturn(Collections.singletonList(replicationErrorMessage));
        when(this.result.rowCount()).thenReturn(Long.valueOf(1));
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        assertEquals(jsonObject.toMap(), this.classUnderTest.getReplicationErrorMessages());
    }

    @Test
    @DisplayName("test removeReplicationErrorMessage when no cache")
    public void testRemoveReplicationErrorMessageWhenNoCache() {
        when(this.cacheManager.getCache(REPLICATION_ERROR_CODE_CACHE_NAME)).thenReturn(null);
        this.classUnderTest.removeReplicationErrorMessage();
        verify(this.cache, times(0)).clear();
    }

    @Test
    @DisplayName("test removeReplicationErrorMessage when there is cache found")
    public void testRemoveReplicationErrorMessageWhenThereIsCacheFound() {
        when(this.cacheManager.getCache(REPLICATION_ERROR_CODE_CACHE_NAME)).thenReturn(cache);
        this.classUnderTest.removeReplicationErrorMessage();
        verify(this.cache, times(1)).clear();
    }

}
