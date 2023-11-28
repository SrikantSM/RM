sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/opaQunit"
], function (Opa5, opaTest) {
  "use strict";

  return function () {
    var seed = Math.random();

    var name1 = "n1" + seed;
    var desc1 = "d1" + seed;
    var name2 = "n2" + seed;
    var desc2 = "d2" + seed;
    var label1 = "l1" + seed;
    var nameHTML = "<b>n" + seed;
    var descHTML = "<b>d" + seed;
    var nameCSV = "@n" + seed;
    var descCSV = "@d" + seed;
    var labelHTML = "<b>l" + seed;
    var labelCSV = "@l" + seed;

    var invalidLocale1 = "xy";
    var invalidLocale2 = "yz";

    QUnit.module("ManageSkills Errors");
    /**
     * This journey tests
     * - Error Cases on Skill Save
     */

    opaTest("Open App", function (Given, When, Then) {
      Given.iResetTestData().and.iStartMyApp("Skill-Display");
      Then.onTheShell.iSeeShellAppTitle("Manage Skills");
      Then.onTheMainPage.onTable().iCheckRows();
    });

    opaTest("Create entity to work on", function (Given, When, Then) {
      When.onTheMainPage.onTable().iExecuteCreate();
      When.onTheDetailPage
        .onActionDialog()
        .iChangeDialogField({ property: "label" }, name1, true)
        .and.iChangeDialogField({ property: "description" }, desc1, true)
        .and.iConfirm();
      Then.onTheDetailPage.onFooter().iCheckAction("Create", { visible: true });
    });

    /**
     * CAP Errors -> with Dialog
     */
    opaTest("Empty Name", function (Given, When, Then) {
      // Header Fields: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      Given.onTheDetailPage.iTypeTextIntoTheElement("fe::HeaderFacet::FormContainer::FieldGroup::ProficiencySet::FormElement::DataField::proficiencySet_ID::Field-edit", "Proficiency Set 1");

      Given.onTheDetailPage.onTable({ property: "texts" }).iChangeRow({
        "Skill Name": name1,
        "Description": desc1,
        "Language": "en"
      }, {
        "Skill Name": "",
        "Description": desc1,
        "Language": "en"
      });
      When.onTheDetailPage.onFooter().iExecuteSave();
      Then.onTheDetailPage.iShouldSeeTheElement("fe::FooterBar::MessageButton");
    });

    opaTest("Empty Description", function (Given, When, Then) {
      // Cleanup
      Given.onTheDetailPage.onTable({ property: "texts" }).iChangeRow({
        "Skill Name": "",
        "Description": desc1,
        "Language": "en"
      }, {
        "Skill Name": name1,
        "Description": "",
        "Language": "en"
      });
      // New Test
      When.onTheDetailPage.onFooter().iExecuteSave();
      Then.onTheDetailPage.iShouldSeeTheElement("fe::FooterBar::MessageButton");
    });

    opaTest("Empty Alternative Label", function (Given, When, Then) {
      // Cleanup
      Given.onTheDetailPage.onTable({ property: "texts" }).iChangeRow({
        "Skill Name": name1,
        "Description": "",
        "Language": "en"
      }, {
        "Skill Name": name1,
        "Description": desc1,
        "Language": "en"
      });
      // New Test
      Given.onTheDetailPage.onTable({ property: "alternativeLabels" }).iExecuteCreate();
      When.onTheDetailPage.onFooter().iExecuteSave();
      Then.onTheDetailPage.iShouldSeeTheElement("fe::FooterBar::MessageButton");
    });

    /**
     * no text in default language --> Message without Target
     */
    opaTest("No text in default language", function (Given, When, Then) {
      // Cleanup
      // New Test
      Given.onTheDetailPage.onTable({ property: "texts" }).iChangeRow({
        "Skill Name": name1,
        "Description": desc1,
        "Language": "en"
      }, {
        "Skill Name": name1,
        "Description": desc1,
        "Language": "de"
      });
      When.onTheDetailPage.onFooter().iExecuteSave();
      // Error Message Popover: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      Then.onTheDetailPage.iShouldSeeTheElement("fe::FooterBar::MessageButton");
    });

    /**
     * Full Error Scenario
     */
    opaTest("Error Messaging", function (Given, When, Then) {
      // Text EN
      Given.onTheDetailPage.onTable({ property: "texts" }).iChangeRow({
        "Skill Name": name1,
        "Description": desc1,
        "Language": "de"
      }, {
        "Skill Name": name1,
        "Description": desc1,
        "Language": "en"
      });
      // Text EN duplicate locale
      Given.onTheDetailPage.onTable({ property: "texts" }).iExecuteCreate();
      Given.onTheDetailPage.onTable({ property: "texts" }).iChangeRow({
        "Skill Name": "",
        "Description": "",
        "Language": ""
      }, {
        "Skill Name": name2,
        "Description": desc2,
        "Language": "en"
      });
      // Text XY invalid locale + HTML injection name / description
      Given.onTheDetailPage.onTable({ property: "texts" }).iExecuteCreate();
      Given.onTheDetailPage.onTable({ property: "texts" }).iChangeRow({
        "Skill Name": "",
        "Description": "",
        "Language": ""
      }, {
        "Skill Name": nameHTML,
        "Description": descHTML,
        "Language": invalidLocale1
      });
      // Text YZ invalid locale + CSV injection name / description
      Given.onTheDetailPage.onTable({ property: "texts" }).iExecuteCreate();
      Given.onTheDetailPage.onTable({ property: "texts" }).iChangeRow({
        "Skill Name": "",
        "Description": "",
        "Language": ""
      }, {
        "Skill Name": nameCSV,
        "Description": descCSV,
        "Language": invalidLocale2
      });
      Given.onTheDetailPage.onTable({ property: "alternativeLabels" }).iChangeRow({
        "Alternative Name": "",
        "Language": ""
      }, {
        "Alternative Name": label1,
        "Language": "de"
      });
      Given.onTheDetailPage.onTable({ property: "alternativeLabels" }).iExecuteCreate();
      Given.onTheDetailPage.onTable({ property: "alternativeLabels" }).iChangeRow({
        "Alternative Name": "",
        "Language": ""
      }, {
        "Alternative Name": name1,
        "Language": "en"
      });
      Given.onTheDetailPage.onTable({ property: "alternativeLabels" }).iExecuteCreate();
      Given.onTheDetailPage.onTable({ property: "alternativeLabels" }).iChangeRow({
        "Alternative Name": "",
        "Language": ""
      }, {
        "Alternative Name": labelHTML,
        "Language": invalidLocale1
      });
      // Label DE missing text for locale
      Given.onTheDetailPage.onTable({ property: "alternativeLabels" }).iExecuteCreate();
      Given.onTheDetailPage.onTable({ property: "alternativeLabels" }).iChangeRow({
        "Alternative Name": "",
        "Language": ""
      }, {
        "Alternative Name": labelCSV,
        "Language": invalidLocale2
      });

      // Action!
      When.onTheDetailPage.onFooter().iExecuteSave();
      // Error Message Popover: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/794
      Then.onTheDetailPage.iShouldSeeTheElement("fe::FooterBar::MessageButton"); // validate message count?

      // Text EN duplicate locale
      Then.onTheDetailPage.onTable({ property: "texts" }).iCheckRows("name2", { "Language": { state: "Error" } });
      // Text XY invalid locale + HTML injection name / description
      Then.onTheDetailPage.onTable({ property: "texts" }).iCheckRows(nameHTML, { "Skill Name": { state: "Error" } })
        .and.iCheckRows(invalidLocale1, { "Language": { state: "Error" } })
        .and.iCheckRows(descHTML, { "Description": { state: "Error" } });
      // Text YZ invalid locale + CSV injection name / description
      Then.onTheDetailPage.onTable({ property: "texts" }).iCheckRows(nameCSV, { "Skill Name": { state: "Error" } })
        .and.iCheckRows(invalidLocale2, { "Language": { state: "Error" } })
        .and.iCheckRows(descCSV, { "Description": { state: "Error" } });

      // Label DE missing text for locale
      Then.onTheDetailPage.onTable({ property: "alternativeLabels" }).iCheckRows("de", { "Alternative Name": { state: "Error" } });
      // Label EN duplicate name in locale
      Then.onTheDetailPage.onTable({ property: "alternativeLabels" }).iCheckRows(name1, { "Language": { state: "Error" } });
      // Label XY invalid locale + HTML injection name / description
      Then.onTheDetailPage.onTable({ property: "alternativeLabels" }).iCheckRows(labelHTML, { "Alternative Name": { state: "Error" } })
        .and.iCheckRows(invalidLocale1, { "Language": { state: "Error" } });
      // Label YZ invalid locale + CSV injection name / description
      Then.onTheDetailPage.onTable({ property: "alternativeLabels" }).iCheckRows(labelCSV, { "Alternative Name": { state: "Error" } })
        .and.iCheckRows(invalidLocale2, { "Language": { state: "Error" } });
    });

    opaTest("Teardown", function (Given, When, Then) {
      Given.iTearDownMyApp();
    });
  };
});
