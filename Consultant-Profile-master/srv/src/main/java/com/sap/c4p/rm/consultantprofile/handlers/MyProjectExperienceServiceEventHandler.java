package com.sap.c4p.rm.consultantprofile.handlers;

import com.sap.c4p.rm.consultantprofile.auditlog.AuditLogUtil;
import com.sap.c4p.rm.consultantprofile.cloudfoundry.service.malwarescan.MalwareScanResponse;
import com.sap.c4p.rm.consultantprofile.cloudfoundry.service.malwarescan.MalwareScanService;
import com.sap.c4p.rm.consultantprofile.config.LoggingMarker;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.myprojectexperienceservice.validations.MyProjectExperienceHeaderRoleValidator;
import com.sap.c4p.rm.consultantprofile.myprojectexperienceservice.validations.MyProjectExperienceHeaderSkillValidator;
import com.sap.c4p.rm.consultantprofile.myprojectexperienceservice.validations.MyProjectExperienceHeaderValidator;

import com.sap.c4p.rm.consultantprofile.utils.CommonEventHandlerUtil;
import com.sap.c4p.rm.consultantprofile.utils.Constants;
import com.sap.c4p.rm.consultantprofile.utils.CqnUtil;
import com.sap.c4p.rm.consultantprofile.utils.FileUtils;
import com.sap.c4p.rm.consultantprofile.utils.HttpStatus;
import com.sap.c4p.rm.consultantprofile.utils.ImageUtils;
import com.sap.c4p.rm.consultantprofile.utils.NullUtils;
import com.sap.cds.Result;
import com.sap.cds.ql.CQL;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnSelectListItem;
import com.sap.cds.ql.cqn.Modifier;
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
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.utils.OrderConstants;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedDataSubject;
import myprojectexperienceservice.Attachment;
import myprojectexperienceservice.Attachment_;
import myprojectexperienceservice.Catalogs2SkillsConsumption;
import myprojectexperienceservice.CatalogsConsumption;
import myprojectexperienceservice.ExternalWorkExperienceSkills;
import myprojectexperienceservice.ExternalWorkExperienceSkills_;
import myprojectexperienceservice.InternalWorkExperience;
import myprojectexperienceservice.InternalWorkExperience_;
import myprojectexperienceservice.MyProjectExperienceHeader;
import myprojectexperienceservice.MyProjectExperienceHeader_;
import myprojectexperienceservice.MyProjectExperienceService_;
import myprojectexperienceservice.PeriodicAvailability;
import myprojectexperienceservice.PeriodicAvailability_;
import myprojectexperienceservice.PeriodicUtilization;
import myprojectexperienceservice.PeriodicUtilization_;
import myprojectexperienceservice.ProficiencyLevels;
import myprojectexperienceservice.ProficiencyLevels_;
import myprojectexperienceservice.ProfilePhoto;
import myprojectexperienceservice.ProfilePhoto_;
import myprojectexperienceservice.RoleMasterList;
import myprojectexperienceservice.RoleMasterList_;
import myprojectexperienceservice.Roles;
import myprojectexperienceservice.Roles_;
import myprojectexperienceservice.SkillMasterList;
import myprojectexperienceservice.SkillMasterListAll;
import myprojectexperienceservice.SkillMasterListAll_;
import myprojectexperienceservice.SkillMasterList_;
import myprojectexperienceservice.Skills;
import myprojectexperienceservice.Skills_;
import myprojectexperienceservice.Utilization;
import myprojectexperienceservice.Utilization_;
import org.apache.commons.io.IOUtils;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.tika.Tika;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.MimeType;
import org.springframework.util.MimeTypeUtils;
import org.springframework.util.StringUtils;

import jakarta.annotation.Resource;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * EventHandler Implemented Class to define event handlers for CDS events of the
 * service "MyProjectExperienceService"
 */
