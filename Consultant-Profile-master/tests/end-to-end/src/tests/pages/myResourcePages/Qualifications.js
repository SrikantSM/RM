const parentElements = {
    contentSection: element(by.control({
        controlType: 'sap.uxap.ObjectPageSection',
        id: 'myResourcesUi::MyResourceObjectPage--fe::FacetSection::Qualifications',
        interaction: 'focus',
    })),

    skillTable: element(by.id('myResourcesUi::MyResourceObjectPage--fe::table::skills::LineItem-innerTable')),

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
        tableTitle: element(by.id('myResourcesUi::MyResourceObjectPage--fe::table::skills::LineItem-title')),

        buttonInAnchorBar: element(by.id('myResourcesUi::MyResourceObjectPage--fe::ObjectPage-anchBar-myResourcesUi::MyResourceObjectPage--fe::FacetSection::Qualifications-anchor')),

        valueHelpShowFiltersBtn: element(by.id('myResourcesUi::MyResourceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::::FilterBar-btnShowFilters')),

        valueHelpCancelButton: element(
            by.control({
                controlType: 'sap.m.Button',
                properties: {
                    text: 'Cancel',
                },
            }),
        ),

        catalogFilterInput: element(
            by.id('myResourcesUi::MyResourceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::FilterBar::FilterField::catalogAssociations::catalog::name-inner'),
        ),

        values: element(
            by.id(
                'myResourcesUi::MyResourceObjectPage--fe::table::skills::LineItem-innerTable',
            ),
        ),
    },

};

const assertions = {
    checkSkillName(excpectedSkillName) {
        const skillRecord = parentElements.contentSection.element(by.control({
            controlType: 'sap.m.Link',
            properties: {
                text: excpectedSkillName,
            },
        }));

        expect(skillRecord.isPresent()).toBeTruthy();
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
    async checkSkillValueHelpTableData(skillName, description, alternativeName, catalogs) {
        const table = element(by.id('myResourcesUi::MyResourceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Table-innerTable'));
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

    checkProficiencyLevelName(expectedProficiencyLevelName) {
        const skillRecord = parentElements.contentSection.element(by.control({
            controlType: 'sap.m.Text',
            properties: {
                text: expectedProficiencyLevelName,
            },
        }));

        expect(skillRecord.isPresent()).toBeTruthy();
    },

    checkTableTitle(expectedTableTitle) {
        const tableTitle = qualifications.elements.tableTitle.getText();
        expect(tableTitle).toBe(expectedTableTitle);
    },
};

const actions = {
    navigateToQualifications() {
        qualifications.elements.buttonInAnchorBar.click();
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
        const skill = parentElements.skillTable.element(
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

module.exports = {
    actions,
    assertions,
    qualifications,
    parentElements,
};
