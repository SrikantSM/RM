const FLP = require('../pages/FLP.js');
// eslint-disable-next-line no-unused-vars
const ResourceRequestPages = require('../pages/resourceRequestPages.js');

function executeTest(testHelper) {
    testHelper.loginWithRole('ProjectManager');

    it('RR: should click on Manage Resource Request App', async function() {
        FLP.tiles.manageResourceRequest.click();
        FLP.waitForInitialAppLoad('manageResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-toolbar');
    });

    it('RR: should navigate to the Manage Resource Request List Report', async function() {
        await Then.onTheResourceRequestPage.theListReportTableShouldBePresent();
    });

    it('RR: should click on first row', async function() {
        const requestId = testHelper.testData.resourceRequest.displayId;
        When.onTheResourceRequestPage.iSearchForRequestId(requestId);
    });

    it('RR: should navigate to the Manage Resource request Object Page', async function() {
        await When.onTheResourceRequestPage.iClickTheFirstRow();
        // The Above function is not actually performing the click, but it does select the row and we do a click by pressing enter below
        await browser.sleep(2000);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
        await Then.onTheResourceRequestPage.theObjectPageShouldBePresent();
    });

    it('RR: should validate the assigned resource for the resource request', async function(){
        let assignedResourceFullName = testHelper.testData.consultantProfile.profileDetails[0].firstName.concat(" ").concat(testHelper.testData.consultantProfile.profileDetails[0].lastName);
        await Then.onTheResourceRequestPage.iValidateTheAssignedResources(assignedResourceFullName);
    });

    testHelper.logout();
}

module.exports.executeTest = executeTest;
