package com.sap.c4p.rm.consultantprofile.projectroleservice.validations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;

import com.sap.cds.Struct;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.utils.TestHelper;
import com.sap.c4p.rm.consultantprofile.utils.commonvalidations.CommonValidator;

import com.sap.resourcemanagement.config.DefaultLanguages;

import projectroleservice.Roles;
import projectroleservice.RolesTexts;

public class ProjectRoleValidatorTest extends InitMocks {

    /** object under test */
    private ProjectRoleValidatorImpl cut;

    /** mocks */
    private PersistenceService mockPersistenceService;

    @Mock
    private CommonValidator mockCommonValidator;

    private Messages messages;

    private static final String ROLE_CODE_1 = "T001";
    private static final String ROLE_NAME_1 = "Junior Consultant";
    private static final String ROLE_DESCRIPTION_1 = "Consultant with experience of 1 year";
    private static final String ROLE_CODE_2 = "";
    private static final String ROLE_NAME_2 = "Senior Consultant";
    private static final String ROLE_DESCRIPTION_2 = "Consultant with experience of 3 years";
    private static final String ROLE_CODE_3 = null;
    private static final String ROLE_NAME_3 = "Architect";
    private static final String ROLE_DESCRIPTION_3 = "Consultant with experience of 10 years";
    private static final String ROLE_CODE_4 = "  ";
    private static final String ROLE_NAME_4 = "Program Manager";
    private static final String ROLE_DESCRIPTION_4 = "Consultant with PM experience";
    private static final String ROLE_CODE_5 = "T6@!";
    private static final String ROLE_NAME_5 = "Scrum Master";
    private static final String ROLE_DESCRIPTION_5 = "Consultant with experience of 5 years";
    private static final String ROLE_NAME_6 = "";
    private static final String ROLE_NAME_7 = null;
    private static final String ROLE_NAME_8 = "  ";
    private static final String ROLE_DESCRIPTION_6 = "Consultant with<script> experience of 5 years";
    private static final String ROLE_NAME_9 = "<script>";
    private static final String ROLE_NAME_10 = "de";

    /**
     * initialize object under test
     */
    @BeforeEach
    public void setUp() {
        messages = mock(Messages.class, RETURNS_DEEP_STUBS);
        this.mockPersistenceService = mock(PersistenceService.class, Mockito.RETURNS_DEEP_STUBS);
        this.cut = new ProjectRoleValidatorImpl(this.mockPersistenceService, this.mockCommonValidator, this.messages);
        final DefaultLanguages defaultLanguage = DefaultLanguages.create();
        defaultLanguage.setLanguageCode(TestHelper.LANGUAGE_CODE_EN);
        // Get default language
        when(this.mockPersistenceService.run(any(CqnSelect.class)).first(DefaultLanguages.class))
                .thenReturn(Optional.of(defaultLanguage));
    }

