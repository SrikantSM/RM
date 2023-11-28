sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/actions/Press',
    'sap/ui/test/matchers/Properties',
    'sap/fe/test/ListReport',
    'sap/ui/test/actions/EnterText'
], function (Opa5, Press, Properties, ListReport, EnterText) {


    const PREFIX_ID = 'manageResourceRequest::ResourceRequestListReport--';
    var AdditionalCustomListReportDefinition = {
        actions: {
            iClickOnTheElement: function (sId) {
                return this.waitFor({
                    id: sId,
                    actions: new Press(),
                    success: function () {
                        Opa5.assert.ok(true, "Element is clicked with Id: " + sId);
                    },
                    errorMessage: 'Cannot see ' + sId
                });
            },

            iSelectTheNthItem: function (iIndex) {
                return this.waitFor({
                    id: PREFIX_ID + 'fe::table::ResourceRequests::LineItem-innerTable',

                    actions: function (oTable) {

                        var sTargetId = oTable.getItems()[iIndex].getId();

                        return this.waitFor({
                            id: sTargetId,
                            actions: new Press(),
                            errorMessage: 'Can\'t see property' + sTargetId
                        });
                    }.bind(this),
                    errorMessage: 'Can\'t see table' + PREFIX_ID
                });
            },

            iClickOnTheGoButton: function () {
                return this.waitFor({
                    id: PREFIX_ID + "fe::FilterBar::ResourceRequests-btnSearch",
                    actions: new Press(),
                    success: function () {
                        Opa5.assert.ok(true, 'Go button clicked.');
                    },
                    errorMessage: 'Cannot see Go button'
                });
            },

            iEnterTextInInputField(sId, sText) {
                return this.waitFor({
                    id: sId,
                    actions: new EnterText({
                        text: sText
                    }),
                    success: function () {
                        Opa5.assert.ok(true, 'Text Entered');
                    },
                    errorMessage: 'Can\'t enter Text ' + sText
                });
            }
        },
        assertions: {
            iShouldSeeTheElementWithId: function (sId) {
                return this.waitFor({
                    id: sId,
                    success: function () {
                        Opa5.assert.ok(true, "Saw element with ID: " + sId);
                    },
                    errorMessage: 'Cannot see ' + sId
                });
            },

            iShouldSeeTheElement: function (sId) {
                return this.waitFor({
                    id: PREFIX_ID + sId,
                    success: function () {
                        Opa5.assert.ok(true, 'Element Seen:' + PREFIX_ID + sId);
                    },
                    errorMessage: 'Can\'t see ' + PREFIX_ID + sId
                });
            },

            iShouldSeeTheElementTypeWithProperty: function (sControlType, mProperties) {
                return this.waitFor({
                    controlType: sControlType,
                    matchers: new Properties(mProperties),
                    success: function (oControl) {
                        Opa5.assert.ok(true, 'Element Seen: ' + sControlType + JSON.stringify(mProperties));
                        if (sControlType === "sap.uxap.ObjectPageSubSection") {sap.ui.test.Opa.getContext().root = oControl;}
                    },
                    errorMessage: 'Can\'t see ' + sControlType + JSON.stringify(mProperties)
                });
            },

            iShouldSeeTheElementWithProperties: function (sId, mProperties) {
                return this.waitFor({
                    id: PREFIX_ID + sId,
                    matchers: new Properties(mProperties),
                    success: function () {
                        Opa5.assert.ok(true, 'Element Seen:' + PREFIX_ID + sId);
                    },
                    errorMessage: 'Can\'t see ' + PREFIX_ID + sId
                });
            }
        }
    };

    return new ListReport(
        {
            appId: "manageResourceRequest", // MANDATORY: Compare sap.app.id in manifest.json
            componentId: "ResourceRequestListReport", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
            entitySet: "ResourceRequests" // MANDATORY: Compare entityset in manifest.json
        },
        AdditionalCustomListReportDefinition
    );
});
