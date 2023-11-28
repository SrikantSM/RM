package com.sap.c4p.rm.consultantprofile.handlers;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Supplier;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.sap.cds.ql.cqn.Modifier;
import jakarta.annotation.Resource;

import com.sap.c4p.rm.consultantprofile.utils.FileUtils;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.consultantprofile.auditlog.AuditLogUtil;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.myresourceservice.validations.ProjectExperienceHeaderRoleValidator;
import com.sap.c4p.rm.consultantprofile.myresourceservice.validations.ProjectExperienceHeaderSkillValidator;
import com.sap.c4p.rm.consultantprofile.myresourceservice.validations.ProjectExperienceHeaderValidator;
import com.sap.c4p.rm.consultantprofile.utils.CommonEventHandlerUtil;
import com.sap.c4p.rm.consultantprofile.utils.CqnUtil;
import com.sap.c4p.rm.consultantprofile.utils.HttpStatus;
import com.sap.c4p.rm.consultantprofile.utils.NullUtils;
import com.sap.cds.Result;
import com.sap.cds.ql.CQL;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnSelectListItem;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.DraftCancelEventContext;
import com.sap.cds.services.draft.DraftNewEventContext;
import com.sap.cds.services.draft.DraftPatchEventContext;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.HandlerOrder;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.utils.OrderConstants;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedDataSubject;

import myresourcesservice.*;
import org.springframework.util.StringUtils;

@Component
@ServiceName(MyResourcesService_.CDS_NAME)
public class MyResourceServiceHandler implements EventHandler {

    private static final String MYRESOURCE_SERVICE_IDENTIFIER = "MyResources";
    private static final String ROLE_ASSIGNMENT_OBJECT_TYPE = "Roles";
    private static final String SKILL_ASSIGNMENT_OBJECT_TYPE = "Skills";
    private static final String DATA_SUBJECT_TYPE = "WorkForcePerson";
    private static final int FIELD_CONTROL_READONLY = 1;
    private static final int FIELD_CONTROL_EDITABLE = 7;
    private static final int FILE_MAX_SIZE = 2097152;
    private static final String RESUME = "Resume";

    @Autowired
    protected AuditLogUtil auditLogUtil;
    @Autowired
    protected AuditLogMessageFactory auditLogFactory;
    private final ProjectExperienceHeaderValidator projectExperienceHeaderValidator;
    private final ProjectExperienceHeaderRoleValidator projectExperienceHeaderRoleValidator;
    private final ProjectExperienceHeaderSkillValidator projectExperienceHeaderSKillValidator;
    private final CommonEventHandlerUtil commonEventHandlerUtil;
    private final CqnUtil cqnUtil;
    protected CqnAnalyzer analyzer;
    @Resource(name = MyResourcesService_.CDS_NAME)
    protected DraftService myResourceService;
    private final Messages messages;
    @Autowired
    MyProjectExperienceServiceEventHandler myProjectExperienceServiceEventHandler;

    @Autowired
    public MyResourceServiceHandler(final ProjectExperienceHeaderValidator projectExperienceHeaderValidator,
            final ProjectExperienceHeaderSkillValidator projectExperienceHeaderSkillValidator,
            final ProjectExperienceHeaderRoleValidator projectExperienceHeaderRoleValidator,
            final CommonEventHandlerUtil commonEventHandlerUtil, final CqnUtil cqnUtil, final CdsModel model,
            final Messages messages) {
        this.projectExperienceHeaderValidator = projectExperienceHeaderValidator;
        this.projectExperienceHeaderSKillValidator = projectExperienceHeaderSkillValidator;
        this.projectExperienceHeaderRoleValidator = projectExperienceHeaderRoleValidator;
        this.commonEventHandlerUtil = commonEventHandlerUtil;
        this.cqnUtil = cqnUtil;
        this.analyzer = CqnAnalyzer.create(model);
        this.messages = messages;
    }

