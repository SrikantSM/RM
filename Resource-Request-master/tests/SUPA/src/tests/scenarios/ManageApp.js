// eslint-disable-next-line no-unused-vars
const ResourceRequestPages = require("../../../../end-to-end/pages/resourceRequestPages");
const resourceRequestListReport = require('../../../../end-to-end/pages/locators/resourceRequestListReport');
const resourceRequestObjectPage = require('../../../../end-to-end/pages/locators/resourceRequestObjectPage');
const FLP = require("../../../../end-to-end/pages/FLP");
const { Constants } = require("../../data/Constants");

function executeTest(iteration, supaHelper) {
    let project, resourceRequestDetails, tab, shiftTab, enter, save;
    it("Manage Resource Request tile should appear", function () {
        expect(FLP.tiles.manageResourceRequest.isPresent()).toBe(true);
        expect(FLP.tiles.processeResourceRequest.isPresent()).toBe(false);
    });

    it("should set data", async function() {
        project = `S4PROJ_RM${iteration}_145`;
        resourceRequestDetails = Constants.resourceRequestDetails;
        enter = browser.actions().sendKeys(protractor.Key.ENTER);
        tab = browser.actions().sendKeys(protractor.Key.TAB);
        shiftTab = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.SHIFT,protractor.Key.TAB));
        save = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "s"));
    });

    it("should click on the Manage Resource Request App", function () {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement('010_Open Manage Resource Request App');
            });
        }
        enter.perform();
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("should navigate to the Manage Resource Request App", async function () {
        await Then.onTheResourceRequestPage.theListReportTableShouldBePresent();
    });

    it("should Filter on Request Names and 2 Roles", async function () {
        const requestNameSearchArray = Constants.requestNameSearchArray;
        const projectRoleArray = Constants.projectRoleSearchArray;
        // Enter 3 wild character request names and 2 Roles
        When.onTheResourceRequestPage.iEnterMultipleRequestNamesInSearchField(requestNameSearchArray);
        When.onTheResourceRequestPage.iEnterMultipleProjectRolesInSearchField(projectRoleArray);
        browser.sleep(1000);
        // Reach Go Button
        tab.perform();
        tab.perform();
        tab.perform();
        tab.perform();
    });

    it("should click on Go Button", function () {
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

    it("should reset filter", async function () {
        When.onTheResourceRequestPage.iResetRequestNameFilter();
        When.onTheResourceRequestPage.iResetProjectRoleFilter();
    });

    it("should filter project created in Prerequisite", async function () {
        When.onTheResourceRequestPage.iSearchForProject(project);
    });

    it("click on Resource Request", function () {
        When.onTheResourceRequestPage.iClickOnCheckboxOfFirstLineItem();
        tab.perform();
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement('030_Select Resource Request');
            });
        }
        enter.perform();
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("should navigate to the Manage Resource Request App - Object Page", async function() {
        await Then.onTheResourceRequestPage.theObjectPageShouldBePresent();
    });

    it("click on Edit button", async function () {
        When.onTheResourceRequestPage.iClickTheEditButton();
    });

    it("should update Project Role", async function () {
        When.onTheResourceRequestPage.iEnterTheResourceRequestDetails(
            resourceRequestDetails
        );
    });

    it("should add 1 skills", async function () {
        const skillName = Constants.skillName;
        await When.onTheResourceRequestPage.iAddAMandatorySkill(skillName);
    });

    it("should click on Save button", async function () {
        resourceRequestObjectPage.Edit.AnchorBar.ProjectInformationAnchorButton.click(); //to de-focus after entering in Input box
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement('040_Enrich Resource Request and Save');
            });
        }
        save.perform();
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("tab to Publish Button", async function () {
        browser.sleep(5000);
        tab.perform();
    });

    it("should click on Publish button", function () {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement('050_Publish The Resource Request');
            });
        }
        enter.perform();
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("tab to Withraw Button", async function () {
        browser.sleep(2000);
        shiftTab.perform();
        shiftTab.perform();
    });

    it("should click on Withdraw button", function () {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement('060_Withdraw The Resource Request');
            });
        }
        enter.perform();
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("should go to list page and reset filter", async function () {
        FLP.header.backButton.click();
        When.onTheResourceRequestPage.iResetProjectFilter();
    });

    it("should filter fully and partially staffed Resource Request", async function () {
        const staffStatusArray = [Constants.staffStatus.fullyStaffed, Constants.staffStatus.partiallyStaffed];
        When.onTheResourceRequestPage.iEnterMultipleStaffStatus(staffStatusArray);
        resourceRequestListReport.goButton.click();
    });

    it('should see the filtered Resource Requests', async function () {
        await Then.onTheResourceRequestPage.theTableRowsExists();
    });

    it("Tab to Resource request", function () {
        When.onTheResourceRequestPage.iClickOnCheckboxOfFirstLineItem();
        tab.perform();
    });

    it("should click on Staffed Resource Request", function () {
        // Measurement
        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement('070_Open Staffed Resource Request');
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
