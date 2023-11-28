package com.sap.c4p.rm.skill.services.validators;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.*;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;
import com.sap.c4p.rm.skill.utils.SkillTestHelper;

import skillservice.Skills;

class SingleSkillSourceValidatorTest {

  private PersistenceService mockPersistenceService;
  private SingleSkillSourceValidator cut;

  MockedStatic<IsNullCheckUtils> isNullCheckUtilsMockedStatic;

  @BeforeEach
  void beforeEach() {
    isNullCheckUtilsMockedStatic = Mockito.mockStatic(IsNullCheckUtils.class);
    this.mockPersistenceService = mock(PersistenceService.class);
    this.cut = new SingleSkillSourceValidator(this.mockPersistenceService);
  }

  @AfterEach
  public void afterEach() {
    isNullCheckUtilsMockedStatic.close();
  }

  @Test
  @DisplayName("Validate entry if it is replicated from MDI")
  void validateEntryIfReplicatedFromMDI() {
    final Skills skill = SkillTestHelper.createSkill();
    skill.setOid("MDI-OID");
    assertThrows(ServiceException.class, () -> this.cut.validateEntry(skill));
    Result mockResult = mock(Result.class);
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
  }

  @Test
  @DisplayName("Check if entry was replicated from MDI and is being maintained in RM")
  void readIfEntryIsMDIReplicated() {
    Row mockRow = mock(Row.class);
    Result mockResult = mock(Result.class, RETURNS_DEEP_STUBS);
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
    when(mockResult.single()).thenReturn(mockRow);
    when(mockRow.get("OID")).thenReturn("MDI-OID");

    isNullCheckUtilsMockedStatic.when(() -> IsNullCheckUtils.isNullOrEmpty(mockResult)).thenReturn(Boolean.FALSE);
    isNullCheckUtilsMockedStatic.when(() -> IsNullCheckUtils.isNullOrEmpty(mockRow)).thenReturn(Boolean.FALSE);
    assertThrows(ServiceException.class, () -> this.cut.checkIfEntryIsMDIReplicated("SkillsService.Skills", "UUID"));

  }

  @Test
  @DisplayName("Check if MDI Keys stored in RM are null")
  void checkIfMDIKeysAreNull() {
    Result mockResult = mock(Result.class, RETURNS_DEEP_STUBS);
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    isNullCheckUtilsMockedStatic.when(() -> IsNullCheckUtils.isNullOrEmpty(mockResult)).thenReturn(Boolean.TRUE);

    assertEquals(Boolean.FALSE, this.cut.checkIfMDIKeysAreNull());
  }

  @Test
  @DisplayName("Check if the system is fresh i.e no Skill entries exists in RM")
  void checkIfFreshSystem() {
    Result mockResult = mock(Result.class, RETURNS_DEEP_STUBS);
    when(this.mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);

    isNullCheckUtilsMockedStatic.when(() -> IsNullCheckUtils.isNullOrEmpty(mockResult)).thenReturn(Boolean.TRUE);

    assertEquals(Boolean.TRUE, this.cut.checkIfFreshSystem());
  }

}
