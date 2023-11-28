sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
    "use strict";

    var Journey = {
        run: function () {
            QUnit.module('Attachment Data on Edit Mode');

            opaTest('In edit mode, I can see the Attachment section', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                When.onTheObjectPage.iGoToSection("EditableHeaderSection");
                // Assertions
                Then.onTheObjectPage.iShouldSeeAttachmentSectionOnEditMode()
                    .and.iShouldSeeTheElementTypeWithProperty('sap.ui.core.Title', { text: 'Resume' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Text', { text: '' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.ui.unified.FileUploader', { name: 'FEV4FileUpload' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.ObjectStatus', { text: 'Upload a DOCX or PDF file of up to 2 MB.' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.ObjectStatus', { text: 'This document will be used across applications in resource management. Please be aware of your responsibilities in uploading the document, and ensure that information in the document complies with the data protection and privacy regulations of your organization.' })
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
