const parentElements = {

    contentSection: element(
        by.control({
            controlType: 'sap.uxap.ObjectPageSection',
            id: 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::ops::Qualifications',
            interaction: 'focus',
        }),
    ),

    draftModeSkillsTable: element(
        by.id(
            'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem-innerTable ',
        ),
    ),
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
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::op-anchBar-myProjectExperienceUi::MyProjectExperienceObjectPage--fe::ops::Qualifications-anchor'),
        ),

        skillTableToolbar: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem-toolbar'),
        ),

        draftModeOverflowToolbars: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::op::footer::MyProjectExperienceHeader'),
        ),
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
};

module.exports = {
    actions,
    qualifications,
    parentElements,
};
