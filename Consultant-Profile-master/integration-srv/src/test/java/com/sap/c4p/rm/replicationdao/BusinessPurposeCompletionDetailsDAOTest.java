package com.sap.c4p.rm.replicationdao;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.InitMocks;

import com.sap.resourcemanagement.workforce.workforceperson.BusinessPurposeCompletionDetails;

public class BusinessPurposeCompletionDetailsDAOTest extends InitMocks {

    @Mock
    PersistenceService persistenceService;

    @Mock
    Result result;

    @InjectMocks
    @Autowired
    BusinessPurposeCompletionDetailsDAOImpl classUnderTest;

    @Test
    @DisplayName("test readAllWithID with no BusinessPurposeCompletionDetails")
    public void testReadAllWithNoMDIObjectsRecords() {
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        when(this.result.listOf(BusinessPurposeCompletionDetails.class)).thenReturn(Collections.emptyList());
        assertTrue(this.classUnderTest.readAllWithID(Arrays.asList("Test-1", "Test-2")).isEmpty());
    }

    @Test
    @DisplayName("test readAllWithID with a few BusinessPurposeCompletionDetails")
    public void testReadAllWithMDIObjectsRecords() {
        BusinessPurposeCompletionDetails businessPurposeCompletionDetails1 = BusinessPurposeCompletionDetails.create();
        List<BusinessPurposeCompletionDetails> businessPurposeCompletionDetailsList = new ArrayList<>();
        businessPurposeCompletionDetailsList.add(businessPurposeCompletionDetails1);
        when(this.persistenceService.run(any(CqnSelect.class))).thenReturn(result);
        when(this.result.listOf(BusinessPurposeCompletionDetails.class))
                .thenReturn(businessPurposeCompletionDetailsList);
        assertEquals(businessPurposeCompletionDetailsList,
                this.classUnderTest.readAllWithID(Arrays.asList("Test-1", "Test-2")));
    }

}
