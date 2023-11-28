package com.sap.c4p.rm.replicationdao;

import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.consultantprofile.integration.ExistingCustomerInfo;
import com.sap.resourcemanagement.consultantprofile.integration.ExistingCustomerInfo_;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ExistingCustomerDetailDAOImpl implements ExistingCustomerDetailDAO {

    private static final Logger LOGGER = LoggerFactory.getLogger(ExistingCustomerDetailDAOImpl.class);

    private final PersistenceService persistenceService;

    @Autowired
    public ExistingCustomerDetailDAOImpl(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    @Override
    public Boolean getExistingCustomerDetail() {
        CqnSelect cqnSelect = Select.from(ExistingCustomerInfo_.CDS_NAME);
        Result result = this.persistenceService.run(cqnSelect);
        if(result.rowCount()>0) {
            LOGGER.info("Fetching existing customer value");
            ExistingCustomerInfo existingCustomerInfo = result.single(ExistingCustomerInfo.class);
            LOGGER.info("existing customer info object: {}",existingCustomerInfo);
            return existingCustomerInfo.getIsExistingCustomer();
        }
        return null;
    }
}
