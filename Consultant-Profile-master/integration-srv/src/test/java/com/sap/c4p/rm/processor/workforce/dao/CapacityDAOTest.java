package com.sap.c4p.rm.processor.workforce.dao;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnPredicate;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.resourcemanagement.resource.Capacity;

public class CapacityDAOTest extends InitMocks {
    @Mock
    PersistenceService persistenceService;

    @Mock
    Result result;
    
    @Mock
    Capacity mockCapacity;

    @Autowired
    @InjectMocks
    CapacityDAOImpl classUnderTest;

    @Test
    @DisplayName("test save when persistence run raise exception")
    public void testSaveWhenPersistenceRunRaiseException() {
    	List<Capacity> capacities = new ArrayList<>();
        Capacity capacity = Capacity.create();
        capacities.add(capacity);
        doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpsert.class));
        assertThrows(TransactionException.class, () -> this.classUnderTest.save(capacities));
        verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
    }

    @Test
    @DisplayName("test save when persistence do not raise exception")
    public void testSaveWhenPersistenceDoNotRaiseException() {
    	List<Capacity> capacities = new ArrayList<>();
        Capacity capacity = Capacity.create();
        capacities.add(capacity);
        this.classUnderTest.save(capacities);
        verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
    }

    @Test 
    @DisplayName("test read with no capacity")
    public void testReadWithNoCapacity() {
    	List<Capacity> capacities = new ArrayList<>();
    	CqnPredicate filter = null;
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        when(this.result.listOf(Capacity.class)).thenReturn(capacities);
        assertTrue(classUnderTest.read(filter).isEmpty());
    }

    @Test
    @DisplayName("test read with capacity")
    public void testReadWithCapacity() {
    	CqnPredicate filter = null;
    	List<Capacity> capacities = new ArrayList<>();
    	Capacity capacity = Capacity.create();
    	capacities.add(capacity);
    	capacity.setResourceId("test-resource");
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        when(this.result.listOf(Capacity.class)).thenReturn(capacities);
        assertEquals(capacities, classUnderTest.read(filter));
    }

}
