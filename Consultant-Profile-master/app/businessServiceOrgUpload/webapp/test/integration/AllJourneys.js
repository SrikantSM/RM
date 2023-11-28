sap.ui.define([
    'sap/ui/test/Opa5',
    'businessServiceOrgUpload/test/integration/pages/UploadPage',
    'businessServiceOrgUpload/test/integration/MainJourney',
    'businessServiceOrgUpload/test/unit/AllTests'
], function (Opa5) {
    'use strict';

    Opa5.extendConfig({
        viewNamespace: 'businessServiceOrgUpload',
        timeout: 60,
        autoWait: true
    });
});
