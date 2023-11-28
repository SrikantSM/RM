const FLP = require("../pages/FLP.js");
// eslint-disable-next-line no-unused-vars
const processResourceRequestPageObject = require("../pages/RRProcessResourceRequestPages.js");
// let costCenterCode, resourceManagerValue, processorValue;

function executeTest(testHelper) {
    var role, userEmail;
    it('RR: should initialize data', function(){
        role = 'ResourceManager';
        userEmail = browser.testrunner.config.params.appUsers.get(role.toUpperCase());
    });
    testHelper.loginWithRole('ResourceManager');

    // it('RR: should fetch Dependant data from ConsultantProfile using testHelper', function() {
    //   costCenterCode = testHelper.testData.consultantProfile.organizationDetails.filter(
    //     organizationDetail => organizationDetail.unitKey == "CCIN"
    //   ).unitKey;
    //   let resourceManagerObject = testHelper.testData.consultantProfile.profileDetails.filter(
    //     profileDetail => profileDetail.firstName == "Van" && profileDetail.lastName == "Sporer"
    //   );
    //   resourceManagerValue = resourceManagerObject.firstName +" " + resourceManagerObject.lastName;

    //   let processorObject = testHelper.testData.consultantProfile.profileDetails.filter(
    //     profileDetail => profileDetail.firstName == "Maxine" && profileDetail.lastName == "Abshire"
    //   );
    //   processorValue = processorObject.firstName +" " + processorObject.lastName;
    //   processorValue = testHelper.testData.skill.skills.filter(
    //     data => data.description == 'Maxine Abshire'
    //   );
    // });

    it('RR: should only see Staff Resource Request tile', function() {
        expect(FLP.tiles.manageResourceRequest.isPresent()).toBe(false);
        expect(FLP.tiles.processeResourceRequest.isPresent()).toBe(true);
    });

    it('RR: should click on Staff Resource Request App', async function () {
        FLP.tiles.processeResourceRequest.click();
        FLP.waitForInitialAppLoad('staffResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-toolbar');
    });

    it('RR: should navigate to Staff Resource Request App', async function () {
        await Then.onTheProcessResourceRequestPage.theListReportTableShouldBePresent();
    });

    it('RR: should click on first row', async function () {
        const requestId = testHelper.testData.resourceRequest.displayId;
        When.onTheProcessResourceRequestPage.iSearchForRequestId(requestId);
        Then.onTheProcessResourceRequestPage.theTableCountIs(1);
        await When.onTheProcessResourceRequestPage.iClickTheFirstRow();
        await browser.sleep(2000);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
    });

    it('RR: should navigate to Staff Resource Request App - Object page', async function () {
        await Then.onTheProcessResourceRequestPage.theObjectPageShouldBePresent();
    });

    it('RR: should set the responsibility for the ResourceRequest as Processor', function() {
        When.onTheProcessResourceRequestPage.iSetMyResponsibilityForTheResourceRequest("No","Yes");
        Then.onTheProcessResourceRequestPage.iShouldSeeTheSetResponsibilityValues("",userEmail);
    });

    it('RR: should set the responsibility for the ResourceRequest as ResourceManager', function() {
        When.onTheProcessResourceRequestPage.iSetMyResponsibilityForTheResourceRequest("Yes","No");
        Then.onTheProcessResourceRequestPage.iShouldSeeTheSetResponsibilityValues(userEmail,"");
    });

    it('RR: should set the responsibility for the ResourceRequest as ResourceManager and as Processor', function() {
        When.onTheProcessResourceRequestPage.iSetMyResponsibilityForTheResourceRequest("Yes","Yes");
        Then.onTheProcessResourceRequestPage.iShouldSeeTheSetResponsibilityValues(userEmail,userEmail);
    });

    it('RR: should remove the responsibility for the ResourceRequest as ResourceManager and as Processor', function() {
        When.onTheProcessResourceRequestPage.iSetMyResponsibilityForTheResourceRequest("No","No");
        Then.onTheProcessResourceRequestPage.iShouldSeeTheSetResponsibilityValues("","");
    });

    it('RR: should click the forward button', async function () {
        await When.onTheProcessResourceRequestPage.iClickTheForwardButton();
    });

    it('RR: should forward to a different processing resource organization', async function () {
        const resOrgDesc = testHelper.testData.centralServices.resourceOrganizations[1].name;
        await When.onTheProcessResourceRequestPage.iForwardToDifferentResourceOrg(resOrgDesc);
    });

    // it('RR: should forward to a different resource manager', async function() {
    //   await When.onTheProcessResourceRequestPage.iForwardToDifferentResourceManager('Van Sporer');
    // });

    // it('RR: should forward to a different processor', async function() {
    //   await When.onTheProcessResourceRequestPage.iForwardToDifferentProcessor('Maxine Abshire');
    // });

    it('RR: should click on forward dialog button', async function () {
        await When.onTheProcessResourceRequestPage.iClickOnForwardButtonWithinDialog();
    });

    it('RR: should see the forwarded values', async function () {
    // eslint-disable-next-line no-warning-comments
    //todo: pick these values from testHelper.testData once ConsultantProfile adds the data.
    //Then.onTheProcessResourceRequestPage.iShouldSeeTheForwardedValues(costCenterCode,resourceManagerValue,processorValue);
        const resOrgDesc = testHelper.testData.centralServices.resourceOrganizations[1].name;
        When.onTheProcessResourceRequestPage.iClickOnCollapseHeader();
        Then.onTheProcessResourceRequestPage.iShouldSeeTheForwardedValues(resOrgDesc);
    //, 'Van Sporer', 'Maxine Abshire');
    });
    testHelper.logout();

}

module.exports.executeTest = executeTest;