    @Test
    @DisplayName("During creation of new project role check if unique valid role code passes the validation")
    public void validateRoleCodeUniquenessSuccessOnCreate() {
        final Roles role = ProjectRoleValidatorTest.createTestRoles(ROLE_CODE_1, ROLE_NAME_1, ROLE_DESCRIPTION_1);
        when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 0);
        this.cut.projectRoleCodeUniquenessCheck(role);
    }

    @Test
    @DisplayName("During creation of new project role check if a duplicate role code fails the validation")
    public void validateDuplicateRoleCodeFailureOnCreate() {
        final Roles role = ProjectRoleValidatorTest.createTestRoles(ROLE_CODE_1, ROLE_NAME_1, ROLE_DESCRIPTION_1);
        when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 1);
        this.cut.projectRoleCodeUniquenessCheck(role);
        verify(messages, times(1)).error(MessageKeys.ROLECODE_EXISTS);
    }

    @Test
    @DisplayName("During creation of new project role check if a empty role code fails the validation")
    public void validateEmptyRoleCodeFailureOnCreate() {
        final Roles role = ProjectRoleValidatorTest.createTestRoles(ROLE_CODE_2, ROLE_NAME_2, ROLE_DESCRIPTION_2);
        this.cut.projectRoleCodeEmptinessCheck(role);
        verify(messages, times(1)).error(MessageKeys.ROLECODE_EMPTY);

    }

    @Test
    @DisplayName("During creation of new project role check if a null role code fails the validation")
    public void validateNullRoleCodeFailureOnCreate() {
        final Roles role = ProjectRoleValidatorTest.createTestRoles(ROLE_CODE_3, ROLE_NAME_3, ROLE_DESCRIPTION_3);
        this.cut.projectRoleCodeEmptinessCheck(role);
        verify(messages, times(1)).error(MessageKeys.ROLECODE_EMPTY);
    }

    @Test
    @DisplayName("During creation of new project role check if role code with just empty spaces fails the validation")
    public void validateEmptySpacesRoleCodeFailureOnCreate() {
        final Roles role = ProjectRoleValidatorTest.createTestRoles(ROLE_CODE_4, ROLE_NAME_4, ROLE_DESCRIPTION_4);
        this.cut.projectRoleCodeEmptinessCheck(role);
        verify(messages, times(1)).error(MessageKeys.ROLECODE_EMPTY);
    }

    @Test
    @DisplayName("During creation of new project role check if role code which has special characters fails the validation")
    public void validateSpecialCharRoleCodeFailureOnCreate() {
        final Roles role = ProjectRoleValidatorTest.createTestRoles(ROLE_CODE_5, ROLE_NAME_4, ROLE_DESCRIPTION_4);
        this.cut.projectRoleCodeEmptinessCheck(role);
        verify(messages, times(1)).error(MessageKeys.ROLECODE_EMPTY);

    }

    @Test
    @DisplayName("During creation of new project role check if a empty role name fails the validation")
    public void validateEmptyRoleNameFailureOnCreate() {
        final Roles role = ProjectRoleValidatorTest.createTestRolesWithTexts(ROLE_CODE_2, ROLE_NAME_6,
                ROLE_DESCRIPTION_2);
        this.cut.projectRoleNameEmptinessCheck(role);
        verify(messages, times(1)).error(MessageKeys.ROLENAME_EMPTY);

    }

    @Test
    @DisplayName("During creation of new project role check if a null role name fails the validation")
    public void validateNullRoleNameFailureOnCreate() {
        final Roles role = ProjectRoleValidatorTest.createTestRolesWithTexts(ROLE_CODE_3, ROLE_NAME_7,
                ROLE_DESCRIPTION_3);
        this.cut.projectRoleNameEmptinessCheck(role);
        verify(messages, times(1)).error(MessageKeys.ROLENAME_EMPTY);

    }

    @Test
    @DisplayName("During creation of new project role check if role name with just empty spaces fails the validation")
    public void validateEmptySpacesRoleNameFailureOnCreate() {
        final Roles role = ProjectRoleValidatorTest.createTestRolesWithTexts(ROLE_CODE_4, ROLE_NAME_8,
                ROLE_DESCRIPTION_4);
        this.cut.projectRoleNameEmptinessCheck(role);
        verify(messages, times(1)).error(MessageKeys.ROLENAME_EMPTY);

    }

    @Test
    @DisplayName("During update of an existing project role check if a new unique valid role code passes the validation")
    public void validateRoleCodeUniquenessSuccessOnUpdate() {
        final Roles role = ProjectRoleValidatorTest.createTestRoles(ROLE_CODE_1, ROLE_NAME_1, ROLE_DESCRIPTION_1);
        when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 0);
        this.cut.projectRoleCodeUniquenessCheck(role);

    }

    @Test
    @DisplayName("During update of an existing project role check if a duplicate role code fails the validation")
    public void validateDuplicateRoleFailureOnUpdate() {
        final Roles role = ProjectRoleValidatorTest.createTestRoles(ROLE_CODE_1, ROLE_NAME_1, ROLE_DESCRIPTION_1);
        when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 1);
        this.cut.projectRoleCodeUniquenessCheck(role);
        verify(messages, times(1)).error(MessageKeys.ROLECODE_EXISTS);

    }

    @Test
    @DisplayName("During update of an existing project role check if a new name with new role code passes the validation")
    public void validateSameRoleCodeAndNewNameSuccessOnUpdate() {
        final Roles role = ProjectRoleValidatorTest.createTestRoles(ROLE_CODE_1, ROLE_NAME_5, ROLE_DESCRIPTION_1);
        when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 0);
        this.cut.projectRoleCodeUniquenessCheck(role);
    }

    @Test
    @DisplayName("During update of an existing project role check if a new description with new role code passes the validation")
    public void validateSameRoleCodeAndNewDescSuccessOnUpdate() {
        final Roles role = ProjectRoleValidatorTest.createTestRoles(ROLE_CODE_1, ROLE_NAME_1, ROLE_DESCRIPTION_5);
        when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 0);
        this.cut.projectRoleCodeUniquenessCheck(role);
    }

    @Test
    @DisplayName("During update of an existing project role check if a empty role code fails the validation")
    public void validateEmptyRoleCodeFailureOnUpdate() {
        final Roles role = ProjectRoleValidatorTest.createTestRoles(ROLE_CODE_2, ROLE_NAME_2, ROLE_DESCRIPTION_2);
        this.cut.projectRoleCodeEmptinessCheck(role);
        verify(messages, times(1)).error(MessageKeys.ROLECODE_EMPTY);

    }

    @Test
    @DisplayName("During update of an existing project role check if a null role code fails the validation")
    public void validateNullRoleCodeFailureOnUpdate() {
        final Roles role = ProjectRoleValidatorTest.createTestRoles(ROLE_CODE_3, ROLE_NAME_3, ROLE_DESCRIPTION_3);
        this.cut.projectRoleCodeEmptinessCheck(role);
        verify(messages, times(1)).error(MessageKeys.ROLECODE_EMPTY);

    }

    @Test
    @DisplayName("During update of an existing project role check if role code with just empty spaces fails the validation")
    public void validateEmptySpacesRoleCodeFailureOnUpdate() {
        final Roles role = ProjectRoleValidatorTest.createTestRoles(ROLE_CODE_4, ROLE_NAME_4, ROLE_DESCRIPTION_4);
        this.cut.projectRoleCodeEmptinessCheck(role);
        verify(messages, times(1)).error(MessageKeys.ROLECODE_EMPTY);

    }

    @Test
    @DisplayName("During update of an existing project role check if role code which has special characters fails the validation")
    public void validateSpecialCharRoleCodeFailureOnUpdate() {
        final Roles role = ProjectRoleValidatorTest.createTestRoles(ROLE_CODE_5, ROLE_NAME_4, ROLE_DESCRIPTION_4);
        this.cut.projectRoleCodeEmptinessCheck(role);
        verify(messages, times(1)).error(MessageKeys.ROLECODE_EMPTY);
    }

    @Test
    @DisplayName("During update of an existing project role check if a empty role name fails the validation")
    public void validateEmptyRoleNameFailureOnUpdate() {
        final Roles role = ProjectRoleValidatorTest.createTestRolesWithTexts(ROLE_CODE_2, ROLE_NAME_6,
                ROLE_DESCRIPTION_2);
        this.cut.projectRoleNameEmptinessCheck(role);
        verify(messages, times(1)).error(MessageKeys.ROLENAME_EMPTY);
    }

    @Test
    @DisplayName("During update of an existing project role check if a null role name fails the validation")
    public void validateNullRoleNameFailureOnUpdate() {
        final Roles role = ProjectRoleValidatorTest.createTestRolesWithTexts(ROLE_CODE_3, ROLE_NAME_7,
                ROLE_DESCRIPTION_3);
        this.cut.projectRoleNameEmptinessCheck(role);
        verify(messages, times(1)).error(MessageKeys.ROLENAME_EMPTY);
    }

    @Test
    @DisplayName("During update of an existing project role check if role name with just empty spaces fails the validation")
    public void validateEmptySpacesRoleNameFailureOnUpdate() {
        final Roles role = ProjectRoleValidatorTest.createTestRolesWithTexts(ROLE_CODE_4, ROLE_NAME_8,
                ROLE_DESCRIPTION_4);
        this.cut.projectRoleNameEmptinessCheck(role);
        verify(messages, times(1)).error(MessageKeys.ROLENAME_EMPTY);
    }

    @Test
    @DisplayName("Check if role description contains forbidden characters")
    public void validateXSSdescriptionFailure1() {
        final Roles role = ProjectRoleValidatorTest.createTestRolesWithTexts(ROLE_CODE_4, ROLE_NAME_8,
                ROLE_DESCRIPTION_6);
        this.cut.projectRoleDescriptionXSSCheck(role);
        verify(messages, times(1)).error(MessageKeys.INPUT_ROLE_DESCRIPTION_IS_INVALID);

    }

    @Test
    @DisplayName("Check if role description contains forbidden characters")
    public void validateXSSdescriptionFailure2() {
        final Roles role = ProjectRoleValidatorTest.createTestRolesWithTexts(ROLE_CODE_4, ROLE_NAME_8,
                ROLE_DESCRIPTION_6);
        when(mockCommonValidator.validateFreeTextforScripting(role.getName())).thenReturn(false);
        this.cut.projectRoleDescriptionXSSCheck(role);
        Assertions.assertDoesNotThrow(() -> messages.error(MessageKeys.INPUT_ROLE_DESCRIPTION_IS_INVALID));

    }

    @Test
    @DisplayName("Check if role description contains forbidden characters")
    public void validateXSSnameFailure2() {
        final Roles role = ProjectRoleValidatorTest.createTestRolesWithTexts(ROLE_CODE_4, ROLE_NAME_9,
                ROLE_DESCRIPTION_5);
        when(mockCommonValidator.validateFreeTextforScripting(role.getName())).thenReturn(false);
        this.cut.projectRoleDescriptionXSSCheck(role);
        Assertions.assertDoesNotThrow(() -> messages.error(MessageKeys.INPUT_ROLE_DESCRIPTION_IS_INVALID));

    }

    @Test
    @DisplayName("Check if role name contains forbidden characters")
    public void validateXSSnameFailureForRoleTexts() {
        final Roles role = ProjectRoleValidatorTest.createTestRolesWithTexts(ROLE_CODE_4, ROLE_NAME_9,
                ROLE_DESCRIPTION_5);
        this.cut.projectRoleNameXSSCheck(role);
        verify(messages, times(1)).error(MessageKeys.INPUT_ROLE_NAME_IS_INVALID);

    }

    @Test
    @DisplayName("Check if role name contains forbidden characters")
    public void validateXSSnameFailureForRoles() {

        final Roles role = ProjectRoleValidatorTest.createTestRolesWithNullTexts(ROLE_CODE_1, ROLE_NAME_9,
                ROLE_DESCRIPTION_5);
        this.cut.projectRoleNameXSSCheck(role);
        verify(messages, times(1)).error(MessageKeys.INPUT_ROLE_NAME_IS_INVALID);

    }

    @Test
    @DisplayName("Check if role name contains forbidden characters")
    public void validateXSSdescriptionFailureForRoles() {

        final Roles role = ProjectRoleValidatorTest.createTestRolesWithNullTexts(ROLE_CODE_1, ROLE_NAME_2,
                ROLE_DESCRIPTION_6);
        this.cut.projectRoleNameXSSCheck(role);
        verify(messages, times(1)).error(MessageKeys.INPUT_ROLE_NAME_IS_INVALID);

    }

    @Test
    @DisplayName("Check if a correct count of role texts passes the validation")
    public void validateRoleTextCountSuccess() {
        final Roles role = TestHelper.createTestEntities(i -> {
            Roles roleToCreate = Roles.create();
            String[] languageCodes = { TestHelper.LANGUAGE_CODE_EN, TestHelper.LANGUAGE_CODE_DE };
            List<RolesTexts> projectRolesTexts = TestHelper.createTestEntities(2, j -> {
                RolesTexts projectRolesText = RolesTexts.create();
                projectRolesText.setName(TestHelper.ROLE_TEXT_NAME + j);
                projectRolesText.setLocale(languageCodes[j]);
                return projectRolesText;
            });
            roleToCreate.setTexts(projectRolesTexts);
            return roleToCreate;
        });
        when(mockCommonValidator.checkInputValueExistingDB(anyString(), anyString(), anyString())).thenReturn(true);
        this.cut.projectRoleTextCountCheck(role);
    }

    @Test
    @DisplayName("Check if not enough role texts fail the validation")
    public void validateRoleTextCountNotEnoughRolesTexts() {
        final Roles role = ProjectRoleValidatorTest.createTestRolesWithTexts(ROLE_CODE_1, ROLE_NAME_10,
                ROLE_DESCRIPTION_5);
        this.cut.projectRoleTextCountCheck(role);
        verify(messages, times(1)).error(MessageKeys.ROLE_NO_DEFAULT_LANGUAGE_TEXT, "en");
    }

    @Test
    @DisplayName("Check if too many texts in the same language fail the validation")
    public void validateRoleTextCountTooManyTextsForALanguage() {
        final Roles role = TestHelper.createTestEntities(i -> {
            Roles roleToCreate = Roles.create();
            List<RolesTexts> projectRolesTexts = TestHelper.createTestEntities(2, j -> {
                RolesTexts projectRolesText = RolesTexts.create();
                projectRolesText.setName(TestHelper.ROLE_TEXT_NAME + j);
                projectRolesText.setLocale(TestHelper.LANGUAGE_CODE_EN);
                return projectRolesText;
            });
            roleToCreate.setTexts(projectRolesTexts);
            return roleToCreate;
        });
        this.cut.projectRoleTextCountCheck(role);
        verify(messages, times(2)).error(MessageKeys.WRONG_ROLE_TEXT_COUNT, "en");
        verify(messages, times(2)).error(MessageKeys.LANGUAGECODE_DOES_NOT_EXISTS, "en");

    }

    @Test
    @DisplayName("Check if a missing default text fails the validation")
    public void validateRoleTextCountNoDefaultTexts() {
        when(this.mockPersistenceService.run(any(CqnSelect.class)).first(DefaultLanguages.class))
                .thenReturn(Optional.empty());

        final Roles role = TestHelper.createTestEntities(i -> {
            Roles roleToCreate = Roles.create();
            List<RolesTexts> projectRolesTexts = TestHelper.createTestEntities(1, j -> {
                RolesTexts projectRolesText = RolesTexts.create();
                projectRolesText.setName(TestHelper.ROLE_TEXT_NAME + j);
                projectRolesText.setLocale(TestHelper.LANGUAGE_CODE_DE);
                return projectRolesText;
            });
            roleToCreate.setTexts(projectRolesTexts);
            return roleToCreate;
        });
        when(mockCommonValidator.checkInputValueExistingDB(anyString(), anyString(), anyString())).thenReturn(true);
        assertThrows(ServiceException.class, () -> this.cut.projectRoleTextCountCheck(role));
    }

    @Test
    @DisplayName("Check if a missing text for a language that is used fails the validation")
    public void validateRoleTextCountNoTextForAusedLanguage() {
        final Roles role = TestHelper.createTestEntities(i -> {
            Roles roleToCreate = Roles.create();
            List<RolesTexts> projectRolesTexts = TestHelper.createTestEntities(1, j -> {
                RolesTexts projectRolesText = RolesTexts.create();
                projectRolesText.setName(TestHelper.ROLE_TEXT_NAME + j);
                projectRolesText.setLocale(TestHelper.LANGUAGE_CODE_EN);
                return projectRolesText;
            });
            roleToCreate.setTexts(projectRolesTexts);
            return roleToCreate;
        });
        this.cut.projectRoleTextCountCheck(role);
        verify(messages, times(1)).error(MessageKeys.LANGUAGECODE_DOES_NOT_EXISTS, "en");

    }

    @Test
    @DisplayName("Check if a missing default language fails the validation")
    public void validateRoleTextCountNoDefaultLanguage() {
        final Roles role = TestHelper.createTestEntities(i -> {
            Roles roleToCreate = Roles.create();
            List<RolesTexts> projectRolesTexts = TestHelper.createTestEntities(1, j -> {
                RolesTexts projectRolesText = RolesTexts.create();
                projectRolesText.setName(TestHelper.ROLE_TEXT_NAME + j);
                projectRolesText.setLocale(TestHelper.LANGUAGE_CODE_EN);
                return projectRolesText;
            });
            roleToCreate.setTexts(projectRolesTexts);
            return roleToCreate;
        });
        this.cut.projectRoleTextCountCheck(role);
        verify(messages, times(1)).error(MessageKeys.LANGUAGECODE_DOES_NOT_EXISTS, "en");

    }

    @Test
    @DisplayName("Check if a null role text throws a Service Exception")
    public void validateRoleTextNull() {
        final Roles role = ProjectRoleValidatorTest.createTestRolesWithNullTexts(ROLE_CODE_1, ROLE_NAME_10,
                ROLE_DESCRIPTION_5);

        ServiceException serviceException = assertThrows(ServiceException.class,
                () -> cut.projectRoleTextCountCheck(role));
        assertEquals(MessageKeys.ROLE_NO_DEFAULT_LANGUAGE_TEXT, serviceException.getMessage());
    }

    /**
     * create an active {@link Roles} instance with text association values for Unit
     * Testing
     *
     * @return {@link Roles} instance for Unit Testing
     */
    private static Roles createTestRolesWithTexts(String roleCode, String roleName, String roleDesc) {
        final Roles role = Struct.create(Roles.class);
        role.setCode(roleCode);
        role.setName(roleName);
        role.setDescription(roleDesc);
        role.setIsActiveEntity(Boolean.TRUE);
        final RolesTexts roleText = Struct.create(RolesTexts.class);
        roleText.setIDTexts("ID1");
        roleText.setName("");
        List<RolesTexts> locale = new ArrayList<RolesTexts>();
        locale.add(roleText);
        role.setTexts(locale);
        return role;
    }

    private static Roles createTestRolesWithNullTexts(String roleCode, String roleName, String roleDesc) {
        final Roles role = Struct.create(Roles.class);
        role.setCode(roleCode);
        role.setName(roleName);
        role.setDescription(roleDesc);
        role.setIsActiveEntity(Boolean.TRUE);
        List<RolesTexts> locale = new ArrayList<RolesTexts>();
        role.setTexts(locale);
        return role;
    }

    /**
     * create an active {@link Roles} instance for Unit Testing
     *
     * @return {@link Roles} instance for Unit Testing
     */
    private static Roles createTestRoles(String roleCode, String roleName, String roleDesc) {
        final Roles role = Struct.create(Roles.class);
        role.setCode(roleCode);
        role.setName(roleName);
        role.setDescription(roleDesc);
        role.setIsActiveEntity(Boolean.TRUE);
        return role;
    }

}
