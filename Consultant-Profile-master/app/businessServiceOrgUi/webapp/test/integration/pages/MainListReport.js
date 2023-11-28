sap.ui.define(["sap/fe/test/ListReport",  "sap/ui/test/OpaBuilder", 'sap/ui/test/actions/Press', "sap/ui/test/Opa5"], function (ListReport, OpaBuilder, Press, Opa5) {
    "use strict";

    var LISTREPORT_PREFIX_ID = "businessServiceOrgUi::OrganizationListReport--";
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
            },

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

            // Search in value help
            iSearchInValueHelp: function (sId, sText) {
                return this.waitFor({
                    id: LISTREPORT_PREFIX_ID + "fe::FilterBar::BSODetails::FilterFieldValueHelp::" + sId + "-search-inner",
                    actions: function (oSearch) {
                        oSearch.fireSearch({ query: sText });
                    },
                    error: function () {
                        Opa5.stopQueue();
                    },
                    errorMessage: 'Error in searching the text'
                });
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

            iShouldSeeCorrectSelectionMode: function (sMode) {
                var sId = LISTREPORT_PREFIX_ID + "fe::table::BSODetails::LineItem";
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

            iShouldSeeTheTableActionToolbar: function (sTitle, sAction1) {
                return this.waitFor({
                    id: LISTREPORT_PREFIX_ID + 'fe::table::BSODetails::LineItem-toolbar',
                    timeout: 200,
                    success: function (oActionToolbar) {
                        var sTableTitle = oActionToolbar.getTitleControl().getText();
                        var sUploadAction = oActionToolbar.getActions()[0].getText();
                        Opa5.assert.equal(sTableTitle, sTitle, "Title of table is" + sTitle);
                        Opa5.assert.equal(sUploadAction, sAction1, "Upload action is available on table");
                    },
                    errorMessage: 'Can\'t see ' + LISTREPORT_PREFIX_ID + 'fe::table::BSODetails::LineItem-toolbar'
                });
            },
            theColumnHasWidth: function (sColumnId,iColumnWidth) {
                this.waitFor({
                    id: LISTREPORT_PREFIX_ID + "fe::table::BSODetails::LineItem::C::" + sColumnId,
                    success: function (oColumn) {
                        Opa5.assert.strictEqual(oColumn.getWidth(), iColumnWidth);
                    }
                });
            },
            // See correct users in the value help
            iShouldSeeCorrectUsersInValueHelp: function (sId, iRows, iColumns) {
                return this.waitFor({
                    id: LISTREPORT_PREFIX_ID + "fe::FilterBar::BSODetails::FilterFieldValueHelp::" + sId + "::Table-innerTable",
                    success: function (oTable) {
                        var rows = oTable.getItems().length;
                        var columns = oTable.getColumns().length;
                        if (rows === iRows && columns === iColumns) {
                            Opa5.assert.ok(true, "Value help table displayed has correct number of rows and columns");
                        } else {
                            Opa5.assert.ok(false, "Value help table displayed does not have correct number of rows and columns");
                        }
                    },
                    errorMessage: 'Can\'t see ' + LISTREPORT_PREFIX_ID + sId
                });
            }
        }
    };

    return new ListReport(
        {
            appId: "businessServiceOrgUi", // MANDATORY: Compare sap.app.id in manifest.json
            componentId: "OrganizationListReport", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
            entitySet: "BSODetails" // MANDATORY: Compare entityset in manifest.json
        },
        AdditionalCustomListReportDefinition
    );
});
