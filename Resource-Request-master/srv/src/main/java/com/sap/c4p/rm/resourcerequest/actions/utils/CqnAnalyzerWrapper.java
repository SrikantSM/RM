package com.sap.c4p.rm.resourcerequest.actions.utils;

import org.springframework.stereotype.Component;

import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnStructuredTypeRef;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.reflect.CdsModel;

@Component
public class CqnAnalyzerWrapper {

  public CqnAnalyzer create(CdsModel model) {
    return CqnAnalyzer.create(model);

  }

  public AnalysisResult analyze(CqnAnalyzer cqnAnalyzer, CqnSelect query) {
    return cqnAnalyzer.analyze(query);
  }

  public AnalysisResult analyze(CqnAnalyzer cqnAnalyzer, CqnUpdate query) {
    return cqnAnalyzer.analyze(query);
  }

  public AnalysisResult analyze(CqnAnalyzer cqnAnalyzer, CqnDelete query) {
    return cqnAnalyzer.analyze(query);
  }

  public AnalysisResult analyze(CqnAnalyzer cqnAnalyzer, CqnStructuredTypeRef query) {
    return cqnAnalyzer.analyze(query);
  }

}