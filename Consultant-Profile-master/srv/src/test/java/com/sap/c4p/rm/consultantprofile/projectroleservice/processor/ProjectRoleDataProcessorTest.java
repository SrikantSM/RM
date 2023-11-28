package com.sap.c4p.rm.consultantprofile.projectroleservice.processor;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.consultantprofile.utils.ProjectRoleEventHandlerUtility;
import com.sap.c4p.rm.consultantprofile.utils.TestHelper;

import com.sap.resourcemanagement.config.DefaultLanguages;

import projectroleservice.CreateRoleWithDialogContext;
import projectroleservice.RemoveRestrictionContext;
import projectroleservice.RestrictContext;
import projectroleservice.Roles;
import projectroleservice.Roles_;

public class ProjectRoleDataProcessorTest {

    /** object under test */
    private ProjectRoleDataProcessor cut;

    private PersistenceService mockPersistenceService;
    private ProjectRoleEventHandlerUtility mockEventHandlerUtility;

    private static final String SOME_ROLE_ID = "#R1";
    private static final String ROLE_CODE = "T001";
    private static final String ROLE_NAME_1 = "Junior Consultant";
    private static final String ROLE_DESCRRIPTION_1 = "Consultant with experience of 1 year";

    /**
     * initialize object under test
     */
    @BeforeEach
    public void setUp() {

        this.mockPersistenceService = mock(PersistenceService.class, Mockito.RETURNS_DEEP_STUBS);
        this.mockEventHandlerUtility = new ProjectRoleEventHandlerUtility();
        this.cut = new ProjectRoleDataProcessor(this.mockPersistenceService, this.mockEventHandlerUtility);

        final DefaultLanguages defaultLanguage = DefaultLanguages.create();
        defaultLanguage.setLanguageCode(TestHelper.LANGUAGE_CODE_EN);

        // mock PersistenceService
        when(this.mockPersistenceService.run(any(CqnSelect.class)).first(DefaultLanguages.class))
                .thenReturn(Optional.of(defaultLanguage));

    }

    @Test
    @DisplayName("Restrict role")
    public void restrictRole() {
        final Roles role = ProjectRoleDataProcessorTest.createTestRole(true, 0);
        final RestrictContext mockContext = mock(RestrictContext.class);
        final Messages mockMessages = mock(Messages.class);

        CqnSelect mockSelect = mock(CqnSelect.class);
        DraftService mockDraftService = mock(DraftService.class);
        Result mockResult = mock(Result.class);
        PersistenceService mockPersistenceService = mock(PersistenceService.class);
        when(mockContext.getMessages()).thenReturn(mockMessages);
        when(mockContext.getCqn()).thenReturn(mockSelect);
        when(mockContext.getService()).thenReturn(mockDraftService);
        when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.single(Roles.class)).thenReturn(role);
        when(mockPersistenceService.run(any(Update.class))).thenReturn(mockResult);

        this.cut.restrictRole(mockContext);