    /**
     *
     * @param projectExperienceHeader of{@link ProjectExperienceHeader} is be passed
     *                                to validations to validate the properties
     *                                HandlerOrder Annotation helps to get the
     *                                ReadOnly fields value used in Messages APIs
     *                                validation.
     */
    @HandlerOrder(OrderConstants.Before.FILTER_FIELDS - 1)
    @Before(event = { CqnService.EVENT_UPDATE }, entity = ProjectExperienceHeader_.CDS_NAME)
    public void beforeUpsertProjectExperienceHeader(EventContext context,
            final ProjectExperienceHeader projectExperienceHeader) {
        projectExperienceHeaderValidator.validateProjectExperienceHeaderProperty(projectExperienceHeader);

        /*
         * Audit log implementation for skill,role assignments(draft
         * activationscenario), During draft activation we are considering only the
         * deletion of the active role,skill assignments
         */
        // Get the existing(active) my project experience header
        CqnSelect queryForExistingData = Select.from(ProjectExperienceHeader_.class)
                .columns(b -> b.profile().expand(), b -> b.roles().expand(), b -> b.skills().expand())
                .where(b -> b.ID().eq(projectExperienceHeader.getId()).and(b.IsActiveEntity().eq(Boolean.TRUE)));
        Result existingDataResult = myResourceService.run(queryForExistingData);
        ProjectExperienceHeader existingProjectExperienceHeader = existingDataResult
                .first(ProjectExperienceHeader.class).orElseThrow(notFound(MessageKeys.PROFILE_DOES_NOT_EXISTS));

        /*
         * Compare the existing,current projectExperienceHeader and find the deleted
         * skill,role assignments
         */
        List<Roles> deletedRoles = existingProjectExperienceHeader.getRoles().stream().filter(
                e -> (projectExperienceHeader.getRoles().stream().filter(d -> d.getId().equals(e.getId())).count()) < 1)
                .collect(Collectors.toList());
        List<Skills> deletedSkills = existingProjectExperienceHeader.getSkills().stream()
                .filter(e -> (projectExperienceHeader.getSkills().stream().filter(d -> d.getId().equals(e.getId()))
                        .count()) < 1)
                .collect(Collectors.toList());

        // Sending audit log message for deleted roles
        for (Roles role : deletedRoles) {
            AuditedDataSubject dataSubject = this.getAuditedDataSubject(
                    existingProjectExperienceHeader.getProfile().getDataSubjectRole(),
                    existingProjectExperienceHeader.getProfile().getWorkerExternalID(),
                    existingProjectExperienceHeader.getProfile().getEmailAddress());

            Roles expandedAssignedRoles = this.getExpandedDataOfRoleAssignments(role.getId(), true);
            if (Boolean.FALSE.equals(expandedAssignedRoles.isEmpty())) {
                RoleMasterList expandedAssignedRole;
                if ((expandedAssignedRole = expandedAssignedRoles.getRole()) != null) {
                    HashMap<String, String> deleteEntity = this.prepareRoleEntity(expandedAssignedRole.getName(),
                            expandedAssignedRole.getCode(), expandedAssignedRole.getDescription());
                    auditLogUtil.logDataModificationAuditMessage(context, ROLE_ASSIGNMENT_OBJECT_TYPE,
                            MYRESOURCE_SERVICE_IDENTIFIER, deleteEntity, null, dataSubject,
                            AuditLogUtil.DELETE_OPERATION);
                }
            }
        }
        // Sending audit log message for deleted skills
        for (Skills skill : deletedSkills) {
            AuditedDataSubject dataSubject = this.getAuditedDataSubject(
                    existingProjectExperienceHeader.getProfile().getDataSubjectRole(),
                    existingProjectExperienceHeader.getProfile().getWorkerExternalID(),
                    existingProjectExperienceHeader.getProfile().getEmailAddress());

            Skills expandedAssignedSkills = this.getExpandedDataOfSkillAssignments(skill.getId(), true);
            if (Boolean.FALSE.equals(expandedAssignedSkills.isEmpty()) && expandedAssignedSkills.getSkill() != null) {
                HashMap<String, String> deleteEntity = this.prepareSkillsEntity(expandedAssignedSkills);
                auditLogUtil.logDataModificationAuditMessage(context, SKILL_ASSIGNMENT_OBJECT_TYPE,
                        MYRESOURCE_SERVICE_IDENTIFIER, deleteEntity, null, dataSubject, AuditLogUtil.DELETE_OPERATION);
            }
        }
        messages.throwIfError();
    }

