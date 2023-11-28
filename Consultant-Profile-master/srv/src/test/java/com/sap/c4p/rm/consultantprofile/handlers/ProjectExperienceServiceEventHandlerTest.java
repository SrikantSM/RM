package com.sap.c4p.rm.consultantprofile.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.auditlog.AuditLogUtil;
import com.sap.c4p.rm.consultantprofile.projectexperienceservice.validations.ProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator;
import com.sap.c4p.rm.consultantprofile.projectexperienceservice.validations.ProjectExperienceServiceExternalWorkExperienceValidator;
import com.sap.c4p.rm.consultantprofile.projectexperienceservice.validations.ProjectExperienceServiceSkillAssignmentsValidator;
import com.sap.c4p.rm.consultantprofile.utils.CqnUtil;
import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.impl.RowImpl;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.request.UserInfo;
import com.sap.resourcemanagement.employee.Headers;
import com.sap.resourcemanagement.employee.Headers_;
import com.sap.xs.audit.api.v2.AuditLogMessageFactory;
import com.sap.xs.audit.api.v2.AuditedDataSubject;

import projectexperienceservice.ExternalWorkExperience;
import projectexperienceservice.ExternalWorkExperienceSkillAssignments;
import projectexperienceservice.ExternalWorkExperienceSkillAssignments_;
import projectexperienceservice.ExternalWorkExperience_;
import projectexperienceservice.ProjectExperienceService_;
import projectexperienceservice.SkillAssignments;
import projectexperienceservice.SkillAssignments_;


public class ProjectExperienceServiceEventHandlerTest extends InitMocks {

    @Mock
    private ProjectExperienceServiceSkillAssignmentsValidator mockProjectExperienceServiceSkillAssignmentsValidator;
    
    @Mock
    private ProjectExperienceServiceExternalWorkExperienceValidator mockProjectExperienceServiceExternalWorkExperienceValidator;
    
    @Mock
    private ProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator mockProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator;

    @Mock
    private AuditLogUtil mockAuditLogUtil;

    @Mock
    private AuditedDataSubject mockAuditedDataSubject;

    @Mock
    private AuditLogMessageFactory mockAuditLogFactory;

    @Mock
    @Qualifier(ProjectExperienceService_.CDS_NAME)
    private CqnService mockProjectExperienceService;

    @Mock
    private EventContext mockEventContext;

    @Mock
    private CdsDeleteEventContext mockCdsDeleteEventContext;

    @Mock
    private CqnUtil mockCqnUtil;

    @Mock
    private UserInfo mockUserInfo;

    @Mock
    private Result mockResult;
    
    @Mock
    private PersistenceService mockPersistenceService;
    
    @Mock
    Set<String> mockString;

    @Autowired
    @InjectMocks
    @Spy
    private ProjectExperienceServiceEventHandler classUnderTest;

    @Test
    @DisplayName("Verify if valiators are called before create or upsert or update of Skill Assignments")
    void testBeforeCreateUpsertUpdateSkillAssignments() throws IOException {
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID");
        doNothing().when(mockProjectExperienceServiceSkillAssignmentsValidator)
                .checkSkillAssignmentForXSS(skillAssignments);
        doNothing().when(mockProjectExperienceServiceSkillAssignmentsValidator).checkIfDraftExists(skillAssignments);
        doNothing().when(mockProjectExperienceServiceSkillAssignmentsValidator)
                .checkForeignKeyValueForAssignedSkill(skillAssignments);
        doNothing().when(mockProjectExperienceServiceSkillAssignmentsValidator)
                .checkForeignKeyValueForAssignedProfile(skillAssignments);
        doNothing().when(mockProjectExperienceServiceSkillAssignmentsValidator)
                .checkForeignKeyValueForAssignedProficiencyLevel(skillAssignments);
        this.classUnderTest.beforeCreateUpsertUpdateSkillAssignmentsValidation(mockEventContext, skillAssignments);
        verify(this.mockProjectExperienceServiceSkillAssignmentsValidator, times(1))
                .checkSkillAssignmentForXSS(skillAssignments);
        verify(this.mockProjectExperienceServiceSkillAssignmentsValidator, times(1))
                .checkIfDraftExists(skillAssignments);
        verify(this.mockProjectExperienceServiceSkillAssignmentsValidator, times(1))
                .checkForeignKeyValueForAssignedSkill(skillAssignments);
        verify(this.mockProjectExperienceServiceSkillAssignmentsValidator, times(1))
                .checkForeignKeyValueForAssignedProfile(skillAssignments);
        verify(this.mockProjectExperienceServiceSkillAssignmentsValidator, times(1))
                .checkForeignKeyValueForAssignedProficiencyLevel(skillAssignments);
    }
    
