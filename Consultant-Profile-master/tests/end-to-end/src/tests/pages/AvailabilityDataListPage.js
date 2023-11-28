const CommonPageElements = require('./CommonPageElements.js');
const AvailabilityCommonAssertion = require('./AvailabilityCommonAssertion.js');

const listReport = {
    elements: {
        titleString: 'Workforce',
        tableRows: CommonPageElements.listReport.elements.tableRows,
        header: CommonPageElements.listReport.elements.header,
    },
};

const elements = {
    tableTitle: element(by.id('availabilityUploadUi::AvailabilityUploadListReport--fe::table::AvailabilityUploadData::LineItem-title')),

    workerTypeValueHelpTable: element(by.id('availabilityUploadUi::AvailabilityUploadListReport--fe::FilterBar::AvailabilityUploadData::FilterFieldValueHelp::workerType::name::Table-innerTable')),
    workforcePersonValueHelpTable: element(by.id('availabilityUploadUi::AvailabilityUploadListReport--fe::FilterBar::AvailabilityUploadData::FilterFieldValueHelp::workForcePersonExternalId::Dialog::qualifier::::Table-innerTable')),
    costCenterValueHelpTable: element(by.id('availabilityUploadUi::AvailabilityUploadListReport--fe::FilterBar::AvailabilityUploadData::FilterFieldValueHelp::s4CostCenterId::Dialog::qualifier::::Table-innerTable')),
    resourceOrgValueHelpTable: element(by.id('availabilityUploadUi::AvailabilityUploadListReport--fe::FilterBar::AvailabilityUploadData::FilterFieldValueHelp::resourceOrg::Dialog::qualifier::::Table-innerTable')),
    uploadStatusValueHelpTable: element(by.id('availabilityUploadUi::AvailabilityUploadListReport--fe::FilterBar::AvailabilityUploadData::FilterFieldValueHelp::availabilitySummaryStatus::code::SuggestTable')),

    listReportTable: element(by.control({
        controlType: 'sap.m.Table',
        id: 'availabilityUploadUi::AvailabilityUploadListReport--fe::table::AvailabilityUploadData::LineItem-innerTable',
        interaction: 'focus',
    })),

    listReportTableRows: element(by.control({
        controlType: 'sap.ui.mdc.Table',
        id: 'availabilityUploadUi::AvailabilityUploadListReport--fe::table::AvailabilityUploadData::LineItem',
    })).all(by.control({ controlType: 'sap.m.ColumnListItem' })),

    filterBar: element(by.control({
        controlType: 'sap.ui.mdc.FilterBar',
    })),

};

