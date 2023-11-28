package com.sap.c4p.rm.consultantprofile.handlers;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.apache.commons.io.output.ByteArrayOutputStream;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnStructuredTypeRef;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.draft.DraftCancelEventContext;
import com.sap.cds.services.draft.DraftNewEventContext;
import com.sap.cds.services.draft.DraftPatchEventContext;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.messages.Messages;
import com.sap.xs.audit.api.v2.AuditedDataSubject;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.auditlog.AuditLogUtil;
import com.sap.c4p.rm.consultantprofile.myresourceservice.validations.ProjectExperienceHeaderRoleValidator;
import com.sap.c4p.rm.consultantprofile.myresourceservice.validations.ProjectExperienceHeaderSkillValidator;
import com.sap.c4p.rm.consultantprofile.myresourceservice.validations.ProjectExperienceHeaderValidator;
import com.sap.c4p.rm.consultantprofile.utils.CommonEventHandlerUtil;
import com.sap.c4p.rm.consultantprofile.utils.CqnUtil;

import myresourcesservice.*;

class MyResourceServiceHandlerTest extends InitMocks {

    @Mock
    private CommonEventHandlerUtil mockCommonEventHandlerUtil;
    @Mock
    private DraftService mockMyResourceService;
    @Mock
    private Skills mockSkill;
    @Mock
    private Result mockResult;
    @Mock
    private ExternalWorkExperience mockExternalWorkExperience;
    @Mock
    private ProjectExperienceHeader mockProjectExperienceHeader;
    @Mock
    private CqnAnalyzer mockCqnAnalyzer;
    @Mock
    private AuditLogUtil mockAuditLogUtil;
    @Mock
    private EventContext mockEventContext;
    @Mock
    private Messages messages;
    @Mock
    private ProjectExperienceHeaderValidator mockProjectExperienceHeaderValidator;
    @Mock
    private ProjectExperienceHeaderSkillValidator mockProjectExperienceHeaderSkillValidator;
    @Mock
    private ProjectExperienceHeaderRoleValidator mockProjectExperienceHeaderRoleValidator;
    @Mock
    private DraftPatchEventContext mockDraftPatchEventContext;
    @Mock
    public Roles mockRole;
    @Mock
    private Optional<RoleMasterList> mockOptionalRoleMasterList;
    @Mock
    private CqnUpdate mockCqnUpdate;
    @Mock
    private CqnDelete mockCqnDelete;
    @Mock
    private AnalysisResult mockAnalysisResult;
    @Mock
    private CqnStructuredTypeRef mockCqnStructuredTypeRef;
    @Mock
    private Profiles mockProfile;
    @Mock
    private RoleMasterList mockRoleMasterList;
    @Mock
    private AuditedDataSubject mockAuditedDataSubject;
    @Mock
    private DraftCancelEventContext mockDraftCancelEventContext;
    @Mock
    private CqnUtil mockCqnUtil;
    @Mock
    private DraftNewEventContext mockDraftNewEventContext;
    @Mock
    private SkillMasterListAll mockSkillMasterListAll;
    @Mock
    private ExternalWorkExperienceSkills mockExternalWorkExperienceSkills;
    @Mock
    private Skills mockSkill2;
    @Mock
    public Roles mockRole2;
    @Mock
    private ProjectExperienceHeader mockProjectExperienceHeader2;
    @Mock
    private CqnInsert mockCqnInsert;
    @Mock
    private PeriodicAvailability periodicAvailability;
    @Mock
    private Utilization utilization;
    @Mock
    private MyProjectExperienceServiceEventHandler mockMyProjectExperienceServiceEventHandler;

    List<ExternalWorkExperience> externalWorkExperienceList;
    @Autowired
    @InjectMocks
    MyResourceServiceHandler classUnderTest;

    private static final String ID = "ID";
    private static final String DATA_SUBJECT_ROLE = "Project Team Member";
    private static final String DATA_SUBJECT_EMAIL = "dataSubject@sap.com";
    private static final String DATA_SUBJECT_ID = "dataSubject.test";
    private static final String ROLE_ASSIGNMENT_OBJECT_TYPE = "Roles";
    private static final String SKILL_ASSIGNMENT_OBJECT_TYPE = "Skills";
    private static final String PROJECT_EXPERIENCE_SERVICE_IDENTIFIER = "MyResources";
    private static final String CREATE_OPERATION = "create";
    private static final String UPDATE_OPERATION = "update";
    private static final String DELETE_OPERATION = "delete";

    @BeforeEach
    public void setUp() {
        this.externalWorkExperienceList = Collections.singletonList(mockExternalWorkExperience);
        this.mockProjectExperienceHeader.setExternalWorkExperience(externalWorkExperienceList);
        this.classUnderTest.myResourceService = mockMyResourceService;
        this.classUnderTest.analyzer = mockCqnAnalyzer;
        this.classUnderTest.auditLogUtil = mockAuditLogUtil;
        this.classUnderTest.myProjectExperienceServiceEventHandler = mockMyProjectExperienceServiceEventHandler;
    }

    @Test
    @DisplayName("Test Periodic Utilization Data formed correctly")
    void readPeriodicUtilizationData() {
        CdsReadEventContext cdsReadEventContext = CdsReadEventContext.create(PeriodicUtilization_.CDS_NAME);
        classUnderTest.readPeriodicUtilizationData(cdsReadEventContext);
        verify(this.mockCommonEventHandlerUtil, times(1)).setLocalisedDataForPeriodicUtilization(cdsReadEventContext,
                PeriodicUtilization.MONTH_YEAR, PeriodicUtilization.CALMONTH);
    }

    @Test
    @DisplayName("Test Periodic Availability Data formed correctly")
    void readPeriodicAvailabilityData() {
        CdsReadEventContext cdsReadEventContext = CdsReadEventContext.create(PeriodicAvailability_.CDS_NAME);
        classUnderTest.readPeriodicAvailabilityMonthlyData(cdsReadEventContext);
        verify(this.mockCommonEventHandlerUtil, times(1)).setLocalisedDataForPeriodicAvailability(cdsReadEventContext,
                PeriodicAvailability.MONTH_YEAR, PeriodicAvailability.CALMONTH);
    }

    @Test
    @DisplayName("Test InternalWE#convertedCapacityInHours Data formed correctly")
    void testReadInternalWEData() {
        CdsReadEventContext cdsReadEventContext = CdsReadEventContext.create(InternalWorkExperience_.CDS_NAME);
        classUnderTest.afterReadInternalWorkExperience(cdsReadEventContext);
        verify(this.mockCommonEventHandlerUtil, times(1)).setLocalInternalWEConvertedAssigned(cdsReadEventContext,
                InternalWorkExperience.CONVERTED_ASSIGNED_CAPACITY);
    }

    @Test
    @DisplayName("Test comma separated skills data formed correctly")
    void testAfterReadSetCommaSeparatedSkills() {
        SkillMasterListAll skill = SkillMasterListAll.create();
        skill.setId(UUID.randomUUID().toString());
        skill.setName(UUID.randomUUID().toString());
        skill.setDescription(UUID.randomUUID().toString());
        Skills skillAssignment = Skills.create();
        skillAssignment.setId(UUID.randomUUID().toString());
        skillAssignment.setSkill(skill);
        skillAssignment.setEmployeeId(ID);
        List<Skills> skillList = new ArrayList<Skills>();
        skillList.add(skillAssignment);
        ProjectExperienceHeader projectExperienceHeader = ProjectExperienceHeader.create();
        projectExperienceHeader.setId(ID);
        this.classUnderTest.myResourceService = mockMyResourceService;
        CdsReadEventContext cdsReadEventContext = CdsReadEventContext.create(ProjectExperienceHeader_.CDS_NAME);
        Mockito.doReturn(mockResult).when(mockMyResourceService).run(any(CqnSelect.class));
        Mockito.doReturn(skillList).when(mockResult).listOf(Skills.class);
        classUnderTest.afterReadSetCommaSeparatedSkills(cdsReadEventContext, Arrays.asList(projectExperienceHeader));
        Assertions.assertEquals(projectExperienceHeader.getCommaSeparatedSkills(), skill.getName());
    }

