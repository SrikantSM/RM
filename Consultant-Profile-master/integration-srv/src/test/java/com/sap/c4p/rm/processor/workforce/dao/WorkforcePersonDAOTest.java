package com.sap.c4p.rm.processor.workforce.dao;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.c4p.rm.replicationdao.MDIObjectReplicationStatusDAO;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;
import com.sap.resourcemanagement.workforce.workforceperson.*;

public class WorkforcePersonDAOTest extends InitMocks {
    @Mock
    PersistenceService persistenceService;

    @Mock
    MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;

    @Mock
    Result result;
    
    @Mock
    WorkforcePersons mockWorkforcePersons;

    @Autowired
    @InjectMocks
    WorkforcePersonDAOImpl classUnderTest;

    @Test
    @DisplayName("test save when persistence run raise exception")
    public void testSaveWhenPersistenceRunRaiseException() {
        WorkforcePersons workforcePersons = WorkforcePersons.create();
        doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnSelect.class));
        assertThrows(TransactionException.class, () -> this.classUnderTest.save(workforcePersons));
        verify(this.persistenceService, times(1)).run(any(CqnSelect.class));
    }

    @Test
    @DisplayName("test save when persistence do not raise exception")
    public void testSaveWhenPersistenceDoNotRaiseException() {
        WorkforcePersons workforcePersons = WorkforcePersons.create();
        when(persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        when(result.first(WorkforcePersons.class)).thenReturn(Optional.of(mockWorkforcePersons));
        this.classUnderTest.save(workforcePersons);
        verify(this.persistenceService, times(1)).run(any(CqnSelect.class));
        verify(this.persistenceService, times(1)).run(any(CqnDelete.class));
        verify(this.persistenceService, times(1)).run(any(CqnInsert.class));
    }

    @Test
    @DisplayName("test update when persistence run raise exception")
    public void testUpdateWhenPersistenceRunRaiseException() {
        WorkforcePersons workforcePersons = WorkforcePersons.create();
        doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpdate.class));
        assertThrows(TransactionException.class, () -> this.classUnderTest.update(workforcePersons));
        verify(this.persistenceService, times(1)).run(any(CqnUpdate.class));
    }

    @Test
    @DisplayName("test update when persistence do not raise exception")
    public void testUpdateWhenPersistenceDoNotRaiseException() {
        WorkforcePersons workforcePersons = WorkforcePersons.create();
        this.classUnderTest.update(workforcePersons);
        verify(this.persistenceService, times(1)).run(any(CqnUpdate.class));
    }

    @Test
    @DisplayName("test isExists when no result is returned")
    public void testIsExistsWhenNoResultIsReturned() {
        when(this.result.rowCount()).thenReturn(Long.valueOf(0));
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        assertFalse(this.classUnderTest.isExists("workforcePersonId"));
    }

    @Test
    @DisplayName("test isExists when returned result does not have any row")
    public void testIsExistsWhenReturnedResultDoesNotHaveAnyRow() {
        when(this.result.rowCount()).thenReturn(Long.valueOf(1));
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        assertTrue(this.classUnderTest.isExists("workforcePersonId"));
    }

    @Test
    @DisplayName("test read with no workforce")
    public void testReadWithNoWorkforce() {
        String workforcePersonId = UUID.randomUUID().toString();
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        when(this.result.first(WorkforcePersons.class)).thenReturn(Optional.empty());
        assertNull(classUnderTest.read(workforcePersonId));
    }

    @Test
    @DisplayName("test read with workforce")
    public void testReadWithWorkforce() {
        String workforcePersonId = UUID.randomUUID().toString();
        WorkforcePersons workforcePersons = WorkforcePersons.create();
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        when(this.result.first(WorkforcePersons.class)).thenReturn(Optional.of(workforcePersons));
        assertEquals(workforcePersons, classUnderTest.read(workforcePersonId));
    }

    @Test
    @DisplayName("test readAll with no workforceRecords")
    public void testReadAllWithNoWorkforceRecords() {
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        when(this.result.listOf(WorkforcePersons.class)).thenReturn(Collections.emptyList());
        assertTrue(this.classUnderTest.readAll().isEmpty());
    }

    @Test
    @DisplayName("test readAll with workforceRecords")
    public void testReadAllWithWorkforceRecords() {
        WorkforcePersons workforcePersons = WorkforcePersons.create();
        List<WorkforcePersons> workforcePersonsList = new ArrayList<>();
        workforcePersonsList.add(workforcePersons);
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        when(this.result.listOf(WorkforcePersons.class)).thenReturn(workforcePersonsList);
        assertEquals(workforcePersonsList, this.classUnderTest.readAll());
    }

    @Test
    @DisplayName("test markBusinessPurposeComplete")
    public void testMarkBusinessPurposeComplete() {
        WorkforcePersons workforcePersons1 = WorkforcePersons.create();
        WorkforcePersons workforcePersons2 = WorkforcePersons.create();
        this.classUnderTest.markBusinessPurposeComplete(Arrays.asList(workforcePersons1, workforcePersons2));
        verify(this.persistenceService, times(1)).run(any(CqnUpdate.class));
        verify(this.mdiObjectReplicationStatusDAO, times(1)).delete(MDIEntities.WORKFORCE_PERSON);
    }
    
    @Test
    @DisplayName("test getIsBusinessPurposeCompletedForWorkforcePerson")
    public void testGetIsBusinessPurposeCompletedForWorkforcePerson() {
    	when(persistenceService.run(any(CqnSelect.class))).thenReturn(result);
    	when(result.first(WorkforcePersons.class)).thenReturn(Optional.of(mockWorkforcePersons));
    	when(mockWorkforcePersons.getIsBusinessPurposeCompleted()).thenReturn(false);
    	assertFalse(this.classUnderTest.getIsBusinessPurposeCompletedForWorkforcePerson("testWorkforcePersonID"));
    }

    @Test
    @DisplayName("test read with no workassignments of workforceperson")
    public void testReadWithNoWorkAssignmentsOfWorkforce() {
    	WorkforcePersons workforcePerson = WorkforcePersons.create();
        String workforcePersonId = UUID.randomUUID().toString();
        workforcePerson.setId(workforcePersonId);
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        when(this.result.first(WorkforcePersons.class)).thenReturn(Optional.of(workforcePerson));
        assertNull(classUnderTest.readWorkAssignmentsOfWorkforcePerson(workforcePersonId));
    }

    @Test
    @DisplayName("test read with workassignments of workforceperson")
    public void testReadWithWorkAssignmentsOfWorkforce() {
        WorkAssignments workAssignment = WorkAssignments.create();
        String workforceAssignmentId = UUID.randomUUID().toString();
        workAssignment.setId(workforceAssignmentId);

        List<WorkAssignments> workAssignments = new ArrayList<>();
        workAssignments.add(workAssignment);
        
        WorkforcePersons workforcePerson = WorkforcePersons.create();
        String workforcePersonId = UUID.randomUUID().toString();
        workforcePerson.setId(workforcePersonId);
        workforcePerson.setWorkAssignments(workAssignments);
        
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        when(this.result.first(WorkforcePersons.class)).thenReturn(Optional.of(workforcePerson));
        List<WorkAssignments> actualWorkAssignments = classUnderTest.readWorkAssignmentsOfWorkforcePerson(workforcePersonId);
        assertTrue(workAssignments.get(0).equals(actualWorkAssignments.get(0)));
    }

}
