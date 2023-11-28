sap.ui.define(["sap/fe/test/ListReport", "sap/ui/test/OpaBuilder",'sap/ui/test/matchers/Properties', "sap/ui/test/Opa5"], function (ListReport, OpaBuilder, Properties, Opa5) {
    "use strict";

    var LISTREPORT_PREFIX_ID = "replicationScheduleUi::ReplicationScheduleListReport--";

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

            // Select the radio button of iRow th Row
            iSelectTheRadioButton: function (iRow) {
                var sId = "fe::table::ReplicationSchedule::LineItem-innerTable";
                return this.waitFor({
                    id: LISTREPORT_PREFIX_ID + sId,
                    actions: function (oTable) {
                        oTable.getItems()[iRow].getSingleSelectControl().fireSelect({selected: true});
                    },
                    error: function() {
                        Opa5.stopQueue();
                    },
                    errorMessage: 'Can\'t see ' + LISTREPORT_PREFIX_ID + sId
                });
            },

            // Set the Date and time value in the date and time picker
            iSetValueInControlWithId: function (sId, sValue, bSearchOpenDialog){
                return this.waitFor({
                    searchOpenDialogs: bSearchOpenDialog,
                    id: sId,
                    actions: function(oControl){
                        oControl.setValue(sValue);
                    },
                    error: function(){
                        Opa5.stopQueue();
                    },
                    errorMessage: sId + ' not found'
                });
            },

            // Click on the deactivate button from a row
            iPressButtonInTheTableRow: function (iRow, sText) {
                var sId = "fe::table::ReplicationSchedule::LineItem-innerTable";
                return this.waitFor({
                    id: LISTREPORT_PREFIX_ID + sId,
                    actions: function (oTable) {
                        var oDeactivateButton = oTable.getItems()[iRow].getCells()[5].getItems()[0];
                        if (sText === 'Deactivate') {
                            oDeactivateButton.firePress();
                        } else {
                            Opa5.assert(false, "Button with text " + sText + " not found");
                        }
                    },
                    errorMessage: 'Can\'t see ' + LISTREPORT_PREFIX_ID + sId
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

            // Check if control with id sId has value sValue
            iShouldSeeControlWithValue: function (sId, sValue, bSearchOpenDialog) {
                this.waitFor({
                    id: sId,
                    searchOpenDialogs: bSearchOpenDialog,
                    success: function (oControl) {
                        if (oControl.getValue() === sValue){
                            Opa5.assert.ok(true, "Value found in control with id " + sId + " is same as the actual value.");
                        } else {
                            Opa5.assert.ok(false, "Value found in control with id " + sId + " is not same as the actual value");
                        }
                    }
                });
            },

            // Check for the presence of a button with text sButtonText in the iRow th row of a table
            iShouldSeeCorrectButtonInTheTableRow: function (iRow, sText) {
                var  sId = "fe::table::ReplicationSchedule::LineItem-innerTable";
                return this.waitFor({
                    id: LISTREPORT_PREFIX_ID + sId,
                    success: function (oTable) {
                        var bDeactivateButtonVisible = oTable.getItems()[iRow].getCells()[5].getItems()[0].getVisible();
                        if (sText === 'Deactivate') {
                            Opa5.assert.ok(bDeactivateButtonVisible, "Deactivate button's visibility is " + bDeactivateButtonVisible);
                        } else {
                            Opa5.assert.ok(false, "Button with text " + sText + " not found");
                        }
                    },
                    errorMessage: 'Can\'t see ' + LISTREPORT_PREFIX_ID + sId
                });
            },

            // Check the error dialog with error message sErrorMsg
            iShouldSeeErrorDialog: function (sControlType, sErrorMsg, mProperties) {
                return this.waitFor({
                    controlType: sControlType,
                    searchOpenDialogs: true,
                    matchers: new Properties(mProperties),
                    success: function (oDialog) {
                        var sError = oDialog[0].getContent()[0].getItems()[0].getTitle();
                        if (sError === sErrorMsg){
                            Opa5.assert.ok(true, "Error message found is same as the actual error message");
                        } else {
                            Opa5.assert.ok(false, "Error message found is not same as the actual error message");
                        }
                    },
                    errorMessage: 'Dialog control not found'
                });
            },

            iShouldSeeTheTableTitle: function (sTitle) {
                return this.waitFor({
                    id: LISTREPORT_PREFIX_ID + 'fe::table::ReplicationSchedule::LineItem-title',
                    timeout: 70,
                    success: function (oTitle) {
                        var sTableTitle = oTitle.getText();
                        Opa5.assert.equal(sTableTitle, sTitle, "Title of table is" + sTitle);
                    },
                    errorMessage: 'Can\'t see ' + LISTREPORT_PREFIX_ID + 'fe::table::ReplicationSchedule::LineItem-title'
                });
            }
        }
    };

    return new ListReport(
        {
            appId: "replicationScheduleUi",
            componentId: "ReplicationScheduleListReport",
            entitySet: "ReplicationSchedule"
        },
        AdditionalCustomListReportDefinition
    );
});