    /**
     * Audit log implementation for skill,role assignments(draft discard scenario)
     **/
    @Before(event = { DraftService.EVENT_DRAFT_CANCEL }, entity = ProjectExperienceHeader_.CDS_NAME)
    public void beforeDraftCancelForMyProjectExperienceHeader(final DraftCancelEventContext context) {
        String projectExperienceHeaderID = (String) analyzer.analyze(context.getCqn().ref()).targetKeys()
                .get(ProjectExperienceHeader.ID);
        // Get the active ProjectExperienceHeader
        CqnSelect queryForExistingData = Select.from(ProjectExperienceHeader_.class)
                .columns(b -> b.profile().expand(), b -> b.roles().expand(), b -> b.skills().expand())
                .where(b -> b.ID().eq(projectExperienceHeaderID).and(b.IsActiveEntity().eq(Boolean.TRUE)));
        Result existingDataResult = myResourceService.run(queryForExistingData);
        Optional<ProjectExperienceHeader> existingProjectExperienceHeaderOptional = existingDataResult
                .first(ProjectExperienceHeader.class);
        ProjectExperienceHeader existingProjectExperienceHeader;
        if (existingProjectExperienceHeaderOptional.isPresent()) {
            existingProjectExperienceHeader = existingProjectExperienceHeaderOptional.get();
        } else {
            return;
        }
        // Get the draft ProjectExperienceHeader
        CqnSelect queryForDraftData = Select.from(ProjectExperienceHeader_.class)
                .columns(b -> b.profile().expand(), b -> b.roles().expand(), b -> b.skills().expand())
                .where(b -> b.ID().eq(projectExperienceHeaderID).and(b.IsActiveEntity().eq(Boolean.FALSE)));
        Result draftDataResult = myResourceService.run(queryForDraftData);
        Optional<ProjectExperienceHeader> draftProjectExperienceHeaderOptional = draftDataResult
                .first(ProjectExperienceHeader.class);
        ProjectExperienceHeader draftProjectExperienceHeader;
        if (draftProjectExperienceHeaderOptional.isPresent()) {
            draftProjectExperienceHeader = draftProjectExperienceHeaderOptional.get();
        } else {
            return;
        }
        List<Roles> draftRoles = new ArrayList<>(draftProjectExperienceHeader.getRoles().size());
        for (Roles draftRole : draftProjectExperienceHeader.getRoles()) {
            if (!isValidGuid(draftRole.getRoleId()))
                continue;
            draftRoles.add(draftRole);
        }
        List<Skills> draftSkills = new ArrayList<>(draftProjectExperienceHeader.getSkills().size());
        for (Skills draftSkill : draftProjectExperienceHeader.getSkills()) {
            if (!isValidGuid(draftSkill.getSkillId()))
                continue;
            draftSkills.add(draftSkill);
        }
        // Get the created,updated assignments while editing the draft
        List<Roles> createdRoles = draftRoles.stream().filter(e -> (existingProjectExperienceHeader.getRoles().stream()
                .filter(d -> d.getId().equals(e.getId())).count()) < 1).collect(Collectors.toList());

        List<Roles> modifiedRoles = draftRoles.stream().filter(e -> (existingProjectExperienceHeader.getRoles().stream()
                .filter(d -> d.getRoleId().equals(e.getRoleId())).count()) < 1).collect(Collectors.toList());

        List<Roles> updatedRoles = modifiedRoles.stream()
                .filter(e -> (createdRoles.stream().filter(d -> d.getId().equals(e.getId())).count()) < 1)
                .collect(Collectors.toList());

        List<Skills> createdSkills = draftSkills.stream().filter(e -> (existingProjectExperienceHeader.getSkills()
                .stream().filter(d -> d.getId().equals(e.getId())).count()) < 1).collect(Collectors.toList());

        List<Skills> modifiedSkills = draftSkills.stream().filter(e -> (existingProjectExperienceHeader.getSkills()
                .stream().filter(d -> d.getSkillId().equals(e.getSkillId())).count()) < 1).collect(Collectors.toList());

        List<Skills> updatedSkills = modifiedSkills.stream()
                .filter(e -> (createdSkills.stream().filter(d -> d.getId().equals(e.getId())).count()) < 1)
                .collect(Collectors.toList());

        AuditedDataSubject dataSubject = this.getAuditedDataSubject(
                existingProjectExperienceHeader.getProfile().getDataSubjectRole(),
                existingProjectExperienceHeader.getProfile().getWorkerExternalID(),
                existingProjectExperienceHeader.getProfile().getEmailAddress());
        // As the draft is discarded, the created assignments will be deleted so logging
        // accordingly
        roleCheck(createdRoles, context, dataSubject);
        skillCheck(createdSkills, context, dataSubject);
        // As the draft is discarded, the updated assignments will be reverted so
        // logging accordingly
        List<Roles> existingRoles = existingProjectExperienceHeader.getRoles();
        List<Skills> existingSkills = existingProjectExperienceHeader.getSkills();
        for (Roles updatedRole : updatedRoles) {
            Roles existingRole = existingRoles.stream().filter(e -> e.getId().equals(updatedRole.getId())).findFirst()
                    .orElseThrow(notFound(MessageKeys.ROLE_DOES_NOT_EXISTS));
            Roles expandUpdatedRole = this.getExpandedDataOfRoleAssignments(updatedRole.getId(), false);
            Roles expandExistingRole = this.getExpandedDataOfRoleAssignments(existingRole.getId(), true);
            HashMap<String, String> originalEntity = this.prepareRoleEntity(expandUpdatedRole.getRole().getName(),
                    expandUpdatedRole.getRole().getCode(), expandUpdatedRole.getRole().getDescription());
            HashMap<String, String> updatedEntity = this.prepareRoleEntity(expandExistingRole.getRole().getName(),
                    expandExistingRole.getRole().getCode(), expandExistingRole.getRole().getDescription());
            auditLogUtil.logDataModificationAuditMessage(context, ROLE_ASSIGNMENT_OBJECT_TYPE,
                    MYRESOURCE_SERVICE_IDENTIFIER, updatedEntity, originalEntity, dataSubject,
                    AuditLogUtil.UPDATE_OPERATION);
        }
        for (Skills updatedSkill : updatedSkills) {
            Skills existingSkill = existingSkills.stream().filter(e -> e.getId().equals(updatedSkill.getId()))
                    .findFirst().orElseThrow(notFound(MessageKeys.SKILL_DOES_NOT_EXISTS));
            Skills expandUpdatedSkill = this.getExpandedDataOfSkillAssignments(updatedSkill.getId(), false);
            Skills expandExistingSkill = this.getExpandedDataOfSkillAssignments(existingSkill.getId(), true);
            HashMap<String, String> originalEntity = this.prepareSkillsEntity(expandUpdatedSkill);
            HashMap<String, String> updatedEntity = this.prepareSkillsEntity(expandExistingSkill);
            auditLogUtil.logDataModificationAuditMessage(context, SKILL_ASSIGNMENT_OBJECT_TYPE,
                    MYRESOURCE_SERVICE_IDENTIFIER, updatedEntity, originalEntity, dataSubject,
                    AuditLogUtil.UPDATE_OPERATION);
        }
    }

    @Before(event = { DraftService.EVENT_DRAFT_PATCH }, entity = Roles_.CDS_NAME)
    public void beforeDraftPatchForRoles(DraftPatchEventContext context, Roles role) {
        if (!this.projectExperienceHeaderRoleValidator.checkInputFieldSize(role))
            messages.throwIfError();

        if (!isValidGuid(role.getRoleId()))
            return;
        boolean isCreateScenario = false;
        // Personal data change log for create,update scenarios of role assignment
        String roleAssignmentID = (String) analyzer.analyze(context.getCqn().ref()).targetKeys().get(Roles.ID);
        /*
         * Check whether role assignment is already present to determine whether the
         * current operation is create/update
         */
        Roles roleBeforeTransaction = this.getExpandedDataOfRoleAssignments(roleAssignmentID, false);
        if (roleBeforeTransaction.getRole() == null)
            isCreateScenario = true;
        CqnSelect queryForProjectRole = Select.from(RoleMasterList_.class).byId(role.getRoleId());
        Result projectRoleResult = myResourceService.run(queryForProjectRole);
        Optional<RoleMasterList> optionalRoleMasterList = projectRoleResult.first(RoleMasterList.class);
        RoleMasterList projectRole;
        if (!optionalRoleMasterList.isPresent()) {
            this.projectExperienceHeaderRoleValidator.prepareErrorMessage(role, MessageKeys.ROLE_DOES_NOT_EXISTS);
            messages.throwIfError();
        } else {
            projectRole = optionalRoleMasterList.get();
            AuditedDataSubject dataSubject = this.getAuditedDataSubject(
                    roleBeforeTransaction.getProfile().getDataSubjectRole(),
                    roleBeforeTransaction.getProfile().getWorkerExternalID(),
                    roleBeforeTransaction.getProfile().getEmailAddress());
            if (isCreateScenario) {
                HashMap<String, String> createEntity = this.prepareRoleEntity(projectRole.getName(),
                        projectRole.getCode(), projectRole.getDescription());
                auditLogUtil.logDataModificationAuditMessage(context, ROLE_ASSIGNMENT_OBJECT_TYPE,
                        MYRESOURCE_SERVICE_IDENTIFIER, createEntity, null, dataSubject, AuditLogUtil.CREATE_OPERATION);
            } else {
                HashMap<String, String> originalEntity = this.prepareRoleEntity(
                        roleBeforeTransaction.getRole().getName(), roleBeforeTransaction.getRole().getCode(),
                        roleBeforeTransaction.getRole().getDescription());
                HashMap<String, String> updatedEntity = this.prepareRoleEntity(projectRole.getName(),
                        projectRole.getCode(), projectRole.getDescription());
                auditLogUtil.logDataModificationAuditMessage(context, ROLE_ASSIGNMENT_OBJECT_TYPE,
                        MYRESOURCE_SERVICE_IDENTIFIER, updatedEntity, originalEntity, dataSubject,
                        AuditLogUtil.UPDATE_OPERATION);
            }
        }
    }

