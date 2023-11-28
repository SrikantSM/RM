const parentElements = {
    contentSection: element(by.control({
        controlType: 'sap.uxap.ObjectPageSubSection',
        id: 'myResourcesUi::MyResourceObjectPage--fe::FacetSubSection::PreviousRoles',
        interaction: 'focus',
    })),

    addRolesDialog: element(
        by.control({
            controlType: 'sap.m.Dialog',
            properties: { title: 'Roles' },
        }),
    ),

    rolePopover: {
        rolecodeLabel: element(by.control({
            controlType: 'sap.m.Label',
            properties: {
                text: 'Code',
            },
        })),
        rolecodeValue: (code) => element(by.control({
            controlType: 'sap.m.Text',
            properties: {
                text: code,
            },
        })),
        descriptionLabel: element(by.control({
            controlType: 'sap.m.Label',
            properties: {
                text: 'Description',
            },
        })),
        descriptionValue: (description) => element(by.control({
            controlType: 'sap.m.Text',
            properties: {
                text: description,
            },
        })),
    },
};

const priorExperience = {
    elements: {
        table: element(by.id('myResourcesUi::MyResourceObjectPage--fe::table::roles::LineItem-innerTable')),

        tableTitle: element(by.id('myResourcesUi::MyResourceObjectPage--fe::table::roles::LineItem-title')),

        roleValueHelpShowFiltersBtn: element(by.id('myResourcesUi::MyResourceObjectPage--fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Dialog::qualifier::::FilterBar-btnShowFilters')),

        skillIDValueHelpShowFiltersBtn: element(by.id('myResourcesUi::ExternalWorkExperienceObjectPage--fe::table::externalWorkExperienceSkills::LineItem::TableValueHelp::externalWorkExperience::externalWorkExperienceSkills::skill_ID::Dialog::qualifier::::FilterBar-btnShowFilters')),

        valueHelpOkButton: element(
            by.id('myResourcesUi::MyResourceObjectPage--fe::table::roles::LineItem::TableValueHelp::roles::role_ID-ok'),
        ),

        valueHelpCancelButton: element(
            by.control({
                controlType: 'sap.m.Button',
                properties: {
                    text: 'Cancel',
                },
            }),
        ),

        buttonInAnchorBar: element(
            by.id('myResourcesUi::MyResourceObjectPage--fe::ObjectPage-anchBar-myResourcesUi::MyResourceObjectPage--fe::FacetSection::PriorExperience-anchor'),
        ),

        addRolesTable: parentElements.addRolesDialog.element(
            by.id('myResourcesUi::MyResourceObjectPage--fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Table-innerTable'),
        ),

        valueHelpShowFiltersBtn: element(
            by.id('myResourcesUi::MyResourceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::FilterBar-btnShowFilters'),
        ),
        valueHelpSearchInput: element(by.control({
            id: 'myResourcesUi::MyResourceObjectPage--fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Dialog::qualifier::-search-inner',
            searchOpenDialogs: true,
        })),

        valueHelpSearchPress: element(by.control({
            id: 'myResourcesUi::MyResourceObjectPage--fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Dialog::qualifier::::FilterBar-btnSearch',
            searchOpenDialogs: true,
        })),

        valueHelpSearchInput_skills: element(by.control({
            id: 'myResourcesUi::MyResourceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::-search-inner',
            searchOpenDialogs: true,
        })),

        valueHelpSearchPress_skills: element(by.control({
            id: 'myResourcesUi::MyResourceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::::FilterBar-btnSearch',
            searchOpenDialogs: true,
        })),

        valueHelpSearchInput_ext_skills: element(by.control({
            id: 'myResourcesUi::ExternalWorkExperienceObjectPage--fe::table::externalWorkExperienceSkills::LineItem::TableValueHelp::externalWorkExperience::externalWorkExperienceSkills::skill_ID::Dialog::qualifier::-search-inner',
            interaction: 'focus',
        })),

        valueHelpSearchPress_ext_skills: element(by.control({
            id: 'myResourcesUi::ExternalWorkExperienceObjectPage--fe::table::externalWorkExperienceSkills::LineItem::TableValueHelp::externalWorkExperience::externalWorkExperienceSkills::skill_ID::Dialog::qualifier::::FilterBar-btnSearch',
            searchOpenDialogs: true,
        })),

        splitButton: element(by.id('myResourcesUi::MyResourceObjectPage--fe::ObjectPage-anchBar-myResourcesUi::MyResourceObjectPage--fe::FacetSection::PriorExperience-anchor-internalSplitBtn')),

        roleButton: element(by.id('myResourcesUi::MyResourceObjectPage--fe::ObjectPage-anchBar-myResourcesUi::MyResourceObjectPage--fe::FacetSubSection::PreviousRoles-anchor-unifiedmenu')),
    },
};

