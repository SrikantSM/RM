package com.sap.c4p.rm.replicationdao;

import java.util.List;

import com.sap.resourcemanagement.workforce.workforceperson.BusinessPurposeCompletionDetails;

public interface BusinessPurposeCompletionDetailsDAO {

    public List<BusinessPurposeCompletionDetails> readAllWithID(List<String> businessPurposeCompletionDetailsIDs);

}
