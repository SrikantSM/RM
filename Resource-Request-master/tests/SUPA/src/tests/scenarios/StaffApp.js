// eslint-disable-next-line no-unused-vars
const RRProcessResourceRequestPages = require("../../../../end-to-end/pages/RRProcessResourceRequestPages");
const processResourceRequestListReport = require('../../../../end-to-end/pages/locators/processResourceRequestListReport');
const processResourceRequestObjectPage = require('../../../../end-to-end/pages/locators/processResourceRequestObjectPage');
const FLP = require("../../../../end-to-end/pages/FLP");
const { Constants } = require("../../data/Constants");

function executeTest(supaHelper) {
    let tab, enter;
    it("Staff Resource Request tile should appear", function () {
        expect(FLP.tiles.manageResourceRequest.isPresent()).toBe(false);
        expect(FLP.tiles.processeResourceRequest.isPresent()).toBe(true);
    });

    it("should set data", async function() {
        enter = browser.actions().sendKeys(protractor.Key.ENTER);
        tab = browser.actions().sendKeys(protractor.Key.TAB);
    });

    it("should click on Staff Resource Request App", function() {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement('010_Open Staff Resource Request App');
            });
        }
        enter.perform();
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("should navigate to the Staff Resource Request List Page", function() {
        Then.onTheProcessResourceRequestPage.theListReportTableShouldBePresent();
    });

    it("should Filter 3 wild characters request names, 2 Roles and Open status", async function () {
        const requestNameSearchArray = Constants.requestNameSearchArray;
        const projectRoleArray = Constants.projectRoleSearchArray;
        const requestStatusArray = Constants.requestStatusAsOpenArray;
        // Enter 4 projects and 2 Roles and Status as Open
        When.onTheProcessResourceRequestPage.iEnterMultipleRequestNamesInSearchField(requestNameSearchArray);
        When.onTheProcessResourceRequestPage.iEnterMultipleProjectRolesInSearchField(projectRoleArray);
        When.onTheProcessResourceRequestPage.iEnterMultipleRequestStatusInSearchField(requestStatusArray);
        browser.sleep(1000);
        // Reach Go button
        tab.perform();
        tab.perform();
        tab.perform();
        tab.perform();
    });

    it("should click on Go Button", async function () {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement('020_Filter Resource Request list page');
            });
        }
        enter.perform();
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("navigate back to list page and remove filter", async function () {
        When.onTheProcessResourceRequestPage.iResetRequestNameFilter();
        When.onTheProcessResourceRequestPage.iResetProjectRoleFilter();
        When.onTheProcessResourceRequestPage.iUnselectRequestStatus("Open");
        When.onTheProcessResourceRequestPage.iEnterMultipleProjectsInSearchField(['S4PROJ_RM1_146']);
        processResourceRequestListReport.goButton.click();
    });

    it("Click on first Resource Request", async function () {
        When.onTheProcessResourceRequestPage.iClickOnExportArrowDownButton();
        tab.perform();
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement('030_Request Details');
            });
        }
        enter.perform();
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("should load Matching Candiadtes", async function () {
        var item = processResourceRequestObjectPage.Display.matchingResourcesSection;
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement('035_Load Matching Candidates');
            });
        }
        item.click();
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("should navigate and come back", async function () {
        FLP.header.backButton.click();
        When.onTheProcessResourceRequestPage.iClickTheFirstRow();
    });

    it("should unpick the Resource Request", async function () {
        When.onTheProcessResourceRequestPage.iSetMyResponsibilityForTheResourceRequest("No","No");
    });

    it("should pick the Resource Request", function () {
        When.onTheProcessResourceRequestPage.iEnterMyResponsibilityForTheResourceRequest("Yes","Yes");
        browser.sleep(2000);
        tab.perform();
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement('040_Pick The Resource Request');
            });
        }
        enter.perform();
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("navigate back to list page and remove filter", async function () {
        FLP.header.backButton.click();
        When.onTheProcessResourceRequestPage.iClickonFilterExpandButton();
        When.onTheProcessResourceRequestPage.iResetProjectFilter();
    });


    it("Open Not Staffed Resource Request", async function () {
        const staffingStatusArray = [Constants.staffStatus.notStaffed];
        const requestStatusArray = Constants.requestStatusAsOpenArray;
        When.onTheProcessResourceRequestPage.iEnterMultipleStaffingStatusInSearchField(staffingStatusArray);
        When.onTheProcessResourceRequestPage.iEnterMultipleRequestStatusInSearchField(requestStatusArray);
        processResourceRequestListReport.goButton.click();
        await When.onTheProcessResourceRequestPage.iClickTheFirstRow();
    });

    it("should click on the Forward button", async function () {
        await When.onTheProcessResourceRequestPage.iClickTheForwardButton();
    });

    it("should forward Resource Request", async function () {
        // Get the value of current resource org so that we don't forward it to the same as part of this step
        const selectedResourceOrg = await processResourceRequestObjectPage.Display.ForwardDialog.ProcessingResourceOrgId.asControl().getProperty("value");
        const resOrg = selectedResourceOrg.substring(selectedResourceOrg.length - 4);
        processResourceRequestObjectPage.Display.ForwardDialog.ProcessingResourceOrgValueHelp.click();
        if (resOrg == Constants.resourceOrgCode1) {
            When.onTheProcessResourceRequestPage.iForwardToDifferentResourceOrg(Constants.resourceOrgCode2);
        } else {
            When.onTheProcessResourceRequestPage.iForwardToDifferentResourceOrg(Constants.resourceOrgCode1);
        }
        browser.sleep(2000);
        tab.perform();
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement('050_Forward The Resource Request');
            });
        }
        enter.perform();
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("should navigate back to list page and remove filter", async function () {
        FLP.header.backButton.click();
        When.onTheProcessResourceRequestPage.iUnselectRequestStatus("Open");
        When.onTheProcessResourceRequestPage.iUnselectStaffingStatus(Constants.staffStatus.notStaffed,0);
    });

    it("should filter project to resolve", async function () {
        const projectArray = [Constants.resolvedProject];
        const staffingStatusArray = [Constants.staffStatus.notStaffed, Constants.staffStatus.partiallyStaffed, Constants.staffStatus.fullyStaffed];
        const requestStatusArray = Constants.requestStatusAsOpenArray;
        When.onTheProcessResourceRequestPage.iEnterMultipleProjectsInSearchField(projectArray);
        When.onTheProcessResourceRequestPage.iEnterMultipleStaffingStatusInSearchField(staffingStatusArray);
        When.onTheProcessResourceRequestPage.iEnterMultipleRequestStatusInSearchField(requestStatusArray);
        processResourceRequestListReport.goButton.click();
        processResourceRequestListReport.visibleRowsInTable.get(0).click();
    });

    it("should resolve Resource Request", async function () {

        When.onTheProcessResourceRequestPage.iResolveTheResourceRequest();
        browser.sleep(2000);
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement('060_Resolve the Resource Request');
            });
        }
        enter.perform();
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("should go to shell home", async function () {
        FLP.header.backButton.click();
        FLP.header.backButton.click();
    });

}

module.exports = { executeTest };