const filterElements = {

    workForceVHSearchInput: element(by.control({
        controlType: 'sap.m.SearchField',
        id: 'availabilityUploadUi::AvailabilityUploadListReport--fe::FilterBar::AvailabilityUploadData::FilterFieldValueHelp::workForcePersonExternalId::Dialog::qualifier::-search-inner',
        interaction: 'focus',
    })),

    workForceVHSearchPress: element(by.control({
        controlType: 'sap.m.SearchField',
        id: 'availabilityUploadUi::AvailabilityUploadListReport--fe::FilterBar::AvailabilityUploadData::FilterFieldValueHelp::workForcePersonExternalId::Dialog::qualifier::-search-inner',
        interaction: 'press',
    })),

    resourceOrgVHSearchInput: element(by.control({
        controlType: 'sap.m.SearchField',
        id: 'availabilityUploadUi::AvailabilityUploadListReport--fe::FilterBar::AvailabilityUploadData::FilterFieldValueHelp::resourceOrg::Dialog::qualifier::-search-inner',
        interaction: 'focus',
    })),

    resourceOrgVHSearchPress: element(by.control({
        controlType: 'sap.m.SearchField',
        id: 'availabilityUploadUi::AvailabilityUploadListReport--fe::FilterBar::AvailabilityUploadData::FilterFieldValueHelp::resourceOrg::Dialog::qualifier::-search-inner',
        interaction: 'press',
    })),

    expandButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { icon: 'sap-icon://slim-arrow-down' },
    })),

    workerType: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Worker Type',
            },
        }),
    ),

    serviceOrg: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Service Organization',
            },
        }),
    ),

    workforcePerson: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Workforce Person (External ID)',
            },
        }),
    ),

    costCenter: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Cost Center',
            },
        }),
    ),

    resourceOrg: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Resource Organization',
            },
        }),
    ),

    uploadStatus: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Upload Status',
            },
        }),
    ),

    workforcePersonValueHelp: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Workforce Person (External ID)',
            },
        }),
    ).element(by.control({
        controlType: 'sap.ui.core.Icon',
        properties: {
            src: 'sap-icon://value-help',
        },
    })),

    workforcePersonValueHelpOkbutton: element(
        by.id('availabilityUploadUi::AvailabilityUploadListReport--fe::FilterBar::AvailabilityUploadData::FilterFieldValueHelp::workForcePersonExternalId-ok'),
    ),

    costCenterValueHelp: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Cost Center',
            },
        }),
    ).element(by.control({
        controlType: 'sap.ui.core.Icon',
        properties: {
            src: 'sap-icon://value-help',
        },
    })),

    resourceOrgValueHelp: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Resource Organization',
            },
        }),
    ).element(by.control({
        controlType: 'sap.ui.core.Icon',
        properties: {
            src: 'sap-icon://value-help',
        },
    })),

    uploadStatusValueHelp: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Upload Status',
            },
        }),
    ).element(by.control({
        controlType: 'sap.ui.core.Icon',
        properties: {
            src: 'sap-icon://slim-arrow-down',
        },
    })),

    costCenterValueHelpOkbutton: element(
        by.id('availabilityUploadUi::AvailabilityUploadListReport--fe::FilterBar::AvailabilityUploadData::FilterFieldValueHelp::s4CostCenterId-ok'),
    ),

    goButton: elements.filterBar.element(
        by.id('availabilityUploadUi::AvailabilityUploadListReport--fe::FilterBar::AvailabilityUploadData-btnSearch'),
    ),

    searchPlaceholder: element(by.control({
        controlType: 'sap.ui.mdc.FilterField',
        properties: {
            placeholder: 'Search',
        },
    })),

    valueHelpOkbutton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'OK' },
    })),
};

