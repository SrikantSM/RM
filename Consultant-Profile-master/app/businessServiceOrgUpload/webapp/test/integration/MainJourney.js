sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/opaQunit',
    'sap/ui/thirdparty/sinon'
], function (Opa5, opaTest, sinon) {
    'use strict';

    QUnit.module('Upload Service Organizations');

    opaTest("On opening the app, I should see a form to upload csv file", function(Given, When, Then) {
        var sPath = sap.ui.require.toUrl('businessServiceOrgUpload/app');
        Given.iStartMyAppInAFrame(sPath + '.html?serverDelay=0&responderOn=true&demoApp=businessServiceOrgUpload&sap-ui-language=en_US#businessServiceOrgUpload-Display');
        When.onTheUploadPage.iLookAtTheScreen();
        Then.onTheUploadPage.iShouldSeeTheElementTypeWithProperty("sap.ushell.ui.shell.ShellAppTitle", { text: "Upload Service Organizations" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Title", { text: "Upload Service Organizations" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.MessageStrip", { text: "Don't have a file yet? Create one using the following template." })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Link", { text: "Template" })
            .and.iShouldSeeTheElementWithId("fileUploader")
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "File" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Upload Service Organization CSV File" });
    });

    opaTest("On click of upload service org button without any file input, I should see an error message", function(Given, When, Then) {
        When.onTheUploadPage.iClickOnTheElementWithId("uploadButton");
        Then.onTheUploadPage.iShouldSeeTheElementTypeWithProperty("sap.m.MessageStrip", { text: "Select a file." });
    });

    opaTest("On upload of file of exceeded size, I should see an error message", function(Given, When, Then) {
        When.onTheUploadPage.iSelectALargeFile("fileUploader");
        Then.onTheUploadPage.iShouldSeeTheElementTypeWithProperty("sap.m.MessageStrip", { text: "Maximum file upload size exceeded. Maximum allowed file size is 2 MB." });
    });

    opaTest('Should call upload stub', function (Given, When, Then) {
        var uploadStub;

        Given.onTheUploadPage.iSelectAFile("fileUploader", "Service_Orgs.csv");
        Given.waitFor({
            id: /fileUploader/,
            success: function (aFileUploaders) {
                var model = aFileUploaders[0].getModel('ui');
                uploadStub = sinon.stub(aFileUploaders[0], 'upload', function () {
                    model.setProperty("/busy", false);
                });
            }
        });

        When.onTheUploadPage.iClickOnTheElementWithId("uploadButton");

        Then.waitFor({
            success: function () {
                Opa5.assert.strictEqual(uploadStub.callCount, 1, "upload was called ");
                uploadStub.restore();
            }
        });
    });

    opaTest('On completion of upload, I should see a success message', function (Given, When, Then) {
        When.onTheUploadPage.iUploadAFile("fileUploader", 200);
        Then.onTheUploadPage.iShouldSeeFileUploadSuccessMessage("uploadMessageStrip", "1 records processed: 1 service organizations created or updated");
    });

    opaTest("On upload of csv file with invalid cost center, I should see a warning message", function (Given, When, Then) {
        When.onTheUploadPage.iUploadAFileWithInvalidCostCenter("fileUploader");
        Then.onTheUploadPage.iShouldSeeFileUploadWarningMessage("uploadMessageStrip", "1 records processed: 0 service organizations created or updated");
    });

    opaTest("On click of More Information link, I should see Errors during Upload dialog", function (Given, When, Then) {
        When.onTheUploadPage.iClickOnTheElementTypeWithProperty("sap.m.Link", { text: "More Information" });
        Then.onTheUploadPage.iShouldSeeTheElementTypeWithProperty("sap.m.Dialog", { title: "Errors During Upload" });
    });

    opaTest("On upload of csv with missing columns, I should see an error message", function (Given, When, Then) {
        When.onTheUploadPage.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Close" })
            .and.iUploadAFileWithMissingColumns("fileUploader");
        Then.onTheUploadPage.iShouldSeeFileUploadErrorMessage("uploadMessageStrip","An unknown error occurred during upload.");
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
