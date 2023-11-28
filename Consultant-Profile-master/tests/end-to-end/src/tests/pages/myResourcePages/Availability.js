const parentElements = {
    anchorBar: element(by.control({
        controlType: 'sap.uxap.AnchorBar',
    })),
};

const availability = {
    tableTitle: element(by.id('myResourcesUi::MyResourceObjectPage--fe::table::periodicAvailability::LineItem-title')),

    table: element(by.id('myResourcesUi::MyResourceObjectPage--fe::table::periodicAvailability::LineItem-innerTable')),

    availabilityInAnchorBar: parentElements.anchorBar.element(by.control({
        controlType: 'sap.m.Button',
        properties: {
            text: 'Availability',
        },
    })),
};

const assertions = {
    checkTableTitle(expectedTableTitle) {
        const tableTitle = availability.tableTitle.getText();
        expect(expectedTableTitle).toBe(tableTitle);
    },

    checkAvailabilityData(rowNumber, month, availableCap, assignedCap, freeCap, utilization) {
        const tableRows = availability.table.all(by.control({ controlType: 'sap.m.ColumnListItem' }));
        const row = tableRows.get(rowNumber);
        const dataFields = row.all(by.control({ controlType: 'sap.m.Text' }));
        const utilizationField = row.element(by.control({
            controlType: 'sap.m.ObjectStatus',
            properties: {
                text: utilization,
            },
        }));
        expect(dataFields.get(0).getText()).toBe(month);
        expect(dataFields.get(1).getText()).toBe(availableCap);
        expect(dataFields.get(2).getText()).toBe(assignedCap);
        expect(dataFields.get(3).getText()).toBe(freeCap);
        expect(utilizationField.isPresent()).toBeTruthy();
    },
};

const actions = {
    navigateToAvailability() {
        availability.availabilityInAnchorBar.click();
    },
    async getHeaderInfo() {
        const headerInfo = await availability.table.element(by.id('myResourcesUi::MyResourceObjectPage--fe::table::periodicAvailability::LineItem-title'));
        const value = await headerInfo.getText();
        return value;
    },
};

module.exports = {
    parentElements,
    assertions,
    actions,
};
