package com.sap.c4p.rm.consultantprofile.handlers;

import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.consultantprofile.auditlog.AuditLogUtil;
import com.sap.c4p.rm.consultantprofile.projectexperienceservice.validations.ProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator;
import com.sap.c4p.rm.consultantprofile.projectexperienceservice.validations.ProjectExperienceServiceExternalWorkExperienceValidator;
import com.sap.c4p.rm.consultantprofile.projectexperienceservice.validations.ProjectExperienceServiceSkillAssignmentsValidator;
import com.sap.c4p.rm.consultantprofile.utils.CqnUtil;
import com.sap.c4p.rm.consultantprofile.utils.NullUtils;
import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.HandlerOrder;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedDataSubject;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.employee.Headers;
import com.sap.resourcemanagement.employee.Headers_;

import projectexperienceservice.ExternalWorkExperience_;
import projectexperienceservice.ExternalWorkExperience;
import projectexperienceservice.ExternalWorkExperienceSkillAssignments;
import projectexperienceservice.ExternalWorkExperienceSkillAssignments_;
import projectexperienceservice.ProjectExperienceService_;
import projectexperienceservice.SkillAssignments;
import projectexperienceservice.SkillAssignments_;
import java.time.Instant;

@Component
@ServiceName(ProjectExperienceService_.CDS_NAME)
public class ProjectExperienceServiceEventHandler implements EventHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(ProjectExperienceServiceEventHandler.class);

    private static final String SKILL_ASSIGNMENTS_OBJECT_TYPE = "SkillAssignments";
    private static final String PROJECT_EXPERIENCE_SERVICE_IDENTIFIER = "ProjectExperienceService";
    private static final String DATA_SUBJECT_TYPE = "WorkForcePerson";
    private static final String DATA_SUBJECT_ROLE = "Project Team Member";
    private static final String PROFILE_ID = "profileId";
    private static final String CHANGED_AT = "changedAt";
    private static final String CHANGED_BY_VALUE = "System User";
    
    @Autowired
    private PersistenceService persistenceService;

    @Autowired
    private ProjectExperienceServiceSkillAssignmentsValidator projectExperienceServiceSkillAssignmentsValidator;

    @Autowired
    private ProjectExperienceServiceExternalWorkExperienceValidator projectExperienceServiceExternalWorkExperienceValidator;

    @Autowired
    private ProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator projectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator;

    @Autowired
    private AuditLogUtil auditLogUtil;

    @Autowired
    private AuditLogMessageFactory auditLogFactory;

    @Autowired
    @Qualifier(ProjectExperienceService_.CDS_NAME)
    private CqnService projectExperienceService;

    @Autowired
    private CqnUtil cqnUtil;

    @Before(event = { CqnService.EVENT_UPDATE, CqnService.EVENT_UPSERT,
            CqnService.EVENT_CREATE }, entity = SkillAssignments_.CDS_NAME)
    @HandlerOrder(HandlerOrder.EARLY)
    public void beforeCreateUpsertUpdateSkillAssignmentsValidation(EventContext context,
            SkillAssignments skillAssignment) {
        LOGGER.debug("Starting beforeCreateUpsertUpdateSkillAssignmentsValidation");
        projectExperienceServiceSkillAssignmentsValidator.checkSkillAssignmentForXSS(skillAssignment);
        projectExperienceServiceSkillAssignmentsValidator.checkIfDraftExists(skillAssignment);
        projectExperienceServiceSkillAssignmentsValidator.checkForeignKeyValueForAssignedSkill(skillAssignment);
        projectExperienceServiceSkillAssignmentsValidator.checkForeignKeyValueForAssignedProfile(skillAssignment);
        projectExperienceServiceSkillAssignmentsValidator
                .checkForeignKeyValueForAssignedProficiencyLevel(skillAssignment);
    }
    
    @Before(event = { CqnService.EVENT_UPDATE, CqnService.EVENT_UPSERT,
            CqnService.EVENT_CREATE }, entity = ExternalWorkExperience_.CDS_NAME)
    @HandlerOrder(HandlerOrder.EARLY)
    public void beforeCreateUpsertUpdateExternalWorkExperienceValidation(EventContext context,
            ExternalWorkExperience externalWorkExperience) {
        LOGGER.debug("Starting beforeCreateUpsertUpdateExternalWorkExperienceValidation");
        projectExperienceServiceExternalWorkExperienceValidator.checkExternalWorkExperienceForXSS(externalWorkExperience);
        projectExperienceServiceExternalWorkExperienceValidator.checkIfDraftExists(externalWorkExperience);
        projectExperienceServiceExternalWorkExperienceValidator.validateStartDate(externalWorkExperience);
        projectExperienceServiceExternalWorkExperienceValidator.checkForeignKeyValueForAssignedProfile(externalWorkExperience);
    }
    
    @Before(event = { CqnService.EVENT_UPDATE, CqnService.EVENT_UPSERT,
            CqnService.EVENT_CREATE }, entity = ExternalWorkExperienceSkillAssignments_.CDS_NAME)
    @HandlerOrder(HandlerOrder.EARLY)
    public void beforeCreateUpsertUpdateExternalWorkExperienceSkillAssignmentsValidation(EventContext context,
            ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments) {
        LOGGER.debug("Starting beforeCreateUpsertUpdateExternalWorkExperienceSkillAssignmentsValidation");
        projectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator.checkExternalWorkExperienceSkillAssignmentsForXSS(externalWorkExperienceSkillAssignments);
        projectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator.checkIfDraftExists(externalWorkExperienceSkillAssignments);
        projectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator.checkForeignKeyValueForAssignedProfile(externalWorkExperienceSkillAssignments);
        projectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator.checkForeignKeyValueForAssignedExternalWorkExperience(externalWorkExperienceSkillAssignments);
        projectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator.checkForeignKeyValueForAssignedSkill(externalWorkExperienceSkillAssignments);
        projectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator.checkForeignKeyValueForAssignedProficiencyLevel(externalWorkExperienceSkillAssignments);
    }

    @Before(event = CqnService.EVENT_CREATE, entity = SkillAssignments_.CDS_NAME)
    @HandlerOrder(HandlerOrder.EARLY+1)
    public void beforeCreateSkillAssignmentsAuditLog(EventContext context, SkillAssignments skillAssignment) {
        LOGGER.debug("Starting beforeCreateSkillAssignmentsAuditLog");
        HashMap<String, String> entity = this.prepareSkillAssignmentsEntity(skillAssignment);
        AuditedDataSubject dataSubject = this.getAuditedDataSubject(skillAssignment.getProfileID());
        auditLogUtil.logDataModificationAuditMessage(context, SKILL_ASSIGNMENTS_OBJECT_TYPE,
                PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, entity, null, dataSubject, AuditLogUtil.CREATE_OPERATION);

    }

    @Before(event = { CqnService.EVENT_UPDATE, CqnService.EVENT_UPSERT }, entity = SkillAssignments_.CDS_NAME)
    @HandlerOrder(HandlerOrder.EARLY+1)
    public void beforeUpsertUpdateDeleteSkillAssignmentsAuditLog(EventContext context,
            SkillAssignments skillAssignment) {
        LOGGER.debug("Starting beforeUpsertUpdateDeleteSkillAssignmentsAuditLog");
        AuditedDataSubject dataSubject;
        HashMap<String, String> entity = this.prepareSkillAssignmentsEntity(skillAssignment);
        Result result = projectExperienceService
                .run(Select.from(SkillAssignments_.class).where(p -> p.ID().eq(skillAssignment.getId())));
        if (result.first().isPresent()) {
            LOGGER.debug("Fetched skill assignment to be updated");
            SkillAssignments oldSkillAssignment = result.single(SkillAssignments.class);
            HashMap<String, String> oldEntity = this.prepareSkillAssignmentsEntity(oldSkillAssignment);
            oldEntity.keySet().removeIf(key -> (!entity.containsKey(key)));
            dataSubject = this.getAuditedDataSubject(oldSkillAssignment.getProfileID());
            auditLogUtil.logDataModificationAuditMessage(context, SKILL_ASSIGNMENTS_OBJECT_TYPE,
                    PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, entity, oldEntity, dataSubject,
                    AuditLogUtil.UPDATE_OPERATION);
        } else {
            dataSubject = this.getAuditedDataSubject(skillAssignment.getProfileID());
            auditLogUtil.logDataModificationAuditMessage(context, SKILL_ASSIGNMENTS_OBJECT_TYPE,
                    PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, entity, null, dataSubject, AuditLogUtil.CREATE_OPERATION);
        }
    }

    @Before(event = { CqnService.EVENT_DELETE }, entity = SkillAssignments_.CDS_NAME)
    @HandlerOrder(HandlerOrder.EARLY)
    public void beforeDeleteSkillAssignmentsAuditLog(CdsDeleteEventContext cdsDeleteEventContext) {
        LOGGER.debug("Starting beforeDeleteSkillAssignmentsAuditLog");
        Result result = projectExperienceService.run(Select.from(SkillAssignments_.class).where(p -> p.ID().eq(cqnUtil.getRootKey(cdsDeleteEventContext, cdsDeleteEventContext.getCqn(), SkillAssignments.ID))));
        if (result.first().isPresent()) {
            LOGGER.debug("Fetched skill assignment to be deleted");
            SkillAssignments skillAssignment = result.single(SkillAssignments.class);
            projectExperienceServiceSkillAssignmentsValidator.checkIfDraftExists(skillAssignment);
            HashMap<String, String> entity = this.prepareSkillAssignmentsEntity(skillAssignment);
            AuditedDataSubject dataSubject = this.getAuditedDataSubject(skillAssignment.getProfileID());
            auditLogUtil.logDataModificationAuditMessage(cdsDeleteEventContext, SKILL_ASSIGNMENTS_OBJECT_TYPE,
                PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, entity, null, dataSubject, AuditLogUtil.DELETE_OPERATION);
            String profileId = (String) result.first().get().get(SkillAssignments.PROFILE_ID);
            cdsDeleteEventContext.put(PROFILE_ID, profileId);
            cdsDeleteEventContext.put(CHANGED_AT, Instant.now());
        }
    }
    
    @Before(event = { CqnService.EVENT_DELETE }, entity = ExternalWorkExperience_.CDS_NAME)
    @HandlerOrder(HandlerOrder.EARLY)
    public void beforeDeleteExternalWorkExperience(CdsDeleteEventContext cdsDeleteEventContext) {
    	LOGGER.debug("Starting beforeDeleteExternalWorkExperience");
        Result result = projectExperienceService.run(Select.from(ExternalWorkExperience_.class).where(p -> p.ID().eq(cqnUtil.getRootKey(cdsDeleteEventContext, cdsDeleteEventContext.getCqn(), ExternalWorkExperience.ID))));
        if (result.first().isPresent()) {
            LOGGER.debug("Fetched external work experience to be deleted");
            ExternalWorkExperience externalWorkExperience = result.single(ExternalWorkExperience.class);
            projectExperienceServiceExternalWorkExperienceValidator.checkIfDraftExists(externalWorkExperience);
            String profileId = (String) result.first().get().get(ExternalWorkExperience.PROFILE_ID);
        	cdsDeleteEventContext.put(PROFILE_ID, profileId);
        	cdsDeleteEventContext.put(CHANGED_AT, Instant.now());
        }
    }
    
    @Before(event = { CqnService.EVENT_DELETE }, entity = ExternalWorkExperienceSkillAssignments_.CDS_NAME)
    @HandlerOrder(HandlerOrder.EARLY)
    public void beforeDeleteExternalWorkExperienceSkillAssignments(CdsDeleteEventContext cdsDeleteEventContext) {
        LOGGER.debug("Starting beforeDeleteExternalWorkExperienceSkillAssignments");
        Result result = projectExperienceService.run(Select.from(ExternalWorkExperienceSkillAssignments_.class).where(p -> p.ID().eq(cqnUtil.getRootKey(cdsDeleteEventContext, cdsDeleteEventContext.getCqn(), ExternalWorkExperienceSkillAssignments.ID))));
        if (result.first().isPresent()) {
            LOGGER.debug("Fetched external work experience skill assignment to be deleted");
            ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments = result.single(ExternalWorkExperienceSkillAssignments.class);
            projectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator.checkIfDraftExists(externalWorkExperienceSkillAssignments);
            String profileId = (String) result.first().get().get(ExternalWorkExperienceSkillAssignments.PROFILE_ID);
        	cdsDeleteEventContext.put(PROFILE_ID, profileId);
        	cdsDeleteEventContext.put(CHANGED_AT, Instant.now());
        }
    }
    
    @After(event = { CqnService.EVENT_CREATE }, entity = SkillAssignments_.CDS_NAME)
    public void afterCreateSkillAssignment( SkillAssignments skillAssignment ) {
    	Headers modifedValuesForUpdate = Headers.create();
    	modifedValuesForUpdate.setModifiedBy(CHANGED_BY_VALUE);
    	modifedValuesForUpdate.setModifiedAt(skillAssignment.getChangedAt());
    	CqnUpdate update = Update.entity(Headers_.class).where(s -> s.ID().eq(skillAssignment.getProfileID())).data(modifedValuesForUpdate);
        this.persistenceService.run(update);
    }
    
    @After(event = { CqnService.EVENT_UPDATE, CqnService.EVENT_UPSERT }, entity = SkillAssignments_.CDS_NAME)
    public void afterUpdateSkillAssignment( SkillAssignments skillAssignment ) {
    	Headers modifedValuesForUpdate = Headers.create();
    	modifedValuesForUpdate.setModifiedBy(CHANGED_BY_VALUE);
    	modifedValuesForUpdate.setModifiedAt(skillAssignment.getChangedAt());
    	Result result = projectExperienceService
                .run(Select.from(SkillAssignments_.class).where(p -> p.ID().eq(skillAssignment.getId())));
        if (result.first().isPresent()) {
        	String profileId = (String) result.first().get().get(SkillAssignments.PROFILE_ID);
        	CqnUpdate update = Update.entity(Headers_.class).where(s -> s.ID().eq(profileId)).data(modifedValuesForUpdate);
            this.persistenceService.run(update);
        }
    }
    
    @After(event = { CqnService.EVENT_CREATE }, entity = ExternalWorkExperience_.CDS_NAME)
    public void afterCreateExternalWorkExperience( ExternalWorkExperience externalWorkExperience ) {
    	Headers modifedValuesForUpdate = Headers.create();
    	modifedValuesForUpdate.setModifiedBy(CHANGED_BY_VALUE);
    	modifedValuesForUpdate.setModifiedAt(externalWorkExperience.getChangedAt());
    	CqnUpdate update = Update.entity(Headers_.class).where(s -> s.ID().eq(externalWorkExperience.getProfileID())).data(modifedValuesForUpdate);
        this.persistenceService.run(update);
    }
    
    @After(event = { CqnService.EVENT_UPDATE, CqnService.EVENT_UPSERT }, entity = ExternalWorkExperience_.CDS_NAME)
    public void afterUpdateExternalWorkExperience( ExternalWorkExperience externalWorkExperience ) {
    	Headers modifedValuesForUpdate = Headers.create();
    	modifedValuesForUpdate.setModifiedBy(CHANGED_BY_VALUE);
    	modifedValuesForUpdate.setModifiedAt(externalWorkExperience.getChangedAt());
    	Result result = projectExperienceService
                .run(Select.from(ExternalWorkExperience_.class).where(p -> p.ID().eq(externalWorkExperience.getId())));
        if (result.first().isPresent()) {
        	String profileId = (String) result.first().get().get(ExternalWorkExperience.PROFILE_ID);
        	CqnUpdate update = Update.entity(Headers_.class).where(s -> s.ID().eq(profileId)).data(modifedValuesForUpdate);
            this.persistenceService.run(update);
        }
    }
    
    @After(event = { CqnService.EVENT_CREATE }, entity = ExternalWorkExperienceSkillAssignments_.CDS_NAME)
    public void afterCreateExternalWorkExperienceSkillAssignments( ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments ) {
    	Headers modifedValuesForUpdate = Headers.create();
    	modifedValuesForUpdate.setModifiedBy(CHANGED_BY_VALUE);
    	modifedValuesForUpdate.setModifiedAt(externalWorkExperienceSkillAssignments.getChangedAt());
    	CqnUpdate update = Update.entity(Headers_.class).where(s -> s.ID().eq(externalWorkExperienceSkillAssignments.getProfileID())).data(modifedValuesForUpdate);
        this.persistenceService.run(update);
    }
    
    @After(event = { CqnService.EVENT_UPDATE, CqnService.EVENT_UPSERT }, entity = ExternalWorkExperienceSkillAssignments_.CDS_NAME)
    public void afterUpdateExternalWorkExperienceSkillAssignments( ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments ) {
    	Headers modifedValuesForUpdate = Headers.create();
    	modifedValuesForUpdate.setModifiedBy(CHANGED_BY_VALUE);
    	modifedValuesForUpdate.setModifiedAt(externalWorkExperienceSkillAssignments.getChangedAt());
    	Result result = projectExperienceService
                .run(Select.from(ExternalWorkExperienceSkillAssignments_.class).where(p -> p.ID().eq(externalWorkExperienceSkillAssignments.getId())));
        if (result.first().isPresent()) {
        	String profileId = (String) result.first().get().get(ExternalWorkExperienceSkillAssignments.PROFILE_ID);
        	CqnUpdate update = Update.entity(Headers_.class).where(s -> s.ID().eq(profileId)).data(modifedValuesForUpdate);
            this.persistenceService.run(update);
        }
    }
    

    @After(event = { CqnService.EVENT_DELETE }, entity = SkillAssignments_.CDS_NAME)
    public void afterDeleteSkillAssignment( CdsDeleteEventContext cdsDeleteEventContext ) {
    	if (cdsDeleteEventContext.keySet().contains(PROFILE_ID)) {
    		Headers modifedValuesForUpdate = Headers.create();
        	modifedValuesForUpdate.setModifiedBy(CHANGED_BY_VALUE);
    		modifedValuesForUpdate.setModifiedAt((Instant) cdsDeleteEventContext.get(CHANGED_AT));
    	    CqnUpdate update = Update.entity(Headers_.class).where(s -> s.ID().eq((String) cdsDeleteEventContext.get(PROFILE_ID))).data(modifedValuesForUpdate);
            this.persistenceService.run(update);
    	}
    }

    
    @After(event = { CqnService.EVENT_DELETE }, entity = ExternalWorkExperience_.CDS_NAME)
    public void afterDeleteExternalWorkExperienceAssignment( CdsDeleteEventContext cdsDeleteEventContext ) {
    	if (cdsDeleteEventContext.keySet().contains(PROFILE_ID)) {
    		Headers modifedValuesForUpdate = Headers.create();
    		modifedValuesForUpdate.setModifiedBy(CHANGED_BY_VALUE);
    		modifedValuesForUpdate.setModifiedAt((Instant) cdsDeleteEventContext.get(CHANGED_AT));
    	    CqnUpdate update = Update.entity(Headers_.class).where(s -> s.ID().eq((String) cdsDeleteEventContext.get(PROFILE_ID))).data(modifedValuesForUpdate);
            this.persistenceService.run(update);
    	}
    }
    
    @After(event = { CqnService.EVENT_DELETE }, entity = ExternalWorkExperienceSkillAssignments_.CDS_NAME)
    public void afterDeleteExternalWorkExperienceSkillAssignment( CdsDeleteEventContext cdsDeleteEventContext ) {
    	if (cdsDeleteEventContext.keySet().contains(PROFILE_ID)) {
    		Headers modifedValuesForUpdate = Headers.create();
    		modifedValuesForUpdate.setModifiedBy(CHANGED_BY_VALUE);
    		modifedValuesForUpdate.setModifiedAt((Instant) cdsDeleteEventContext.get(CHANGED_AT));
    	    CqnUpdate update = Update.entity(Headers_.class).where(s -> s.ID().eq((String) cdsDeleteEventContext.get(PROFILE_ID))).data(modifedValuesForUpdate);
            this.persistenceService.run(update);
    	}
    }
    
    protected AuditedDataSubject getAuditedDataSubject(String profileID) {
        AuditedDataSubject dataSubject = auditLogFactory.createAuditedDataSubject();
        dataSubject.addIdentifier("ID", profileID);
        dataSubject.setType(DATA_SUBJECT_TYPE);
        dataSubject.setRole(DATA_SUBJECT_ROLE);
        return dataSubject;
    }

    protected HashMap<String, String> prepareSkillAssignmentsEntity(SkillAssignments skillAssignment) {
        HashMap<String, String> entity = new HashMap<>();
        if (!NullUtils.isNullOrEmpty(skillAssignment.getId())) {
            entity.put(SkillAssignments.ID, skillAssignment.getId());
        }
        if (!NullUtils.isNullOrEmpty(skillAssignment.getProfileID())) {
            entity.put(SkillAssignments.PROFILE_ID, skillAssignment.getProfileID());
        }
        if (!NullUtils.isNullOrEmpty(skillAssignment.getSkillID())) {
            entity.put(SkillAssignments.SKILL_ID, skillAssignment.getSkillID());
        }
        if (!NullUtils.isNullOrEmpty(skillAssignment.getProficiencyLevelID())) {
            entity.put(SkillAssignments.PROFICIENCY_LEVEL_ID, skillAssignment.getProficiencyLevelID());
        }
        return entity;
    }
}
