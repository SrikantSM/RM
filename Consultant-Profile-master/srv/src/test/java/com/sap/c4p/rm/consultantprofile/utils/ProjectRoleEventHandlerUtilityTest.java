package com.sap.c4p.rm.consultantprofile.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.Result;

import projectroleservice.Roles;

public class ProjectRoleEventHandlerUtilityTest {
    /** object under test */
    private ProjectRoleEventHandlerUtility cut;

    /**
     * initialize object under test
     */
    @BeforeEach
    public void beforeEach() {
        // init class under test
        this.cut = new ProjectRoleEventHandlerUtility();
    }

    @Test
    @DisplayName("Deduplicate Stream of Roles")
    public void removeDuplicateRole() {
        List<Roles> roles = TestHelper.createTestEntities(2, i -> {
            Roles role = Roles.create();
            role.setId(TestHelper.ROLE_ID + i);
            return role;
        });
        Roles role = TestHelper.createTestEntities(i -> {
            Roles newRole = Roles.create();
            newRole.setId(TestHelper.ROLE_ID + i);
            return newRole;
        });
        roles.add(role);

        List<Roles> resultList = cut.removeDuplicateRole(roles.stream()).collect(Collectors.toList());

        assertEquals(2, resultList.size());
        for (int i = 0; i < resultList.size(); i++) {
            assertEquals(roles.get(i), resultList.get(i));
        }
    }

    @Test
    @DisplayName("Enhance the Result of a Role Draft Action with changed Role texts")
    public void enhanceRoleResult() {
        List<Roles> resultList = TestHelper.createTestEntities(4, i -> {
            Roles role = Roles.create();
            role.setId(TestHelper.ROLE_ID + i);
            return role;
        });

        List<Roles> changedList = TestHelper.createTestEntities(3, i -> {
            Roles role = Roles.create();
            role.setId(TestHelper.ROLE_ID + i);
            role.setName(TestHelper.ROLE_NAME + i);
            role.setDescription(TestHelper.ROLE_DESCRIPTION + i);
            return role;
        });

        Result mockResult = mock(Result.class);
        doReturn(resultList).when(mockResult).listOf(eq(Roles.class));

        // act
        this.cut.enhanceRoleResult(mockResult, changedList);

        assertEquals(changedList.get(0), resultList.get(0)); // regular update
        assertEquals(changedList.get(1), resultList.get(1)); // updates out of order
        assertEquals(changedList.get(2), resultList.get(2)); // updates out of order
        assertNull(resultList.get(3).getName()); // unchanged if not in changedList
        assertNull(resultList.get(3).getDescription());
    }
}
