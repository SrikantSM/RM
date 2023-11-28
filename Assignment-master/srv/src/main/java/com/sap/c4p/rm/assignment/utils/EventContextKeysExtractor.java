package com.sap.c4p.rm.assignment.utils;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.services.cds.CdsDeleteEventContext;

@Component
public class EventContextKeysExtractor {

  public Map<String, Object> getDeleteEventContextKeys(final CdsDeleteEventContext context) {
    CqnAnalyzer cqnAnalyzer = CqnAnalyzer.create(context.getModel());
    return cqnAnalyzer.analyze(context.getCqn()).targetKeys();
  }

}
