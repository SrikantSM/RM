package com.sap.c4p.rm.processor.workforce.dao;

import static com.sap.c4p.rm.TestConstants.MDI_WORK_ASSIGNMENT_ID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.InitMocks;

import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;

public class WorkAssignmentDAOTest extends InitMocks {

    @Mock
    PersistenceService persistenceService;

    @Mock
    Result result;
    
    @Mock
    private WorkAssignments mockWorkAssignments;

    @Autowired
    @InjectMocks
    WorkAssignmentDAOImpl classUnderTest;

    @Test
    @DisplayName("test getWorkAssignmentKeyId when no result is returned")
    public void testGetWorkAssignmentKeyIdWhenNoResultIsReturned() {
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        assertFalse(this.classUnderTest.getWorkAssignmentKeyId(MDI_WORK_ASSIGNMENT_ID).isPresent());
    }

    @Test
    @DisplayName("test getWorkAssignmentKeyId when returned result does not have any row")
    public void testGetWorkAssignmentKeyIdWhenReturnedResultDoesNotHaveAnyRow() {
        when(this.result.first(WorkAssignments.class)).thenReturn(Optional.empty());
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        assertFalse(this.classUnderTest.getWorkAssignmentKeyId(MDI_WORK_ASSIGNMENT_ID).isPresent());
    }

    @Test
    @DisplayName("test getWorkAssignmentKeyId when result have data returned")
    public void testGetWorkAssignmentKeyIdWhenNoRowCount() {
        String id = UUID.randomUUID().toString();
        WorkAssignments workAssignment = WorkAssignments.create();
        workAssignment.setId(id);
        when(this.result.first(WorkAssignments.class)).thenReturn(Optional.of(workAssignment));
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        Optional<WorkAssignments> optionalWorkAssignments = this.classUnderTest
                .getWorkAssignmentKeyId(MDI_WORK_ASSIGNMENT_ID);
        assertTrue(optionalWorkAssignments.isPresent());
        assertEquals(workAssignment, optionalWorkAssignments.get());
    }
    
    @Test
    @DisplayName("test getWorkAssignmentGuidStartDateAndEndDate")
    public void testGetWorkAssignmentGuidStartDateAndEndDate() {
    	when(persistenceService.run(any(CqnSelect.class))).thenReturn(result);
    	when(result.first(WorkAssignments.class)).thenReturn(Optional.of(mockWorkAssignments));
    	WorkAssignments workAssignments = this.classUnderTest.getWorkAssignmentGuidStartDateAndEndDate("testExternalID", "testWorkforcePersonID", "testTenant");
    	assertNotNull(workAssignments);
    	assertEquals(mockWorkAssignments, workAssignments);
    }
}
