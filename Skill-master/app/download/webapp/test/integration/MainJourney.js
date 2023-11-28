sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/opaQunit",
  "sap/ui/thirdparty/sinon"
], function (Opa5, opaTest, sinon) {
  "use strict";

  QUnit.module("FileDownloader");

  opaTest("Open App (When I load the App a form to download the skills is shown)", function (Given, When, Then) {
    var sPath = sap.ui.require.toUrl("skill-download/app");
    Given.iStartMyAppInAFrame(sPath + ".html?serverDelay=0&responderOn=true&demoApp=skill&sap-ui-language=en_US#Skill-Download");
    Then.onTheDownloadPage.iShouldSeeTheElement("filedownloadform");
  });

  opaTest("Should see error message from form validation", function (Given, When, Then) {
    When.onTheDownloadPage.iClickOnElement("downloadButton");
    Then.onTheDownloadPage.iShouldSeeFileDownloadErrorMessage("downloadMessageStrip", "Please enter a language.");
  });

  opaTest("Should see success message", function (Given, When, Then) {
    Given.onTheDownloadPage.iTypeLettersIntoLanguageInput("languageInput", "en");
    When.onTheDownloadPage.iClickOnElement("downloadButton");
    Then.onTheDownloadPage.iShouldSeeFileDownloadSuccessMessage("downloadMessageStrip");
  });

  opaTest("Teardown", function (Given, When, Then) {
    When.iTeardownMyAppFrame();
    Then.waitFor({
      success: function () {
        Opa5.assert.ok(true, "teardown successful");
      }
    });
  });
});
