sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
    "use strict";

    var Journey = {
        run: function () {
            QUnit.module('Resource Attachment');

            opaTest('On object page I can navigate to Attachment section', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.iGoToSection('Attachment');
                // Assertions
                Then.onTheObjectPage.iShouldSeeTheElementTypeWithProperty('sap.ui.core.Title', { text: 'Resume' });
            });
            opaTest("#999: Tear down", function (Given, When, Then) {
                Given.iTearDownMyApp();
            });
        }
    };
    return Journey;
});
