const CommonPageElements = require('./CommonPageElements');

const priorExperience = {
    elements: {
        tableTitle: element(by.id('myResourcesUi::MyResourceObjectPage--fe::table::internalWorkExperience::LineItem-title')),

        table: element(by.id('myResourcesUi::MyResourceObjectPage--fe::table::internalWorkExperience::LineItem-innerTable')),

        splitButton: element(by.id('myResourcesUi::MyResourceObjectPage--fe::ObjectPage-anchBar-myResourcesUi::MyResourceObjectPage--fe::FacetSection::PriorExperience-anchor-internalSplitBtn')),

        internalWorkExperienceButton: element(by.id('myResourcesUi::MyResourceObjectPage--fe::ObjectPage-anchBar-myResourcesUi::MyResourceObjectPage--fe::FacetSubSection::InternalWorkExperience-anchor-unifiedmenu')),

        generalInformationAnchor: element(by.id('myResourcesUi::InternalWorkExperienceObjectPage--fe::ObjectPage-anchBar-myResourcesUi::InternalWorkExperienceObjectPage--fe::FacetSection::GeneralInformation-anchor')),

        generalInformationFacet: element(by.id('myResourcesUi::InternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation')),

        skillsAnchor: element(by.id('myResourcesUi::InternalWorkExperienceObjectPage--fe::ObjectPage-anchBar-myResourcesUi::InternalWorkExperienceObjectPage--fe::FacetSection::InternalWorkExperienceSkills-anchor')),

        skillTableTitle: element(by.id('myResourcesUi::InternalWorkExperienceObjectPage--fe::table::internalWorkExperienceSkills::LineItem-title')),

        skillTable: element(by.id('myResourcesUi::InternalWorkExperienceObjectPage--fe::table::internalWorkExperienceSkills::LineItem-innerTable')),

        internalWEShowdetails: element(by.id('myResourcesUi::MyResourceObjectPage--fe::table::internalWorkExperience::LineItem-showDetails-button')),
        internalWEHidedetails: element(by.id('myResourcesUi::MyResourceObjectPage--fe::table::internalWorkExperience::LineItem-hideDetails-button')),

    },

    skillPopover: {
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

const parentElements = {
    assignmentsTableTitle: (tableName) => element(by.id(`myResourcesUi::MyResourceObjectPage--fe::table::${tableName}::LineItem-title`)),
    buttonInAnchorBar: (tableName, sectionName) => element(
        by.id(`myResourcesUi::${tableName}ObjectPage--fe::ObjectPage-anchBar-myResourcesUi::${tableName}ObjectPage--fe::FacetSection::${sectionName}-anchor`),

    ),
    titleIntExp: (requestName) => element(by.control({
        controlType: 'sap.m.Title',
        properties: {
            text: requestName,
        },
    })),

    title: (projectName) => element(by.control({
        controlType: 'sap.m.Title',
        properties: {
            text: projectName,
        },
    })),

    skillsTableTitle: (tableName, sectionName) => element(by.id(`myResourcesUi::${tableName}ObjectPage--fe::table::${sectionName}::LineItem-title`)),

    skillsTable: (tableName, sectionName) => element(
        by.id(`myResourcesUi::${tableName}ObjectPage--fe::table::${sectionName}::LineItem-innerTable`),
    ),

    skillPopover: {
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

    settingsButton: (tableName) => element(by.id(`myResourcesUi::MyResourceObjectPage--fe::table::${tableName}::LineItem-settings`)),

    workItemOption: element(by.control({
        controlType: 'sap.m.CheckBox',
        id: /innerSelectionPanelTable-9/,
    })),

    settingsOkButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: {
            text: 'OK',
        },
    })),
};
const actions = {

    async navigateToInternalWorkExperienceList() {
        const splitButtonID = 'myResourcesUi::MyResourceObjectPage--fe::ObjectPage-anchBar-myResourcesUi::MyResourceObjectPage--fe::FacetSection::PriorExperience-anchor-internalSplitBtn';
        const splitButton = element(by.id(splitButtonID));

        const dropDownToProjects = splitButton.element(by.control({
            controlType: 'sap.ui.core.Icon',
            properties: { src: 'sap-icon://slim-arrow-down' },
        }));

        browser.wait(() => dropDownToProjects.isPresent(), 105000);
        await dropDownToProjects.click();

        const menu = element(by.control({
            controlType: 'sap.ui.unified.Menu',
        }));

        const menuItems = menu.all(by.control({
            controlType: 'sap.ui.unified.MenuItem',
        }));

        const noOfRows = await menuItems.count();

        for (let i = 0; i < noOfRows; i++) {
            if (await menuItems.get(i).getText() === 'Internal Work Experience') {
                await menuItems.get(i).click();
                break;
            }
        }
    },

    async navigateToProjectName(table, projectName) {
        let tableID;
        if (table === 'InternalWorkExperience') tableID = 'myResourcesUi::MyResourceObjectPage--fe::table::internalWorkExperience::LineItem-innerTable';
        else tableID = 'myResourcesUi::MyResourceObjectPage--fe::table::externalWorkExperience::LineItem-innerTable';

        const rowList = await element(by.control({
            controlType: 'sap.m.ColumnListItem',
            ancestor: {
                id: tableID,
            },
            descendant: {
                controlType: 'sap.m.Text',
                properties: { text: projectName },
            },
        }));

        const arrowKey = await rowList.element(by.control({
            controlType: 'sap.ui.core.Icon',
            properties: { src: 'sap-icon://slim-arrow-right' },
        }));

        await arrowKey.click();
    },

    getIntWorkExpSkillName(tableName, sectionName, skillName) {
        const name = parentElements.skillsTable(tableName, sectionName).element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: skillName,
                },
            }),
        );
        return name;
    },

    getIntWorkExpProficiencyLevel(tableName, sectionName, proficiencyLevelName) {
        const name = parentElements.skillsTable(tableName, sectionName).element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: proficiencyLevelName,
                },
            }),
        );
        return name;
    },

    async navigateToRequestName(requestName) {
        const tableID = 'myResourcesUi::MyResourceObjectPage--fe::table::internalWorkExperience::LineItem-innerTable';

        const rowList = await element(by.control({
            controlType: 'sap.m.ColumnListItem',
            ancestor: {
                id: tableID,
            },
            descendant: {
                controlType: 'sap.m.Text',
                properties: { text: requestName },
            },
        }));

        const arrowKey = await rowList.element(by.control({
            controlType: 'sap.ui.core.Icon',
            properties: { src: 'sap-icon://slim-arrow-right' },
        }));

        await arrowKey.click();
    },

    async navigateToInternalWorkExperience(projectName) {
        const tableID = 'myResourcesUi::MyResourceObjectPage--fe::table::internalWorkExperience::LineItem-innerTable';
        const rowList = await element(by.control({
            controlType: 'sap.m.ColumnListItem',
            ancestor: {
                id: tableID,
            },
            descendant: {
                controlType: 'sap.m.Text',
                properties: { text: projectName },
            },
        }));

        const arrowKey = await rowList.element(by.control({
            controlType: 'sap.ui.core.Icon',
            properties: { src: 'sap-icon://slim-arrow-right' },
        }));

        await arrowKey.click();
    },

    async navigateToProjectHistory(entity) {
        const splitButtonID = 'myResourcesUi::MyResourceObjectPage--fe::ObjectPage-anchBar-myResourcesUi::MyResourceObjectPage--fe::FacetSection::PriorExperience-anchor-internalSplitBtn';
        const splitButton = element(by.id(splitButtonID));

        const dropDownToProjects = splitButton.element(by.control({
            controlType: 'sap.ui.core.Icon',
            properties: { src: 'sap-icon://slim-arrow-down' },
        }));

        browser.wait(() => dropDownToProjects.isPresent(), 105000);
        await dropDownToProjects.click();

        const menu = element(by.control({
            controlType: 'sap.ui.unified.Menu',
        }));

        const menuItems = menu.all(by.control({
            controlType: 'sap.ui.unified.MenuItem',
        }));

        const noOfRows = await menuItems.count();

        for (let i = 0; i < noOfRows; i++) {
            if (await menuItems.get(i).getText() === entity) {
                await menuItems.get(i).click();
                break;
            }
        }
    },

    async navigateToGeneralInformation() {
        await priorExperience.elements.generalInformationAnchor.click();
    },

    async navigateToSkills() {
        priorExperience.elements.skillsAnchor.click();
    },

    async clickOnASkill(skillName) {
        const skill = priorExperience.elements.skillTable.element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: skillName,
                },
            }),
        );
        await skill.click();
    },

    goBack() {
        CommonPageElements.objectPage.elements.backButton.click();
    },
};

