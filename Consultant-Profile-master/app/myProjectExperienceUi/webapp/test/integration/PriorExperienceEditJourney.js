sap.ui.define([
    'sap/ui/test/opaQunit'
], function (opaTest) {
    'use strict';
    var Journey = {
        run: function () {
            QUnit.module('Editing Prior Experience');

            opaTest('In edit mode, I can delete single role from previous roles section', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'Previous Roles');
                //Assertions
                Then.onTheObjectPage.onTable({ property: "roles" }).iCheckRows(2);
                //Actions
                When.onTheObjectPage.onTable({ property: "roles" }).iSelectRows({ "Project Role": "Junior Consultant1" })
                    .and.iExecuteDelete();
                When.onTheObjectPage.onDialog().iConfirm();
                When.onTheObjectPage.onFooter().iExecuteSave();
                //Assertions
                Then.onTheObjectPage.onTable({ property: "roles" })
                    .iCheckRows(1);
            });

            opaTest('In edit mode, I click on delete on roles table, click cancel button then selected items are not deleted', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'Previous Roles');
                //Assertions
                Then.onTheObjectPage.onTable({ property: "roles" }).iCheckRows(1);
                //Actions
                When.onTheObjectPage.onTable({ property: "roles" }).iSelectRows({ "Project Role": "Platinum Consultant1" })
                    .and.iExecuteDelete();
                When.onTheObjectPage.onDialog().iCancel();
                When.onTheObjectPage.onFooter().iExecuteSave();
                //Assertions
                Then.onTheObjectPage.onTable({ property: "roles" })
                    .iCheckRows(1);
            });

            opaTest('In edit mode, I can click on value help on roles table and see its functionality working correct', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'Previous Roles');
                When.onTheObjectPage.onTable({ property: "roles" }).iPressCell({ 0: "Platinum Consultant1" }, "Project Role")
                    .and.iExecuteKeyboardShortcut("F4", { 0: "Platinum Consultant1" }, "Project Role");
                // Assertions
                Then.onTheObjectPage.iShouldSeeTheElementTypeWithProperty("sap.m.Dialog", { title: "Select: Project Role" })
                    .and.iShouldSeeTheElementWithId('fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Dialog::qualifier::-search')
                    .and.iShouldSeeTheElementWithId('fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Dialog::qualifier::::FilterBar-btnShowFilters')
                    .and.iShouldSeeCorrectValueHelpTableColumns('roles', ['Project Role', 'Code', 'Description'])
                    .and.iShouldSeeValueHelpFilterBarWithCorrectFilters('roles', ['Project Role', 'Code', 'Description']);
                Then.onTheObjectPage.onValueHelpDialog().iCheckRows(3);
                // Search for a restricted role
                When.onTheObjectPage.iEnterTextInTheSearchField('Architect1');
                // Assertions
                Then.onTheObjectPage.iShouldSeeCorrectValueHelpTableColumns('roles', ['Project Role', 'Code', 'Description']).and.onValueHelpDialog().iCheckRows(0);
                // Actions
                When.onTheObjectPage.iEnterTextInTheSearchField('');
                // Assertions
                Then.onTheObjectPage.iShouldSeeCorrectValueHelpTableColumns('roles', ['Project Role', 'Code', 'Description']).and.onValueHelpDialog().iCheckRows(3);
                // Actions
                When.onTheObjectPage.onValueHelpDialog().iCancel();
                When.onTheObjectPage.onFooter().iExecuteCancel();
                // Assertions
                Then.onTheObjectPage.iSeeObjectPageInDisplayMode();
            });

            opaTest('In edit mode, I edit a role by selecting from value help, then changes are reflected in the roles table', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'Previous Roles');
                When.onTheObjectPage.onTable({ property: "roles" }).iPressCell({ 0: "Platinum Consultant1" }, "Project Role")
                    .and.iExecuteKeyboardShortcut("F4", { 0: "Platinum Consultant1" }, "Project Role");
                When.onTheObjectPage.iClickOnTheElementTypeWithProperty('sap.m.Text', { text: 'Senior Consultant1' });
                When.onTheObjectPage.onFooter().iExecuteSave();
                // Assertions
                Then.onTheObjectPage.onTable({ property: "roles" }).iCheckRows({ 0: "Senior Consultant1" });
            });

            opaTest('In edit mode, I edit a role by entering role as text, then changes are reflected in the roles table', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'Previous Roles');
                When.onTheObjectPage.onTable({ property: "roles" })
                    .iChangeRow({ "Project Role": "Senior Consultant1" },
                        { "Project Role": "Junior Consultant1" });
                When.onTheObjectPage.onFooter().iExecuteSave();
                // Assertions
                Then.onTheObjectPage.onTable({ property: "roles" }).iCheckRows({ 0: "Junior Consultant1" });
            });

            opaTest('In edit mode, I can create a role by selecting a value from value help. After creation, I should see changes reflected in the roles table', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'Previous Roles');
                When.onTheObjectPage.onTable({ property: "roles" }).iExecuteCreate();
                When.onTheObjectPage.iOpenTheValueHelpOnTheTableElement('fe::table::roles::LineItem-innerTable', 0, 0)
                    .and.iClickOnTheElementTypeWithProperty('sap.m.Text', { text: 'Platinum Consultant1' });
                When.onTheObjectPage.onFooter().iExecuteSave();
                //Assertions
                Then.onTheObjectPage.onTable({ property: "roles" }).iCheckRows({ 0: "Platinum Consultant1" })
                    .and.iCheckRows(2)
                    .and.iCheckColumns(1);
            });

            opaTest('In draft saved state, I can delete multiple roles from the previous roles table', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iClickOnMenuButtonItems('fe::FacetSection::PriorExperience-anchor', 'Previous Roles');
                When.onTheObjectPage.onTable({ property: "roles" }).iExecuteCreate();
                //Assertions
                Then.onTheObjectPage.onFooter().iCheckDraftStateSaved();
                //Actions
                When.onTheObjectPage.onFooter().iExecuteSave();
                // Assertions
                Then.onTheObjectPage.onFooter()
                    .iCheckAction("1", { visible: true, type: "Negative" });
                Then.onTheObjectPage.iSeeMessageView();
                // Action
                When.onTheObjectPage.iClickOnTheElementTypeWithProperty('sap.fe.macros.messages.MessageButton', { type: "Negative" });
                When.onTheObjectPage.onTable({ property: "roles" }).iSelectAllRows()
                    .and.iSelectRows({ "Project Role": "Junior Consultant1" })
                    .and.iExecuteDelete();
                When.onTheObjectPage.onDialog().iConfirm();
                When.onTheObjectPage.onFooter().iExecuteSave();
                //Assertions
                Then.onTheObjectPage.onTable({ property: "roles" }).iCheckRows(1)
                    .and.iCheckColumns(1);
            });
        }
    };
    return Journey;
});
