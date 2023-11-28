const CommonPageElements = require('./CommonPageElements.js');

const parentElements = {

    contentSection: element(
        by.control({
            controlType: 'sap.uxap.ObjectPageSection',
            interaction: 'focus',
            properties: {
                title: 'Prior Experience',
            },
        }),
    ),

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

        tableTitle: element(by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem-title')),

        values: element(
            by.id(
                'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem-innerTable',
            ),
        ),

        moreButton: element(by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem-innerTable-trigger')),

        buttonInAnchorBar: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::ObjectPage-anchBar-myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FacetSection::PriorExperience-anchor'),
        ),

        rolesTableToolbar: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem-toolbar'),
        ),

        draftModeOverflowToolbars: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::op::footer::MyProjectExperienceHeader'),
        ),

        table: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem-innerTable'),
        ),

        addRolesTable: parentElements.addRolesDialog.element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Dialog::qualifier::::Table-innerTable'),
        ),

        valueHelpOkButton: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem::TableValueHelp::roles::role_ID-ok'),
        ),

        valueHelpCancelButton: element(
            by.control({
                controlType: 'sap.m.Button',
                properties: {
                    text: 'Cancel',
                },
            }),
        ),

        valueHelpShowFiltersBtn: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::::FilterBar-btnShowFilters'),
        ),

        roleValueHelpShowFiltersBtn: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Dialog::qualifier::::FilterBar-btnShowFilters'),
        ),

        valueHelpSearchInput_roles: element(by.control({
            id: 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Dialog::qualifier::-search-inner',
            searchOpenDialogs: true,
            interaction: 'focus',
        })),

        valueHelpSearchPress_roles: element(by.control({
            controlType: 'sap.m.Button',
            id: 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Dialog::qualifier::::FilterBar-btnSearch',
        })),

        valueHelpSearchInput_skills: element(by.control({
            id: 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::-search-inner',
            searchOpenDialogs: true,
            interaction: 'focus',
        })),

        valueHelpSearchPress_skills: element(by.control({
            id: 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::::FilterBar-btnSearch',
            searchOpenDialogs: true,
        })),

        valueHelpSearchInput_ext_skills: element(by.control({
            id: 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::table::externalWorkExperienceSkills::LineItem::TableValueHelp::externalWorkExperience::externalWorkExperienceSkills::skill_ID::Dialog::qualifier::-search-inner',
            interaction: 'focus',
        })),

        valueHelpSearchPress_ext_skills: element(by.control({
            id: 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::table::externalWorkExperienceSkills::LineItem::TableValueHelp::externalWorkExperience::externalWorkExperienceSkills::skill_ID::Dialog::qualifier::::FilterBar-btnSearch',
        })),

        valueHelpShowFiltersBtn_ext_skills: element(
            by.id('myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::table::externalWorkExperienceSkills::LineItem::TableValueHelp::externalWorkExperience::externalWorkExperienceSkills::skill_ID::Dialog::qualifier::::FilterBar-btnShowFilters'),
        ),

        dropDown: element(by.control({
            controlType: 'sap.ui.mdc.field.FieldInput',
            interaction: 'focus',
        })),

        internalWEShowdetails: element(by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::internalWorkExperience::LineItem-showDetails-button')),
        internalWEHidedetails: element(by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::internalWorkExperience::LineItem-hideDetails-button')),

    },
};

const actions = {

    navigateToPriorExperience() {
        priorExperience.elements.buttonInAnchorBar.click();
    },

    getPriorExperienceValues() {
        const listOfRoles = priorExperience.elements.values.all(
            by.control({
                controlType: 'sap.m.ColumnListItem',
            }),
        );
        return listOfRoles;
    },

    getColumnHeader() {
        const columnHeaders = priorExperience.elements.values.all(by.control({
            controlType: 'sap.m.Column',
        }));

        return columnHeaders;
    },

    async getSearchField(name) {
        const dialogBox = await CommonPageElements.objectPage.elements.messageDialog.dialog;
        const searchField = await dialogBox.element(by.control({
            controlType: 'sap.ui.mdc.FilterField',
        }));
        await searchField.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
        await searchField.sendKeys(protractor.Key.BACK_SPACE);
        await searchField.sendKeys(name);
        await searchField.sendKeys(protractor.Key.ENTER);
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

    getRoleNameInEditMode(roleName) {
        const name = priorExperience.elements.table.element(
            by.control({
                controlType: 'sap.ui.mdc.Field',
                properties: {
                    additionalValue: roleName,
                },
            }),
        );
        return name;
    },

    async searchValueInValueHelp(tableName, valueToBeSearched) {
        let tableId;

        if (tableName === 'roles') tableId = 'role_ID';
        else tableId = 'skill_ID';

        const objectTableID = `myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem`;
        const subObjectTableID = `myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem::TableValueHelp::${tableName}::${tableId}::Dialog::qualifier::::Table-innerTable`;
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

        await priorExperience.elements.valueHelpSearchInput_roles.sendKeys(valueToBeSearched);
        await priorExperience.elements.valueHelpSearchPress_roles.click();

        const subObjectTable = element(by.id(subObjectTableID));
        const subObjectTableRows = subObjectTable.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRowsSubObjectTable = await subObjectTableRows.count();
        return noOfRowsSubObjectTable;
    },

    async checkRoleValueHelpTableData(roleName) {
        const table = element(by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Dialog::qualifier::::Table-innerTable'));
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

    async enterValueInTable(tableName, value, rownum) {
        const tableId = `myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem`;
        const table = element(by.id(tableId));
        const tableRows = table.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));

        const row = await tableRows.get(rownum).element(by.control({
            controlType: 'sap.ui.mdc.Field',
        }));

        row.sendKeys(value);
    },
};

module.exports = {
    actions,
    priorExperience,
    parentElements,
};