    @Test
    @DisplayName("Test comma separated skills with null result")
    void testAfterReadSetCommaSeparatedSkillsNullCheck() {
        ProjectExperienceHeader projectExperienceHeader = ProjectExperienceHeader.create();
        projectExperienceHeader.setId(ID);
        this.classUnderTest.myResourceService = mockMyResourceService;
        CdsReadEventContext cdsReadEventContext = CdsReadEventContext.create(ProjectExperienceHeader_.CDS_NAME);
        Mockito.doReturn(mockResult).when(mockMyResourceService).run(any(CqnSelect.class));
        Mockito.doReturn(null).when(mockResult).listOf(Skills.class);
        classUnderTest.afterReadSetCommaSeparatedSkills(cdsReadEventContext, Arrays.asList(projectExperienceHeader));
        Assertions.assertEquals("", projectExperienceHeader.getCommaSeparatedSkills());
    }
    
    @Test
    @DisplayName("Test get project role data from skill assignments for single employee")
    void testProjectSkillsFromRoleAssignmentsSingleEmployee() {
    	Map<String, List<Skills>> emptySkillAssignments = new HashMap<String, List<Skills>>();
        SkillMasterListAll skill = SkillMasterListAll.create();
        skill.setId(UUID.randomUUID().toString());
        skill.setName(UUID.randomUUID().toString());
        skill.setDescription(UUID.randomUUID().toString());
        Skills skillAssignment1 = Skills.create();
        skillAssignment1.setId(UUID.randomUUID().toString());
        skillAssignment1.setSkill(skill);
        skillAssignment1.setEmployeeId("1234");
        Skills skillAssignment2 = Skills.create();
        skillAssignment2.setId(UUID.randomUUID().toString());
        skillAssignment2.setSkill(skill);
        skillAssignment2.setEmployeeId("1234");
        List<Skills> skillsList = new ArrayList<Skills>();
        skillsList.add(skillAssignment1);
        skillsList.add(skillAssignment2);
        emptySkillAssignments.put("1234", new ArrayList<Skills>());
        this.classUnderTest.myResourceService = mockMyResourceService;
        Mockito.doReturn(mockResult).when(mockMyResourceService).run(any(CqnSelect.class));
        Mockito.doReturn(skillsList).when(mockResult).listOf(Skills.class);
        Map<String, List<Skills>> actualSkills = classUnderTest.getExpandedDataOfSkillAssignmentsForMultipleEmployees(emptySkillAssignments);
        Map<String, List<Skills>> expectedSkillAssignments = new HashMap<String, List<Skills>>();;
        expectedSkillAssignments.put("1234", List.of(skillAssignment1, skillAssignment2));
        Assertions.assertEquals(actualSkills, expectedSkillAssignments);
        verify(mockMyResourceService, times(1)).run(any(CqnSelect.class));
    }

    @Test
    @DisplayName("Test get project role data from skill assignments for multiple employee")
    void testProjectSkillsFromRoleAssignmentsMultipleEmployee() {
    	Map<String, List<Skills>> emptySkillAssignments = new HashMap<String, List<Skills>>();
        SkillMasterListAll skill = SkillMasterListAll.create();
        skill.setId(UUID.randomUUID().toString());
        skill.setName(UUID.randomUUID().toString());
        skill.setDescription(UUID.randomUUID().toString());
        Skills skillAssignment1 = Skills.create();
        skillAssignment1.setId(UUID.randomUUID().toString());
        skillAssignment1.setSkill(skill);
        skillAssignment1.setEmployeeId("1234");
        Skills skillAssignment2 = Skills.create();
        skillAssignment2.setId(UUID.randomUUID().toString());
        skillAssignment2.setSkill(skill);
        skillAssignment2.setEmployeeId("1235");
        List<Skills> skillsList = new ArrayList<Skills>();
        skillsList.add(skillAssignment1);
        skillsList.add(skillAssignment2);
        emptySkillAssignments.put("1234", new ArrayList<Skills>());
        emptySkillAssignments.put("1235", new ArrayList<Skills>());
        this.classUnderTest.myResourceService = mockMyResourceService;
        Mockito.doReturn(mockResult).when(mockMyResourceService).run(any(CqnSelect.class));
        Mockito.doReturn(skillsList).when(mockResult).listOf(Skills.class);
        Map<String, List<Skills>> actualSkills = classUnderTest.getExpandedDataOfSkillAssignmentsForMultipleEmployees(emptySkillAssignments);
        Map<String, List<Skills>> expectedSkillAssignments = new HashMap<String, List<Skills>>();;
        expectedSkillAssignments.put("1234", List.of(skillAssignment1));
        expectedSkillAssignments.put("1235", List.of(skillAssignment2));
        Assertions.assertEquals(actualSkills, expectedSkillAssignments);
        verify(mockMyResourceService, times(1)).run(any(CqnSelect.class));
    }

    @Test
    @DisplayName("Test null skill assignments for employee with no skills")
    void testProjectSkillsEmpty() {
    	Map<String, List<Skills>> emptySkillAssignments = new HashMap<String, List<Skills>>();
        this.classUnderTest.myResourceService = mockMyResourceService;
        Mockito.doReturn(mockResult).when(mockMyResourceService).run(any(CqnSelect.class));
        List<Skills> skillsList = new ArrayList<Skills>();
        Mockito.doReturn(skillsList).when(mockResult).listOf(Skills.class);
        emptySkillAssignments.put("1234", new ArrayList<Skills>());
        Map<String, List<Skills>> actualSkills = classUnderTest.getExpandedDataOfSkillAssignmentsForMultipleEmployees(emptySkillAssignments);
        Assertions.assertEquals(actualSkills, emptySkillAssignments);
        verify(mockMyResourceService, times(1)).run(any(CqnSelect.class));
    }
    
    @Test
    @DisplayName("Test empty skill assignments for employee with no skills")
    void testProjectSkillsNull() {
    	Map<String, List<Skills>> emptySkillAssignments = new HashMap<String, List<Skills>>();
        this.classUnderTest.myResourceService = mockMyResourceService;
        Mockito.doReturn(mockResult).when(mockMyResourceService).run(any(CqnSelect.class));
        Mockito.doReturn(null).when(mockResult).listOf(Skills.class);
        emptySkillAssignments.put("1234", new ArrayList<Skills>());
        Map<String, List<Skills>> actualSkills = classUnderTest.getExpandedDataOfSkillAssignmentsForMultipleEmployees(emptySkillAssignments);
        Assertions.assertEquals(actualSkills, emptySkillAssignments);
        verify(mockMyResourceService, times(1)).run(any(CqnSelect.class));
    }


    @Test
    @DisplayName("Test comma separated roles data formed correctly in ProjectExperienceHeader")
    void testAfterReadSetCommaSeparatedRoles() {
        RoleMasterList Role = RoleMasterList.create();
        Role.setId(UUID.randomUUID().toString());
        Role.setName(UUID.randomUUID().toString());
        Role.setDescription(UUID.randomUUID().toString());
        Roles RoleAssignment = Roles.create();
        RoleAssignment.setId(UUID.randomUUID().toString());
        RoleAssignment.setEmployeeId(UUID.randomUUID().toString());
        RoleAssignment.setRole(Role);
        List<Roles> RoleList = new ArrayList<Roles>();
        RoleList.add(RoleAssignment);
        ProjectExperienceHeader projectExperienceHeader = ProjectExperienceHeader.create();
        projectExperienceHeader.setId(RoleAssignment.getEmployeeId());
        this.classUnderTest.myResourceService = mockMyResourceService;
        CdsReadEventContext cdsReadEventContext = CdsReadEventContext.create(ProjectExperienceHeader_.CDS_NAME);
        Mockito.doReturn(mockResult).when(mockMyResourceService).run(any(CqnSelect.class));
        Mockito.doReturn(RoleList).when(mockResult).listOf(Roles.class);
        classUnderTest.afterReadSetCommaSeparatedRoles(cdsReadEventContext, Arrays.asList(projectExperienceHeader));
        Assertions.assertEquals(projectExperienceHeader.getCommaSeparatedRoles(), Role.getName());
    }

