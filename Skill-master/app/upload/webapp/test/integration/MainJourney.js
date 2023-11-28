/*
 * Most OPA5 tests are currently deactivated since it is not clear how to test the UI
 * properly if the UI depends on a background job state entity. For further information,
 * see the linked issue below:
 * https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/631
 */
sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/opaQunit",
  "sap/ui/thirdparty/sinon"
], function (Opa5, opaTest, sinon) {
  "use strict";

  QUnit.module("UploadSkills");

  opaTest("Open App (When I load the App a form to specify a file is shown)", function (Given, When, Then) {
    var sPath = sap.ui.require.toUrl("skill-upload/app");
    Given.iStartMyAppInAFrame(sPath + ".html?serverDelay=0&responderOn=true&demoApp=skill&sap-ui-language=en_US#Skill-Upload");
    Given.onTheUploadPage.mockUploadJob({
      "state": "initial",
      "createdSkillsCount": 0,
      "updatedSkillsCount": 0,
      "failedSkillsCount": 0,
      "unprocessedSkillsCount": 0,
      "skillsTotalCount": 0,
      "jobOwner": "",
      "uploadErrors": []
    });
    Given.waitFor({
      id: "application-Skill-Upload-component---app",
      success: function (oView) {
        // 1001 due to OPA5 internals: _timeoutWaiter considers everything 10< x <=1000 as blocking, which fails the tests
        oView.getController().refreshInterval = 1001;
      }
    });
    Then.onTheUploadPage.iShouldSeeTheElement("fileuploadform");
  });

  opaTest("Should see error message if no file is selected", function (Given, When, Then) {
    When.onTheUploadPage.iClickOnElement("uploadButton");
    Then.onTheUploadPage.iShouldSeeFileUploadMessageStripWithMatchingRegExp("messageStripWithoutUploadJob", "Error", /Select a file/);
  });

  opaTest("Should see error message if file size exceeded", function (Given, When, Then) {
    When.onTheUploadPage.iSelectALargeFile("fileUploader");
    Then.onTheUploadPage.iShouldSeeFileUploadMessageStripWithMatchingRegExp("messageStripWithoutUploadJob", "Error", /Maximum file upload size exceeded/);
  });

  opaTest("Should see value help when typing in language input", function (Given, When, Then) {
    When.onTheUploadPage.iTypeLettersIntoLanguageInput("languageInput", "en");
    Then.onTheUploadPage.iShouldSeeAtLeastOneValueHelpEntry("languageInput-popup-list", "en", "English");
  });

  opaTest("Should see language code in language field", function (Given, When, Then) {
    When.onTheUploadPage.iSelectAFile("fileUploader", "small_skills_en.csv");
    Then.onTheUploadPage.iShouldSeeLanguage("languageInput", "en");
  });

  opaTest("Should see error message without upload job", function (Given, When, Then) {
    When.onTheUploadPage.iUploadAFileWithBadRequest("fileUploader", "error_in_response");
    Then.onTheUploadPage.iShouldSeeFileUploadMessageStripWithMatchingRegExp("messageStripWithoutUploadJob", "Error", /error_in_response/);
  });

  opaTest("Should call upload stub", function (Given, When, Then) {
    var uploadStub;

    Given.onTheUploadPage.iSelectAFile("fileUploader", "small_skills_en.csv");
    Given.waitFor({
      id: /fileUploader/,
      success: function (aFileUploaders) {
        var model = aFileUploaders[0].getModel("ui");
        uploadStub = sinon.stub(aFileUploaders[0], "upload", function () {
          model.setProperty("/busy", false);
        });
      }
    });

    When.onTheUploadPage.iClickOnElement("uploadButton");

    Then.waitFor({
      success: function () {
        Opa5.assert.strictEqual(uploadStub.callCount, 1, "upload was called ");
        uploadStub.restore();
      }
    });
  });

  opaTest("Should see an upload success message with an upload job", function (Given, When, Then) {
    Given.onTheUploadPage.mockUploadJob({
      "state": "success",
      "createdSkillsCount": 1,
      "updatedSkillsCount": 2,
      "failedSkillsCount": 0,
      "unprocessedSkillsCount": 0,
      "skillsTotalCount": 3,
      "jobOwner": "ConfigurationExpert",
      "uploadErrors": []
    });
    Then.onTheUploadPage.iShouldSeeFileUploadMessageStripWithMatchingRegExp("uploadMessageStripSuccess", "Success", /3 .* 1 .* 2/);
  });

  opaTest("Should see upload errors in message items with an upload job", function (Given, When, Then) {
    Given.onTheUploadPage.mockUploadJob({
      "state": "warning",
      "createdSkillsCount": 1,
      "updatedSkillsCount": 2,
      "failedSkillsCount": 3,
      "unprocessedSkillsCount": 0,
      "skillsTotalCount": 6,
      "jobOwner": "ConfigurationExpert",
      "uploadErrors": [
        {
          "count": 1,
          "errorMessage": "Skill Upload Error Message",
          "type": "2-parsing"
        },
        {
          "affectedEntity": "813b55a0-5fe2-11eb-9d9c-3733444fe9b4",
          "errorMessage": "Skill Save Error Message",
          "type": "3-save"
        },
        {
          "count": 1,
          "errorMessage": "Skill Catalog Error Message",
          "type": "4-missingCatalog"
        },
        {
          "affectedEntity": "813b55a0-5fe2-11eb-9d9c-3733444fe9b5",
          "errorMessage": "Skill General Error Message",
          "type": "1-general"
        }
      ]
    });
    Then.onTheUploadPage.iShouldSeeFileUploadMessageStripWithMatchingRegExp("uploadMessageStripWarning", "Warning", /6 .* 1 .* 2 .* 3/);
    When.onTheUploadPage.iClickOnElement("showDetailsWarningLink");
    Then.onTheUploadPage.iShouldSeeErrorInErrorDialog("Skill Catalog Error Message")
      .and.iShouldSeeErrorInErrorDialog("Skill Save Error Message")
      .and.iShouldSeeErrorInErrorDialog("Skill Upload Error Message")
      .and.iShouldSeeErrorInErrorDialog("Skill General Error Message");
  });

  opaTest("Should see a general upload error with an upload job", function (Given, When, Then) {
    Given.onTheUploadPage.mockUploadJob({
      "state": "error",
      "createdSkillsCount": 0,
      "updatedSkillsCount": 0,
      "failedSkillsCount": 0,
      "unprocessedSkillsCount": 0,
      "skillsTotalCount": 0,
      "jobOwner": "ConfigurationExpert",
      "uploadErrors": [
        {
          "affectedEntity": "813b55a0-5fe2-11eb-9d9c-3733444fe9b5",
          "errorMessage": "Skill General Error Message",
          "type": "1-general"
        }
      ]
    });
    When.onTheUploadPage.iClickOnClose();
    Then.onTheUploadPage.iShouldSeeFileUploadMessageStripWithMatchingRegExp("uploadMessageStripError", "Error", /Skill General Error Message/);
  });

  opaTest("Should see an error message strip if the upload is interrupted", function (Given, When, Then) {
    Given.onTheUploadPage.mockUploadJob({
      "state": "interrupted",
      "createdSkillsCount": 30,
      "updatedSkillsCount": 10,
      "failedSkillsCount": 20,
      "unprocessedSkillsCount": 40,
      "skillsTotalCount": 100,
      "jobOwner": "ConfigurationExpert",
      "uploadErrors": []
    });
    Then.onTheUploadPage.iShouldSeeFileUploadMessageStripWithMatchingRegExp("uploadMessageStripInterrupt", "Error", /60 .* 30 .* 10 .* 20 .* 40/);
  });

  opaTest("Should see a running message with an upload job", function (Given, When, Then) {
    Given.onTheUploadPage.mockUploadJob({
      "state": "running",
      "createdSkillsCount": 1,
      "updatedSkillsCount": 0,
      "failedSkillsCount": 0,
      "unprocessedSkillsCount": 1,
      "skillsTotalCount": 2,
      "jobOwner": "ConfigurationExpert",
      "uploadErrors": []
    });
    Then.onTheUploadPage.iShouldSeeFileUploadMessageStripWithMatchingRegExp("uploadMessageStripRunning", "Information", /1 .* 2/);
  });

  opaTest("Should see a last updated by message with an upload job", function (Given, When, Then) {
    Given.onTheUploadPage.mockUploadJob({
      "state": "success",
      "createdSkillsCount": 1,
      "updatedSkillsCount": 0,
      "failedSkillsCount": 0,
      "unprocessedSkillsCount": 0,
      "skillsTotalCount": 0,
      "jobOwner": "ConfigurationExpert2",
      "uploadErrors": []
    });
    Then.onTheUploadPage.iShouldSeeFileUploadMessageStripWithMatchingRegExp("uploadMessageStripLastUpdatedBy", "Information", /ConfigurationExpert2/);
  });

  opaTest("Should see a running by message with an upload job", function (Given, When, Then) {
    Given.onTheUploadPage.mockUploadJob({
      "state": "running",
      "createdSkillsCount": 0,
      "updatedSkillsCount": 0,
      "failedSkillsCount": 0,
      "unprocessedSkillsCount": 1,
      "skillsTotalCount": 1,
      "jobOwner": "ConfigurationExpert2",
      "uploadErrors": []
    });
    Then.onTheUploadPage.iShouldSeeFileUploadMessageStripWithMatchingRegExp("uploadMessageStripUploadRunningBy", "Warning", /ConfigurationExpert2/);
  });

  opaTest("Teardown", function (Given, When, Then) {
    Given.onTheUploadPage.mockUploadJob({
      "state": "initial",
      "createdSkillsCount": 0,
      "updatedSkillsCount": 0,
      "failedSkillsCount": 0,
      "unprocessedSkillsCount": 0,
      "skillsTotalCount": 0,
      "jobOwner": "",
      "uploadErrors": []
    });
    When.iTeardownMyAppFrame();
    Then.waitFor({
      success: function () {
        Opa5.assert.ok(true, "teardown successful");
      }
    });
  });
});