    @Before(event = { DraftService.EVENT_DRAFT_CANCEL }, entity = Roles_.CDS_NAME)
    public void beforeDraftCancelForRoles(final DraftCancelEventContext context) {
        /*
         * Check whether role assignment is already present in active state to determine
         * whether the current operation is for active/draft assignment
         */
        String roleAssignmentID = (String) analyzer.analyze(context.getCqn().ref()).targetKeys().get(Roles.ID);
        CqnSelect queryForActiveData = Select.from(Roles_.class)
                .columns(Roles_::role_ID, Roles_::employee_ID, b -> b.profile().expand(), b -> b.role().expand())
                .where(b -> b.ID().eq(roleAssignmentID).and(b.IsActiveEntity().eq(Boolean.TRUE)));
        Result result = myResourceService.run(queryForActiveData);
        // if the row count is 0 the current operation is for active assignment, will be
        // handled while activating the myProjectExperience header
        if (result.rowCount() != 0)
            return;
        Roles expandedRole = this.getExpandedDataOfRoleAssignments(roleAssignmentID, false);
        if (expandedRole.getRoleId() == null || expandedRole.getRole() == null)
            return;
        AuditedDataSubject dataSubject = this.getAuditedDataSubject(expandedRole.getProfile().getDataSubjectRole(),
                expandedRole.getProfile().getWorkerExternalID(), expandedRole.getProfile().getEmailAddress());
        HashMap<String, String> deleteEntity = this.prepareRoleEntity(expandedRole.getRole().getName(),
                expandedRole.getRole().getCode(), expandedRole.getRole().getDescription());
        auditLogUtil.logDataModificationAuditMessage(context, ROLE_ASSIGNMENT_OBJECT_TYPE,
                MYRESOURCE_SERVICE_IDENTIFIER, deleteEntity, null, dataSubject, AuditLogUtil.DELETE_OPERATION);
    }

    @After(event = { DraftService.EVENT_DRAFT_NEW }, entity = Skills_.CDS_NAME)
    public void afterSkillDraftNew(Skills skill) {
        skill.setProficiencyLevelEditMode(FIELD_CONTROL_READONLY);
    }

    @After(event = { CqnService.EVENT_READ }, entity = Skills_.CDS_NAME)
    public void afterSkillRead(List<Skills> skill) {
        skill.forEach(sk -> {
            if (sk.getSkillId() != null && !sk.getSkillId().isEmpty()) {
                sk.setProficiencyLevelEditMode(FIELD_CONTROL_EDITABLE);
            } else {
                sk.setProficiencyLevelEditMode(FIELD_CONTROL_READONLY);
            }
        });
    }

    @After(event = { CqnService.EVENT_READ }, entity = Attachment_.CDS_NAME)
    public void afterAttachmentDownload(final Attachment profile)
        throws ServiceException {
        if(profile.getContent() != null &&  StringUtils.hasLength(profile.getFileName())) {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            myProjectExperienceServiceEventHandler.performSizeCheckAndThrowError(profile.getContent(), byteArrayOutputStream, RESUME, FILE_MAX_SIZE);
            ByteArrayOutputStream decompressedOutput = FileUtils.decompressUsingGzip(new ByteArrayInputStream(byteArrayOutputStream.toByteArray()));
            if(decompressedOutput!= null) {
                profile.setContent(new ByteArrayInputStream(decompressedOutput.toByteArray()));
            }
        }
    }