const actions = {

    async navigateToWorkAssignment(workAssignment) {
        AvailabilityCommonAssertion.elements.iExecuteShowDetails.click();
        const rowToBeClicked = await this.getIndex(workAssignment, undefined);
        AvailabilityCommonAssertion.elements.iExecuteHideDetails.click();
        await elements.listReportTableRows.get(rowToBeClicked).all(
            by.control({
                controlType: 'sap.m.Text',
            }),
        ).click();
    },
    async navigateToStatus(status) {
        const rowToBeClicked = this.getIndex(undefined, status);
        await elements.listReportTableRows.get(rowToBeClicked).click();
    },
    async isRecordPresent(workAssignment) {
        const index = await this.getIndex(workAssignment, undefined);
        if (index === -1) {
            return false;
        }
        return true;
    },
    async getIndex(workAssignment, status) {
        const tableRows = elements.listReportTableRows;
        const cnt = await tableRows.count();
        let index = -1;
        for (let i = 0; i < cnt; i++) {
            const row = tableRows.get(i).all(
                by.control({
                    controlType: 'sap.m.Text',
                }),
            );
            if (workAssignment === undefined) {
                const statusValue = await row.get(1).getText();
                if (status === await statusValue) {
                    index = i;
                    break;
                }
            } else {
                const workAssignmentValue = row.get(5).getText();
                if (workAssignment === await workAssignmentValue) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    },

    async clickOnUploadButton() {
        const uploadId = 'availabilityUploadUi::AvailabilityUploadListReport--fe::table::AvailabilityUploadData::LineItem::DataFieldForIntentBasedNavigation::availabilityUpload::Upload';
        const uploadButton = element(by.id(uploadId));
        await uploadButton.click();
    },

    async clickOnDownloadButton() {
        const downloadId = 'availabilityUploadUi::AvailabilityUploadListReport--fe::table::AvailabilityUploadData::LineItem::DataFieldForIntentBasedNavigation::availabilityUpload::Download';
        const downloadButton = element(by.id(downloadId));
        await downloadButton.click();
    },

    async clickOnExpandButton() {
        const expandButton = element.all(by.control({
            controlType: 'sap.m.Button',
            properties: { icon: 'sap-icon://slim-arrow-down' },
            ancestor: {
                controlType: 'sap.f.DynamicPageTitle',
            },
        })).last();
        await expandButton.click();
    },

    getColumnHeader() {
        const columnHeaders = elements.listReportTable.all(
            by.control({
                controlType: 'sap.m.Column',
            }),
        );
        return columnHeaders;
    },

    async getUploadStatus(workAssignment, uploadStatus) {
        const tableRows = elements.listReportTableRows;
        const rowToBeChecked = this.getIndex(workAssignment, undefined);
        const status = await tableRows.get(rowToBeChecked).element(
            by.control({
                controlType: 'sap.m.ObjectStatus',
                properties: {
                    text: uploadStatus,
                },
            }),
        ).isPresent();
        return status;
    },

    async getUploadChartPercentage(workAssignment, percentage) {
        const tableRows = elements.listReportTableRows;
        const rowToBeChecked = this.getIndex(workAssignment, undefined);
        const percentageValue = await tableRows.get(rowToBeChecked).element(
            by.control({
                controlType: 'sap.suite.ui.microchart.RadialMicroChart',
                properties: {
                    percentage,
                },
            }),
        ).isPresent();
        return percentageValue;
    },

    async getUploadStatusValueHelp(uploadStatusPath) {
        const status = element(by.control({
            controlType: 'sap.m.Text',
            viewId: 'availabilityUploadUi::AvailabilityUploadListReport',
            bindingPath: {
                path: uploadStatusPath,
                propertyPath: 'name',
            },
            searchOpenDialogs: true,
        })).asControl().getProperty('text');
        return status;
    },

    async getValueHelpData(table, value) {
        let valueHelpTable;
        let valueHelpTableRows;
        if (table === 'workerType') {
            valueHelpTable = elements.workerTypeValueHelpTable;
            valueHelpTableRows = valueHelpTable.all(by.control({
                controlType: 'sap.ui.table.Row',
            }));
        } else if (table === 'costCenter') {
            valueHelpTable = elements.costCenterValueHelpTable;
            valueHelpTableRows = valueHelpTable.all(by.control({
                controlType: 'sap.ui.table.Row',
            }));
        } else if (table === 'workforcePerson') {
            valueHelpTable = elements.workforcePersonValueHelpTable;
            valueHelpTableRows = valueHelpTable.all(by.control({
                controlType: 'sap.ui.table.Row',
            }));
        } else if (table === 'resourceOrg') {
            valueHelpTable = elements.resourceOrgValueHelpTable;
            valueHelpTableRows = valueHelpTable.all(by.control({
                controlType: 'sap.ui.table.Row',
            }));
        }
        const noOfRows = await valueHelpTableRows.count();
        let i = 0;
        let valueFromValueHelp = null;
        for (; i < noOfRows; i++) {
            const row = valueHelpTableRows.get(i).element(by.control({
                controlType: 'sap.m.Text',
            }));
            const valueToCheck = await row.getText();
            if (value === valueToCheck) {
                valueFromValueHelp = value;
                break;
            }
        }
        return valueFromValueHelp;
    },

    async selectFromValueHelp(table, iValue) {
        let valueHelpTable;
        if (table === 'workerType') {
            valueHelpTable = elements.workerTypeValueHelpTable;
        } else if (table === 'costCenter') {
            valueHelpTable = elements.costCenterValueHelpTable;
        } else if (table === 'resourceOrg') {
            valueHelpTable = elements.resourceOrgValueHelpTable;
        } else {
            valueHelpTable = elements.workforcePersonValueHelpTable;
        }
        const valueHelpTableRows = valueHelpTable.all(by.control({
            controlType: 'sap.ui.table.Row',
        }));
        const noOfRows = await valueHelpTableRows.count();
        let i = 0;
        for (; i < noOfRows; i++) {
            const row = valueHelpTableRows.get(i).element(by.control({
                controlType: 'sap.m.Text',
            }));
            const value = row.getText();
            if (iValue === await value) {
                break;
            }
        }
        await valueHelpTableRows.get(i).element(by.control({
            controlType: 'sap.m.Text',
        })).click();
    },

};

module.exports = {
    elements,
    listReport,
    actions,
    filterElements,
};
