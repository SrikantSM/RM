package com.sap.c4p.rm.processor.workforce.dao;

import static com.sap.c4p.rm.utils.Constants.WORK_FORCE_PERSON;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.sap.cds.Result;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.c4p.rm.replicationdao.MDIObjectReplicationStatusDAO;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignment_;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments;
import com.sap.resourcemanagement.workforce.workassignment.WorkAssignments_;
import com.sap.resourcemanagement.workforce.workforceperson.Emails_;
import com.sap.resourcemanagement.workforce.workforceperson.Phones_;
import com.sap.resourcemanagement.workforce.workforceperson.ProfileDetails_;
import com.sap.resourcemanagement.workforce.workforceperson.WorkforcePersons;
import com.sap.resourcemanagement.workforce.workforceperson.WorkforcePersons_;

/**
 * Class to implement {@link WorkforcePersonDAO}.
 */
@Repository
public class WorkforcePersonDAOImpl implements WorkforcePersonDAO {
    private static final Logger LOGGER = LoggerFactory.getLogger(WorkforcePersonDAOImpl.class);
    private static final Marker WORKFORCE_REPLICATION_MARKER = LoggingMarker.WORKFORCE_REPLICATION.getMarker();

    private final MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;
    private final PersistenceService persistenceService;

    @Autowired
    public WorkforcePersonDAOImpl(final MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO,
            final PersistenceService persistenceService) {
        this.mdiObjectReplicationStatusDAO = mdiObjectReplicationStatusDAO;
        this.persistenceService = persistenceService;
    }

    @Override
    public void save(final WorkforcePersons workforcePersons) {
    	CqnSelect cqnSelect = Select.from(WorkforcePersons_.class)
    			.columns(a -> a.expand())
                .where(b -> b.get(WorkforcePersons.ID).eq(workforcePersons.getId()));
    	try {
    		Optional<WorkforcePersons> workforcePersonsGuidOptional = this.persistenceService.run(cqnSelect).first(WorkforcePersons.class);
    		if (workforcePersonsGuidOptional.isPresent()) {
    			this.persistenceService.run(Delete.from(WorkforcePersons_.CDS_NAME).where(b -> b.get(WorkforcePersons.ID).eq(workforcePersons.getId())));
    		}
    		CqnInsert cqnInsert = Insert.into(WorkforcePersons_.CDS_NAME).entry(workforcePersons);
    		this.persistenceService.run(cqnInsert);
        } catch (ServiceException serviceException) {
            LOGGER.error(WORKFORCE_REPLICATION_MARKER, "Error occurred while upserting WorkforcePerson Information");
            throw new TransactionException(serviceException, "upserting", WORK_FORCE_PERSON);
        }
    }

    @Override
    public void update(final WorkforcePersons workforcePersons) {
        CqnUpdate cqnUpdate = Update.entity(WorkforcePersons_.CDS_NAME).data(workforcePersons);
        try {
            this.persistenceService.run(cqnUpdate);
        } catch (ServiceException serviceException) {
            LOGGER.error(WORKFORCE_REPLICATION_MARKER, "Error occurred while updating WorkforcePerson Information");
            throw new TransactionException(serviceException, "updating", WORK_FORCE_PERSON);
        }
    }

    @Override
    public boolean isExists(String workforcePersonId) {
        CqnSelect cqnSelect = Select.from(WorkforcePersons_.CDS_NAME)
                .where(b -> b.get(WorkforcePersons.ID).eq(workforcePersonId));
        long result = persistenceService.run(cqnSelect).rowCount();
        return (result > 0);
    }

    @Override
    public WorkforcePersons read(String workforcePersonId) {
        CqnSelect cqnSelect = Select.from(WorkforcePersons_.class)
                .columns(b -> b.profileDetails().expand(ProfileDetails_::_all), b -> b.emails().expand(Emails_::_all),
                        b -> b.phones().expand(Phones_::_all))
                .where(b -> b.get(WorkforcePersons.ID).eq(workforcePersonId));
        Result result = persistenceService.run(cqnSelect);
        return result.first(WorkforcePersons.class).orElse(null);
    }

    @Override
    public List<WorkforcePersons> readAll() {
        CqnSelect cqnSelect = Select.from(WorkforcePersons_.class);
        return this.persistenceService.run(cqnSelect).listOf(WorkforcePersons.class);
    }

    @Override
    @Transactional
    public void markBusinessPurposeComplete(final List<WorkforcePersons> workforcePerson) {
        CqnUpdate cqnUpdate = Update.entity(WorkforcePersons_.class).entries(workforcePerson);
        this.persistenceService.run(cqnUpdate);
        this.mdiObjectReplicationStatusDAO.delete(MDIEntities.WORKFORCE_PERSON);
    }
    
    @Override
    public Boolean getIsBusinessPurposeCompletedForWorkforcePerson(String workforcePersonID) {
		CqnSelect selectQuery = Select.from(WorkforcePersons_.CDS_NAME)
        		.columns(c -> c.get(WorkforcePersons.IS_BUSINESS_PURPOSE_COMPLETED))
                .where(b -> b.get(WorkforcePersons.ID).eq(workforcePersonID));
		Optional<WorkforcePersons> workforcePersonsGuidOptional = persistenceService.run(selectQuery).first(WorkforcePersons.class);
		if (!workforcePersonsGuidOptional.isPresent()) {
			return null;
		}
		WorkforcePersons workforcePersons = workforcePersonsGuidOptional.get();
		return workforcePersons.getIsBusinessPurposeCompleted();
	}
    
    @Override
    public List<WorkAssignments> readWorkAssignmentsOfWorkforcePerson(String workforcePersonId) {
        CqnSelect cqnSelect = Select.from(WorkforcePersons_.class)
                .columns(b -> b.workAssignments().expand(WorkAssignments_::_all))
                .where(b -> b.get(WorkforcePersons.ID).eq(workforcePersonId));
        Result result = persistenceService.run(cqnSelect);
        WorkforcePersons workforcePerson = result.first(WorkforcePersons.class).orElse(null);
        if (workforcePerson != null)
        	return workforcePerson.getWorkAssignments();
        else
        	return null;
    }
}
