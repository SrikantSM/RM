sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
    "use strict";

    var Journey = {
        run: function () {
            QUnit.module('Editing External Work Experience');
            // sap.ui.getCore().getConfiguration().setTimeZone("Etc/UTC");
            opaTest('In edit mode, I can create single assignment from external work experience sub section', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'External Work Experience');
                When.onTheObjectPage.onHeader().iExecuteEdit();
                // Actions
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iExecuteCreate();
                // Actions
                When.onExternalWrkExpOP.onForm("General Information")
                    .iChangeField({ property: "projectName" }, "New Project Name")
                    .and.iChangeField({ property: "customer" }, "New Customer")
                    .and.iChangeField({ property: "startDate" }, "Jan 1, 2020")
                    .and.iChangeField({ property: "endDate" }, "Dec 1, 2020")
                    .and.iChangeField({ property: "companyName" }, "Company")
                    .and.iChangeField({ property: "rolePlayed" }, "Role Played");
                When.onExternalWrkExpOP.iGoToSection('Skills')
                    .and.onTable({ property: "externalWorkExperienceSkills" }).iExecuteCreate();
                When.onExternalWrkExpOP.iOpenTheValueHelpOnTheTableElement(0, 0);
                // Assertions
                Then.onExternalWrkExpOP.iShouldSeeTheElementTypeWithProperty("sap.m.Dialog", { title: "Select: Skill" })
                    .and.iShouldSeeTheElementWithId('fe::table::externalWorkExperienceSkills::LineItem::TableValueHelp::externalWorkExperience::externalWorkExperienceSkills::skill_ID::Dialog::qualifier::-search')
                    .and.iShouldSeeTheElementWithId('fe::table::externalWorkExperienceSkills::LineItem::TableValueHelp::externalWorkExperience::externalWorkExperienceSkills::skill_ID::Dialog::qualifier::::FilterBar-btnShowFilters')
                    .and.iShouldSeeCorrectValueHelpTableColumns(['Skill', 'Description', 'Alternative Names', 'Catalogs'])
                    .and.iShouldSeeValueHelpFilterBarWithCorrectFilters(['Skill', 'Description', 'Alternative Names', 'Catalog']);
                Then.onTheObjectPage.onValueHelpDialog().iCheckRows(5);

                // Actions
                When.onExternalWrkExpOP.iClickOnTheElementTypeWithProperty('sap.m.Text', { text: 'UI5 test' })
                    .and.iOpenTheValueHelpOnTheTableElement(0, 1)
                    .and.iClickOnTheElementTypeWithProperty('sap.m.Text', { text: 'Advanced Set 3' });
                When.onExternalWrkExpOP
                    .onForm("Comment")
                    .iChangeField({ property: "comments" }, "Comments");
                Then.onExternalWrkExpOP.onFooter().iCheckDraftStateSaved();
                When.onExternalWrkExpOP.onFooter().iExecuteApply();
                When.onTheObjectPage.onFooter().iExecuteSave();
                // Actions
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'External Work Experience');
                // Assertions
                Then.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iCheckRows(4)
                    .and.iCheckColumns(6);
                // Actions
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iPressRow({ 2: "Company" });
                // Assertions
                Then.onExternalWrkExpOP.onTable({ property: "externalWorkExperienceSkills" }).iCheckRows(1)
                    .and.iCheckColumns(2);
                Then.onExternalWrkExpOP.iShouldSeeTheElementTypeWithProperty('sap.m.ExpandableText', { text: 'Comments' });
            });

            opaTest('In edit mode, I should not be allowed to create an assignment if it is duplicate', function (Given, When, Then) {
                // Actions
                When.onExternalWrkExpOP.onHeader().iNavigateByBreadcrumb("Test Usere2e1 (test.usere2e1)");
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                // Actions
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iExecuteCreate();
                // Actions
                When.onExternalWrkExpOP.onForm("General Information")
                    .iChangeField({ property: "projectName" }, "New Project Name")
                    .and.iChangeField({ property: "customer" }, "New Customer")
                    .and.iChangeField({ property: "startDate" }, "Jan 1, 2020")
                    .and.iChangeField({ property: "endDate" }, "Dec 1, 2020")
                    .and.iChangeField({ property: "companyName" }, "Company")
                    .and.iChangeField({ property: "rolePlayed" }, "Role Played");
                When.onExternalWrkExpOP.onFooter().iExecuteApply();
                When.onTheObjectPage.onFooter().iExecuteSave();
                // Assertions
                Then.onTheObjectPage.onFooter()
                    .iCheckAction("1", { visible: true, type: "Negative" });
                // Assertions
                Then.onTheObjectPage.iSeeMessageView();
                // Action
                When.onTheObjectPage.iClickOnTheElementTypeWithProperty('sap.fe.macros.messages.MessageButton', { type: "Negative" });
                When.onTheObjectPage.onFooter()
                    .iExecuteCancel()
                    .and.iConfirmCancel();
                // Assertion
                Then.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iCheckRows(4);
            });

            opaTest('In edit mode, navigate to External Work Experience detail page then I click on delete on skill, click cancel button then selected items are not deleted', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'External Work Experience');
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iPressRow({ 2: "Company" });
                //Actions

                When.onExternalWrkExpOP.onTable({ property: "externalWorkExperienceSkills" }).iSelectRows({ "Skill": "UI5 test" });
                //Assertions
                Then.onExternalWrkExpOP.onTable({ property: "externalWorkExperienceSkills" }).iCheckDelete({ visible: true, enabled: true });
                //Actions
                When.onExternalWrkExpOP.onTable({ property: "externalWorkExperienceSkills" }).iExecuteDelete();
                When.onExternalWrkExpOP.onDialog().iCancel();
                When.onExternalWrkExpOP.onFooter().iExecuteApply();
                When.onTheObjectPage.onFooter().iExecuteSave();
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iPressRow({ 2: "Company" });

                When.onExternalWrkExpOP.iGoToSection('Skills');
                // Assertions
                Then.onExternalWrkExpOP.onTable({ property: "externalWorkExperienceSkills" }).iCheckRows({ 0: "UI5 test" });

                When.onExternalWrkExpOP.onHeader().iNavigateByBreadcrumb("Test Usere2e1 (test.usere2e1)");
            });

            opaTest('In edit mode, I edit a skill by selecting from value help, then changes are reflected in the skills table in external work experience', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'External Work Experience');
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iPressRow({ 2: "Company" });
                // Actions
                When.onExternalWrkExpOP.iGoToSection('Skills');
                When.onExternalWrkExpOP.onTable({ property: "externalWorkExperienceSkills" }).iPressCell({ 0: "UI5 test" }, "Skill")
                    .and.iExecuteKeyboardShortcut("F4", { 0: "UI5 test" }, "Skill");

                When.onExternalWrkExpOP.iClickOnTheElementTypeWithProperty('sap.m.Text', { text: 'NodeJS test' })
                    .and.iOpenTheValueHelpOnTheTableElement(0, 1)
                    .and.iClickOnTheElementTypeWithProperty('sap.m.Text', { text: 'Advanced Set 2' });
                When.onExternalWrkExpOP.onFooter().iExecuteApply();
                // Actions
                When.onTheObjectPage.onFooter().iExecuteSave();
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iPressRow({ 2: "Company" });
                // Assertions
                Then.onExternalWrkExpOP.onTable({ property: "externalWorkExperienceSkills" }).iCheckRows({ 0: "NodeJS test" })
                    .and.iCheckRows(1);

                When.onExternalWrkExpOP.onHeader().iNavigateByBreadcrumb("Test Usere2e1 (test.usere2e1)");
            });

            opaTest('In edit mode, I can navigate to detail page and delete skill in external work experience', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'External Work Experience');
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iPressRow({ 2: "Company" });
                //Actions
                When.onExternalWrkExpOP.iGoToSection('Skills');
                When.onExternalWrkExpOP.onTable({ property: "externalWorkExperienceSkills" }).iSelectRows({ "Skill": "NodeJS test" });
                When.onExternalWrkExpOP.onTable({ property: "externalWorkExperienceSkills" }).iExecuteDelete();
                When.onExternalWrkExpOP.onDialog().iConfirm();
                When.onExternalWrkExpOP.onFooter().iExecuteApply();
                When.onTheObjectPage.onFooter().iExecuteSave();
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iPressRow({ 2: "Company" });
                When.onExternalWrkExpOP.iGoToSection('Skills');
                // Assertions
                Then.onExternalWrkExpOP.onTable({ property: "externalWorkExperienceSkills" }).iCheckRows(0);

                When.onExternalWrkExpOP.onHeader().iNavigateByBreadcrumb("Test Usere2e1 (test.usere2e1)");
            });

            // Checks for forbidden characters
            opaTest('In edit mode, I should be able to edit comments for External Work Experience', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'External Work Experience');
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iPressRow({ 2: "Company" });
                // Actions
                When.onExternalWrkExpOP.iGoToSection('Comment');
                When.onExternalWrkExpOP
                    .onForm("Comment")
                    .iChangeField({ property: "comments" }, "New Comment<script>");
                When.onExternalWrkExpOP.onFooter().iExecuteApply();
                When.onTheObjectPage.onFooter().iExecuteSave();
                // Assertions
                Then.onTheObjectPage.onFooter()
                    .iCheckAction("1", { visible: true, type: "Negative" });
                // Assertions
                Then.onTheObjectPage.iSeeMessageView();
                // Actions
                When.onTheObjectPage.iClickOnTheElementTypeWithProperty('sap.fe.macros.messages.MessageButton', { type: "Negative" });
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iPressRow({ 2: "IBM India" });
                When.onExternalWrkExpOP.onHeader().iNavigateByBreadcrumb("Test Usere2e1 (test.usere2e1)");
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iPressRow({ 2: "Company" });
                When.onExternalWrkExpOP.iGoToSection('Comment');
                When.onExternalWrkExpOP
                    .onForm("Comment")
                    .iChangeField({ property: "comments" }, "New Comment<html>");
                When.onExternalWrkExpOP.onFooter().iExecuteApply();
                When.onTheObjectPage.onFooter().iExecuteSave();
                // Assertions
                Then.onTheObjectPage.onFooter()
                    .iCheckAction("1", { visible: true, type: "Negative" });
                // Assertions
                Then.onTheObjectPage.iSeeMessageView();
                // Actions
                When.onTheObjectPage.iClickOnTheElementTypeWithProperty('sap.fe.macros.messages.MessageButton', { type: "Negative" });
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iPressRow({ 2: "IBM India" });
                When.onExternalWrkExpOP.onHeader().iNavigateByBreadcrumb("Test Usere2e1 (test.usere2e1)");
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iPressRow({ 2: "Company" });
                When.onExternalWrkExpOP.iGoToSection('Skills');
                When.onExternalWrkExpOP.iGoToSection('Comment');
                When.onExternalWrkExpOP
                    .onForm("Comment")
                    .iChangeField({ property: "comments" }, "New Comment");
                When.onExternalWrkExpOP.onFooter().iExecuteApply();
                When.onTheObjectPage.onFooter().iExecuteSave();
                // Actions
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iPressRow({ 2: "Company" });
                // Assertions
                Then.onExternalWrkExpOP.iShouldSeeTheElementTypeWithProperty('sap.m.ExpandableText', { text: 'New Comment' });
                // Actions
                When.onExternalWrkExpOP.onHeader().iNavigateByBreadcrumb("Test Usere2e1 (test.usere2e1)");
            });

            opaTest('In edit mode, I can delete single assignment from external work experience sub section', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'External Work Experience');
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iSelectRows({ "Company": "Company" })
                    .and.iExecuteDelete();
                When.onTheObjectPage.onDialog().iConfirm();
                When.onTheObjectPage.onFooter().iExecuteSave();
                // Assertions
                Then.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iCheckRows(3);
            });


            opaTest('In edit mode, I can delete single assignment from external work experience details page', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'External Work Experience');
                // Actions
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iPressRow({ 2: "IBM India" });
                // Actions
                When.onExternalWrkExpOP.onHeader().iExecuteDelete();
                When.onExternalWrkExpOP.onDialog().iConfirm();
                When.onTheObjectPage.onFooter().iExecuteSave();
                // Assertions
                Then.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iCheckRows(2);
            });

            opaTest('In edit mode, I click on delete on assignments table of external work experience sub section, click cancel button then selected items are not deleted', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'External Work Experience');
                // Actions
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iPressRow({ 2: "TCS" });
                // Actions
                When.onExternalWrkExpOP.onHeader().iExecuteDelete();
                When.onExternalWrkExpOP.onDialog().iCancel();
                When.onExternalWrkExpOP.onFooter().iExecuteApply();
                When.onTheObjectPage.onFooter().iExecuteSave();
                // Assertions
                Then.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iCheckRows(2);
            });

            opaTest('In edit mode, I can delete multiple assignments from external work experience sub section', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'External Work Experience');
                When.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iSelectRows({ "Company": "MAS" })
                    .and.iSelectRows({"Company" : "TCS"})
                    .and.iExecuteDelete();
                When.onTheObjectPage.onDialog().iConfirm();
                When.onTheObjectPage.onFooter().iExecuteSave();
                // Assertions
                Then.onTheObjectPage.onTable({ property: "externalWorkExperience" }).iCheckRows(0);
            });

        }
    };
    return Journey;
});
