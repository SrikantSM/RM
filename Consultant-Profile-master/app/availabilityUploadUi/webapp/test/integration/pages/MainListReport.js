sap.ui.define(["sap/fe/test/ListReport",  "sap/ui/test/OpaBuilder", 'sap/ui/test/actions/Press', "sap/ui/test/Opa5"], function (ListReport, OpaBuilder, Press, Opa5) {
    "use strict";

    var LISTREPORT_PREFIX_ID = 'availabilityUploadUi::AvailabilityUploadListReport--';

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
                    id: LISTREPORT_PREFIX_ID + "fe::FilterBar::AvailabilityUploadData::FilterFieldValueHelp::" + sId + "-search-inner",
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
                var sId = LISTREPORT_PREFIX_ID + "fe::table::AvailabilityUploadData::LineItem";
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

            iShouldSeeTheTableActionToolbar: function (sTitle, sAction1, sAction2) {
                return this.waitFor({
                    id: LISTREPORT_PREFIX_ID + 'fe::table::AvailabilityUploadData::LineItem-toolbar',
                    timeout: 70,
                    success: function (oActionToolbar) {
                        var sTableTitle = oActionToolbar.getTitleControl().getText();
                        var sDownloadAction = oActionToolbar.getActions()[0].getText();
                        var sUploadAction = oActionToolbar.getActions()[1].getText();
                        Opa5.assert.equal(sTableTitle, sTitle, "Title of table is" + sTitle);
                        Opa5.assert.equal(sDownloadAction, sAction1, "Download action is available on table");
                        Opa5.assert.equal(sUploadAction, sAction2, "Upload action is available on table");
                    },
                    errorMessage: 'Can\'t see ' + LISTREPORT_PREFIX_ID + 'fe::table::AvailabilityUploadData::LineItem-toolbar'
                });
            },

            // See correct users in the value help
            iShouldSeeCorrectUsersInValueHelp: function (sId, iRows, iColumns) {
                return this.waitFor({
                    id: LISTREPORT_PREFIX_ID + "fe::FilterBar::AvailabilityUploadData::FilterFieldValueHelp::" + sId + "::Table",
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
            appId: "availabilityUploadUi", // MANDATORY: Compare sap.app.id in manifest.json
            componentId: "AvailabilityUploadListReport", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
            entitySet: "AvailabilityUploadData" // MANDATORY: Compare entityset in manifest.json
        },
        AdditionalCustomListReportDefinition
    );
});
