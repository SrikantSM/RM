package com.sap.c4p.rm.replicationdao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.resourcemanagement.workforce.workforceperson.BusinessPurposeCompletionDetails;
import com.sap.resourcemanagement.workforce.workforceperson.BusinessPurposeCompletionDetails_;

@Repository
public class BusinessPurposeCompletionDetailsDAOImpl implements BusinessPurposeCompletionDetailsDAO {

    private final PersistenceService persistenceService;

    @Autowired
    public BusinessPurposeCompletionDetailsDAOImpl(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    @Override
    public List<BusinessPurposeCompletionDetails> readAllWithID(List<String> businessPurposeCompletionDetailsIDs) {
        CqnSelect cqnSelect = Select.from(BusinessPurposeCompletionDetails_.class)
                .where(b -> b.get(BusinessPurposeCompletionDetails.ID).in(businessPurposeCompletionDetailsIDs));
        return this.persistenceService.run(cqnSelect).listOf(BusinessPurposeCompletionDetails.class);
    }

}