    @Test
    @DisplayName("Test comma separated roles with null result in ProjectExperienceHeader")
    void testAfterReadSetCommaSeparatedRolesNullCheck() {
        ProjectExperienceHeader projectExperienceHeader = ProjectExperienceHeader.create();
        projectExperienceHeader.setId(ID);
        this.classUnderTest.myResourceService = mockMyResourceService;
        CdsReadEventContext cdsReadEventContext = CdsReadEventContext.create(ProjectExperienceHeader_.CDS_NAME);
        Mockito.doReturn(mockResult).when(mockMyResourceService).run(any(CqnSelect.class));
        Mockito.doReturn(null).when(mockResult).listOf(Roles.class);
        classUnderTest.afterReadSetCommaSeparatedRoles(cdsReadEventContext, Arrays.asList(projectExperienceHeader));
        Assertions.assertEquals("", projectExperienceHeader.getCommaSeparatedRoles());
    }
    
    @Test
    @DisplayName("Test get project role data from role assignments for single employee")
    void testProjectRolesFromRoleAssignmentsSingleEmployee() {
    	Map<String, List<Roles>> emptyRoleAssignments = new HashMap<String, List<Roles>>();
        RoleMasterList Role = RoleMasterList.create();
        Role.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        Role.setName("name");
        Role.setDescription("desc");
        Roles RoleAssignment1 = Roles.create();
        RoleAssignment1.setId("b08aabdf-6dcb-4df7-b319-b440f073e6d1");
        RoleAssignment1.setEmployeeId("1234");
        RoleAssignment1.setRole(Role);
        Roles RoleAssignment2 = Roles.create();
        RoleAssignment2.setId("b08aabdf-6dcb-4df7-b319-b440f073e7d2");
        RoleAssignment2.setEmployeeId("1234");
        RoleAssignment2.setRole(Role);
        List<Roles> RoleList = new ArrayList<Roles>();
        RoleList.add(RoleAssignment1);
        RoleList.add(RoleAssignment2);
        emptyRoleAssignments.put("1234", new ArrayList<Roles>());
        this.classUnderTest.myResourceService = mockMyResourceService;
        Mockito.doReturn(mockResult).when(mockMyResourceService).run(any(CqnSelect.class));
        Mockito.doReturn(RoleList).when(mockResult).listOf(Roles.class);
        Map<String, List<Roles>> actualRoles = classUnderTest.getExpandedDataOfRoleAssignmentsForMultipleEmployees(emptyRoleAssignments);
        Map<String, List<Roles>> expectedRoleAssignments = new HashMap<String, List<Roles>>();;
        expectedRoleAssignments.put("1234", List.of(RoleAssignment1, RoleAssignment2));
        Assertions.assertEquals(actualRoles, expectedRoleAssignments);
        verify(mockMyResourceService, times(1)).run(any(CqnSelect.class));
    }

    @Test
    @DisplayName("Test get project role data from role assignments for multiple employee")
    void testProjectRolesFromRoleAssignmentsMultipleEmployee() {
    	Map<String, List<Roles>> emptyRoleAssignments = new HashMap<String, List<Roles>>();
        RoleMasterList Role = RoleMasterList.create();
        Role.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        Role.setName("name");
        Role.setDescription("desc");
        Roles RoleAssignment1 = Roles.create();
        RoleAssignment1.setId("b08aabdf-6dcb-4df7-b319-b440f073e6d1");
        RoleAssignment1.setEmployeeId("1234");
        RoleAssignment1.setRole(Role);
        Roles RoleAssignment2 = Roles.create();
        RoleAssignment2.setId("b08aabdf-6dcb-4df7-b319-b440f073e7d2");
        RoleAssignment2.setEmployeeId("1235");
        RoleAssignment2.setRole(Role);
        List<Roles> RoleList = new ArrayList<Roles>();
        RoleList.add(RoleAssignment1);
        RoleList.add(RoleAssignment2);
        emptyRoleAssignments.put("1234", new ArrayList<Roles>());
        emptyRoleAssignments.put("1235", new ArrayList<Roles>());
        this.classUnderTest.myResourceService = mockMyResourceService;
        Mockito.doReturn(mockResult).when(mockMyResourceService).run(any(CqnSelect.class));
        Mockito.doReturn(RoleList).when(mockResult).listOf(Roles.class);
        Map<String, List<Roles>> actualRoles = classUnderTest.getExpandedDataOfRoleAssignmentsForMultipleEmployees(emptyRoleAssignments);
        Map<String, List<Roles>> expectedRoleAssignments = new HashMap<String, List<Roles>>();;
        expectedRoleAssignments.put("1234", List.of(RoleAssignment1));
        expectedRoleAssignments.put("1235", List.of(RoleAssignment2));
        Assertions.assertEquals(actualRoles, expectedRoleAssignments);
        verify(mockMyResourceService, times(1)).run(any(CqnSelect.class));
    }

    @Test
    @DisplayName("Test null role assignments for employee with no roles")
    void testProjectRolesEmpty() {
    	Map<String, List<Roles>> emptyRoleAssignments = new HashMap<String, List<Roles>>();
        this.classUnderTest.myResourceService = mockMyResourceService;
        Mockito.doReturn(mockResult).when(mockMyResourceService).run(any(CqnSelect.class));
        List<Roles> RoleList = new ArrayList<Roles>();
        Mockito.doReturn(RoleList).when(mockResult).listOf(Roles.class);
        emptyRoleAssignments.put("1234", new ArrayList<Roles>());
        Map<String, List<Roles>> actualRoles = classUnderTest.getExpandedDataOfRoleAssignmentsForMultipleEmployees(emptyRoleAssignments);
        Assertions.assertEquals(actualRoles, emptyRoleAssignments);
        verify(mockMyResourceService, times(1)).run(any(CqnSelect.class));
    }
    
    @Test
    @DisplayName("Test empty role assignments for employee with no roles")
    void testProjectRolesNull() {
    	Map<String, List<Roles>> emptyRoleAssignments = new HashMap<String, List<Roles>>();
        this.classUnderTest.myResourceService = mockMyResourceService;
        Mockito.doReturn(mockResult).when(mockMyResourceService).run(any(CqnSelect.class));
        Mockito.doReturn(null).when(mockResult).listOf(Roles.class);
        emptyRoleAssignments.put("1234", new ArrayList<Roles>());
        Map<String, List<Roles>> actualRoles = classUnderTest.getExpandedDataOfRoleAssignmentsForMultipleEmployees(emptyRoleAssignments);
        Assertions.assertEquals(actualRoles, emptyRoleAssignments);
        verify(mockMyResourceService, times(1)).run(any(CqnSelect.class));
    }

    @Test
    @DisplayName("Test format of comma seprated roles")
    void testComputeCommaSeparatedRoles() {
        RoleMasterList Role1 = RoleMasterList.create();
        Role1.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        Role1.setName("java");
        Roles RoleAssignment1 = Roles.create();
        RoleAssignment1.setRole(Role1);
        RoleMasterList Role2 = RoleMasterList.create();
        Role2.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        Role2.setName("Nodejs");
        Roles RoleAssignment2 = Roles.create();
        RoleAssignment2.setRole(Role2);
        List<Roles> RoleList = new ArrayList<Roles>();
        RoleList.add(RoleAssignment1);
        RoleList.add(RoleAssignment2);
        String actualCommaRoles = classUnderTest.computeCommaSeparatedRoles(RoleList);
        Assertions.assertEquals("Nodejs, java", actualCommaRoles);
    }