    @Test
    @DisplayName("Verify if valiators are called before create or upsert or update of External Work Experience")
    void testBeforeCreateUpsertUpdateExternalWorkExperience() throws IOException {
    	ExternalWorkExperience externalWorkExperience = ExternalWorkExperience.create("test-ID");
        doNothing().when(mockProjectExperienceServiceExternalWorkExperienceValidator)
                .checkExternalWorkExperienceForXSS(externalWorkExperience);
        doNothing().when(mockProjectExperienceServiceExternalWorkExperienceValidator).checkIfDraftExists(externalWorkExperience);
        doNothing().when(mockProjectExperienceServiceExternalWorkExperienceValidator)
                .checkForeignKeyValueForAssignedProfile(externalWorkExperience);
        doNothing().when(mockProjectExperienceServiceExternalWorkExperienceValidator).validateStartDate(externalWorkExperience);
        this.classUnderTest.beforeCreateUpsertUpdateExternalWorkExperienceValidation(mockEventContext, externalWorkExperience);
        verify(this.mockProjectExperienceServiceExternalWorkExperienceValidator, times(1))
                .checkExternalWorkExperienceForXSS(externalWorkExperience);
        verify(this.mockProjectExperienceServiceExternalWorkExperienceValidator, times(1))
                .checkIfDraftExists(externalWorkExperience);
        verify(this.mockProjectExperienceServiceExternalWorkExperienceValidator, times(1))
                .checkForeignKeyValueForAssignedProfile(externalWorkExperience);
        verify(this.mockProjectExperienceServiceExternalWorkExperienceValidator, times(1))
                .validateStartDate(externalWorkExperience);
    }
    
    @Test
    @DisplayName("Verify if valiators are called before create or upsert or update of External Work Experience Skill Assignments")
    void testBeforeCreateUpsertUpdateExternalWorkExperienceSkillAssignments() throws IOException {
    	ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        doNothing().when(mockProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator)
                .checkExternalWorkExperienceSkillAssignmentsForXSS(externalWorkExperienceSkillAssignments);
        doNothing().when(mockProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator).checkIfDraftExists(externalWorkExperienceSkillAssignments);
        doNothing().when(mockProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator)
                .checkForeignKeyValueForAssignedSkill(externalWorkExperienceSkillAssignments);
        doNothing().when(mockProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator)
                .checkForeignKeyValueForAssignedProfile(externalWorkExperienceSkillAssignments);
        doNothing().when(mockProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator)
        .checkForeignKeyValueForAssignedExternalWorkExperience(externalWorkExperienceSkillAssignments);
        doNothing().when(mockProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator)
                .checkForeignKeyValueForAssignedProficiencyLevel(externalWorkExperienceSkillAssignments);
        this.classUnderTest.beforeCreateUpsertUpdateExternalWorkExperienceSkillAssignmentsValidation(mockEventContext, externalWorkExperienceSkillAssignments);
        verify(this.mockProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator, times(1))
                .checkExternalWorkExperienceSkillAssignmentsForXSS(externalWorkExperienceSkillAssignments);
        verify(this.mockProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator, times(1))
                .checkIfDraftExists(externalWorkExperienceSkillAssignments);
        verify(this.mockProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator, times(1))
                .checkForeignKeyValueForAssignedSkill(externalWorkExperienceSkillAssignments);
        verify(this.mockProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator, times(1))
                .checkForeignKeyValueForAssignedProfile(externalWorkExperienceSkillAssignments);
        verify(this.mockProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator, times(1))
        .checkForeignKeyValueForAssignedExternalWorkExperience(externalWorkExperienceSkillAssignments);
        verify(this.mockProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator, times(1))
                .checkForeignKeyValueForAssignedProficiencyLevel(externalWorkExperienceSkillAssignments);
    }

