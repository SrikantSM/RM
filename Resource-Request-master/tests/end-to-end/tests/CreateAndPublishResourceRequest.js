const FLP = require("../pages/FLP.js");
// eslint-disable-next-line no-unused-vars
const ResourceRequestPages = require("../pages/resourceRequestPages.js");

function executeTest(testHelper) {
    testHelper.loginWithRole("ProjectManager");
    let projectInformationValues, resourceRequestDetails, skillTestHelper, proficiencyLevel;

    it("RR: should load initial data using testHelper", function() {
        projectInformationValues = {
            billingRole: testHelper.testData.resourceRequest.billingRoles[0].name, //'Junior Consultant'
            workPackage: testHelper.testData.resourceRequest.workPackages[0].name, //'Design'
            project: testHelper.testData.resourceRequest.projects[0].name //'Implementation of SAP S/4HANA'
        };
        let projectRoleTestHelper = testHelper.testData.consultantProfile.projectRoles.filter(data => data.code === "T002")[0];
        resourceRequestDetails = {
            requestName: testHelper.testData.resourceRequest.requestName,
            projectRoleCode: projectRoleTestHelper.code,//"T002"
            projectRole: projectRoleTestHelper.name,//"Architect",
            serviceOrganizationCode: testHelper.testData.resourceRequest.projects[0].serviceOrganization_code, // Org_1
            startDate: testHelper.testData.resourceRequest.workPackages[0].startDate, //today         // needed for Assignment DemoFlow
            endDate: testHelper.testData.resourceRequest.workPackages[0].endDate,   //today+90days    // needed for Assignment DemoFlow
            requestedEffort: testHelper.testData.resourceRequest.demands[0].requestedQuantity,        // needed for Assignment DemoFlow
            comment: "Urgently needed"
        };
        skillTestHelper = testHelper.testData.skill.skillTexts.find(skill => skill.name.startsWith('JavaScript'));
        proficiencyLevel = testHelper.testData.skill.proficiencyLevels[0].name;

        //add Resource Request details in the testhelper
        testHelper.testData.resourceRequest.projectInformationValues = projectInformationValues;
        testHelper.testData.resourceRequest.resourceRequestDetails = resourceRequestDetails;

    });

    it("RR: should only see Manage Resource Request tile", function() {
        expect(FLP.tiles.manageResourceRequest.isPresent()).toBe(true);
        expect(FLP.tiles.processeResourceRequest.isPresent()).toBe(false);
    });

    it("RR: should click on the Manage Resource Request App", async function() {
        FLP.tiles.manageResourceRequest.click();
        FLP.waitForInitialAppLoad('manageResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-toolbar');
    });

    it("RR: should navigate to the Manage Resource Request App", async function() {
        await Then.onTheResourceRequestPage.theListReportTableShouldBePresent();
    });

    // it("RR: should click on create button to navigate to object page", async function() {
    //     await When.onTheResourceRequestPage.iClickTheCreateButton();
    // //Then.onTheResourceRequestPage.theObjectPageShouldBePresent();
    // });

    it("RR: should search for request id", function() {
        const requestId = testHelper.testData.resourceRequest.displayId;
        When.onTheResourceRequestPage.iSearchForRequestId(requestId);
        Then.onTheResourceRequestPage.theTableCountIs(1);
    });

    it("RR: should navigate to the Manage Resource Request App - Object Page", async function() {
        await When.onTheResourceRequestPage.iClickTheFirstRow();
        // The Above function is not actually performing the click, but it does select the row and we do a click by pressing enter below
        await browser.sleep(2000);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
        await Then.onTheResourceRequestPage.theObjectPageShouldBePresent();
        await When.onTheResourceRequestPage.iClickTheEditButton();
    });

    it("RR: should enter other resource request details", async function() {
        When.onTheResourceRequestPage.iEnterTheResourceRequestDetails(
            resourceRequestDetails
        );
    });

    it("RR: should enter a mandatory Skill", async function() {
        let skillName = skillTestHelper.name;
        await When.onTheResourceRequestPage.iAddAMandatorySkill(skillName,proficiencyLevel);
    });

    it("RR: should save the resource request details", async function() {
        When.onTheResourceRequestPage.iClickTheSaveButton();

        Then.onTheResourceRequestPage.theCreatedResourceRequestIsVisible(
            resourceRequestDetails
        );
    //Then.onTheResourceRequestPage.theCreatedResourceRequestIsNotPublished(resourceRequestDetails);
    });

    it("RR: should publish the request details", async function() {
        When.onTheResourceRequestPage.iPublishTheResourceRequest();
    });

    it("RR: should navigate back and check the created request details", async function() {
        await FLP.header.backButton.click();
        When.onTheResourceRequestPage.iSearchForEditingStatusUnchanged();
        When.onTheResourceRequestPage.iSearchForPublishedResourceRequests();

        Then.onTheResourceRequestPage.theTableCountIs(1);
    });

    testHelper.logout();
}

module.exports.executeTest = executeTest;
