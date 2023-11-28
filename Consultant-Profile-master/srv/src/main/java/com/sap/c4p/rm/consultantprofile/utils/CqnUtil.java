package com.sap.c4p.rm.consultantprofile.utils;

import org.springframework.stereotype.Component;

import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnStatement;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.EventContext;

@Component
public class CqnUtil {

    /**
     * @param eventContext
     * @param key
     * @return The value for the root entity's key is extracted from the incoming
     *         CQN.
     *
     *         The means of fetching the root entity's key should be updated to
     *         AnalysisResult.rootKeys() when the cds-services update to 1.5.x is
     *         done.
     */
    public String getRootKey(EventContext eventContext, CqnStatement cqnQuery, String key) {
        CqnAnalyzer cqnAnalyzer = createCQNAnalyzer(eventContext.getModel());
        AnalysisResult analysisResult = cqnAnalyzer.analyze(cqnQuery.ref());
        return (String) analysisResult.rootKeys().get(key);
    }

    CqnAnalyzer createCQNAnalyzer(CdsModel cdsModel) {
        return CqnAnalyzer.create(cdsModel);
    }
}
