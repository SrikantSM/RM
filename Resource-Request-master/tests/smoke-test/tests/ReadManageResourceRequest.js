const FLP = require('../../end-to-end/pages/FLP');
// eslint-disable-next-line no-unused-vars
const ResourceRequestPages = require("../../end-to-end/pages/resourceRequestPages");

function executeTest(testHelper){
    if (testHelper.userLoggedIn){
        console.log("Skipping the login as the user is already is logged in");
    } else {
        console.log("User not logged in, hence checking ");
        testHelper.loginWithRole("ProjectManager");
    }
    it("RR: should click on the Manage Resource Request App", async function() {
        FLP.tiles.manageResourceRequest.click();
        FLP.waitForInitialAppLoad('manageResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-toolbar');
    });

    it("RR: should navigate to the Manage Resource Request App", async function() {
        await Then.onTheResourceRequestPage.theListReportTableShouldBePresent();
    });

    it("RR: should navigate to the Manage Resource Request App - Object Page", async function() {
        await When.onTheResourceRequestPage.iClickTheFirstRow();
        // The Above function is not actually performing the click, but it does select the row and we do a click by pressing enter below
        await browser.sleep(2000);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
        await Then.onTheResourceRequestPage.theObjectPageShouldBePresent();
    });

    it("RR: Return to homepage",async function(){
        await FLP.header.homeButton.click();
    });

}

module.exports.executeTest = executeTest;
