const CommonPageElements = require('./CommonPageElements.js');
const MyResourcesCommonAssertion = require('./MyResourcesCommonAssertion.js');

const listReport = {
    elements: {
        titleString: 'RESOURCES',
        tableRows: CommonPageElements.listReport.elements.tableRows,
        header: CommonPageElements.listReport.elements.header,
    },
};

const elements = {
    tableTitle: element(by.id('myResourcesUi::MyResourceListReport--fe::table::ProjectExperienceHeader::LineItem-title')),
    costCenterValueHelpTable: element(by.id('myResourcesUi::MyResourceListReport--fe::FilterBar::ProjectExperienceHeader::FilterFieldValueHelp::profile::costCenter::Table-innerTable')),

    values: element(
        by.id(
            'myResourcesUi::MyResourceListReport--fe::table::ProjectExperienceHeader::LineItem-innerTable',
        ),
    ),

    popover: element(
        by.control({
            controlType: 'sap.m.Popover',
        }),
    ),

    listColumnprofilePhoto: element(
        by.control({
            controlType: 'sap.m.Avatar',
            properties: {
                initials: 'EE',
            },
        }),
    ),

    contactCardProfilePhoto: element(
        by.control({
            controlType: 'sap.m.Avatar',
            properties: {
                initials: 'EE',
            },
        }),
    ),

    resourceNameLink: element(
        by.control({
            controlType: 'sap.m.Link',
        }),
    ),

    contactCardTitle: element(
        by.control({
            controlType: 'sap.m.Title',
            properties: {
                text: 'Resource',
            },
        }),
    ),

    contactCardContactDetails: element(
        by.control({
            controlType: 'sap.ui.core.Title',
            properties: {
                text: 'Contact Information',
            },
        }),
    ),

    contactCardOrganizationDetails: element(
        by.control({
            controlType: 'sap.ui.core.Title',
            properties: {
                text: 'Organizational Information',
            },
        }),
    ),

    contactCardWorkerTypeLabel: element(
        by.control({
            controlType: 'sap.m.Label',
            properties: {
                text: 'Worker Type',
            },
        }),
    ),

    contactCardFirstNameLabel: element(
        by.control({
            controlType: 'sap.m.Label',
            properties: {
                text: 'First Name',
            },
        }),
    ),

    contactCardLastNameLabel: element(
        by.control({
            controlType: 'sap.m.Label',
            properties: {
                text: 'Last Name',
            },
        }),
    ),

    contactCardEmailLabel: element(
        by.control({
            controlType: 'sap.m.Label',
            properties: {
                text: 'Email',
            },
        }),
    ),

    contactCardMobileLabel: element(
        by.control({
            controlType: 'sap.m.Label',
            properties: {
                text: 'Mobile',
            },
        }),
    ),

    contactCardAddressLabel: element(
        by.control({
            controlType: 'sap.m.Label',
            properties: {
                text: 'Office Location',
            },
        }),
    ),

    contactCardResourceOrganizationLabel: element(
        by.control({
            controlType: 'sap.m.Label',
            properties: {
                text: 'Resource Organization',
            },
        }),
    ),

    contactCardCostCenterLabel: element(
        by.control({
            controlType: 'sap.m.Label',
            properties: {
                text: 'Cost Center',
            },
        }),
    ),

    contactCardManagerLabel: element(
        by.control({
            controlType: 'sap.m.Label',
            properties: {
                text: 'Manager',
            },
        }),
    ),

    listReportTable: element(by.control({
        controlType: 'sap.m.Table',
        id: 'myResourcesUi::MyResourceListReport--fe::table::ProjectExperienceHeader::LineItem-innerTable',
        interaction: 'focus',
    })),

    listReportTableRows: element(by.control({
        controlType: 'sap.ui.mdc.Table',
        id: 'myResourcesUi::MyResourceListReport--fe::table::ProjectExperienceHeader::LineItem',
    })).all(by.control({ controlType: 'sap.m.ColumnListItem' })),

    filterBar: element(by.control({
        controlType: 'sap.ui.mdc.FilterBar',
    })),

};

const filterElements = {

    expandButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { icon: 'sap-icon://slim-arrow-down' },
    })),

    name: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Name',
            },
        }),
    ),

    projectRole: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Project Roles',
            },
        }),
    ),

    workerType: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Worker Type',
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

    officeLocation: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Office Location',
            },
        }),
    ),
    skill_ID: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Skills',
            },
        }),
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
    costCenterValueHelpOkbutton: element(
        by.id('myResourcesUi::MyResourceListReport--fe::FilterBar::ProjectExperienceHeader::FilterFieldValueHelp::profile::costCenterDesc-ok'),
    ),

    goButton: elements.filterBar.element(
        by.id('myResourcesUi::MyResourceListReport--fe::FilterBar::ProjectExperienceHeader-btnSearch'),
    ),

    searchPlaceholder: element(by.control({
        controlType: 'sap.ui.mdc.FilterField',
        properties: {
            placeholder: 'Search',
        },
    })),
};

const actions = {

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

    async navigateToObjectPage(costCenter) {
        MyResourcesCommonAssertion.elements.iExecuteShowDetails.click();
        const rowToBeClicked = await this.getIndex(costCenter);
        MyResourcesCommonAssertion.elements.iExecuteHideDetails.click();
        await elements.listReportTableRows.get(rowToBeClicked).all(
            by.control({
                controlType: 'sap.m.Text',
            }),
        ).click();
    },

    async clickOnAName(Name) {
        const name = await elements.values.element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: Name,
                },
            }),
        );
        await name.click();
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
            const costCenterValue = row.get(2).getText();
            if (costCenter === await costCenterValue) {
                index = i;
                break;
            }
        }
        return index;
    },

    getcontactCardNameValue(Name) {
        const name = element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: Name,
                },
            }),
        );
        return name;
    },

    getcontactCardRoleValue(Role) {
        const role = element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: Role,
                },
            }),
        );
        return role;
    },

    getcontactCardWorkerTypeValue(workerType) {
        const workerTypeElement = element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: workerType,
                },
            }),
        );
        return workerTypeElement;
    },

    getcontactCardEmailValue(Email) {
        const email = element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: Email,
                },
            }),
        );
        return email;
    },

    getcontactCardMobileNoValue(mobNo) {
        const mobileNo = element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: mobNo,
                },
            }),
        );
        return mobileNo;
    },

    getcontactCardAddressValue(address) {
        const addressValue = element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: address,
                },
            }),
        );
        return addressValue;
    },

    getcontactCardResourceOrgValue(Org) {
        const orgValue = element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: Org,
                },
            }),
        );
        return orgValue;
    },

    getcontactCardCostCenterValue(CostCenter) {
        const costCenterValue = element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: CostCenter,
                },
            }),
        );
        return costCenterValue;
    },

    getcontactCardManagerFullNameValue(name) {
        const fullName = element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: name,
                },
            }),
        );
        return fullName;
    },

    getColumnHeader() {
        const columnHeaders = elements.listReportTable.all(
            by.control({
                controlType: 'sap.m.Column',
            }),
        );
        return columnHeaders;
    },

    async getValueHelpData(table, value) {
        let valueHelpTable;
        let valueHelpTableRows;
        if (table === 'costCenter') {
            valueHelpTable = elements.costCenterValueHelpTable;
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

    async selectFromValueHelp(iValue) {
        const valueHelpTable = elements.costCenterValueHelpTable;
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
