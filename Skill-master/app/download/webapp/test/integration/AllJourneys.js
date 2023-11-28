sap.ui.define([
  "sap/ui/test/Opa5",
  "skill-download/test/integration/pages/DownloadPage",
  "skill-download/test/integration/MainJourney"
], function (Opa5) {
  "use strict";

  Opa5.extendConfig({
    viewNamespace: "skill-download",
    //timeout: 30,
    autoWait: true
  });
});
