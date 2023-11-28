package com.sap.c4p.rm.consultantprofile.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnStructuredTypeRef;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.draft.DraftNewEventContext;

import com.sap.c4p.rm.consultantprofile.InitMocks;

public class CqnUtilTest extends InitMocks {

    @Autowired
    @InjectMocks
    @Spy
    private CqnUtil classUnderTest;

    @Mock
    private DraftNewEventContext mockDraftNewEventContext;

    @Mock
    private CqnInsert mockCqnInsert;

    @Mock
    private CdsModel mockCdsModel;

    @Mock
    private CqnStructuredTypeRef mockCqnStructuredTypeRef;

    @Mock
    private AnalysisResult mockAnalysisResult;

    @Mock
    private CqnAnalyzer mockCqnAnalyzer;

    @BeforeEach
    public void setUp() {
        when(classUnderTest.createCQNAnalyzer(mockCdsModel)).thenReturn(mockCqnAnalyzer);
        when(mockDraftNewEventContext.getModel()).thenReturn(mockCdsModel);
        when(mockDraftNewEventContext.getCqn()).thenReturn(mockCqnInsert);
        when(mockCqnInsert.ref()).thenReturn(mockCqnStructuredTypeRef);
        when(mockCqnAnalyzer.analyze(mockCqnStructuredTypeRef)).thenReturn(mockAnalysisResult);
    }

    @Test
    @DisplayName("validate the population of employee ID during creation of external work experience skills")
    void validateGetRootKeyForDraftNewEvent() {
        Map<String, Object> keys = new HashMap<String, Object>();
        keys.put("ID", "1234");
        when(mockAnalysisResult.rootKeys()).thenReturn(keys);
        assertEquals(classUnderTest.getRootKey(mockDraftNewEventContext, mockCqnInsert, "ID"), "1234");
    }
}
