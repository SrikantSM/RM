const parentElements = {

    objectPageSection: element(by.control({
        controlType: 'sap.uxap.ObjectPageSection',
        properties: {
            title: 'Availability',
        },
    })),

    anchorBar: element(by.control({
        controlType: 'sap.uxap.AnchorBar',
    })),

};

const availability = {

    table: element(by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::periodicAvailability::LineItem-innerTable')),

    availabilityInAnchorBar: parentElements.anchorBar.element(by.control({
        controlType: 'sap.m.Button',
        properties: {
            text: 'Availability',
        },
    })),

};

const actions = {

    async navigateToAvailability() {
        await availability.availabilityInAnchorBar.click();
    },

    async getHeaderInfo() {
        const headerInfo = await availability.table.element(by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::periodicAvailability::LineItem-title'));
        const value = await headerInfo.getText();
        return value;
    },
};

const assertions = {

    async checkAvailabilityData(rowNumber, month, availableCap, assignedCap, freeCap, utilization) {
        const tableId = 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::periodicAvailability::LineItem-innerTable';
        const table = element(by.id(tableId));
        const tableRows = table.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const row = await tableRows.get(rowNumber);
        const utilizationField = await row.element(by.control({
            controlType: 'sap.m.ObjectStatus',
        }));
        const dataFields = row.all(by.control({
            controlType: 'sap.m.Text',
        }));
        expect(await dataFields.get(0).getText()).toBe(month);
        expect(await dataFields.get(1).getText()).toBe(availableCap);
        expect(await dataFields.get(2).getText()).toBe(assignedCap);
        expect(await dataFields.get(3).getText()).toBe(freeCap);
        expect(await utilizationField.asControl().getProperty('text')).toBe(utilization);
    },
};

module.exports = {
    parentElements,
    availability,
    actions,
    assertions,
};
