sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/opaQunit',
    'sap/ui/thirdparty/sinon'
], function (Opa5, opaTest, sinon) {
    'use strict';

    QUnit.module('Availability Upload');

    opaTest("On opening the app, I should see a form to upload csv file", function (Given, When, Then) {
        var sPath = sap.ui.require.toUrl('availabilityUpload/app');
        Given.iStartMyAppInAFrame(sPath + '.html?serverDelay=0&responderOn=true&demoApp=availabilityUpload&sap-ui-language=en_US#availabilityUpload-Upload');
        When.onTheUploadPage.iLookAtTheScreen();
        Then.onTheUploadPage.iShouldSeeTheElementTypeWithProperty("sap.ushell.ui.shell.ShellAppTitle", { text: "Upload Availability Data" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Title", { text: "Upload Availability Data" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "File" })
            .and.iShouldSeeTheElementWithId("fileUploader")
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Cost Center" })
            .and.iShouldSeeTheElementWithId("costCenterInput")
            .and.iShouldSeeTheElementWithId("uploadButton")
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Upload Availability Data CSV File" });
    });

    opaTest("On click of upload availability data csv button without any file input, I should see an error message", function (Given, When, Then) {
        When.onTheUploadPage.iClickOnTheElementWithId("uploadButton");
        Then.onTheUploadPage.iShouldSeeTheElementTypeWithProperty("sap.m.MessageStrip", { text: "Select a file." });
    });

    opaTest("On click of upload availability data csv button without any cost center input, I should see an error message", function (Given, When, Then) {
        Given.onTheUploadPage.iSelectAFile("fileUploader", "Availability_Data.csv");
        When.onTheUploadPage.iClickOnTheElementWithId("uploadButton");
        Then.onTheUploadPage.iShouldSeeTheElementTypeWithProperty("sap.m.MessageStrip", { text: "Enter a cost center." });
    });

    opaTest("On click of upload availability data csv button with invalid cost center input, I should see an error message", function (Given, When, Then) {
        Given.onTheUploadPage.iSelectAFile("fileUploader", "Availability_Data.csv");
        When.onTheUploadPage.iTypeTextIntoTheElement("costCenterInput", "CCCC");
        When.onTheUploadPage.iClickOnTheElementWithId("uploadButton");
        Then.onTheUploadPage.iShouldSeeTheElementTypeWithProperty("sap.m.MessageStrip", { text: "Enter a valid cost center." });
    });

    opaTest("On upload of file of exceeded size, I should see an error message", function (Given, When, Then) {
        When.onTheUploadPage.iSelectALargeFile("fileUploader");
        Then.onTheUploadPage.iShouldSeeTheElementTypeWithProperty("sap.m.MessageStrip", { text: "Maximum file upload size exceeded. Maximum allowed file size is 2 MB." });
    });

    opaTest('On completion of upload, I should see a success message', function (Given, When, Then) {
        When.onTheUploadPage.iUploadAFile("fileUploader", 200);
        When.onTheUploadPage.iTypeTextIntoTheElement("costCenterInput", "CCDE");
        Then.onTheUploadPage.iShouldSeeFileUploadStatusMessage("Success", "uploadMessageStrip", "0 availability data entries processed: 0 created, 0 failed.");
    });

    opaTest('On not providing a file in file uploader section and providing only cost center and clicking upload button, I should see an error message', function (Given, When, Then) {
        When.onTheUploadPage.iSelectAFile("fileUploader", "");
        When.onTheUploadPage.iTypeTextIntoTheElement("costCenterInput", "CCDE");
        When.onTheUploadPage.iClickOnTheElementWithId("uploadButton");
        Then.onTheUploadPage.iShouldSeeFileUploadStatusMessage("Error", "uploadMessageStrip", "Select a file.");
    });

    opaTest('On not providing cost center in cost center field and clicking upload button, I should see an error message', function (Given, When, Then) {
        When.onTheUploadPage.iSelectAFile("fileUploader", "Availability_Data.csv");
        When.onTheUploadPage.iTypeTextIntoTheElement("costCenterInput", "");
        When.onTheUploadPage.iClickOnTheElementWithId("uploadButton");
        Then.onTheUploadPage.iShouldSeeFileUploadStatusMessage("Error", "uploadMessageStrip", "Enter a cost center.");
    });

    opaTest("On upload of csv file with missing mandatory fields in one of the records, I should see a warning message", function (Given, When, Then) {
        When.onTheUploadPage.iUploadAFileWithMissingMandatoryFields("fileUploader");
        Then.onTheUploadPage.iShouldSeeFileUploadStatusMessage("Warning", "uploadMessageStrip", "18 availability data entries processed: 17 created, 1 failed.");
    });

    opaTest("On upload of csv with missing columns, I should see an error message", function (Given, When, Then) {
        When.onTheUploadPage.iUploadAFileWithMissingColumns("fileUploader");
        Then.onTheUploadPage.iShouldSeeFileUploadStatusMessage("Error", "uploadMessageStrip", "The CSV file is missing the following columns: resourceId.");
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
