sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/opaQunit',
    'sap/ui/thirdparty/sinon'
], function (Opa5, opaTest, sinon) {
    'use strict';

    QUnit.module('Availability Download');

    opaTest("On opening the app, I should see a form to download the csv file", function (Given, When, Then) {
        var sPath = sap.ui.require.toUrl('availabilityDownload/app');
        Given.iStartMyAppInAFrame(sPath + '.html?serverDelay=0&responderOn=true&demoApp=availabilityDownload&sap-ui-language=en_US#availabilityUpload-Download');
        When.onTheDownloadPage.iLookAtTheScreen();
        Then.onTheDownloadPage.iShouldSeeTheElementTypeWithProperty("sap.ushell.ui.shell.ShellAppTitle", { text: "Download Template" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Title", { text: "Download Template" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Enter a cost center or workforce person." })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Cost Center" })
            .and.iShouldSeeTheElementWithId("costCenterInput")
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Workforce Person (External ID)" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Time Period" })
            .and.iShouldSeeTheElementWithId("datePick")
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Planned Working Hours Per Day" })
            .and.iShouldSeeTheElementWithId("plannedWorkingHoursInput")
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Planned Non-Working Hours Per Day" })
            .and.iShouldSeeTheElementWithId("plannedNonWorkingHoursInput")
            .and.iShouldSeeTheElementWithId("downloadButton")
            .and.iShouldSeeTheDefaultValues("plannedWorkingHoursInput", 8)
            .and.iShouldSeeTheDefaultValues("plannedNonWorkingHoursInput", 0);
    });

    opaTest("On select of Cost centre radio button and on click of download template button without providing cost centre, I should see an error message", function (Given, When, Then) {
        When.onTheDownloadPage.iClickOnTheElementWithId("downloadButton");
        Then.onTheDownloadPage.iShouldSeeTheElementTypeWithProperty("sap.m.MessageStrip", { text: "Enter a cost center or workforce person." });
    });

    opaTest("On select of workforce person ID radio button and on click of download template button without providing workforce person ID, I should see an error message", function (Given, When, Then) {
        When.onTheDownloadPage.iClickOnTheElementWithId("rbWorkforceID");
        When.onTheDownloadPage.iClickOnTheElementWithId("downloadButton");
        Then.onTheDownloadPage.iShouldSeeTheElementTypeWithProperty("sap.m.MessageStrip", { text: "Enter a cost center or workforce person." });
    });

    opaTest("On click of download template button with invalid costcenter, I should see an error message", function (Given, When, Then) {
        When.onTheDownloadPage.iClickOnTheElementWithId("rbCostCenter");
        When.onTheDownloadPage.iTypeTextIntoTheElement("costCenterInput", "CCCC");
        When.onTheDownloadPage.iClickOnTheElementWithId("downloadButton");
        Then.onTheDownloadPage.iShouldSeeTheElementTypeWithProperty("sap.m.MessageStrip", { text: "Enter a valid cost center." });
    });

    opaTest("On click of download template button with invalid workforce person, I should see an error message", function (Given, When, Then) {
        When.onTheDownloadPage.iClickOnTheElementWithId("rbWorkforceID");
        When.onTheDownloadPage.iTypeTextIntoTheElement("workforceIDInput", "CCCC");
        When.onTheDownloadPage.iClickOnTheElementWithId("downloadButton");
        Then.onTheDownloadPage.iShouldSeeTheElementTypeWithProperty("sap.m.MessageStrip", { text: "Enter a valid workforce person." });
    });

    opaTest("On click of download template button without providing time frame, I should see an error message", function (Given, When, Then) {
        When.onTheDownloadPage.iClickOnTheElementWithId("rbCostCenter");
        When.onTheDownloadPage.iSuggestTextIntoTheElement("costCenterInput", "CCDE");
        When.onTheDownloadPage.iClickOnTheElementWithId("downloadButton");
        Then.onTheDownloadPage.iShouldSeeTheElementTypeWithProperty("sap.m.MessageStrip", { text: "Select a time period." });
    });

    opaTest("On click of download template button after providing wrong format time frame, I should see an error message", function (Given, When, Then) {
        When.onTheDownloadPage.iTypeTextIntoTheElement("costCenterInput", "CCDE");
        When.onTheDownloadPage.iTypeTextIntoTheElement("datePick", "Jan 23, 2020 - 23/12/3030");
        When.onTheDownloadPage.iClickOnTheElementWithId("downloadButton");
        Then.onTheDownloadPage.iShouldSeeTheElementTypeWithProperty("sap.m.MessageStrip", { text: "Enter a valid time period." });
    });

    opaTest("On click of download template button after providing time frame with typo, I should see an error message", function (Given, When, Then) {
        When.onTheDownloadPage.iTypeTextIntoTheElement("costCenterInput", "CCDE");
        When.onTheDownloadPage.iTypeTextIntoTheElement("datePick", "Jan 23, 2020 - Jel 27, 2020");
        When.onTheDownloadPage.iClickOnTheElementWithId("downloadButton");
        Then.onTheDownloadPage.iShouldSeeTheElementTypeWithProperty("sap.m.MessageStrip", { text: "Enter a valid time period." });
    });

    opaTest('Teardown', function (Given, When, Then) {
        When.iTeardownMyAppFrame();
        Then.waitFor({
            success: function () {
                Opa5.assert.ok(true, "teardown successful");
            }
        });
    });

});
