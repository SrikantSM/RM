package com.sap.c4p.rm.processor.workforce.dao;

import java.util.List;

import com.sap.resourcemanagement.employee.Attachment;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.sap.c4p.rm.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.c4p.rm.replicationdao.MDIObjectReplicationStatusDAO;
import com.sap.c4p.rm.replicationdao.ReplicationFailureDAO;
import com.sap.c4p.rm.utils.IsNullCheckUtils;
import com.sap.resourcemanagement.consultantprofile.integration.AvailabilityReplicationSummary;
import com.sap.resourcemanagement.consultantprofile.integration.ReplicationFailures;
import com.sap.resourcemanagement.employee.Headers;
import com.sap.resourcemanagement.employee.ProfilePhoto;
import com.sap.resourcemanagement.workforce.workforceperson.WorkforcePersons;

/**
 * Class to implement {@link WorkforceReplicationDAO}.
 */
@Repository
public class WorkforceReplicationDAOImpl implements WorkforceReplicationDAO {
    private static final Marker WORKFORCE_REPLICATION_MARKER = LoggingMarker.WORKFORCE_REPLICATION.getMarker();

    private final AvailabilityReplicationSummaryDAO availabilityReplicationSummaryDAO;
    private final EmpHeaderDAO empHeaderDAO;
    private final MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO;
    private final ReplicationFailureDAO replicationFailureDAO;
    private final WorkforcePersonDAO workforcePersonDAO;
    private final ProfilePhotoDAO profilePhotoDAO;
    private final AttachmentDAO attachmentDAO;

    @Autowired
    public WorkforceReplicationDAOImpl(final EmpHeaderDAO empHeaderDAO, final WorkforcePersonDAO workforcePersonDAO,
            final AvailabilityReplicationSummaryDAO availabilityReplicationSummaryDAO,
            final MDIObjectReplicationStatusDAO mdiObjectReplicationStatusDAO,
            final ReplicationFailureDAO replicationFailureDAO, final ProfilePhotoDAO profilePhotoDAO, final AttachmentDAO attachmentDAO) {
        this.availabilityReplicationSummaryDAO = availabilityReplicationSummaryDAO;
        this.empHeaderDAO = empHeaderDAO;
        this.mdiObjectReplicationStatusDAO = mdiObjectReplicationStatusDAO;
        this.replicationFailureDAO = replicationFailureDAO;
        this.workforcePersonDAO = workforcePersonDAO;
        this.profilePhotoDAO = profilePhotoDAO;
        this.attachmentDAO = attachmentDAO;
    }

    @Override
    @Transactional(rollbackFor = { TransactionException.class })
    public void save(final Headers employeeHeader, final WorkforcePersons workforcePerson,
            final List<AvailabilityReplicationSummary> availabilityReplicationSummaryList,
            final ProfilePhoto profilePhoto, final Attachment attachment) {
        this.empHeaderDAO.save(employeeHeader);
        this.workforcePersonDAO.save(workforcePerson);
        if (!IsNullCheckUtils.isNullOrEmpty(profilePhoto)) {
            this.profilePhotoDAO.save(profilePhoto);
        }
        if (!IsNullCheckUtils.isNullOrEmpty(attachment)) {
            this.attachmentDAO.save(attachment);
        }
        this.mdiObjectReplicationStatusDAO.delete(MDIEntities.WORKFORCE_PERSON, employeeHeader.getId());
        if (!IsNullCheckUtils.isNullOrEmpty(availabilityReplicationSummaryList))
            this.availabilityReplicationSummaryDAO.save(availabilityReplicationSummaryList);
    }

    @Override
    @Transactional(rollbackFor = { TransactionException.class })
    public void save(final Headers employeeHeader, final WorkforcePersons workforcePerson,
            final List<AvailabilityReplicationSummary> availabilityReplicationSummaryList,
            final ProfilePhoto profilePhoto, final Attachment attachment, final ReplicationFailures replicationFailures) {
        this.empHeaderDAO.save(employeeHeader);
        this.workforcePersonDAO.save(workforcePerson);
        if (!IsNullCheckUtils.isNullOrEmpty(profilePhoto)) {
            this.profilePhotoDAO.save(profilePhoto);
        }
        if (!IsNullCheckUtils.isNullOrEmpty(attachment)) {
            this.attachmentDAO.save(attachment);
        }
        this.mdiObjectReplicationStatusDAO.delete(MDIEntities.WORKFORCE_PERSON, employeeHeader.getId());
        this.replicationFailureDAO.update(WORKFORCE_REPLICATION_MARKER, replicationFailures);
        if (!IsNullCheckUtils.isNullOrEmpty(availabilityReplicationSummaryList))
            this.availabilityReplicationSummaryDAO.save(availabilityReplicationSummaryList);
    }

}
