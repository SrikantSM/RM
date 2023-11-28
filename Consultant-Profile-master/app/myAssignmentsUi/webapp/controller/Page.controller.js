sap.ui.define([
    'myAssignmentsUi/controller/BaseController',
    'sap/ui/core/format/DateFormat',
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/Fragment',
    'myAssignmentsUi/utils/AssignmentDataManager',
    'myAssignmentsUi/utils/DateUtility',
    "myAssignmentsUi/controller/WeekWiseCalendar"
], function (BaseController, DateFormat, JSONModel, Fragment, AssignmentDataManager, DateUtility, WeekWiseCalendar) {
    'use strict';

    this.searchQuery = '';

    return BaseController.extend('myAssignmentsUi.controller.Page', {

        dateUtilityFormatter: DateUtility,

        // Initializing the databinding with OData service
        onInit: function () {
            var oODataModel = this.getModel('oDataV4Model');
            this.assignmentDataManager = this.getAssignDataManagerInstance(oODataModel, this.getResourceBundle());
            var oViewModel = new JSONModel({selectedCalendarMode :  "MyMonth"});
            this.setModel(oViewModel, "viewModel");
            this.assignmentDataManager.fetchTableData();
            this.setModel(this.assignmentDataManager.myAssignmentsModel);
            var oStateModel = new JSONModel();
            oStateModel.setData({
                legendShown: false
            });
            this.setModel(oStateModel, "stateModel");

            var oEditModel = new JSONModel({isEditable : this.assignmentDataManager._EditApp});
            this.setModel(oEditModel, "editModel");

            this.pCMonthMap = new Map();
            var oPlanningCalendar = this.getView().byId("MyPlanningCalendar");
            for (var i = new Date(oPlanningCalendar.getStartDate()); i <= new Date(oPlanningCalendar.getEndDate()); i.setDate(i.getDate() + 1)){
                this.pCMonthMap.set((i.getMonth() + "-" + i.getFullYear()).toString(), true);
            }
            WeekWiseCalendar.pEffortDistributionWeeklyCalendarFragment = null;
        },

        getAssignDataManagerInstance: function(oODataModel, oi18nModel){
            return new AssignmentDataManager(oODataModel, oi18nModel);
        },

        // Open the popover when assignment/assignments is/are clicked
        handleAssignmentSelect: function (oEvent) {
            var oAppointment = oEvent.getParameter('appointment');

            if (oAppointment) {
                this._handleSingleAssignmentSelection(oAppointment);
            }
        },

        handleViewChange: function () {
            this.handleStartDateChange();
        },

        handleStartDateChange: function() {
            var dStartDate, dEndDate, cStartDate, cEndDate;
            var oPCMonthObj = {};
            var oModel =  this.getView().getModel();
            var dateFilter = {};
            var fetchDataRange = {};
            var monthFlag = false;
            var oPlanningCalendar = this.getView().byId("MyPlanningCalendar");

            // To set the viewModel property and get the startdate and endate according to the view
            switch (oPlanningCalendar.getViewKey() == "MyWeek") {
            case true:
                this.setModelProperty("viewModel", "/selectedCalendarMode", "MyWeek");
                dStartDate = oPlanningCalendar.getStartDate();
                dEndDate = oPlanningCalendar.getEndDate();
                break;
            case false:
                monthFlag = true;
                this.setModelProperty("viewModel", "/selectedCalendarMode", "MyMonth");
                dStartDate = new Date(oPlanningCalendar.getStartDate().getFullYear(), oPlanningCalendar.getStartDate().getMonth(), 1);
                dEndDate = new Date(oPlanningCalendar.getEndDate().getFullYear(), oPlanningCalendar.getEndDate().getMonth() + 1, 0);
                break;
            default:
                break;
            }

            // Below function is workaround for planning Calendar navigation issue for blocked year- https://jira.tools.sap/browse/MODULAREPPMVALIANT-2384
            if (monthFlag == true) {
                oPCMonthObj = DateUtility.validateMonthEndDate(dStartDate, dEndDate, oPCMonthObj, this);
                dStartDate = oPCMonthObj.monthStartDate;
                dEndDate = oPCMonthObj.monthEndDate;
            }

            if (!this._aOriginalAssignments) {
                this._aOriginalAssignments = oModel.getProperty("/myAssignments");
            }
            var aOriginalAssignments = oModel.getProperty("/myAssignments");

            // check whether data set exist in myAssignmentsModel
            // Also validate if the date belongs to a month for which data set already fetched but no records in database

            fetchDataRange = DateUtility.getDataRange(dStartDate, dEndDate, fetchDataRange, this);

            cStartDate = fetchDataRange.start;
            cEndDate = fetchDataRange.end;

            if (!fetchDataRange.startDateDataFound || !fetchDataRange.endDateDataFound ) {
                this.getView().setBusyIndicatorDelay(0);
                this.getView().setBusy(true);
                //prepare dates
                dateFilter.oDateFrom = DateUtility.getFilterStartDate(fetchDataRange.startDateDataFound, dStartDate, dateFilter.oDateFrom);
                dateFilter.oDateTo = DateUtility.getFilterEndDate(fetchDataRange.endDateDataFound, dEndDate, dStartDate, dateFilter.oDateTo, this);

                // call the backend to get the new set of data
                this.assignmentDataManager.fetchTableData(dateFilter, fetchDataRange, this).then(function(){
                    this.getView().setBusy(false);
                }.bind(this));
            } else {
                aOriginalAssignments = this._getAppointmentsForSelectedRange(aOriginalAssignments, cStartDate, cEndDate);
                oModel.setProperty("/myAssignments", aOriginalAssignments);
            }

        },

        _getAppointmentsForSelectedRange: function (aOriginalAssignments, cStartDate, cEndDate) {
            var sQuery = this.searchQuery;
            var aFilteredHeaders;
            var aFilteredAssignments;

            // Filter the assignment and headers for the visible range according to the view displayed
            switch (this && this.getModelProperty("viewModel", "/selectedCalendarMode") == "MyWeek") {
            case true:
                aFilteredAssignments = aOriginalAssignments[0].allAssignments.filter(function (oAssignment) {
                    return (oAssignment.assignmentDay >= cStartDate && oAssignment.assignmentDay <= cEndDate);
                });
                aFilteredHeaders = aOriginalAssignments[0].allHeaders.filter(function (oHeader) {
                    return (oHeader.assignmentDay >= cStartDate && oHeader.assignmentDay <= cEndDate);
                });
                aFilteredAssignments.sort(function(a, b) {
                    return a.assignmentEndDate - b.assignmentEndDate || a.title.localeCompare(b.title);
                });
                break;
            case false:
                aFilteredAssignments = aOriginalAssignments[0].allMonthAssignments.filter(function (oAssignment) {
                    return (cStartDate >= oAssignment.assignmentStartDay || cStartDate <= oAssignment.assignmentStartDay);
                });

                var aMonthHeaders = aOriginalAssignments[0].allHeaders.filter(function (oHeader) {
                    return (oHeader.assignmentDay >= cStartDate && oHeader.assignmentDay <= cEndDate);
                });
                aFilteredHeaders = Array.from(new Map(aMonthHeaders.map((item) => [item["month"], item])).values());
                break;
            default:
                break;
            }

            //apply filter if any present on search bar
            if (sQuery && sQuery.length > 1) {
                aFilteredAssignments = aFilteredAssignments.filter(function (fAssignment) {
                    return (fAssignment.title.match(new RegExp(sQuery, "i")) || fAssignment.customerName.match(new RegExp(sQuery, "i")));
                });
            }
            //Assigned data to planning calendar
            aOriginalAssignments[0].assignments = aFilteredAssignments;
            aOriginalAssignments[0].headers = aFilteredHeaders;

            return aOriginalAssignments;
        },

        // Open the popover when a assignment is clicked
        _handleSingleAssignmentSelection: function (oAppointment) {
            var oView = this.getView();
            this.setModelProperty("editModel", "/isEditable", this.assignmentDataManager._EditApp);
            if (oAppointment === undefined) {
                return;
            }

            if (!oAppointment.getSelected() && this._pDetailsPopover) {
                this._pDetailsPopover.then(function (oDetailsPopover) {
                    oDetailsPopover.close();
                });
                return;
            }

            if (!this._pDetailsPopover) {
                this._pDetailsPopover = Fragment.load({
                    id: oView.getId(),
                    name: 'myAssignmentsUi.fragment.Details',
                    controller: this
                }).then(function (oDetailsPopover) {
                    oView.addDependent(oDetailsPopover);
                    return oDetailsPopover;
                });
            }

            this._pDetailsPopover.then(function (oDetailsPopover) {
                this._setDetailsDialogContent(oAppointment, oDetailsPopover);
            }.bind(this));
        },

        // Setting the pop over content
        _setDetailsDialogContent: function (oAppointment, oDetailsPopover) {
            oDetailsPopover.setBindingContext(oAppointment.getBindingContext());
            oDetailsPopover.openBy(oAppointment);
        },

        // To search the assignments
        onSearch: function (oEvent) {
            var sQuery = oEvent.getSource().getValue().trim();
            var oModel =  this.getView().getModel();
            var oDateFormat = DateFormat.getInstance({
                pattern: "yyyy-MM-dd"
            });
            var oPlanningCalendar = this.getView().byId("MyPlanningCalendar");
            var cStartDate = String(oDateFormat.format(oPlanningCalendar.getStartDate()));
            var cEndDate = String(oDateFormat.format(oPlanningCalendar.getEndDate()));
            var aSelectedAssignments;
            if (!this._aOriginalAssignments) {
                this._aOriginalAssignments = oModel.getProperty("/myAssignments");
            }
            var aOriginalAssignments = this._aOriginalAssignments;

            if (this && this.getModelProperty("viewModel", "/selectedCalendarMode") == "MyWeek") {
                aSelectedAssignments = aOriginalAssignments[0].allAssignments.filter(function (oAssignment) {
                    return (oAssignment.assignmentDay >= cStartDate && oAssignment.assignmentDay <= cEndDate );
                });
            } else {
                aSelectedAssignments = aOriginalAssignments[0].allMonthAssignments.filter(function (oAssignment) {
                    return (cStartDate >= oAssignment.assignmentStartDay || cStartDate <= oAssignment.assignmentStartDay);
                });
            }
            aOriginalAssignments[0].assignments = aSelectedAssignments;
            if (sQuery && sQuery.length > 1) {
                var aFilteredAssignments = this._aOriginalAssignments[0].assignments.filter(function (oAssignment) {
                    return (oAssignment.title.match(new RegExp(sQuery, "i")) || oAssignment.customerName.match(new RegExp(sQuery, "i")));
                });
                aOriginalAssignments[0].assignments = aFilteredAssignments;
            }
            oModel.setProperty("/myAssignments", aOriginalAssignments);
            this.searchQuery = sQuery;
        },


        //Navigating to the assignment details object
        onNavigatetoAssignment: function (oEmployeeID, oAssignmentID) {
            // get a handle on the global XAppNav service
            var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

            // Set the navigation to a my project experience app project detail page.
            var hash = (
                oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: {
                        semanticObject: "myProjectExperienceUi",
                        action: "Display&/MyProjectExperienceHeader(ID=" + oEmployeeID + ",IsActiveEntity=true)/internalWorkExperience(" + oAssignmentID + ")"
                    }
                })
            ) || "";

            //Generate a  URL for the second application
            var url = window.location.href.split('#')[0] + hash;

            sap.m.URLHelper.redirect(url, true);
        },

        //Editing the assignment
        editAssignment: function(oEvent) {
            var oDetailsPopover = this.byId("assignmentDetailsPopOver");
            this.sPath = oDetailsPopover.getBindingContext().getPath();
            this.resourceId = this.assignmentDataManager.resourceId;
            oDetailsPopover.close();
            WeekWiseCalendar.onOpenCalendarView(this, oEvent);
        },

        // Show assigned/available value on header acc to view
        formatCalendarTitle: function (sSelectedCalenderMode, staffedHours, capacityHours, monthlyStaffedHours, monthlyCapacityHours) {
            if (sSelectedCalenderMode && sSelectedCalenderMode.toLowerCase() === "myweek") {
                return this.getI18nText("STAFFED_VS_CAPACITY") + ": "  + staffedHours + " / " + capacityHours + " " + this.getI18nText("UOM_HOURS");
            } else {
                return this.getI18nText("STAFFED_VS_CAPACITY") + ": "  + monthlyStaffedHours + " / " + monthlyCapacityHours + " " + this.getI18nText("UOM_HOURS");
            }
        }

    });
});
