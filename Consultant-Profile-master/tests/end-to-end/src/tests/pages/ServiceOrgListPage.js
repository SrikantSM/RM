const CommonPageElements = require('./CommonPageElements.js');

const listReport = {
    elements: {
        titleString: 'Service Organizations',
        tableRows: CommonPageElements.listReport.elements.tableRows,
        header: CommonPageElements.listReport.elements.header,
    },
};

const elements = {
    tableTitle: element(
        by.id(
            'businessServiceOrgUi::OrganizationListReport--fe::table::BSODetails::LineItem-title',
        ),
    ),

    serviceCodeValueHelpTable: element(
        by.id(
            'businessServiceOrgUi::OrganizationListReport--fe::FilterBar::BSODetails::FilterFieldValueHelp::code::Table-innerTable',
        ),
    ),

    costCenterValueHelpTable: element(
        by.id(
            'businessServiceOrgUi::OrganizationListReport--fe::FilterBar::BSODetails::FilterFieldValueHelp::costCenter::Table-innerTable',
        ),
    ),

    listReportTable: element(
        by.control({
            controlType: 'sap.m.Table',
            id: 'businessServiceOrgUi::OrganizationListReport--fe::table::BSODetails::LineItem-innerTable',
            interaction: 'focus',
        }),
    ),

    listReportTableRows: element(
        by.control({
            controlType: 'sap.ui.mdc.Table',
            id: 'businessServiceOrgUi::OrganizationListReport--fe::table::BSODetails::LineItem',
        }),
    ).all(by.control({ controlType: 'sap.m.ColumnListItem' })),

    filterBar: element(
        by.control({
            controlType: 'sap.ui.mdc.FilterBar',
        }),
    ),
};

const filterElements = {
    searchInput: element(
        by.control({
            controlType: 'sap.m.SearchField',
            interaction: 'focus',
        }),
    ),

    searchPress: element(
        by.control({
            controlType: 'sap.m.SearchField',
            interaction: 'press',
        }),
    ),

    codeVHSearchInput: element(
        by.control({
            controlType: 'sap.m.SearchField',
            id: 'businessServiceOrgUi::OrganizationListReport--fe::FilterBar::BSODetails::FilterFieldValueHelp::code::Dialog::qualifier::-search-inner',
            interaction: 'focus',
        }),
    ),

    codeVHSearchPress: element(
        by.control({
            controlType: 'sap.m.SearchField',
            id: 'businessServiceOrgUi::OrganizationListReport--fe::FilterBar::BSODetails::FilterFieldValueHelp::code::Dialog::qualifier::-search-inner',
            interaction: 'press',
        }),
    ),

    costCenterVHSearchInput: element(
        by.control({
            controlType: 'sap.m.SearchField',
            id: 'businessServiceOrgUi::OrganizationListReport--fe::FilterBar::BSODetails::FilterFieldValueHelp::costCenter::Dialog::qualifier::-search-inner',
            interaction: 'focus',
        }),
    ),

    costCenterVHSearchPress: element(
        by.control({
            controlType: 'sap.m.SearchField',
            id: 'businessServiceOrgUi::OrganizationListReport--fe::FilterBar::BSODetails::FilterFieldValueHelp::costCenter::Dialog::qualifier::-search-inner',
            interaction: 'press',
        }),
    ),

    expandButton: element(
        by.control({
            controlType: 'sap.m.Button',
            properties: { icon: 'sap-icon://slim-arrow-down' },
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

    code: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Code',
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

    uploadStatus: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Default Cost Center',
            },
        }),
    ),

    serviceCodeValueHelp: elements.filterBar
        .element(
            by.control({
                controlType: 'sap.ui.mdc.FilterField',
                properties: {
                    label: 'Code',
                },
            }),
        )
        .element(
            by.control({
                controlType: 'sap.ui.core.Icon',
                properties: {
                    src: 'sap-icon://value-help',
                },
            }),
        ),

    serviceCodeValueHelpOkbutton: element(
        by.control({
            controlType: 'sap.m.Button',
            viewId: 'businessServiceOrgUi::OrganizationListReport',
            bindingPath: {
                path: '',
                propertyPath: '/_valid',
                modelName: '$valueHelp',
            },
        }),
    ),

    costCenterValueHelp: elements.filterBar
        .element(
            by.control({
                controlType: 'sap.ui.mdc.FilterField',
                properties: {
                    label: 'Cost Center',
                },
            }),
        )
        .element(
            by.control({
                controlType: 'sap.ui.core.Icon',
                properties: {
                    src: 'sap-icon://value-help',
                },
            }),
        ),

    costCenterValueHelpOkbutton: element(
        by.control({
            controlType: 'sap.m.Button',
            viewId: 'businessServiceOrgUi::OrganizationListReport',
            bindingPath: {
                path: '',
                propertyPath: '/_valid',
                modelName: '$valueHelp',
            },
        }),
    ),

    goButton: elements.filterBar.element(
        by.id(
            'businessServiceOrgUi::OrganizationListReport--fe::FilterBar::BSODetails-btnSearch',
        ),
    ),
};

