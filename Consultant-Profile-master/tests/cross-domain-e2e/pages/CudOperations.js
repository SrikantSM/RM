var CommonPageElements = require('./CommonPageElements.js');
var PriorExperience = require('./PriorExperience.js');
var actions = {

    create: async function(tableName) {
        var tableId = "myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::"+tableName+"::LineItem";
        var table = element(by.id(tableId));

        var rows = table.all(by.control({
            controlType: "sap.m.ColumnListItem"
        }));

        var noOfRowsBeforeCreate = await rows.count();

        var createId = "myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::"+tableName+"::LineItem::StandardAction::Create";
        var createButton = element(by.id(createId));
        await createButton.click();

    },

    async clickDropdownBySiblingValue(tableName, siblingValue, propertyName) {
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
                        id: `myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem`,
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

    delete: async function(tableName, valueToBeDeleted) {

        var tableId = "myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::"+tableName+"::LineItem";
        var deleteId = "myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::"+tableName+"::LineItem::StandardAction::Delete";
        var table = element(by.id(tableId));
        var rowsOfTable = table.all(by.control({
            controlType: "sap.m.ColumnListItem"
        }));
        var noOfRows = await rowsOfTable.count();
        var noRowToBeDeleted;

        for(var i=0; i<noOfRows; i++) {
            var row = rowsOfTable.get(i).element(by.control({
                controlType: "sap.ui.mdc.Field"
            }));

            var value = await row.getAttribute("value");
            if(valueToBeDeleted == await value) {
                noRowToBeDeleted = i;
                break;
            }
        }


        var rowToBeDeleted = await rowsOfTable.get(noRowToBeDeleted);
        var checkBox = await rowToBeDeleted.element(by.control({
            controlType: "sap.m.CheckBox"
        }));

        await checkBox.click();
        var deleteBtn = await element(by.id(deleteId));
        await deleteBtn.click();

        var deleteButtonInDialog =await element(by.control({
            controlType: "sap.m.Dialog",
           }));

        var deletes = await deleteButtonInDialog.element(by.control({
            controlType: "sap.m.Button",
            properties: {
                text: "Delete"
            }}));

        await deletes.click();
    },

    changeValueOfTheRow: async function(tableName, valueToBeChanged, newValue) {

        var table_ID;
        var elementToBeClicked;
        if(tableName == "roles")
            table_ID = "role_ID";
        else
            table_ID = "skill_ID";

        var objectTableID = "myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::"+tableName+"::LineItem";
        var subObjectTableID = "myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::"+tableName+"::LineItem::TableValueHelp::"+tableName+"::"+table_ID+"::Dialog::qualifier::::Table-innerTable";
        var objectTable = element(by.id(objectTableID));
        var objectTableRows = objectTable.all(by.control({
            controlType: "sap.m.ColumnListItem"
        }));
        var noOfRowsObjectTable = await objectTableRows.count();
        for(var i=0; i<noOfRowsObjectTable; i++) {
            var row = objectTableRows.get(i).element(by.control({
                controlType: "sap.ui.mdc.Field"
            }));

            var value = await row.getAttribute("value");
            if(valueToBeChanged == await value) {
                elementToBeClicked = i;
                break;
            }

        }

        await objectTableRows.get(elementToBeClicked).element(by.control({
            controlType: "sap.ui.core.Icon",
            properties: {
                src: "sap-icon://value-help"
            }
        })).click();

        if (tableName === 'roles') {
            await PriorExperience.priorExperience.elements.valueHelpSearchInput.sendKeys(newValue);
            await PriorExperience.priorExperience.elements.roleValueHelpShowFiltersBtn.click();
            await PriorExperience.priorExperience.elements.valueHelpSearchPress_roles.click();
        } else {
            await PriorExperience.priorExperience.elements.valueHelpSearchInput.sendKeys(newValue);
            await PriorExperience.priorExperience.elements.valueHelpShowFiltersBtn.click();
            await PriorExperience.priorExperience.elements.valueHelpSearchPress_skills.click();

        }
        
        var subObjectTable = element(by.id(subObjectTableID));
        var subObjectTableRows = subObjectTable.all(by.control({
            controlType: "sap.ui.table.Row"
        }));
        var noOfRowsSubObjectTable = await subObjectTableRows.count();
        var elementToBeClickedSub;

        for(var j=0; j<noOfRowsSubObjectTable; j++) {
            var row1 = subObjectTableRows.get(j).element(by.control({
                controlType: "sap.m.Text"
            }));
            var value1 = row1.getText();
            if( newValue == await value1) {
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

    }
}

module.exports = {
    actions : actions
}
