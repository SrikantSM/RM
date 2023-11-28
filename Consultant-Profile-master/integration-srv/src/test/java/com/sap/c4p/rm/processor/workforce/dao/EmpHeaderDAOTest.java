package com.sap.c4p.rm.processor.workforce.dao;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

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

import com.sap.resourcemanagement.employee.Headers;

public class EmpHeaderDAOTest extends InitMocks {

    @Mock
    PersistenceService persistenceService;

    @Mock
    Result result;

    @Autowired
    @InjectMocks
    EmpHeaderDAOImpl classUnderTest;

    @Test
    @DisplayName("test save when persistence run raise exception")
    public void testSaveWhenPersistenceRunRaiseException() {
        Headers employeeHeader = Headers.create();
        doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpsert.class));
        assertThrows(TransactionException.class, () -> this.classUnderTest.save(employeeHeader));
        verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
    }

    @Test
    @DisplayName("test save when persistence do not raise exception")
    public void testSaveWhenPersistenceDoNotRaiseException() {
        Headers employeeHeader = Headers.create();
        this.classUnderTest.save(employeeHeader);
        verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
    }

    @Test
    @DisplayName("test isExists when no result is returned")
    public void testIsExistsWhenNoResultIsReturned() {
        when(this.result.first(Headers.class)).thenReturn(Optional.empty());
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        assertFalse(this.classUnderTest.isExists("employeeHeaders"));
    }

    @Test
    @DisplayName("test isExists when returned result does not have any row")
    public void testIsExistsWhenReturnedResultDoesNotHaveAnyRow() {
        when(this.result.first(Headers.class)).thenReturn(Optional.of(Headers.create()));
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        assertTrue(this.classUnderTest.isExists("employeeHeaders"));
    }

}
