sap.ui.define([], function() {
    'use strict';

    return {

        getFilledAssignmentItems: function (oContexts) {
            var allPerDayAssignments = [];

            oContexts.forEach(function(aContext) {
                var _assignment = aContext.getObject();
                var _assignmentStartDateSplitted = _assignment.assignmentStartDate.split('-');

                var _startDate = new Date(_assignmentStartDateSplitted[0], _assignmentStartDateSplitted[1] - 1, _assignmentStartDateSplitted[2]);
                var _endDate = new Date(_startDate);
                _endDate.setDate(_endDate.getDate() + 1);
                var _staffedHours = _assignment.AssignedHours.split('.')[0];

                var _assignmentObject = {
                    assignmentId: _assignment.assignment_ID,
                    resourceId: _assignment.resource_ID,
                    employeeId: _assignment.employee_ID,
                    resourceRequestId: _assignment.resourceRequest_ID,
                    startDate: _startDate,
                    endDate: _endDate,
                    staffedHours: _staffedHours,
                    assignmentDay: _assignment.assignmentStartDate
                };
                allPerDayAssignments.push(_assignmentObject);
            });
            return allPerDayAssignments;
        },

        getFilledMonthAssignmentItem: function (oContexts) {
            var allMonthAssignments = [];

            oContexts.forEach(function(aContext) {
                var _assignment = aContext.getObject();
                var _assignmentStartDateSplitted = _assignment.startDate.split('-');
                var _assignmentEndDateSplitted =  _assignment.endDate.split('-');

                var _startDate = new Date(_assignmentStartDateSplitted[0], _assignmentStartDateSplitted[1] - 1, _assignmentStartDateSplitted[2]);
                var _endDate = new Date(_assignmentEndDateSplitted[0], _assignmentEndDateSplitted[1] - 1, _assignmentEndDateSplitted[2]);

                var _assignmentObject = {
                    assignmentId: _assignment.assignment_ID,
                    employeeId: _assignment.employee_ID,
                    resourceRequestId: _assignment.resourceRequest_ID,
                    startDate: _startDate,
                    endDate: _endDate,
                    requestDisplayId: _assignment.requestDisplayId,
                    projectName: _assignment.projectName,
                    customerName: _assignment.customerName,
                    assignmentStatusCode: _assignment.assignmentStatusCode,
                    assignmentStatus: _assignment.assignmentStatus,
                    title: _assignment.requestName,
                    assignmentStartDate: _startDate,
                    assignmentEndDate: _endDate,
                    assignmentStartDay: _assignment.startDate,
                    assignmentEndDay: _assignment.endDate,
                    staffedHours: _assignment.assignedCapacityinHour,
                    requestedStartDate: _assignment.requestedStartDate,
                    requestedEndDate: _assignment.requestedEndDate,
                    workItemName: _assignment.workItemName,
                    type: this.populateAssignmentColor(_assignment.assignmentStatusCode)

                };
                if (_assignment.assignmentStatusCode == 1) {
                    _assignmentObject.tentative = true;
                }
                allMonthAssignments.push(_assignmentObject);
            }, this);
            return allMonthAssignments;
        },

        prepareCalendarData: function (oContexts, assignmentDetails, assignmentRequestDetails) {
            var allAssignments = [];
            var allHeaders = [];

            oContexts.forEach(function(aContext) {
                var perDayAssignments = new Map(); // eslint-disable-line no-undef
                var _resourceItem = aContext.getObject();
                var today = new Date(_resourceItem.capacityDate);
                var _resourceCapacityDateSplitted = _resourceItem.capacityDate.split('-');
                var _startDate = new Date(_resourceCapacityDateSplitted[0], _resourceCapacityDateSplitted[1] - 1, _resourceCapacityDateSplitted[2]);
                var _endDate = new Date(_startDate);
                _endDate.setDate(_endDate.getDate() + 1);
                var _monthStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
                var _monthEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                _monthEndDate.setDate(_monthEndDate.getDate() + 1);

                var newHeaderElement = {
                    startDate: _startDate,
                    endDate: _endDate,
                    monthStartDate: _monthStartDate,
                    monthEndDate: _monthEndDate,
                    staffedHours: 0,
                    capacityHours: _resourceItem.dayCapacity,
                    assignmentDay: _resourceItem.capacityDate,
                    weekColor: null,
                    monthColor: null,
                    monthlyStaffedHours: 0,
                    monthlyCapacityHours: 0,
                    month: new Date(_resourceItem.capacityDate).getMonth()
                };

                var aAssignments = assignmentDetails.filter(function (oAssignment) {
                    return oAssignment.assignmentDay.match(new RegExp(_resourceItem.capacityDate, "i"));
                });

                // Calculation of staffed hours for month view
                assignmentDetails.forEach(function(assignmentDetail) {
                    if (new Date(_resourceItem.capacityDate).getMonth() == new Date(assignmentDetail.assignmentDay).getMonth()){
                        newHeaderElement.monthlyStaffedHours = parseInt(newHeaderElement.monthlyStaffedHours, 10)  +  parseInt(assignmentDetail.staffedHours, 10);
                    }
                });

                // Calculation of staffed hours and color for week view
                if (aAssignments.length > 0) {

                    Object.assign(perDayAssignments, this.prepareCalendarHeaderAndRows(aAssignments, assignmentRequestDetails));

                    newHeaderElement.staffedHours = perDayAssignments._totalAssignedHrs;
                    var weekUtilisation = (newHeaderElement.staffedHours / newHeaderElement.capacityHours) * 100;
                    newHeaderElement.weekColor = this.pupolateHeaderColor(weekUtilisation);
                } else {
                    newHeaderElement.weekColor = "#dc0d0e"; //turns red
                }

                allHeaders.push(newHeaderElement);
                Array.prototype.push.apply(allAssignments, perDayAssignments._perDayAssignments);

            }, this);

            // Calculation of capacity hours for month view
            var monthCapacityDict = {};
            allHeaders.forEach(function(item) {
                if (monthCapacityDict.hasOwnProperty(item.month)) {
                    monthCapacityDict[item.month] += item.capacityHours;
                } else {
                    monthCapacityDict[item.month] = item.capacityHours;
                }
            });

            // Filling of capacity hours and header color for months view
            allHeaders.forEach(function (item) {
                for (var key in monthCapacityDict) {
                    if (monthCapacityDict.hasOwnProperty(key)) {
                        if (key == item.month) {
                            item.monthlyCapacityHours = monthCapacityDict[item.month];
                            if (item.monthlyStaffedHours > 0) {
                                var monthUtilisation = (item.monthlyStaffedHours / item.monthlyCapacityHours) * 100;
                                item.monthColor = this.pupolateHeaderColor(monthUtilisation);
                            } else {
                                item.monthColor = "#dc0d0e"; //turns red
                            }
                        }
                    }
                }
            }, this);

            return {
                _assignments: allAssignments,
                _headers: allHeaders
            };

        },

        prepareCalendarHeaderAndRows: function(aAssignments, assignmentRequestDetails) {
            var perDayAssignments = [];
            var totalPerdayAssignedHours = 0;
            var tempAssignmentId;
            var assignmentRequestDetail;
            aAssignments.forEach(function(aAssignment) {

                var assignmentObject = {
                    startDate: aAssignment.startDate,
                    endDate: aAssignment.endDate,
                    resourceId: aAssignment.resourceId,
                    resourceRequestId: aAssignment.resourceRequestId,
                    employeeId: aAssignment.employeeId,
                    assignmentId: aAssignment.assignmentId,
                    staffedHours: aAssignment.staffedHours,
                    assignmentDay: aAssignment.assignmentDay,
                    title: "",
                    projectName: "",
                    assignmentStartDate: null,
                    assignmentEndDate: null,
                    capacityHours: 0,
                    customerName: "",
                    requestDisplayId: "",
                    assignmentStatus: "",
                    type: "",
                    tentative: false,
                    workItemName: ""
                };

                if (tempAssignmentId != assignmentObject.assignmentId) {
                    assignmentRequestDetail = undefined;
                    assignmentRequestDetail = this.getAssignmentRequestDetail(assignmentObject.assignmentId, assignmentRequestDetails);
                }

                if (assignmentRequestDetail) {
                    assignmentObject.type = this.populateAssignmentColor(assignmentRequestDetail.assignmentStatusCode);
                    assignmentObject.requestDisplayId = assignmentRequestDetail.requestDisplayId;
                    assignmentObject.title = assignmentRequestDetail.requestName;
                    assignmentObject.customerName = assignmentRequestDetail.customerName;
                    assignmentObject.projectName = assignmentRequestDetail.projectName;
                    assignmentObject.assignmentStartDate = assignmentRequestDetail.assignmentStartDate;
                    assignmentObject.assignmentEndDate = assignmentRequestDetail.assignmentEndDate;
                    assignmentObject.assignmentStatus = assignmentRequestDetail.assignmentStatus;
                    assignmentObject.workItemName = assignmentRequestDetail.workItemName;
                    if (assignmentRequestDetail.assignmentStatusCode == 1) {
                        assignmentObject.tentative = true;
                    }
                }

                totalPerdayAssignedHours = +totalPerdayAssignedHours + +aAssignment.staffedHours;
                tempAssignmentId = assignmentObject.assignmentId;

                perDayAssignments.push(assignmentObject);

            }, this);

            return {
                _perDayAssignments: perDayAssignments,
                _totalAssignedHrs: totalPerdayAssignedHours
            };

        },

        getFilledProjectItem: function (oContexts) {
            var __AllProjectItems = [];

            oContexts.forEach(function(aContext) {
                var _projectsItem = aContext.getObject();

                var _assignmentStartDateSplitted = _projectsItem.startDate.split('-');
                var _assignmentEndDateSplitted =  _projectsItem.endDate.split('-');

                var _assignmentStartDate = new Date(_assignmentStartDateSplitted[0], _assignmentStartDateSplitted[1] - 1, _assignmentStartDateSplitted[2]);
                var _assignmentEndDate = new Date(_assignmentEndDateSplitted[0], _assignmentEndDateSplitted[1] - 1, _assignmentEndDateSplitted[2]);
                var _projectObject = {
                    projectName: _projectsItem.projectName,
                    resourceRequestId: _projectsItem.resourceRequest_ID,
                    customerName: _projectsItem.customerName,
                    requestDisplayId: _projectsItem.requestDisplayId,
                    requestName: _projectsItem.requestName,
                    assignmentId: _projectsItem.assignment_ID,
                    assignmentStartDate: _assignmentStartDate,
                    assignmentEndDate: _assignmentEndDate,
                    assignmentStatusCode: _projectsItem.assignmentStatusCode,
                    assignmentStatus: _projectsItem.assignmentStatus,
                    workItemName: _projectsItem.workItemName
                };
                __AllProjectItems.push(_projectObject);
            });

            return __AllProjectItems;
        },

        getFilledLegendItem: function (oi18nModel) {
            var __AllLegendItems = [];

            __AllLegendItems = [
                {
                    text: oi18nModel.getText('MODERATE_UTLILISATION'),
                    type: "Type02",
                    color: "#3fa45b" //green
                },
                {
                    text: oi18nModel.getText('LOW_UTLILISATION'),
                    type: "Type01",
                    color: "#f5b04d" //yellow
                },
                {
                    text: oi18nModel.getText('HIGH_UTLILISATION'),
                    type: "Type03",
                    color: "#dc0d0e" //red
                }
            ];
            return __AllLegendItems;
        },

        getAssignmentRequestDetail: function(sAssignmentId, aAssignmentRequestDetails) {
            return aAssignmentRequestDetails.find(function(obj) {
                return obj.assignmentId === sAssignmentId;
            });
        },

        pupolateHeaderColor: function(utilisation) {
            var color;
            if (utilisation < 70 || utilisation > 120 || utilisation == undefined) {
                color = "#dc0d0e"; //turns red
            } else if ((utilisation >= 70 && utilisation < 80) || (utilisation > 110 && utilisation <= 120)) {
                color = "#f5b04d"; //turns yellow
            } else if (utilisation >= 80 && utilisation <= 110 ) {
                color = "#3fa45b"; //green
            }

            return color;
        },

        getFilledLegendAppointmentItem: function (oi18nModel) {
            var __AllLegendAppointmentItems = [];

            __AllLegendAppointmentItems = [
                {
                    text: oi18nModel.getText('HARD_BOOKED'),
                    type: "Type04",
                    color: "#1093a2"
                },
                {
                    text: oi18nModel.getText('SOFT_BOOKED'),
                    type: "Type05",
                    color: "#ffffff"
                }
            ];
            return __AllLegendAppointmentItems;
        },

        populateAssignmentColor: function(assignmentStatusCode) {
            var color;
            if (assignmentStatusCode == 1) {
                color = "#ffffff"; //soft-booked
            } else if (assignmentStatusCode == 0) {
                color = "#1093a2"; //hard-booked
            } // other type of assignments are not going to display on UI like assignmentStatus == 2 (proposed)
            return color;
        }

    };
});