const assertions = {
    async checkTableTitle(expectedTableTitle) {
        const tableTitle = priorExperience.elements.tableTitle.getText();
        expect(tableTitle).toBe(expectedTableTitle);
    },

    async checkSkillTableTitle(expectedTableTitle) {
        const tableTitle = priorExperience.elements.skillTableTitle.getText();
        expect(tableTitle).toBe(expectedTableTitle);
    },

    async checkTableData(rowNum, project, role, resourceOrg, customer, startDate, endDate) {
        const tableRows = priorExperience.elements.table.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));

        const dataFields = tableRows.get(rowNum).all(by.control({
            controlType: 'sap.m.Text',
        }));

        expect(dataFields.get(0).getText()).toBe(project);
        expect(dataFields.get(1).getText()).toBe(role);
        expect(dataFields.get(2).getText()).toBe(resourceOrg);
        expect(dataFields.get(3).getText()).toBe(customer);
        expect(dataFields.get(4).getText()).toBe(startDate);
        expect(dataFields.get(5).getText()).toBe(endDate);
    },

    async checkIntWorkExpFieldValue(fieldName, fieldValue) {
        const field = await element(by.control({ id: `myResourcesUi::InternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::${fieldName}::Field-content` }));
        expect(await field.getText()).toBe(fieldValue);
    },

    async checkObjectPageData(customer, role, resourceOrg, startDate, endDate) {
        const generalInformation = priorExperience.elements.generalInformationFacet.all(by.control({
            controlType: 'sap.m.Text',
        }));

        expect(generalInformation.get(0).getText()).toBe(customer);
        expect(generalInformation.get(1).getText()).toBe(role);
        expect(generalInformation.get(2).getText()).toBe(resourceOrg);
        expect(generalInformation.get(3).getText()).toBe('40.00 hr');
        expect(generalInformation.get(4).getText()).toBe(startDate);
        expect(generalInformation.get(5).getText()).toBe(endDate);
    },

    async checkInternalExperienceTableData(rowNum, requestName, displayId, role, resourceOrg, customer, startDate, endDate, assignmentStatus) {
        const tableRows = priorExperience.elements.table.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));

        const dataFields = tableRows.get(rowNum).all(by.control({
            controlType: 'sap.m.Text',
        }));

        expect(dataFields.get(0).getText()).toBe(requestName);
        expect(dataFields.get(1).getText()).toBe(displayId);
        expect(dataFields.get(2).getText()).toBe(role);
        expect(dataFields.get(3).getText()).toBe(resourceOrg);
        expect(dataFields.get(4).getText()).toBe(customer);
        // Issue: https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/854
        // expect(dataFields.get(5).getText()).toBe(startDate);
        // expect(dataFields.get(6).getText()).toBe(endDate);
        // expect(dataFields.get(7).getText()).toBe(assignmentStatus);
    },

    async checkInternalExperiencePageData(displayId, customer, role, resourceOrg, startDate, endDate, assignmentStatus) {
        const generalInformation = priorExperience.elements.generalInformationFacet.all(by.control({
            controlType: 'sap.m.Text',
        }));

        expect(generalInformation.get(0).getText()).toBe(displayId);
        expect(generalInformation.get(1).getText()).toBe(customer);
        expect(generalInformation.get(2).getText()).toBe(role);
        expect(generalInformation.get(3).getText()).toBe(resourceOrg);
        expect(generalInformation.get(4).getText()).toBe(startDate);
        expect(generalInformation.get(5).getText()).toBe(endDate);
        expect(generalInformation.get(6).getText()).toBe('40.00 hr');
        expect(generalInformation.get(7).getText()).toBe(assignmentStatus);
    },

    async checkSkillName(expectedSkillName) {
        const skillRecord = priorExperience.elements.skillTable.element(by.control({
            controlType: 'sap.m.Link',
            properties: {
                text: expectedSkillName,
            },
        }));

        expect(skillRecord.isPresent()).toBeTruthy();
    },

    async checkProficiencyLevelName(expectedProficiencyLevelName) {
        const proficiencyLevelRecord = priorExperience.elements.skillTable.element(by.control({
            controlType: 'sap.m.Text',
            properties: {
                text: expectedProficiencyLevelName,
            },
        }));

        expect(proficiencyLevelRecord.isPresent()).toBeTruthy();
    },
};

module.exports = {
    actions,
    assertions,
    priorExperience,
    parentElements,
};
