sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
    "use strict";

    var Journey = {
        run: function () {
            QUnit.module('Consultant Profile Attachment');

            opaTest('On object page I can navigate to Attachment section', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.iGoToSection('Attachment');
                // Assertions
                Then.onTheObjectPage.iShouldSeeTheElementTypeWithProperty('sap.ui.core.Title', { text: 'Resume' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Text', { text: '' });
            });
        }
    };
    return Journey;
});
