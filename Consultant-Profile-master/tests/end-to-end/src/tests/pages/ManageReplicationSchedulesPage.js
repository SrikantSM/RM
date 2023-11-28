const viewId = 'replicationScheduleUi::ReplicationScheduleListReport';
const tableId = `${viewId}--fe::table::ReplicationSchedule::LineItem-innerTable`;

const actions = {
    async selectTableRow(noRfRowToBeSelected) {
        const table = element(by.id(tableId));
        const rowsOfTable = table.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));

        const rowToBeSelected = await rowsOfTable.get(noRfRowToBeSelected);

        const radioButton = await rowToBeSelected.element(by.control({
            controlType: 'sap.m.RadioButton',
        }));

        await radioButton.click();
    },

    async clickOnShowDetailsButton() {
        const showDetailsButton = await element(by.control({
            controlType: 'sap.m.Button',
            properties: {
                icon: 'sap-icon://detail-more',
            },
        }));

        await showDetailsButton.click();
    },

    async isShowDetailsSegmentButtonPresent() {
        return (element(by.control({
            controlType: 'sap.m.SegmentedButton',
            properties: {
                enabled: true,
            },
        }))).isPresent();
    },

    async clickOnDeactivateButton(noRfRowToBeSelected) {
        const table = await element(by.id(tableId));

        const rowsOfTable = table.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));

        const rowToBeSelected = await rowsOfTable.get(noRfRowToBeSelected);

        const deactivateButton = await rowToBeSelected.element(by.control({
            controlType: 'sap.m.Button',
            properties: {
                text: 'Deactivate',
            },
        }));

        await deactivateButton.click();
    },

    async clickOnActivateButton() {
        await element(by.control({
            id: 'replicationScheduleUi::ReplicationScheduleListReport--fe::table::ReplicationSchedule::LineItem::DataFieldForAction::ReplicationScheduleService.editSchedule',
            interaction: {
                idSuffix: 'content',
            },
        })).click();
    },

    async enterDate() {
        const nextYear = new Date().getFullYear() + 1;
        const inputDate = `Jan 1,${nextYear}, 12:00:00 AM`;
        await element(by.control({
            id: 'APD_::nextRun-inner',
            searchOpenDialogs: true,
            interaction: {
                idSuffix: 'inner',
            },
        })).clear();
        await element(by.control({
            id: 'APD_::nextRun-inner',
            searchOpenDialogs: true,
            interaction: {
                idSuffix: 'inner',
            },
        })).sendKeys(inputDate);
    },

    async clickOnActivateButtonOnDialog() {
        await element(by.control({
            controlType: 'sap.m.Button',
            viewId,
            properties: {
                text: 'Activate',
            },
            searchOpenDialogs: true,
        })).click();
    },
};

module.exports = {
    actions,
};
