package com.sap.c4p.rm.processor.workforce.dao;

import static com.sap.c4p.rm.TestConstants.MDI_WORK_ASSIGNMENT_ID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.exceptions.TransactionException;

import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary;

public class AvailabilityReplicationSummaryDAOTest extends InitMocks {

    @Mock
    PersistenceService persistenceService;

    @Mock
    Result result;

    @Autowired
    @InjectMocks
    AvailabilityReplicationSummaryDAOImpl classUnderTest;

    @Test
    @DisplayName("test save when persistence run raise exception")
    public void testSaveWhenPersistenceRunRaiseException() {
        AvailabilityReplicationSummary availabilityReplicationSummary = AvailabilityReplicationSummary.create();
        availabilityReplicationSummary.setResourceId("resourceId");
        doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpsert.class));
        assertThrows(TransactionException.class,
                () -> this.classUnderTest.save(Collections.singletonList(availabilityReplicationSummary)));
        verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
    }

    @Test
    @DisplayName("test save when persistence do not raise exception")
    public void testSaveWhenPersistenceDoNotRaiseException() {
        AvailabilityReplicationSummary availabilityReplicationSummary = AvailabilityReplicationSummary.create();
        availabilityReplicationSummary.setResourceId(MDI_WORK_ASSIGNMENT_ID);
        this.classUnderTest.save(Collections.singletonList(availabilityReplicationSummary));
        verify(this.persistenceService, times(2)).run(any(CqnUpsert.class));
    }

    @Test
    @DisplayName("test getAvailabilityReplicationSummary when no result is returned")
    public void testGetAvailabilityReplicationSummaryWhenNoResultIsReturned() {
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        assertFalse(this.classUnderTest.getAvailabilityReplicationSummary(MDI_WORK_ASSIGNMENT_ID).isPresent());
    }

    @Test
    @DisplayName("test getAvailabilityReplicationSummary when returned result does not have any row")
    public void testGetAvailabilityReplicationSummaryWhenReturnedResultDoesNotHaveAnyRow() {
        when(this.result.first()).thenReturn(Optional.empty());
        when(this.result.rowCount()).thenReturn(Long.valueOf(1));
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        assertFalse(this.classUnderTest.getAvailabilityReplicationSummary(MDI_WORK_ASSIGNMENT_ID).isPresent());
    }

    @Test
    @DisplayName("test getAvailabilityReplicationSummary when result have data returned")
    public void testGetAvailabilityReplicationSummaryWhenNoRowCount() {
        AvailabilityReplicationSummary availabilityReplicationSummary = AvailabilityReplicationSummary.create();
        when(this.result.first(AvailabilityReplicationSummary.class))
                .thenReturn(Optional.of(availabilityReplicationSummary));
        when(this.result.rowCount()).thenReturn(Long.valueOf(1));
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        Optional<AvailabilityReplicationSummary> optionalAvailabilityReplicationSummary = this.classUnderTest
                .getAvailabilityReplicationSummary(MDI_WORK_ASSIGNMENT_ID);
        assertTrue(optionalAvailabilityReplicationSummary.isPresent());
        assertEquals(availabilityReplicationSummary,
                this.classUnderTest.getAvailabilityReplicationSummary(MDI_WORK_ASSIGNMENT_ID).get());
    }
}
