const CommonPageElements = require('./CommonPageElements.js');

const listReport = {
    elements: {
        titleString: 'Project Roles',
        tableRows: CommonPageElements.listReport.elements.tableRows,
        header: CommonPageElements.listReport.elements.header,
    },
};

const elements = {
    listReportTable: element(by.control({
        controlType: 'sap.m.Table',
        id: 'projectRoleUi::ProjectRoleListReport--fe::table::Roles::LineItem-innerTable',
        interaction: 'focus',
    })),
    listReportTableRows: element(by.control({
        controlType: 'sap.ui.mdc.Table',
        id: 'projectRoleUi::ProjectRoleListReport--fe::table::Roles::LineItem',
    })).all(by.control({ controlType: 'sap.m.ColumnListItem' })),
    deleteConfirmButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'Delete' },
        ancestor: { controlType: 'sap.m.Dialog' },
    })),
    filterBar: element(by.control({
        controlType: 'sap.ui.mdc.FilterBar',
    })),
};

const filterElemenents = {

    searchInput: element(by.control({
        controlType: 'sap.m.SearchField',
        interaction: 'focus',
    })),

    searchPress: element(by.control({
        controlType: 'sap.m.SearchField',
        interaction: 'press',
    })),

    codeVHSearchInput: element(by.control({
        controlType: 'sap.m.SearchField',
        id: 'projectRoleUi::ProjectRoleListReport--fe::FilterBar::Roles::FilterFieldValueHelp::code::Dialog::qualifier::-search-inner',
        interaction: 'focus',
    })),

    codeVHSearchPress: element(by.control({
        controlType: 'sap.m.SearchField',
        id: 'projectRoleUi::ProjectRoleListReport--fe::FilterBar::Roles::FilterFieldValueHelp::code::Dialog::qualifier::-search-inner',
        interaction: 'press',
    })),

    expandButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { icon: 'sap-icon://slim-arrow-down' },
    })),

    editStatus: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            id: 'projectRoleUi::ProjectRoleListReport--fe::FilterBar::Roles::FilterField::DraftEditingStatus',
        }),
    ),

    name: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Name',
            },
        }),
    ),

    roleCode: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Code',
            },
        }),
    ),

    roleCodeValueHelp: elements.filterBar.element(
        by.control({
            controlType: 'sap.ui.mdc.FilterField',
            properties: {
                label: 'Code',
            },
        }),
    ).element(by.control({
        controlType: 'sap.ui.core.Icon',
        properties: {
            src: 'sap-icon://value-help',
        },
    })),

    roleCodeValueHelpOkbutton: element(by.id('projectRoleUi::ProjectRoleListReport--fe::FilterBar::Roles::FilterFieldValueHelp::code-ok')),

    valueHelpOkbutton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'OK' },
    })),

    goButton: elements.filterBar.element(
        by.id('projectRoleUi::ProjectRoleListReport--fe::FilterBar::Roles-btnSearch'),
    ),
};

