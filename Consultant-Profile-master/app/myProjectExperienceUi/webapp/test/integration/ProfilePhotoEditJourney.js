sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
    "use strict";

    var Journey = {
        run: function () {
            QUnit.module('Profile Photo Data on Edit Mode');

            opaTest('In edit mode, I can see the profile photo section', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iGoToSection('Header');
                // Assertions
                Then.onTheObjectPage.iShouldSeeProfilePhotoSectionOnEditMode()
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Avatar', { initials: '' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.ui.unified.FileUploader', { name: 'FEV4FileUpload' })
                    .and.iShouldSeeDisabledButton();
                // Actions
                When.onTheObjectPage
                    .onFooter()
                    .iExecuteCancel();
                // Assertions
                Then.onTheObjectPage.onHeader().iCheckEdit({ visible: true, enabled: true, type: "Emphasized" });
            });
        }
    };
    return Journey;
});
