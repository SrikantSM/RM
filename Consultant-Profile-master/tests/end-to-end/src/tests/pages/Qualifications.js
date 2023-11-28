const parentElements = {

    contentSection: element(
        by.control({
            controlType: 'sap.uxap.ObjectPageSection',
            id: 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FacetSection::Qualifications',
            interaction: 'focus',
        }),
    ),

    draftModeSkillsTable: element(
        by.id(
            'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem-innerTable ',
        ),
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

};

const qualifications = {

    elements: {

        tableTitle: element(by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem-title')),

        values: element(
            by.id(
                'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem-innerTable',
            ),
        ),

        buttonInAnchorBar: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::ObjectPage-anchBar-myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FacetSection::Qualifications-anchor'),
        ),

        skillTableToolbar: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem-toolbar'),
        ),

        draftModeOverflowToolbars: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::op::footer::MyProjectExperienceHeader'),
        ),

        skillValueHelpTable: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::::Table-innerTable'),
        ),

        valueHelpOkButton: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID-ok'),
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

        catalogFilterInput: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::FilterBar::FilterField::catalogAssociations::catalog::name-inner'),
        ),

        moreButton: element(by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem-innerTable-trigger')),

    },
};

const actions = {

    navigateToQualifications() {
        qualifications.elements.buttonInAnchorBar.click();
    },

    getQualificationsValues() {
        const listOfSkills = qualifications.elements.values.all(
            by.control({
                controlType: 'sap.m.ColumnListItem',
            }),
        );

        return listOfSkills;
    },

    getColumnHeader() {
        const columnHeaders = qualifications.elements.values.all(
            by.control({
                controlType: 'sap.m.Column',
            }),
        );

        return columnHeaders;
    },

    getSkillName(skillName) {
        const name = parentElements.contentSection.element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: skillName,
                },
            }),
        );
        return name;
    },

    getProficiencyLevelName(proficiencyLevelName) {
        const name = parentElements.contentSection.element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: proficiencyLevelName,
                },
            }),
        );
        return name;
    },

    async clickOnASkill(skillName) {
        const skill = await qualifications.elements.values.element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: skillName,
                },
            }),
        );
        await skill.click();
    },

    getSkillWithErrorValueState(sValueState) {
        const skill = qualifications.elements.values.element(
            by.control({
                controlType: 'sap.ui.mdc.Field',
                properties: {
                    valueState: sValueState,
                },
            }),
        );
        return skill;
    },
};

const assertions = {
    async checkSkillValueHelpTableData(skillName, description, alternativeName, catalogs) {
        const table = element(by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::::Table-innerTable'));
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
            if (skillName === valueToCheck) {
                break;
            }
        }

        const rowToBeChecked = await tableRows.get(i);
        const dataFields = rowToBeChecked.all(by.control({
            controlType: 'sap.m.Text',
        }));
        expect(await dataFields.get(0).getText()).toBe(skillName);
        expect(await dataFields.get(1).getText()).toBe(description);
        expect(await dataFields.get(2).getText()).toBe(alternativeName);
        expect(await dataFields.get(3).getText()).toBe(catalogs);
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

    async getDropdownBySiblingValue(tableName, siblingValue, propertyName, objectPage) {
        const proficicencyLevelDropDown = await element(by.control({
            controlType: 'sap.ui.core.Icon',
            properties: {
                src: 'sap-icon://slim-arrow-down',
            },
            ancestor: {
                controlType: 'sap.ui.mdc.Field',
                bindingPath: {
                    propertyPath: propertyName,
                },
                ancestor: {
                    controlType: 'sap.m.ColumnListItem',
                    descendant: {
                        controlType: 'sap.ui.mdc.Field',
                        properties: {
                            additionalValue: siblingValue,
                        },
                    },
                    ancestor: {
                        id: `myProjectExperienceUi::${objectPage}--fe::table::${tableName}::LineItem`,
                    },
                },
            },
        }));

        return proficicencyLevelDropDown;
    },
};

module.exports = {
    actions,
    assertions,
    qualifications,
    parentElements,
};
