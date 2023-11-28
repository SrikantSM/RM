sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/opaQunit","sap/m/ButtonType"
], function (Opa5, opaTest, ButtonType) {
  "use strict";

  return function () {
    var seed = Math.random();

    QUnit.module("ManageProficiencies");

    opaTest("Open App (When I load the App, a list report shows the existing proficiency sets)", function (Given, When, Then) {
      Given.iResetTestData().and.iStartMyApp("Proficiency-Display");
      // Assertions
      Then.onTheMainPage.iSeeThisPage();
    });

    opaTest("Open create proficiency dialog (When I click on Create, I see the proficiency creation dialog)", function (Given, When, Then) {
      When.onTheMainPage.onTable().iExecuteCreate();
      Then.onTheMainPage.onCreateDialog().iCheckState({ title: "Create" });
    });

    opaTest("Create proficiency via dialog (When I fill out and submit the creation dialog, I see the proficiency edit page)", function (Given, When, Then) {
      When.onTheDetailPage
        .onActionDialog()
        .iChangeDialogField({ property: "name" }, "test_proficiency_name" + seed, true)
        .and.iChangeDialogField({ property: "description" }, "test description for dialog" + seed, true)
        .and.iConfirm();

      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.TextArea", { value: "test description for dialog" + seed })
        .and.iShouldSeeTheElementTypeWithProperty("sap.m.Input", { value: "test_proficiency_name" + seed })
        .and.iShouldSeeTheCurrentTimeInTheText("createdAt", 10)
        .and.iShouldSeeTheCurrentTimeInTheText("modifiedAt", 10)
        .and.iShouldSeeTheTextInTheText("modifiedBy", "ConfigurationExpert");
    });

    opaTest("Change proficiency name and description (When I change name and description of the proficiency, those are visible", function (Given, When, Then) {
      When.onTheDetailPage.iTypeTextIntoTheElement("fe::EditableHeaderForm::EditableHeaderTitle::Field-edit", "test_changed_proficiency_name" + seed)
        .and.iTypeTextIntoTheElement("fe::EditableHeaderForm::EditableHeaderDescription::Field-edit", "test_changed_description" + seed);
      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.TextArea", { value: "test_changed_description" + seed })
        .and.onHeader().iCheckTitle("test_changed_proficiency_name" + seed);
    });

    opaTest("Validate changes on the list report (on the list page, I see that the new proficiency is a draft and has correct properties)", function (Given, When, Then) {
      When.onTheShell.iNavigateBack();
      When.onTheDetailPage.onMessageDialog().iSelectDraftDataLossOption("draftDataLossOptionKeep").and.iConfirm();
      Then.onTheMainPage.onTable().iCheckRows({
        "Proficiency Set": "test_changed_proficiency_name" + seed,
        "Description": "test_changed_description" + seed
      });
      Then.onTheMainPage.iSeeDraftIndicator();
    });

    opaTest("Create proficiency level and check header title", function (Given, When, Then) {
      Given.onTheMainPage.onTable().iPressRow({ "Proficiency Set": "test_changed_proficiency_name" + seed });
      When.onTheDetailPage.iClickOnTheElement("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelCreateButton");

      // Validate Create button is disabled

      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Input", { value: "en", enabled: false }, true);
      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Create", enabled: false, type: ButtonType.Emphasized }, true);

      // Add data in name field
      When.onTheDetailPage.iTypeTextIntoProficiencyLevelCreateDialog("nameOfProficiencyLevel", "a level name" + seed);

      // Validate Create button is disabled
      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Create", enabled: false, type: ButtonType.Emphasized }, true);

      // Add data in description field
      When.onTheDetailPage.iTypeTextIntoProficiencyLevelCreateDialog("descriptionOfProficiencyLevel", "a level description" + seed);

      // Click on Create button
      When.onTheDetailPage.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Create", enabled: true, type: ButtonType.Emphasized });

      // Navigate to subobject page
      When.onTheDetailPage.iPressRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable",0);

      Then.onTheSubObjectPage.onHeader().iCheckTitle("a level name" + seed, "a level description" + seed);
    });

    opaTest("Create another proficiency level text and check languages column", function (Given, When, Then) {
      When.onTheSubObjectPage.onTable({ property: "texts" }).iExecuteCreate();
      When.onTheSubObjectPage.onTable({ property: "texts" }).iChangeRow(
        { "Proficiency Level Name": "", "Description": "" },
        { "Proficiency Level Name": "a level name de" + seed, "Description": "a level description de" + seed, "Language": "de" });

      When.onTheSubObjectPage.onTable({ property: "texts" }).iSelectAllRows();

      When.onTheSubObjectPage.onFooter().iExecuteApply();

      Then.onTheDetailPage.iCheckRowCount("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 1);
      Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0,
        {
          "Proficiency Level Name": "a level name" + seed,
          "Description": "a level description" + seed,
          "Languages": "de, en"
        });
    });

    opaTest("Check create dialog is state", function (Given, When, Then) {
      When.onTheDetailPage.iClickOnTheElement("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelCreateButton");
      // Langugae should be filled
      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Input", { value: "en", enabled: false }, true);
      // name should be empty
      Then.onTheDetailPage.iShouldSeeTheElementTypeWithIdAndProperty("nameOfProficiencyLevel", { value: "", enabled: true });
      // description should be empty
      Then.onTheDetailPage.iShouldSeeTheElementTypeWithIdAndProperty("descriptionOfProficiencyLevel", { value: "", enabled: true });
      // Create Button Should be disabled
      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Create", enabled: false, type: ButtonType.Emphasized }, true);
      // Click on Cancel button
      When.onTheDetailPage.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Cancel", enabled: true });
    });

    opaTest("Save the new proficiency and validate name, description and languages column", function (Given, When, Then) {
      When.onTheDetailPage.onFooter().iExecuteSave();
      Then.onTheDetailPage.onHeader().iCheckEdit()
        .and.iCheckTitle("test_changed_proficiency_name" + seed, "test_changed_description" + seed);
      Then.onTheDetailPage.iShouldSeeTheCurrentTimeInTheText("modifiedAt", 10)
        .and.iShouldSeeTheTextInTheText("modifiedBy", "ConfigurationExpert");

      Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0,{
        "Proficiency Level Name": "a level name" + seed,
        "Description": "a level description" + seed,
        "Languages": "de, en"
      });
    });

    opaTest("Open proficiency set and check data", function (Given, When, Then) {
      When.onTheShell.iNavigateBack();
      When.onTheMainPage.onTable().iPressRow({ "Proficiency Set": "Proficiency Set 1" });
      Then.onTheDetailPage.onHeader().iCheckTitle("Proficiency Set 1", "Description Proficiency Set 1");
      Then.onTheDetailPage.iCheckRowCount("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 3);
      Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0, {
        "Proficiency Level Name": "Proficiency Level 1.3",
        "Description": "Description Proficiency Level 1.3",
        "Level": "3"
      });
    });

    opaTest("Add new proficiency level", function (Given, When, Then) {
      When.onTheDetailPage.onHeader().iExecuteEdit();
      When.onTheDetailPage.iClickOnTheElement("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelCreateButton");
    });

    opaTest("Add name and description (When I enter a name and description for the proficiency level, the name and description are visible", function (Given, When, Then) {

      // Validate Create button is disabled
      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Create", enabled: false, type: ButtonType.Emphasized }, true);
      // Add Data in fields
      When.onTheDetailPage.iTypeTextIntoProficiencyLevelCreateDialog("nameOfProficiencyLevel", "test_add_proficiencyLevel_name" + seed);

      // Validate Create button is disabled
      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Create", enabled: false, type: ButtonType.Emphasized }, true);
      When.onTheDetailPage.iTypeTextIntoProficiencyLevelCreateDialog("descriptionOfProficiencyLevel", "test_add_description" + seed);

      // Click on Create button
      When.onTheDetailPage.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Create", enabled: true, type: ButtonType.Emphasized });
    });

    opaTest("Check Created Proficiency Level", function (Given, When, Then) {
      Then.onTheDetailPage.iCheckRowCount("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 4);
      Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0, {
        "Proficiency Level Name": "test_add_proficiencyLevel_name" + seed,
        "Description": "test_add_description" + seed
      });
    });

    opaTest("Move level down", function (Given, When, Then) {
      When.onTheDetailPage.iSelectRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0);
      When.onTheDetailPage.iClickOnTheElement("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveDownButton");
      Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 1, {
        "Proficiency Level Name": "test_add_proficiencyLevel_name" + seed,
        "Description": "test_add_description" + seed,
        "Level": "3"
      });
    });

    opaTest("Cancel move level", function (Given, When, Then) {
      When.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
      Then.onTheDetailPage.iCheckRowCount("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 3);
      Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 2, {
        "Proficiency Level Name": "Proficiency Level 1.1",
        "Description": "Description Proficiency Level 1.1",
        "Level": "1"
      });
      Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 1, {
        "Proficiency Level Name": "Proficiency Level 1.2",
        "Description": "Description Proficiency Level 1.2",
        "Level": "2"
      });
      Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0, {
        "Proficiency Level Name": "Proficiency Level 1.3",
        "Description": "Description Proficiency Level 1.3",
        "Level": "3"
      });
    });

    opaTest("Move level up", function (Given, When, Then) {
      When.onTheDetailPage.onHeader().iExecuteEdit();
      When.onTheDetailPage.iSelectRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 1);
      When.onTheDetailPage.iClickOnTheElement("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveUpButton");
      Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0, {
        "Proficiency Level Name": "Proficiency Level 1.2",
        "Description": "Description Proficiency Level 1.2",
        "Level": "3"
      });
    });

    opaTest("Check level data", function (Given, When, Then) {
      When.onTheDetailPage.iPressRowInCustomSection("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0);
      Then.onTheSubObjectPage.onHeader().iCheckTitle("Proficiency Level 1.2", "Description Proficiency Level 1.2");
    });

    opaTest("Cancel move level", function (Given, When, Then) {
      When.onTheShell.iNavigateBack();
      When.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
      Then.onTheDetailPage.iCheckRowCount("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 3);
      Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0, {
        "Proficiency Level Name": "Proficiency Level 1.3",
        "Description": "Description Proficiency Level 1.3",
        "Level": "3"
      });
    });

    opaTest("Create maximum count of proficiency levels", function (Given, When, Then) {
      When.onTheShell.iNavigateBack();
      //  "Proficiency Set 3" already has MAX_COUNT - 1 levels
      When.onTheMainPage.onTable().iPressRow({ "Proficiency Set": "Proficiency Set 3" });
      When.onTheDetailPage.onHeader().iExecuteEdit();

      When.onTheDetailPage.iClickOnTheElement("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelCreateButton");

      // Add Data in fields
      When.onTheDetailPage.iTypeTextIntoProficiencyLevelCreateDialog("nameOfProficiencyLevel", "a level name" + seed);
      When.onTheDetailPage.iTypeTextIntoProficiencyLevelCreateDialog("descriptionOfProficiencyLevel", "a level description" + seed);

      // Click on Create button
      When.onTheDetailPage.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Create", enabled: true, type: ButtonType.Emphasized });

      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Create", enabled: false }, true);
    });

    opaTest("Cancel maximun count of proficiency levels", function (Given, When, Then) {
      When.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
      Then.onTheDetailPage.iCheckRowCount("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 49);
      Then.onTheDetailPage.iCheckRowContent("fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable", 0, {
        "Proficiency Level Name": "Proficiency Level 3.49",
        "Description": "Description Proficiency Level 3.49",
        "Level": "49"
      });
    });

    //Unit for MDI
    opaTest("OPA for MDI related entries", function (Given, When, Then) {
      /*Then.onTheDetailPage.onHeader().iCheckEdit({ visible: true });
      Then.onTheDetailPage.onHeader().iCheckDelete({ visible: true });*/
      When.onTheShell.iNavigateBack();
      Then.onTheMainPage.onTable().iCheckRows({
        "Proficiency Set": "MDI Proficiency Set",
        "Description": "MDI Prof Set Description"
      });
      When.onTheMainPage.onTable().iPressRow(
        {
          "Proficiency Set": "MDI Proficiency Set"
        }
      );
      Then.onTheDetailPage.onHeader().iCheckEdit({ visible: false });
    });

    opaTest("Teardown", function (Given, When, Then) {
      Given.iTearDownMyApp();
    });
  };
});
