sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/InvisibleMessage",
    "sap/ui/core/library",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (Controller, JSONModel, InvisibleMessage, library, Fragment, Filter, FilterOperator,MessageToast) {
    "use strict";
    var invisibleMessageMode = library.InvisibleMessageMode;
    return Controller.extend("availabilityDownload.App", {
        onInit: function () {
            this.oInvisibleMessage = InvisibleMessage.getInstance();
            this.uiModel = new JSONModel({
                busy: false,
                messageVisible: false,
                messageType: undefined,
                messageText: undefined,
                costCenter: "",
                workforceID: "",
                startDate: undefined,
                endDate: undefined
            });
            this.getView().setModel(this.uiModel, "ui");
            this.initializeDateControl();
            this.handleSelectionChange();
        },

        initializeDateControl: function () {
            //Default values for planned working hours
            this.getView().byId("plannedWorkingHoursInput").setValue(8);
            this.getView().byId("plannedNonWorkingHoursInput").setValue(0);
        },

        handleDownloadPress: function (oEvent) {
            this.uiModel.setProperty("/messageVisible", false);
            this.uiModel.setProperty("/costCenter", "");
            this.uiModel.setProperty("/workforceID", "");
            this.uiModel.setProperty("/startDate", "");
            this.uiModel.setProperty("/endDate", "");
            if (!this.getView().byId("costCenterInput").getValue() && !this.getView().byId("workforceIDInput").getValue()) {
                this.uiModel.setProperty("/messageType", "Error");
                this.uiModel.setProperty("/messageText", this._translateText("errorNoCostCenterWorkForceID"));
                this.uiModel.setProperty("/messageVisible", true);
                this.oInvisibleMessage.announce(this.getView().byId("downloadMessageStrip").getText(), invisibleMessageMode.Assertive);
                return;
            }
            //Dropdown validation check
            if (this.getView().byId("costCenterInput").getValueState() == sap.ui.core.ValueState.Error) {
                this.uiModel.setProperty("/messageType", "Error");
                this.uiModel.setProperty("/messageText", this._translateText("errorInvalidCostCenter"));
                this.uiModel.setProperty("/messageVisible", true);
                this.oInvisibleMessage.announce(this.getView().byId("downloadMessageStrip").getText(), invisibleMessageMode.Assertive);
                return;
            }
            if (this.getView().byId("workforceIDInput").getValueState() == sap.ui.core.ValueState.Error) {
                this.uiModel.setProperty("/messageType", "Error");
                this.uiModel.setProperty("/messageText", this._translateText("errorInvalidWorkforcePerson"));
                this.uiModel.setProperty("/messageVisible", true);
                this.oInvisibleMessage.announce(this.getView().byId("downloadMessageStrip").getText(), invisibleMessageMode.Assertive);
                return;
            }
            if (!this.getView().byId("datePick").getValue()) {
                this.uiModel.setProperty("/messageType", "Error");
                this.uiModel.setProperty("/messageText", this._translateText("errorNoTimePeriod"));
                this.uiModel.setProperty("/messageVisible", true);
                this.oInvisibleMessage.announce(this.getView().byId("downloadMessageStrip").getText(), invisibleMessageMode.Assertive);
                return;
            }
            if (!this.getView().byId("datePick").isValidValue()) {
                this.uiModel.setProperty("/messageType", "Error");
                this.uiModel.setProperty("/messageText", this._translateText("errorInvalidTimePeriod"));
                this.uiModel.setProperty("/messageVisible", true);
                this.oInvisibleMessage.announce(this.getView().byId("downloadMessageStrip").getText(), invisibleMessageMode.Assertive);
                return;
            }
            this.uiModel.setProperty("/busy", true);

            var costCenter = this.getView().byId("costCenterInput").getValue();
            if (this.getView().byId("costCenterInput").getValue()) {
                this.uiModel.setProperty("/costCenter", "CC_" + costCenter);
            }
            var workforceID = this.getView().byId("workforceIDInput").getValue();
            if (this.getView().byId("workforceIDInput").getValue()) {
                this.uiModel.setProperty("/workforceID", "WP_" + workforceID);
            }
            var workinghours = this.getView().byId("plannedWorkingHoursInput").getValue();
            var nonworkinghours = this.getView().byId("plannedNonWorkingHoursInput").getValue();

            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: "yyyy-MM-dd"
            });
            var fromDate = this.getView().byId("datePick").getDateValue();
            var toDate = this.getView().byId("datePick").getSecondDateValue();

            var startDate = oDateFormat.format(new Date(fromDate)); // "2014-12-30"
            this.uiModel.setProperty("/startDate", startDate);
            var endDate = oDateFormat.format(new Date(toDate));
            this.uiModel.setProperty("/endDate", endDate);

            jQuery.ajax({
                method: "GET",
                url: this._getServiceUri(startDate, endDate, costCenter, workforceID, workinghours, nonworkinghours),
                xhr: function () {
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 2) {
                            if (xhr.status === 200) {
                                xhr.responseType = "blob";
                            } else {
                                xhr.responseType = "text";
                            }
                        }
                    };
                    return xhr;
                }
            }).done(function (blob) {
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;

                a.download = "Availability_" +
                    this.uiModel.getProperty("/costCenter") +
                    this.uiModel.getProperty("/workforceID") + "_" +
                    this.uiModel.getProperty("/startDate") + "_" +
                    this.uiModel.getProperty("/endDate") + ".csv";
                document.body.appendChild(a);
                a.click();
                a.remove();
            }.bind(this)).fail(this._onDownloadFailure.bind(this)).always(function () {
                this.uiModel.setProperty("/busy", false);
            }.bind(this));
        },

        handleDateChange: function (oEvent) {
            var bValid = oEvent.getParameter("valid"),
                oEventSource = oEvent.getSource();

            if (bValid) {
                oEventSource.setValueState(sap.ui.core.ValueState.None);
            } else {
                oEventSource.setValueState(sap.ui.core.ValueState.Error);
            }
        },

        handleSelectionChange: function (oEvent) {
            if (this.getView().byId("rbCostCenter").getSelected()) {
                this.getView().byId("costCenterInput").setEnabled(true);
                this.getView().byId("workforceIDInput").setValue("");
                this.getView().byId("workforceIDInput").setEnabled(false);
                this.getView().byId("workforceIDInput").setValueState(sap.ui.core.ValueState.None);
            } else if (this.getView().byId("rbWorkforceID").getSelected()) {
                this.getView().byId("workforceIDInput").setEnabled(true);
                this.getView().byId("costCenterInput").setValue("");
                this.getView().byId("costCenterInput").setEnabled(false);
                this.getView().byId("costCenterInput").setValueState(sap.ui.core.ValueState.None);
            }
        },

        handleChange: function (oEvent) {

            const oValidatedValueHelp = oEvent.getSource();
            const sSelectedKey = oValidatedValueHelp.getSelectedKey();
            const sValue = oValidatedValueHelp.getValue() || "";
            let bValidate = false;

            oEvent.getSource().getSuggestionItems().forEach(oItem => {
                const sKey = oItem.getKey() || "";
                if (sValue.toUpperCase() === sKey.toUpperCase() || sSelectedKey === sKey.toUpperCase()) {
                    bValidate = true;
                }
            });

            if (!bValidate) {
                oValidatedValueHelp.setValueState(sap.ui.core.ValueState.Error);
            } else {
                oValidatedValueHelp.setValueState(sap.ui.core.ValueState.None);
            }
        },

        onCostCenterInput: function (oEvent) {
            let sInputValue = oEvent.getSource().getValue(),
                oView = this.getView();
            if (!this.pValueHelpCostCenter) {
                this.pValueHelpCostCenter = Fragment.load(
                    {
                        name: "availabilityDownload.fragment.CostCenter",
                        controller:this
                    }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                }).catch((e)=>MessageToast.show("Cost center fragment failed to load"));
            }
            return this.pValueHelpCostCenter.then(function (oDailog){
                oDailog.open(sInputValue);
            }).catch((e)=>MessageToast.show("Cost center fragment failed to load"));
        },

	    onWorkForceIdInput: function (oEvent) {
            let sInputValue = oEvent.getSource().getValue(),
                oView = this.getView();
            if (!this.pValueHelpWorkForce) {
                this.pValueHelpWorkForce = Fragment.load(
                    {
                        name: "availabilityDownload.fragment.WorkForce",
                        controller:this
                    }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                }).catch((e)=>MessageToast.show("WorkForce fragment failed to load"));
            }
            return this.pValueHelpWorkForce.then(function (oDailog){
                oDailog.open(sInputValue);
            }).catch((e)=>MessageToast.show("Work force fragment failed to load"));
        },
        onValueHelpDialogClose:function(oEvent, sField){
            const oSelectedItem = oEvent.getParameter("selectedItem");

            if (!oSelectedItem){
                return;
            }

            if (sField === "costCenter") {
                let costCenterDescription = oSelectedItem.getTitle();
                this.uiModel.setProperty('/selectedCostCenterId', costCenterDescription);
                var oInput = this.getView().byId("costCenterInput");
                oInput.setValue(costCenterDescription);

            } else {
                let workForceDescription = oSelectedItem.getTitle();
                this.uiModel.setProperty('/selectedWorkForceId', workForceDescription);
                var oInput = this.getView().byId("workforceIDInput");
                oInput.setValue(workForceDescription);
            }

        },

        onSuggestCostCenter: function (oEvent) {
            var sTerm = oEvent.getParameter("suggestValue");
            var aFilters = [];
            if (sTerm) {
                aFilters.push(new Filter("s4CostCenterId", FilterOperator.StartsWith, sTerm));
            }
            oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
        },

        onSuggestWorkForcePerson: function (oEvent) {
            var sTerm = oEvent.getParameter("suggestValue");
            var aFilters = [];
            if (sTerm) {
                aFilters.push(new Filter("workForcePersonExternalId", FilterOperator.StartsWith, sTerm));
            }
            oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
        },

        onValueHelpDialogSearch:function(oEvent){
            const sValue = oEvent.getParameter("value");
            const sFilterPath = oEvent.getSource().data("FilterName");
            const oFilter  = new Filter(sFilterPath, FilterOperator.Contains, sValue);
            oEvent.getSource().getBinding("items").filter([oFilter]);
        },

        _onDownloadFailure: function (jqXHR, textStatus, errorThrown) {
            var errorMessage;
            try {
                errorMessage = JSON.stringify(jqXHR.responseText);
            } catch (error) {
                //fall back is after catch block
            }
            errorMessage = errorMessage || this._translateText("errorDownloadUnknown");
            this.uiModel.setProperty("/messageType", "Error");
            this.uiModel.setProperty("/messageText", errorMessage);
            this.uiModel.setProperty("/messageVisible", true);
            this.oInvisibleMessage.announce(this.getView().byId("downloadMessageStrip").getText(), invisibleMessageMode.Assertive);
        },

        /**
         * Reads the URI for the File Download Service from the Manifest
         * @param {Date} startDate startdate filter value
         * @param {Date} endDate endDat filter value
         * @param {string} costCenter cost center filter value
         * @param {string} workforceID workforce person external id filter value
         * @param {int} workinghours workingHours filter value
         * @param {int} nonworkinghours nonworkinghours filter value
         * @returns {string} The URI
         */
        _getServiceUri: function (startDate, endDate, costCenter, workforceID, workinghours, nonworkinghours) {
            var oComponent = this.getOwnerComponent();
            return oComponent.getManifestObject().resolveUri(oComponent.getManifestEntry("/sap.app/dataSources/fileDownloadService/uri")
                + "?startdate=" + encodeURI(startDate, "UTF-8") + "&enddate=" + encodeURI(endDate, "UTF-8")
                + "&costcenter=" + encodeURIComponent(costCenter, "UTF-8") + "&workforcepersonid=" + encodeURIComponent(workforceID, "UTF-8")
                + "&workinghours=" + encodeURI(workinghours, "UTF-8") + "&nonworkinghours=" + encodeURI(nonworkinghours, "UTF-8"));
        },

        /**
         * Translates texts. Fully exposes the interface of ResourceBundle.getText()
         * @param {string} sTextId ID of the text to be translated
         * @param {string} aTextArguments text that needs to be translated
         * @returns {string} The translated text
         */
        _translateText: function (sTextId, aTextArguments) {
            if (!this.oResourceBundle) {
                this.oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            }
            return this.oResourceBundle.getText(sTextId, aTextArguments);
        }
    });
});