    @Test
    @DisplayName("Test format of comma seprated roles when role name is blank: negative")
    void testComputeCommaSeparatedRolesForNull() {
        RoleMasterList Role1 = RoleMasterList.create();
        Role1.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        Role1.setName("");
        Roles RoleAssignment1 = Roles.create();
        RoleAssignment1.setRole(Role1);
        RoleMasterList Role2 = RoleMasterList.create();
        Role2.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        Role2.setName("");
        Roles RoleAssignment2 = Roles.create();
        RoleAssignment2.setRole(Role2);
        List<Roles> RoleList = new ArrayList<Roles>();
        RoleList.add(RoleAssignment1);
        RoleList.add(RoleAssignment2);
        String actualCommaRoles = classUnderTest.computeCommaSeparatedRoles(RoleList);
        Assertions.assertEquals(0, actualCommaRoles.length());
    }

    @Test
    @DisplayName("Verify if Before Upsert event invokes the validation of MyProjectExperienceHeader")
    void testBeforeUpsertMyProjectExperienceHeader() {
        when(this.mockMyResourceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(ProjectExperienceHeader.class)).thenReturn(Optional.of(mockProjectExperienceHeader));
        // action
        this.classUnderTest.beforeUpsertProjectExperienceHeader(mockEventContext, mockProjectExperienceHeader);
        verify(this.messages, times(1)).throwIfError();
        verify(this.mockProjectExperienceHeaderValidator, times(1))
                .validateProjectExperienceHeaderProperty(mockProjectExperienceHeader);
    }

    @Test
    @DisplayName("Check If RoleID is being added with invalid length during Draft Patch Event")
    void testBeforeDraftPatchForRoles() {
        when(this.mockProjectExperienceHeaderRoleValidator.checkInputFieldSize(any(Roles.class))).thenReturn(false);
        this.classUnderTest.beforeDraftPatchForRoles(mockDraftPatchEventContext, mockRole);
        verify(this.messages, times(1)).throwIfError();
    }

    @Test
    @DisplayName("Check If RoleID retrieved Draft Patch Event is empty")
    void testBeforeDraftPatchForRolesEmpty() {
        Roles role1 = Struct.create(Roles.class);
        Map<String, Object> roleIDMap1 = new HashMap<>();
        roleIDMap1.put(ID, UUID.randomUUID().toString());
        role1.setRole(roleIDMap1);
        Optional<Roles> mockOptRole = Optional.of(role1);

        when(mockResult.first(Roles.class)).thenReturn(mockOptRole);
        when(mockOptionalRoleMasterList.isPresent()).thenReturn(false);
        Roles role = Struct.create(Roles.class);
        role.setRoleId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        when(this.mockProjectExperienceHeaderRoleValidator.checkInputFieldSize(role)).thenReturn(true);
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftPatchEventContext.getCqn()).thenReturn(mockCqnUpdate);
        when(mockCqnUpdate.ref()).thenReturn(mockCqnStructuredTypeRef);
        when(mockResult.first(RoleMasterList.class)).thenReturn(mockOptionalRoleMasterList);
        Map<String, Object> roleIDMap = new HashMap<>();
        roleIDMap.put(ID, UUID.randomUUID().toString());
        when(mockAnalysisResult.targetKeys()).thenReturn(roleIDMap);
        when(mockMyResourceService.run(any(CqnSelect.class))).thenReturn(mockResult);

