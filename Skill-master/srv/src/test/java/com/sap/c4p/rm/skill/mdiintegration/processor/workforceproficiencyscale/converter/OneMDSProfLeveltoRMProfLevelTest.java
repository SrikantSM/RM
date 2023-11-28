package com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.converter;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.UUID;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.core.convert.support.GenericConversionService;

import com.sap.cds.Row;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.mdiintegration.InitMocks;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.converters.OneMDSProfLeveltoRMProfLevel;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dao.WorkForceProficiencyDAO;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Description;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Name;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.WorkforceCapabilityProficiency;
import com.sap.c4p.rm.skill.mdiintegration.utils.CommonUtility;
import com.sap.c4p.rm.skill.mdiintegration.utils.CommonUtilityImpl;

import com.sap.resourcemanagement.skill.ProficiencyLevels;

public class OneMDSProfLeveltoRMProfLevelTest extends InitMocks {

  private static final GenericConversionService classUnderTest = new GenericConversionService();
  private static CommonUtility commonUtility;

  @Mock
  private static WorkForceProficiencyDAO workForceProficiencyDAO;

  @Mock
  private static PersistenceService persistenceService;

  @Mock
  Row row;

  @Mock
  Object object;

  @BeforeAll
  public static void setUpAll() {
    commonUtility = new CommonUtilityImpl(persistenceService);
    classUnderTest.addConverter(new OneMDSProfLeveltoRMProfLevel(commonUtility, workForceProficiencyDAO));
  }

  @Test
  @DisplayName("test convert if source is null")
  public void testConvertIfSourceIsNull() {
    assertNull(classUnderTest.convert(null, WorkforceCapabilityProficiency.class));
  }

  @Test
  @DisplayName("test convert with name not null")
  public void testConvertIfNameNotNull() {
    WorkforceCapabilityProficiency proficiency = new WorkforceCapabilityProficiency();
    proficiency.setId(UUID.randomUUID().toString());
    proficiency.setLevel(1);
    Name name = new Name();
    name.setLang("en");
    name.setContent("Proficiency name");
    proficiency.setName(Collections.singletonList(name));
    CommonUtility commonUtilitySpy = Mockito.spy(commonUtility);
    classUnderTest.addConverter(new OneMDSProfLeveltoRMProfLevel(commonUtilitySpy, workForceProficiencyDAO));

    ProficiencyLevels proficiencyLevels = OneMDSProfLeveltoRMProfLevelTest.classUnderTest.convert(proficiency,
        ProficiencyLevels.class);
    assertNotNull(proficiencyLevels);
  }

  @Test
  @DisplayName("test convert with description not null")
  public void testConvertIfDescriptionNotNull() {
    WorkforceCapabilityProficiency proficiency = new WorkforceCapabilityProficiency();
    proficiency.setId(UUID.randomUUID().toString());
    proficiency.setLevel(1);
    Description description = new Description();
    description.setLang("en");
    description.setContent("Proficiency name");
    proficiency.setDescription(Collections.singletonList(description));
    CommonUtility commonUtilitySpy = Mockito.spy(commonUtility);
    classUnderTest.addConverter(new OneMDSProfLeveltoRMProfLevel(commonUtilitySpy, workForceProficiencyDAO));

    ProficiencyLevels proficiencyLevels = OneMDSProfLeveltoRMProfLevelTest.classUnderTest.convert(proficiency,
        ProficiencyLevels.class);
    assertNotNull(proficiencyLevels);
  }

  @Test
  @DisplayName("test convert with name and description not null")
  public void testConvertIfNameAndDescriptionNotNull() {
    WorkforceCapabilityProficiency proficiency = new WorkforceCapabilityProficiency();
    proficiency.setId(UUID.randomUUID().toString());
    proficiency.setLevel(1);
    Name name = new Name();
    name.setLang("en");
    name.setContent("Proficiency name");
    proficiency.setName(Collections.singletonList(name));
    Description description = new Description();
    description.setLang("en");
    description.setContent("Proficiency name");
    proficiency.setDescription(Collections.singletonList(description));
    when(workForceProficiencyDAO.getExistingProfLevel(any())).thenReturn(row);
    when(row.get(ProficiencyLevels.ID)).thenReturn(object);
    when(object.toString()).thenReturn("PROFLEVELUUID");
    CommonUtility commonUtilitySpy = Mockito.spy(commonUtility);
    classUnderTest.addConverter(new OneMDSProfLeveltoRMProfLevel(commonUtilitySpy, workForceProficiencyDAO));

    ProficiencyLevels proficiencyLevels = OneMDSProfLeveltoRMProfLevelTest.classUnderTest.convert(proficiency,
        ProficiencyLevels.class);
    assertNotNull(proficiencyLevels);
  }

  @Test
  @DisplayName("test convert with name and description not null and with different locales")
  public void testConvertIfNameAndDescriptionNotNullWithDifferentLocale() {
    WorkforceCapabilityProficiency proficiency = new WorkforceCapabilityProficiency();
    proficiency.setId(UUID.randomUUID().toString());
    proficiency.setLevel(1);
    Name name = new Name();
    name.setLang("en");
    name.setContent("Proficiency name");
    proficiency.setName(Collections.singletonList(name));
    Description description = new Description();
    description.setLang("de");
    description.setContent("Proficiency name");
    proficiency.setDescription(Collections.singletonList(description));
    CommonUtility commonUtilitySpy = Mockito.spy(commonUtility);
    classUnderTest.addConverter(new OneMDSProfLeveltoRMProfLevel(commonUtilitySpy, workForceProficiencyDAO));

    ProficiencyLevels proficiencyLevels = OneMDSProfLeveltoRMProfLevelTest.classUnderTest.convert(proficiency,
        ProficiencyLevels.class);
    assertNotNull(proficiencyLevels);
  }
}
