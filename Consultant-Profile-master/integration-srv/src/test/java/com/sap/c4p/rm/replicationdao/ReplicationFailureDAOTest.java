package com.sap.c4p.rm.replicationdao;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.exceptions.ReplicationErrorCodes;
import com.sap.c4p.rm.exceptions.ReplicationException;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.c4p.rm.processor.workforce.dto.Instance;
import com.sap.c4p.rm.processor.workforce.dto.Log;

import com.sap.resourcemanagement.consultantprofile.integration.ReplicationFailures;

public class ReplicationFailureDAOTest extends InitMocks {

    @Mock
    JobSchedulerService jobSchedulerService;

    @Mock
    Marker marker;

    @Mock
    PersistenceService persistenceService;

    @Mock
    ReplicationErrorMessagesDAO replicationErrorMessagesDAO;

    @Mock
    JobSchedulerRunHeader jobSchedulerRunHeader;

    @Autowired
    @InjectMocks
    ReplicationFailureDAOImpl classUnderTest;

    @Test
    @DisplayName("test update when persistence run raise exception")
    public void testUpdateWhenPersistenceRunRaiseException() {
        ReplicationFailures replicationFailures = ReplicationFailures.create();
        doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpdate.class));
        assertThrows(TransactionException.class, () -> this.classUnderTest.update(marker, replicationFailures));
        verify(this.persistenceService, times(1)).run(any(CqnUpdate.class));
    }

    @Test
    @DisplayName("test update when persistence do not raise exception")
    public void testUpdateWhenPersistenceDoNotRaiseException() {
        ReplicationFailures replicationFailures = ReplicationFailures.create();
        this.classUnderTest.update(marker, replicationFailures);
        verify(this.persistenceService, times(1)).run(any(CqnUpdate.class));
    }

    @Test
    @DisplayName("test saveWorkforceReplicationFailure when persistence run raise exception")
    public void testSaveWorkforceReplicationFailureWhenPersistenceRunRaiseException() {
        ServiceException serviceException = new ServiceException("Something wrong");
        ReplicationException replicationException = new TransactionException(serviceException);
        Log workforcePersonLog = new Log();
        workforcePersonLog.setEvent("created");
        workforcePersonLog.setVersionId("versionId");
        Instance instance = new Instance();
        instance.setId("Id");
        instance.setExternalId("externalId");
        workforcePersonLog.setInstance(instance);
        doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpsert.class));
        Map<String, String> map = new HashMap<>();
        map.put(ReplicationErrorCodes.DB_TRANSACTION.getErrorCode(), "{0}{1}{2}{3}");
        when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(map);
        assertThrows(TransactionException.class, () -> this.classUnderTest.saveWorkforceReplicationFailure(marker,
                replicationException, workforcePersonLog, "subDomain", jobSchedulerRunHeader));
        verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
    }

    @Test
    @DisplayName("test saveWorkforceReplicationFailure when persistence do not raise exception")
    public void testSaveWorkforceReplicationFailureWhenPersistenceDoNotRaiseException() {
        ReplicationException replicationException = new TransactionException("errorParam1", "errorParam2",
                "errorParam3", "errorParam4");
        Log workforcePersonLog = new Log();
        workforcePersonLog.setEvent("created");
        workforcePersonLog.setVersionId("versionId");
        Instance instance = new Instance();
        instance.setId("Id");
        instance.setExternalId("externalId");
        workforcePersonLog.setInstance(instance);
        Map<String, String> map = new HashMap<>();
        map.put(ReplicationErrorCodes.DB_TRANSACTION.getErrorCode(), "{0}{1}{2}{3}");
        when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(map);
        this.classUnderTest.saveWorkforceReplicationFailure(marker, replicationException, workforcePersonLog,
                "subDomain", jobSchedulerRunHeader);
        verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
    }

    @Test
    @DisplayName("test saveCostCenterReplicationFailure when persistence run raise exception")
    public void testSaveCostCenterReplicationFailureWhenPersistenceRunRaiseException() {
        ServiceException serviceException = new ServiceException("Something Wrong");
        ReplicationException replicationException = new TransactionException(serviceException);
        com.sap.c4p.rm.processor.costcenter.dto.Log costCenterLog = new com.sap.c4p.rm.processor.costcenter.dto.Log();
        costCenterLog.setEvent("created");
        costCenterLog.setVersionId("versionId");
        com.sap.c4p.rm.processor.costcenter.dto.Instance costCenterInstance = new com.sap.c4p.rm.processor.costcenter.dto.Instance();
        costCenterInstance.setId("Id");
        costCenterInstance.setDisplayName("displayName");
        costCenterLog.setInstance(costCenterInstance);
        doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpsert.class));
        Map<String, String> map = new HashMap<>();
        map.put(ReplicationErrorCodes.DB_TRANSACTION.getErrorCode(), "{0}{1}{2}{3}");
        when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(map);
        assertThrows(TransactionException.class, () -> this.classUnderTest.saveCostCenterReplicationFailure(marker,
                replicationException, costCenterLog, "subDomain", jobSchedulerRunHeader));
        verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
    }

    @Test
    @DisplayName("test saveCostCenterReplicationFailure when persistence do not raise exception")
    public void testSaveCostCenterReplicationFailureWhenPersistenceDoNotRaiseException() {
        ReplicationException replicationException = new TransactionException("errorParam1", "errorParam2",
                "errorParam3", "errorParam4");
        com.sap.c4p.rm.processor.costcenter.dto.Log costCenterLog = new com.sap.c4p.rm.processor.costcenter.dto.Log();
        costCenterLog.setEvent("created");
        costCenterLog.setVersionId("versionId");
        com.sap.c4p.rm.processor.costcenter.dto.Instance costCenterInstance = new com.sap.c4p.rm.processor.costcenter.dto.Instance();
        costCenterInstance.setId("Id");
        costCenterInstance.setDisplayName("displayName");
        costCenterLog.setInstance(costCenterInstance);
        Map<String, String> map = new HashMap<>();
        map.put(ReplicationErrorCodes.DB_TRANSACTION.getErrorCode(), "{0}{1}{2}{3}");
        when(this.replicationErrorMessagesDAO.getReplicationErrorMessages()).thenReturn(map);
        this.classUnderTest.saveCostCenterReplicationFailure(marker, replicationException, costCenterLog, "subDomain",
                jobSchedulerRunHeader);
        verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
    }

}