        // verify: expected result
        verify(mockContext).setResult(role);
        assertEquals(1, role.getRoleLifecycleStatusCode());
    }

    @Test
    @DisplayName("Try to restrict already restricted role")
    public void restrictRoleAlreadyDelimitedRole() {
        final Roles role = ProjectRoleDataProcessorTest.createTestRole(true, 1);
        final RestrictContext mockContext = mock(RestrictContext.class);

        CqnSelect mockSelect = mock(CqnSelect.class);
        DraftService mockDraftService = mock(DraftService.class);
        Result mockResult = mock(Result.class);
        PersistenceService mockPersistenceService = mock(PersistenceService.class);
        when(mockContext.getCqn()).thenReturn(mockSelect);
        when(mockContext.getService()).thenReturn(mockDraftService);
        when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.single(Roles.class)).thenReturn(role);
        when(mockPersistenceService.run(any(Update.class))).thenReturn(mockResult);

        assertThrows(ServiceException.class, () -> {
            this.cut.restrictRole(mockContext);
        }, "restrictRole() did not throw ServiceException although role was already delimited.");
    }

    @Test
    @DisplayName("Remove restriction on role")
    public void removeRestrictionRole() {
        final Roles role = ProjectRoleDataProcessorTest.createTestRole(true, 1);
        final RemoveRestrictionContext mockContext = mock(RemoveRestrictionContext.class);
        final Messages mockMessages = mock(Messages.class);

        CqnSelect mockSelect = mock(CqnSelect.class);
        DraftService mockDraftService = mock(DraftService.class);
        Result mockResult = mock(Result.class);
        PersistenceService mockPersistenceService = mock(PersistenceService.class);
        when(mockContext.getMessages()).thenReturn(mockMessages);
        when(mockContext.getCqn()).thenReturn(mockSelect);
        when(mockContext.getService()).thenReturn(mockDraftService);
        when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.single(Roles.class)).thenReturn(role);
        when(mockPersistenceService.run(any(Update.class))).thenReturn(mockResult);

        this.cut.removeRestrictionRole(mockContext);

        // verify: expected result
        verify(mockContext).setResult(role);
        assertEquals(0, role.getRoleLifecycleStatusCode());
    }

    @Test
    @DisplayName("Try to remove restriction already unrestricted role")
    public void removeRestrictionRoleAlreadyActiveRole() {
        final Roles role = ProjectRoleDataProcessorTest.createTestRole(true, 0);
        final RemoveRestrictionContext mockContext = mock(RemoveRestrictionContext.class);

        CqnSelect mockSelect = mock(CqnSelect.class);
        DraftService mockDraftService = mock(DraftService.class);
        Result mockResult = mock(Result.class);
        PersistenceService mockPersistenceService = mock(PersistenceService.class);
        when(mockContext.getCqn()).thenReturn(mockSelect);
        when(mockContext.getService()).thenReturn(mockDraftService);
        when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.single(Roles.class)).thenReturn(role);
        when(mockPersistenceService.run(any(Update.class))).thenReturn(mockResult);

        assertThrows(ServiceException.class, () -> {
            this.cut.removeRestrictionRole(mockContext);
        }, "removeRestrictionRole() did not throw ServiceException although role was already active.");
    }

    @Test
    @DisplayName("Try to restrict draft role")
    public void restrictRoleDraftRole() {
        final Roles role = ProjectRoleDataProcessorTest.createTestRole(false, 0);
        final RestrictContext mockContext = mock(RestrictContext.class);

        CqnSelect mockSelect = mock(CqnSelect.class);
        DraftService mockDraftService = mock(DraftService.class);
        Result mockResult = mock(Result.class);
        when(mockContext.getCqn()).thenReturn(mockSelect);
        when(mockContext.getService()).thenReturn(mockDraftService);
        when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.single(Roles.class)).thenReturn(role);

        assertThrows(ServiceException.class, () -> {
            this.cut.restrictRole(mockContext);
        }, "restrictRole() did not throw ServiceException although role was in draft.");
    }

    @Test
    @DisplayName("Try to remove restriction from draft role")
    public void removeRestrictionRoleDraftRole() {
        final Roles role = ProjectRoleDataProcessorTest.createTestRole(false, 1);
        final RemoveRestrictionContext mockContext = mock(RemoveRestrictionContext.class);

        CqnSelect mockSelect = mock(CqnSelect.class);
        DraftService mockDraftService = mock(DraftService.class);
        Result mockResult = mock(Result.class);
        when(mockContext.getCqn()).thenReturn(mockSelect);
        when(mockContext.getService()).thenReturn(mockDraftService);
        when(mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.single(Roles.class)).thenReturn(role);

        assertThrows(ServiceException.class, () -> {
            this.cut.removeRestrictionRole(mockContext);
        }, "removeRestrictionRole() did not throw ServiceException although role was in draft.");
    }

    @Test
    @DisplayName("Check behavior of onCreateRoleWithDialogAction()")
    public void onCreateRoleWithDialogAction() {
        // create expected role (and label)
        final Roles expectedRole = TestHelper.createRoleWithTexts();

        // mock context
        final CreateRoleWithDialogContext mockContext = mock(CreateRoleWithDialogContext.class);
        when(mockContext.getDescription()).thenReturn(expectedRole.getTexts().get(0).getDescription());
        when(mockContext.getName()).thenReturn(expectedRole.getTexts().get(0).getName());

        // mock draftService
        final DraftService mockService = mock(DraftService.class);
        final Result fakeResult = mock(Result.class);
        when(mockService.newDraft(any(CqnInsert.class))).thenReturn(fakeResult);
        when(fakeResult.single(Roles.class)).thenReturn(expectedRole);

        when(mockContext.getService()).thenReturn(mockService);

        // act
        this.cut.createRoleWithDialog(mockContext);

        // createDraft method should be called once
        final ArgumentCaptor<Roles> captorRoles = ArgumentCaptor.forClass(Roles.class);

        verify(mockContext, times(1)).setResult(captorRoles.capture());
        assertEquals(expectedRole, captorRoles.getValue());
    }

    @Test
    public void updateRoleTextsAtDatabase() {
        final Roles mockRole = TestHelper.createRoleWithTexts();
        final DraftService mockService = mock(DraftService.class);
        List<Roles> Roles = this.cut.updateRoleTextsAtDatabase(mockService, Collections.singletonList(mockRole));
        assertEquals(1, Roles.size());
        assertEquals(mockRole, Roles.get(0));

        mockRole.setIsActiveEntity(Boolean.TRUE);
        List<Roles> RolesTrue = this.cut.updateRoleTextsAtDatabase(mockService, Collections.singletonList(mockRole));
        assertEquals(1, RolesTrue.size());
        assertEquals(mockRole, RolesTrue.get(0));
    }

    @Test
    @DisplayName("Expand RoleTexts")
    public void expandRolesTexts() {
        final DraftService mockService = mock(DraftService.class);
        Roles role = TestHelper.createRoleWithTexts();

        final CqnSelect expectedSelect = Select.from(Roles_.class)
                .where(s -> s.ID().eq(role.getId()).and(s.IsActiveEntity().eq(role.getIsActiveEntity())))
                .columns(Roles_::_all, s -> s.texts().expand());

        final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);

        List<Roles> RolesList = new ArrayList<>();
        RolesList.add(role);

        Result mockResult = mock(Result.class);
        when(mockResult.first(Roles.class)).thenReturn(Optional.of(role));
        when(mockService.run(any(CqnSelect.class))).thenReturn(mockResult);

        this.cut.expandRolesTexts(mockService, RolesList);

        verify(mockService, times(1)).run(argumentSelect.capture());

        List<CqnSelect> capturedSelect = argumentSelect.getAllValues();
        assertEquals(expectedSelect.toString(), capturedSelect.get(0).toString());

    }

    /**
     * create an active {@link Roles} instance for Unit Testing
     *
     * @param bIsActiveEntity
     * @param RoleCode
     * @return {@link Roles} instance for Unit Testing
     */
    private static Roles createTestRole(boolean bIsActiveEntity, Integer roleLifecycleStatusCode) {
        final Roles role = Struct.create(Roles.class);
        role.setId(ProjectRoleDataProcessorTest.SOME_ROLE_ID);
        role.setCode(ProjectRoleDataProcessorTest.ROLE_CODE);
        role.setName(ProjectRoleDataProcessorTest.ROLE_NAME_1);
        role.setDescription(ProjectRoleDataProcessorTest.ROLE_DESCRRIPTION_1);
        role.setRoleLifecycleStatusCode(roleLifecycleStatusCode);
        role.setIsActiveEntity(bIsActiveEntity);
        return role;
    }
}
