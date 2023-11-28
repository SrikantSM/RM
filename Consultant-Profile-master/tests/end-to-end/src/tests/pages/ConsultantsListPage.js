const CommonPageElements = require('./CommonPageElements.js');

const listReportTable = element(by.control({
    controlType: 'sap.m.Table',
    id: 'myProjectExperienceUi::MyProjectExperienceListReport--fe::table::MyProjectExperienceHeader::LineItem-innerTable',
    interaction: 'focus',
}));

const listReport = {
    elements: {
        titleString: 'Consultant List',
        tableRows: CommonPageElements.listReport.elements.tableRows,
        header: CommonPageElements.listReport.elements.header,
    },
};

const actions = {

    async navigateToConsultant(email) {
        const { tableRows } = listReport.elements;
        const cnt = await tableRows.count();
        let rowToBeClicked;

        for (let i = 0; i < cnt; i++) {
            const row = tableRows.get(i).all(
                by.control({
                    controlType: 'sap.ui.mdc.Field',
                }),
            );
            const consultantEmail = row.get(2).getText();

            if (email === await consultantEmail) {
                rowToBeClicked = i;
                break;
            }
        }

        rowToBeClicked = 0;

        tableRows.get(rowToBeClicked).click();
    },

    async logout() {
        const logoutButton = element(by.control({
            controlType: 'sap.ushell.ui.shell.ShellHeadItem',
            properties: {
                icon: 'sap-icon://person-placeholder',
            },
        }));

        logoutButton.click();

        const signOutListItem = element(by.control({
            controlType: 'sap.m.StandardListItem',
            properties: {
                title: 'Sign Out',
            },
        }));

        signOutListItem.click();

        const okButton = element(by.control({
            controlType: 'sap.m.Button',
            properties: {
                text: 'OK',
            },
        }));

        okButton.click();
    },

    async navigate(name) {
        const searchField = await element(by.control({
            controlType: 'sap.ui.mdc.FilterField',
            id: 'myProjectExperienceUi::MyProjectExperienceListReport--fe::fb::MyProjectExperienceHeader::FF::profile::emailAddress',
        }));

        await searchField.sendKeys(name);

        const goButton = await element(by.id(
            'myProjectExperienceUi::MyProjectExperienceListReport--fe::fb::MyProjectExperienceHeader-btnSearch',
        ));

        await goButton.click();
    },
};

module.exports = {
    listReportTable,
    listReport,
    actions,
};
