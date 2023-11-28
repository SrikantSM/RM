sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
  "use strict";

  return function () {
    var seed = Math.random();

    QUnit.module("ManageCatalogs");

    opaTest("Open App (When I load the App, a list report shows the existing catalogs)", function (Given, When, Then) {
      Given.iResetTestData().and.iStartMyApp("SkillCatalog-Display");
      // Assertions
      Then.onTheMainPage.iSeeThisPage();
    });

    //Unit for MDI
    opaTest("OPA for MDI related entries", function (Given, When, Then) {
      Then.onTheMainPage.onTable().iCheckRows(2);
      Then.onTheMainPage.onTable().iCheckRows({
        "Catalog": "MDI catalog"
      });
      When.onTheMainPage.onTable().iPressRow(
        {
          "Catalog": "MDI catalog"
        }
      );
      Then.onTheDetailPage.onHeader().iCheckEdit({ visible: false });
      Then.onTheDetailPage.onHeader().iCheckDelete({ visible: false });
      When.onTheShell.iNavigateBack();
    });

    opaTest("Open Create Catalog Dialog (When I click on Create, I see the catalog creation dialog)", function (Given, When, Then) {
      When.onTheMainPage.onTable().iExecuteCreate();
      Then.onTheMainPage.onCreateDialog().iCheckState({ title: "Create" });
    });

    opaTest("Create Catalog via Dialog (When I fill out and submit the creation dialog, I see the catalog edit page)", function (Given, When, Then) {
      When.onTheDetailPage
        .onActionDialog()
        .iChangeDialogField({ property: "name" }, "test_catalog_name" + seed, true)
        .and.iChangeDialogField({ property: "description" }, "test description for dialog" + seed, true)
        .and.iConfirm();
      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Input", { value: "test_catalog_name" + seed }) // Header Fields: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
        .and.iShouldSeeTheElementTypeWithProperty("sap.m.TextArea", { value: "test description for dialog" + seed }) // Header Fields: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
        .and.iShouldSeeTheCurrentTimeInTheText("createdAt", 10)
        .and.iShouldSeeTheCurrentTimeInTheText("modifiedAt", 10)
        .and.iShouldSeeTheTextInTheText("modifiedBy", "ConfigurationExpert");
    });

    opaTest("Change catalog name and description (When I change name and description of the catalog, those are visible", function (Given, When, Then) {
      When.onTheDetailPage.iTypeTextIntoTheElement("fe::EditableHeaderForm::EditableHeaderTitle::Field-edit", "test_changed_catalog_name" + seed); // Header Fields: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      When.onTheDetailPage.iTypeTextIntoTheElement("fe::EditableHeaderForm::EditableHeaderDescription::Field-edit", "test_changed_description" + seed); // Header Fields: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Input", { value: "test_changed_catalog_name" + seed }); // Header Fields: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.TextArea", { value: "test_changed_description" + seed }); // Header Fields: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      Then.onTheDetailPage.onHeader().iCheckTitle("test_changed_catalog_name" + seed, "test_changed_description" + seed);
    });

    opaTest("Validate Changes on the List Report (On the List Page, I see that the new catalog is a draft and has correct properties)", function (Given, When, Then) {
      When.onTheShell.iNavigateBack();
      When.onTheDetailPage.onMessageDialog().iSelectDraftDataLossOption("draftDataLossOptionKeep").and.iConfirm();
      Then.onTheMainPage.onTable().iCheckRows({
        "Catalog": "test_changed_catalog_name" + seed,
        "Description": "test_changed_description" + seed
      });
      Then.onTheMainPage.iSeeDraftIndicator();
    });

    opaTest("Save catalog and validate name and description", function (Given, When, Then) {
      Given.onTheMainPage.onTable().iPressRow({ "Catalog": "test_changed_catalog_name" + seed });
      When.onTheDetailPage.onFooter().iExecuteSave();
      Then.onTheDetailPage.onHeader().iCheckEdit()
        .and.iCheckTitle("test_changed_catalog_name" + seed, "test_changed_description" + seed)
        .and.iCheckFieldInFieldGroup({ fieldGroup: "FieldGroup::AdministrativeData", field: "modifiedBy" }, "ConfigurationExpert");
      Then.onTheDetailPage.iShouldSeeTheCurrentTimeInTheText("modifiedAt", 10);
    });

    opaTest("Add a new line to assign a skill", function (Given, When, Then) {
      When.onTheDetailPage.onHeader().iExecuteEdit();
      When.onTheDetailPage.onTable({ property: "skillAssociations" }).iExecuteCreate();
      Then.onTheDetailPage.onTable({ property: "skillAssociations" }).iCheckRows(1);
    });

    opaTest("Save empty skill, saving fails", function (Given, When, Then) {
      When.onTheDetailPage.onFooter().iExecuteSave();
      Then.onTheDetailPage.onTable({ property: "skillAssociations" }).iCheckRows("", { "Skill": { state: "Error" } });
    });

    opaTest("Add skill name which not exist (When I enter a name for the label, I see an error", function (Given, When, Then) {
      When.onTheDetailPage.onTable({ property: "skillAssociations" }).iChangeRow({ "Skill": "" }, { "Skill": "non_existing_skill" + seed });
      Then.onTheDetailPage.onTable({ property: "skillAssociations" }).iCheckRows("non_existing_skill" + seed, { "Skill": { state: "Error" } });
    });

    opaTest("Add skill (When I click the Value Help button, I see a Value Help Dialog for the skill)", function (Given, When, Then) {
      When.onTheDetailPage.onTable({ property: "skillAssociations" }).iChangeRow({ "Skill": "" }, { "Skill": "" });
      When.onTheDetailPage.onTable({ property: "skillAssociations" })
        .iPressCell({ "Skill": "" }, "Skill")
        .and
        .iExecuteKeyboardShortcut("F4", { "Skill": "" }, "Skill");
      Then.onTheDetailPage.onValueHelpDialog().iCheckState({ title: "Skill" });
    });

    opaTest("Select skill from Dialog (When I select a skill from the Value Help Dialog, the skill is selected)", function (Given, When, Then) {
      When.onTheDetailPage.onValueHelpDialog().iSelectRows({ "Skill": "skill for catalog opa tests" });
      Then.onTheDetailPage.onTable({ property: "skillAssociations" }).iCheckRows({
        "Skill": "skill for catalog opa tests",
        "Description": "skill for catalog opa tests description"
      });
    });

    opaTest("Add a new line to assign a skill", function (Given, When, Then) {
      When.onTheDetailPage.onTable({ property: "skillAssociations" }).iExecuteCreate();
      Then.onTheDetailPage.onTable({ property: "skillAssociations" }).iCheckRows(2);
    });

    opaTest("Add skill (When I click the Value Help button, I see a Value Help Dialog for the skill)", function (Given, When, Then) {
      When.onTheDetailPage.onTable({ property: "skillAssociations" })
        .iPressCell({ "Skill": "", "Description": "" }, "Skill")
        .and
        .iExecuteKeyboardShortcut("F4", { "Skill": "", "Description": "" }, "Skill");
      Then.onTheDetailPage.onValueHelpDialog().iCheckState({ title: "Skill" });
    });

    opaTest("Select the skill from Dialog twice (When I select a skill from the Value Help Dialog, the skill is selected)", function (Given, When, Then) {
      When.onTheDetailPage.onValueHelpDialog().iSelectRows({ "Skill": "skill for catalog opa tests" });
      Then.onTheDetailPage.onTable({ property: "skillAssociations" }).iCheckRows({
        "Skill": "skill for catalog opa tests"
      });
    });

    opaTest("Save catalog one skill twice, saving fails", function (Given, When, Then) {
      When.onTheDetailPage.onFooter().iExecuteSave();
      Then.onTheDetailPage.onTable({ property: "skillAssociations" }).iCheckRows("skill for catalog opa tests", { "Skill": { state: "Error" } });
    });

    opaTest("Delete duplicate skill name", function (Given, When, Then) {
      When.onTheDetailPage.onTable({ property: "skillAssociations" }).iSelectRows({ "Skill": "skill for catalog opa tests" })
        .and.iExecuteDelete(); // both skills are named the same, so this will now delete both
      When.onTheDetailPage.onDialog().iConfirm();
      // recreate
      When.onTheDetailPage.onTable({ property: "skillAssociations" }).iExecuteCreate()
        .and.iChangeRow({ "Skill": "" }, { "Skill": "skill for catalog opa tests" });
      When.onTheDetailPage.onFooter().iExecuteSave();
      Then.onTheDetailPage.onTable({ property: "skillAssociations" }).iCheckRows(1);
    });

    opaTest("Cancel editing on Object Page", function (Given, When, Then) {
      When.onTheDetailPage.onHeader().iExecuteEdit();
      When.onTheDetailPage.iTypeTextIntoTheElement("fe::EditableHeaderForm::EditableHeaderDescription::Field-edit", "change_to_discard" + seed); // Header Fields: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      When.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
      Then.onTheDetailPage.onHeader().iCheckTitle("test_changed_catalog_name" + seed, "test_changed_description" + seed);
    });

    opaTest("Effect of cancel editing on List Report", function (Given, When, Then) {
      When.onTheShell.iNavigateBack();
      Then.onTheMainPage.onTable().iCheckRows({
        "Catalog": "test_changed_catalog_name" + seed,
        "Description": "test_changed_description" + seed
      });
    });

    opaTest("Search for catalog", function (Given, When, Then) {
      When.onTheMainPage.iCollapseExpandPageHeader();
      When.onTheMainPage.onFilterBar().iChangeFilterField("Editing Status", "All") // import sap/fe/test/api/EditState and use iChangeEditingStatus(EditState.All)
        .and.iChangeSearchField("test_changed_catalog_name" + seed)
        .and.iExecuteSearch();
      Then.onTheMainPage.onTable().iCheckRows({
        "Catalog": "test_changed_catalog_name" + seed,
        "Description": "test_changed_description" + seed
      }, 1);
    });

    opaTest("See delete confirmation popup when deleting a catalog", function (Given, When, Then) {
      When.onTheMainPage.onTable().iSelectRows({ "Catalog": "test_changed_catalog_name" + seed })
        .and.iExecuteDelete();
      Then.onTheMainPage.onDialog().iCheckState({ title: "Delete", state: "Warning" });
    });

    opaTest("Deleting catalog with assigned skills not possible", function (Given, When, Then) {
      When.onTheMainPage.onDialog().iConfirm();
      Then.onTheMainPage.onMessageDialog().iCheckState({ state: "Error" });
    });

    opaTest("Delete assigned skill", function (Given, When, Then) {
      Given.onTheMainPage.onDialog().iConfirm();
      Given.onTheMainPage.onTable().iPressRow({ "Catalog": "test_changed_catalog_name" + seed });
      Given.onTheDetailPage.onHeader().iExecuteEdit();
      When.onTheDetailPage.onTable({ property: "skillAssociations" }).iSelectRows({ "Skill": "skill for catalog opa tests" })
        .and.iExecuteDelete();
      When.onTheDetailPage.onDialog().iConfirm();
      When.onTheDetailPage.onFooter().iExecuteSave();
      Then.onTheDetailPage.onTable({ property: "skillAssociations" }).iCheckRows(0);
    });

    opaTest("See delete confirmation popup when deleting a catalog", function (Given, When, Then) {
      When.onTheShell.iNavigateBack();
      // Temporary fix for 1.108.11 starts
      When.onTheMainPage.iUnselectRow();
      When.onTheMainPage.iSelectTheRow();
      // Temporary fix for 1.108.11 ends
      When.onTheMainPage.onTable().iExecuteDelete();
      Then.onTheMainPage.onDialog().iCheckState({ title: "Delete", state: "Warning" });
    });

    opaTest("Delete catalog successfully", function (Given, When, Then) {
      When.onTheMainPage.onDialog().iConfirm();
      Then.iSeeMessageToast("Object deleted.");// Text is mandatory
      When.onTheMainPage.onFilterBar().iChangeFilterField("Editing Status", "All") // import sap/fe/test/api/EditState and use iChangeEditingStatus(EditState.All)
        .and.iChangeSearchField("")
        .and.iExecuteSearch();
    });

    opaTest("Create Catalog via Dialog with a forbidden first character in the catalog name", function (Given, When, Then) {
      When.onTheMainPage.onTable().iExecuteCreate();
      When.onTheDetailPage
        .onActionDialog()
        .iChangeDialogField({ property: "name" }, "@evilCsvInjection" + seed, true)
        .and.iChangeDialogField({ property: "description" }, "test description for dialog" + seed, true)
        .and.iConfirm();
      When.onTheDetailPage.onFooter().iExecuteSave();

      // Header Fields & Message Popover: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      Then.onTheDetailPage.iShouldSeeTheElement("fe::FooterBar::MessageButton")
        .and.iShouldSeeTheElement("fe::EditableHeaderForm::EditableHeaderTitle::Field-edit", { state: "Error" });
    });

    opaTest("Cleanup evil catalog", function (Given, When, Then) {
      When.onTheDetailPage.onFooter().iExecuteCancel();
      Then.onTheMainPage.iSeeThisPage();
    });

    opaTest("Teardown", function (Given, When, Then) {
      Given.iTearDownMyApp();
    });
  };
});
