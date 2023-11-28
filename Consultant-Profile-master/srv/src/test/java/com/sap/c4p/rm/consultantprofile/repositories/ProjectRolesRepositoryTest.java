package com.sap.c4p.rm.consultantprofile.repositories;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.draft.DraftService;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.utils.TestHelper;

import projectroleservice.Roles;
import projectroleservice.RolesTexts;
import projectroleservice.Roles_;

public class ProjectRolesRepositoryTest extends InitMocks {

    @Mock
    private DraftService mockDraftService;

    @InjectMocks
    @Autowired
    private ProjectRolesRepository classUnderTest;

    @Test
    @DisplayName("getRolesByRoleText")
    void getRolesByRoleText() {
        final Roles role = TestHelper.createTestEntities(i -> {
            Roles expectedRoleToCreate = Roles.create();
            final List<RolesTexts> expectedTexts = TestHelper.createTestEntities(1, j -> {
                RolesTexts expectedText = RolesTexts.create();
                expectedText.setIDTexts(TestHelper.ROLE_TEXT_ID + i);
                expectedText.setIsActiveEntity(Boolean.FALSE);
                expectedText.setId(TestHelper.ROLE_TEXT_ID + i);
                return expectedText;
            });
            expectedRoleToCreate.setTexts(expectedTexts);
            return expectedRoleToCreate;
        });

        final CqnSelect select = Select.from(Roles_.class)
                .where(s -> s.texts().ID_texts().eq(role.getTexts().get(0).getIDTexts())
                        .and(s.texts().IsActiveEntity().eq(role.getTexts().get(0).getIsActiveEntity())))
                .columns(Roles_::_all);

        final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
        List<Roles> expectedResult = Arrays.asList(role);
        Result mockResult = mock(Result.class);
        when(mockResult.listOf(Roles.class)).thenReturn(expectedResult);
        when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

        List<Roles> actualResult = this.classUnderTest.getRolesByRoleText(role.getTexts().get(0));
        verify(mockDraftService, times(1)).run(argThat((CqnSelect cqn) -> cqn.toString().equals(select.toString())));
        verify(this.mockDraftService, times(1)).run(argumentSelect.capture());
        assertEquals(actualResult, expectedResult);
    }

    @Test
    @DisplayName("getExpandedRoles")
    void getExpandedRoles() {
        final Roles role = TestHelper.createTestEntities(i -> {
            Roles expectedRoleToCreate = Roles.create();
            final List<RolesTexts> expectedTexts = TestHelper.createTestEntities(1, j -> {
                RolesTexts expectedText = RolesTexts.create();
                expectedText.setIDTexts(TestHelper.ROLE_TEXT_ID + i);
                expectedText.setIsActiveEntity(Boolean.FALSE);
                expectedText.setId(TestHelper.ROLE_TEXT_ID + i);
                return expectedText;
            });
            expectedRoleToCreate.setTexts(expectedTexts);
            return expectedRoleToCreate;
        });

        final CqnSelect select = Select.from(Roles_.class)
                .where(s -> s.ID().eq(role.getId())
                        .and(s.IsActiveEntity()
                                .eq(role.getIsActiveEntity() == null ? Boolean.TRUE : role.getIsActiveEntity())))
                .columns(Roles_::_all, s -> s.texts().expand());

        final ArgumentCaptor<CqnSelect> argumentSelect = ArgumentCaptor.forClass(CqnSelect.class);
        Optional<Roles> expectedResult = Optional.of(role);
        Result mockResult = mock(Result.class);
        when(mockResult.first(Roles.class)).thenReturn(expectedResult);
        when(this.mockDraftService.run(any(CqnSelect.class))).thenReturn(mockResult);

        List<Roles> actualResult = this.classUnderTest.getExpandedRoles(Arrays.asList(role));
        verify(mockDraftService, times(1)).run(argThat((CqnSelect cqn) -> cqn.toString().equals(select.toString())));
        verify(this.mockDraftService, times(1)).run(argumentSelect.capture());
        assertEquals(actualResult, Arrays.asList(expectedResult.get()));
    }

}