        this.classUnderTest.beforeDraftPatchForRoles(mockDraftPatchEventContext, role);
        verify(this.messages, times(1)).throwIfError();
    }

    @Test
    @DisplayName("Pass valid RoleID during Draft Patch Event and check for audit log call")
    void testBeforeDraftPatchForRoles1() {
        when(mockProjectExperienceHeaderRoleValidator.checkInputFieldSize(any(Roles.class))).thenReturn(false);
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftPatchEventContext.getCqn()).thenReturn(mockCqnUpdate);
        when(mockCqnUpdate.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> roleIDMap = new HashMap<>();
        roleIDMap.put(ID, UUID.randomUUID().toString());
        when(mockAnalysisResult.targetKeys()).thenReturn(roleIDMap);
        when(mockMyResourceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(RoleMasterList.class)).thenReturn(Optional.of(mockRoleMasterList));
        MyResourceServiceHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(mockRole).when(classUnderTestSpy).getExpandedDataOfRoleAssignments(any(), anyBoolean());
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTestSpy).getAuditedDataSubject(any(), any(), any());
        Mockito.doReturn(true).when(classUnderTestSpy).isValidGuid(any());
        HashMap<String, String> createEntity = new HashMap<>();
        createEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(createEntity).when(classUnderTestSpy).prepareRoleEntity(any(), any(), any());
        when(mockRole.getProfile()).thenReturn(mockProfile);
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);
        classUnderTestSpy.beforeDraftPatchForRoles(mockDraftPatchEventContext, mockRole);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockDraftPatchEventContext,
                ROLE_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, createEntity, null,
                mockAuditedDataSubject, CREATE_OPERATION);
    }

    @Test
    @DisplayName("Pass valid RoleID during Draft Patch Event and check for audit log call")
    void testBeforeDraftPatchForRoles2() {
        when(mockProjectExperienceHeaderRoleValidator.checkInputFieldSize(any(Roles.class))).thenReturn(false);
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftPatchEventContext.getCqn()).thenReturn(mockCqnUpdate);
        when(mockCqnUpdate.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> roleIDMap = new HashMap<>();
        roleIDMap.put(ID, UUID.randomUUID().toString());
        when(mockAnalysisResult.targetKeys()).thenReturn(roleIDMap);
        when(mockMyResourceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(RoleMasterList.class)).thenReturn(Optional.of(mockRoleMasterList));
        MyResourceServiceHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(mockRole).when(classUnderTestSpy).getExpandedDataOfRoleAssignments(any(), anyBoolean());
        when(mockRole.getRole()).thenReturn(mockRoleMasterList);
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTestSpy).getAuditedDataSubject(any(), any(), any());
        Mockito.doReturn(true).when(classUnderTestSpy).isValidGuid(any());
        HashMap<String, String> createEntity = new HashMap<>();
        createEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(createEntity).when(classUnderTestSpy).prepareRoleEntity(any(), any(), any());
        when(mockRole.getProfile()).thenReturn(mockProfile);
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);
        classUnderTestSpy.beforeDraftPatchForRoles(mockDraftPatchEventContext, mockRole);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockDraftPatchEventContext,
                ROLE_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, createEntity, createEntity,
                mockAuditedDataSubject, UPDATE_OPERATION);
    }

    @DisplayName("Verify if attachment After handler invokes decompression")
    @Test
    void testAttachmentValidationAfterHandler() throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        Path testFilePath = Paths.get("src/test/resources/test-attachments/test-resume.pdf");
        byte[] inputArray = Files.readAllBytes(testFilePath);
        output.write(inputArray);
        Attachment attachment = Attachment.create();
        attachment.setContent(output.toInputStream());
        attachment.setFileName("test-resume.pdf");
        this.classUnderTest.afterAttachmentDownload(attachment);
        assertNotNull(attachment.getContent());
        output.close();
    }

    @Test
    @DisplayName("change draft with too long skill id should fail")
    void testRejectTooLongSkillIds() {
        when(this.mockProjectExperienceHeaderSkillValidator.checkInputFieldSize(any()))
                .thenAnswer(invocationOnMock -> this.messages.error("test"));
        Skills skillAssignment = Skills.create();
        skillAssignment.setSkillId("too-long-for-a-normal-uuid-so-it-should-fail");
        this.classUnderTest.rejectTooLongSkillIds(skillAssignment);
        verify(this.messages, times(1)).error("test");
    }

    @Test
    @DisplayName("pass valid SkillID+ProficiencyLevelID and check for the audit log call")
    void testBeforeDraftPatchForSkill() {
        // Mock Profile
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);

        // Mock Master Data
        SkillMasterListAll skill = SkillMasterListAll.create();
        skill.setId(UUID.randomUUID().toString());
        skill.setName(UUID.randomUUID().toString());
        skill.setDescription(UUID.randomUUID().toString());
        ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
        proficiencyLevel.setId(UUID.randomUUID().toString());
        proficiencyLevel.setName(UUID.randomUUID().toString());
        proficiencyLevel.setDescription(UUID.randomUUID().toString());
        proficiencyLevel.setRank(2);

        // Mock Old Data
        Skills oldSkillAssignment = Skills.create();
        oldSkillAssignment.setId(UUID.randomUUID().toString());
        oldSkillAssignment.setSkill(skill);
        oldSkillAssignment.setProficiencyLevel(proficiencyLevel);
        oldSkillAssignment.setProfile(mockProfile);

        // Mock CQN Analyzer
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftPatchEventContext.getCqn()).thenReturn(mockCqnUpdate);
        when(mockCqnUpdate.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> skillIDMap = new HashMap<>();
        skillIDMap.put(ID, oldSkillAssignment.getId());
        when(mockAnalysisResult.targetKeys()).thenReturn(skillIDMap);

        // Mock Master Data Queries
        when(mockMyResourceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(SkillMasterListAll.class)).thenReturn(Optional.of(skill));
        when(mockResult.first(ProficiencyLevels.class)).thenReturn(Optional.of(proficiencyLevel));

        // Mock internal methods of CUT
        MyResourceServiceHandler classUnderTestSpy = spy(classUnderTest);
        doReturn(oldSkillAssignment).when(classUnderTestSpy).getExpandedDataOfSkillAssignments(any(), anyBoolean());
        doReturn(mockAuditedDataSubject).when(classUnderTestSpy).getAuditedDataSubject(any(), any(), any());
        doReturn(true).when(classUnderTestSpy).isValidGuid(any());

        // input skill: skillID + proficiencyID
        Skills skillAssignment = Skills.create();
        skillAssignment.setSkillId(skill.getId());
        skillAssignment.setProficiencyLevelId(proficiencyLevel.getId());

        // output audit log entity
        HashMap<String, String> audit = new HashMap<>();
        audit.put("name", skill.getName());
        audit.put("description", skill.getDescription());
        audit.put("proficiencyLevelName", proficiencyLevel.getName());
        audit.put("proficiencyLevelDescription", proficiencyLevel.getDescription());
        audit.put("proficiencyLevel", proficiencyLevel.getRank().toString());

        classUnderTestSpy.beforeDraftPatchForSkills(mockDraftPatchEventContext, skillAssignment);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockDraftPatchEventContext,
                SKILL_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, audit, audit,
                mockAuditedDataSubject, UPDATE_OPERATION);
    }

    @Test
    @DisplayName("pass valid ProficiencyLevelID and check for the audit log call")
    void testBeforeDraftPatchForSkillLevelOnly() {
        // Mock Profile
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);

        // Mock Master Data
        SkillMasterListAll skill = SkillMasterListAll.create();
        skill.setId(UUID.randomUUID().toString());
        skill.setName(UUID.randomUUID().toString());
        skill.setDescription(UUID.randomUUID().toString());
        ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
        proficiencyLevel.setId(UUID.randomUUID().toString());
        proficiencyLevel.setName(UUID.randomUUID().toString());
        proficiencyLevel.setDescription(UUID.randomUUID().toString());
        proficiencyLevel.setRank(2);

        // Mock Old Data
        Skills oldSkillAssignment = Skills.create();
        oldSkillAssignment.setId(UUID.randomUUID().toString());
        oldSkillAssignment.setSkill(skill);
        oldSkillAssignment.setProficiencyLevel(proficiencyLevel);
        oldSkillAssignment.setProfile(mockProfile);

        // Mock CQN Analyzer
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftPatchEventContext.getCqn()).thenReturn(mockCqnUpdate);
        when(mockCqnUpdate.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> skillIDMap = new HashMap<>();
        skillIDMap.put(ID, oldSkillAssignment.getId());
        when(mockAnalysisResult.targetKeys()).thenReturn(skillIDMap);

        // Mock Master Data Queries
        when(mockMyResourceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(SkillMasterListAll.class)).thenReturn(Optional.of(skill));
        when(mockResult.first(ProficiencyLevels.class)).thenReturn(Optional.of(proficiencyLevel));

        // Mock internal methods of CUT
        MyResourceServiceHandler classUnderTestSpy = spy(classUnderTest);
        doReturn(oldSkillAssignment).when(classUnderTestSpy).getExpandedDataOfSkillAssignments(any(), anyBoolean());
        doReturn(mockAuditedDataSubject).when(classUnderTestSpy).getAuditedDataSubject(any(), any(), any());
        doReturn(true).when(classUnderTestSpy).isValidGuid(any());

        // input skill: skillID + proficiencyID
        Skills skillAssignment = Skills.create();
        skillAssignment.setProficiencyLevelId(proficiencyLevel.getId());

        // output audit log entity
        HashMap<String, String> audit = new HashMap<>();
        audit.put("proficiencyLevelName", proficiencyLevel.getName());
        audit.put("proficiencyLevelDescription", proficiencyLevel.getDescription());
        audit.put("proficiencyLevel", proficiencyLevel.getRank().toString());

        classUnderTestSpy.beforeDraftPatchForSkills(mockDraftPatchEventContext, skillAssignment);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockDraftPatchEventContext,
                SKILL_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, audit, audit,
                mockAuditedDataSubject, UPDATE_OPERATION);
    }

    @Test
    @DisplayName("Verify if populateExternalWorkExperienceSkillsWithParentIDData invokes getRootIDForDraftNewEvent in cqnUtil")
    void testPopulateExternalWorkExperienceSkillsWithParentIDData() {
        when(mockDraftNewEventContext.getCqn()).thenReturn(mockCqnInsert);
        classUnderTest.populateExternalWorkExperienceSkillWithParentIDData(mockExternalWorkExperienceSkills,
                mockDraftNewEventContext);
        verify(this.mockCqnUtil, times(1)).getRootKey(mockDraftNewEventContext, mockCqnInsert, "ID");
    }

    @Test
    @DisplayName("Verify draft cancel event for my project experience header update scenario")
    void beforeDraftCancelForMyProjectExperienceHeader() {
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftCancelEventContext.getCqn()).thenReturn(mockCqnDelete);
        when(mockCqnDelete.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> myProjectExperienceHeaderIDMap = new HashMap<>();
        myProjectExperienceHeaderIDMap.put(ID, UUID.randomUUID().toString());
        when(mockAnalysisResult.targetKeys()).thenReturn(myProjectExperienceHeaderIDMap);
        when(mockMyResourceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(ProjectExperienceHeader.class)).thenReturn(Optional.of(mockProjectExperienceHeader));
        when(mockProjectExperienceHeader.getRoles()).thenReturn(Collections.singletonList(mockRole));
        when(mockRole.size()).thenReturn(1);
        when(mockRole.getId()).thenReturn(UUID.randomUUID().toString());
        when(mockRole.getRoleId()).thenReturn(UUID.randomUUID().toString());
        when(mockProjectExperienceHeader.getSkills()).thenReturn(Collections.singletonList(mockSkill));
        when(mockSkill.size()).thenReturn(1);
        when(mockSkill.getId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill.getSkillId()).thenReturn(UUID.randomUUID().toString());
        MyResourceServiceHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTestSpy).getAuditedDataSubject(any(), any(), any());
        Mockito.doReturn(mockSkill).when(classUnderTestSpy).getExpandedDataOfSkillAssignments(any(), anyBoolean());
        Mockito.doReturn(mockRole).when(classUnderTestSpy).getExpandedDataOfRoleAssignments(any(), anyBoolean());
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillsEntity(any(), any());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillsEntity(any());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareRoleEntity(any(), any(), any());
        when(mockProjectExperienceHeader.getProfile()).thenReturn(mockProfile);
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);
        classUnderTestSpy.beforeDraftCancelForMyProjectExperienceHeader(mockDraftCancelEventContext);
        verify(mockAuditLogUtil, never()).logDataModificationAuditMessage(mockDraftCancelEventContext,
                SKILL_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, UPDATE_OPERATION);
        verify(mockAuditLogUtil, never()).logDataModificationAuditMessage(mockDraftCancelEventContext,
                ROLE_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, UPDATE_OPERATION);
    }

    @Test
    @DisplayName("Verify draft cancel event for my project experience header skill create scenario")
    void testSkillCheck() {
        when(mockSkill.getSkillId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill.isEmpty()).thenReturn(false);
        when(mockSkill.getSkill()).thenReturn(mockSkillMasterListAll);
        MyResourceServiceHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(mockSkill).when(classUnderTestSpy).getExpandedDataOfSkillAssignments(any(), anyBoolean());
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillsEntity(any(), any());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillsEntity(any());
        classUnderTestSpy.skillCheck(Collections.singletonList(mockSkill), mockDraftCancelEventContext,
                mockAuditedDataSubject);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockDraftCancelEventContext,
                SKILL_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, DELETE_OPERATION);
    }

    @Test
    @DisplayName("Verify draft cancel event for my project experience header role create scenario")
    void testRoleCheck() {
        when(mockRole.getRoleId()).thenReturn(UUID.randomUUID().toString());
        when(mockRole.isEmpty()).thenReturn(false);
        when(mockRole.getRole()).thenReturn(mockRoleMasterList);
        MyResourceServiceHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(mockRole).when(classUnderTestSpy).getExpandedDataOfRoleAssignments(any(), anyBoolean());
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareRoleEntity(any(), any(), any());
        classUnderTestSpy.roleCheck(Collections.singletonList(mockRole), mockDraftCancelEventContext,
                mockAuditedDataSubject);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockDraftCancelEventContext,
                ROLE_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, DELETE_OPERATION);
    }

    @Test
    @DisplayName("Verify draft cancel event for draft role delete scenario")
    void testBeforeDraftCancelForRoles() {
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftCancelEventContext.getCqn()).thenReturn(mockCqnDelete);
        when(mockCqnDelete.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> roleIDMap = new HashMap<>();
        roleIDMap.put(ID, UUID.randomUUID().toString());
        when(mockAnalysisResult.targetKeys()).thenReturn(roleIDMap);
        when(mockMyResourceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockRole.getRoleId()).thenReturn(UUID.randomUUID().toString());
        when(mockRole.getRole()).thenReturn(mockRoleMasterList);
        MyResourceServiceHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(mockRole).when(classUnderTestSpy).getExpandedDataOfRoleAssignments(any(), anyBoolean());
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareRoleEntity(any(), any(), any());
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTestSpy).getAuditedDataSubject(any(), any(), any());
        when(mockRole.getProfile()).thenReturn(mockProfile);
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);
        classUnderTestSpy.beforeDraftCancelForRoles(mockDraftCancelEventContext);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockDraftCancelEventContext,
                ROLE_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, DELETE_OPERATION);

    }

    @Test
    @DisplayName("Verify draft cancel event for active role delete scenario")
    void testBeforeDraftCancelForActiveRoles() {
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftCancelEventContext.getCqn()).thenReturn(mockCqnDelete);
        when(mockCqnDelete.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> roleIDMap = new HashMap<>();
        roleIDMap.put(ID, UUID.randomUUID().toString());
        when(mockAnalysisResult.targetKeys()).thenReturn(roleIDMap);
        when(mockMyResourceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.rowCount()).thenReturn(Long.valueOf(2));
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        classUnderTest.beforeDraftCancelForRoles(mockDraftCancelEventContext);
        verify(this.mockAuditLogUtil, times(0)).logDataModificationAuditMessage(mockDraftCancelEventContext,
                ROLE_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, DELETE_OPERATION);

    }

    @Test
    @DisplayName("Verify draft cancel event for draft skill delete scenario")
    void testBeforeDraftCancelForSkills() {
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftCancelEventContext.getCqn()).thenReturn(mockCqnDelete);
        when(mockCqnDelete.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> skillIDMap = new HashMap<>();
        skillIDMap.put(ID, UUID.randomUUID().toString());
        when(mockAnalysisResult.targetKeys()).thenReturn(skillIDMap);
        when(mockMyResourceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockSkill.getSkillId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill.getSkill()).thenReturn(mockSkillMasterListAll);
        MyResourceServiceHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(mockSkill).when(classUnderTestSpy).getExpandedDataOfSkillAssignments(any(), anyBoolean());
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillsEntity(any(), any());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillsEntity(any());
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTestSpy).getAuditedDataSubject(any(), any(), any());
        when(mockSkill.getProfile()).thenReturn(mockProfile);
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);
        classUnderTestSpy.beforeDraftCancelForSkills(mockDraftCancelEventContext);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockDraftCancelEventContext,
                SKILL_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, DELETE_OPERATION);

    }

    @Test
    @DisplayName("Verify draft cancel event for active skill delete scenario")
    void testBeforeDraftCancelForActiveSkills() {
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftCancelEventContext.getCqn()).thenReturn(mockCqnDelete);
        when(mockCqnDelete.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> skillIDMap = new HashMap<>();
        skillIDMap.put(ID, UUID.randomUUID().toString());
        when(mockAnalysisResult.targetKeys()).thenReturn(skillIDMap);
        when(mockMyResourceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.rowCount()).thenReturn(Long.valueOf(2));
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        classUnderTest.beforeDraftCancelForSkills(mockDraftCancelEventContext);
        verify(this.mockAuditLogUtil, times(0)).logDataModificationAuditMessage(mockDraftCancelEventContext,
                SKILL_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, DELETE_OPERATION);

    }

    @Test
    @DisplayName("Verify if draft cancel event for my project experience header does nothing if select returns nothing")
    void beforeDraftCancelForMyProjectExperienceHeaderActiveDoesNotExist() {
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftCancelEventContext.getCqn()).thenReturn(mockCqnDelete);
        when(mockCqnDelete.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> myProjectExperienceHeaderIDMap = new HashMap<>();
        String myProjectExperienceHeaderID = UUID.randomUUID().toString();
        myProjectExperienceHeaderIDMap.put(ID, myProjectExperienceHeaderID);
        when(mockAnalysisResult.targetKeys()).thenReturn(myProjectExperienceHeaderIDMap);
        when(mockMyResourceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(ProjectExperienceHeader.class)).thenReturn(Optional.empty());
        MyResourceServiceHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillsEntity(any(), any());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillsEntity(any());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareRoleEntity(any(), any(), any());
        when(mockProjectExperienceHeader.getProfile()).thenReturn(mockProfile);
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);
        classUnderTestSpy.beforeDraftCancelForMyProjectExperienceHeader(mockDraftCancelEventContext);
        verify(mockAuditLogUtil, never()).logDataModificationAuditMessage(mockDraftCancelEventContext,
                SKILL_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, UPDATE_OPERATION);
        verify(mockAuditLogUtil, never()).logDataModificationAuditMessage(mockDraftCancelEventContext,
                ROLE_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, UPDATE_OPERATION);
    }

    @Test
    @DisplayName("test prepare role entity method")
    void testPrepareRoleEntity() {
        HashMap<String, String> actualEntity = classUnderTest.prepareRoleEntity("Developer", "T0D1", "developer");
        HashMap<String, String> expectedEntity = new HashMap<>();
        expectedEntity.put("name", "Developer");
        expectedEntity.put("code", "T0D1");
        expectedEntity.put("description", "developer");
        assertEquals(expectedEntity, actualEntity);
    }

    @Test
    @DisplayName("test get Expand of role assignments method")
    void testGetExpandedDataOfRoleAssignments() {
        when(mockMyResourceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(Roles.class)).thenReturn(Optional.of(mockRole));
        Roles actualRole = classUnderTest.getExpandedDataOfRoleAssignments("123", true);
        assertEquals(mockRole, actualRole);
    }

    @Test
    @DisplayName("test get Expand of skill assignments method")
    void testGetExpandedDataOfSkillAssignments() {
        when(mockMyResourceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(Skills.class)).thenReturn(Optional.of(mockSkill));
        Skills actualSkill = classUnderTest.getExpandedDataOfSkillAssignments("123", true);
        assertEquals(mockSkill, actualSkill);
    }

    @Test
    @DisplayName("test draft activate scenario")
    void testBeforeUpsertMyProjectExperienceHeader1() {
        when(mockMyResourceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(ProjectExperienceHeader.class)).thenReturn(Optional.of(mockProjectExperienceHeader));
        when(mockProjectExperienceHeader.getRoles()).thenReturn(Collections.singletonList(mockRole));
        when(mockProjectExperienceHeader.getSkills()).thenReturn(Collections.singletonList(mockSkill));
        when(mockProjectExperienceHeader2.getSkills()).thenReturn(Collections.singletonList(mockSkill2));
        when(mockProjectExperienceHeader2.getRoles()).thenReturn(Collections.singletonList(mockRole2));
        when(mockRole.getId()).thenReturn(UUID.randomUUID().toString());
        when(mockRole2.getId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill.getId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill2.getId()).thenReturn(UUID.randomUUID().toString());
        MyResourceServiceHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(mockSkill).when(classUnderTestSpy).getExpandedDataOfSkillAssignments(any(), anyBoolean());
        Mockito.doReturn(mockRole).when(classUnderTestSpy).getExpandedDataOfRoleAssignments(any(), anyBoolean());
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTestSpy).getAuditedDataSubject(any(), any(), any());
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillsEntity(any(), any());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillsEntity(any());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareRoleEntity(any(), any(), any());
        when(mockProjectExperienceHeader.getProfile()).thenReturn(mockProfile);
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);
        when(mockRole.isEmpty()).thenReturn(false);
        when(mockSkill.isEmpty()).thenReturn(false);
        when(mockRole.getRole()).thenReturn(mockRoleMasterList);
        when(mockSkill.getSkill()).thenReturn(mockSkillMasterListAll);
        classUnderTestSpy.beforeUpsertProjectExperienceHeader(mockEventContext, mockProjectExperienceHeader2);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockEventContext,
                SKILL_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, DELETE_OPERATION);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockEventContext,
                ROLE_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, DELETE_OPERATION);
    }

    @Test
    @DisplayName("Test if beforeRead ensure catalog expansion for skillMasterList when catalog present")
    void testBeforeRead() {
        CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillMasterList_.CDS_NAME);
        mockReadEventContext.setCqn(Select.from(SkillMasterList_.CDS_NAME));
        MyResourceServiceHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(Boolean.TRUE).when(classUnderTestSpy).shouldComputeCommaSeparated(ArgumentMatchers.any());
        classUnderTestSpy.beforeReadExpandCatalogs(mockReadEventContext);

        verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(1)).ensureCatalogExpansion(ArgumentMatchers.any());
    }

    @Test
    @DisplayName("Test if beforeRead ensure catalog expansion for skillMasterList when no catalog present")
    void testBeforeReadNoCatalog() {
        CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillMasterList_.CDS_NAME);
        mockReadEventContext.setCqn(Select.from(SkillMasterList_.CDS_NAME));
        MyResourceServiceHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        classUnderTestSpy.beforeReadExpandCatalogs(mockReadEventContext);

        verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(0)).ensureCatalogExpansion(ArgumentMatchers.any());
    }

    @Test
    @DisplayName("Test if afterRead combined catalogs in commaSeparatedCatalog when no catalog assigned")
    void testAfterReadNoCatalog() {
        CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillMasterList_.CDS_NAME);
        mockReadEventContext.setCqn(Select.from(SkillMasterList_.CDS_NAME));
        MyResourceServiceHandler classUnderTestSpy = Mockito.spy(classUnderTest);

        SkillMasterList skill = Struct.create(SkillMasterList.class);
        skill.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        skill.setDescription("desc");
        skill.setName("name");

        Mockito.doReturn(Boolean.FALSE).when(classUnderTestSpy).shouldComputeCommaSeparated(ArgumentMatchers.any());
        Mockito.doNothing().when(classUnderTestSpy).removeInvalidAssociation(ArgumentMatchers.any());
        classUnderTestSpy.afterReadSetCommaSeparatedSkillCatalogs(mockReadEventContext,
                Collections.singletonList(skill));

        verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(0)).computeCommaSeparatedSkillCatalogs(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(0)).removeInvalidAssociation(ArgumentMatchers.any());

    }

    @Test
    @DisplayName("Test if afterRead combined catalogs in commaSeparatedCatalog when no catalog assigned")
    void testAfterReadNoCatalogAssociation() {
        CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillMasterList_.CDS_NAME);
        mockReadEventContext.setCqn(Select.from(SkillMasterList_.CDS_NAME));
        MyResourceServiceHandler classUnderTestSpy = Mockito.spy(classUnderTest);

        SkillMasterList skill = Struct.create(SkillMasterList.class);
        skill.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        skill.setDescription("desc");
        skill.setName("name");
        skill.setCatalogAssociations(null);

        Mockito.doReturn(Boolean.TRUE).when(classUnderTestSpy).shouldComputeCommaSeparated(ArgumentMatchers.any());
        Mockito.doNothing().when(classUnderTestSpy).removeInvalidAssociation(ArgumentMatchers.any());
        classUnderTestSpy.afterReadSetCommaSeparatedSkillCatalogs(mockReadEventContext,
                Collections.singletonList(skill));

        verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(1)).computeCommaSeparatedSkillCatalogs(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(1)).removeInvalidAssociation(ArgumentMatchers.any());
    }

    @Test
    @DisplayName("Test if afterRead try to build catalogs for skillMasterList when invalid association")
    void testAfterReadInvalidAssociation() {
        CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillMasterList_.CDS_NAME);
        mockReadEventContext.setCqn(Select.from(SkillMasterList_.CDS_NAME));
        MyResourceServiceHandler classUnderTestSpy = Mockito.spy(classUnderTest);

        Catalogs2SkillsConsumption catalogAssociations = Struct.create(Catalogs2SkillsConsumption.class);
        catalogAssociations.setId(null);
        catalogAssociations.setCatalogId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        catalogAssociations.setSkillId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");

        SkillMasterList skill = Struct.create(SkillMasterList.class);
        skill.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        skill.setDescription("desc");
        skill.setName("name");
        skill.setCatalogAssociations(Collections.singletonList(catalogAssociations));

        Mockito.doReturn(Boolean.TRUE).when(classUnderTestSpy).shouldComputeCommaSeparated(ArgumentMatchers.any());
        classUnderTestSpy.afterReadSetCommaSeparatedSkillCatalogs(mockReadEventContext,
                Collections.singletonList(skill));

        verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(1)).computeCommaSeparatedSkillCatalogs(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(1)).removeInvalidAssociation(ArgumentMatchers.any());

    }

    @Test
    @DisplayName("Test if afterRead build catalogs for skillMasterList when valid association")
    void testAfterRead() {
        CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillMasterList_.CDS_NAME);
        mockReadEventContext.setCqn(Select.from(SkillMasterList_.CDS_NAME));
        MyResourceServiceHandler classUnderTestSpy = Mockito.spy(classUnderTest);

        Catalogs2SkillsConsumption catalogAssociations = Struct.create(Catalogs2SkillsConsumption.class);
        catalogAssociations.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        catalogAssociations.setCatalogId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        catalogAssociations.setSkillId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");

        SkillMasterList skill = Struct.create(SkillMasterList.class);
        skill.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        skill.setDescription("desc");
        skill.setName("name");
        skill.setCatalogAssociations(Collections.singletonList(catalogAssociations));

        Mockito.doReturn(Boolean.TRUE).when(classUnderTestSpy).shouldComputeCommaSeparated(ArgumentMatchers.any());
        classUnderTestSpy.afterReadSetCommaSeparatedSkillCatalogs(mockReadEventContext,
                Collections.singletonList(skill));

        verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(1)).computeCommaSeparatedSkillCatalogs(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(1)).removeInvalidAssociation(ArgumentMatchers.any());

    }

    @Test
    @DisplayName("set an random skill uuid and verify that proficiencyLevelId is set to null")
    void populateDefaultProficiencyLevel() {
        Skills skillAssignment = Skills.create();
        skillAssignment.setSkillId(UUID.randomUUID().toString());

        assertDoesNotThrow(() -> this.classUnderTest.populateDefaultProficiencyLevels(skillAssignment));
        assertNull(skillAssignment.getProficiencyLevelId());
    }

    @Test
    @DisplayName("set random external work experience skill uuid and verify that proficiencyLevelId is set to null")
    void populateDefaultProficiencyLevel2() {
        ExternalWorkExperienceSkills skillAssignment = ExternalWorkExperienceSkills.create();
        skillAssignment.setSkillId(UUID.randomUUID().toString());

        ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
        proficiencyLevel.setId(UUID.randomUUID().toString());

        assertDoesNotThrow(() -> this.classUnderTest.populateDefaultProficiencyLevels(skillAssignment));
        assertNull(skillAssignment.getProficiencyLevelId());
    }

    @Test
    @DisplayName("set an random skill uuid  with proficiency level and verify that proficiencyLevelId is not set to null")
    void populateDefaultProficiencyLevel3() {
        Skills skillAssignment = Skills.create();
        skillAssignment.setSkillId(UUID.randomUUID().toString());
        skillAssignment.setProficiencyLevelId(UUID.randomUUID().toString());

        assertDoesNotThrow(() -> this.classUnderTest.populateDefaultProficiencyLevels(skillAssignment));
        assertNotNull(skillAssignment.getProficiencyLevelId());
    }

    @Test
    @DisplayName("set random external work experience skill uuid with proficiency level and verify that proficiencyLevelId is not set to null")
    void populateDefaultProficiencyLevel4() {
        ExternalWorkExperienceSkills skillAssignment = ExternalWorkExperienceSkills.create();
        skillAssignment.setSkillId(UUID.randomUUID().toString());
        skillAssignment.setProficiencyLevelId(UUID.randomUUID().toString());

        ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
        proficiencyLevel.setId(UUID.randomUUID().toString());

        assertDoesNotThrow(() -> this.classUnderTest.populateDefaultProficiencyLevels(skillAssignment));
        assertNotNull(skillAssignment.getProficiencyLevelId());
    }

    @Test
    @DisplayName("set virtual proficiencyLevelEditMode field to read only")
    void afterSkillDraftNew() {
        Skills skill = Skills.create();

        assertDoesNotThrow(() -> this.classUnderTest.afterSkillDraftNew(skill));
        assertEquals(1, skill.getProficiencyLevelEditMode());
    }

    @Test
    @DisplayName("set virtual proficiencyLevelEditMode field to read only")
    void afterExternalWorkExperienceSkillsDraftNew() {
        ExternalWorkExperienceSkills skillAssignment = ExternalWorkExperienceSkills.create();

        assertDoesNotThrow(() -> this.classUnderTest.afterExternalWorkExperienceSkillsDraftNew(skillAssignment));
        assertEquals(1, skillAssignment.getProficiencyLevelEditMode());
    }

    @Test
    @DisplayName("Check if proficiencyLevelEditMode is valid")
    void afterSkillsRead() {
        Skills skill1 = Skills.create();
        skill1.setSkillId(UUID.randomUUID().toString());
        skill1.setProficiencyLevelId(UUID.randomUUID().toString());
        Skills skill2 = Skills.create();
        skill2.setProficiencyLevelId(UUID.randomUUID().toString());
        List<Skills> skillList = Arrays.asList(skill1, skill2);

        assertDoesNotThrow(() -> this.classUnderTest.afterSkillRead(skillList));
        assertEquals(7, skillList.get(0).getProficiencyLevelEditMode());
        assertNotNull(skillList.get(0).getProficiencyLevelId());

        assertEquals(1, skillList.get(1).getProficiencyLevelEditMode());
    }

    @Test
    @DisplayName("Check if proficiencyLevelEditMode is valid")
    void afterExternalWorkExperienceSkillsRead() {
        ExternalWorkExperienceSkills skill1 = ExternalWorkExperienceSkills.create();
        skill1.setSkillId(UUID.randomUUID().toString());
        skill1.setProficiencyLevelId(UUID.randomUUID().toString());
        ExternalWorkExperienceSkills skill2 = ExternalWorkExperienceSkills.create();
        skill2.setProficiencyLevelId(UUID.randomUUID().toString());
        List<ExternalWorkExperienceSkills> skillList = Arrays.asList(skill1, skill2);

        assertDoesNotThrow(() -> this.classUnderTest.afterExternalWorkExperienceSkillRead(skillList));
        assertEquals(7, skillList.get(0).getProficiencyLevelEditMode());
        assertNotNull(skillList.get(0).getProficiencyLevelId());

        assertEquals(1, skillList.get(1).getProficiencyLevelEditMode());
    }

    @Test
    @DisplayName("Check if utilization color is getting set properly in periodic availability")
    void populateUtilizationColorPeriodicAvailabilityTest() {
        when(mockCommonEventHandlerUtil.getUtilizationColor(Mockito.anyInt())).thenCallRealMethod();
        List<PeriodicAvailability> periodicAvailabilityArray = new ArrayList<PeriodicAvailability>();
        periodicAvailabilityArray.add(periodicAvailability);
        int[] utilizationArr = { 0, 75, 90 };
        int[] colorArr = { 1, 2, 3 };
        for (int i = 0; i != utilizationArr.length; i++) {
            when(periodicAvailability.getUtilizationPercentage()).thenReturn(utilizationArr[i]);
            this.classUnderTest.populateUtilizationColorPeriodicAvailability(periodicAvailabilityArray);
            verify(this.periodicAvailability, times(1)).setUtilizationColor(colorArr[i]);
        }
    }

    @Test
    @DisplayName("Check if utilization color is getting set properly in utilization")
    void populateUtilizationColorUtilizationTest() {
        when(mockCommonEventHandlerUtil.getUtilizationColor(Mockito.anyInt())).thenCallRealMethod();
        List<Utilization> utilizationArray = new ArrayList<Utilization>();
        utilizationArray.add(utilization);
        int[] utilizationArr = { 125, 115, 110 };
        int[] colorArr = { 1, 2, 3 };
        for (int i = 0; i != utilizationArr.length; i++) {
            when(utilization.getYearlyUtilization()).thenReturn(utilizationArr[i]);
            this.classUnderTest.populateUtilizationColorUtilization(utilizationArray);
            verify(this.utilization, times(1)).setUtilizationColor(colorArr[i]);
        }
    }
}
