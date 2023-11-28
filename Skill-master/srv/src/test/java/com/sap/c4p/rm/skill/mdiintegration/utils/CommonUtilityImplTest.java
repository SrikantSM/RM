package com.sap.c4p.rm.skill.mdiintegration.utils;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Description;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Name;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.c4p.rm.skill.mdiintegration.InitMocks;

import java.util.ArrayList;
import java.util.List;

public class CommonUtilityImplTest extends InitMocks {

  @Autowired
  @InjectMocks
  CommonUtilityImpl classUnderTest;

  @Test
  @DisplayName("Test isValidJson when given string is not a JSONObject||JSONArray")
  public void testIsValidJson() {
    String str = "ascdfas";
    assertFalse(this.classUnderTest.isValidJson(str));
    String str1 = "}";
    assertFalse(this.classUnderTest.isValidJson(str1));
    String str2 = "]";
    assertFalse(this.classUnderTest.isValidJson(str2));
    String str3 = "}dcs{";
    assertFalse(this.classUnderTest.isValidJson(str3));
    String str4 = "]dcs[";
    assertFalse(this.classUnderTest.isValidJson(str4));
  }

  @Test
  @DisplayName("Test isValidJson when given string is with valid JSONObject||JSONArray")
  public void testIsValidJson1() {
    String str = "{}";
    assertTrue(this.classUnderTest.isValidJson(str));
    String str1 = "[]";
    assertTrue(this.classUnderTest.isValidJson(str1));
    String str2 = "[{}]";
    assertTrue(this.classUnderTest.isValidJson(str2));
    String str3 = "[{}, das]";
    assertTrue(this.classUnderTest.isValidJson(str3));
    String str4 = "[{}],{}";
    assertTrue(this.classUnderTest.isValidJson(str4));
    String str6 = "{\"key\":\"value\"}";
    assertTrue(this.classUnderTest.isValidJson(str6));
    String str7 = "[{\"key1\":\"value1\"}]";
    assertTrue(this.classUnderTest.isValidJson(str7));
    String str8 = "[{\"key1\":\"value1\"},{\"key2\":\"value2\"}]";
    assertTrue(this.classUnderTest.isValidJson(str8));
  }

  @Test
  @DisplayName("Test prepare language contents for Capability name texts ")
  public void testPrepareLangContentsSkillNameTexts()
  {
    List<Name> nameList = new ArrayList<>();
    Name name1 = new Name();
    name1.setLang("en-UK");
    name1.setContent("Skill name(UK)");
    nameList.add(name1);

    Name name2 = new Name();
    name2.setLang("en-US");
    name2.setContent("Skill name(US)");
    nameList.add(name2);

    List<LanguageContent> langcontentExpList = new ArrayList<>();
    LanguageContent langContent = LanguageContent.create();
    langContent.setLang("en");
    langContent.setContent("Skill name(UK)");
    langcontentExpList.add(langContent);

    List<LanguageContent> actualList = this.classUnderTest.prepareLanguageContents(nameList);

    assertEquals(langcontentExpList.get(0).getContent(), actualList.get(0).getContent());
    assertEquals(langcontentExpList.get(0).getContent(), actualList.get(0).getContent());
  }

  @Test
  @DisplayName("Test prepare language contents for Capability name descriptions ")
  public void testPrepareLangContentsSkillDescription()
  {
    List<Description> descriptionList = new ArrayList<>();
    Description description1 = new Description();
    description1.setLang("en-UK");
    description1.setContent("Skill description(UK)");
    descriptionList.add(description1);

    Description description2 = new Description();
    description2.setLang("en-US");
    description2.setContent("Skill description(US)");
    descriptionList.add(description2);

    List<LanguageContent> langcontentExpList = new ArrayList<>();
    LanguageContent langContent = LanguageContent.create();
    langContent.setLang("en");
    langContent.setContent("Skill description(UK)");
    langcontentExpList.add(langContent);

    List<LanguageContent> actualList = this.classUnderTest.prepareLanguageContents(descriptionList);

    assertEquals(langcontentExpList.get(0).getContent(), actualList.get(0).getContent());
    assertEquals(langcontentExpList.get(0).getContent(), actualList.get(0).getContent());

  }

  @Test
  @DisplayName("Test prepare language contents for Proficiency Scale name texts ")
  public void testPrepareLangContentsProfNameTexts()
  {
    List<Name> nameList = new ArrayList<>();
    Name name1 = new Name();
    name1.setLang("en-UK");
    name1.setContent("Prof Scale name(UK)");
    nameList.add(name1);

    Name name2 = new Name();
    name2.setLang("en-US");
    name2.setContent("Prof Scale name(US)");
    nameList.add(name2);

    List<LanguageContent> langcontentExpList = new ArrayList<>();
    LanguageContent langContent = LanguageContent.create();
    langContent.setLang("en");
    langContent.setContent("Prof Scale name(UK)");
    langcontentExpList.add(langContent);

    List<LanguageContent> actualList = this.classUnderTest.prepareLanguageContents(nameList);

    assertEquals(langcontentExpList.get(0).getContent(), actualList.get(0).getContent());
    assertEquals(langcontentExpList.get(0).getContent(), actualList.get(0).getContent());
  }


  @Test
  @DisplayName("Test prepare language contents for Proficiency Scale description ")
  public void testPrepareLangContentsProfScaleDescription()
  {
    List<com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Description> descriptionList = new ArrayList<>();
    com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Description description1 =
            new com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Description();
    description1.setLang("en-UK");
    description1.setContent("Prof Scale description(UK)");
    descriptionList.add(description1);

    com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Description description2 =
            new com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Description();
    description2.setLang("en-US");
    description2.setContent("Prof Scale description(US)");
    descriptionList.add(description2);

    List<LanguageContent> langcontentExpList = new ArrayList<>();
    LanguageContent langContent = LanguageContent.create();
    langContent.setLang("en");
    langContent.setContent("Prof Scale description(UK)");
    langcontentExpList.add(langContent);

    List<LanguageContent> actualList = this.classUnderTest.prepareLanguageContents(descriptionList);

    assertEquals(langcontentExpList.get(0).getContent(), actualList.get(0).getContent());
    assertEquals(langcontentExpList.get(0).getContent(), actualList.get(0).getContent());

  }

}
