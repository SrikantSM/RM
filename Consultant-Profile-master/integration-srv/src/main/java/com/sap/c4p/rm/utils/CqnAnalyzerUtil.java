package com.sap.c4p.rm.utils;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.cds.CdsReadEventContext;

import replicationscheduleservice.DeactivateContext;
import replicationscheduleservice.EditScheduleContext;

@Component
public class CqnAnalyzerUtil {

    public Map<String, Object> getTargetKeyForCdsReadEventContext(CdsReadEventContext eventContext) {
        CqnAnalyzer cqnAnalyzer = createCQNAnalyzer(eventContext.getModel());
        AnalysisResult analysisResult = cqnAnalyzer.analyze(eventContext.getCqn().ref());
        return analysisResult.targetKeys();
    }

    public Map<String, Object> getTargetKeyForDectivateContext(DeactivateContext eventContext) {
        CqnAnalyzer cqnAnalyzer = createCQNAnalyzer(eventContext.getModel());
        AnalysisResult analysisResult = cqnAnalyzer.analyze(eventContext.getCqn().ref());
        return analysisResult.targetKeys();
    }

    public Map<String, Object> getTargetKeyForEditScheduleContext(EditScheduleContext eventContext) {
        CqnAnalyzer cqnAnalyzer = createCQNAnalyzer(eventContext.getModel());
        AnalysisResult analysisResult = cqnAnalyzer.analyze(eventContext.getCqn().ref());
        return analysisResult.targetKeys();
    }

    CqnAnalyzer createCQNAnalyzer(CdsModel cdsModel) {
        return CqnAnalyzer.create(cdsModel);
    }
}
