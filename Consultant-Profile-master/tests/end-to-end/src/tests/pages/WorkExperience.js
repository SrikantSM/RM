const parentElements = {

    objectPageLayout: (tableName) => element(
        by.id(`myProjectExperienceUi::${tableName}ObjectPage--fe::ObjectPage`),
    ),

    generalInfoSection: (tableName) => element(
        by.id(`myProjectExperienceUi::${tableName}ObjectPage--fe::FacetSection::GeneralInformation`),
    ),

    skillsSection: (tableName) => element(
        by.id(`myProjectExperienceUi::${tableName}ObjectPage--fe::FacetSection::InternalWorkExperienceSkills`),
    ),

    commentsSection: (tableName) => element(
        by.id(`myProjectExperienceUi::${tableName}ObjectPage--fe::FacetSection::Comments`),
    ),

    title: (projectName) => element(by.control({
        controlType: 'sap.m.Title',
        properties: {
            text: projectName,
        },
    })),

    titleIntExp: (requestName) => element(by.control({
        controlType: 'sap.m.Title',
        properties: {
            text: requestName,
        },
    })),

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

    assignmentsTableTitle: (tableName) => element(by.id(`myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem-title`)),

    assignmentsTable: (tableName) => element(by.id(`myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem-innerTable`)),

    skillsTableTitle: (tableName, sectionName) => element(by.id(`myProjectExperienceUi::${tableName}ObjectPage--fe::table::${sectionName}::LineItem-title`)),

    skillsTable: (tableName, sectionName) => element(
        by.id(`myProjectExperienceUi::${tableName}ObjectPage--fe::table::${sectionName}::LineItem-innerTable`),
    ),

    buttonInAnchorBar: (tableName, sectionName) => element(
        by.id(`myProjectExperienceUi::${tableName}ObjectPage--fe::ObjectPage-anchBar-myProjectExperienceUi::${tableName}ObjectPage--fe::FacetSection::${sectionName}-anchor`),
    ),

    settingsButton: (tableName) => element(by.id(`myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem-settings`)),

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

    async navigateToProjectHistory(entity) {
        const splitButtonID = 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::ObjectPage-anchBar-myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FacetSection::PriorExperience-anchor-internalSplitBtn';
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

    async navigateToProjectNameInEditMode(table, projectName) {
        let tableID;
        if (table === 'InternalWorkExperience') tableID = 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::internalWorkExperience::LineItem-innerTable';
        else tableID = 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::externalWorkExperience::LineItem-innerTable';

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

    async navigateToProjectName(table, projectName) {
        let tableID;
        if (table === 'InternalWorkExperience') tableID = 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::internalWorkExperience::LineItem-innerTable';
        else tableID = 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::externalWorkExperience::LineItem-innerTable';

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

    async navigateToRequestName(requestName) {
        const tableID = 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::internalWorkExperience::LineItem-innerTable';

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

    getSkillValues(tableName, sectionName) {
        const listOfSkills = parentElements.skillsTable(tableName, sectionName).all(
            by.control({
                controlType: 'sap.m.ColumnListItem',
            }),
        );
        return listOfSkills;
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

    getCommentLabel(tableName, label) {
        const commentsLabel = parentElements.commentsSection(tableName).element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: label,
                },
            }),
        );
        return commentsLabel;
    },

    getCommentInEdit(tableName, comment) {
        const commentsText = parentElements.commentsSection(tableName).element(
            by.control({
                controlType: 'sap.m.TextArea',
                properties: {
                    value: comment,
                },
            }),
        );
        return commentsText;
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

    async editComment(tableName, newComment) {
        const comment = await element(by.control({
            controlType: 'sap.m.TextArea',
            id: `myProjectExperienceUi::${tableName}ObjectPage--fe::FormContainer::FieldGroup::Comments::FormElement::DataField::comments::Field-edit`,
        }));
        await comment.clear();
        await comment.sendKeys(newComment);
    },

    getListOfAssignments(tableName) {
        const assignments = parentElements.assignmentsTable(tableName).all(
            by.control({
                controlType: 'sap.m.ColumnListItem',
            }),
        );
        return assignments;
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

    async clickOnASkill(tableName, sectionName, skillName) {
        const skill = parentElements.skillsTable(tableName, sectionName).element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: skillName,
                },
            }),
        );
        await skill.click();
    },
};

const assertions = {

    async checkTableData(tableName, rowNum, projectName, role, company, customer, startDate, endDate) {
        const table = element(by.id(`myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::${tableName}::LineItem-innerTable`));
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

    async checkInternalExperienceTableData(rowNum, requestName, displayId, role, company, customer, startDate, endDate, assignmentStatus) {
        const table = element(by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::internalWorkExperience::LineItem-innerTable'));
        const tableRows = table.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const row = await tableRows.get(rowNum);
        const dataFields = row.all(by.control({
            controlType: 'sap.m.Text',
        }));
        expect(await dataFields.get(0).getText()).toBe(requestName);
        expect(await dataFields.get(1).getText()).toBe(displayId);
        expect(await dataFields.get(2).getText()).toBe(role);
        expect(await dataFields.get(3).getText()).toBe(company);
        expect(await dataFields.get(4).getText()).toBe(customer);
        expect(await dataFields.get(5).getText()).toBe(startDate);
        expect(await dataFields.get(6).getText()).toBe(endDate);
        expect(await dataFields.get(7).getText()).toBe(assignmentStatus);
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

    async checkIntWorkExpFieldValue(fieldName, fieldValue) {
        const field = await element(by.control({ id: `myProjectExperienceUi::InternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::${fieldName}::Field-content` }));
        expect(await field.getText()).toBe(fieldValue);
    },

    async checkExtWorkExpFieldValue(fieldName, fieldValue) {
        const field = await element(by.control({ id: `myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation::FormElement::DataField::${fieldName}::Field` }));
        expect(await field.getText()).toBe(fieldValue);
    },
};

module.exports = {
    parentElements,
    actions,
    assertions,
};
