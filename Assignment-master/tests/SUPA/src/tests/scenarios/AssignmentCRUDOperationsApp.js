require("../../../../pages/flpPage.js");
require("../../../../pages/page.js");
require("../../../../pages/tablePage.js");
require("../../../../pages/persoDialogPage.js");
require("../../../../pages/headerPage.js");
require("../../../../pages/filterPage.js");
const locators = require("../../../../locators/tableLocators");
const pageLocators = require("../../../../locators/pageLocators");

function executeTest(supaHelper) {
    it("should set data", async function () {
        enter = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.ENTER));
        tab = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.TAB));
        shiftTab = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.TAB));
        right = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.ARROW_RIGHT));
        left = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.ARROW_LEFT));
        up = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.ARROW_UP));
        down = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.ARROW_DOWN));
        backSpace = browser.actions().sendKeys(protractor.Key.chord(protractor.Key.BACK_SPACE));
        f4 = browser.actions().sendKeys(protractor.Key.F4);
        clickCC = browser.actions().sendKeys("D1");
    });

    it("Should click on Manage Resource Utilization App", function () {
        When.onTheFlpPage.iClickTileManageResourceUtilization();
    });

    it("Should navigate to Manage Resource Utilization App", function () {
        Then.onThePagePage.theAppIsVisible();
    });

    it("Should Change the View to  Weekly ", function () {
        When.onTheHeaderPage.selectView("Week");
    });

    it("Should sort by Resource Name in descending order", function () {

        When.onTheTablePage.openResourceNameColumnMenu();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement("011 Should sort by Resource Name in descending order");
            });
        }
        down.perform();
        enter.perform();
        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    //012 Click on the edit button
    it("Should click on the edit button", function () {
        // Measurement
        for (let i = 0; i < 4; i++) {
            shiftTab.perform();
        }

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement("012 Should click on the edit button");
            });
        }

        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });
    // 013 Should click on the Add button and row should expand
    it("Should click on the Add button and row should expand", function () {
        // Measurement
        tab.perform();
        down.perform();
        left.perform();
        enter.perform();

        for (let i = 0; i < 3; i++) {
            shiftTab.perform();
        }

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement("013 Should click on the Add button and row should expand");
            });
        }

        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    // // 014 Should Select a request in value help for requests
    it("Should Select a request in value help for requests", function () {

        let oRequestCell = locators.getRequestInputCellForSUPA("/rows/0/assignments/0");
        oRequestCell.sendKeys("ABC Resource Request");

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement("014 Should Select a request in value help for requests");
            });
        }

        When.onTheTablePage.selectActiveSuggestionForSUPA();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    // 015 Should click on the save button
    it("Should click on the save button after create", function () {

        tab.perform();
        up.perform();

        for (let i = 0; i < 10; i++) {
            shiftTab.perform();
        }

        for (let i = 0; i < 6; i++) {
            tab.perform();
        }

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement("015 Should click on the save button after create");
            });
        }

        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }

    });

    // // 014 Should click on delete button
    it("Should click on edit button again", function () {

        for (let i = 0; i < 17; i++) {
            tab.perform();
        }

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement("016 Should click on edit button again");
            });
        }

        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    // // 014 Should click on delete button
    it("Should click on select the assignment for deletion", function () {

        tab.perform();
        down.perform();
        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement("017 Should click on select the assignment for deletion");
            });
        }

        down.perform();
        left.perform();
        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    // // 014 Should click on delete button
    it("click delete button", function () {

        for (let i = 0; i < 5; i++) {
            shiftTab.perform();
        }

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement("018 click delete button");
            });
        }

        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    // 015 Should click on the save button
    it("Should click on the save button after delete", function () {

        for (let i = 0; i < 6; i++) {
            tab.perform();
        }

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement("019 Should click on the save button after delete");
            });
        }

        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }

    });

    it("Should Change the View to  Weekly ", function () {
        When.onTheHeaderPage.selectView("Week");
    });

    // // 014 Should click on delete button
    it("Should click on edit button again", function () {

        for (let i = 0; i < 7; i++) {
            tab.perform();
        }

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement("020 Should click on edit button again");
            });
        }

        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    // 012 Should select 2 assignments and click on delete button
    it("Should select 1st assignment for deletion", function () {
        // Measurement
        tab.perform();
        down.perform();
        down.perform();
        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement("021 Should select 1st assignment for deletion");
            });
        }

        down.perform();
        left.perform();
        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("Should click on delete button", function () {
        // Measurement
        for (let i = 0; i < 5; i++) {
            shiftTab.perform();
        }

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement("022 Should click on delete button");
            });
        }

        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("Should select the 2nd assignment for deletion", function () {
        // Measurement
        for (let i = 0; i < 4; i++) {
            tab.perform();
        }
        left.perform();
        down.perform();
        down.perform();
        down.perform();
        down.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement("023 Should select the 2nd assignment for deletion");
            });
        }

        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    // 013 Should click on the discard button
    it("Should click on the delete button", function () {
        // Measurement
        for (let i = 0; i < 6; i++) {
            shiftTab.perform();
        }

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement("024 Should click on the delete button");
            });
        }

        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("Should select the 1st assignment for discard", function () {
        // Measurement
        for (let i = 0; i < 4; i++) {
            tab.perform();
        }
        left.perform();
        down.perform();
        down.perform();
        down.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement("025 Should select the 1st assignment for discard");
            });
        }

        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    // 013 Should click on the discard button
    it("Should click on the discard button", function () {
        // Measurement
        for (let i = 0; i < 3; i++) {
            shiftTab.perform();
        }
        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement("026 Should click on the discard button");
            });
        }

        enter.perform();
        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    // 014 Should click on the cancel button
    it("Should click on the cancel button", function () {
        // Measurement
        for (let i = 0; i < 9; i++) {
            tab.perform();
        }

        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.startSupaMeasurement("027 Should click on the cancel button");
            });
        }

        enter.perform();
        enter.perform();

        if (supaHelper) {
            browser.controlFlow().execute(function () {
                supaHelper.stopSupaMeasurement();
            });
        }
    });

    it("should go to shell home", async function () {
        When.onTheFlpPage.iClickBack();
    });
}

module.exports = {
    executeTest
};