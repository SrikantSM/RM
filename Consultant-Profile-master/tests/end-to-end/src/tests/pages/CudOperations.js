const PriorExperience = require('./PriorExperience.js');

const actions = {

    async create(tableName) {
        const createId = `myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem::StandardAction::Create`;
        const createButton = element(by.id(createId));
        await createButton.click();
    },

    async delete(tableName, valueToBeDeleted) {
        const tableId = `myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem`;
        const deleteId = `myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem::StandardAction::Delete`;
        const table = element(by.id(tableId));
        const rowsOfTable = table.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRows = await rowsOfTable.count();
        let noRowToBeDeleted;
        for (let i = 0; i < noOfRows; i++) {
            let row;
            if (tableName === 'externalWorkExperience') {
                row = rowsOfTable.get(i).all(by.control({
                    controlType: 'sap.m.Input',
                }));
            } else {
                row = rowsOfTable.get(i).element(by.control({
                    controlType: 'sap.ui.mdc.Field',
                }));
            }
            const value = await row.asControl().getProperty('value');
            if (valueToBeDeleted === String(value)) {
                noRowToBeDeleted = i;
                break;
            }
        }
        const rowToBeDeleted = await rowsOfTable.get(noRowToBeDeleted);

        const checkBox = await rowToBeDeleted.element(by.control({
            controlType: 'sap.m.CheckBox',
        }));

        await checkBox.click();
        const deleteBtn = await element(by.id(deleteId));
        await deleteBtn.click();
        const deleteButtonInDialog = await element(by.control({
            controlType: 'sap.m.Dialog',
        }));
        const deletes = await deleteButtonInDialog.element(by.control({
            controlType: 'sap.m.Button',
            properties: {
                text: 'Delete',
            },
        }));
        await deletes.click();
    },

    async deleteMany(tableName, noToDelete, aValues) {
        const tableId = `myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem`;
        const deleteId = `myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem::StandardAction::Delete`;
        const table = element(by.id(tableId));
        const rowsOfTable = table.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noRowsOfTable = await rowsOfTable.count();
        for (let i = 0; i < noToDelete; i++) {
            for (let j = 0; j < noRowsOfTable; j++) {
                let row1;
                if (tableName === 'externalWorkExperience') {
                    row1 = rowsOfTable.get(j).all(by.control({
                        controlType: 'sap.m.Input',
                    }));
                } else {
                    row1 = rowsOfTable.get(j).all(by.control({
                        controlType: 'sap.ui.mdc.Field',
                    }));
                }
                const value = await row1.get(0).asControl().getProperty('value');
                if (aValues[i] === await value) {
                    const checkBox = await rowsOfTable.get(j).element(by.control({
                        controlType: 'sap.m.CheckBox',
                    }));
                    await checkBox.click();
                    break;
                }
            }
        }

        const deleteBtn = await element(by.id(deleteId));
        await deleteBtn.click();
        const deleteButtonInDialog = await element(by.control({
            controlType: 'sap.m.Dialog',
        }));
        const deletes = await deleteButtonInDialog.element(by.control({
            controlType: 'sap.m.Button',
            properties: {
                text: 'Delete',
            },
        }));
        await deletes.click();
    },

    async changeValueOfTheSkillsRow(valueToBeChanged, newValue) {
        let elementToBeClicked;
        const objectTableID = 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem';
        const objectTable = element(by.id(objectTableID));
        const objectTableRows = objectTable.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRowsObjectTable = await objectTableRows.count();
        for (let i = 0; i < noOfRowsObjectTable; i++) {
            const row = objectTableRows.get(i).element(by.control({
                controlType: 'sap.ui.mdc.Field',
            }));
            const value = await row.asControl().getProperty('value');
            if (valueToBeChanged === await value) {
                elementToBeClicked = i;
                break;
            }
        }

        const rowFields = objectTableRows.get(elementToBeClicked).all(by.control({
            controlType: 'sap.ui.mdc.Field',
        }));

        const fieldToBeChanged = rowFields.get(0);

        await fieldToBeChanged.clear();
        await fieldToBeChanged.sendKeys(newValue);
    },

    async changeValueOfTheRow(tableName, valueToBeChanged, newValue) {
        let tableId;
        let elementToBeClicked;
        if (tableName === 'roles') tableId = 'role_ID';
        else tableId = 'skill_ID';

        const objectTableID = `myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem`;
        const subObjectTableID = `myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem::TableValueHelp::${tableName}::${tableId}::Dialog::qualifier::::Table-innerTable`;
        const objectTable = element(by.id(objectTableID));
        const objectTableRows = objectTable.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRowsObjectTable = await objectTableRows.count();
        for (let i = 0; i < noOfRowsObjectTable; i++) {
            const row = objectTableRows.get(i).element(by.control({
                controlType: 'sap.ui.mdc.Field',
            }));
            const value = await row.asControl().getProperty('value');
            if (valueToBeChanged === await value) {
                elementToBeClicked = i;
                break;
            }
        }

        await objectTableRows.get(elementToBeClicked).element(by.control({
            controlType: 'sap.ui.core.Icon',
            properties: {
                src: 'sap-icon://value-help',
            },
        })).click();

        if (tableName === 'roles') {
            await PriorExperience.priorExperience.elements.valueHelpSearchInput_roles.sendKeys(newValue);
            await PriorExperience.priorExperience.elements.roleValueHelpShowFiltersBtn.click();
            await PriorExperience.priorExperience.elements.valueHelpSearchPress_roles.click();
        } else {
            await PriorExperience.priorExperience.elements.valueHelpSearchInput_skills.sendKeys(newValue);
            await PriorExperience.priorExperience.elements.valueHelpShowFiltersBtn.click();
            await PriorExperience.priorExperience.elements.valueHelpSearchPress_skills.click();
        }
        const subObjectTable = element(by.id(subObjectTableID));
        const subObjectTableRows = subObjectTable.all(by.control({
            controlType: 'sap.ui.table.Row',
        }));
        const noOfRowsSubObjectTable = await subObjectTableRows.count();
        let elementToBeClickedSub;

        for (let j = 0; j < noOfRowsSubObjectTable; j++) {
            const row1 = subObjectTableRows.get(j).element(by.control({
                controlType: 'sap.m.Text',
            }));
            const value1 = row1.getText();
            if (newValue === await value1) {
                elementToBeClickedSub = j;
                break;
            }
        }

        await subObjectTableRows.get(elementToBeClickedSub).element(by.control({
            controlType: 'sap.m.Text',
            properties: {
                text: newValue,
            },
        })).click();
    },

    async clickDropdownBySiblingValue(tableName, siblingValue, propertyName, objectPage) {
        await element(by.control({
            controlType: 'sap.ui.core.Icon',
            properties: {
                src: 'sap-icon://slim-arrow-down',
            },
            ancestor: {
                controlType: 'sap.ui.mdc.Field',
                bindingPath: {
                    propertyPath: propertyName,
                },
                ancestor: {
                    controlType: 'sap.m.ColumnListItem',
                    descendant: {
                        controlType: 'sap.ui.mdc.Field',
                        properties: {
                            additionalValue: siblingValue,
                        },
                    },
                    ancestor: {
                        id: `myProjectExperienceUi::${objectPage}--fe::table::${tableName}::LineItem`,
                    },
                },
            },
        })).click();
    },

    async selectFromDropdown(valueToSelect) {
        await element(by.control({
            controlType: 'sap.m.Text',
            properties: {
                text: valueToSelect,
            },
            ancestor: {
                controlType: 'sap.m.Table',
                id: /SuggestTable$/,
            },
        })).click();
    },

    async changeValueInTable(objectPage, table, valueToBeChanged, valueToBeFilled) {
        const field = element(by.control({
            controlType: 'sap.ui.mdc.Field',
            properties: {
                additionalValue: valueToBeChanged,
            },
            ancestor: {
                controlType: 'sap.m.Table',
                id: `myProjectExperienceUi::${objectPage}--fe::table::${table}::LineItem-innerTable`,
            },
        }));
        const id = await field.getAttribute('id'); // get id to get the element again after clear()
        await field.clear();
        await element(by.id(id)).sendKeys(valueToBeFilled);
    },

    async changeErrorValueInTable(objectPage, table, valueToBeFilled) {
        const field = element(by.control({
            controlType: 'sap.ui.mdc.Field',
            properties: {
                valueState: 'Error', // don't use additionalValue if the value help didn't match
            },
            ancestor: {
                controlType: 'sap.m.Table',
                id: `myProjectExperienceUi::${objectPage}--fe::table::${table}::LineItem-innerTable`,
            },
        }));
        const id = await field.getAttribute('id'); // get id to get the element again after clear()
        await field.clear();
        await element(by.id(id)).sendKeys(valueToBeFilled);
    },

    async selectValueFromValueHelp(tableName, valueToBeChanged, newValue) {
        let tableId;
        let elementToBeClicked;
        if (tableName === 'roles') tableId = 'role_ID';
        else tableId = 'skill_ID';

        const objectTableID = `myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem`;
        const subObjectTableID = `myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem::TableValueHelp::${tableName}::${tableId}::Table-innerTable`;
        const objectTable = element(by.id(objectTableID));
        const objectTableRows = objectTable.all(by.control({
            controlType: 'sap.ui.table.Row',
        }));
        const noOfRowsObjectTable = await objectTableRows.count();
        for (let i = 0; i < noOfRowsObjectTable; i++) {
            const row = objectTableRows.get(i).element(by.control({
                controlType: 'sap.ui.mdc.Field',
            }));
            const value = await row.asControl().getProperty('value');
            if (valueToBeChanged === await value) {
                elementToBeClicked = i;
                break;
            }
        }
        await objectTableRows.get(elementToBeClicked).element(by.control({
            controlType: 'sap.ui.core.Icon',
            properties: {
                src: 'sap-icon://value-help',
            },
        })).click();
        browser.wait(() => PriorExperience.priorExperience.elements.valueHelpSearchInput.isPresent(), 600000);
        await PriorExperience.priorExperience.elements.valueHelpSearchInput.sendKeys(newValue);
        await PriorExperience.priorExperience.elements.valueHelpSearchPress.click();

        const subObjectTable = element(by.id(subObjectTableID));
        const subObjectTableRows = subObjectTable.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRowsSubObjectTable = await subObjectTableRows.count();
        let elementToBeClickedSub;

        for (let j = 0; j < noOfRowsSubObjectTable; j++) {
            const row1 = subObjectTableRows.get(j).element(by.control({
                controlType: 'sap.m.Text',
            }));
            const value1 = row1.getText();
            if (newValue === await value1) {
                elementToBeClickedSub = j;
                break;
            }
        }

        await subObjectTableRows.get(elementToBeClickedSub).element(by.control({
            controlType: 'sap.m.Text',
        })).click();
    },

    async fillEmptyInputBox(tableName, valueToBeFilled) {
        let elementToBeClicked;
        const blankRow = '';
        const objectTableID = `myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem`;
        const objectTable = element(by.id(objectTableID));
        const objectTableRows = objectTable.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRowsObjectTable = await objectTableRows.count();
        for (let i = 0; i < noOfRowsObjectTable; i++) {
            const row = objectTableRows.get(i).element(by.control({
                controlType: 'sap.ui.mdc.Field',
            }));
            const value = await row.asControl().getProperty('value');
            if (blankRow === await value) {
                elementToBeClicked = i;
                break;
            }
        }
        const rowFields = objectTableRows.get(elementToBeClicked).all(by.control({
            controlType: 'sap.ui.mdc.Field',
        }));

        const fieldToBeChanged = rowFields.get(0);

        await fieldToBeChanged.clear();
        await fieldToBeChanged.sendKeys(valueToBeFilled);
    },

    async setValue(fieldValue, fieldID, bClearField) {
        const field = await element(by.control({
            // controlType: "sap.m.Input",
            id: `${fieldID}-edit`,
        }));
        if (bClearField) {
            await field.clear();
        }
        await field.sendKeys(fieldValue);
    },

    async createSkillRow() {
        const createId = 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::table::externalWorkExperienceSkills::LineItem::StandardAction::Create';
        const createButton = element(by.id(createId));
        await createButton.click();
    },

    async fillEmptyInputSubPage(valueToBeFilled) {
        let elementToBeClicked;
        const blankRow = '';
        const objectTableID = 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::table::externalWorkExperienceSkills::LineItem-innerTable';
        const objectTable = element(by.id(objectTableID));
        const objectTableRows = objectTable.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRowsObjectTable = await objectTableRows.count();
        for (let i = 0; i < noOfRowsObjectTable; i++) {
            const row = objectTableRows.get(i).element(by.control({
                controlType: 'sap.ui.mdc.Field',
            }));
            const value = await row.asControl().getProperty('value');
            if (blankRow === await value) {
                elementToBeClicked = i;
                break;
            }
        }
        await objectTableRows.get(elementToBeClicked).element(by.control({
            controlType: 'sap.ui.mdc.Field',
        })).sendKeys(valueToBeFilled);
    },

    async assignSkill(valueToBeChanged, newValue) {
        let elementToBeClicked;

        const objectTableID = 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::table::externalWorkExperienceSkills::LineItem-innerTable';
        const subObjectTableID = 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::table::externalWorkExperienceSkills::LineItem::TableValueHelp::externalWorkExperience::externalWorkExperienceSkills::skill_ID::Dialog::qualifier::::Table-innerTable';
        const objectTable = element(by.id(objectTableID));
        const objectTableRows = objectTable.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRowsObjectTable = await objectTableRows.count();
        for (let i = 0; i < noOfRowsObjectTable; i++) {
            const row = objectTableRows.get(i).element(by.control({
                controlType: 'sap.ui.mdc.Field',
                bindingPath: {
                    propertyPath: 'skill_ID',
                },
            }));

            const value = await row.asControl().getProperty('value');
            if (valueToBeChanged === await value) {
                elementToBeClicked = i;
                break;
            }
        }

        await objectTableRows.get(elementToBeClicked).element(by.control({
            controlType: 'sap.ui.core.Icon',
            properties: {
                src: 'sap-icon://value-help',
            },
        })).click();

        await PriorExperience.priorExperience.elements.valueHelpSearchInput_ext_skills.clear();
        await PriorExperience.priorExperience.elements.valueHelpSearchInput_ext_skills.sendKeys(newValue);
        await PriorExperience.priorExperience.elements.valueHelpShowFiltersBtn_ext_skills.click();
        await PriorExperience.priorExperience.elements.valueHelpSearchPress_ext_skills.click();

        const subObjectTable = element(by.id(subObjectTableID));
        const subObjectTableRows = subObjectTable.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRowsSubObjectTable = await subObjectTableRows.count();
        let elementToBeClickedSub;

        for (let j = 0; j < noOfRowsSubObjectTable; j++) {
            const row1 = subObjectTableRows.get(j).element(by.control({
                // bindingPath: 'skill_ID',
                controlType: 'sap.m.Text',
            }));
            const value1 = row1.getText();
            if (newValue === await value1) {
                elementToBeClickedSub = j;
                break;
            }
        }

        await subObjectTableRows.get(elementToBeClickedSub).element(by.control({
            controlType: 'sap.m.Text',
            properties: {
                text: newValue,
            },
        })).click();
    },

    async deleteSkill(valueToBeDeleted) {
        const tableId = 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::table::externalWorkExperienceSkills::LineItem';
        const deleteId = 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::table::externalWorkExperienceSkills::LineItem::StandardAction::Delete';
        const table = element(by.id(tableId));
        const rowsOfTable = table.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRows = await rowsOfTable.count();
        let noRowToBeDeleted;
        for (let i = 0; i < noOfRows; i++) {
            const row = rowsOfTable.get(i).element(by.control({
                controlType: 'sap.ui.mdc.Field',
            }));
            const value = await row.asControl().getProperty('value');
            if (valueToBeDeleted === await value) {
                noRowToBeDeleted = i;
                break;
            }
        }
        const rowToBeDeleted = await rowsOfTable.get(noRowToBeDeleted);
        const checkBox = await rowToBeDeleted.element(by.control({
            controlType: 'sap.m.CheckBox',
        }));
        await checkBox.click();
        const deleteBtn = await element(by.id(deleteId));
        await deleteBtn.click();
        const deleteButtonInDialog = await element(by.control({
            controlType: 'sap.m.Dialog',
        }));
        const deletes = await deleteButtonInDialog.element(by.control({
            controlType: 'sap.m.Button',
            properties: {
                text: 'Delete',
            },
        }));
        await deletes.click();
    },

    async openValueHelp(tableName, rownum) {
        const tableId = `myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem`;
        const table = element(by.id(tableId));
        const tableRows = table.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));

        await tableRows.get(rownum).element(
            by.control({
                controlType: 'sap.ui.core.Icon',
                properties: {
                    src: 'sap-icon://value-help',
                },
            }),
        ).click();
    },
    async getValueHelpItemsCount(tableName, skillName) {
        const subObjectTableID = `myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}s::LineItem::TableValueHelp::${tableName}_ID::Table-innerTable`;
        const subObjectTable = element(by.id(subObjectTableID));
        const subObjectTableRows = subObjectTable.all(by.control({
            controlType: 'sap.m.Text',
            properties: {
                text: skillName,
            },
        }));
        const noOfRowsSubObjectTable = await subObjectTableRows.count();
        return noOfRowsSubObjectTable;
    },

};

module.exports = {
    actions,
};
