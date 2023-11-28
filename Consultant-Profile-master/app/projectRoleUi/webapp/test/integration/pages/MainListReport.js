sap.ui.define(["sap/fe/test/ListReport", "sap/ui/test/OpaBuilder", "sap/ui/test/Opa5"], function (ListReport, OpaBuilder, Opa5) {
    "use strict";

    var LISTREPORT_PREFIX_ID = "projectRoleUi::ProjectRoleListReport--";

    // OPTIONAL
    var AdditionalCustomListReportDefinition = {
        actions: {
            iClickOnTheElementTypeWithProperty: function (sControlType, mProperties){
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

            // Check the table selection mode
            iShouldSeeCorrectSelectionMode: function (sMode) {
                var sId = LISTREPORT_PREFIX_ID + "fe::table::Roles::LineItem";
                return this.waitFor({
                    id: sId,
                    success: function (oTable) {
                        var selectionMode = oTable.getSelectionMode();
                        if (selectionMode === sMode){
                            Opa5.assert.ok(true, "Table Selection mode found is same as the expected mode");
                        } else {
                            Opa5.assert.ok(false, "Table Selection mode found is not same as the expected mode");
                        }
                    },
                    errorMessage: 'Can\'t see ' + LISTREPORT_PREFIX_ID + sId
                });
            },

            iShouldSeeTheTableActionToolbar: function (sTitle) {
                var sId = 'fe::table::Roles::LineItem-toolbar';
                return this.waitFor({
                    id: LISTREPORT_PREFIX_ID + sId,
                    timeout: 70,
                    success: function (oActionToolbar) {
                        var sTableTitle = oActionToolbar.getTitleControl().getText();
                        Opa5.assert.equal(sTableTitle, sTitle, "Title of table is" + sTitle);
                    },
                    errorMessage: 'Can\'t see ' + LISTREPORT_PREFIX_ID + sId
                });
            },

            iShouldSeeTheDraftLink: function () {
                this.iShouldSeeTheElementTypeWithProperty("sap.m.ObjectMarker", { type: 'Draft' }, true);
            }
        }
    };

    return new ListReport(
        {
            appId: "projectRoleUi", // MANDATORY: Compare sap.app.id in manifest.json
            componentId: "ProjectRoleListReport", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
            entitySet: "Roles" // MANDATORY: Compare entityset in manifest.json
        },
        AdditionalCustomListReportDefinition
    );
});
