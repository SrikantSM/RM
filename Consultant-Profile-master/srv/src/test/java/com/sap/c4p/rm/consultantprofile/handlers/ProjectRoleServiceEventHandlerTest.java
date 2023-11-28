package com.sap.c4p.rm.consultantprofile.handlers;

import static org.mockito.Mockito.*;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.*;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.request.ParameterInfo;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.projectroleservice.processor.ProjectRoleDataProcessor;
import com.sap.c4p.rm.consultantprofile.projectroleservice.validations.ProjectRoleValidator;
import com.sap.c4p.rm.consultantprofile.repositories.ProjectRolesRepository;
import com.sap.c4p.rm.consultantprofile.repositories.ProjectRolesTextRepository;
import com.sap.c4p.rm.consultantprofile.utils.ProjectRoleEventHandlerUtility;
import com.sap.c4p.rm.consultantprofile.utils.TestHelper;

import projectroleservice.*;

class ProjectRoleServiceEventHandlerTest extends InitMocks {

    private static final String SOME_ROLE_ID = "#R1";
    private static final String ORIGINAL_ROLE_CODE = "T001";
    private static final String ROLE_NAME_1 = "Junior Consultant";
    private static final String ROLE_DESCRIPTION_1 = "Consultant with experience of 1 year";
    private static final String UPDATED_ROLE_CODE = "T002";
    private static final Integer LIFECYCLE_STATUS_CODE = null;
    private static final String DELETED_TEXT_PARENTS = "DELETED_TEXT_PARENTS";

    @Mock
    private ProjectRoleValidator mockProjectRoleValidator;

    @Mock
    private ProjectRoleDataProcessor mockProjectRoleProcessor;

    @Mock
    private ProjectRoleEventHandlerUtility mockEventHandlerUtility;

    @Mock
    private ProjectRolesTextRepository mockProjectRolesTextRepository;

    @Mock
    private ProjectRolesRepository mockProjectRolesRepository;

    @Mock
    private Messages mockMessages;

    @Mock
    private DraftSaveEventContext mockDraftDaveEventContext;

    @Autowired
    @InjectMocks
    private ProjectRoleServiceEventHandler classUnderTest;

    @BeforeEach
    public void setUp() {
        doNothing().when(this.mockProjectRoleValidator).projectRoleCodeEmptinessCheck(any(Roles.class));
        doNothing().when(this.mockProjectRoleValidator).projectRoleCodeUniquenessCheck(any(Roles.class));
    }

    @Test
    @DisplayName("Verify that beforeProjectRoleCreate() invokes methods projectRoleCodeEmptinessCheck and projectRoleCodeUniquenessCheck from projectRoleValidator")
    void beforeProjectRoleCreate() {
        final Roles role = ProjectRoleServiceEventHandlerTest.createTestRole(true, ORIGINAL_ROLE_CODE);

        this.classUnderTest.beforeProjectRoleCreate(role);

        verify(this.mockProjectRoleValidator, times(1)).projectRoleCodeEmptinessCheck(role);
        verify(this.mockProjectRoleValidator, times(1)).projectRoleCodeUniquenessCheck(role);
        verify(this.mockProjectRoleValidator, times(1)).projectRoleTextCountCheck(role);
        verify(this.mockMessages, times(1)).throwIfError();
    }

    @Test
    @DisplayName("Verify that beforeProjectRoleUpdate() invokes method projectRoleCodeEmptinessCheck and projectRoleCodeUniquenessCheck from projectRoleValidator"
            + "when originalRoleCode and changedRoleCode are different")
    void beforeProjectRoleUpdateWhenRoleCodeIsUpdated() {
        final Roles role = ProjectRoleServiceEventHandlerTest.createTestRole(true, ORIGINAL_ROLE_CODE);
        final Roles draftRole = ProjectRoleServiceEventHandlerTest.createTestRole(false, UPDATED_ROLE_CODE);
        // Prepare mock CdsUpsertEventContext
        final CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);

        // URL parameters contain same values as POJO
        final ParameterInfo mockParameters = mock(ParameterInfo.class);
        when(mockParameters.getQueryParameter(Roles.ID)).thenReturn(role.getId());
        when(mockParameters.getQueryParameter(Roles.IS_ACTIVE_ENTITY)).thenReturn(role.getIsActiveEntity().toString());
        when(mockParameters.getQueryParameter(Roles.CODE)).thenReturn(role.getCode());
        when(mockContext.getParameterInfo()).thenReturn(mockParameters);

