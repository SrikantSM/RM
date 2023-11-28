sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/opaQunit"
], function (Opa5, opaTest) {
  "use strict";

  return function () {
    var seed = Math.random();

    QUnit.module("ManageSkills CRUDQ");
    /**
     * This journey tests
     * - Create/Read/Update/(Delete/)Query on Skills
     * - Admin Metadata
     */

    opaTest("Open App", function (Given, When, Then) {
      Given.iResetTestData().and.iStartMyApp("Skill-Display");
      // Assertions
      Then.onTheMainPage.iSeeThisPage();
    });

    opaTest("Open Create Skill Dialog (When I click on Create, I see the skill creation dialog and language is prefilled)", function (Given, When, Then) {
      When.onTheMainPage.onTable().iExecuteCreate();
      Then.onTheDetailPage
        .onActionDialog()
        .iCheckState({ title: "Create" })
        .and.iCheckDialogField({ property: "locale" }, "en", { editable : false });
    });

    opaTest("Create Skill via Dialog (When I fill out and submit the creation dialog, I see the skill edit page)", function (Given, When, Then) {
      When.onTheDetailPage
        .onActionDialog()
        .iChangeDialogField({ property: "label" }, "test_skill_name" + seed, true)
        .and.iChangeDialogField({ property: "description" }, "test description for dialog" + seed, true)
        .and.iConfirm();
      //Check skill texts
      Then.onTheDetailPage.onTable({ property: "texts" }).iCheckColumns(3)
        .and.iCheckColumns({
          "Skill Name": { headerVisible: true },
          "Language": { headerVisible: true },
          "Description": { headerVisible: true }
        })
        .and.iCheckRows({
          "Skill Name": "test_skill_name" + seed,
          "Description": "test description for dialog" + seed,
          "Language": "en"
        }, 1);
      //check alternative label table
      Then.onTheDetailPage.onTable({ property: "alternativeLabels" }).iCheckColumns(2)
        .and.iCheckColumns({
          "Alternative Name": { headerVisible: true },
          "Language": { headerVisible: true }
        })
        .and.iCheckRows(0);
      Then.onTheDetailPage
        .iShouldSeeTheCurrentTimeInTheText("createdAt", 10)
        .and.iShouldSeeTheCurrentTimeInTheText("modifiedAt", 10)
        .and.iShouldSeeTheTextInTheText("modifiedBy", "ConfigurationExpert");
    });

    opaTest("Change skill name and description (When I change name and description of the skill, those are visible", function (Given, When, Then) {
      When.onTheDetailPage.onTable({ property: "texts" }).iChangeRow({
        "Skill Name": "test_skill_name" + seed
      }, {
        "Skill Name": "test_changed_skill_name" + seed

      });
      When.onTheDetailPage.onTable({ property: "texts" }).iChangeRow({
        "Description": "test description for dialog" + seed
      }, {
        "Description": "test_changed_description" + seed
      });
      When.onTheDetailPage.onTable({ property: "texts" }).iSelectRows({
        "Skill Name": "test_changed_skill_name" + seed,
        "Description": "test_changed_description" + seed,
        "Language": "en"
      }).and.iSelectRows({
        "Skill Name": "test_changed_skill_name" + seed,
        "Description": "test_changed_description" + seed,
        "Language": "en"
      }); //workaround to trigger sideeffect as iChangeRow is not changing focus
      //Check OP Header Title + Description
      Then.onTheDetailPage.onHeader().iCheckTitle("test_changed_skill_name" + seed, "test_changed_description" + seed);
      Then.onTheDetailPage.onTable({ property: "texts" }).iCheckRows({
        "Skill Name": "test_changed_skill_name" + seed,
        "Description": "test_changed_description" + seed
      }, 1);
    });

    opaTest("Add a new line for name and description", function (Given, When, Then) {
      When.onTheDetailPage.onTable({ property: "texts" }).iExecuteCreate();
      Then.onTheDetailPage.onTable({ property: "texts" }).iCheckRows(2);
    });

    opaTest("Add name and description (When I enter a name and description for the skill, the name and description are visible", function (Given, When, Then) {
      When.onTheDetailPage.onTable({ property: "texts" }).iChangeRow({
        "Skill Name": "",
        "Description": "",
        "Language": ""
      },
      {
        "Skill Name": "test_changed_skill_name_2" + seed,
        "Description": "test_changed_description_2" + seed,
        "Language": ""
      });
      Then.onTheDetailPage.onTable({ property: "texts" }).iCheckRows({
        "Skill Name": "test_changed_skill_name_2" + seed,
        "Description": "test_changed_description_2" + seed,
        "Language": ""
      });
    });

    opaTest("Add language (When I click the Value Help button, I see a Value Help Dialog for the language)", function (Given, When, Then) {
      When.onTheDetailPage.onTable({ property: "texts" })
        .iPressCell({
          "Skill Name": "test_changed_skill_name_2" + seed
        },
        "Language")
        .and
        .iExecuteKeyboardShortcut("F4", { "Skill Name": "test_changed_skill_name_2" + seed }, "Language");
      Then.onTheDetailPage.onValueHelpDialog().iCheckState({ title: "Language" });
    });

    opaTest("Select language from Dialog (When I select a language from the Value Help Dialog, the language is selected)", function (Given, When, Then) {
      When.onTheDetailPage.onValueHelpDialog().iSelectRows({ "Language Code": "de" });
      Then.onTheDetailPage.onTable({ property: "texts" }).iCheckRows({
        "Skill Name": "test_changed_skill_name_2" + seed,
        "Language": "de"
      });
    });

    opaTest("Add alternative label (When i create new label, i should see the created label)", function (Given, When, Then) {
      When.onTheDetailPage.onTable({ property: "alternativeLabels" }).iExecuteCreate();
      Then.onTheDetailPage.onTable({ property: "alternativeLabels" }).iCheckRows(1);
    });

    opaTest("Add alternative label name (When I enter a name for the label, the name is visible", function (Given, When, Then) {
      When.onTheDetailPage.onTable({ property: "alternativeLabels" }).iChangeRow({
        "Alternative Name": "",
        "Language": ""
      },
      {
        "Alternative Name": "test_alternative_label" + seed,
        "Language": ""
      });
      Then.onTheDetailPage.onTable({ property: "alternativeLabels" }).iCheckRows({
        "Alternative Name": "test_alternative_label" + seed,
        "Language": ""
      });
    });

    opaTest("Add language (When I click the Value Help button, I see a Value Help Dialog for the language)", function (Given, When, Then) {
      When.onTheDetailPage.onTable({ property: "alternativeLabels" })
        .iPressCell({
          "Alternative Name": "test_alternative_label" + seed
        },
        "Language")
        .and
        .iExecuteKeyboardShortcut("F4", { "Alternative Name": "test_alternative_label" + seed }, "Language");
      Then.onTheDetailPage.onValueHelpDialog().iCheckState({ title: "Language" });
    });

    opaTest("Select language from Dialog (When I select a language from the Value Help Dialog, the language is selected)", function (Given, When, Then) {
      When.onTheDetailPage.onValueHelpDialog().iSelectRows({ "Language Code": "en" });
      Then.onTheDetailPage.onTable({ property: "alternativeLabels" }).iCheckRows({
        "Alternative Name": "test_alternative_label" + seed,
        "Language": "en"
      });
    });

    opaTest("Validate Changes on the List Report (On the List Page, I see that the new skill is a draft and has correct properties)", function (Given, When, Then) {
      When.onTheShell.iNavigateBack();
      When.onTheDetailPage.onMessageDialog().iSelectDraftDataLossOption("draftDataLossOptionKeep").and.iConfirm();
      Then.onTheMainPage.onTable().iCheckRows({
        "Skill": "test_changed_skill_name" + seed,
        "Description": "test_changed_description" + seed,
        "Alternative Names": "test_alternative_label" + seed,
        "Languages": "de, en"
      });
      Then.onTheMainPage.iSeeDraftIndicator();
    });

    opaTest("Save draft skill without proficiency set fails", function (Given, When, Then) {
      Given.onTheMainPage.onTable().iPressRow(
        {
          "Skill": "test_changed_skill_name" + seed
        }
      );
      When.onTheDetailPage.onFooter().iExecuteSave();
      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "1", type: "Negative" });
    });

    opaTest("Save draft skill with not existing proficiency set fails", function (Given, When, Then) {
      Given.onTheDetailPage.iTypeTextIntoTheElement("fe::HeaderFacet::FormContainer::FieldGroup::ProficiencySet::FormElement::DataField::proficiencySet_ID::Field-edit", "Test123");
      When.onTheDetailPage.onFooter().iExecuteSave();
      Then.onTheDetailPage.iShouldSeeAnErrorMessageItem();
    });

    opaTest("Enter a proficiency set and save successfully", function (Given, When, Then) {
      Given.onTheDetailPage.iClickOnTheElement("fe::FooterBar::MessageButton");
      When.onTheDetailPage.iTypeTextIntoTheElement("fe::HeaderFacet::FormContainer::FieldGroup::ProficiencySet::FormElement::DataField::proficiencySet_ID::Field-edit", "Proficiency Set 1");
      When.onTheDetailPage.onFooter().iExecuteSave();
      Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty("sap.m.Link", { text: "Proficiency Set 1" }); //it seems this is now rendered as a text instead of link, when no semantic object is available (which is the case during opa5 tests)
    });

    opaTest("Validate proficiency level on the objectpage", function (Given, When, Then) {
      When.onTheDetailPage.onHeader().iExecuteEdit();
      When.onTheDetailPage.iGoToSection("Proficiency Levels");
      Then.onTheDetailPage.onTable({ property: "proficiencySet::proficiencyLevels" }).iCheckRows({
        "Proficiency Level Name": "Proficiency Level 1.1",
        "Description": "Description Proficiency Level 1.1",
        "Level": "1"
      });
      Then.onTheDetailPage.onTable({ property: "proficiencySet::proficiencyLevels" }).iCheckRows({
        "Proficiency Level Name": "Proficiency Level 1.2",
        "Description": "Description Proficiency Level 1.2",
        "Level": "2"
      });
      Then.onTheDetailPage.onTable({ property: "proficiencySet::proficiencyLevels" }).iCheckRows({
        "Proficiency Level Name": "Proficiency Level 1.3",
        "Description": "Description Proficiency Level 1.3",
        "Level": "3"
      });
    });

    opaTest("Add duplicate alternative label, saving succeeds", function (Given, When, Then) {
      When.onTheShell.iNavigateBack();
      When.onTheDetailPage.onMessageDialog().iSelectDraftDataLossOption("draftDataLossOptionKeep").and.iConfirm();
      Given.onTheMainPage.onTable().iPressRow(
        {
          "Alternative Names": "test_alternative_label" + seed
        }
      );
      When.onTheDetailPage.onTable({ property: "alternativeLabels" }).iExecuteCreate();
      When.onTheDetailPage.onTable({ property: "alternativeLabels" }).iChangeRow({
        "Alternative Name": "",
        "Language": ""
      },
      {
        "Alternative Name": "test_alternative_label" + seed,
        "Language": "en"
      });
      When.onTheDetailPage.onFooter().iExecuteSave();
      Then.onTheDetailPage.onHeader().iCheckEdit({ visible: true });
    });

    opaTest("Delete duplicate skill name", function (Given, When, Then) {
      When.onTheDetailPage.onHeader().iExecuteEdit();
      When.onTheDetailPage.onTable({ property: "alternativeLabels" }).iSelectRows(0);
      When.onTheDetailPage.onTable({ property: "alternativeLabels" }).iExecuteDelete();
      When.onTheDetailPage.onDialog().iConfirm();
      Then.onTheDetailPage.onTable({ property: "alternativeLabels" }).iCheckRows(1);
    });

    opaTest("Save skill and validate administrative data", function (Given, When, Then) {
      When.onTheDetailPage.onFooter().iExecuteSave();
      Then.onTheDetailPage.onHeader().iCheckEdit({ visible: true })
        .and.iCheckTitle("test_changed_skill_name" + seed, "test_changed_description" + seed);
      Then.onTheDetailPage
        .iShouldSeeTheCurrentTimeInTheText("modifiedAt", 10)
        .and.iShouldSeeTheTextInTheText("modifiedBy", "ConfigurationExpert");
    });

    opaTest("Enable edit mode", function (Given, When, Then) {
      When.onTheShell.iNavigateBack();
      When.onTheMainPage.onTable().iPressRow(
        {
          "Skill": "test_changed_skill_name" + seed
        }
      );
      When.onTheDetailPage.onHeader().iExecuteEdit();
      Then.onTheDetailPage.onHeader().iCheckTitle("test_changed_skill_name" + seed, "test_changed_description" + seed);
    });

    opaTest("Change skill name and description of an active entity in draft mode (When I change name and description of the skill, those are visible)", function (Given, When, Then) {
      When.onTheDetailPage.onTable({ property: "texts" }).iChangeRow({
        "Skill Name": "test_changed_skill_name" + seed
      },
      {
        "Skill Name": "test_changed_skill_name_draft" + seed
      });
      When.onTheDetailPage.onTable({ property: "texts" }).iChangeRow({
        "Description": "test_changed_description" + seed
      },
      {
        "Description": "test_changed_description_draft" + seed
      });
      Then.onTheDetailPage.onTable({ property: "texts" }).iCheckRows({
        "Skill Name": "test_changed_skill_name_draft" + seed,
        "Description": "test_changed_description_draft" + seed,
        "Language": "en"
      });
      When.onTheDetailPage.onTable({ property: "texts" }).iSelectRows({
        "Skill Name": "test_changed_skill_name_draft" + seed,
        "Description": "test_changed_description_draft" + seed,
        "Language": "en"
      }); //workaround to trigger sideeffect as iChangeRow is not changing focus
      Then.onTheDetailPage.onHeader().iCheckTitle("test_changed_skill_name_draft" + seed, "test_changed_description_draft" + seed);
    });

    opaTest("Cancel editing on Object Page", function (Given, When, Then) {
      When.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
      Then.onTheDetailPage.onHeader().iCheckTitle("test_changed_skill_name" + seed, "test_changed_description" + seed);
    });

    opaTest("Effect of cancel editing on List Report", function (Given, When, Then) {
      When.onTheShell.iNavigateBack();
      Then.onTheMainPage.onTable().iCheckRows({
        "Skill": "test_changed_skill_name" + seed
      });
    });

    opaTest("Filter by draft status", function (Given, When, Then) {
      Given.onTheMainPage.onTable().iExecuteCreate();
      When.onTheDetailPage
        .onActionDialog()
        .iChangeDialogField({ property: "label" }, "test_label" + seed, true)
        .and.iChangeDialogField({ property: "description" }, "test description 2" + seed, true)
        .and.iConfirm();

      When.onTheDetailPage.onTable({ property: "alternativeLabels" }).iExecuteCreate()
        .and.iChangeRow({
          "Alternative Name": "",
          "Language": ""
        },
        {
          "Alternative Name": "test_alternative_label_2" + seed,
          "Language": "en"
        });
      When.onTheShell.iNavigateBack();
      When.onTheDetailPage.onMessageDialog().iSelectDraftDataLossOption("draftDataLossOptionKeep").and.iConfirm();
      When.onTheMainPage.iCollapseExpandPageHeader(false);
      When.onTheMainPage.onFilterBar().iChangeFilterField("Editing Status", "Own Draft");
      When.onTheMainPage.onFilterBar().iExecuteSearch();
      Then.onTheMainPage.onTable().iCheckRows({
        "Alternative Names": "test_alternative_label_2" + seed
      });
      Then.onTheMainPage.iSeeDraftIndicator();
    });

    opaTest("Search for skill", function (Given, When, Then) {
      Given.onTheMainPage.onFilterBar().iChangeFilterField("Editing Status", "All");
      When.onTheMainPage.onFilterBar().iChangeSearchField("test_label" + seed).and.iExecuteSearch();
      Then.onTheMainPage.onTable().iCheckRows({
        "Alternative Names": "test_alternative_label_2" + seed
      });
    });


    opaTest("Filter by skill name", function (Given, When, Then) {
      Given.onTheMainPage.onFilterBar().iChangeFilterField("Editing Status", "All");
      When.onTheMainPage.onFilterBar().iChangeFilterField("Skill", "test_label" + seed).and.iExecuteSearch();
      Then.onTheMainPage.onTable().iCheckRows({
        "Skill": "test_label" + seed
      });
    });

    opaTest("Filter by catalog name", function (Given, When, Then) {
      //First, reset search
      Given.onTheMainPage.onFilterBar().iChangeFilterField("Skill", "", true)
        .and.iResetSearchField()
        .and.iExecuteSearch();
      When.onTheMainPage.onFilterBar().iChangeFilterField("Catalog", "catalog for skill opa tests")
        .and.iExecuteSearch();
      Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty("sap.m.Text", { text: "skill for skill opa tests" });
    });

    opaTest("Filter by language", function (Given, When, Then) {
      //First, reset search
      Given.onTheMainPage.onFilterBar().iChangeFilterField("Catalog", "", true)
        .and.iResetSearchField()
        .and.iExecuteSearch();
      When.onTheMainPage.onFilterBar().iChangeFilterField("Languages", "de")
        .and.iExecuteSearch();
      Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty("sap.m.Text", { text: "test_changed_skill_name" + seed });
    });

    opaTest("Cancel draft for skill", function (Given, When, Then) {
      Given.onTheMainPage.onFilterBar().iChangeFilterField("Languages", "", true).and.iExecuteSearch();
      Given.onTheMainPage.onTable().iPressRow({
        "Skill": "test_label" + seed
      });
      When.onTheDetailPage.onFooter().iExecuteCancel().and.iConfirmCancel();
      Then.onTheMainPage.iSeeThisPage();
    });

    //Unit for MDI
    opaTest("OPA for MDI related entries", function (Given, When, Then) {
      When.onTheShell.iNavigateBack();
      Then.onTheMainPage.onTable().iCheckRows({
        "Skill": "MDI Skill name"
      });
      When.onTheMainPage.onTable().iPressRow(
        {
          "Skill": "MDI Skill name"
        }
      );
      Then.onTheDetailPage.onHeader().iCheckEdit({ visible: false });
      Then.onTheDetailPage.onHeader().iCheckAction("Restrict", { visible: true });
      Then.onTheDetailPage.onTable({ property: "catalogAssociations" }).iCheckAction("Remove", { visible: false });
      Then.onTheDetailPage.onTable({ property: "catalogAssociations" }).iCheckAction("Add", { visible: false });
      //Restrict error
      When.onTheDetailPage.onHeader().iExecuteAction("Restrict");
      Then.onTheDetailPage.onConfirmationDialog().iCheckState({ title: "Confirmation" });
      When.onTheDetailPage.onConfirmationDialog().iConfirm();
      //Incident:2380088368
      //When.onTheMainPage.onErrorDialog().iClose()
      Then.onTheDetailPage.iShouldSeeTheRestrictErrorMessage();
      Then.onTheDetailPage.iCloseTheDialog();
    });

    opaTest("Teardown", function (Given, When, Then) {
      Given.iTearDownMyApp();
    });

  };
});
