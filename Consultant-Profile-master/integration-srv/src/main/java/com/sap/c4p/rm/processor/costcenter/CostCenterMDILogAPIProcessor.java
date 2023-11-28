package com.sap.c4p.rm.processor.costcenter;

import static com.sap.c4p.rm.utils.Constants.INSTANCE;
import static com.sap.c4p.rm.utils.Constants.INSTANCE_ID;
import static com.sap.c4p.rm.utils.Constants.MDI_LOG_PROCESSOR_INIT_MESSAGE;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.calm.CalmConstants;
import com.sap.c4p.rm.calm.CalmUtil;
import com.sap.c4p.rm.calm.models.LogEntry;
import com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.config.LoggingMarker;
import com.sap.c4p.rm.exceptions.MandatoryFieldException;
import com.sap.c4p.rm.exceptions.ReplicationException;
import com.sap.c4p.rm.processor.costcenter.dao.CostCenterReplicationDAO;
import com.sap.c4p.rm.processor.costcenter.dto.Attribute;
import com.sap.c4p.rm.processor.costcenter.dto.Instance;
import com.sap.c4p.rm.processor.costcenter.dto.IsValid;
import com.sap.c4p.rm.processor.costcenter.dto.LocalIdS4;
import com.sap.c4p.rm.processor.costcenter.dto.Log;
import com.sap.c4p.rm.replicationdao.ReplicationFailureDAO;
import com.sap.c4p.rm.utils.Constants;
import com.sap.c4p.rm.utils.IsNullCheckUtils;
import com.sap.resourcemanagement.consultantprofile.integration.ReplicationFailures;
import com.sap.resourcemanagement.organization.CostCenterAttributes;
import com.sap.resourcemanagement.organization.CostCenterValidity;
import com.sap.resourcemanagement.organization.CostCenters;

@Component
public class CostCenterMDILogAPIProcessor {

    private static final Logger LOGGER = LoggerFactory.getLogger(CostCenterMDILogAPIProcessor.class);
    private static final Marker COST_CENTER_REPLICATION_MARKER = LoggingMarker.COST_CENTER_REPLICATION.getMarker();

    private final ReplicationFailureDAO replicationFailureDAO;
    private final CostCenterReplicationDAO costCenterReplicationDAO;
    private final ConversionService conversionService;

    @Autowired
    public CostCenterMDILogAPIProcessor(final ReplicationFailureDAO replicationFailureDAO,
            final CostCenterReplicationDAO costCenterReplicationDAO, final ConversionService conversionService) {
        this.replicationFailureDAO = replicationFailureDAO;
        this.costCenterReplicationDAO = costCenterReplicationDAO;
        this.conversionService = conversionService;
    }

    /**
     * Method to initiate the processing of {@link Log} received for workforce
     * replication
     *
     * @param subDomain:      Tenant's subDomain
     * @param costCenterLogs: {@link List}List of {@link Log} that needs to be
     *                        processed
     * @return number of successful replication
     */
	public List<LogEntry> processCostCenterLog(final List<Log> costCenterLogs, final String subDomain,
            final JobSchedulerRunHeader jobSchedulerRunHeader, AtomicInteger successRecords) {
		List<LogEntry> logEntries = new ArrayList<>();
        costCenterLogs.forEach(
				costCenterLog -> logEntries
						.add(processMDILog(costCenterLog, successRecords, subDomain, jobSchedulerRunHeader)));
		return logEntries;
    }

    /**
     * Method to process a {@link Log}'s {@link Instance}, decide how the processed
     * log will be saved
     *
     * @param subDomain:      Tenant's subDomain
     * @param costCenterLog:  {@link Log} that needs to be processed
     * @param successRecords: {@link AtomicInteger} to maintain the number of the
     *                        accepted records for replication.
     */
	private LogEntry processMDILog(final Log costCenterLog, final AtomicInteger successRecords, final String subDomain,
            final JobSchedulerRunHeader jobSchedulerRunHeader) {
        String logEvent = costCenterLog.getEvent();
        String versionId = costCenterLog.getVersionId();
        Instance instance;
        try {
            CostCenters costCenter;
            ReplicationFailures replicationFailures = ReplicationFailures.create();
            switch (logEvent) {
            case "created":
                if ((instance = costCenterLog.getInstance()) != null) {
                    String instanceId = instance.getId();
                    LOGGER.info(COST_CENTER_REPLICATION_MARKER, MDI_LOG_PROCESSOR_INIT_MESSAGE, logEvent, versionId,
                            instanceId);
                    costCenter = this.startProcess(instance);
                    this.costCenterReplicationDAO.save(costCenter);
                }
                break;
            case "updated":
            case "included":
                if ((instance = costCenterLog.getInstance()) != null) {
                    String instanceId = instance.getId();
                    LOGGER.info(COST_CENTER_REPLICATION_MARKER, MDI_LOG_PROCESSOR_INIT_MESSAGE, logEvent, versionId,
                            instanceId);

                    replicationFailures.setInstanceId(instanceId);
                    replicationFailures.setReplicationFailureStatusCode(Constants.REPLICATION_FAILURE_STATUS_CLOSED);
                    costCenter = this.startProcess(instance);
                    this.costCenterReplicationDAO.save(costCenter, replicationFailures);
                }
                break;
            case "deleted":
            case "excluded":
                if ((instance = costCenterLog.getInstance()) != null) {
                    String instanceId = instance.getId();
                    LOGGER.info(COST_CENTER_REPLICATION_MARKER, MDI_LOG_PROCESSOR_INIT_MESSAGE, logEvent, versionId,
                            instanceId);

                    replicationFailures.setInstanceId(instanceId);
                    replicationFailures.setReplicationFailureStatusCode(Constants.REPLICATION_FAILURE_STATUS_CLOSED);
                    costCenter = this.startProcess(instance);
                    costCenter.setIsExcluded(Boolean.TRUE);
                    this.costCenterReplicationDAO.save(costCenter, replicationFailures);
                }
                break;
            default:
                LOGGER.info(COST_CENTER_REPLICATION_MARKER, "Skipping {} event", logEvent);
            }
            successRecords.getAndIncrement();
			return CalmUtil.preparecostCenterLogEntry(costCenterLog, "", "");
        } catch (ReplicationException replicationException) {
			String errorCode = replicationException.getReplicationErrorCode().toString();
			String errorMessage = this.replicationFailureDAO.saveCostCenterReplicationFailure(
					COST_CENTER_REPLICATION_MARKER, replicationException, costCenterLog, subDomain,
					jobSchedulerRunHeader);
			LOGGER.info(COST_CENTER_REPLICATION_MARKER, "Adding erroneous log entry");
			return CalmUtil.preparecostCenterLogEntry(costCenterLog, errorCode, errorMessage);
        } catch (Exception exception) {
            LOGGER.warn(COST_CENTER_REPLICATION_MARKER, exception.getLocalizedMessage(), exception);
			return CalmUtil.preparecostCenterLogEntry(costCenterLog, "RM_CP_000",
					CalmConstants.MDI_OBJECT_PROCESSING_ERROR);

        }
    }

