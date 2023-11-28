sap.ui.define([
  "sap/ui/test/Opa5",
  "skill-upload/test/integration/pages/UploadPage",
  "skill-upload/test/integration/MainJourney"
], function (Opa5) {
  "use strict";

  Opa5.extendConfig({
    viewNamespace: "skill-upload",
    //timeout: 30,
    autoWait: true
  });
});