    /**
     * Write Audit Log messages when Skill and/or Proficiency Level of a Skill
     * Assignment changed
     *
     * @param context         CAP Event Context
     * @param skillAssignment The changed Skill Assignment
     */
    @Before(event = { DraftService.EVENT_DRAFT_PATCH }, entity = Skills_.CDS_NAME)
    @HandlerOrder(HandlerOrder.LATE)
    public void beforeDraftPatchForSkills(DraftPatchEventContext context, final Skills skillAssignment) {
        String skillAssignmentID = (String) analyzer.analyze(context.getCqn().ref()).targetKeys().get(Skills.ID);
        Skills oldAssignment = this.getExpandedDataOfSkillAssignments(skillAssignmentID, false);
        boolean createScenario = oldAssignment.getSkill() == null;

        Optional<SkillMasterListAll> skill;
        if (!NullUtils.isNullOrEmpty(skillAssignment.getSkillId()) && isValidGuid(skillAssignment.getSkillId())) {
            CqnSelect queryForSkill = Select.from(SkillMasterListAll_.class).byId(skillAssignment.getSkillId());
            skill = myResourceService.run(queryForSkill).first(SkillMasterListAll.class);

            // Reject changes of Skill Assignments if the Skill does not exist
            if (!skill.isPresent()) {
                this.projectExperienceHeaderSKillValidator.prepareErrorMessageSkill(skillAssignment,
                        MessageKeys.SKILL_DOES_NOT_EXISTS);
                messages.throwIfError();
            }
        } else {
            skill = Optional.empty();
        }
        Optional<ProficiencyLevels> proficiencyLevel;
        if (!NullUtils.isNullOrEmpty(skillAssignment.getProficiencyLevelId())
                && isValidGuid(skillAssignment.getProficiencyLevelId())) {
            CqnSelect queryForProficiencyLevel = Select.from(ProficiencyLevels_.class)
                    .byId(skillAssignment.getProficiencyLevelId());
            proficiencyLevel = myResourceService.run(queryForProficiencyLevel).first(ProficiencyLevels.class);
        } else {
            proficiencyLevel = Optional.empty();
        }

        if (!skill.isPresent() && !proficiencyLevel.isPresent()) {
            return; // no relevant data changes
        }

        AuditedDataSubject dataSubject = this.getAuditedDataSubject(oldAssignment.getProfile().getDataSubjectRole(),
                oldAssignment.getProfile().getWorkerExternalID(), oldAssignment.getProfile().getEmailAddress());

        HashMap<String, String> newEntity = prepareSkillsEntity(skill, proficiencyLevel);
        if (createScenario) {
            auditLogUtil.logDataModificationAuditMessage(context, SKILL_ASSIGNMENT_OBJECT_TYPE,
                    MYRESOURCE_SERVICE_IDENTIFIER, newEntity, null, dataSubject, AuditLogUtil.CREATE_OPERATION);
        } else {
            // use old skill and proficiency only if a new skill/proficiency were set
            Optional<SkillMasterListAll> oldSkill = skill.flatMap(s -> Optional.ofNullable(oldAssignment.getSkill()));
            Optional<ProficiencyLevels> oldProficiency = proficiencyLevel
                    .flatMap(p -> Optional.ofNullable(oldAssignment.getProficiencyLevel()));
            HashMap<String, String> oldEntity = prepareSkillsEntity(oldSkill, oldProficiency);

            auditLogUtil.logDataModificationAuditMessage(context, SKILL_ASSIGNMENT_OBJECT_TYPE,
                    MYRESOURCE_SERVICE_IDENTIFIER, newEntity, oldEntity, dataSubject, AuditLogUtil.UPDATE_OPERATION);
        }
    }

    /**
     * Reject changes of Skill Assignments if the Skill ID is too long for a UUID
     *
     * @param skillAssignment The changed Skill Assignment
     */
    @Before(event = { DraftService.EVENT_DRAFT_PATCH }, entity = Skills_.CDS_NAME)
    public void rejectTooLongSkillIds(final Skills skillAssignment) {
        if (skillAssignment.containsKey(Skills.SKILL_ID)
                && !this.projectExperienceHeaderSKillValidator.checkInputFieldSize(skillAssignment)) {
            messages.throwIfError();
        }
    }

    @Before(event = { DraftService.EVENT_DRAFT_CANCEL }, entity = Skills_.CDS_NAME)
    public void beforeDraftCancelForSkills(final DraftCancelEventContext context) {
        String skillAssignmentID = (String) analyzer.analyze(context.getCqn().ref()).targetKeys().get(Skills.ID);
        CqnSelect queryForActiveData = Select.from(Skills_.class)
                .columns(Skills_::skill_ID, Skills_::employee_ID, b -> b.profile().expand(), b -> b.skill().expand())
                .where(b -> b.ID().eq(skillAssignmentID).and(b.IsActiveEntity().eq(Boolean.TRUE)));
        Result result = myResourceService.run(queryForActiveData);
        if (result.rowCount() != 0)
            return;
        Skills expandedSkill = this.getExpandedDataOfSkillAssignments(skillAssignmentID, false);
        if (expandedSkill.getSkillId() == null || expandedSkill.getSkill() == null)
            return;
        AuditedDataSubject dataSubject = this.getAuditedDataSubject(expandedSkill.getProfile().getDataSubjectRole(),
                expandedSkill.getProfile().getWorkerExternalID(), expandedSkill.getProfile().getEmailAddress());
        HashMap<String, String> deleteEntity = this.prepareSkillsEntity(expandedSkill);
        auditLogUtil.logDataModificationAuditMessage(context, SKILL_ASSIGNMENT_OBJECT_TYPE,
                MYRESOURCE_SERVICE_IDENTIFIER, deleteEntity, null, dataSubject, AuditLogUtil.DELETE_OPERATION);
    }

    @After(event = { CqnService.EVENT_READ }, entity = ExternalWorkExperienceSkills_.CDS_NAME)
    public void afterExternalWorkExperienceSkillRead(List<ExternalWorkExperienceSkills> externalWorkExperienceSkills) {
        externalWorkExperienceSkills.forEach(esk -> {
            if (esk.getSkillId() != null && !esk.getSkillId().isEmpty()) {
                esk.setProficiencyLevelEditMode(FIELD_CONTROL_EDITABLE);
            } else {
                esk.setProficiencyLevelEditMode(FIELD_CONTROL_READONLY);
            }
        });
    }

    /**
     * This event handler populates the value of employee ID in the
     * ExternalWorkExperienceSkills object prior to it's insertion.
     *
     * @param externalWorkExperienceSkills The newly to be created
     *                                     ExternalWorkExperienceSkills object
     * @param context                      DraftNewEventContext
     */
    @Before(event = { DraftService.EVENT_DRAFT_NEW }, entity = ExternalWorkExperienceSkills_.CDS_NAME)
    public void populateExternalWorkExperienceSkillWithParentIDData(
            final ExternalWorkExperienceSkills externalWorkExperienceSkills, DraftNewEventContext context) {
        String id = cqnUtil.getRootKey(context, context.getCqn(), "ID");
        externalWorkExperienceSkills.setEmployeeId(id);
    }