    /**
     * Method to process the {@link Instance}
     *
     * @param instance: {@link Instance} that will be processed
     * @return An object/document of {@link CostCenters}.
     */
    private CostCenters startProcess(final Instance instance) {
        String id;
        String displayName = null;
        if ((id = instance.getId()) == null)
            throw new MandatoryFieldException(INSTANCE_ID, INSTANCE);
        else {
            CostCenters costCenter = CostCenters.create();
            costCenter.setId(id);
            if (!IsNullCheckUtils.isNullOrEmpty(instance.getDisplayName()))
            	displayName = instance.getDisplayName();
                costCenter.setDisplayName(displayName);
            if (!IsNullCheckUtils.isNullOrEmpty(instance.getLocalIdS4())) {
                LocalIdS4 localIdS4 = instance.getLocalIdS4();
                assignS4Properties(costCenter, localIdS4);
                if (displayName != null && !IsNullCheckUtils.isNullOrEmpty(localIdS4.getCostCenterId())) {
                    costCenter.setCostCenterDesc(localIdS4.getCostCenterId() + " (" + instance.getDisplayName() + ")");
                }
            }
            costCenter.setCostCenterAttributes(prepareCostCenterAttributesObject(instance.getAttributes(), id));
            costCenter.setCostCenterValidity(prepareCostCenterValidityObject(instance.getIsValid(), id));
            return costCenter;
        }
    }

    private void assignS4Properties(CostCenters costCenter, LocalIdS4 localIdS4) {
        if (!IsNullCheckUtils.isNullOrEmpty(localIdS4.getCostCenterId()))
            costCenter.setCostCenterID(localIdS4.getCostCenterId());
        if (!IsNullCheckUtils.isNullOrEmpty(localIdS4.getCompanyCode()))
            costCenter.setCompanyCode(localIdS4.getCompanyCode());
        if (!IsNullCheckUtils.isNullOrEmpty(localIdS4.getControllingArea()))
            costCenter.setControllingArea(localIdS4.getControllingArea());
        if (!IsNullCheckUtils.isNullOrEmpty(localIdS4.getLogicalSystem()))
            costCenter.setLogicalSystem(localIdS4.getLogicalSystem());
    }

    private List<CostCenterAttributes> prepareCostCenterAttributesObject(final List<Attribute> oneMDSAttributes,
            final String costCenterUUID) {
        if (IsNullCheckUtils.isNullOrEmpty(oneMDSAttributes))
            return Collections.emptyList();
        List<CostCenterAttributes> costCenterAttributes = new ArrayList<>();
        try {
            for (Attribute oneMDSAttribute : oneMDSAttributes) {
                CostCenterAttributes costCenterAttribute;
                if ((costCenterAttribute = this.conversionService.convert(oneMDSAttribute,
                        CostCenterAttributes.class)) != null) {
                    costCenterAttribute.setParent(costCenterUUID);
                    costCenterAttributes.add(costCenterAttribute);
                }
            }
        } catch (ConversionFailedException conversionFailedException) {
            LOGGER.error(COST_CENTER_REPLICATION_MARKER, "costCenter attributes data conversion Failed",
                    conversionFailedException);
        }
        return costCenterAttributes;
    }

    private List<CostCenterValidity> prepareCostCenterValidityObject(final List<IsValid> oneMDSValidities,
            final String costCenterUUID) {
        if (IsNullCheckUtils.isNullOrEmpty(oneMDSValidities))
            return Collections.emptyList();
        List<CostCenterValidity> costCenterValidities = new ArrayList<>();
        try {
            for (IsValid oneMDSValidity : oneMDSValidities) {
                CostCenterValidity costCenterValidity;
                if ((costCenterValidity = this.conversionService.convert(oneMDSValidity,
                        CostCenterValidity.class)) != null) {
                    costCenterValidity.setParent(costCenterUUID);
                    costCenterValidities.add(costCenterValidity);
                }
            }
        } catch (ConversionFailedException conversionFailedException) {
            LOGGER.error(COST_CENTER_REPLICATION_MARKER, "costCenter validity data conversion Failed",
                    conversionFailedException);
        }
        return costCenterValidities;
    }
}
