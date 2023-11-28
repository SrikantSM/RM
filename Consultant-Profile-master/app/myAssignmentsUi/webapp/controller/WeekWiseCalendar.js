sap.ui.define(
    [
        "sap/ui/model/json/JSONModel",
        "myAssignmentsUi/utils/Constants",
        "myAssignmentsUi/utils/WeekCalendarDateHelper",
        "myAssignmentsUi/utils/WeekCalendarUtility",
        "sap/m/MessagePopover",
        "sap/m/MessagePopoverItem",
        'sap/ui/core/Fragment',
        "sap/ui/model/resource/ResourceModel",
        "sap/m/MessageBox",
        "sap/m/MessageToast"
    ],
    function (JSONModel, Constants, WeekCalendarDateHelper, WeekCalendarUtility, MessagePopover, MessagePopoverItem, Fragment, ResourceModel, MessageBox, MessageToast) {
        'use strict';

        var oCurrentQuarterModel = new JSONModel();
        var oCapacityRequirements = new Map();
        let sSelectedKey;
        let fTotalEffort;
        let totalEffort;
        var traversedMap = new Map();
        var updatedWeeklyAssignmentData = {
            assignmentId: "",
            _weeklyAssignmentDistribution: []
        };

        return {
            pEffortDistributionWeeklyCalendarFragment: null,

            //Generate key String based on quarter number and year
            generateKey: function (iQuarter, iYear) {
                return "Q" + iQuarter + " " + iYear;
            },

            //Set enable property of next and previous quarter button based on current selected quarter
            //and availability of next/previous quarter data in the oModel
            updateNavigationVisibility: function (selectedKey) {
                sSelectedKey = selectedKey;
                const aSelectedKeySplit = sSelectedKey.split(" ");
                const iQuarterNumber = Number(aSelectedKeySplit[0][1]);
                const iYear = Number(aSelectedKeySplit[1]);

                const quarterValues = WeekCalendarUtility.calculateQuarterValues(iQuarterNumber, iYear);
                // Access the returned values
                const iNextQuarterNumber = quarterValues.nextQuarterNumber;
                const iYearForNextQuarter = quarterValues.yearForNextQuarter;
                const iPreviousQuarterNumber = quarterValues.previousQuarterNumber;
                const iYearForPreviousQuarter = quarterValues.yearForPreviousQuarter;

                const sKeyPrevious = this.generateKey(iPreviousQuarterNumber, iYearForPreviousQuarter);
                const sKeyNext = this.generateKey(iNextQuarterNumber, iYearForNextQuarter);
                oCurrentQuarterModel
                    .setProperty(
                        "/navigateToPreviousQuarterEnabled",
                        oCurrentQuarterModel.getProperty(
                            "/currDetails/" + iYearForPreviousQuarter + "/data" + "/" + sKeyPrevious) ? true : false);
                oCurrentQuarterModel
                    .setProperty(
                        "/navigateToNextQuarterEnabled",
                        oCurrentQuarterModel.getProperty(
                            "/currDetails/" + iYearForNextQuarter + "/data" + "/" + sKeyNext) ? true : false);
            },

            //Set enable property as false for save button, quarter selector, next and previous quarter buttons.
            disableControlsVisibility: function () {
                oCurrentQuarterModel.setProperty("/saveButtonEnabled", false);
                oCurrentQuarterModel.setProperty("/navigateToNextQuarterEnabled", false);
                oCurrentQuarterModel.setProperty("/navigateToPreviousQuarterEnabled", false);
                oCurrentQuarterModel.setProperty("/quarterSelectorEnabled", false);
            },

            //Responsible for loading dialog, fetching weekly asignment service records from backend, set data model for the dialog.
            onOpenCalendarView: async function (oThis, oEvent) {
                // Initialize
                const that = this;
                this.oThis = oThis;
                this.oView = oThis.oView;
                const oRequestedStartDate = WeekCalendarDateHelper.getCorrectDate(new Date(oThis.getModel().getProperty(oThis.sPath).requestedStartDate));
                const oRequestedEndDate = WeekCalendarDateHelper.getCorrectDate(new Date(oThis.getModel().getProperty(oThis.sPath).requestedEndDate));
                const assignmentId = oThis.getModel().getProperty(oThis.sPath).assignmentId;
                const resourceId = oThis.resourceId;
                oCapacityRequirements.clear();
                traversedMap.clear();
                this._currentAssignedEffort = undefined;
                this._oMessageManager = sap.ui.getCore().getMessageManager();
                this._oMessageManager.registerObject(this.oView, true);
                this.oView.setModel(this._oMessageManager.getMessageModel(), "message");
                updatedWeeklyAssignmentData.assignmentId = assignmentId;

                this.oMessageTemplate = new MessagePopoverItem({
                    type: "{message>type}",
                    title: "{message>message}",
                    subtitle: "{message>additionalText}",
                    description: "{message>description}"
                });

                this.oMessagePopover = new MessagePopover({
                    items: {
                        path: "message>/",
                        template: this.oMessageTemplate
                    }
                });
                // Load Fragment and attach to the view
                if (!this.pEffortDistributionWeeklyCalendarFragment) {
                    this.pEffortDistributionWeeklyCalendarFragment = Fragment.load({
                        id: "weekWiseCalendar",
                        name: 'myAssignmentsUi.fragment.Edit',
                        controller: this
                    }).then(function (oDialog) {
                        this.oView.addDependent(oDialog);
                        oDialog.attachAfterOpen(
                            function () {
                                this.oView.addDependent(this.oMessagePopover);
                            }.bind(this)
                        );
                        oDialog.attachAfterClose(
                            function () {
                                this.oMessagePopover.destroyItems();
                                this.oView.getModel("currentQuarterModel").setProperty("/", {});
                            }.bind(this)
                        );
                        oDialog.attachAfterOpen(
                            function () {
                                this.oMessagePopover.destroyItems();
                                const aMessages = sap.ui
                                    .getCore()
                                    .getMessageManager()
                                    .getMessageModel()
                                    .getData();
                                const sMessage = aMessages.filter(function (mItem) {
                                    return mItem.target === "";
                                });
                                sap.ui.getCore().getMessageManager().removeMessages(sMessage);
                            }.bind(this)
                        );
                        return oDialog;
                    }.bind(this));
                }
                if (!this.oView.getModel("i18ned")) {
                    var i18nModel = new ResourceModel({
                        bundleName: "myAssignmentsUi.i18n.i18n"
                    });
                    this.oView.setModel(i18nModel, "i18ned");
                }
                // Perform backend call to get weekly assignment data.
                var oResponse = oThis.getModel('oDataV4Model').bindContext("/getWeeklyAssignments(resourceId='" + resourceId + "',assignmentId='" + assignmentId + "')");
                oResponse.requestObject().then(function (oContexts) {
                    WeekCalendarUtility.getAssignmentResponse(oContexts, oRequestedStartDate, oRequestedEndDate, totalEffort, that)
                        .then(function (oAssignmentResponse) {
                            // Access the returned values
                            oCapacityRequirements = oAssignmentResponse.oCapacityRequirements;
                            oCurrentQuarterModel = oAssignmentResponse.oCurrentQuarterModel;
                            totalEffort = oAssignmentResponse.totalEffort;
                            fTotalEffort = oAssignmentResponse.fTotalEffort;
                            sSelectedKey = oAssignmentResponse.sSelectedKey;
                        });
                })
                    .catch(function (error) {
                        MessageBox.error(this.oThis.getResourceBundle().getText("ASSIGNMENT_SERVICE_UNAVAILABLE"));
                    }.bind(this));
            },

            //Responsible for updating total effort when effort is changed in any cell and store the updated data in updatedWeeklyAssignmentData object
            onWeekEffortChange: function (oEvent) {
                const oView = this.oView;
                var dateRange = {};
                var cellData = {};
                const oStartDate = new Date(
                    sap.ui.getCore().byId(oEvent.getParameters().id).getCustomData()[0].getValue().startDate);
                const oEndDate = new Date(
                    sap.ui.getCore().byId(oEvent.getParameters().id).getCustomData()[0].getValue().endDate);
                // Get data from cell in which the data is inserted.
                const iNewEffortValue = oEvent.getParameters().newValue;
                const fetchedWeekNumber = sap.ui.getCore().byId(oEvent.getParameters().id).getCustomData()[0].getValue().weekNumber;
                const formattedWeekNumber = ("0" + fetchedWeekNumber).slice(-2);
                const weekNumber = '' + oStartDate.getFullYear() + formattedWeekNumber;
                // Check if input is valid.
                if (
                    iNewEffortValue >= 0 &&
                    iNewEffortValue.includes(".") === false &&
                    iNewEffortValue !== ""
                ) {
                    // Update efforts
                    dateRange.oDateFrom = oStartDate;
                    dateRange.oDateTo = oEndDate;
                    cellData.weekNumber = weekNumber;
                    cellData.iNewEffortValue = iNewEffortValue;
                    const updatedWeeklyCellData = WeekCalendarUtility.onUpdateWeeklyCell(oCapacityRequirements, dateRange, cellData, totalEffort, updatedWeeklyAssignmentData, this);
                    // Access the returned values
                    fTotalEffort = updatedWeeklyCellData.fTotalEffort;
                    traversedMap = updatedWeeklyCellData.traversedMap;
                    updatedWeeklyAssignmentData = updatedWeeklyCellData.updatedWeeklyAssignmentData;

                    if (this.oMessagePopover.getItems().length != 0) {
                        // Disbale all action buttons in dialog when some error has occured.
                        this.disableControlsVisibility();
                    } else {
                        // Enable buttons if no error.
                        this.updateNavigationVisibility(sSelectedKey);
                        oView.getModel("currentQuarterModel").setProperty("/saveButtonEnabled", true);
                        oView.getModel("currentQuarterModel").setProperty("/quarterSelectorEnabled", true);
                    }
                } else {
                    this.disableControlsVisibility();
                }
                // Set updated value in UI model.
                oView.getModel("currentQuarterModel").setProperty("/totalEffort", fTotalEffort);
            },

            // Responsible for closing dialog.
            onCloseCalendarView: function (oEvent) {
                this.pEffortDistributionWeeklyCalendarFragment.then(function (oDialog) {
                    oDialog.close();
                });
                updatedWeeklyAssignmentData._weeklyAssignmentDistribution = [];
                updatedWeeklyAssignmentData.assignmentId = "";
            },

            // Responsible for performing backend patch calls when effort is changed in any cell.
            onSaveCalendarView: async function (oEvent) {
                if (updatedWeeklyAssignmentData._weeklyAssignmentDistribution.length != 0) {
                    var actionBinding = this.oThis.getModel('oDataV4Model').bindContext("/postWeeklyAssignments(...)");
                    actionBinding.setParameter("requestPayload", updatedWeeklyAssignmentData);
                    actionBinding.execute().then(
                        function () {
                            WeekCalendarUtility.getUpdatedData(this);
                            MessageToast.show(this.oThis.getResourceBundle().getText("ASSIGNED_HOURS_EDITED"));
                        }.bind(this)
                    ).catch(function (error) {
                        if (error.status >= 400 && error.status < 500) {
                            MessageBox.error(error.message);
                        } else {
                            MessageBox.error(this.oThis.getResourceBundle().getText("ASSIGNMENT_UPDATE_SERVICE_UNAVAILABLE"));
                        }
                    }.bind(this));
                    updatedWeeklyAssignmentData._weeklyAssignmentDistribution = [];
                    updatedWeeklyAssignmentData.assignmentId = "";
                } else {
                    MessageBox.information(this.oThis.getResourceBundle().getText("NO_CHANGES_MADE_TO_ASSIGNMENT_SERVICE"));
                }
                this.pEffortDistributionWeeklyCalendarFragment.then(function (oDialog) {
                    oDialog.close();
                });
            },

            // Responsible for opening quarter selector control when user clicks on quarter button.
            onQuarterSelector: function (oEvent) {
                const oButton = oEvent.getSource();
                const oView = this.oView;
                if (!this.oPopOver) {
                    this.oPopOver = Fragment.load({
                        name: "myAssignmentsUi.fragment.QuarterSelector",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this.oPopOver.then(function (oDialog) {
                    if (oDialog.isOpen()) {
                        oDialog.close();
                    } else {
                        oDialog.setModel(oCurrentQuarterModel, "currentQuarterModel");
                        oDialog.openBy(oButton);
                    }
                });
            },

            // Responsible for updaing dialog data when the quarter is changed.
            onQuarterSelect: function (oEvent) {
                const oSelectQuarter = oEvent.getSource();
                oCurrentQuarterModel.setProperty("/currDetails/" + sSelectedKey.split(" ")[1] + "/selectedKey",
                    Constants.unselectKey);
                sSelectedKey = oSelectQuarter.getKey();
                this.oPopOver.then(function (oPopOver) {
                    oPopOver.close();
                });
                const oTable = sap.ui.getCore().byId("weekWiseCalendar--quarterCalendarTable");
                const iNewSelectedYear = sSelectedKey.split(" ")[1];

                oTable.bindAggregation(
                    "items",
                    "currentQuarterModel>/currDetails/" + iNewSelectedYear + "/data/" + sSelectedKey + "/months",
                    oTable.getBindingInfo("items").template.clone()
                );
                const oButton = sap.ui.getCore().byId("weekWiseCalendar--quarterPicker");
                oButton.setText(sSelectedKey);
                oCurrentQuarterModel.setProperty("/currDetails/" + sSelectedKey.split(" ")[1] + "/selectedKey",
                    sSelectedKey);
                this.updateNavigationVisibility(sSelectedKey);
            },

            // Responsible for updaing dialog data when the previous quarter button is pressed.
            onPreviousQuarter: function (oEvent) {
                const x = sSelectedKey.split(" ");
                let iQuarterNumber = Number(x[0][1]);
                let iYear = Number(x[1]);
                oCurrentQuarterModel.setProperty("/currDetails/" + iYear + "/selectedKey", Constants.unselectKey);
                const previousQuarterData = WeekCalendarUtility.calculatePreviousQuarterData(iQuarterNumber, iYear);
                iQuarterNumber = previousQuarterData.quarterNumber;
                iYear = previousQuarterData.year;
                sSelectedKey = this.generateKey(iQuarterNumber, iYear);
                oCurrentQuarterModel.setProperty("/currDetails/" + iYear + "/" + "selectedKey", sSelectedKey);
                const oTable = sap.ui.getCore().byId("weekWiseCalendar--quarterCalendarTable");
                oTable.bindAggregation(
                    "items", "currentQuarterModel>/currDetails/" + iYear + "/data/" + sSelectedKey + "/months",
                    oTable.getBindingInfo("items").template.clone()
                );
                const oButton = sap.ui.getCore().byId("weekWiseCalendar--quarterPicker");
                oButton.setText(sSelectedKey);
                this.updateNavigationVisibility(sSelectedKey);
            },

            // Responsible for updaing dialog data when the next quarter button is pressed.
            onNextQuarter: function (oEvent) {
                const x = sSelectedKey.split(" ");
                let iQuarterNumber = Number(x[0][1]);
                let iYear = Number(x[1]);
                oCurrentQuarterModel.setProperty("/currDetails/" + iYear + "/selectedKey", Constants.unselectKey);
                const nextQuarterData = WeekCalendarUtility.calculateNextQuarterData(iQuarterNumber, iYear);
                iQuarterNumber = nextQuarterData.quarterNumber;
                iYear = nextQuarterData.year;
                sSelectedKey = this.generateKey(iQuarterNumber, iYear);
                oCurrentQuarterModel.setProperty("/currDetails/" + iYear + "/" + "selectedKey", sSelectedKey);
                const oTable = sap.ui.getCore().byId("weekWiseCalendar--quarterCalendarTable");
                oTable.bindAggregation(
                    "items", "currentQuarterModel>/currDetails/" + iYear + "/data/" + sSelectedKey + "/months",
                    oTable.getBindingInfo("items").template.clone()
                );
                const oButton = sap.ui.getCore().byId("weekWiseCalendar--quarterPicker");
                oButton.setText(sSelectedKey);
                this.updateNavigationVisibility(sSelectedKey);
            },

            // This event is called  to keep focus on the input box when enter is pressed.
            onsapenter: function (oEvent) {
                oEvent.stopPropagation();
            }
        };
    }
);
