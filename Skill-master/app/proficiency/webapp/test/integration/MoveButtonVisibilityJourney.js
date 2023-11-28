sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/opaQunit"
], function (Opa5, opaTest) {
  "use strict";
  QUnit.module("MoveButtonVisibility");

  opaTest("Open App", function (Given, When, Then) {
    Given.iResetTestData().and.iStartMyApp("Proficiency-Display");
    Then.onTheShell.iSeeShellAppTitle("Manage Proficiency Sets");
    Then.onTheMainPage.onTable().iCheckRows();
  });

  opaTest("Open Object Page, Buttons are invisible", function (Given, When, Then) {
    When.onTheMainPage.onTable().iPressRow({ "ID": "Proficiency Set 2" });
    Then.onTheDetailPage.iShouldNotSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveUpButton" })
      .and.iShouldNotSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveDownButton" });
  });

  opaTest("Edit Proficiencies, Buttons are disabled", function (Given, When, Then) {
    When.onTheDetailPage.onHeader().iExecuteAction("Edit");
    Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveUpButton", enabled: false }, true)
      .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveDownButton", enabled: false }, true);
  });

  opaTest("Select the top Proficiency Level, Move Up Button is disabled, Move Down Button is enabled", function (Given, When, Then) {
    When.onTheDetailPage.iSelectRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0);
    Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveUpButton", enabled: false }, true)
      .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveDownButton", enabled: true }, true);
  });

  opaTest("Select a middle Proficiency Level, Both Buttons are enabled", function (Given, When, Then) {
    When.onTheDetailPage.iSelectRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 1);
    Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveUpButton", enabled: true }, true)
      .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveDownButton", enabled: true }, true);
  });

  opaTest("Select the bottom Proficiency Level, Move Down Button is enabled, Move Up Button is disabled", function (Given, When, Then) {
    When.onTheDetailPage.iSelectRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 2);
    Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveUpButton", enabled: true }, true)
      .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveDownButton", enabled:  false }, true);
  });

  opaTest("Move middle Proficiency Level up, Move Down Button is enabled, Move Up Button is disabled", function (Given, When, Then) {
    When.onTheDetailPage.iSelectRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 1);
    When.onTheDetailPage.iClickOnTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveUpButton" });
    Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveUpButton", enabled: false }, true)
      .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveDownButton", enabled:  true }, true);
  });

  opaTest("Move middle Proficiency Level down, Move Down Button is disabled, Move Up Button is enabled", function (Given, When, Then) {
    When.onTheDetailPage.iSelectRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 1);
    When.onTheDetailPage.iClickOnTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveDownButton" });
    Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveUpButton", enabled: true }, true)
      .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveDownButton", enabled:  false }, true);
  });

  opaTest("Cancel Editing, Buttons are invisible", function (Given, When, Then) {
    Given.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
    Then.onTheDetailPage.iShouldNotSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveUpButton" })
      .and.iShouldNotSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveDownButton" });
  });

  opaTest("Edit again, Buttons are disabled", function (Given, When, Then) {
    Given.onTheDetailPage.onHeader().iExecuteAction("Edit");
    Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveUpButton", enabled: false }, true)
      .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveDownButton", enabled:  false }, true);
  });

  opaTest("Save, Buttons are invisible", function (Given, When, Then) {
    Given.onTheDetailPage.onFooter().iExecuteSave();
    Then.onTheDetailPage.iShouldNotSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveUpButton" })
      .and.iShouldNotSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveDownButton" });
  });

  opaTest("Edit again, Buttons are disabled, then Save", function (Given, When, Then) {
    Given.onTheDetailPage.onHeader().iExecuteAction("Edit");
    Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveUpButton", enabled: false }, true)
      .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { id: "skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveDownButton", enabled:  false }, true);
    When.onTheDetailPage.onFooter().iExecuteSave();
  });

  opaTest("Teardown", function (Given, When, Then) {
    Given.iTearDownMyApp();
  });
});
