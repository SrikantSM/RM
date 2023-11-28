var parentElements = {

    objectPageSection: element(by.control({
        controlType: "sap.uxap.ObjectPageSection",
        properties: {
            title: "Availability"
        }
    })),

    anchorBar: element(by.control({
        controlType: "sap.uxap.AnchorBar"
    }))

}

var availability = {

    table: element(by.id("consultantProfileUi::ConsultantProfileObjectPage--fe::table::availabilityMonth::LineItem-innerTable")),

    availabilityInAnchorBar: parentElements.anchorBar.element(by.control({
        controlType: "sap.m.Button",
        properties: {
            text: "Availability"
        }
    }))
}

var actions = {

    navigateToAvailability: async function () {

        await availability.availabilityInAnchorBar.click();

    },

    getColumnHeader: async function (columnHeaderNumber) {

        if (columnHeaderNumber == 0) {
            var columnHeaderID = "consultantProfileUi::ConsultantProfileObjectPage--fe::table::availabilityMonth::LineItem::C::monthYear-innerColumn";
        } else if (columnHeaderNumber == 1) {
            var columnHeaderID = "consultantProfileUi::ConsultantProfileObjectPage--fe::table::availabilityMonth::LineItem::C::grossCapacity-innerColumn";
        } else if (columnHeaderNumber == 2) {
            var columnHeaderID = "consultantProfileUi::ConsultantProfileObjectPage--fe::table::availabilityMonth::LineItem::C::bookedCapacity-innerColumn";
        } else if (columnHeaderNumber == 3) {
            var columnHeaderID = "consultantProfileUi::ConsultantProfileObjectPage--fe::table::availabilityMonth::LineItem::C::netCapacity-innerColumn";
        } else if (columnHeaderNumber == 4) {
            columnHeaderID = "consultantProfileUi::ConsultantProfileObjectPage--fe::table::availabilityMonth::LineItem::C::utilizationPercentage-innerColumn";
        } else {
            browser.close();
        }
        var columnHeader = await element(by.id(columnHeaderID));
        var value = await columnHeader.element(by.control({
            controlType: "sap.m.Text"
        })).getText();
        return value
    },

    getRows: async function () {

        var tableRows = availability.table.all(by.control({
            controlType: "sap.m.ColumnListItem",
        }));
        return tableRows.count();
    },

    getAvailability: async function (rowNumber, month, tAssigCap, assigCap, freeCap, utilization) {

        var tableRows = availability.table.all(by.control({
            controlType: "sap.m.ColumnListItem",
        }));

        var dataFields = tableRows.get(rowNumber).all(by.control({
            controlType: "sap.ui.mdc.Field"
        }));
        expect(await dataFields.get(0).getText()).toBe(month);
        expect(await dataFields.get(1).getText()).toBe(tAssigCap);
        expect(await dataFields.get(2).getText()).toBe(assigCap);
        expect(await dataFields.get(3).getText()).toBe(freeCap);
        expect(await dataFields.get(4).getText()).toBe(utilization);

    }



}

module.exports = {
    parentElements: parentElements,
    availability: availability,
    actions: actions
}