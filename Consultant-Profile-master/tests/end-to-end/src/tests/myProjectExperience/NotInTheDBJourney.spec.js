const LaunchpadPage = require('../pages/LaunchpadPage.js');
const CommonPageElements = require('../pages/CommonPageElements.js');
const { TestHelper } = require('../../utils/TestHelper');

describe('NotInTheDBJourney', () => {
    const testHelper = new TestHelper();
    testHelper.loginWithRole('NOT_IN_DB');
    testHelper.failEarlyIt('Should not be data for this email', async () => {
        LaunchpadPage.actions.openMyProjectExperienceListApp();
        browser.wait(() => CommonPageElements.objectPage.elements.messageDialog.dialog.isPresent(), 600000);
        expect(CommonPageElements.objectPage.elements.messageDialog.dialog.isPresent()).toBeTruthy();
        CommonPageElements.objectPage.elements.messageDialog.closeButton.click();
    });
    testHelper.logout();
});