    @Before(event = { DraftService.EVENT_DRAFT_PATCH }, entity = Skills_.CDS_NAME)
    @HandlerOrder(HandlerOrder.EARLY)
    public void populateDefaultProficiencyLevels(Skills skillAssignment) {
        if (skillAssignment.containsKey(Skills.SKILL_ID) && !skillAssignment.containsKey(Skills.PROFICIENCY_LEVEL_ID)) {
            skillAssignment.setProficiencyLevelId(null);
        }
    }

    @Before(event = { DraftService.EVENT_DRAFT_PATCH }, entity = ExternalWorkExperienceSkills_.CDS_NAME)
    @HandlerOrder(HandlerOrder.EARLY)
    public void populateDefaultProficiencyLevels(ExternalWorkExperienceSkills skillAssignment) {
        if (skillAssignment.containsKey(ExternalWorkExperienceSkills.SKILL_ID)
                && !skillAssignment.containsKey(ExternalWorkExperienceSkills.PROFICIENCY_LEVEL_ID)) {
            skillAssignment.setProficiencyLevelId(null);
        }
    }

    @After(event = CqnService.EVENT_READ, entity = PeriodicAvailability_.CDS_NAME)
    public void readPeriodicAvailabilityMonthlyData(final CdsReadEventContext cdsReadEventContext) {
        this.commonEventHandlerUtil.setLocalisedDataForPeriodicAvailability(cdsReadEventContext,
                PeriodicAvailability.MONTH_YEAR, PeriodicAvailability.CALMONTH);
    }

    @After(event = { DraftService.EVENT_DRAFT_NEW }, entity = ExternalWorkExperienceSkills_.CDS_NAME)
    public void afterExternalWorkExperienceSkillsDraftNew(ExternalWorkExperienceSkills externalWorkExperienceSkills) {
        externalWorkExperienceSkills.setProficiencyLevelEditMode(FIELD_CONTROL_READONLY);
    }

    /**
     * This event handler replaces the {0} in localised data of monthsOfTheYear with
     * year and populates the manipulated data in the PeriodicUtilization
     */
    @After(event = { CqnService.EVENT_READ }, entity = PeriodicUtilization_.CDS_NAME)
    public void readPeriodicUtilizationData(CdsReadEventContext cdsReadEventContext) {
        this.commonEventHandlerUtil.setLocalisedDataForPeriodicUtilization(cdsReadEventContext,
                PeriodicUtilization.MONTH_YEAR, PeriodicUtilization.CALMONTH);
    }

    @After(event = CqnService.EVENT_READ, entity = InternalWorkExperience_.CDS_NAME)
    public void afterReadInternalWorkExperience(final CdsReadEventContext cdsReadEventContext) {
        this.commonEventHandlerUtil.setLocalInternalWEConvertedAssigned(cdsReadEventContext,
                InternalWorkExperience.CONVERTED_ASSIGNED_CAPACITY);
    }

    /**
     * This event handler read the skill assignments and prepares concatenated
     * string with comma delimiter
     */
    @After(event = CqnService.EVENT_READ, entity = ProjectExperienceHeader_.CDS_NAME)
    public void afterReadSetCommaSeparatedSkills(final CdsReadEventContext context,
            final List<ProjectExperienceHeader> projectExperienceHeaders) {
    	Map<String, List<Skills>> emptySkillAssignments = new HashMap<>();
    	projectExperienceHeaders.forEach(projectExperienceHeader -> {
    		if(projectExperienceHeader.getId()!=null) {
    			emptySkillAssignments.put(projectExperienceHeader.getId(), new ArrayList<Skills>());
    		}
    	});
    	Map<String, List<Skills>> allSkillAssignments = getExpandedDataOfSkillAssignmentsForMultipleEmployees(emptySkillAssignments);
        projectExperienceHeaders.forEach(projectExperienceHeader -> projectExperienceHeader.setCommaSeparatedSkills(
                computeCommaSeparatedSkills(allSkillAssignments.get(projectExperienceHeader.getId()))));
    }

    /**
     * This event handler read the skill catalogs maintained in master data and
     * expand the catalog association
     */
    @Before(event = CqnService.EVENT_READ, entity = SkillMasterList_.CDS_NAME)
    public void beforeReadExpandCatalogs(CdsReadEventContext context) {
        if (shouldComputeCommaSeparated(context.getCqn())) {
            context.setCqn(ensureCatalogExpansion(context.getCqn()));
        }
    }

    /**
     * This event handler read the skill catalogs maintained in master data and
     * prepare combined the catalogs name to populates the value in value help table
     */
    @After(event = CqnService.EVENT_READ, entity = SkillMasterList_.CDS_NAME)
    public void afterReadSetCommaSeparatedSkillCatalogs(final CdsReadEventContext context,
            final List<SkillMasterList> skills) {
        if (shouldComputeCommaSeparated(context.getCqn())) {
            skills.forEach(skill -> {
                skill.setCommaSeparatedCatalogs(computeCommaSeparatedSkillCatalogs(skill.getCatalogAssociations()));
                // CAP tries to serialize the added expansion as "Non-nullable property not
                // present". Hence, we have to remove it
                removeInvalidAssociation(skill);
            });
        }
    }

    @After(event = { CqnService.EVENT_READ }, entity = PeriodicAvailability_.CDS_NAME)
    public void populateUtilizationColorPeriodicAvailability(List<PeriodicAvailability> periodicAvailability) {
        periodicAvailability.forEach(resourceData -> resourceData.setUtilizationColor(
                this.commonEventHandlerUtil.getUtilizationColor(resourceData.getUtilizationPercentage())));
    }

