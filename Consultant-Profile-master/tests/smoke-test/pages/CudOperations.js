var PriorExperience = require('./PriorExperience.js');
var actions = {

    create: async function(tableName) {
        var tableId = "myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::"+tableName+"::LineItem";
        var table = element(by.id(tableId));

        var rows = table.all(by.control({
            controlType: "sap.m.ColumnListItem"
        }));

        var createId = "myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::"+tableName+"::LineItem::StandardAction::Create";
        var createButton = element(by.id(createId));
        await createButton.click();

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
