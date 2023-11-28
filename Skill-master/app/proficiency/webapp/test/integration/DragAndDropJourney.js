sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/opaQunit",
  "sap/ui/test/actions/Drag",
  "sap/ui/test/actions/Drop"
], function (Opa5, opaTest, Drag, Drop) {
  "use strict";
  QUnit.module("DragAndDrop");

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

  opaTest("Move upper level to last position with drag and drop", function (Given, When, Then) {
    When.onTheDetailPage.iDragColumnListItem("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0);
    When.onTheDetailPage.iDropAfterColumnListItem("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 2);
    Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0, {
      "Proficiency Level Name": "Proficiency Level 2.2",
      "Description": "Description Proficiency Level 2.2",
      "Level": "3"
    });
    Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 1, {
      "Proficiency Level Name": "Proficiency Level 2.1",
      "Description": "Description Proficiency Level 2.1",
      "Level": "2"
    });
    Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 2, {
      "Proficiency Level Name": "Proficiency Level 2.3",
      "Description": "Description Proficiency Level 2.3",
      "Level": "1"
    });
  });

  opaTest("Move bottom level to first position with drag and drop", function (Given, When, Then) {
    When.onTheDetailPage.iDragColumnListItem("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 2);
    When.onTheDetailPage.iDropBeforeColumnListItem("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0);
    Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0, {
      "Proficiency Level Name": "Proficiency Level 2.3",
      "Description": "Description Proficiency Level 2.3",
      "Level": "3"
    });
    Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 1, {
      "Proficiency Level Name": "Proficiency Level 2.2",
      "Description": "Description Proficiency Level 2.2",
      "Level": "2"
    });
    Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 2, {
      "Proficiency Level Name": "Proficiency Level 2.1",
      "Description": "Description Proficiency Level 2.1",
      "Level": "1"
    });
  });

  opaTest("Move upper level to middle position with drag and drop", function (Given, When, Then) {
    When.onTheDetailPage.iDragColumnListItem("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0);
    When.onTheDetailPage.iDropAfterColumnListItem("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 1);
    Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0, {
      "Proficiency Level Name": "Proficiency Level 2.2",
      "Description": "Description Proficiency Level 2.2",
      "Level": "3"
    });
    Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 1, {
      "Proficiency Level Name": "Proficiency Level 2.3",
      "Description": "Description Proficiency Level 2.3",
      "Level": "2"
    });
    Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 2, {
      "Proficiency Level Name": "Proficiency Level 2.1",
      "Description": "Description Proficiency Level 2.1",
      "Level": "1"
    });
  });

  opaTest("Move bottom level to middle position with drag and drop", function (Given, When, Then) {
    When.onTheDetailPage.iDragColumnListItem("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 2);
    When.onTheDetailPage.iDropBeforeColumnListItem("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 1);
    Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0, {
      "Proficiency Level Name": "Proficiency Level 2.2",
      "Description": "Description Proficiency Level 2.2",
      "Level": "3"
    });
    Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 1, {
      "Proficiency Level Name": "Proficiency Level 2.1",
      "Description": "Description Proficiency Level 2.1",
      "Level": "2"
    });
    Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 2, {
      "Proficiency Level Name": "Proficiency Level 2.3",
      "Description": "Description Proficiency Level 2.3",
      "Level": "1"
    });
  });

  opaTest("Cancel move level", function (Given, When, Then) {
    When.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
    Then.onTheDetailPage.iCheckRowCount("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 3);
  });

  opaTest("Teardown", function (Given, When, Then) {
    Given.iTearDownMyApp();
  });
});