    @After(event = { CqnService.EVENT_READ }, entity = Utilization_.CDS_NAME)
    public void populateUtilizationColorUtilization(List<Utilization> utilization) {
        utilization.forEach(resourceData -> resourceData.setUtilizationColor(
                this.commonEventHandlerUtil.getUtilizationColor(resourceData.getYearlyUtilization())));
    }

    protected String computeCommaSeparatedSkillCatalogs(List<Catalogs2SkillsConsumption> catalogAssociations) {
        if (catalogAssociations == null) {
            return "";
        }
        return catalogAssociations.stream()
                .filter(c2s -> c2s.getCatalog() != null && c2s.getCatalog().getName() != null
                        && !c2s.getCatalog().getName().isEmpty())
                .sorted(Comparator.comparing(c2s -> c2s.getCatalog().getName())).map(c2s -> c2s.getCatalog().getName())
                .collect(Collectors.joining(", "));
    }

    // Serialization fails if non-nullable properties are null
    protected void removeInvalidAssociation(SkillMasterList skill) {
        if (skill.getCatalogAssociations().stream().anyMatch(c2s -> c2s.getId() == null)) {
            skill.remove(SkillMasterList.CATALOG_ASSOCIATIONS);
        }
    }

    protected String computeCommaSeparatedSkills(List<Skills> skills) {
        if (skills == null) {
            return "";
        }
        return skills.stream()
                .filter(s -> s.getSkill() != null && s.getSkill().getName() != null
                        && !s.getSkill().getName().isEmpty())
                .sorted(Comparator.comparing(s -> s.getSkill().getName())).map(s -> s.getSkill().getName())
                .collect(Collectors.joining(", "));
    }    
    
    protected Map<String, List<Skills>> getExpandedDataOfSkillAssignmentsForMultipleEmployees(Map<String, List<Skills>> skillAssignmentsMap) {
    	if(!skillAssignmentsMap.isEmpty()) {
        	List<String> allEmployeeIds = new ArrayList<>(skillAssignmentsMap.keySet());
	        CqnSelect cqnQuery = Select.from(Skills_.class)
	                .columns(Skills_::skill_ID, Skills_::proficiencyLevel_ID, Skills_::employee_ID, b -> b.skill().expand())
	                .where(b -> b.employee_ID().in(allEmployeeIds));
	        Result result = myResourceService.run(cqnQuery);
	        List<Skills> allSkillAssignments = result.listOf(Skills.class);
	        if(allSkillAssignments!=null) {
	        	allSkillAssignments.forEach(skillAssignment -> skillAssignmentsMap.compute(skillAssignment.getEmployeeId(), (key, value) -> { 
		        	value.add(skillAssignment);
		        	return value;
		        }));
	        }
    	}
        return skillAssignmentsMap;
        
    }
    


     /**
     * This event handler read the project roles and prepares concatenated
     * string with comma delimiter
     */
    @After(event = CqnService.EVENT_READ, entity = ProjectExperienceHeader_.CDS_NAME)
    public void afterReadSetCommaSeparatedRoles(final CdsReadEventContext context,
            final List<ProjectExperienceHeader> projectExperienceHeaders) {
    	Map<String, List<Roles>> emptyRoleAssignments = new HashMap<>();
    	projectExperienceHeaders.forEach(projectExperienceHeader -> {
    		if(projectExperienceHeader.getId()!=null) {
    			emptyRoleAssignments.put(projectExperienceHeader.getId(), new ArrayList<Roles>());
    		}
    	});
    	Map<String, List<Roles>> allRoleAssignments = getExpandedDataOfRoleAssignmentsForMultipleEmployees(emptyRoleAssignments);
        projectExperienceHeaders.forEach(projectExperienceHeader -> projectExperienceHeader.setCommaSeparatedRoles(
                computeCommaSeparatedRoles(allRoleAssignments.get(projectExperienceHeader.getId()))));
    }
    
    protected Map<String, List<Roles>> getExpandedDataOfRoleAssignmentsForMultipleEmployees(Map<String, List<Roles>> roleAssignmentsMap) {
    	if(!roleAssignmentsMap.isEmpty()) {
        	List<String> allEmployeeIds = new ArrayList<>(roleAssignmentsMap.keySet());
	        CqnSelect cqnQuery = Select.from(Roles_.class)
	                .columns(Roles_::role_ID,  Roles_::employee_ID, b -> b.role().expand())
	                .where(b -> b.employee_ID().in(allEmployeeIds));
	        Result result = myResourceService.run(cqnQuery);
	        List<Roles> allRoleAssignments = result.listOf(Roles.class);
	        if(allRoleAssignments!=null) {
	        	 allRoleAssignments.forEach(roleAssignment -> roleAssignmentsMap.compute(roleAssignment.getEmployeeId(), (key, value) -> { 
	 	        	value.add(roleAssignment);
	 	        	return value;
	 	        }));
	        }
    	}
        return roleAssignmentsMap;
        
    }
    
    protected String computeCommaSeparatedRoles(List<Roles> roles) {
        if (roles == null) {
            return "";
        }
        return roles.stream()
                .filter(s -> s.getRole() != null && s.getRole().getName() != null
                        && !s.getRole().getName().isEmpty())
                .sorted(Comparator.comparing(s -> s.getRole().getName())).map(s -> s.getRole().getName())
                .collect(Collectors.joining(", "));
    }

    protected AuditedDataSubject getAuditedDataSubject(String roleName, String id, String email) {
        AuditedDataSubject dataSubject = auditLogFactory.createAuditedDataSubject();
        dataSubject.setRole(roleName);
        dataSubject.addIdentifier("ID", id);
        dataSubject.addIdentifier("Email", email);
        dataSubject.setType(DATA_SUBJECT_TYPE);
        return dataSubject;
    }