const actions = {
    async navigateToCostCenter(costCenter) {
        const rowToBeClicked = await this.getIndex(costCenter, undefined);
        await elements.listReportTableRows.get(rowToBeClicked).click();
    },

    async isRecordPresent(costCenter) {
        const index = await this.getIndex(costCenter, undefined);
        if (index === -1) {
            return false;
        }
        return true;
    },

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
            const costCenterValue = row.get(5).getText();
            if (costCenter === (await costCenterValue)) {
                index = i;
                break;
            }
        }
        return index;
    },

    async clickOnUploadButton() {
        const uploadId = 'businessServiceOrgUi::OrganizationListReport--fe::table::BSODetails::LineItem::DataFieldForIntentBasedNavigation::businessServiceOrgUi::upload';
        const uploadButton = element(by.id(uploadId));
        await uploadButton.click();
    },

    async clickOnExpandButton() {
        const expandButton = element
            .all(
                by.control({
                    controlType: 'sap.m.Button',
                    properties: { icon: 'sap-icon://slim-arrow-down' },
                    ancestor: {
                        controlType: 'sap.f.DynamicPageTitle',
                    },
                }),
            )
            .last();
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

    async getUploadStatus(costCenter, uploadStatus) {
        const { tableRows } = listReport.elements;
        const rowToBeChecked = this.getIndex(costCenter, undefined);
        const status = await tableRows
            .get(rowToBeChecked)
            .element(
                by.control({
                    controlType: 'sap.m.ObjectStatus',
                    properties: {
                        text: uploadStatus,
                    },
                }),
            )
            .isPresent();
        return status;
    },

    async selectFromValueHelp(table, iValue) {
        let valueHelpTableID;
        if (table === 'costCenter') {
            valueHelpTableID = 'businessServiceOrgUi::OrganizationListReport--fe::FilterBar::BSODetails::FilterFieldValueHelp::costCenter::Dialog::qualifier::::Table-innerTable';
        } else if (table === 'code') {
            valueHelpTableID = 'businessServiceOrgUi::OrganizationListReport--fe::FilterBar::BSODetails::FilterFieldValueHelp::code::Dialog::qualifier::::Table-innerTable';
        }

        const valueHelpTable = element(by.id(valueHelpTableID));
        const valueHelpTableRows = valueHelpTable.all(
            by.control({
                controlType: 'sap.ui.table.Row',
            }),
        );
        const noOfRows = await valueHelpTableRows.count();
        let i = 0;
        for (; i < noOfRows; i++) {
            const row = valueHelpTableRows.get(i).element(
                by.control({
                    controlType: 'sap.m.Text',
                }),
            );
            const value = row.getText();
            if (iValue === (await value)) {
                break;
            }
        }
        await valueHelpTableRows
            .get(i)
            .element(
                by.control({
                    controlType: 'sap.m.Text',
                }),
            )
            .click();
    },

    async getValueHelpData(table, value) {
        let valueHelpTableID;
        if (table === 'costCenter') {
            valueHelpTableID = 'businessServiceOrgUi::OrganizationListReport--fe::FilterBar::BSODetails::FilterFieldValueHelp::costCenter::Dialog::qualifier::::Table-innerTable';
        } else if (table === 'code') {
            valueHelpTableID = 'businessServiceOrgUi::OrganizationListReport--fe::FilterBar::BSODetails::FilterFieldValueHelp::code::Table-innerTable';
        }
        const valueHelpTable = element(by.id(valueHelpTableID));
        const valueHelpTableRows = valueHelpTable.all(
            by.control({
                controlType: 'sap.ui.table.Row',
            }),
        );
        const noOfRows = await valueHelpTableRows.count();
        let i = 0;
        let valueFromValueHelp = null;
        for (; i < noOfRows; i++) {
            const row = valueHelpTableRows.get(i).element(
                by.control({
                    controlType: 'sap.m.Text',
                }),
            );
            const valueToCheck = await row.getText();
            if (value === valueToCheck) {
                valueFromValueHelp = value;
                break;
            }
        }
        return valueFromValueHelp;
    },
};

const assertions = {
    async checkServiceOrgData(
        code,
        description,
        isDelivery,
        companyCode,
        controllingArea,
        costCenter,
    ) {
        const tableID = 'businessServiceOrgUi::OrganizationListReport--fe::table::BSODetails::LineItem-innerTable';
        const table = element(by.id(tableID));
        const tableRows = table.all(
            by.control({
                controlType: 'sap.m.ColumnListItem',
            }),
        );
        const index = await actions.getIndex(costCenter);
        const row = await tableRows.get(index);
        const dataFields = row.all(
            by.control({
                controlType: 'sap.m.Text',
            }),
        );
        expect(await dataFields.get(0).getText()).toBe(code);
        expect(await dataFields.get(1).getText()).toBe(description);
        expect(await dataFields.get(2).getText()).toBe(isDelivery);
        expect(await dataFields.get(3).getText()).toBe(companyCode);
        expect(await dataFields.get(4).getText()).toBe(controllingArea);
        expect(await dataFields.get(5).getText()).toBe(costCenter);
    },

    async isRecordPresent(costCenter) {
        const index = await actions.getIndex(costCenter);
        if (index === -1) {
            return false;
        }
        return true;
    },
};

module.exports = {
    elements,
    listReport,
    actions,
    filterElements,
    assertions,
};