const assertions = {
    checkRoleName(expectedRoleName) {
        const roleRecord = parentElements.contentSection.element(by.control({
            controlType: 'sap.m.Link',
            properties: {
                text: expectedRoleName,
            },
        }));

        expect(roleRecord.isPresent()).toBeTruthy();
    },

    checkTableTitle(expectedTableTitle) {
        const tableTitle = priorExperience.elements.tableTitle.getText();
        expect(tableTitle).toBe(expectedTableTitle);
    },
};

const actions = {
    navigateToPriorExperienceRoles() {
        priorExperience.elements.splitButton.element(by.control({
            controlType: 'sap.ui.core.Icon',
            properties: { src: 'sap-icon://slim-arrow-down' },
        })).click();

        priorExperience.elements.roleButton.click();
    },

    async searchValueInValueHelp(tableName, valueToBeSearched) {
        let tableId;

        if (tableName === 'roles') tableId = 'role_ID';
        else tableId = 'skill_ID';

        const objectTableID = `myResourcesUi::MyResourceObjectPage--fe::table::${tableName}::LineItem`;
        const subObjectTableID = `myResourcesUi::MyResourceObjectPage--fe::table::${tableName}::LineItem::TableValueHelp::${tableName}::${tableId}::Table-innerTable`;
        const objectTable = element(by.id(objectTableID));
        const objectTableRows = objectTable.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));

        const noOfRowsObjectTable = await objectTableRows.count();
        let elementToBeClicked;
        for (let i = 0; i < noOfRowsObjectTable; i++) {
            const row = objectTableRows.get(i).element(by.control({
                controlType: 'sap.ui.mdc.Field',
            }));
            const value = await row.asControl().getProperty('value');
            if (valueToBeSearched === await value) {
                elementToBeClicked = i;
                break;
            }
        }

        await objectTableRows.get(elementToBeClicked).element(by.control({
            controlType: 'sap.ui.core.Icon',
            properties: {
                src: 'sap-icon://value-help',
            },
        })).click();

        if (tableName === 'roles') await priorExperience.elements.roleValueHelpShowFiltersBtn.click();
        else await priorExperience.elements.valueHelpShowFiltersBtn.click();

        await priorExperience.elements.valueHelpSearchInput.sendKeys(valueToBeSearched);
        await priorExperience.elements.valueHelpSearchPress.click();

        const subObjectTable = element(by.id(subObjectTableID));
        const subObjectTableRows = subObjectTable.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRowsSubObjectTable = await subObjectTableRows.count();

        return noOfRowsSubObjectTable;
    },

    getRoleName(roleName) {
        const name = priorExperience.elements.table.element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: roleName,
                },
            }),
        );
        return name;
    },

    async checkRoleValueHelpTableData(roleName) {
        const table = element(by.id('myResourcesUi::MyResourceObjectPage--fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Dialog::qualifier::::Table-innerTable'));
        const tableRows = table.all(by.control({
            controlType: 'sap.ui.table.Row',
        }));

        const noOfRows = await tableRows.count();
        let i = 0;
        for (; i < noOfRows; i++) {
            const row = tableRows.get(i).all(by.control({
                controlType: 'sap.m.Text',
            }));
            const valueToCheck = await row.get(0).getText();
            if (roleName === valueToCheck) {
                break;
            }
        }

        const rowToBeChecked = await tableRows.get(i);
        const dataFields = rowToBeChecked.all(by.control({
            controlType: 'sap.m.Text',
        }));
        expect(await dataFields.get(0).getText()).toBe(roleName);
    },

    navigateToPriorExperience() {
        priorExperience.elements.buttonInAnchorBar.click();
    },

    async clickOnARole(roleName) {
        const role = await priorExperience.elements.table.element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: roleName,
                },
            }),
        );
        await role.click();
    },
};

module.exports = {
    actions,
    assertions,
    parentElements,
    priorExperience,
};
