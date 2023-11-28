package com.sap.c4p.rm.replicationdao;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.exceptions.CapacityCleanupException;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.c4p.rm.processor.workforce.dto.Instance;
import com.sap.c4p.rm.processor.workforce.dto.Log;
import com.sap.resourcemanagement.consultantprofile.integration.CapacityCleanupFailures;

public class CapacityCleanupFailureDAOTest extends InitMocks {

    @Mock
    Marker marker;

    @Mock
    PersistenceService persistenceService;

    @Mock
    ReplicationErrorMessagesDAO replicationErrorMessagesDAO;
    
    @Mock
    Result result;

    @Autowired
    @InjectMocks
    CapacityCleanupFailuresDAOImpl classUnderTest;

    @Test
    @DisplayName("test update when persistence run raise exception")
    public void testUpdateWhenPersistenceRunRaiseException() {
        doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpdate.class));
        assertThrows(CapacityCleanupException.class, () -> this.classUnderTest.update(marker, "test-intanceId", "test-versionId"));
        verify(this.persistenceService, times(1)).run(any(CqnUpdate.class));
    }

    @Test
    @DisplayName("test update when persistence do not raise exception")
    public void testUpdateWhenPersistenceDoNotRaiseException() {
        this.classUnderTest.update(marker, "test-intanceId", "test-versionId");
        verify(this.persistenceService, times(1)).run(any(CqnUpdate.class));
    }

    @Test
    @DisplayName("test saveAvailabilityCleanupFailure when persistence run raise exception")
    public void testSaveAvailabilityCleanupFailureWhenPersistenceRunRaiseException() {
        ServiceException serviceException = new ServiceException("Something wrong");
        CapacityCleanupException availabilityCleanupException = new CapacityCleanupException(serviceException);
        Log workforcePersonLog = new Log();
        workforcePersonLog.setEvent("created");
        workforcePersonLog.setVersionId("versionId");
        Instance instance = new Instance();
        instance.setId("Id");
        instance.setExternalId("externalId");
        workforcePersonLog.setInstance(instance);
        doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpsert.class));
        assertThrows(TransactionException.class, () -> this.classUnderTest.prepareAndSaveAvailabilityCleanupFailure(marker,
        		availabilityCleanupException, workforcePersonLog));
        verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
    }

    @Test
    @DisplayName("test saveAvailabilityCleanupFailure when persistence do not raise exception")
    public void testSaveAvailabilityCleanupFailureWhenPersistenceDoNotRaiseException() {
    	CapacityCleanupException availabilityCleanupException = new CapacityCleanupException();
        Log workforcePersonLog = new Log();
        workforcePersonLog.setEvent("created");
        workforcePersonLog.setVersionId("versionId");
        Instance instance = new Instance();
        instance.setId("Id");
        instance.setExternalId("externalId");
        workforcePersonLog.setInstance(instance);
        this.classUnderTest.prepareAndSaveAvailabilityCleanupFailure(marker, availabilityCleanupException, workforcePersonLog);
        verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
    }
    
    @Test
    @DisplayName("test read when persistence do not raise exception")
    public void testReadWhenPersistenceDoNotRaiseException() {
    	List<CapacityCleanupFailures> availabilityCleanupFailures = new ArrayList<>();
    	CapacityCleanupFailures availabilityCleanupFailure = CapacityCleanupFailures.create();
    	availabilityCleanupFailures.add(availabilityCleanupFailure);
    	when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        when(this.result.listOf(CapacityCleanupFailures.class)).thenReturn(availabilityCleanupFailures);
        assertEquals(availabilityCleanupFailures, this.classUnderTest.readAll(marker));
        verify(this.persistenceService, times(1)).run(any(CqnSelect.class));
    }
    
    @Test
    @DisplayName("test read when persistence run raise exception")
    public void testReadWhenPersistenceRunRaiseException() {
        doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnSelect.class));
        assertThrows(CapacityCleanupException.class, () -> this.classUnderTest.readAll(marker));
        verify(this.persistenceService, times(1)).run(any(CqnSelect.class));
    }

}
