sap.ui.define([
    'sap/ui/test/Opa5',
    'availabilityDownload/test/integration/pages/DownloadPage',
    'availabilityDownload/test/integration/AvailabilityDownloadMainJourney',
    'availabilityDownload/test/unit/AllTests'
], function (Opa5) {
    'use strict';

    Opa5.extendConfig({
        viewNamespace: 'availabilityDownload',
        timeout: 60,
        autoWait: true
    });
});