    @Test
    @DisplayName("Verify if create audit log is written after create of Skill Assignments")
    void testAfterCreateSkillAssignments() throws IOException {
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID");
        HashMap<String, String> entity = new HashMap<>();
        entity.put("ID", skillAssignments.getId());
        when(mockEventContext.getEvent()).thenReturn(CqnService.EVENT_CREATE);
        when(mockUserInfo.getAdditionalAttribute("cid")).thenReturn("client ID Value");
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTest).getAuditedDataSubject(any());
        this.classUnderTest.beforeCreateSkillAssignmentsAuditLog(mockEventContext, skillAssignments);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockEventContext, "SkillAssignments",
                "ProjectExperienceService", entity, null, mockAuditedDataSubject, AuditLogUtil.CREATE_OPERATION);
    }

    @Test
    @DisplayName("Verify if create audit log is written after fresh update of Skill Assignments")
    void testAfterUpdateSkillAssignmentsCreation() throws IOException {
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID-2");
        HashMap<String, String> entity = new HashMap<>();
        entity.put("ID", skillAssignments.getId());
        when(mockEventContext.getEvent()).thenReturn(CqnService.EVENT_UPDATE);
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTest).getAuditedDataSubject(any());
        when(mockProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first()).thenReturn(Optional.empty());
        this.classUnderTest.beforeUpsertUpdateDeleteSkillAssignmentsAuditLog(mockEventContext, skillAssignments);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockEventContext, "SkillAssignments",
                "ProjectExperienceService", entity, null, mockAuditedDataSubject, AuditLogUtil.CREATE_OPERATION);
    }

    @Test
    @DisplayName("Verify if update audit log is written after update of Skill Assignments")
    void testAfterUpdateSkillAssignments() throws IOException {
        SkillAssignments oldSkillAssignments = SkillAssignments.create("test-ID-1");
        oldSkillAssignments.setProficiencyLevelID("level-01");
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID-1");
        skillAssignments.setProficiencyLevelID("level-02");
        HashMap<String, String> entity = new HashMap<>();
        skillAssignments.forEach((key, value) -> entity.put(key, (String) value));
        HashMap<String, String> oldEntity = new HashMap<>();
        oldSkillAssignments.forEach((key, value) -> oldEntity.put(key, (String) value));
        Row oldSkillAssignmentRow = RowImpl.row(oldEntity);
        when(mockEventContext.getEvent()).thenReturn(CqnService.EVENT_UPDATE);
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTest).getAuditedDataSubject(any());
        Mockito.doReturn(mockResult).when(mockProjectExperienceService).run(any(CqnSelect.class));
        when(mockResult.first()).thenReturn(Optional.of(oldSkillAssignmentRow));
        when(mockResult.single(SkillAssignments.class)).thenReturn(oldSkillAssignments);
        this.classUnderTest.beforeUpsertUpdateDeleteSkillAssignmentsAuditLog(mockEventContext, skillAssignments);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockEventContext, "SkillAssignments",
                "ProjectExperienceService", entity, oldEntity, mockAuditedDataSubject, AuditLogUtil.UPDATE_OPERATION);
    }

    @Test
    @DisplayName("Verify if create audit log is written after fresh upsert of Skill Assignments")
    void testAfterUpsertSkillAssignmentsCreation() throws IOException {
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID-2");
        HashMap<String, String> entity = new HashMap<>();
        entity.put("ID", skillAssignments.getId());
        when(mockEventContext.getEvent()).thenReturn(CqnService.EVENT_UPSERT);
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTest).getAuditedDataSubject(any());
        when(mockProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first()).thenReturn(Optional.empty());
        this.classUnderTest.beforeUpsertUpdateDeleteSkillAssignmentsAuditLog(mockEventContext, skillAssignments);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockEventContext, "SkillAssignments",
                "ProjectExperienceService", entity, null, mockAuditedDataSubject, AuditLogUtil.CREATE_OPERATION);
    }

    @Test
    @DisplayName("Verify if update audit log is written after upsert of Skill Assignments")
    void testAfterUpsertSkillAssignmentsUpdation() throws IOException {
        SkillAssignments oldSkillAssignments = SkillAssignments.create("test-ID-1");
        oldSkillAssignments.setProficiencyLevelID("level-01");
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID-2");
        skillAssignments.setProficiencyLevelID("level-02");
        skillAssignments.keySet().removeIf(row -> skillAssignments.get(row) == null);
        HashMap<String, String> entity = new HashMap<>();
        skillAssignments.forEach((key, value) -> entity.put(key, (String) value));
        oldSkillAssignments.keySet().removeIf(row -> oldSkillAssignments.get(row) == null);
        HashMap<String, String> oldEntity = new HashMap<>();
        oldSkillAssignments.forEach((key, value) -> oldEntity.put(key, (String) value));
        Row oldSkillAssignmentRow = RowImpl.row(oldEntity);
        when(mockEventContext.getEvent()).thenReturn(CqnService.EVENT_UPSERT);
        when(mockUserInfo.getAdditionalAttribute("cid")).thenReturn("client ID Value");
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTest).getAuditedDataSubject(any());
        Mockito.doReturn(mockResult).when(mockProjectExperienceService).run(any(CqnSelect.class));
        when(mockResult.first()).thenReturn(Optional.of(oldSkillAssignmentRow));
        when(mockResult.single(SkillAssignments.class)).thenReturn(oldSkillAssignments);
        this.classUnderTest.beforeUpsertUpdateDeleteSkillAssignmentsAuditLog(mockEventContext, skillAssignments);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockEventContext, "SkillAssignments",
                "ProjectExperienceService", entity, oldEntity, mockAuditedDataSubject, AuditLogUtil.UPDATE_OPERATION);
    }

    @Test
    @DisplayName("Verify if delete audit log is written before delete of Skill Assignments")
    void testAfterDeleteSkillAssignments() throws IOException {
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID");
        HashMap<String, String> entity = new HashMap<>();
        entity.put("ID", skillAssignments.getId());
        doNothing().when(mockProjectExperienceServiceSkillAssignmentsValidator).checkIfDraftExists(skillAssignments);
        when(mockCqnUtil.getRootKey(eq(mockCdsDeleteEventContext), any(CqnDelete.class), eq("ID")))
                .thenReturn("test-ID");
        when(mockCdsDeleteEventContext.getCqn())
                .thenReturn(Delete.from(SkillAssignments_.class).where(s -> s.ID().eq("test-ID")));
        Mockito.doReturn(mockResult).when(mockProjectExperienceService).run(any(CqnSelect.class));
        Row skillAssignmentRow = RowImpl.row(entity);
        when(mockResult.first()).thenReturn(Optional.of(skillAssignmentRow));
        when(mockResult.single(SkillAssignments.class)).thenReturn(skillAssignments);
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTest).getAuditedDataSubject(any());
        this.classUnderTest.beforeDeleteSkillAssignmentsAuditLog(mockCdsDeleteEventContext);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockCdsDeleteEventContext,
                "SkillAssignments",
                "ProjectExperienceService", entity, null, mockAuditedDataSubject, AuditLogUtil.DELETE_OPERATION);
        verify(this.mockProjectExperienceServiceSkillAssignmentsValidator, times(1))
                .checkIfDraftExists(skillAssignments);
    }
    
    @Test
    @DisplayName("test before delete of external work experience")
    void testbeforeDeleteExternalWorkExperience() throws IOException {
    	ExternalWorkExperience externalWorkExperience = ExternalWorkExperience.create("test-ID");
        HashMap<String, String> entity = new HashMap<>();
        entity.put("ID", externalWorkExperience.getId());
        doNothing().when(mockProjectExperienceServiceExternalWorkExperienceValidator).checkIfDraftExists(externalWorkExperience);
        when(mockCqnUtil.getRootKey(eq(mockCdsDeleteEventContext), any(CqnDelete.class), eq("ID")))
                .thenReturn("test-ID");
        when(mockCdsDeleteEventContext.getCqn())
                .thenReturn(Delete.from(ExternalWorkExperience_.class).where(s -> s.ID().eq("test-ID")));
        Mockito.doReturn(mockResult).when(mockProjectExperienceService).run(any(CqnSelect.class));
        Row externalWorkExperienceRow = RowImpl.row(entity);
        when(mockResult.first()).thenReturn(Optional.of(externalWorkExperienceRow));
        when(mockResult.single(ExternalWorkExperience.class)).thenReturn(externalWorkExperience);
        this.classUnderTest.beforeDeleteExternalWorkExperience(mockCdsDeleteEventContext);
        verify(this.mockProjectExperienceServiceExternalWorkExperienceValidator, times(1))
                .checkIfDraftExists(externalWorkExperience);
    }
    
    @Test
    @DisplayName("test before delete of external work experience skill assignments")
    void testbeforeDeleteExternalWorkExperienceSkillAssignments() throws IOException {
    	ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        HashMap<String, String> entity = new HashMap<>();
        entity.put("ID", externalWorkExperienceSkillAssignments.getId());
        doNothing().when(mockProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator).checkIfDraftExists(externalWorkExperienceSkillAssignments);
        when(mockCqnUtil.getRootKey(eq(mockCdsDeleteEventContext), any(CqnDelete.class), eq("ID")))
                .thenReturn("test-ID");
        when(mockCdsDeleteEventContext.getCqn())
                .thenReturn(Delete.from(ExternalWorkExperienceSkillAssignments_.class).where(s -> s.ID().eq("test-ID")));
        Mockito.doReturn(mockResult).when(mockProjectExperienceService).run(any(CqnSelect.class));
        Row externalWorkExperienceSkillAssignmentsRow = RowImpl.row(entity);
        when(mockResult.first()).thenReturn(Optional.of(externalWorkExperienceSkillAssignmentsRow));
        when(mockResult.single(ExternalWorkExperienceSkillAssignments.class)).thenReturn(externalWorkExperienceSkillAssignments);
        this.classUnderTest.beforeDeleteExternalWorkExperienceSkillAssignments(mockCdsDeleteEventContext);
        verify(this.mockProjectExperienceServiceExternalWorkExperienceSkillAssignmentsValidator, times(1))
                .checkIfDraftExists(externalWorkExperienceSkillAssignments);
    }
    
    @Test
    @DisplayName("Verify if employee header is created after update of Skill Assignments")
    void testAfterCreateSkillAssignment() throws IOException {
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID-2");
        skillAssignments.setProfileID("test-1");
        skillAssignments.setChangedAt(Instant.now());
        Headers expectedHeader = Headers.create();
        expectedHeader.setModifiedBy("System User");
        expectedHeader.setModifiedAt(skillAssignments.getChangedAt());
        when(mockEventContext.getEvent()).thenReturn(CqnService.EVENT_UPDATE);
        final ArgumentCaptor<CqnUpdate> argumentUpdate = ArgumentCaptor.forClass(CqnUpdate.class);
        when(mockPersistenceService.run(any(CqnUpdate.class))).thenReturn(mockResult);
    	CqnUpdate expected = Update.entity(Headers_.class).where(s -> s.ID().eq(skillAssignments.getProfileID())).data(expectedHeader);
    	this.classUnderTest.afterCreateSkillAssignment(skillAssignments);
        verify(mockPersistenceService, times(1)).run(argumentUpdate.capture());
        assertEquals(expected.toJson().toString(), argumentUpdate.getValue().toJson().toString());
    }
    
    @Test
    @DisplayName("Verify if employee header is updated after update of Skill Assignments")
    void testAfterUpdateSkillAssignment() throws IOException {
        SkillAssignments skillAssignments = SkillAssignments.create("test-ID-2");
        skillAssignments.setChangedAt(Instant.now());
        skillAssignments.setProfileID("Test-1");
        Headers expectedHeader = Headers.create();
        expectedHeader.setModifiedBy("System User");
        expectedHeader.setModifiedAt(skillAssignments.getChangedAt());
        when(mockEventContext.getEvent()).thenReturn(CqnService.EVENT_UPDATE);
        when(mockPersistenceService.run(any(CqnUpdate.class))).thenReturn(mockResult);
        Row skillAssignmentRow = RowImpl.row(skillAssignments);
        when(mockResult.first()).thenReturn(Optional.of(skillAssignmentRow));
        Mockito.doReturn(mockResult).when(mockProjectExperienceService).run(any(CqnSelect.class));
        final ArgumentCaptor<CqnUpdate> argumentUpdate = ArgumentCaptor.forClass(CqnUpdate.class);
    	CqnUpdate expected = Update.entity(Headers_.class).where(s -> s.ID().eq("Test-1")).data(expectedHeader);
    	this.classUnderTest.afterUpdateSkillAssignment(skillAssignments);
        verify(mockPersistenceService, times(1)).run(argumentUpdate.capture());
        assertEquals(expected.toJson().toString(), argumentUpdate.getValue().toJson().toString());
    }
    
    @Test
    @DisplayName("Verify if employee header is created after create of External Work Experience")
    void testAfterCreateExternalWorkExperience() throws IOException {
    	ExternalWorkExperience externalWorkExperience = ExternalWorkExperience.create("test-ID");
    	externalWorkExperience.setProfileID("test-1");
    	externalWorkExperience.setChangedAt(Instant.now());
        Headers expectedHeader = Headers.create();
        expectedHeader.setModifiedBy("System User");
        expectedHeader.setModifiedAt(externalWorkExperience.getChangedAt());
        when(mockEventContext.getEvent()).thenReturn(CqnService.EVENT_UPDATE);
        final ArgumentCaptor<CqnUpdate> argumentUpdate = ArgumentCaptor.forClass(CqnUpdate.class);
        when(mockPersistenceService.run(any(CqnUpdate.class))).thenReturn(mockResult);
    	CqnUpdate expected = Update.entity(Headers_.class).where(s -> s.ID().eq(externalWorkExperience.getProfileID())).data(expectedHeader);
    	this.classUnderTest.afterCreateExternalWorkExperience(externalWorkExperience);
        verify(mockPersistenceService, times(1)).run(argumentUpdate.capture());
        assertEquals(expected.toJson().toString(), argumentUpdate.getValue().toJson().toString());
    }
    
    @Test
    @DisplayName("Verify if employee header is updated after update of External Work Experience")
    void testAfterUpdateExternalWorkExperience() throws IOException {
    	ExternalWorkExperience externalWorkExperience = ExternalWorkExperience.create("test-ID-2");
    	externalWorkExperience.setChangedAt(Instant.now());
    	externalWorkExperience.setProfileID("Test-1");
        Headers expectedHeader = Headers.create();
        expectedHeader.setModifiedBy("System User");
        expectedHeader.setModifiedAt(externalWorkExperience.getChangedAt());
        when(mockEventContext.getEvent()).thenReturn(CqnService.EVENT_UPDATE);
        when(mockPersistenceService.run(any(CqnUpdate.class))).thenReturn(mockResult);
        Row externalWorkExperienceRow = RowImpl.row(externalWorkExperience);
        when(mockResult.first()).thenReturn(Optional.of(externalWorkExperienceRow));
        Mockito.doReturn(mockResult).when(mockProjectExperienceService).run(any(CqnSelect.class));
        final ArgumentCaptor<CqnUpdate> argumentUpdate = ArgumentCaptor.forClass(CqnUpdate.class);
    	CqnUpdate expected = Update.entity(Headers_.class).where(s -> s.ID().eq("Test-1")).data(expectedHeader);
    	this.classUnderTest.afterUpdateExternalWorkExperience(externalWorkExperience);
        verify(mockPersistenceService, times(1)).run(argumentUpdate.capture());
        assertEquals(expected.toJson().toString(), argumentUpdate.getValue().toJson().toString());
    }
    
    @Test
    @DisplayName("Verify if employee header is created after create of External Work Experience Skill Assignments")
    void testAfterCreateExternalWorkExperienceSkillAssignments() throws IOException {
    	ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID");
        externalWorkExperienceSkillAssignments.setProfileID("test-1");
        externalWorkExperienceSkillAssignments.setChangedAt(Instant.now());
        Headers expectedHeader = Headers.create();
        expectedHeader.setModifiedBy("System User");
        expectedHeader.setModifiedAt(externalWorkExperienceSkillAssignments.getChangedAt());
        when(mockEventContext.getEvent()).thenReturn(CqnService.EVENT_UPDATE);
        final ArgumentCaptor<CqnUpdate> argumentUpdate = ArgumentCaptor.forClass(CqnUpdate.class);
        when(mockPersistenceService.run(any(CqnUpdate.class))).thenReturn(mockResult);
    	CqnUpdate expected = Update.entity(Headers_.class).where(s -> s.ID().eq(externalWorkExperienceSkillAssignments.getProfileID())).data(expectedHeader);
    	this.classUnderTest.afterCreateExternalWorkExperienceSkillAssignments(externalWorkExperienceSkillAssignments);
        verify(mockPersistenceService, times(1)).run(argumentUpdate.capture());
        assertEquals(expected.toJson().toString(), argumentUpdate.getValue().toJson().toString());
    }
    
    @Test
    @DisplayName("Verify if employee header is updated after update of External Work Experience Skill Assignments")
    void testAfterUpdateExternalWorkExperienceSkillAssignments() throws IOException {
    	ExternalWorkExperienceSkillAssignments externalWorkExperienceSkillAssignments = ExternalWorkExperienceSkillAssignments.create("test-ID-2");
    	externalWorkExperienceSkillAssignments.setChangedAt(Instant.now());
    	externalWorkExperienceSkillAssignments.setProfileID("Test-1");
        Headers expectedHeader = Headers.create();
        expectedHeader.setModifiedBy("System User");
        expectedHeader.setModifiedAt(externalWorkExperienceSkillAssignments.getChangedAt());
        when(mockEventContext.getEvent()).thenReturn(CqnService.EVENT_UPDATE);
        when(mockPersistenceService.run(any(CqnUpdate.class))).thenReturn(mockResult);
        Row externalWorkExperienceSkillAssignmentsRow = RowImpl.row(externalWorkExperienceSkillAssignments);
        when(mockResult.first()).thenReturn(Optional.of(externalWorkExperienceSkillAssignmentsRow));
        Mockito.doReturn(mockResult).when(mockProjectExperienceService).run(any(CqnSelect.class));
        final ArgumentCaptor<CqnUpdate> argumentUpdate = ArgumentCaptor.forClass(CqnUpdate.class);
    	CqnUpdate expected = Update.entity(Headers_.class).where(s -> s.ID().eq("Test-1")).data(expectedHeader);
    	this.classUnderTest.afterUpdateExternalWorkExperienceSkillAssignments(externalWorkExperienceSkillAssignments);
        verify(mockPersistenceService, times(1)).run(argumentUpdate.capture());
        assertEquals(expected.toJson().toString(), argumentUpdate.getValue().toJson().toString());
    }
    
    @Test
    @DisplayName("Verify if employee header is updated after delete of Skill Assignments")
    void testAfterDeleteSkillAssignment() throws IOException {
        Headers expectedHeader = Headers.create();
        expectedHeader.setModifiedBy("System User");
        expectedHeader.setModifiedAt(Instant.parse("2023-02-14T18:56:55.707544Z"));
        when(mockCdsDeleteEventContext.keySet()).thenReturn(mockString);
        when(mockString.contains(anyString())).thenReturn(true);
        when(mockCdsDeleteEventContext.get("profileId")).thenReturn("test-1");
        when(mockCdsDeleteEventContext.get("changedAt")).thenReturn(Instant.parse("2023-02-14T18:56:55.707544Z"));
        when(mockEventContext.getEvent()).thenReturn(CqnService.EVENT_UPDATE);
        final ArgumentCaptor<CqnUpdate> argumentUpdate = ArgumentCaptor.forClass(CqnUpdate.class);
        when(mockPersistenceService.run(any(CqnUpdate.class))).thenReturn(mockResult);
    	CqnUpdate expected = Update.entity(Headers_.class).where(s -> s.ID().eq("test-1")).data(expectedHeader);
    	this.classUnderTest.afterDeleteSkillAssignment(mockCdsDeleteEventContext);
        verify(mockPersistenceService, times(1)).run(argumentUpdate.capture());
        assertEquals(expected.toJson().toString(), argumentUpdate.getValue().toJson().toString());
    }
    
    @Test
    @DisplayName("Verify if employee header is updated after delete of External Work Experience")
    void testAfterDeleteExternalWorkExperienceAssignment() throws IOException {
        Headers expectedHeader = Headers.create();
        expectedHeader.setModifiedBy("System User");
        expectedHeader.setModifiedAt(Instant.parse("2023-02-14T18:56:55.707544Z"));
        when(mockCdsDeleteEventContext.keySet()).thenReturn(mockString);
        when(mockString.contains(anyString())).thenReturn(true);
        when(mockCdsDeleteEventContext.get("profileId")).thenReturn("test-1");
        when(mockCdsDeleteEventContext.get("changedAt")).thenReturn(Instant.parse("2023-02-14T18:56:55.707544Z"));
        when(mockEventContext.getEvent()).thenReturn(CqnService.EVENT_UPDATE);
        final ArgumentCaptor<CqnUpdate> argumentUpdate = ArgumentCaptor.forClass(CqnUpdate.class);
        when(mockPersistenceService.run(any(CqnUpdate.class))).thenReturn(mockResult);
    	CqnUpdate expected = Update.entity(Headers_.class).where(s -> s.ID().eq("test-1")).data(expectedHeader);
    	this.classUnderTest.afterDeleteExternalWorkExperienceAssignment(mockCdsDeleteEventContext);
        verify(mockPersistenceService, times(1)).run(argumentUpdate.capture());
        assertEquals(expected.toJson().toString(), argumentUpdate.getValue().toJson().toString());
    }
    
    @Test
    @DisplayName("Verify if employee header is updated after delete of External Work Experience Skill Assignments")
    void testAfterDeleteExternalWorkExperienceSkillAssignment() throws IOException {
        Headers expectedHeader = Headers.create();
        expectedHeader.setModifiedBy("System User");
        expectedHeader.setModifiedAt(Instant.parse("2023-02-14T18:56:55.707544Z"));
        when(mockCdsDeleteEventContext.keySet()).thenReturn(mockString);
        when(mockString.contains(anyString())).thenReturn(true);
        when(mockCdsDeleteEventContext.get("profileId")).thenReturn("test-1");
        when(mockCdsDeleteEventContext.get("changedAt")).thenReturn(Instant.parse("2023-02-14T18:56:55.707544Z"));
        when(mockEventContext.getEvent()).thenReturn(CqnService.EVENT_UPDATE);
        final ArgumentCaptor<CqnUpdate> argumentUpdate = ArgumentCaptor.forClass(CqnUpdate.class);
        when(mockPersistenceService.run(any(CqnUpdate.class))).thenReturn(mockResult);
    	CqnUpdate expected = Update.entity(Headers_.class).where(s -> s.ID().eq("test-1")).data(expectedHeader);
    	this.classUnderTest.afterDeleteExternalWorkExperienceSkillAssignment(mockCdsDeleteEventContext);
        verify(mockPersistenceService, times(1)).run(argumentUpdate.capture());
        assertEquals(expected.toJson().toString(), argumentUpdate.getValue().toJson().toString());
    }
}
