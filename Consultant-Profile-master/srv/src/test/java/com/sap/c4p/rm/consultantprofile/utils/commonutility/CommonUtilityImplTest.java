package com.sap.c4p.rm.consultantprofile.utils.commonutility;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

import java.util.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.consultantprofile.InitMocks;

public class CommonUtilityImplTest extends InitMocks {

    @Mock
    PersistenceService mockPersistenceService;

    @Mock
    Result mockResult;

    @Mock
    Row mockRow;

    @Autowired
    @InjectMocks
    CommonUtilityImpl classUnderTest;

    @Test
    @DisplayName("Check if value is being returned from getRecordsValueFromDB")
    void testGetRecordsValueFromDB1() {
        final String dbArtifact = "randomDbArtifact";
        final String dbCompareColumn = "randomDbCompareColumn";
        final List<String> keyValueList = new ArrayList<>();
        final String dbGetValueColumn = "randomDbGetValueColumn";
        final List<Row> rowList = new ArrayList<>();
        rowList.add(mockRow);
        when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.list()).thenReturn(rowList);
        when(mockRow.get(anyString())).thenReturn(dbGetValueColumn);
        classUnderTest.getRecordsValueFromDB(dbArtifact, dbCompareColumn, keyValueList, dbGetValueColumn);
    }

    @Test
    @DisplayName("Check if value is being returned from getRecordsValueFromDB")
    void testGetRecordsValueFromDB2() {
        final String dbArtifact = "randomDbArtifact";
        final String dbCompareColumn = "randomDbCompareColumn";
        final Set<String> keyValueList = new HashSet<>();
        final String dbGetValueColumn = "randomDbGetValueColumn";
        final List<Row> rowList = new ArrayList<>();
        rowList.add(mockRow);
        when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.list()).thenReturn(rowList);
        when(mockRow.get(anyString())).thenReturn(dbGetValueColumn);
        classUnderTest.getRecordsValueFromDB(dbArtifact, dbCompareColumn, keyValueList, dbGetValueColumn);
    }

}
