const FLP = require('../pages/FLP.js');
// eslint-disable-next-line no-unused-vars
const ResourceRequestPages = require('../pages/resourceRequestPages.js');

function executeTest(testHelper) {
    testHelper.loginWithRole('ProjectManager');

    it('RR: should navigate to the Manage Resource Request App', async function() {
        FLP.tiles.manageResourceRequest.click();
        FLP.waitForInitialAppLoad('manageResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-toolbar');
        Then.onTheResourceRequestPage.theListReportTableShouldBePresent();
    });

    it('RR: should filter resource request', async function() {
        const requestId = testHelper.testData.resourceRequest.displayId;
        When.onTheResourceRequestPage.iSearchForRequestId(requestId);
        When.onTheResourceRequestPage.iSearchForEditingStatusUnchanged();
        When.onTheResourceRequestPage.iSearchForPublishedResourceRequests();
    });

    it('RR: should withdraw created Resource Request', async function() {
        await When.onTheResourceRequestPage.iClickTheFirstRow();
        // The Above function is not actually performing the click, but it does select the row and we do a click by pressing enter below
        await browser.sleep(2000);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
        await When.onTheResourceRequestPage.iWithdrawTheResourceRequest();
    });

    it('RR: should validate no published Resource Request exists', async function() {
        await FLP.header.backButton.click();
        When.onTheResourceRequestPage.iRemoveReleaseStatusFilter();
        await When.onTheResourceRequestPage.iSearchForPublishedResourceRequests();
        Then.onTheResourceRequestPage.theTableIsEmpty();
    });

    // it('RR: should delete all unpublished Resource Requests', function() {
    //     When.onTheResourceRequestPage.iSearchForEditingStatusAll();
    //     When.onTheResourceRequestPage.iRemoveReleaseStatusFilter();
    //     When.onTheResourceRequestPage.iSearchForUnpublishedResourceRequests();
    //     When.onTheResourceRequestPage.iSelectAllResourceRequestsAndDelete();
    //     Then.onTheResourceRequestPage.theTableIsEmpty();
    // });


    testHelper.logout();
}

module.exports.executeTest = executeTest;
