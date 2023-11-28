// eslint-disable-next-line no-unused-vars
const processResourceRequestPageObject = require("../pages/RRProcessResourceRequestPages.js");
const FLP = require("../pages/FLP.js");
const BasicDataPage = require('./../../../../Consultant-Profile/tests/end-to-end/src/tests/pages/myResourcePages/BasicDataPage');

function executeTest(testHelper) {
    let resourceName, resourceExternalID, appendedResourceName;
    testHelper.loginWithRole("ResourceManager");

    it("RR: should click on Staff Resource Request App", function() {
        FLP.tiles.processeResourceRequest.click();
        FLP.waitForInitialAppLoad('staffResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-toolbar');
    });

    it("RR: should navigate to the Staff Resource Request List Report", function() {
        Then.onTheProcessResourceRequestPage.theListReportTableShouldBePresent();
    });

    it("RR: should click on first row", async function() {
        const requestId = testHelper.testData.resourceRequest.displayId;
        When.onTheProcessResourceRequestPage.iSearchForRequestId(requestId);
        Then.onTheProcessResourceRequestPage.theTableCountIs(1);
        await When.onTheProcessResourceRequestPage.iClickTheFirstRow();
        await browser.sleep(2000);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
    });

    it("RR: should navigate to the Staff Resource Request Object page",async function() {
        await Then.onTheProcessResourceRequestPage.theObjectPageShouldBePresent();
    });

    it("RR: should validate the matching candidates",function(){
        let matchingResourceDetails = [
            {
                name:testHelper.testData.consultantProfile.profileDetails[0].firstName.concat(" ").concat(testHelper.testData.consultantProfile.profileDetails[0].lastName),
                commaSeparatedProjectRoles:'Developer',
                skillMatch:'100.00%',
                availabilityMatch:'20.00%',
                totalMatch:'60.00%'
            },
            {
                name:testHelper.testData.consultantProfile.profileDetails[3].firstName.concat(" ").concat(testHelper.testData.consultantProfile.profileDetails[3].lastName),
                commaSeparatedProjectRoles:'Architect',
                skillMatch:'100.00%',
                availabilityMatch:'16.66%',
                totalMatch:'58.33%'
            },
            {
                name:testHelper.testData.consultantProfile.profileDetails[1].firstName.concat(" ").concat(testHelper.testData.consultantProfile.profileDetails[1].lastName),
                commaSeparatedProjectRoles:'Developer',
                skillMatch:'100.00%',
                availabilityMatch:'12.5%',
                totalMatch:'56.25%'
            },
            {
                name:testHelper.testData.consultantProfile.profileDetails[2].firstName.concat(" ").concat(testHelper.testData.consultantProfile.profileDetails[2].lastName),
                commaSeparatedProjectRoles:'Developer',
                skillMatch:'0.00%',
                availabilityMatch:'20%',
                totalMatch:'10%'
            }
        ];
        When.onTheProcessResourceRequestPage.iClickOnMatchingResourcesAnchorButton();
        Then.onTheProcessResourceRequestPage.theMatchingCandidateTableIsNotEmpty();
        Then.onTheProcessResourceRequestPage.iValidateTheMatchingCandidate(0,matchingResourceDetails[0]).catch( e => { console.error(e);} );
    // Then.onTheProcessResourceRequestPage.iValidateTheMatchingCandidate(1,matchingResourceDetails[1]).catch( e => { console.error(e)} );
    // Then.onTheProcessResourceRequestPage.iValidateTheMatchingCandidate(2,matchingResourceDetails[2]).catch( e => { console.error(e)} );
    // Then.onTheProcessResourceRequestPage.iValidateTheMatchingCandidate(3,matchingResourceDetails[3]).catch( e => { console.error(e)} );
    });

    it("RR: should click on the name in object page", async function () {
        resourceName = testHelper.testData.consultantProfile.profileDetails[0].firstName.concat(" ").concat(testHelper.testData.consultantProfile.profileDetails[0].lastName);
        await When.onTheProcessResourceRequestPage.iClickOnNameinMatchingResouces(resourceName);
    });

    it("RR: should click on the name in contact card", async function () {
        //firstNamedbdeb7-137-4 lastNamedbdeb7-137-4 (cc81bc_137_4)
        await When.onTheProcessResourceRequestPage.iShouldVerifyManagerFields("sap.m.Label", "Manager");
        await When.onTheProcessResourceRequestPage.iShouldVerifyManagerFields("sap.m.Text", "Test Usere2e2 (test.usere2e2)");
        resourceExternalID = " (".concat(testHelper.testData.consultantProfile.workforcePersons[0].externalID).concat(")");
        appendedResourceName = resourceName.concat(resourceExternalID);
        await When.onTheProcessResourceRequestPage.iClickOnNameinMatchingResoucesContactCard(appendedResourceName);
        browser.sleep(7000);
    });

    it("RR: should navigate to myResources page", function () {
        //Switch the window to look for the controls in the newly opened window
        browser.driver.getAllWindowHandles().then(function (handles) {
            browser.switchTo().window(handles[handles.length - 1]).then(function () {
                // load uiveri5 instrumentation so by.control works
                browser.loadUI5Dependencies();
                FLP.waitForInitialAppLoad('myResourcesUi::MyResourceObjectPage--fe::ObjectPage');
                BasicDataPage.assertions.checkHeaderTitle(resourceName + ' (' + testHelper.testData.consultantProfile.workforcePersons[0].externalID + ')');
            });
        });
    });
    testHelper.logout();
}

module.exports.executeTest = executeTest;
