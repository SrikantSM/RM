sap.ui.define([
    'sap/ui/test/Opa5',
    'myAssignmentsUi/test/integration/MainJourney',
    'myAssignmentsUi/test/unit/AllTests'
], function (Opa5) {
    'use strict';

    Opa5.extendConfig({
        viewNamespace: 'myAssignmentsUi',
        timeout: 60,
        autoWait: true
    });

});
