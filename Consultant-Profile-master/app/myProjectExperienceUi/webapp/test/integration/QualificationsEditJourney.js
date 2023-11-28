sap.ui.define([
    'sap/ui/test/opaQunit'
], function (opaTest) {
    'use strict';
    var Journey = {
        run: function () {
            QUnit.module('Editing Qualifications');

            opaTest('In edit mode, I can delete single skill from skills section', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iGoToSection('Qualifications');
                //Assertions
                Then.onTheObjectPage.onTable({ property: "skills" }).iCheckDelete({ visible: true, enabled: false })
                    .and.iCheckState()
                    .and.iCheckRows(2);
                //Actions
                When.onTheObjectPage.onTable({ property: "skills" }).iSelectRows({ "Skill": "CDS test" });
                //Actions
                When.onTheObjectPage.onTable({ property: "skills" }).iExecuteDelete();
                When.onTheObjectPage.onDialog().iConfirm();
                When.onTheObjectPage.onFooter().iExecuteSave();
                //Assertions
                Then.onTheObjectPage.onTable({ property: "skills" }).iCheckRows(1)
                    .and.iCheckColumns(2);
            });

            opaTest('In edit mode, I click on delete on skills table, click cancel button then selected items are not deleted', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                //Actions
                When.onTheObjectPage.onTable({ property: "skills" }).iSelectRows({ "Skill": "Product Management test" });
                //Actions
                When.onTheObjectPage.onTable({ property: "skills" }).iExecuteDelete();
                When.onTheObjectPage.onDialog().iCancel();
                When.onTheObjectPage.onFooter().iExecuteSave();
                //Assertions
                Then.onTheObjectPage.onTable({ property: "skills" })
                    .iCheckRows(1);
            });

            //Error
            opaTest('In edit mode, I can click on value help on skills table and see its functionality working correct', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.onTable({ property: "skills" }).iPressCell({ 0: "Product Management test" }, "Skill")
                    .and.iExecuteKeyboardShortcut("F4", { 0: "Product Management test" }, "Skill");
                // Assertions
                Then.onTheObjectPage.iShouldSeeTheElementTypeWithProperty("sap.m.Dialog", { title: "Select: Skill" })
                    .and.iShouldSeeTheElementWithId('fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::-search')
                    .and.iShouldSeeTheElementWithId('fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::::FilterBar-btnShowFilters')
                    .and.iShouldSeeCorrectValueHelpTableColumns('skills', ['Skill', 'Description', 'Alternative Names', 'Catalogs'])
                    .and.iShouldSeeValueHelpFilterBarWithCorrectFilters('skills', ['Skill', 'Description', 'Alternative Names', 'Catalog']);
                Then.onTheObjectPage.onValueHelpDialog().iCheckRows(5);
                // Search for a restricted role
                When.onTheObjectPage.iEnterTextInTheSearchField('CDS test');
                // Assertions
                Then.onTheObjectPage.iShouldSeeCorrectValueHelpTableColumns('skills', ['Skill', 'Description', 'Alternative Names', 'Catalogs']).and.onValueHelpDialog().iCheckRows(1);
                // Actions
                When.onTheObjectPage.iEnterTextInTheSearchField('');
                // Assertions
                Then.onTheObjectPage.iShouldSeeCorrectValueHelpTableColumns('skills', ['Skill', 'Description', 'Alternative Names', 'Catalogs']).and.onValueHelpDialog().iCheckRows(5);
                // Actions
                When.onTheObjectPage.onValueHelpDialog().iCancel();
                When.onTheObjectPage.onFooter().iExecuteCancel();
                // Assertions
                Then.onTheObjectPage.iSeeObjectPageInDisplayMode();
            });

            opaTest('In edit mode, I edit a skill by selecting from value help, then changes are reflected in the skills table', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.onTable({ property: "skills" }).iPressCell({ 0: "Product Management test" }, "Skill")
                    .and.iExecuteKeyboardShortcut("F4", { 0: "Product Management test" }, "Skill");
                When.onTheObjectPage.iClickOnTheElementTypeWithProperty('sap.m.Text', { text: 'NodeJS test' })
                    .and.iOpenTheValueHelpOnTheTableElement('fe::table::skills::LineItem-innerTable', 0, 1)
                    .and.iClickOnTheElementTypeWithProperty('sap.m.Text', { text: 'Advanced level' });
                When.onTheObjectPage.onFooter().iExecuteSave();
                // Assertions
                Then.onTheObjectPage.onTable({ property: "skills" }).iCheckRows({ 0: "NodeJS test" });
            });

            opaTest('In edit mode, I edit a skill by entering skill as text, then changes are reflected in the skills table', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.onTable({ property: "skills" })
                    .iChangeRow({ "Skill": "NodeJS test" },
                        { "Skill": "CDS test" });
                When.onTheObjectPage.iOpenTheValueHelpOnTheTableElement('fe::table::skills::LineItem-innerTable', 0, 1)
                    .and.iClickOnTheElementTypeWithProperty('sap.m.Text', { text: 'Advanced Set 1' });
                When.onTheObjectPage.onFooter().iExecuteSave();
                // Assertions
                Then.onTheObjectPage.onTable({ property: "skills" }).iCheckRows({ 0: "CDS test" });
            });

            opaTest('In edit mode, I can create a skill by selecting a value from value help. After creation, I should see changes reflected in the skills table.', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.onTable({ property: "skills" }).iExecuteCreate();
                When.onTheObjectPage.iOpenTheValueHelpOnTheTableElement('fe::table::skills::LineItem-innerTable', 0, 0)
                    .and.iClickOnTheElementTypeWithProperty('sap.m.Text', { text: 'SAP Fiori test' })
                    .and.iOpenTheValueHelpOnTheTableElement('fe::table::skills::LineItem-innerTable', 0, 1)
                    .and.iClickOnTheElementTypeWithProperty('sap.m.Text', { text: 'Advanced Set 5' });
                When.onTheObjectPage.onFooter().iExecuteSave();
                //Assertions
                Then.onTheObjectPage.onTable({ property: "skills" }).iCheckRows({ 0: "SAP Fiori test" })
                    .and.iCheckRows(2);
            });

            opaTest('In edit mode, I can create a skill by entering the skill as text in the input field. After creation, I should see changes reflected in the skills table.', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.onTable({ property: "skills" }).iExecuteCreate();
                When.onTheObjectPage.iOpenTheValueHelpOnTheTableElement('fe::table::skills::LineItem-innerTable', 0, 0)
                    .and.iClickOnTheElementTypeWithProperty('sap.m.Text', { text: 'Product Management test' });
                When.onTheObjectPage.onTable({ property: "skills" })
                    .iChangeRow({ "Skill": "Product Management test" },
                        { "Skill": "UI5 test" });
                When.onTheObjectPage.iOpenTheValueHelpOnTheTableElement('fe::table::skills::LineItem-innerTable', 0, 1)
                    .and.iClickOnTheElementTypeWithProperty('sap.m.Text', { text: 'Advanced Set 3' });
                When.onTheObjectPage.onFooter().iExecuteSave();
                // Assertions
                Then.onTheObjectPage.onTable({ property: "skills" }).iCheckRows({ 0: "UI5 test" })
                    .and.iCheckRows(3);
            });

            opaTest('In draft saved state, I can delete multiple skills from the skills table', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.onTable({ property: "skills" }).iExecuteCreate();
                //Assertions
                Then.onTheObjectPage.onFooter().iCheckDraftStateSaved();
                //Actions
                When.onTheObjectPage.onFooter().iExecuteSave();
                // Assertions
                Then.onTheObjectPage.onFooter()
                    .iCheckAction("1", { visible: true, type: "Negative" });
                Then.onTheObjectPage.iSeeMessageView();
                //Actions
                When.onTheObjectPage.iClickOnTheElementTypeWithProperty('sap.fe.macros.messages.MessageButton', { type: "Negative" });
                // Actions
                When.onTheObjectPage.onTable({ property: "skills" }).iSelectAllRows()//Selects complete table
                    .and.iSelectRows({ "Skill": "CDS test" })//unselecting
                    .and.iSelectRows({ "Skill": "SAP Fiori test" })//unselecting
                    .and.iExecuteDelete();
                When.onTheObjectPage.onDialog().iConfirm();
                When.onTheObjectPage.onFooter().iExecuteSave();
                //Assertions
                Then.onTheObjectPage.onTable({ property: "skills" }).iCheckRows(2)
                    .and.iCheckColumns(2);
            });

        }
    };
    return Journey;
});