        final CqnService fakeService = mock(CqnService.class);
        when(mockContext.getService()).thenReturn(fakeService);
        final Result fakeResult = mock(Result.class);
        when(fakeService.run(any(CqnSelect.class))).thenReturn(fakeResult);
        when(fakeResult.single(Roles.class)).thenReturn(role);
        when(fakeResult.single(Roles.class)).thenReturn(draftRole);

        this.classUnderTest.beforeProjectRoleUpdate(mockContext, role);

        // assertions
        verify(this.mockProjectRoleValidator, times(1)).projectRoleCodeEmptinessCheck(role);
        verify(this.mockProjectRoleValidator, times(1)).projectRoleCodeUniquenessCheck(role);
        verify(this.mockProjectRoleValidator, times(1)).projectRoleTextCountCheck(role);
        verify(this.mockMessages, times(1)).throwIfError();
        final InOrder order = inOrder(this.mockProjectRoleValidator);
        order.verify(this.mockProjectRoleValidator).projectRoleCodeEmptinessCheck(role);
        order.verify(this.mockProjectRoleValidator).projectRoleCodeUniquenessCheck(role);
    }

    @Test
    @DisplayName("Verify that beforeProjectRoleUpdate() invokes only method projectRoleCodeEmptinessCheck and not projectRoleCodeUniquenessCheck from projectRoleValidator"
            + "as the role Code has not been changed")
    void beforeProjectRoleUpdateWhenNoRoleCodeIsUpdated() {
        final Roles role = ProjectRoleServiceEventHandlerTest.createTestRole(true, ORIGINAL_ROLE_CODE);

        // Prepare mock CdsUpsertEventContext
        final CdsUpdateEventContext mockContext = mock(CdsUpdateEventContext.class);

        // URL parameters contain same values as POJO
        final ParameterInfo mockParameters = mock(ParameterInfo.class);
        when(mockParameters.getQueryParameter(Roles.ID)).thenReturn(role.getId());
        when(mockParameters.getQueryParameter(Roles.IS_ACTIVE_ENTITY)).thenReturn(role.getIsActiveEntity().toString());
        when(mockParameters.getQueryParameter(Roles.CODE)).thenReturn(role.getCode());
        when(mockContext.getParameterInfo()).thenReturn(mockParameters);

        final CqnService fakeService = mock(CqnService.class);
        when(mockContext.getService()).thenReturn(fakeService);
        final Result fakeResult = mock(Result.class);
        when(fakeService.run(any(CqnSelect.class))).thenReturn(fakeResult);
        when(fakeResult.single(Roles.class)).thenReturn(role).thenReturn(role);

        // action
        this.classUnderTest.beforeProjectRoleUpdate(mockContext, role);

        // assertions
        verify(this.mockProjectRoleValidator, times(1)).projectRoleCodeEmptinessCheck(role);
        verify(this.mockProjectRoleValidator, times(0)).projectRoleCodeUniquenessCheck(role);
        final InOrder order = inOrder(this.mockProjectRoleValidator);
        order.verify(this.mockProjectRoleValidator).projectRoleCodeEmptinessCheck(role);
    }

    @Test
    @DisplayName("Verify onRestrict() invokes restrictRole() method")
    void onRestrict() {
        final RestrictContext mockRestrictContext = mock(RestrictContext.class);

        this.classUnderTest.onRestrict(mockRestrictContext);
        verify(this.mockProjectRoleProcessor, times(1)).restrictRole(mockRestrictContext);
    }

    @Test
    @DisplayName("Verify onActivate() invokes removeRestrictionRole() method")
    void onActivate() {
        final RemoveRestrictionContext mockUnRestrictContext = mock(RemoveRestrictionContext.class);
        this.classUnderTest.onActivate(mockUnRestrictContext);
        verify(this.mockProjectRoleProcessor, times(1)).removeRestrictionRole(mockUnRestrictContext);
    }

    @Test
    @DisplayName("Verify onCreateRoleWithDialogAction() invokes createRoleWithDialog() method")
    void onCreateRoleWithDialogAction() {
        final CreateRoleWithDialogContext mockCreateRoleContext = mock(CreateRoleWithDialogContext.class);
        this.classUnderTest.onCreateRoleWithDialogAction(mockCreateRoleContext);
        verify(this.mockProjectRoleProcessor, times(1)).createRoleWithDialog(mockCreateRoleContext);
    }

    @Test
    @DisplayName("EventHandler: After Project role Draft Creation")
    void afterDraftNew() {
        final ProjectRoleServiceEventHandler spiedCut = spy(this.classUnderTest);
        final DraftNewEventContext mockContext = mock(DraftNewEventContext.class);
        final List<Roles> mockRoles = new ArrayList<>();

        doReturn(mockRoles).when(this.mockProjectRoleProcessor).updateTextsFromRoles(any(), any());

        Result result = mock(Result.class);
        when(mockContext.getResult()).thenReturn(result);

        spiedCut.afterDraftNew(mockContext, mockRoles);

        verify(this.mockProjectRoleProcessor, times(1)).updateTextsFromRoles(mockContext, mockRoles);
        verify(this.mockEventHandlerUtility, times(1)).enhanceRoleResult(mockContext.getResult(), mockRoles);
    }

    @Test
    @DisplayName("EventHandler: After Project role Draft Edit")
    void afterDraftEdit() {
        final ProjectRoleServiceEventHandler spiedCut = spy(this.classUnderTest);
        final DraftEditEventContext mockContext = mock(DraftEditEventContext.class);
        final List<Roles> mockRoles = new ArrayList<>();

        doReturn(mockRoles).when(this.mockProjectRoleProcessor).updateTextsFromRoles(any(), any());

        Result result = mock(Result.class);
        when(mockContext.getResult()).thenReturn(result);

        spiedCut.afterDraftEdit(mockContext, mockRoles);

        verify(this.mockProjectRoleProcessor, times(1)).updateTextsFromRoles(mockContext, mockRoles);
        verify(this.mockEventHandlerUtility, times(1)).enhanceRoleResult(mockContext.getResult(), mockRoles);
    }

    @Test
    @DisplayName("EventHandler: After Project role Draft Activate")
    void afterDraftSave() {
        final ProjectRoleServiceEventHandler spiedCut = spy(this.classUnderTest);
        final DraftSaveEventContext mockContext = mock(DraftSaveEventContext.class);
        final List<Roles> mockRoles = new ArrayList<>();

        doReturn(mockRoles).when(this.mockProjectRoleProcessor).updateTextsFromRoles(any(), any());

        Result result = mock(Result.class);
        when(mockContext.getResult()).thenReturn(result);

        spiedCut.afterDraftSave(mockContext, mockRoles);

        verify(this.mockProjectRoleProcessor, times(1)).updateTextsFromRoles(mockContext, mockRoles);
        verify(this.mockEventHandlerUtility, times(1)).enhanceRoleResult(mockContext.getResult(), mockRoles);
    }

    @Test
    @DisplayName("verify that afterDraftPatch() invokes all expected methods")
    void afterDraftPatch() {
        final Roles role = TestHelper.createTestEntities(i -> {
            Roles expectedRoleToCreate = Roles.create();
            final List<RolesTexts> expectedTexts = TestHelper.createTestEntities(1, j -> {
                RolesTexts expectedText = RolesTexts.create();
                expectedText.setIDTexts(TestHelper.ROLE_TEXT_ID + i);
                expectedText.setIsActiveEntity(Boolean.TRUE);
                expectedText.setId(TestHelper.ROLE_TEXT_ID + i);
                return expectedText;
            });
            expectedRoleToCreate.setTexts(expectedTexts);
            return expectedRoleToCreate;
        });

        final DraftPatchEventContext mockContext = mock(DraftPatchEventContext.class);
        final List<RolesTexts> mockProjectRolesTexts = role.getTexts();
        final CdsModel mockCdsModel = mock(CdsModel.class);
        final CqnUpdate mockCqnUpdate = mock(CqnUpdate.class);
        final DraftService mockService = mock(DraftService.class);
        when(mockContext.getService()).thenReturn(mockService);
        when(mockContext.getModel()).thenReturn(mockCdsModel);
        when(mockContext.getCqn()).thenReturn(mockCqnUpdate);
        Result mockResult = mock(Result.class);
        when(mockResult.first(Roles.class)).thenReturn(Optional.of(role));
        when(mockService.run(any(CqnSelect.class))).thenReturn(mockResult);

        this.classUnderTest.afterDraftPatch(mockContext, mockProjectRolesTexts);

        verify(mockEventHandlerUtility).addKeyAttributesToEntity(eq(mockCdsModel), eq(mockCqnUpdate), any());
    }

    @Test
    @DisplayName("verify that beforeDraftCancel() invokes all expected methods")
    void beforeDraftCancel() {
        final Roles role = TestHelper.createTestEntities(i -> {
            Roles expectedRoleToCreate = Roles.create();
            final List<RolesTexts> expectedTexts = TestHelper.createTestEntities(1, j -> {
                RolesTexts expectedText = RolesTexts.create();
                expectedText.setIDTexts(TestHelper.ROLE_TEXT_ID + i);
                expectedText.setIsActiveEntity(Boolean.TRUE);
                expectedText.setId(TestHelper.ROLE_TEXT_ID + i);
                return expectedText;
            });
            expectedRoleToCreate.setTexts(expectedTexts);
            return expectedRoleToCreate;
        });

        final DraftCancelEventContext mockContext = mock(DraftCancelEventContext.class);
        final CdsModel mockCdsModel = mock(CdsModel.class);
        final CqnDelete mockCqnDelete = mock(CqnDelete.class);
        when(mockContext.getModel()).thenReturn(mockCdsModel);
        when(mockContext.getCqn()).thenReturn(mockCqnDelete);
        when(mockProjectRolesRepository.getRolesByRoleText(role.getTexts().get(0)))
                .thenReturn(Collections.singletonList(role));
        this.classUnderTest.beforeDraftCancel(mockContext);
        verify(mockEventHandlerUtility).addKeyAttributesToEntity(eq(mockCdsModel), eq(mockCqnDelete), any());
    }

    @Test
    @DisplayName("verify that afterDraftCancel() invokes all expected methods")
    void afterDraftCancel() {
        final Roles role = TestHelper.createTestEntities(i -> {
            Roles expectedRoleToCreate = TestHelper.createRole();
            final List<RolesTexts> expectedTexts = TestHelper.createTestEntities(1, j -> {
                RolesTexts expectedText = RolesTexts.create();
                expectedText.setIDTexts(TestHelper.ROLE_TEXT_ID + i);
                expectedText.setIsActiveEntity(Boolean.TRUE);
                expectedText.setId(TestHelper.ROLE_TEXT_ID + i);
                return expectedText;
            });
            expectedRoleToCreate.setTexts(expectedTexts);
            return expectedRoleToCreate;
        });

        final DraftCancelEventContext mockContext = mock(DraftCancelEventContext.class);
        final DraftService mockService = mock(DraftService.class);
        when(mockContext.getService()).thenReturn(mockService);
        when(mockContext.get(DELETED_TEXT_PARENTS)).thenReturn(Collections.singletonList(role));
        when(mockProjectRolesRepository.getExpandedRoles(Collections.singletonList(role)))
                .thenReturn(Collections.singletonList(role));
        this.classUnderTest.afterDraftCancel(mockContext);
        verify(mockProjectRoleProcessor).updateRoleTextsAtDatabase(mockService, Collections.singletonList(role));
    }

    @Test
    @DisplayName("test beforeDraftSaveLocalBugWorkAround")
    void testBeforeDraftSaveLocalBugWorkAround() {
        when(this.mockDraftDaveEventContext.getModel()).thenReturn(mock(CdsModel.class));
        when(this.mockDraftDaveEventContext.getCqn()).thenReturn(mock(CqnSelect.class));
        this.classUnderTest.beforeDraftSave(mockDraftDaveEventContext);
        verify(this.mockEventHandlerUtility, times(1)).addKeyAttributesToEntity(any(CdsModel.class),
                any(CqnSelect.class), any(Roles.class));
        verify(this.mockProjectRolesTextRepository, times(1)).deleteActiveTexts(any(Roles.class));
    }

    private static Roles createTestRole(boolean isActiveEntity, String roleCode) {
        final Roles role = Struct.create(Roles.class);
        role.setId(ProjectRoleServiceEventHandlerTest.SOME_ROLE_ID);
        role.setCode(roleCode);
        role.setName(ProjectRoleServiceEventHandlerTest.ROLE_NAME_1);
        role.setDescription(ProjectRoleServiceEventHandlerTest.ROLE_DESCRIPTION_1);
        role.setRoleLifecycleStatusCode(ProjectRoleServiceEventHandlerTest.LIFECYCLE_STATUS_CODE);
        role.setIsActiveEntity(isActiveEntity);
        return role;
    }

}
