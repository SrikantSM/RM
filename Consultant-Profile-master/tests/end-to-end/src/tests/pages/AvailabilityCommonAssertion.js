const elements = {
    appTitle: element(by.control({
        controlType: 'sap.ushell.ui.ShellHeader',
        id: 'shell-header',
    })),

    costCenterValueHelp: element(by.control({
        id: 'application-availabilityUpload-Upload-component---app--costCenterInput-vhi',
    })),

    costCenterValueHelpList(costCenter) {
        const costCenterValueHelp = element(by.control({
            controlType: 'sap.m.StandardListItem',
            properties: {
                title: costCenter,
            },
        }));
        return costCenterValueHelp;
    },

    arrowWorkforcePersonIcon: element(by.control({ id: /app--workforceIDInput-arrow$/ })),

    workforcePersonDropDownListItem: (workforcePerson) => element(by.control(
        {
            id: /app--workforceIDInput-popup-list$/,
            interaction: 'root',
        },
    )).element(by.control({
        controlType: 'sap.m.StandardListItem',
        properties: [{ title: workforcePerson }],
    })),

    pageTitle: element(
        by.control({
            controlType: 'sap.f.DynamicPageTitle',
        }),
    ),
    listReportTableRows: element(by.control({
        controlType: 'sap.ui.mdc.Table',
        id: 'availabilityUploadUi::AvailabilityUploadListReport--fe::table::AvailabilityUploadData::LineItem',
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
    async getIndex(workAssignment) {
        const tableRows = elements.listReportTableRows;
        const cnt = await tableRows.count();
        let index = -1;
        for (let i = 0; i < cnt; i++) {
            const row = tableRows.get(i).all(
                by.control({
                    controlType: 'sap.m.Text',
                }),
            );
            const workAssignmentValue = row.get(5).getText();
            if (workAssignment === await workAssignmentValue) {
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
    getPageTitle(pageTitle) {
        const title = elements.pageTitle.element(
            by.control({
                controlType: 'sap.m.Title',
                properties: {
                    text: pageTitle,
                },
            }),
        );
        return title;
    },

};

const assertions = {

    async checkTableData(name, workerType, resourceOrg, costCenter, workforcePerson, workAssignment, status, percentage) {
        const table = element(by.id('availabilityUploadUi::AvailabilityUploadListReport--fe::table::AvailabilityUploadData::LineItem-innerTable'));
        const tableRows = table.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const index = await actions.getIndex(workAssignment);
        const row = await tableRows.get(index);
        // const statusField = await row.element(by.control({
        //     controlType: 'sap.m.ObjectStatus',
        // }));
        const dataFields = row.all(by.control({
            controlType: 'sap.m.Text',
        }));

        // const chartField = await row.element(by.control({
        //     controlType: 'sap.suite.ui.microchart.RadialMicroChart',
        // }));

        expect(await dataFields.get(0).getText()).toBe(name);
        expect(await dataFields.get(1).getText()).toBe(workerType);
        expect(await dataFields.get(2).getText()).toBe(resourceOrg);
        expect(await dataFields.get(3).getText()).toBe(costCenter);
        expect(await dataFields.get(4).getText()).toBe(workforcePerson);
        // expect(await dataFields.get(4).getText()).toBe(workAssignment);
        // expect(await statusField.asControl().getProperty('text')).toBe(status);
        // expect(await chartField.asControl().getProperty('percentage')).toBe(percentage);
    },
};

module.exports = {
    elements,
    actions,
    assertions,
};
