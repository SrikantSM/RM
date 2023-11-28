sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/opaQunit"
], function (Opa5, opaTest) {
  "use strict";

  return function () {

    QUnit.module("ManageSkills Actions");
    /**
     * This journey tests
     * - Restriction
     * - Catalog Assignment
     */

    opaTest("Open App", function (Given, When, Then) {
      Given.iResetTestData().and.iStartMyApp("Skill-Display");
      Then.onTheShell.iSeeShellAppTitle("Manage Skills");
      Then.onTheMainPage.onTable().iCheckRows();
    });

    /**
     * Restriction
     */
    opaTest("Search for skill", function (Given, When, Then) {
      Given.onTheMainPage.iCollapseExpandPageHeader(false);
      When.onTheMainPage.onFilterBar().iChangeSearchField("skill for skill opa tests")
        .and.iExecuteSearch();
      Then.onTheMainPage.onTable().iCheckRows({ "ID": "skill for skill opa tests" });
    });

    opaTest("Should restrict the skill", function (Given, When, Then) {
      Given.onTheMainPage.onTable().iPressRow(0);
      When.onTheDetailPage.onHeader().iExecuteAction("Restrict");
      Then.onTheDetailPage.onConfirmationDialog().iCheckState({ title: "Confirmation" });
    });

    opaTest("Should cancel the confirmation dialog for restricting skill", function (Given, When, Then) {
      When.onTheDetailPage.onConfirmationDialog().iCancel();
      Then.onTheDetailPage.onHeader().iCheckAction("Remove Restriction", { visible: false });
    });

    opaTest("Should restrict the skill again", function (Given, When, Then) {
      When.onTheDetailPage.onHeader().iExecuteAction("Restrict");
      Then.onTheDetailPage.onConfirmationDialog().iCheckState({ title: "Confirmation" });
      When.onTheDetailPage.onConfirmationDialog().iConfirm();
      Then.onTheDetailPage.onHeader().iCheckAction("Restrict", { visible: false });
    });

    opaTest("Should see the restricted skill in the list report", function (Given, When, Then) {
      When.onTheShell.iNavigateBack();
      Then.onTheMainPage.onTable().iCheckRows(0, { lifecycleStatus: "Restricted" });
    });

    opaTest("Should unrestrict the skill", function (Given, When, Then) {
      Given.onTheMainPage.onTable().iPressRow(0);
      When.onTheDetailPage.onHeader().iExecuteAction("Remove Restriction");
      Then.onTheDetailPage.onConfirmationDialog().iCheckState({ title: "Confirmation" });
    });

    opaTest("Remove Restriction button should be hidden", function (Given, When, Then) {
      When.onTheDetailPage.onConfirmationDialog().iConfirm();
      Then.onTheDetailPage.onHeader().iCheckAction("Remove Restriction", { visible: false });
    });

    opaTest("Should see the unrestricted skill in the list report", function (Given, When, Then) {
      When.onTheShell.iNavigateBack();
      Then.onTheMainPage.onTable().iCheckRows(0, { lifecycleStatus: "Unrestricted" });
    });

    /**
     * Catalog Assignment
     */

    opaTest("On the object page of the test skill, we see the assigned catalog", function (Given, When, Then) {
      Given.onTheMainPage.onFilterBar().iChangeFilterField({ property: "name" }, "skill for skill opa tests")
        .and.iExecuteSearch();
      When.onTheMainPage.onTable().iPressRow({ "ID": "skill for skill opa tests" });
      Then.onTheDetailPage.onTable({ property: "catalogAssociations" }).iCheckRows({ "catalog_ID": "catalog for skill opa tests" });
    });

    opaTest("On the object page of the test skill, we see the assign and unassign catalog buttons", function (Given, When, Then) {
      Then.onTheDetailPage.onTable({ property: "catalogAssociations" }).iCheckAction("Remove", { visible: true });
      Then.onTheDetailPage.onTable({ property: "catalogAssociations" }).iCheckAction("Add", { visible: true });
    });

    opaTest("On the object page of the test skill, we see the unassign catalog dialog", function (Given, When, Then) {
      When.onTheDetailPage.onTable({ property: "catalogAssociations" }).iExecuteAction("Remove");
      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Title", { text: "Remove" });
    });

    opaTest("On the object page of the test skill, we see no assigned catalogs", function (Given, When, Then) {
      When.onTheMainPage.iClickOnTheElementTypeWithProperty("sap.m.StandardListItem", { title: "catalog for skill opa tests" })
        .and.iClickTheDialogButton("Emphasized");
      Then.onTheDetailPage.onTable({ property: "catalogAssociations" }).iCheckRows(0);
    });

    // opaTest("On the object page of the test skill, we see the unassign catalog dialog with no catalogs", function (Given, When, Then) {
    //   When.onTheDetailPage.onTable({ property: "catalogAssociations" }).iExecuteAction("Remove");
    //   Then.onTheDetailPage.iShouldSeeTheListRows("catalogAssignmentDialog-list", 0);
    //   Given.onTheMainPage.iClickTheDialogButton("Default");
    // });

    opaTest("On the object page of the test skill, we see the assign catalog dialog", function (Given, When, Then) {
      When.onTheDetailPage.onTable({ property: "catalogAssociations" }).iExecuteAction("Add");
      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Title", { text: "Add" });
    });

    opaTest("On the object page of the test skill, we see the assigned catalog", function (Given, When, Then) {
      When.onTheMainPage.iClickOnTheElementTypeWithProperty("sap.m.StandardListItem", { title: "catalog for skill opa tests" })
        .and.iClickTheDialogButton("Emphasized");
      Then.onTheDetailPage.onTable({ property: "catalogAssociations" }).iCheckRows(1);
    });

    opaTest("On the object page of the test skill, we see not the assign and unassign catalog buttons in edit mode", function (Given, When, Then) {
      When.onTheDetailPage.onHeader().iExecuteAction("Edit");
      Then.onTheDetailPage.onTable({ property: "catalogAssociations" }).iCheckAction("Add", { visible: false });
      Then.onTheDetailPage.onTable({ property: "catalogAssociations" }).iCheckAction("Remove", { visible: false });
    });

    opaTest("Teardown", function (Given, When, Then) {
      Given.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
      Given.iTearDownMyApp();
    });
  };
});
