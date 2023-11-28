const CommonPageElements = require('./CommonPageElements');

const priorExperience = {
    elements: {
        tableTitle: element(by.id('myResourcesUi::MyResourceObjectPage--fe::table::externalWorkExperience::LineItem-title')),

        table: element(by.id('myResourcesUi::MyResourceObjectPage--fe::table::externalWorkExperience::LineItem-innerTable')),

        splitButton: element(by.id('myResourcesUi::MyResourceObjectPage--fe::ObjectPage-anchBar-myResourcesUi::MyResourceObjectPage--fe::FacetSection::PriorExperience-anchor-internalSplitBtn')),

        externalWorkExperienceButton: element(by.id('myResourcesUi::MyResourceObjectPage--fe::ObjectPage-anchBar-myResourcesUi::MyResourceObjectPage--fe::FacetSubSection::ExternalWorkExperience-anchor-unifiedmenu')),

        generalInformationAnchor: element(by.id('myResourcesUi::ExternalWorkExperienceObjectPage--fe::ObjectPage-anchBar-myResourcesUi::ExternalWorkExperienceObjectPage--fe::FacetSection::GeneralInformation-anchor')),

        generalInformationFacet: element(by.id('myResourcesUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation')),

        skillsAnchor: element(by.id('myResourcesUi::ExternalWorkExperienceObjectPage--fe::ObjectPage-anchBar-myResourcesUi::ExternalWorkExperienceObjectPage--fe::FacetSection::ExternalWorkExperienceSkills-anchor')),

        skillTable: element(by.id('myResourcesUi::ExternalWorkExperienceObjectPage--fe::table::externalWorkExperienceSkills::LineItem-innerTable')),

        skillTableTitle: element(
            by.id('myResourcesUi::ExternalWorkExperienceObjectPage--fe::table::externalWorkExperienceSkills::LineItem-title'),
        ),

        commentsAnchor: element(by.id('myResourcesUi::ExternalWorkExperienceObjectPage--fe::ObjectPage-anchBar-myResourcesUi::ExternalWorkExperienceObjectPage--fe::FacetSection::Comments-anchor')),

        commentsFacet: element(by.id('myResourcesUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::Comments')),
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
    title: (projectName) => element(by.control({
        controlType: 'sap.m.Title',
        properties: {
            text: projectName,
        },
    })),
    assignmentsTable: (tableName) => element(by.id(`myResourcesUi::MyResourceObjectPage--fe::table::${tableName}::LineItem-innerTable`)),

    skillsTableTitle: (tableName, sectionName) => element(by.id(`myResourcesUi::${tableName}ObjectPage--fe::table::${sectionName}::LineItem-title`)),

    skillsTable: (tableName, sectionName) => element(
        by.id(`myResourcesUi::${tableName}ObjectPage--fe::table::${sectionName}::LineItem-innerTable`),
    ),

    commentsSection: (tableName) => element(
        by.id(`myResourcesUi::${tableName}ObjectPage--fe::FacetSection::Comments`),
    ),
};

const actions = {

    async navigateToExternalWorkExperienceList() {
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
            if (await menuItems.get(i).getText() === 'External Work Experience') {
                await menuItems.get(i).click();
                break;
            }
        }
    },

    getAssignment(tableName, projectName) {
        const assignment = parentElements.assignmentsTable(tableName).element(
            by.control({
                controlType: 'sap.ui.mdc.Field',
                properties: {
                    value: projectName,
                },
            }),
        );
        return assignment;
    },

    getSkillValues(tableName, sectionName) {
        const listOfSkills = parentElements.skillsTable(tableName, sectionName).all(
            by.control({
                controlType: 'sap.m.ColumnListItem',
            }),
        );
        return listOfSkills;
    },

    async fillEmptyInputSubPage(valueToBeFilled) {
        let elementToBeClicked;
        const blankRow = '';
        const objectTableID = 'myResourcesUi::MyResourceObjectPage--fe::table::externalWorkExperienceSkills::LineItem-innerTable';
        const objectTable = element(by.id(objectTableID));
        const objectTableRows = objectTable.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRowsObjectTable = await objectTableRows.count();
        for (let i = 0; i < noOfRowsObjectTable; i++) {
            const row = objectTableRows.get(i).element(by.control({
                controlType: 'sap.ui.mdc.Field',
            }));
            const value = await row.asControl().getProperty('value');
            if (blankRow === await value) {
                elementToBeClicked = i;
                break;
            }
        }
        await objectTableRows.get(elementToBeClicked).element(by.control({
            controlType: 'sap.ui.mdc.Field',
        })).sendKeys(valueToBeFilled);
    },

    async createSkillRow() {
        const createId = 'myResourcesUi::MyResourceObjectPage--fe::table::externalWorkExperienceSkills::LineItem::StandardAction::Create';
        const createButton = element(by.id(createId));
        await createButton.click();
    },

    getProficiencyLevelName(tableName, sectionName, proficiencyLevelName) {
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

    getComment(tableName, comment) {
        const commentsText = parentElements.commentsSection(tableName).element(
            by.control({
                controlType: 'sap.m.ExpandableText',
                properties: {
                    text: comment,
                },
            }),
        );
        return commentsText;
    },

    getSkillName(tableName, sectionName, skillName) {
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

    async navigateToExternalWorkExperience(projectName) {
        const tableID = 'myResourcesUi::MyResourceObjectPage--fe::table::externalWorkExperience::LineItem-innerTable';
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

    async navigateToProjectNameInEditMode(table, projectName) {
        const tableID = 'myResourcesUi::MyResourceObjectPage--fe::table::externalWorkExperience::LineItem-innerTable';

        const rowList = await element(by.control({
            controlType: 'sap.m.ColumnListItem',
            ancestor: {
                id: tableID,
            },
            descendant: {
                controlType: 'sap.m.Input',
                properties: { value: projectName },
            },
        }));

        const arrowKey = await rowList.element(by.control({
            controlType: 'sap.ui.core.Icon',
            properties: { src: 'sap-icon://slim-arrow-right' },
        }));

        await arrowKey.click();
    },

    async navigateToGeneralInformation() {
        await priorExperience.elements.generalInformationAnchor.click();
    },

    navigateToSkills() {
        priorExperience.elements.skillsAnchor.click();
    },

    navigateToComments() {
        priorExperience.elements.commentsAnchor.click();
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

    async goBack() {
        CommonPageElements.objectPage.elements.backButton.click();
    },
};

const assertions = {
    checkTableTitle(expectedTableTitle) {
        const tableTitle = priorExperience.elements.tableTitle.getText();
        expect(tableTitle).toBe(expectedTableTitle);
    },

    async checkExtWorkExpFieldValue(fieldName, fieldValue) {
        const field = await element(by.control({ id: `myResourcesUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::${fieldName}::Field` }));
        expect(await field.getText()).toBe(fieldValue);
    },

    checkSkillTableTitle(expectedTableTitle) {
        const tableTitle = priorExperience.elements.skillTableTitle.getText();
        expect(tableTitle).toBe(expectedTableTitle);
    },

    async checkTableData(tableName, rowNum, projectName, role, company, customer, startDate, endDate) {
        const table = element(by.id(`myResourcesUi::MyResourceObjectPage--fe::table::${tableName}::LineItem-innerTable`));
        const tableRows = table.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const row = await tableRows.get(rowNum);
        const dataFields = row.all(by.control({
            controlType: 'sap.m.Text',
        }));
        expect(await dataFields.get(0).getText()).toBe(projectName);
        expect(await dataFields.get(1).getText()).toBe(role);
        expect(await dataFields.get(2).getText()).toBe(company);
        expect(await dataFields.get(3).getText()).toBe(customer);
        // Issue: https://github.wdf.sap.corp/fiori-elements/v4-consulting/issues/2336
        // expect(await dataFields.get(4).getText()).toBe(startDate);
        // expect(await dataFields.get(5).getText()).toBe(endDate);
    },

    checkObjectPageData(projectName, role, company, customer, startDate, endDate) {
        const generalInformation = priorExperience.elements.generalInformationFacet.all(by.control({
            controlType: 'sap.m.Text',
        }));

        expect(generalInformation.get(0).getText()).toBe(projectName);
        expect(generalInformation.get(1).getText()).toBe(customer);
        expect(generalInformation.get(2).getText()).toBe(role);
        expect(generalInformation.get(3).getText()).toBe(company);
        expect(generalInformation.get(4).getText()).toBe(startDate);
        expect(generalInformation.get(5).getText()).toBe(endDate);
    },

    checkSkillName(expectedSkillName) {
        const skillRecord = priorExperience.elements.skillTable.element(by.control({
            controlType: 'sap.m.Link',
            properties: {
                text: expectedSkillName,
            },
        }));

        expect(skillRecord.isPresent()).toBeTruthy();
    },

    checkProficiencyLevelName(expectedProficiencyLevelName) {
        const proficiencyLevelRecord = priorExperience.elements.skillTable.element(by.control({
            controlType: 'sap.m.Text',
            properties: {
                text: expectedProficiencyLevelName,
            },
        }));

        expect(proficiencyLevelRecord.isPresent()).toBeTruthy();
    },

    checkComments(expectedComments) {
        const comment = priorExperience.elements.commentsFacet.element(by.control({
            controlType: 'sap.m.ExpandableText',
            properties: {
                text: expectedComments,
            },
        }));

        expect(comment.isPresent()).toBeTruthy();
    },

    async checkProficiencyLevelValueHelpTableData(rowNum, levelName, levelDescription) {
        const tableRows = element.all(by.control({
            controlType: 'sap.m.ColumnListItem',
            ancestor: { controlType: 'sap.m.Table', id: /SuggestTable$/ },
        }));
        const row = await tableRows.get(rowNum);
        const dataFields = row.all(by.control({
            controlType: 'sap.m.Text',
        }));
        expect(await dataFields.get(0).getText()).toBe(levelName);
        expect(await dataFields.get(1).getText()).toBe(levelDescription);
    },

};

module.exports = {
    parentElements,
    actions,
    assertions,
    priorExperience,
};