@Component
@ServiceName(MyProjectExperienceService_.CDS_NAME)
public class MyProjectExperienceServiceEventHandler implements EventHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(MyProjectExperienceServiceEventHandler.class);
    private static final Marker MARKER = LoggingMarker.MY_PROJ_EXP_MARKER.getMarker();

    private static final String ROLE_ASSIGNMENT_OBJECT_TYPE = "Roles";
    private static final String SKILL_ASSIGNMENT_OBJECT_TYPE = "Skills";
    private static final String PROFILE_PHOTO_ASSIGNMENT_OBJECT_TYPE = "ProfilePhoto";
    private static final String PROJECT_EXPERIENCE_SERVICE_IDENTIFIER = "MyProjectExperience";
    private static final String DATA_SUBJECT_TYPE = "WorkForcePerson";
    private static final int FIELD_CONTROL_READONLY = 1;
    private static final int FIELD_CONTROL_EDITABLE = 7;
    private static final int FILE_MAX_SIZE = 2097152;
    private static final String RESUME = "Resume";
    private static final String FILENAME = "Filename";
    protected static final Integer DEFAULT_MALWARE_SERVICE_TIMEOUT = 1000; // In Milliseconds
    protected static final Integer CV_UPLOAD_MALWARE_SERVICE_TIMEOUT = 2000; // In Milliseconds

    /**
     * instance to execute myProjectExperienceHeader-related validations
     */
    private final MyProjectExperienceHeaderValidator myProjectExperienceHeaderValidator;
    private final MyProjectExperienceHeaderSkillValidator myProjectExperienceHeaderSkillValidator;
    private final MyProjectExperienceHeaderRoleValidator myProjectExperienceHeaderRoleValidator;
    private final CommonEventHandlerUtil commonEventHandlerUtil;
    private final CqnUtil cqnUtil;
    protected CqnAnalyzer analyzer;
    private final Messages messages;

    @Autowired
    protected AuditLogUtil auditLogUtil;
    @Autowired
    protected AuditLogMessageFactory auditLogFactory;
    @Resource(name = MyProjectExperienceService_.CDS_NAME)
    protected DraftService myProjectExperienceService;

    @Autowired
    protected PersistenceService persistenceService;
    @Autowired
    protected MalwareScanService malwareScanService;

    /**
     * initialize {@link MyProjectExperienceServiceEventHandler} instance and accept
     * the instance of {@link MyProjectExperienceHeaderValidator} to be used
     *
     * @param myProjectExperienceHeaderValidator {@link MyProjectExperienceHeaderValidator}
     *                                           to be used to validate
     *                                           {@link MyProjectExperienceHeader}
     *                                           properties.
     *
     */
    @Autowired
    public MyProjectExperienceServiceEventHandler(
        final MyProjectExperienceHeaderValidator myProjectExperienceHeaderValidator,
        final MyProjectExperienceHeaderSkillValidator myProjectExperienceHeaderSkillValidator,
        final MyProjectExperienceHeaderRoleValidator myProjectExperienceHeaderRoleValidator,
        final CommonEventHandlerUtil commonEventHandlerUtil, final CqnUtil cqnUtil, final CdsModel model,
        final Messages messages) {
        this.myProjectExperienceHeaderValidator = myProjectExperienceHeaderValidator;
        this.myProjectExperienceHeaderSkillValidator = myProjectExperienceHeaderSkillValidator;
        this.myProjectExperienceHeaderRoleValidator = myProjectExperienceHeaderRoleValidator;
        this.commonEventHandlerUtil = commonEventHandlerUtil;
        this.cqnUtil = cqnUtil;
        this.analyzer = CqnAnalyzer.create(model);
        this.messages = messages;
    }

    @On(event = { DraftService.EVENT_DRAFT_PATCH }, entity = ProfilePhoto_.CDS_NAME)
    public void profilePhotoValidationOnHandler(DraftPatchEventContext context, final ProfilePhoto photo)
            throws ServiceException {
        InputStream image = photo.getProfileImage();

        if (image == null && photo.getFileName() == null) {
            LOGGER.debug("Setting the thumbnail to null when the image is being set to null");
            photo.setProfileThumbnail(null);
            photo.setFileName(null);
        }

        if (image != null) {
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            if (performSizeCheckAndThrowError(image, output, PROFILE_PHOTO_ASSIGNMENT_OBJECT_TYPE, FILE_MAX_SIZE) == Boolean.FALSE) {
                return;
            }
            List<MimeType> mimeTypes = Arrays.asList(MimeTypeUtils.IMAGE_JPEG, MimeTypeUtils.IMAGE_PNG);
            String mimeType = performMimeTypeCheck(output, mimeTypes, PROFILE_PHOTO_ASSIGNMENT_OBJECT_TYPE);
            if (mimeType == null) {
                return;
            }
            MalwareScanResponse response = malwareScanService.scanMalware(output.toByteArray(), DEFAULT_MALWARE_SERVICE_TIMEOUT, messages, PROFILE_PHOTO_ASSIGNMENT_OBJECT_TYPE);
            if (response == null) {
                LOGGER.warn("Malware scanning service sent null response");
                return;
            } else if (response.getMalwareDetected()) {
                LOGGER.warn("Malware scanning service detected malware in uploaded image file");
                auditLogUtil.logSecurityEvent(MessageKeys.AUDIT_LOG_MALWARE_DETECTED);
                messages.error(MessageKeys.MALWARE_DETECTED_ERROR).target("in", ProfilePhoto_.class,
                        profilePhoto -> profilePhoto.profileImage());
                messages.throwIfError();
                return;
            }
            ByteArrayOutputStream osProfile = new ByteArrayOutputStream();
            ByteArrayOutputStream osThumbnail = new ByteArrayOutputStream();
            try {
                BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(output.toByteArray()));
                BufferedImage compressedProfileImage = ImageUtils.getScaledProfilePhoto(bufferedImage);
                BufferedImage compressedThumbnailImage = ImageUtils.getScaledThumbnail(bufferedImage);
                ImageIO.write(compressedProfileImage, mimeType.substring(6), osProfile);
                ImageIO.write(compressedThumbnailImage, mimeType.substring(6), osThumbnail);
            } catch (IOException e) {
                LOGGER.warn("An I/O exception occured while converting profile photo input stream to buffer");
                messages.error(MessageKeys.PROFILE_UPLOAD_IO_ERROR).target("in", ProfilePhoto_.class,
                        profilePhoto -> profilePhoto.profileImage());
                messages.throwIfError();
            }
            InputStream inputStreamAfterProcessing = new ByteArrayInputStream(osProfile.toByteArray());
            photo.setProfileImage(inputStreamAfterProcessing);
            photo.setProfileThumbnail(new ByteArrayInputStream(osThumbnail.toByteArray()));
        }

    }

    @After(event = { CqnService.EVENT_READ }, entity = Attachment_.CDS_NAME)
    public void resumeValidationAfterHandler(final Attachment profile)
        throws ServiceException {
        if(profile.getContent() != null &&  StringUtils.hasLength(profile.getFileName())) {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            performSizeCheckAndThrowError(profile.getContent(), byteArrayOutputStream, RESUME, FILE_MAX_SIZE);
            ByteArrayOutputStream decompressedOutput = FileUtils.decompressUsingGzip(new ByteArrayInputStream(byteArrayOutputStream.toByteArray()));
            if(decompressedOutput!= null) {
                profile.setContent(new ByteArrayInputStream(decompressedOutput.toByteArray()));
            }
        }
    }

    @Before(event = { DraftService.EVENT_DRAFT_PATCH }, entity = Attachment_.CDS_NAME)
    public void resumeValidationBeforeHandler(final Attachment profile)
        throws ServiceException, IOException {
        InputStream resume = profile.getContent();
        if (resume == null && profile.getFileName() == null) {
            LOGGER.debug("Setting the fileName to null when the resume is being set to null");
            profile.setFileName(null);
        }

        if (resume != null) {
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            if (performSizeCheckAndThrowError(resume, output, RESUME, FILE_MAX_SIZE) == Boolean.FALSE) {
                return;
            }
            MalwareScanResponse response = malwareScanService.scanMalware(output.toByteArray(), CV_UPLOAD_MALWARE_SERVICE_TIMEOUT, messages, RESUME);
            if (response == null) {
                LOGGER.warn("Malware scanning service sent null response");
                return;
            } else if (response.getMalwareDetected()) {
                LOGGER.warn("Malware scanning service detected malware in uploaded resume file");
                auditLogUtil.logSecurityEvent(MessageKeys.AUDIT_LOG_MALWARE_DETECTED);
                messages.error(MessageKeys.MALWARE_DETECTED_ERROR).target("in", Attachment_.class,
                    cv -> cv.content());
                messages.throwIfError();
                return;
            }
            ByteArrayOutputStream compressedOutput = FileUtils.compressUsingGzip(output);
            if (compressedOutput != null) {
                profile.setContent(new ByteArrayInputStream(compressedOutput.toByteArray()));
            }
        }
    }

    /**
     *
     * @param myProjectExperienceHeader of{@link MyProjectExperienceHeader} is be
     *                                  passed to
     *                                  {@link MyProjectExperienceHeaderValidator#validateMyProjectExperienceHeaderProperty(MyProjectExperienceHeader)}
     *                                  to validate the properties HandlerOrder
     *                                  Annotation helps to get the ReadOnly fields
     *                                  value used in Messages APIs validation.
     */
    @HandlerOrder(OrderConstants.Before.FILTER_FIELDS - 1)
    @Before(event = { CqnService.EVENT_UPDATE }, entity = MyProjectExperienceHeader_.CDS_NAME)
    public void beforeUpsertMyProjectExperienceHeader(EventContext context,
            final MyProjectExperienceHeader myProjectExperienceHeader) {
        myProjectExperienceHeaderValidator.validateMyProjectExperienceHeaderProperty(myProjectExperienceHeader);

        // Audit log implementation for skill,role assignments(draft activation
        // scenario),
        // During draft activation we are considering only the deletion of the active
        // role,skill assignments
        // Get the existing(active) my project experience header
        CqnSelect queryForExistingData = Select.from(MyProjectExperienceHeader_.class)
                .columns(b -> b.profile().expand(), b -> b.roles().expand(), b -> b.skills().expand(),
                        b -> b.profilePhoto().expand(), b -> b.attachment().expand())
                .where(b -> b.ID().eq(myProjectExperienceHeader.getId()).and(b.IsActiveEntity().eq(Boolean.TRUE)));
        Result existingDataResult = myProjectExperienceService.run(queryForExistingData);
        MyProjectExperienceHeader existingMyProjectExperienceHeader = existingDataResult
                .first(MyProjectExperienceHeader.class).orElseThrow(notFound(MessageKeys.PROFILE_DOES_NOT_EXISTS));

        writeAuditLogForProfilePhoto(existingMyProjectExperienceHeader, myProjectExperienceHeader, context);
        writeAuditLogForResume(existingMyProjectExperienceHeader, myProjectExperienceHeader, context);

        /*
         * Compare the existing,current myProjectExperienceHeader and find the deleted
         * skill,role assignments
         */
        List<Roles> deletedRoles = existingMyProjectExperienceHeader.getRoles().stream()
                .filter(e -> (myProjectExperienceHeader.getRoles().stream().filter(d -> d.getId().equals(e.getId()))
                        .count()) < 1)
                .collect(Collectors.toList());
        List<Skills> deletedSkills = existingMyProjectExperienceHeader.getSkills().stream()
                .filter(e -> (myProjectExperienceHeader.getSkills().stream().filter(d -> d.getId().equals(e.getId()))
                        .count()) < 1)
                .collect(Collectors.toList());

        // Sending audit log message for deleted roles
        for (Roles role : deletedRoles) {
            AuditedDataSubject dataSubject = this.getAuditedDataSubject(
                    existingMyProjectExperienceHeader.getProfile().getDataSubjectRole(),
                    existingMyProjectExperienceHeader.getProfile().getWorkerExternalID(),
                    existingMyProjectExperienceHeader.getProfile().getEmailAddress());

            Roles expandedAssignedRoles = this.getExpandedDataOfRoleAssignments(role.getId(), true);
            if (Boolean.FALSE.equals(expandedAssignedRoles.isEmpty())) {
                RoleMasterList expandedAssignedRole;
                if ((expandedAssignedRole = expandedAssignedRoles.getRole()) != null) {
                    HashMap<String, String> deleteEntity = this.prepareRoleEntity(expandedAssignedRole.getName(),
                            expandedAssignedRole.getCode(), expandedAssignedRole.getDescription());
                    auditLogUtil.logDataModificationAuditMessage(context, ROLE_ASSIGNMENT_OBJECT_TYPE,
                            PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, deleteEntity, null, dataSubject,
                            AuditLogUtil.DELETE_OPERATION);
                }
            }
        }
        // Sending audit log message for deleted skills
        for (Skills skill : deletedSkills) {
            AuditedDataSubject dataSubject = this.getAuditedDataSubject(
                    existingMyProjectExperienceHeader.getProfile().getDataSubjectRole(),
                    existingMyProjectExperienceHeader.getProfile().getWorkerExternalID(),
                    existingMyProjectExperienceHeader.getProfile().getEmailAddress());

            Skills expandedAssignedSkills = this.getExpandedDataOfSkillAssignments(skill.getId(), true);
            if (Boolean.FALSE.equals(expandedAssignedSkills.isEmpty()) && expandedAssignedSkills.getSkill() != null) {
                HashMap<String, String> deleteEntity = this.prepareSkillEntity(expandedAssignedSkills);
                auditLogUtil.logDataModificationAuditMessage(context, SKILL_ASSIGNMENT_OBJECT_TYPE,
                        PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, deleteEntity, null, dataSubject,
                        AuditLogUtil.DELETE_OPERATION);
            }
        }
        messages.throwIfError();
    }

    /**
     * Audit log implementation for skill,role assignments(draft discard scenario)
     **/
    @Before(event = { DraftService.EVENT_DRAFT_CANCEL }, entity = MyProjectExperienceHeader_.CDS_NAME)
    public void beforeDraftCancelForMyProjectExperienceHeader(final DraftCancelEventContext context) {
        String myProjectExperienceHeaderID = (String) analyzer.analyze(context.getCqn().ref()).targetKeys()
                .get(MyProjectExperienceHeader.ID);
        // Get the active myProjectExperienceHeader
        CqnSelect queryForExistingData = Select.from(MyProjectExperienceHeader_.class)
                .columns(b -> b.profile().expand(), b -> b.roles().expand(), b -> b.skills().expand())
                .where(b -> b.ID().eq(myProjectExperienceHeaderID).and(b.IsActiveEntity().eq(Boolean.TRUE)));
        Result existingDataResult = myProjectExperienceService.run(queryForExistingData);
        Optional<MyProjectExperienceHeader> existingMyProjectExperienceHeaderOptional = existingDataResult
                .first(MyProjectExperienceHeader.class);
        MyProjectExperienceHeader existingMyProjectExperienceHeader;
        if (existingMyProjectExperienceHeaderOptional.isPresent()) {
            existingMyProjectExperienceHeader = existingMyProjectExperienceHeaderOptional.get();
        } else {
            return;
        }
        // Get the draft myProjectExperienceHeader
        CqnSelect queryForDraftData = Select.from(MyProjectExperienceHeader_.class)
                .columns(b -> b.profile().expand(), b -> b.roles().expand(), b -> b.skills().expand())
                .where(b -> b.ID().eq(myProjectExperienceHeaderID).and(b.IsActiveEntity().eq(Boolean.FALSE)));
        Result draftDataResult = myProjectExperienceService.run(queryForDraftData);
        Optional<MyProjectExperienceHeader> draftMyProjectExperienceHeaderOptional = draftDataResult
                .first(MyProjectExperienceHeader.class);
        MyProjectExperienceHeader draftMyProjectExperienceHeader;
        if (draftMyProjectExperienceHeaderOptional.isPresent()) {
            draftMyProjectExperienceHeader = draftMyProjectExperienceHeaderOptional.get();
        } else {
            return;
        }
        List<Roles> draftRoles = new ArrayList<>(draftMyProjectExperienceHeader.getRoles().size());
        for (Roles draftRole : draftMyProjectExperienceHeader.getRoles()) {
            if (!isValidGuid(draftRole.getRoleId()))
                continue;
            draftRoles.add(draftRole);
        }
        List<Skills> draftSkills = new ArrayList<>(draftMyProjectExperienceHeader.getSkills().size());
        for (Skills draftSkill : draftMyProjectExperienceHeader.getSkills()) {
            if (!isValidGuid(draftSkill.getSkillId()))
                continue;
            draftSkills.add(draftSkill);
        }
        // Get the created,updated assignments while editing the draft
        List<Roles> createdRoles = draftRoles.stream().filter(e -> (existingMyProjectExperienceHeader.getRoles()
                .stream().filter(d -> d.getId().equals(e.getId())).count()) < 1).collect(Collectors.toList());

        List<Roles> modifiedRoles = draftRoles.stream().filter(e -> (existingMyProjectExperienceHeader.getRoles()
                .stream().filter(d -> d.getRoleId().equals(e.getRoleId())).count()) < 1).collect(Collectors.toList());

        List<Roles> updatedRoles = modifiedRoles.stream()
                .filter(e -> (createdRoles.stream().filter(d -> d.getId().equals(e.getId())).count()) < 1)
                .collect(Collectors.toList());

        List<Skills> createdSkills = draftSkills.stream().filter(e -> (existingMyProjectExperienceHeader.getSkills()
                .stream().filter(d -> d.getId().equals(e.getId())).count()) < 1).collect(Collectors.toList());

        List<Skills> modifiedSkills = draftSkills.stream().filter(e -> (existingMyProjectExperienceHeader.getSkills()
                .stream().filter(d -> d.getSkillId().equals(e.getSkillId())).count()) < 1).collect(Collectors.toList());

        List<Skills> updatedSkills = modifiedSkills.stream()
                .filter(e -> (createdSkills.stream().filter(d -> d.getId().equals(e.getId())).count()) < 1)
                .collect(Collectors.toList());

        AuditedDataSubject dataSubject = this.getAuditedDataSubject(
                existingMyProjectExperienceHeader.getProfile().getDataSubjectRole(),
                existingMyProjectExperienceHeader.getProfile().getWorkerExternalID(),
                existingMyProjectExperienceHeader.getProfile().getEmailAddress());
        // As the draft is discarded, the created assignments will be deleted so logging
        // accordingly
        roleCheck(createdRoles, context, dataSubject);
        skillCheck(createdSkills, context, dataSubject);
        // As the draft is discarded, the updated assignments will be reverted so
        // logging accordingly
        List<Roles> existingRoles = existingMyProjectExperienceHeader.getRoles();
        List<Skills> existingSkills = existingMyProjectExperienceHeader.getSkills();
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
                    PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, updatedEntity, originalEntity, dataSubject,
                    AuditLogUtil.UPDATE_OPERATION);
        }
        for (Skills updatedSkill : updatedSkills) {
            Skills existingSkill = existingSkills.stream().filter(e -> e.getId().equals(updatedSkill.getId()))
                    .findFirst().orElseThrow(notFound(MessageKeys.SKILL_DOES_NOT_EXISTS));
            Skills expandUpdatedSkill = this.getExpandedDataOfSkillAssignments(updatedSkill.getId(), false);
            Skills expandExistingSkill = this.getExpandedDataOfSkillAssignments(existingSkill.getId(), true);
            HashMap<String, String> originalEntity = this.prepareSkillEntity(expandUpdatedSkill);
            HashMap<String, String> updatedEntity = this.prepareSkillEntity(expandExistingSkill);
            auditLogUtil.logDataModificationAuditMessage(context, SKILL_ASSIGNMENT_OBJECT_TYPE,
                    PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, updatedEntity, originalEntity, dataSubject,
                    AuditLogUtil.UPDATE_OPERATION);
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
                            PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, deleteEntity, null, dataSubject,
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
                HashMap<String, String> deleteEntity = this.prepareSkillEntity(expandedAssignedSkills);
                auditLogUtil.logDataModificationAuditMessage(context, SKILL_ASSIGNMENT_OBJECT_TYPE,
                        PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, deleteEntity, null, dataSubject,
                        AuditLogUtil.DELETE_OPERATION);
            }
        }
    }

    @Before(event = { DraftService.EVENT_DRAFT_PATCH }, entity = Roles_.CDS_NAME)
    public void beforeDraftPatchForRoles(DraftPatchEventContext context, Roles role) {
        if (!this.myProjectExperienceHeaderRoleValidator.checkInputFieldLength(role))
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
        Result projectRoleResult = myProjectExperienceService.run(queryForProjectRole);
        Optional<RoleMasterList> optionalRoleMasterList = projectRoleResult.first(RoleMasterList.class);
        RoleMasterList projectRole;
        if (!optionalRoleMasterList.isPresent()) {
            this.myProjectExperienceHeaderRoleValidator.prepareErrorMessage(role, MessageKeys.ROLE_DOES_NOT_EXISTS);
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
                        PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, createEntity, null, dataSubject,
                        AuditLogUtil.CREATE_OPERATION);
            } else {
                HashMap<String, String> originalEntity = this.prepareRoleEntity(
                        roleBeforeTransaction.getRole().getName(), roleBeforeTransaction.getRole().getCode(),
                        roleBeforeTransaction.getRole().getDescription());
                HashMap<String, String> updatedEntity = this.prepareRoleEntity(projectRole.getName(),
                        projectRole.getCode(), projectRole.getDescription());
                auditLogUtil.logDataModificationAuditMessage(context, ROLE_ASSIGNMENT_OBJECT_TYPE,
                        PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, updatedEntity, originalEntity, dataSubject,
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
        Result result = myProjectExperienceService.run(queryForActiveData);
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
                PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, deleteEntity, null, dataSubject, AuditLogUtil.DELETE_OPERATION);
    }

    /**
     * Reject changes of Skill Assignments if the Skill ID is too long for a UUID
     *
     * @param skillAssignment The changed Skill Assignment
     */
    @Before(event = { DraftService.EVENT_DRAFT_PATCH }, entity = Skills_.CDS_NAME)
    public void rejectTooLongSkillIds(final Skills skillAssignment) {
        if (skillAssignment.containsKey(Skills.SKILL_ID)
                && !this.myProjectExperienceHeaderSkillValidator.checkInputFieldLength(skillAssignment)) {
            messages.throwIfError();
        }
    }

    @After(event = { DraftService.EVENT_DRAFT_NEW }, entity = Skills_.CDS_NAME)
    public void afterSkillsDraftNew(Skills skill) {
        skill.setProficiencyLevelEditMode(FIELD_CONTROL_READONLY);
    }

    @After(event = { CqnService.EVENT_READ }, entity = Skills_.CDS_NAME)
    public void afterSkillsRead(List<Skills> skill) {
        skill.forEach(sk -> {
            if (sk.getSkillId() != null && !sk.getSkillId().isEmpty()) {
                sk.setProficiencyLevelEditMode(FIELD_CONTROL_EDITABLE);
            } else {
                sk.setProficiencyLevelEditMode(FIELD_CONTROL_READONLY);
            }
        });
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
    public void beforeDraftPatchForSkill(DraftPatchEventContext context, final Skills skillAssignment) {
        String skillAssignmentID = (String) analyzer.analyze(context.getCqn().ref()).targetKeys().get(Skills.ID);
        Skills oldAssignment = this.getExpandedDataOfSkillAssignments(skillAssignmentID, false);
        boolean createScenario = oldAssignment.getSkill() == null;

        Optional<SkillMasterListAll> skill;
        if (!NullUtils.isNullOrEmpty(skillAssignment.getSkillId()) && isValidGuid(skillAssignment.getSkillId())) {
            CqnSelect queryForSkill = Select.from(SkillMasterListAll_.class).byId(skillAssignment.getSkillId());
            skill = myProjectExperienceService.run(queryForSkill).first(SkillMasterListAll.class);

            // Reject changes of Skill Assignments if the Skill does not exist
            if (!skill.isPresent()) {
                this.myProjectExperienceHeaderSkillValidator.prepareErrorMessageSkill(skillAssignment,
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
            proficiencyLevel = myProjectExperienceService.run(queryForProficiencyLevel).first(ProficiencyLevels.class);
        } else {
            proficiencyLevel = Optional.empty();
        }

        if (!skill.isPresent() && !proficiencyLevel.isPresent()) {
            return; // no relevant data changes
        }

        AuditedDataSubject dataSubject = this.getAuditedDataSubject(oldAssignment.getProfile().getDataSubjectRole(),
                oldAssignment.getProfile().getWorkerExternalID(), oldAssignment.getProfile().getEmailAddress());

        HashMap<String, String> newEntity = prepareSkillEntity(skill, proficiencyLevel);
        if (createScenario) {
            auditLogUtil.logDataModificationAuditMessage(context, SKILL_ASSIGNMENT_OBJECT_TYPE,
                    PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, newEntity, null, dataSubject, AuditLogUtil.CREATE_OPERATION);
        } else {
            // use old skill and proficiency only if a new skill/proficiency were set
            Optional<SkillMasterListAll> oldSkill = skill.flatMap(s -> Optional.ofNullable(oldAssignment.getSkill()));
            Optional<ProficiencyLevels> oldProficiency = proficiencyLevel
                    .flatMap(p -> Optional.ofNullable(oldAssignment.getProficiencyLevel()));
            HashMap<String, String> oldEntity = prepareSkillEntity(oldSkill, oldProficiency);

            auditLogUtil.logDataModificationAuditMessage(context, SKILL_ASSIGNMENT_OBJECT_TYPE,
                    PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, newEntity, oldEntity, dataSubject,
                    AuditLogUtil.UPDATE_OPERATION);
        }
    }

    @Before(event = { DraftService.EVENT_DRAFT_CANCEL }, entity = Skills_.CDS_NAME)
    public void beforeDraftCancelForSkills(final DraftCancelEventContext context) {
        String skillAssignmentID = (String) analyzer.analyze(context.getCqn().ref()).targetKeys().get(Skills.ID);
        CqnSelect queryForActiveData = Select.from(Skills_.class)
                .columns(Skills_::skill_ID, Skills_::employee_ID, b -> b.profile().expand(), b -> b.skill().expand())
                .where(b -> b.ID().eq(skillAssignmentID).and(b.IsActiveEntity().eq(Boolean.TRUE)));
        Result result = myProjectExperienceService.run(queryForActiveData);
        if (result.rowCount() != 0)
            return;
        Skills expandedSkill = this.getExpandedDataOfSkillAssignments(skillAssignmentID, false);
        if (expandedSkill.getSkillId() == null || expandedSkill.getSkill() == null)
            return;
        AuditedDataSubject dataSubject = this.getAuditedDataSubject(expandedSkill.getProfile().getDataSubjectRole(),
                expandedSkill.getProfile().getWorkerExternalID(), expandedSkill.getProfile().getEmailAddress());
        HashMap<String, String> deleteEntity = this.prepareSkillEntity(expandedSkill);
        auditLogUtil.logDataModificationAuditMessage(context, SKILL_ASSIGNMENT_OBJECT_TYPE,
                PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, deleteEntity, null, dataSubject, AuditLogUtil.DELETE_OPERATION);
    }

    @After(event = { DraftService.EVENT_DRAFT_NEW }, entity = ExternalWorkExperienceSkills_.CDS_NAME)
    public void afterExternalWorkExperienceSkillsDraftNew(ExternalWorkExperienceSkills externalWorkExperienceSkills) {
        externalWorkExperienceSkills.setProficiencyLevelEditMode(FIELD_CONTROL_READONLY);
    }

    @After(event = { CqnService.EVENT_READ }, entity = ExternalWorkExperienceSkills_.CDS_NAME)
    public void afterExternalWorkExperienceSkillsRead(List<ExternalWorkExperienceSkills> externalWorkExperienceSkills) {
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
    public void populateExternalWorkExperienceSkillsWithParentIDData(
            final ExternalWorkExperienceSkills externalWorkExperienceSkills, DraftNewEventContext context) {
        String id = cqnUtil.getRootKey(context, context.getCqn(), "ID");
        externalWorkExperienceSkills.setEmployeeId(id);
    }

    @Before(event = { DraftService.EVENT_DRAFT_PATCH }, entity = Skills_.CDS_NAME)
    @HandlerOrder(HandlerOrder.EARLY)
    public void populateDefaultProficiencyLevel(Skills skillAssignment) {
        if (skillAssignment.containsKey(Skills.SKILL_ID) && !skillAssignment.containsKey(Skills.PROFICIENCY_LEVEL_ID)) {
            skillAssignment.setProficiencyLevelId(null);
        }
    }

    @Before(event = { DraftService.EVENT_DRAFT_PATCH }, entity = ExternalWorkExperienceSkills_.CDS_NAME)
    @HandlerOrder(HandlerOrder.EARLY)
    public void populateDefaultProficiencyLevel(ExternalWorkExperienceSkills skillAssignment) {
        if (skillAssignment.containsKey(ExternalWorkExperienceSkills.SKILL_ID)
                && !skillAssignment.containsKey(ExternalWorkExperienceSkills.PROFICIENCY_LEVEL_ID)) {
            skillAssignment.setProficiencyLevelId(null);
        }
    }

    /**
     * This event handler replaces the {0} in localised data of monthsOfTheYear with
     * year and populates the manipulated data in the Periodic Availability Table
     */
    @After(event = { CqnService.EVENT_READ }, entity = PeriodicAvailability_.CDS_NAME)
    public void readPeriodicAvailabilityMonthlyData(final CdsReadEventContext cdsReadEventContext) {
        this.commonEventHandlerUtil.setLocalisedDataForPeriodicAvailability(cdsReadEventContext,
                PeriodicAvailability.MONTH_YEAR, PeriodicAvailability.CALMONTH);
    }

    /**
     * This event handler replaces the {0} in localised data of monthsOfTheYear with
     * year and populates the manipulated data in the PeriodicUtilization
     */
    @After(event = { CqnService.EVENT_READ }, entity = PeriodicUtilization_.CDS_NAME)
    public void readPeriodicUtilizationData(final CdsReadEventContext cdsReadEventContext) {
        this.commonEventHandlerUtil.setLocalisedDataForPeriodicUtilization(cdsReadEventContext,
                PeriodicUtilization.MONTH_YEAR, PeriodicUtilization.CALMONTH);
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
    public void afterReadSetCommaSeparatedCatalogs(final CdsReadEventContext context,
            final List<SkillMasterList> skills) {
        if (shouldComputeCommaSeparated(context.getCqn())) {
            skills.forEach(skill -> {
                skill.setCommaSeparatedCatalogs(computeCommaSeparated(skill.getCatalogAssociations()));
                // CAP tries to serialize the added expansion as "Non-nullable property not
                // present". Hence, we have to remove it
                removeInvalidAssociation(skill);
            });
        }
    }

    @After(event = CqnService.EVENT_READ, entity = InternalWorkExperience_.CDS_NAME)
    public void afterReadInternalWorkExperience(final CdsReadEventContext cdsReadEventContext) {
        this.commonEventHandlerUtil.setLocalInternalWEConvertedAssigned(cdsReadEventContext,
                InternalWorkExperience.CONVERTED_ASSIGNED_CAPACITY);
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

    protected String computeCommaSeparated(List<Catalogs2SkillsConsumption> catalogAssociations) {
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

    private Supplier<ServiceException> notFound(String message) {
        return () -> new ServiceException(HttpStatus.NOT_FOUND, message);
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
        Result result = myProjectExperienceService.run(cqnQuery);
        return result.first(Roles.class).orElseThrow(notFound(MessageKeys.ROLE_DOES_NOT_EXISTS));
    }

    protected Skills getExpandedDataOfSkillAssignments(String skillAssignmentId, boolean isActiveData) {
        CqnSelect cqnQuery = Select.from(Skills_.class)
                .columns(Skills_::skill_ID, Skills_::proficiencyLevel_ID, Skills_::employee_ID,
                        b -> b.profile().expand(), b -> b.skill().expand(), b -> b.proficiencyLevel().expand())
                .where(b -> b.ID().eq(skillAssignmentId).and(b.IsActiveEntity().eq(isActiveData)));
        Result result = myProjectExperienceService.run(cqnQuery);
        return result.first(Skills.class).orElseThrow(notFound(MessageKeys.SKILL_DOES_NOT_EXISTS));
    }

    protected HashMap<String, String> prepareRoleEntity(String name, String code, String description) {
        HashMap<String, String> entity = new HashMap<>();
        entity.put("name", name);
        entity.put("code", code);
        entity.put("description", description);
        return entity;
    }

    protected HashMap<String, String> prepareSkillEntity(Skills skillAssignment) {
        Optional<SkillMasterListAll> skill = Optional.ofNullable(skillAssignment.getSkill());
        Optional<ProficiencyLevels> level = Optional.ofNullable(skillAssignment.getProficiencyLevel());
        return prepareSkillEntity(skill, level);
    }

    protected HashMap<String, String> prepareSkillEntity(Optional<SkillMasterListAll> skill,
            Optional<ProficiencyLevels> proficiencyLevel) {
        HashMap<String, String> entity = new HashMap<>();
        skill.ifPresent(s -> {
            entity.put("name", s.getName());
            entity.put("description", s.getDescription());
        });
        proficiencyLevel.ifPresent(l -> {
            entity.put("proficiencyLevelName", l.getName());
            entity.put("proficiencyLevelDescription", l.getDescription());
            entity.put("proficiencyLevel", l.getRank().toString());
        });
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

    public boolean performSizeCheckAndThrowError(InputStream inputStream, ByteArrayOutputStream output, String entity, int maxSize) {
        try {
            int length = 0;
            byte[] buffer = new byte[Constants.DEFAULT_BUFFER_SIZE];
            int bytesRead;
            while (Constants.EOF != (bytesRead = inputStream.read(buffer))) {
                output.write(buffer, 0, bytesRead);
                length += bytesRead;
                // size check would not be required when the following issue is resolved:
                // https://github.tools.sap/cap/issues/issues/11583
                if (length > maxSize) {
                    IOUtils.consume(inputStream);
                    inputStream.close();
                    output.close();
                    LOGGER.warn("The size of the uploaded {} exceeds 2 MB.",entity);
                    LOGGER.debug(MARKER, "{} input stream data length: {}",entity, length);
                    if(entity.equalsIgnoreCase(PROFILE_PHOTO_ASSIGNMENT_OBJECT_TYPE))
                        messages.error(MessageKeys.PROFILE_UPLOAD_SIZE_ERROR).target("in", ProfilePhoto_.class,
                            photo -> photo.profileImage());
                    if(entity.equalsIgnoreCase(RESUME))
                        messages.error(MessageKeys.PROFILE_UPLOAD_SIZE_ERROR).target("in", Attachment_.class,
                            resume -> resume.content());
                    messages.throwIfError();
                    return false;
                }
            }
        } catch (IOException e) {
            LOGGER.warn("An I/O exception occured while processing {}",entity);
            if(entity.equalsIgnoreCase(PROFILE_PHOTO_ASSIGNMENT_OBJECT_TYPE))
                messages.error(MessageKeys.PROFILE_UPLOAD_IO_ERROR).target("in", ProfilePhoto_.class,
                    photo -> photo.profileImage());
            if(entity.equalsIgnoreCase(RESUME))
                messages.error(MessageKeys.PROFILE_UPLOAD_IO_ERROR).target("in", Attachment_.class,
                    attachment -> attachment.content());
            messages.throwIfError();
            return false;
        }
        return true;
    }

    private String performMimeTypeCheck(ByteArrayOutputStream output, List<MimeType> mimeTypeList, String entity) {
        String mimeType = "";
        try {
            Tika tika = new Tika();
            mimeType = tika.detect(new ByteArrayInputStream(output.toByteArray()));
            if (MimeType.valueOf(mimeType)
                    .isPresentIn(mimeTypeList) == Boolean.FALSE) {
                if(entity.equalsIgnoreCase(PROFILE_PHOTO_ASSIGNMENT_OBJECT_TYPE)) {
                    messages.error(MessageKeys.PROFILE_UPLOAD_MIME_TYPE_ERROR).target("in", ProfilePhoto_.class,
                        profilePhoto -> profilePhoto.profileImage());
                }
                messages.throwIfError();
                return null;
            }
        } catch (IOException e) {
            LOGGER.warn("An I/O exception occurred while processing {} to identify its MIME type", entity);
            if(entity.equalsIgnoreCase(PROFILE_PHOTO_ASSIGNMENT_OBJECT_TYPE)) {
                messages.error(MessageKeys.PROFILE_UPLOAD_IO_ERROR).target("in", ProfilePhoto_.class,
                    profilePhoto -> profilePhoto.profileImage());
            }
            messages.throwIfError();
            return null;
        }
        return mimeType;
    }

    private void writeAuditLogForProfilePhoto(MyProjectExperienceHeader existingMyProjectExperienceHeader,
            MyProjectExperienceHeader myProjectExperienceHeader, EventContext context) {
        ProfilePhoto oldProfilePhoto = existingMyProjectExperienceHeader.getProfilePhoto();
        ProfilePhoto newProfilePhoto = myProjectExperienceHeader.getProfilePhoto();
        if (oldProfilePhoto != null && newProfilePhoto != null) {
            InputStream oldInputStream = oldProfilePhoto.getProfileImage();
            InputStream newInputStream = newProfilePhoto.getProfileImage();
            try {
                HashMap<String, String> entity = new HashMap<>();
                entity.put("Profile Photo", "Profile Photo");
                AuditedDataSubject dataSubject = this.getAuditedDataSubject(
                        existingMyProjectExperienceHeader.getProfile().getDataSubjectRole(),
                        existingMyProjectExperienceHeader.getProfile().getWorkerExternalID(),
                        existingMyProjectExperienceHeader.getProfile().getEmailAddress());
                if (oldInputStream != null && newInputStream == null) {
                    auditLogUtil.logDataModificationAuditMessage(context, PROFILE_PHOTO_ASSIGNMENT_OBJECT_TYPE,
                            PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, entity, null, dataSubject,
                            AuditLogUtil.DELETE_OPERATION);
                } else if (oldInputStream == null && newInputStream != null) {
                    auditLogUtil.logDataModificationAuditMessage(context, PROFILE_PHOTO_ASSIGNMENT_OBJECT_TYPE,
                            PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, entity, null, dataSubject,
                            AuditLogUtil.CREATE_OPERATION);
                } else if (oldInputStream != null) {
                    byte[] newInputByte = IOUtils.toByteArray(newInputStream);
                    byte[] oldInputByte = IOUtils.toByteArray(oldInputStream);
                    if (!Arrays.equals(newInputByte, oldInputByte)) {
                        auditLogUtil.logDataModificationAuditMessage(context, PROFILE_PHOTO_ASSIGNMENT_OBJECT_TYPE,
                                PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, entity, entity, dataSubject,
                                AuditLogUtil.UPDATE_OPERATION);
                    }
                    InputStream newInputStreamAfterProcessing = new ByteArrayInputStream(newInputByte);
                    myProjectExperienceHeader.getProfilePhoto().setProfileImage(newInputStreamAfterProcessing);
                }
            } catch (IOException e) {
                LOGGER.error("An I/O exception occured while performing audit log of profile photo image");
                throw new ServiceException(MessageKeys.PROFILE_UPLOAD_IO_ERROR);
            }
        }
    }

    private void writeAuditLogForResume(MyProjectExperienceHeader existingMyProjectExperienceHeader,
                                              MyProjectExperienceHeader myProjectExperienceHeader, EventContext context) {
        Attachment oldCv = existingMyProjectExperienceHeader.getAttachment();
        Attachment newCv = myProjectExperienceHeader.getAttachment();
        if (oldCv != null && newCv != null) {
            InputStream oldInputStream = oldCv.getContent();
            InputStream newInputStream = newCv.getContent();
            try {
                AuditedDataSubject dataSubject = this.getAuditedDataSubject(
                    existingMyProjectExperienceHeader.getProfile().getDataSubjectRole(),
                    existingMyProjectExperienceHeader.getProfile().getWorkerExternalID(),
                    existingMyProjectExperienceHeader.getProfile().getEmailAddress());
                writeAuditLog(myProjectExperienceHeader, context, oldCv, newCv, oldInputStream, newInputStream, dataSubject);
            } catch (IOException e) {
                LOGGER.error("An I/O exception occured while performing audit log of resume upload");
                throw new ServiceException(MessageKeys.PROFILE_UPLOAD_IO_ERROR);
            }
        }
    }

    private void writeAuditLog(MyProjectExperienceHeader myProjectExperienceHeader, EventContext context, Attachment oldCv,
                               Attachment newCv, InputStream oldInputStream, InputStream newInputStream,
                               AuditedDataSubject dataSubject) throws IOException {
        HashMap<String, String> currentEntity = new HashMap<>();
        HashMap<String, String> oldEntity = new HashMap<>();
        if (oldInputStream != null && newInputStream == null) {
            logOperation(currentEntity, oldCv, context, dataSubject, AuditLogUtil.DELETE_OPERATION);
        } else if (oldInputStream == null && newInputStream != null) {
            logOperation(currentEntity, newCv, context, dataSubject, AuditLogUtil.CREATE_OPERATION);
        } else if (oldInputStream != null) {
            byte[] newInputByte = IOUtils.toByteArray(newInputStream);
            byte[] oldInputByte = IOUtils.toByteArray(oldInputStream);
            if (!Arrays.equals(newInputByte, oldInputByte)) {
                oldEntity.put(FILENAME, null != oldCv.getFileName() ? oldCv.getFileName() : null);
                currentEntity.put(FILENAME, null != newCv.getFileName() ? newCv.getFileName() : null);
                auditLogUtil.logDataModificationAuditMessage(context, RESUME,
                    PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, oldEntity, dataSubject,
                    AuditLogUtil.UPDATE_OPERATION);
            }
            InputStream newInputStreamAfterProcessing = new ByteArrayInputStream(newInputByte);
            myProjectExperienceHeader.getAttachment().setContent(newInputStreamAfterProcessing);
        }
    }

    private void logOperation(HashMap<String, String> currentEntity, Attachment cv, EventContext context,
                              AuditedDataSubject dataSubject, String operation) {
        currentEntity.put(FILENAME, null != cv.getFileName() ? cv.getFileName() : null);
        auditLogUtil.logDataModificationAuditMessage(context, RESUME,
            PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null, dataSubject,
            operation);
    }
}
