const elements = {
    appTitle: element(by.control({
        controlType: 'sap.ushell.ui.ShellHeader',
        id: 'shell-header',
    })),
    listReportTableRows: element(by.control({
        controlType: 'sap.ui.mdc.Table',
        id: 'myResourcesUi::MyResourceListReport--fe::table::ProjectExperienceHeader::LineItem',
    })).all(by.control({ controlType: 'sap.m.ColumnListItem' })),

    iExecuteShowDetails: element(by.control({
        controlType: 'sap.m.Button',
        properties: [{ icon: 'sap-icon://detail-more' }],
        ancestor: { id: /showHideDetails$/ },
    })),

    iExecuteHideDetails: element(by.control({
        controlType: 'sap.m.Button',
        properties: [{ icon: 'sap-icon://detail-less' }],
        ancestor: { id: /showHideDetails$/ },
    })),
};
const actions = {
    async getIndex(costCenter) {
        const tableRows = elements.listReportTableRows;
        const cnt = await tableRows.count();
        let index = -1;
        for (let i = 0; i < cnt; i++) {
            const row = tableRows.get(i).all(
                by.control({
                    controlType: 'sap.m.Text',
                }),
            );
            const costCenterValue = row.get(2).getText();
            if (costCenter === await costCenterValue) {
                index = i;
                break;
            }
        }
        return index;
    },

    getAppTitle(title) {
        const appTitle = elements.appTitle.element(by.control({
            controlType: 'sap.ushell.ui.shell.ShellAppTitle',
            properties: { text: title },
        }));
        return appTitle;
    },
};
const assertions = {

    async checkTableData(name, projectRole, workerType, employeeId, costCenter, officeLocation) {
        const table = element(by.id('myResourcesUi::MyResourceListReport--fe::table::ProjectExperienceHeader::LineItem-innerTable'));
        const tableRows = table.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const index = await actions.getIndex(costCenter);
        const row = await tableRows.get(index);
        const dataFields = row.all(by.control({
            controlType: 'sap.m.Text',
        }));
        // expect(await dataFields.get(0).getText()).toBe(name);
        expect(await dataFields.get(0).getText()).toBe(workerType);
        expect(await dataFields.get(1).getText()).toBe(projectRole);
        expect(await dataFields.get(2).getText()).toBe(costCenter);
        expect(await dataFields.get(3).getText()).toBe(officeLocation);
    },
};

module.exports = {
    elements,
    actions,
    assertions,
};