const actions = {

    async navigateToRole(code) {
        const rowToBeClicked = await this.getIndex(code, undefined);
        await elements.listReportTableRows.get(rowToBeClicked).click();
    },
    async navigateToRoleWithDescription(description) {
        const rowToBeClicked = this.getIndex(undefined, description);
        await elements.listReportTableRows.get(rowToBeClicked).click();
    },
    async isRecordPresent(code) {
        const index = await this.getIndex(code, undefined);
        if (index === -1) {
            return false;
        }
        return true;
    },
    async getIndex(code, description) {
        const tableRows = elements.listReportTableRows;
        const cnt = await tableRows.count();
        let index = -1;
        for (let i = 0; i < cnt; i++) {
            const row = tableRows.get(i).all(
                by.control({
                    controlType: 'sap.m.Text',
                }),
            );
            if (code === undefined) {
                const roleDescription = await row.get(1).getText();
                if (description === await roleDescription) {
                    index = i;
                    break;
                }
            } else {
                const roleCode = row.get(0).getText();
                if (code === await roleCode) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    },

    async clickOnCreateButton() {
        const createId = 'projectRoleUi::ProjectRoleListReport--fe::table::Roles::LineItem::StandardAction::Create';
        const createButton = element(by.id(createId));
        await createButton.click();
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
    async deleteMultipleRows() {
        const deleteId = 'projectRoleUi::ProjectRoleListReport--fe::table::Roles::LineItem::Delete';
        const selectAll = element(by.id('projectRoleUi::ProjectRoleListReport--fe::table::Roles::LineItem-innerTable-sa'));
        await selectAll.click();
        let deleteBtn = element(by.id(deleteId));
        await deleteBtn.click();

        const deleteButtonInDialog = element(by.control({
            controlType: 'sap.m.Dialog',
            properties: {
                icon: 'sap-icon://message-warning',
            },
        }));

        deleteBtn = deleteButtonInDialog.element(by.control({
            controlType: 'sap.m.Button',
            properties: {
                text: 'Delete',
            },
        }));

        await deleteBtn.click();
    },
    async getRecordState(description) {
        const { tableRows } = listReport.elements;
        const rowToBeClicked = this.getIndex(undefined, description);
        const state = await tableRows.get(rowToBeClicked).element(
            by.control({
                controlType: 'sap.m.ObjectMarker',
            }),
        ).getText();
        return state;
    },
    async isDraftRecord(description) {
        const { tableRows } = listReport.elements;
        const rowToBeClicked = this.getIndex(undefined, description);
        return (tableRows.get(rowToBeClicked).element(
            by.control({
                controlType: 'sap.m.ObjectMarker',
            }),
        )).isPresent();
    },
    async getRecordStateWithCode(code) {
        const { tableRows } = listReport.elements;
        const rowToBeClicked = await this.getIndex(code, undefined);
        const state = await tableRows.get(rowToBeClicked).element(
            by.control({
                controlType: 'sap.m.ObjectMarker',
            }),
        ).getText();
        return state;
    },
    async getRoleLifecycleStatus(code, roleLifecycleStatus) {
        const { tableRows } = listReport.elements;
        const rowToBeChecked = this.getIndex(code, undefined);
        const status = await tableRows.get(rowToBeChecked).element(
            by.control({
                controlType: 'sap.m.ObjectStatus',
                properties: {
                    text: roleLifecycleStatus,
                },
            }),
        ).isPresent();
        return status;
    },
    async getRoleName(name, code) {
        const { tableRows } = listReport.elements;
        const rowToBeChecked = await this.getIndex(code, undefined);
        const role = await tableRows.get(rowToBeChecked).element(
            by.control({
                controlType: 'sap.m.Text',
                id: /txt$/,
                properties: {
                    text: name,
                },
            }),
        ).isPresent();
        return role;
    },
    async getRoleDesc(desc, code) {
        const { tableRows } = listReport.elements;
        const rowToBeChecked = await this.getIndex(code, undefined);
        const roleDesc = await tableRows.get(rowToBeChecked).element(
            by.control({
                controlType: 'sap.m.ExpandableText',
                properties: {
                    text: desc,
                },
            }),
        ).isPresent();
        return roleDesc;
    },
    async setEditStatusFilter(value) {
        await filterElemenents.editStatus.click();
        await filterElemenents.editStatus.clear().sendKeys(value);
        await filterElemenents.editStatus.sendKeys(protractor.Key.ENTER);
    },
    async selectCodeFromValueHelp(code) {
        const valueHelpTableID = 'projectRoleUi::ProjectRoleListReport--fe::FilterBar::Roles::FilterFieldValueHelp::code::Dialog::qualifier::::Table-innerTable';
        const valueHelpTable = element(by.id(valueHelpTableID));
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
            if (code === await value) {
                break;
            }
        }
        await valueHelpTableRows.get(i).element(by.control({
            controlType: 'sap.m.Text',
        })).click();
    },

    iExecuteShowDetails: element(by.control({
        controlType: 'sap.m.Button',
        properties: [{ icon: 'sap-icon://detail-more' }],
        ancestor: { id: /showHideDetails$/ },
    })),
};

module.exports = {
    elements,
    listReport,
    actions,
    filterElemenents,
};
