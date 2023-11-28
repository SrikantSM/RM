package com.sap.c4p.rm.consultantprofile.myprojectexperienceservice.validations;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.utils.commonvalidations.CommonValidator;

import myprojectexperienceservice.Roles;

class MyProjectExperienceHeaderRoleValidatorTest extends InitMocks {

    @Mock
    Result mockResult;

    @Mock
    Row mockRow;

    @Mock
    Iterator<Row> mockItr;

    @Mock
    CommonValidator mockCommonValidator;

    @Mock
    Roles mockRole1;

    @Mock
    Roles mockRole2;

    private Messages messages;

    @Autowired
    @InjectMocks
    MyProjectExperienceHeaderRoleValidator classUnderTest;

    List<Roles> rolesList;

    @BeforeEach
    public void setUp() {
        messages = mock(Messages.class, RETURNS_DEEP_STUBS);
        this.rolesList = Arrays.asList(mockRole1, mockRole2);
        classUnderTest = new MyProjectExperienceHeaderRoleValidator(mockCommonValidator, messages);
    }

    @Test
    @DisplayName("check If role_ID of Role being assigned is Null")
    void validateMyProjectExperienceHeaderRoles1() {
        String employeeId = UUID.randomUUID().toString();
        when(mockRole1.getEmployeeId()).thenReturn(employeeId);
        this.classUnderTest.validateMyProjectExperienceHeaderRoles(rolesList);
        verify(messages, times(2)).error(MessageKeys.INPUT_ROLE_CAN_NOT_EMPTY);
    }

    @Test
    @DisplayName("check If role_ID of Role being assigned is empty")
    void validateMyProjectExperienceHeaderRoles2() {
        String employeeId = UUID.randomUUID().toString();
        String roleId = "";
        when(mockRole1.getEmployeeId()).thenReturn(employeeId);
        when(mockRole1.getRoleId()).thenReturn(roleId);
        classUnderTest.validateMyProjectExperienceHeaderRoles(rolesList);
        verify(messages, times(2)).error(MessageKeys.INPUT_ROLE_CAN_NOT_EMPTY);
    }

    @Test
    @DisplayName("check If role_ID of Role being assigned have whitespaces")
    void validateMyProjectExperienceHeaderRoles3() {
        String employeeId = UUID.randomUUID().toString();
        String roleId = "   ";
        when(mockRole1.getEmployeeId()).thenReturn(employeeId);
        when(mockRole1.getRoleId()).thenReturn(roleId);
        classUnderTest.validateMyProjectExperienceHeaderRoles(rolesList);
        verify(messages, times(2)).error(MessageKeys.INPUT_ROLE_CAN_NOT_EMPTY);
    }

    @Test
    @DisplayName("check role_ID of Role being assigned does not exists in Foreign table")
    void validateMyProjectExperienceHeaderRoles4() {
        String employeeId = "dummyEmployeeId";
        String roleId = "dummyRoleId";
        when(mockRole1.getEmployeeId()).thenReturn(employeeId);
        when(mockRole1.getRoleId()).thenReturn(roleId);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        when(mockCommonValidator.checkInputValueExistingDB(anyString(), anyString(), anyString())).thenReturn(false);
        classUnderTest.validateMyProjectExperienceHeaderRoles(rolesList);
        verify(messages, times(1)).error(MessageKeys.ROLE_DOES_NOT_EXISTS);
    }

    @Test
    @DisplayName("check If Duplicate role is being assigned to MyProjectExperience")
    void validateMyProjectExperienceHeaderRoles5() {
        final String employeeID = UUID.randomUUID().toString();
        final String roleID = UUID.randomUUID().toString();
        Optional<Row> newRow = Optional.of(mockRow);
        when(mockResult.first()).thenReturn(newRow);
        when(mockResult.iterator()).thenReturn(mockItr);
        when(mockItr.hasNext()).thenReturn(true).thenReturn(false);
        when(mockItr.next()).thenReturn(mockRow);
        when(mockRow.get(anyString())).thenReturn("duplicateRoleName");
        when(mockRole1.getEmployeeId()).thenReturn(employeeID);
        when(mockRole1.getRoleId()).thenReturn(roleID);
        when(mockRole2.getEmployeeId()).thenReturn(employeeID);
        when(mockRole2.getRoleId()).thenReturn(roleID);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        when(mockCommonValidator.checkInputValueExistingDB(anyString(), anyString(), anyString())).thenReturn(true);
        classUnderTest.validateMyProjectExperienceHeaderRoles(rolesList);
        verify(messages, times(1)).error(MessageKeys.DUPLICATE_ROLE_CAN_NOT_BE_ASSIGNED);
    }

    @Test
    @DisplayName("check If role containing forbidden characters is being assigned to MyProjectExperience")
    void validateMyProjectExperienceHeaderRoles6() {
        final String employeeID = UUID.randomUUID().toString();
        final String roleID = UUID.randomUUID().toString();
        when(mockRole1.getEmployeeId()).thenReturn(employeeID);
        when(mockRole1.getRoleId()).thenReturn(roleID);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(false);
        classUnderTest.validateMyProjectExperienceHeaderRoles(rolesList);
        verify(messages, times(1)).error(MessageKeys.INPUT_ROLE_IS_INVALID);
    }

    @Test
    @DisplayName("check if not null & non-duplicate role is being assigned")
    void validateMyProjectExperienceHeaderRoles7() {
        final String employeeID = UUID.randomUUID().toString();
        when(mockRole1.getEmployeeId()).thenReturn(employeeID);
        when(mockRole2.getEmployeeId()).thenReturn(employeeID);
        when(mockRole1.getRoleId()).thenReturn(UUID.randomUUID().toString());
        when(mockRole2.getRoleId()).thenReturn(UUID.randomUUID().toString());
        when(mockCommonValidator.checkInputValueExistingDB(anyString(), anyString(), anyString())).thenReturn(true);
        when(mockCommonValidator.validateFreeTextforScripting(anyString())).thenReturn(true);
        assertDoesNotThrow(() -> classUnderTest.validateMyProjectExperienceHeaderRoles(rolesList));
    }

    @Test
    @DisplayName("Check RoleID is of valid length when valid value is not given")
    void validateMyProjectExperienceHeaderRoles8() {
        final String roleID = "randomStringRandomStringRandomStringRandomString";
        when(mockRole1.getRoleId()).thenReturn(roleID);
        when(mockCommonValidator.checkInputGuidFieldLength(anyString())).thenReturn(true);
        classUnderTest.checkInputFieldLength(mockRole1);
        verify(messages, times(1)).error(MessageKeys.ROLE_DOES_NOT_EXISTS);
    }

    @Test
    @DisplayName("Check RoleID and EmployeeID is of valid length is given")
    void validateMyProjectExperienceHeaderRoles9() {
        final String roleID = UUID.randomUUID().toString();
        when(mockRole1.getRoleId()).thenReturn(roleID);
        when(mockCommonValidator.checkInputGuidFieldLength(anyString())).thenReturn(false);
        assertDoesNotThrow(() -> classUnderTest.checkInputFieldLength(mockRole1));
    }

    @Test
    @DisplayName("Check if Messages API error is added")
    void validateMyProjectExperienceHeaderRoles10() {
        classUnderTest.prepareErrorMessage(mockRole1, MessageKeys.ROLE_DOES_NOT_EXISTS);
        verify(messages, times(1)).error(MessageKeys.ROLE_DOES_NOT_EXISTS);
    }

}
