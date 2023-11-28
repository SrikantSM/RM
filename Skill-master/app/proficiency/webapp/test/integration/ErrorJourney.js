sap.ui.define(["sap/ui/test/opaQunit","sap/m/ButtonType"], function (opaTest, ButtonType) {
  "use strict";

  return function () {
    var seed = Math.random();
    var evilScriptTag = "<script src=\"https://evilpage.de/assets/js/evilScript.js\"></script>";

    QUnit.module("ManageProficiencies Errors");

    opaTest("Open App (When I load the App, a list report shows the existing proficiency sets)", function (Given, When, Then) {
      Given.iResetTestData().and.iStartMyApp("Proficiency-Display");
      // Assertions
      Then.onTheShell.iSeeShellAppTitle("Manage Proficiency Sets");
      Then.onTheMainPage.onTable().iCheckRows();
    });

    opaTest("Create entity to work on", function (Given, When, Then) {
      Given.onTheMainPage.onTable().iExecuteCreate();
      When.onTheDetailPage
        .onActionDialog()
        .iChangeDialogField({ property: "name" }, "test_proficiency_name_error" + seed, true)
        .and.iChangeDialogField({ property: "description" }, "test description for dialog" + seed, true)
        .and.iConfirm();
      // Header Fields: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.TextArea", { value: "test description for dialog" + seed })
        .and.iShouldSeeTheElementTypeWithProperty("sap.m.Input", { value: "test_proficiency_name_error" + seed })
        .and.iShouldSeeTheCurrentTimeInTheText("createdAt", 10)
        .and.iShouldSeeTheCurrentTimeInTheText("modifiedAt", 10)
        .and.iShouldSeeTheTextInTheText("modifiedBy", "ConfigurationExpert");
    });

    opaTest("Error: Create a Proficiency Level", function (Given, When, Then) {
      When.onTheDetailPage.onFooter().iExecuteSave();

      // Error Message Popover: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      Then.onTheDetailPage.iShouldSeeTheElement("fe::FooterBar::MessageButton");
    });

    opaTest("Create proficiency level and save successfully", function (Given, When, Then) {
      When.onTheDetailPage.iClickOnTheElement("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelCreateButton");

      // Add Data in fields
      When.onTheDetailPage.iTypeTextIntoProficiencyLevelCreateDialog("nameOfProficiencyLevel", "a level name" + seed);
      When.onTheDetailPage.iTypeTextIntoProficiencyLevelCreateDialog("descriptionOfProficiencyLevel", "a level description" + seed);

      // Click on Create button
      When.onTheDetailPage.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Create", enabled: true, type: ButtonType.Emphasized });

      When.onTheDetailPage.onFooter().iExecuteSave();
      Then.onTheDetailPage.onHeader().iCheckEdit();
    });

    opaTest("Evil script tags in proficiency set name ", function (Given, When, Then) {
      Given.onTheDetailPage.onHeader().iExecuteEdit();

      // Header Fields: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      When.onTheDetailPage.iTypeTextIntoTheElement("fe::EditableHeaderForm::EditableHeaderTitle::Field-edit", evilScriptTag + seed);
      When.onTheDetailPage.onFooter().iExecuteSave();

      // Error Message Popover: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      Then.onTheDetailPage.iShouldSeeTheElement("fe::FooterBar::MessageButton");
    });

    opaTest("Evil script tag in proficiency set description ", function (Given, When, Then) {
      Given.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
      Given.onTheDetailPage.onHeader().iExecuteEdit();

      // Header Fields: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      When.onTheDetailPage.iTypeTextIntoTheElement("fe::EditableHeaderForm::EditableHeaderDescription::Field-edit", evilScriptTag + seed);
      When.onTheDetailPage.onFooter().iExecuteSave();

      // Error Message Popover: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      Then.onTheDetailPage.iShouldSeeTheElement("fe::FooterBar::MessageButton").and.iShouldSeeAFieldWithError("fe::EditableHeaderForm::EditableHeaderDescription::Field-edit");
    });

    //script tag in proficiency level name
    opaTest("Create proficiency level name with evil script tag, saving fails", function (Given, When, Then) {
      Given.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
      Given.onTheDetailPage.onHeader().iExecuteEdit();

      When.onTheDetailPage.iPressRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable",0);
      When.onTheSubObjectPage.onTable({ property: "texts" }).iExecuteCreate();
      When.onTheSubObjectPage.onTable({ property: "texts" })
        .iChangeRow(
          { "Proficiency Level Name": "", "Description": "" },
          { "Proficiency Level Name": evilScriptTag + seed, "Description": "b level description" + seed });
      When.onTheSubObjectPage.onTable({ property: "texts" })
        .iPressCell({
          "Proficiency Level Name": evilScriptTag + seed,
          "Description": "b level description" + seed
        },
        "Language")
        .and
        .iExecuteKeyboardShortcut("F4", {
          "Proficiency Level Name": evilScriptTag + seed,
          "Description": "b level description" + seed
        },
        "Language");
      When.onTheSubObjectPage.onValueHelpDialog().iSelectRows({ "Language Code": "de" });
      When.onTheSubObjectPage.onFooter().iExecuteApply();
      When.onTheDetailPage.onFooter().iExecuteSave();

      // Error Message Popover: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      Then.onTheDetailPage.iShouldSeeTheElement("fe::FooterBar::MessageButton");
    });

    opaTest("Navigate to subobject page, name field highlighted", function (Given, When, Then) {
      When.onTheDetailPage.iPressRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable",0);
      Then.onTheSubObjectPage.onTable({ property: "texts" }).iCheckRows(evilScriptTag + seed, {
        "Proficiency Level Name": {
          valueState: "Error"
        }
      });
    });

    // script tag in proficiency level description
    opaTest("Create proficiency level description with evil script tag, saving fails", function (Given, When, Then) {
      When.onTheShell.iNavigateBack();
      Given.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
      Given.onTheDetailPage.onHeader().iExecuteEdit();

      When.onTheDetailPage.iPressRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable",0);
      When.onTheSubObjectPage.onTable({ property: "texts" }).iExecuteCreate();
      When.onTheSubObjectPage.onTable({ property: "texts" })
        .iChangeRow(
          { "Proficiency Level Name": "", "Description": "" },
          { "Proficiency Level Name": "b level name", "Description": evilScriptTag + seed });
      When.onTheSubObjectPage.onTable({ property: "texts" })
        .iPressCell({
          "Proficiency Level Name": "b level name",
          "Description": evilScriptTag + seed
        },
        "Language")
        .and
        .iExecuteKeyboardShortcut("F4", {
          "Proficiency Level Name": "b level name",
          "Description": evilScriptTag + seed
        },
        "Language");
      When.onTheSubObjectPage.onValueHelpDialog().iSelectRows({ "Language Code": "de" });
      When.onTheSubObjectPage.onFooter().iExecuteApply();
      When.onTheDetailPage.onFooter().iExecuteSave();

      // Error Message Popover: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      Then.onTheDetailPage.iShouldSeeTheElement("fe::FooterBar::MessageButton");
    });

    opaTest("Navigate to subobject page, description field highlighted", function (Given, When, Then) {
      When.onTheDetailPage.iPressRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable",0);
      Then.onTheSubObjectPage.onTable({ property: "texts" }).iCheckRows(evilScriptTag + seed, {
        "Proficiency Level Name": {
          valueState: "Error"
        }
      });
    });

    // check no default language
    opaTest("Create proficiency level text without default language, saving fails", function (Given, When, Then) {
      When.onTheShell.iNavigateBack();
      When.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
      When.onTheDetailPage.onHeader().iExecuteEdit();
      When.onTheDetailPage.iPressRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable",0);
      When.onTheSubObjectPage.onTable({ property: "texts" })
        .iPressCell({
          "Proficiency Level Name": "a level name" + seed,
          "Description": "a level description" + seed
        },
        "Language")
        .and
        .iExecuteKeyboardShortcut("F4", {
          "Proficiency Level Name": "a level name" + seed,
          "Description": "a level description" + seed
        },
        "Language");
      When.onTheSubObjectPage.onValueHelpDialog().iSelectRows({ "Language Code": "de" });
      When.onTheSubObjectPage.onFooter().iExecuteApply();
      When.onTheDetailPage.onFooter().iExecuteSave();

      // Error Message Popover: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      Then.onTheDetailPage.iShouldSeeTheElement("fe::FooterBar::MessageButton").and.iShouldSeeAFieldWithError("fe::EditableHeaderForm::EditableHeaderTitle::Field-edit");
    });

    // check duplicate language
    opaTest("Create proficiency level text with duplicate language, saving fails", function (Given, When, Then) {
      Given.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
      Given.onTheDetailPage.onHeader().iExecuteEdit();

      When.onTheDetailPage.iPressRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable",0);
      When.onTheSubObjectPage.onTable({ property: "texts" }).iExecuteCreate();
      When.onTheSubObjectPage.onTable({ property: "texts" })
        .iChangeRow(
          { "Proficiency Level Name": "", "Description": "" },
          { "Proficiency Level Name": "b level name" + seed, "Description": "b level description" + seed });
      When.onTheSubObjectPage.onTable({ property: "texts" })
        .iPressCell({
          "Proficiency Level Name": "b level name" + seed,
          "Description": "b level description" + seed
        },
        "Language")
        .and
        .iExecuteKeyboardShortcut("F4", {
          "Proficiency Level Name": "b level name" + seed,
          "Description": "b level description" + seed
        },
        "Language");
      When.onTheSubObjectPage.onValueHelpDialog().iSelectRows({ "Language Code": "en" });
      When.onTheSubObjectPage.onFooter().iExecuteApply();
      When.onTheDetailPage.onFooter().iExecuteSave();

      // Error Message Popover: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      Then.onTheDetailPage.iShouldSeeTheElement("fe::FooterBar::MessageButton").and.iShouldSeeAFieldWithError("fe::EditableHeaderForm::EditableHeaderTitle::Field-edit");
    });

    // check duplicate name
    opaTest("Create duplicate proficiency level, saving fails", function (Given, When, Then) {

      Given.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
      Given.onTheDetailPage.onHeader().iExecuteEdit();

      When.onTheDetailPage.iPressRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable",0);
      When.onTheSubObjectPage.onTable({ property: "texts" }).iExecuteCreate();
      When.onTheSubObjectPage.onTable({ property: "texts" })
        .iChangeRow(
          { "Proficiency Level Name": "", "Description": "" },
          { "Proficiency Level Name": "a level name" + seed, "Description": "a level description" + seed, "Language": "en" });
      When.onTheSubObjectPage.onFooter().iExecuteApply();
      When.onTheDetailPage.onFooter().iExecuteSave();

      // Error Message Popover: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      Then.onTheDetailPage.iShouldSeeTheElement("fe::FooterBar::MessageButton").and.iShouldSeeAFieldWithError("fe::EditableHeaderForm::EditableHeaderTitle::Field-edit");
    });

    //check empty proficiency level text name
    opaTest("Clear proficiency level name, saving fails", function (Given, When, Then) {
      Given.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
      Given.onTheDetailPage.onHeader().iExecuteEdit();

      When.onTheDetailPage.iPressRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable",0);

      When.onTheSubObjectPage.onTable({ property: "texts" })
        .iChangeRow({ "Proficiency Level Name": "a level name" + seed, "Description": "a level description" + seed }, { "Proficiency Level Name": "", "Description": "a level description" + seed });
      When.onTheSubObjectPage.onFooter().iExecuteApply();
      When.onTheDetailPage.onFooter().iExecuteSave();

      Then.onTheDetailPage.iShouldSeeTheElement("fe::FooterBar::MessageButton");
    });

    //check empty proficiency set name
    opaTest("Clear proficiency set name, saving fails", function (Given, When, Then) {
      Given.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
      Given.onTheDetailPage.onHeader().iExecuteEdit();

      When.onTheDetailPage.iPressRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable",0);
      When.onTheSubObjectPage.onTable({ property: "texts" })
        .iChangeRow({ "Proficiency Level Name": "a level name" + seed, "Description": "a level description" + seed }, { "Proficiency Level Name": "level" + seed, "Description": "a level description" + seed });
      When.onTheShell.iNavigateBack();
      // Header Fields: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      When.onTheDetailPage.iTypeTextIntoTheElement("fe::EditableHeaderForm::EditableHeaderTitle::Field-edit", "");
      When.onTheDetailPage.onFooter().iExecuteSave();
      Then.onTheDetailPage.iShouldSeeTheElement("fe::FooterBar::MessageButton");
    });

    opaTest("Open default proficiency set, edit is disabled", function (Given, When, Then) {
      Given.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
      When.onTheShell.iNavigateBack();
      When.onTheMainPage.onTable().iPressRow({ "Proficiency Set": "Default" });
      Then.onTheDetailPage.onHeader().iCheckEdit({
        enabled: false
      });
    });

    opaTest("Duplicate name for proficiency set", function (Given, When, Then) {
      When.onTheShell.iNavigateBack();
      When.onTheMainPage.onTable().iExecuteCreate();
      When.onTheDetailPage
        .onActionDialog()
        .iChangeDialogField({ property: "name" }, "test_proficiency_name_error" + seed, true)
        .and.iChangeDialogField({ property: "description" }, "test description for dialog" + seed, true)
        .and.iConfirm();

      When.onTheDetailPage.iClickOnTheElement("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelCreateButton");
      // Add Data in fields
      When.onTheDetailPage.iTypeTextIntoProficiencyLevelCreateDialog("nameOfProficiencyLevel", "a level name" + seed);
      When.onTheDetailPage.iTypeTextIntoProficiencyLevelCreateDialog("descriptionOfProficiencyLevel", "a level description" + seed);

      // Click on Create button
      When.onTheDetailPage.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Create", enabled: true, type: ButtonType.Emphasized });
      When.onTheDetailPage.onFooter().iExecuteSave();

      // Error Message Popover: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      Then.onTheDetailPage.iShouldSeeTheElement("fe::FooterBar::MessageButton").and.iShouldSeeAFieldWithError("fe::EditableHeaderForm::EditableHeaderTitle::Field-edit");
    });

    opaTest("Teardown", function (Given, When, Then) {
      Given.iTearDownMyApp();
    });
  };
});