    protected Roles getExpandedDataOfRoleAssignments(String roleAssignmentId, boolean isActiveData) {
        CqnSelect cqnQuery = Select.from(Roles_.class)
                .columns(Roles_::role_ID, Roles_::employee_ID, b -> b.profile().expand(), b -> b.role().expand())
                .where(b -> b.ID().eq(roleAssignmentId).and(b.IsActiveEntity().eq(isActiveData)));
        Result result = myResourceService.run(cqnQuery);
        return result.first(Roles.class).orElseThrow(notFound(MessageKeys.ROLE_DOES_NOT_EXISTS));
    }

    protected Skills getExpandedDataOfSkillAssignments(String skillAssignmentId, boolean isActiveData) {
        CqnSelect cqnQuery = Select.from(Skills_.class)
                .columns(Skills_::skill_ID, Skills_::proficiencyLevel_ID, Skills_::employee_ID,
                        b -> b.profile().expand(), b -> b.skill().expand(), b -> b.proficiencyLevel().expand())
                .where(b -> b.ID().eq(skillAssignmentId).and(b.IsActiveEntity().eq(isActiveData)));
        Result result = myResourceService.run(cqnQuery);
        return result.first(Skills.class).orElseThrow(notFound(MessageKeys.SKILL_DOES_NOT_EXISTS));
    }

    protected HashMap<String, String> prepareSkillsEntity(Skills skillAssignment) {
        Optional<SkillMasterListAll> skill = Optional.ofNullable(skillAssignment.getSkill());
        Optional<ProficiencyLevels> level = Optional.ofNullable(skillAssignment.getProficiencyLevel());
        return prepareSkillsEntity(skill, level);
    }

    protected HashMap<String, String> prepareSkillsEntity(Optional<SkillMasterListAll> skill,
            Optional<ProficiencyLevels> proficiencyLevel) {
        HashMap<String, String> entityMap = new HashMap<>();
        skill.ifPresent(s -> {
            entityMap.put("name", s.getName());
            entityMap.put("description", s.getDescription());
        });
        proficiencyLevel.ifPresent(l -> {
            entityMap.put("proficiencyLevelName", l.getName());
            entityMap.put("proficiencyLevelDescription", l.getDescription());
            entityMap.put("proficiencyLevel", l.getRank().toString());
        });
        return entityMap;
    }

    protected HashMap<String, String> prepareRoleEntity(String name, String code, String description) {
        HashMap<String, String> entity = new HashMap<>();
        entity.put("name", name);
        entity.put("code", code);
        entity.put("description", description);
        return entity;
    }

    protected boolean isValidGuid(String uuid) {
        if (uuid == null)
            return false;
        String regex = "^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}}?$";
        Pattern p = Pattern.compile(regex);
        Matcher m = p.matcher(uuid);
        return m.matches();
    }

    protected void roleCheck(List<Roles> createdRoles, DraftCancelEventContext context,
            AuditedDataSubject dataSubject) {
        for (Roles role : createdRoles) {
            if (role.getRoleId() == null)
                continue;
            Roles expandedAssignedRoles = this.getExpandedDataOfRoleAssignments(role.getId(), false);
            if (Boolean.FALSE.equals(expandedAssignedRoles.isEmpty())) {
                RoleMasterList expandedAssignedRole;
                if ((expandedAssignedRole = expandedAssignedRoles.getRole()) != null) {
                    HashMap<String, String> deleteEntity = this.prepareRoleEntity(expandedAssignedRole.getName(),
                            expandedAssignedRole.getCode(), expandedAssignedRole.getDescription());
                    auditLogUtil.logDataModificationAuditMessage(context, ROLE_ASSIGNMENT_OBJECT_TYPE,
                            MYRESOURCE_SERVICE_IDENTIFIER, deleteEntity, null, dataSubject,
                            AuditLogUtil.DELETE_OPERATION);
                }
            }
        }
    }

    protected void skillCheck(List<Skills> createdSkills, DraftCancelEventContext context,
            AuditedDataSubject dataSubject) {
        for (Skills skill : createdSkills) {
            if (skill.getSkillId() == null)
                continue;
            Skills expandedAssignedSkills = this.getExpandedDataOfSkillAssignments(skill.getId(), false);
            if (Boolean.FALSE.equals(expandedAssignedSkills.isEmpty()) && expandedAssignedSkills.getSkill() != null) {
                HashMap<String, String> deleteEntity = this.prepareSkillsEntity(expandedAssignedSkills);
                auditLogUtil.logDataModificationAuditMessage(context, SKILL_ASSIGNMENT_OBJECT_TYPE,
                        MYRESOURCE_SERVICE_IDENTIFIER, deleteEntity, null, dataSubject, AuditLogUtil.DELETE_OPERATION);
            }
        }
    }

    protected boolean shouldComputeCommaSeparated(CqnSelect cqn) {
        return cqn.items().stream().filter(CqnSelectListItem::isValue)
                .anyMatch(item -> item.asValue().displayName().equals(SkillMasterList.COMMA_SEPARATED_CATALOGS));
    }

    protected CqnSelect ensureCatalogExpansion(CqnSelect cqn) {
        return CQL.copy(cqn, new Modifier() {
            @Override
            public List<CqnSelectListItem> items(List<CqnSelectListItem> columns) {
                columns.add(CQL.to(SkillMasterList.CATALOG_ASSOCIATIONS)
                        .expand(a -> a.to(Catalogs2SkillsConsumption.CATALOG).expand(CatalogsConsumption.NAME)));
                return columns;
            }
        });
    }

    private Supplier<ServiceException> notFound(String message) {
        return () -> new ServiceException(HttpStatus.NOT_FOUND, message);
    }
}
