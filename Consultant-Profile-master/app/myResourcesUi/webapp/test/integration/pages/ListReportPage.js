sap.ui.define(["sap/fe/test/ListReport", "sap/ui/test/OpaBuilder", 'sap/ui/test/actions/Press', "sap/ui/test/Opa5", 'sap/ui/test/matchers/Properties'], function (ListReport, OpaBuilder, Press, Opa5, Properties) {
    "use strict";

    // OPTIONAL
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

            iExecuteShowDetails: function () {
                return this.waitFor({
                    controlType: 'sap.m.SegmentedButton',
                    properties: { enabled: true },
                    success: function (oButton) {
                        var aItems = oButton[0].getItems();
                        oButton[0].setSelectedItem(aItems[0]);
                        aItems[0].firePress();
                        Opa5.assert.ok(true, 'show details button pressed successfully');
                    },
                    error: function () {
                        Opa5.stopQueue();
                    },
                    errorMessage: 'Error when show details button pressed'
                });
            },

            iClickOnTheElementTypeWithProperty: function (sControlType, mProperties) {
                return OpaBuilder.create(this)
                    .hasType(sControlType)
                    .hasProperties(mProperties)
                    .doPress()
                    .success("Pressed" + sControlType + "with" + mProperties)
                    .execute();
            }
        },

        assertions: {
            iShouldSeeTheElementTypeWithProperty: function (sControlType, mProperties) {
                return OpaBuilder.create(this)
                    .hasType(sControlType)
                    .hasProperties(mProperties)
                    .success("Seeing " + sControlType + " has " + mProperties)
                    .execute();
            },

            iShouldSeeTheElementTypeWithPropertyonDialog: function (sControlType, mProperties) {
                return this.waitFor({
                    controlType: sControlType,
                    searchOpenDialogs: true,
                    matchers: new Properties(mProperties),
                    success: function () {
                        Opa5.assert.ok(true, 'Element Seen: ' + sControlType + JSON.stringify(mProperties));
                    },
                    errorMessage: 'Can\'t see ' + sControlType + JSON.stringify(mProperties)
                });
            }
        }
    };

    return new ListReport(
        {
            appId: "myResourcesUi", // MANDATORY: Compare sap.app.id in manifest.json
            componentId: "MyResourceListReport", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
            entitySet: "ProjectExperienceHeader" // MANDATORY: Compare entityset in manifest.json
        },
        AdditionalCustomListReportDefinition
    );
});
