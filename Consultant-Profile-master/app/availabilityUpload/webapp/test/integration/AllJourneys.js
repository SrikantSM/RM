sap.ui.define([
    'sap/ui/test/Opa5',
    'availabilityUpload/test/integration/pages/UploadPage',
    'availabilityUpload/test/integration/AvailabilityUploadMainJourney',
    'availabilityUpload/test/unit/AllTests'
], function (Opa5, Common) {
    'use strict';

    Opa5.extendConfig({
        viewNamespace: 'availabilityUpload',
        timeout: 60,
        autoWait: true
    });
});
