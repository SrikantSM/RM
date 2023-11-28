sap.ui.define([
    "sap/ui/core/Fragment",
    "myAssignmentsUi/controller/Page.controller",
    'sap/ui/model/json/JSONModel',
    "sap/ui/thirdparty/sinon",
    "sap/ui/model/resource/ResourceModel"
], function(Fragment, Controller, JSONModel, sinon, ResourceModel) {
    'use strict';

    var _AllLegendItems = [];
    var allAssignments = [];
    var allMonthAssignments = [];
    var oneYearFromNow = new Date(new Date().getFullYear(), 11, 31);
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    var oneYearPastFromNow = new Date(new Date().getFullYear(), 0, 1);
    oneYearPastFromNow.setFullYear(oneYearPastFromNow.getFullYear() - 1);

    var assignment1 = {
        assignmentDay: "2021-08-01",
        assignmentId: "fdff276b-904b-44e8-b9db-9cddbb99b13c",
        capacityHours: 0,
        customerName: "iTelO",
        employeeId: "6ed817cc-136a-45be-9b94-790663447716",
        endDate: new Date(2021, 6, 1),
        projectEndDate: new Date(2021, 6, 2),
        projectName: "Valiant",
        projectStartDate: new Date(2021, 6, 1),
        resourceId: "f07d883b-1f17-4b1c-b78d-75c62d801976",
        resourceRequestId: "051b0af8-802a-4a2f-9775-c94312b979e1",
        staffedHours: "4",
        startDate: new Date(2021, 6, 1),
        tentative: false,
        title: "Concept",
        type: "#add8e6",
        requestDisplayId: ""
    };

    var assignment2 = {
        assignmentDay: "2022-08-02",
        assignmentId: "fdff276b-904b-44e8-b9db-9cddbb99b13c",
        capacityHours: 0,
        customerName: "iTelO",
        employeeId: "6ed817cc-136a-45be-9b94-790663447716",
        endDate: new Date(2021, 6, 3),
        projectEndDate: new Date(2020, 6, 1),
        projectName: "Bradbury",
        projectStartDate: new Date(2020, 5, 1),
        resourceId: "f07d883b-1f17-4b1c-b78d-75c62d801976",
        resourceRequestId: "051b0af8-802a-4a2f-9775-c94312b979e1",
        staffedHours: "7",
        startDate: new Date(2021, 6, 2),
        tentative: false,
        title: "Design",
        type: "#add8e6",
        requestDisplayId: ""
    };
    allAssignments.push(assignment1, assignment2);

    var allHeaders = [
        {
            assignmentDay: "2021-08-01",
            capacityHours: 8,
            color: "#dc0d0e",
            endDate: new Date(2022, 7, 1),
            staffedHours: 4,
            startDate: new Date(2022, 7, 1)
        },
        {
            assignmentDay: "2022-08-02",
            capacityHours: 8,
            color: "#3fa45b",
            endDate: new Date(2022, 7, 2),
            staffedHours: 7,
            startDate: new Date(2022, 7, 2)
        }
    ];

    var monthAssignment1 = {
        assignmentId: "fdff276b-904b-44e8-b9db-9cddbb99b13c",
        employeeId: "6ed817cc-136a-45be-9b94-790663447716",
        resourceRequestId: "051b0af8-802a-4a2f-9775-c94312b979e1",
        startDate: new Date(2021, 6, 2),
        endDate: new Date(2021, 9, 2),
        requestDisplayId: "f07d883b-1f17-4b1c-b78d-75c62d801976",
        projectName: "Bradbury",
        customerName: "iTelO",
        assignmentStatusCode: 1,
        assignmentStatus: "Soft-Booked",
        title: "Design",
        assignmentStartDate: new Date(2021, 6, 2),
        assignmentEndDate: new Date(2021, 9, 2),
        assignmentStartDay: "2021-06-02",
        assignmentEndDay: "2021-09-02",
        staffedHours: "500",
        type: "#add8e6",
        tentative: true
    };

    var monthAssignment2 = {
        assignmentId: "fdff276b-904b-44e8-b9db-9cddbb99b13c",
        employeeId: "6ed817cc-136a-45be-9b94-790663447716",
        resourceRequestId: "051b0af8-802a-4a2f-9775-c94312b979e1",
        startDate: new Date(2022, 10, 5),
        endDate: new Date(2023, 3, 10),
        requestDisplayId: "f07d883b-1f17-4b1c-b78d-75c62d801976",
        projectName: "Valiant",
        customerName: "iTelO",
        assignmentStatusCode: 0,
        assignmentStatus: "Hard-Booked",
        title: "Concept",
        assignmentStartDate: new Date(2022, 10, 5),
        assignmentEndDate: new Date(2023, 3, 10),
        assignmentStartDay: "2022-10-05",
        assignmentEndDay: "2022-03-05",
        staffedHours: "250",
        type: "#add8e6",
        tentative: false
    };
    allMonthAssignments.push(monthAssignment1, monthAssignment2);


    QUnit.module("Controller", {
        beforeEach: function () {
            this.oAppController = new Controller();

            var oJsonModelStub = new JSONModel({
                minDate: oneYearPastFromNow,
                maxDate: oneYearFromNow,
                myAssignments: [{
                    assignments: allAssignments,
                    headers: allHeaders,
                    allAssignments: allAssignments,
                    allMonthAssignments: allMonthAssignments,
                    allHeaders: allHeaders
                }],
                legendItems: _AllLegendItems,
                legendAppointmentItems: []
            });
            this.oAssignDataManagerStub = {
                fetchTableData: function () {
                    return;
                }
            };
            this.oResourceBundle = new ResourceModel({
                bundleUrl: jQuery.sap.getModulePath("", "/i18n/i18n.properties")
            }).getResourceBundle();

            this.oAppController.getModel = sinon.stub();
            this.oAppController.getResourceBundle = sinon.stub().returns(this.oResourceBundle);
            this.oAppController.getModel.withArgs('oDataV4Model')
                .returns(sinon.stub());
            this.oAppController.getModel.withArgs('stateModel').returns(undefined);
            this.oAppController.setModelProperty = sinon.stub();
            this.oAppController.getModelProperty = sinon.stub();
            this.oAppController.getI18nText = sinon.stub();

            this.oViewStub = {
                // eslint-disable-next-line consistent-return
                byId: function (ID) {
                    if (ID == 'MyPlanningCalendar') {
                        return {
                            getStartDate: function () {
                                return sinon.stub();
                            },
                            getEndDate: function () {
                                return sinon.stub();
                            }
                        };
                    }
                },
                getModel: function (ID) {
                    if (!ID) {
                        return {
                            getProperty: function () {
                                return oJsonModelStub.getProperty("/myAssignments");
                            },
                            setProperty: function () {
                            }
                        };
                    }
                }
            };

            this.oViewStub.setBusyIndicatorDelay = sinon.stub();
            this.oViewStub.setBusy = sinon.stub();
            this.oViewStub.addDependent = function () { };
            this.oViewStub.setModel = function () { };
            this.oViewStub.getModel.setProperty = function () { };
            this.oGetViewStub = sinon.stub(this.oAppController, "getView").returns(this.oViewStub);
            this.oFetchTableDataStub = sinon.stub(this.oAssignDataManagerStub, "fetchTableData").returns(Promise.resolve());
            this.instanceCalled = sinon.stub(this.oAppController, "getAssignDataManagerInstance").returns(this.oAssignDataManagerStub);

        },
        afterEach: function () {
            this.oAppController.getView.restore();
            this.oAppController.getAssignDataManagerInstance.restore();
            this.oAppController.destroy();
            this.oFetchTableDataStub.restore();
            this.instanceCalled.restore();
        }
    });

    QUnit.test("QUnit: Should initialize its controller correctly", function (assert) {
        var setModelStub = sinon.stub(this.oViewStub, "setModel");
        this.oAppController.onInit();

        assert.equal(this.oAppController.getModel("stateModel"), this.oAppController.oStateModel, "The initialized model is set on the view with the name 'stateModel'");
        assert.ok(this.instanceCalled.calledOnce, "'getAssignDataManagerInstance' method called once");
        assert.ok(this.oFetchTableDataStub.calledOnce, "'fetchTableData' method called once");
        assert.ok(setModelStub.callCount, 3, "setModel called for myAssignmentsModel and stateModel");

    });

    QUnit.test("Should handle select assignment correctly", function (assert) {

        var ohandleAssignmentEventStub = {
            getParameter: sinon.stub()
        };

        ohandleAssignmentEventStub.getParameter.withArgs("appointment").returns("oAppointment");
        var oSingleSelectionStub = sinon.stub(this.oAppController, "_handleSingleAssignmentSelection");
        this.oAppController.onInit();
        this.oAppController.handleAssignmentSelect(ohandleAssignmentEventStub);

        assert.ok(oSingleSelectionStub.calledOnce, "'_handleSingleAssignmentSelection' method called once");
        assert.strictEqual(oSingleSelectionStub.firstCall.args[0], "oAppointment", "'_handleSingleAssignmentSelection' method called with expected parameter");
    });

    QUnit.test("Should handle select assignment correctly when clicked on non-appointment ", function (assert) {

        var ohandleAssignmentEventStub = {
            getParameter: sinon.stub()
        };

        ohandleAssignmentEventStub.getParameter.withArgs("appointment").returns(undefined);
        var oSingleSelectionStub = sinon.stub(this.oAppController, "_handleSingleAssignmentSelection");
        this.oAppController.onInit();
        this.oAppController.handleAssignmentSelect(ohandleAssignmentEventStub);

        assert.ok(oSingleSelectionStub.notCalled, "'_handleSingleAssignmentSelection' method not called for invalid appointment click");
    });

    QUnit.test("Should handle open popover for selected assignment via actual call", function (assert) {
        var fDone = assert.async(1);

        var ohandleAssignmentEventStub = {
            getParameter: sinon.stub()
        };

        var oAppointmentStub = {
            getSelected: sinon.stub(),
            getBindingContext: sinon.stub()
        };
        oAppointmentStub.getSelected.returns(oAppointmentStub);
        oAppointmentStub.getBindingContext.returns(oAppointmentStub);

        this.oViewStub.getId = function () {
            return  "application-myAssignmentsUi-Display-component---Page";
        };

        var oAddDependentStub = sinon.stub(this.oViewStub, "addDependent");
        var oLoadStub = sinon.stub(Fragment, "load").returns(new Promise(function () { }));

        this.oAppController.onInit();
        ohandleAssignmentEventStub.getParameter.withArgs("appointment").returns(oAppointmentStub);
        this.oAppController.handleAssignmentSelect(ohandleAssignmentEventStub);

        assert.ok(this.instanceCalled.calledOnce, "getAssignDataManagerInstance method called once");
        assert.ok(oAppointmentStub.getSelected.calledOnce, "method was called once");
        assert.ok(oAppointmentStub.getBindingContext.notCalled, "method was not called since in promise");
        assert.ok(oLoadStub.calledOnce, "The fragment was loaded");
        assert.ok(oAddDependentStub.notCalled, "No dialog was added to the view as a dependent");

        fDone();

        oLoadStub.restore();
    });

    QUnit.test("Should handle open popover for selected assignment and compelte promise via actual call", function (assert) {
        var fDone = assert.async(1);

        var ohandleAssignmentEventStub = {
            getParameter: sinon.stub()
        };
        var oAppointmentStub = {
            getSelected: sinon.stub(),
            getBindingContext: sinon.stub()
        };
        oAppointmentStub.getSelected.returns(oAppointmentStub);
        oAppointmentStub.getBindingContext.returns(oAppointmentStub);

        this.oViewStub.getId = function () {
            return  "application-myAssignmentsUi-Display-component---Page";
        };

        var oAddDependentStub = sinon.stub(this.oViewStub, "addDependent");

        var oLoadStub = sinon.stub(Fragment, "load").returns(
            Promise.resolve(oAddDependentStub)
        );
        var setDialogContentStub = sinon.stub(this.oAppController, '_setDetailsDialogContent');
        this.oAppController.onInit();
        ohandleAssignmentEventStub.getParameter.withArgs("appointment").returns(oAppointmentStub);
        this.oAppController.handleAssignmentSelect(ohandleAssignmentEventStub);

        setTimeout(function () {
            assert.ok(oLoadStub.calledOnce, "The fragment was loaded");
            assert.ok(oAddDependentStub.calledOnce, "Details Popover was added to the view as a dependent");
            assert.ok(setDialogContentStub.calledOnce, "_setDetailsDialogContent method called");
            oLoadStub.restore();
            fDone();
        });

    });

    QUnit.test("Should not open popover for non selected assignment via actual call", function (assert) {
        var ohandleAssignmentEventStub = {
            getParameter: sinon.stub()
        };
        this.oViewStub.getId = function () {
            return  "application-myAssignmentsUi-Display-component---Page";
        };

        var oLoadStub = sinon.stub(Fragment, "load").returns(new Promise(function () { }));

        this.oAppController.onInit();
        ohandleAssignmentEventStub.getParameter.withArgs("appointment").returns(undefined);
        this.oAppController.handleAssignmentSelect(ohandleAssignmentEventStub);

        assert.ok(oLoadStub.notCalled, "The fragment was not loaded");
    });

    QUnit.test("Should handle start date change event correctly for Months view", function (assert) {

        var fDone = assert.async(1);
        this.oViewStub.byId = function (ID) {
            return {
                getViewKey: function (){
                    return "MyMonth";
                },
                getStartDate: function () {
                    return new Date(2021, 7, 1);
                },
                getEndDate: function(){
                    return new Date(2022, 7, 7);
                }
            };
        };

        sinon.stub(this.oAppController, "byId").returns(this.oViewStub.byId);
        this.oAppController.getModelProperty.withArgs("viewModel", "/selectedCalendarMode")
            .returns("MyMonth");

        this.oAppController.onInit();
        this.oAppController.handleStartDateChange();

        setTimeout(function () {
            assert.ok(this.oFetchTableDataStub.calledOnce, "'fetchTableData' method called once.");
            assert.deepEqual(this.oAppController._aOriginalAssignments[0].allHeaders, allHeaders, "Total headers");
            assert.deepEqual(this.oAppController._aOriginalAssignments[0].allMonthAssignments, allMonthAssignments, "Total assignments");
            assert.strictEqual(this.oAppController._aOriginalAssignments[0].assignments.length, 2, "Both 'Assignments' exists");
        }.bind(this));
        fDone();
    });

    QUnit.test("Should handle start date change event correctly for Weeks view", function (assert) {

        var fDone = assert.async(1);
        this.oViewStub.byId = function (ID) {
            return {
                getViewKey: function (){
                    return "MyWeek";
                },
                getStartDate: function () {
                    return new Date(2021, 7, 1);
                },
                getEndDate: function(){
                    return new Date(2022, 7, 7);
                }
            };
        };

        sinon.stub(this.oAppController, "byId").returns(this.oViewStub.byId);
        this.oAppController.getModelProperty.withArgs("viewModel", "/selectedCalendarMode")
            .returns("MyWeek");

        this.oAppController.onInit();
        this.oAppController.handleStartDateChange();

        setTimeout(function () {
            assert.ok(this.oFetchTableDataStub.calledOnce, "'fetchTableData' method called once.");
            assert.deepEqual(this.oAppController._aOriginalAssignments[0].allHeaders, allHeaders, "Total headers");
            assert.deepEqual(this.oAppController._aOriginalAssignments[0].allAssignments, allAssignments, "Total assignments");
            assert.strictEqual(this.oAppController._aOriginalAssignments[0].assignments.length, 2, "Both 'Assignments' exists");
        }.bind(this));
        fDone();
    });

    QUnit.test("Should handle start date change event correctly when data already prefetched and searchQuery is null", function (assert) {

        this.oViewStub.byId = function (ID) {
            return {
                getViewKey: function () {
                    return "MyWeek";
                },
                getStartDate: function () {
                    return new Date(2022, 7, 1);
                },
                getEndDate: function(){
                    return new Date(2022, 7, 2);
                }
            };
        };

        sinon.stub(this.oAppController, "byId").returns(this.oViewStub.byId);
        this.oAppController.getModelProperty.withArgs("viewModel", "/selectedCalendarMode")
            .returns("MyWeek");

        this.oAppController.onInit();
        this.oAppController.handleStartDateChange();

        assert.ok(this.instanceCalled.calledOnce, "'getAssignDataManagerInstance' method called once");
        assert.ok(this.oFetchTableDataStub.calledOnce, "'fetchTableData' method called once during initilization.");
        assert.deepEqual(this.oAppController._aOriginalAssignments[0].allHeaders, allHeaders, "Total headers");
        assert.deepEqual(this.oAppController._aOriginalAssignments[0].allAssignments, allAssignments, "Total assignments");

        assert.strictEqual(this.oAppController._aOriginalAssignments[0].assignments[0], assignment2, "After filtered only one 'Assignments' left for date '2022-08-02'");
        assert.strictEqual(this.oAppController._aOriginalAssignments[0].assignments.length, 1, "After filtered only one 'Assignments' left for date '2022-08-02'");
        assert.strictEqual(this.oAppController._aOriginalAssignments[0].headers[0], allHeaders[1], "After filtered only one 'Headers' left for date '2022-08-02'");
        assert.strictEqual(this.oAppController._aOriginalAssignments[0].headers.length, 1, "After filtered only one 'Headers' left for date '2022-08-02'");
    });

    QUnit.test("Should handle search assignment correctly with key 'Design' for Weeks view", function (assert) {

        var oSearchEventStub = {
            getSource: function () {
                return {
                    getValue: function () {
                        return 'Design';
                    }
                };
            }
        };
        this.oViewStub.byId = function (ID) {
            return {
                getStartDate: function () {
                    return new Date(2022, 7, 1);
                },
                getEndDate: function(){
                    return new Date(2022, 7, 2);
                }
            };
        };

        sinon.stub(this.oAppController, "byId").returns(this.oViewStub.byId);
        this.oAppController.getModelProperty.withArgs("viewModel", "/selectedCalendarMode")
            .returns("MyWeek");
        var setPropertyStub = sinon.stub(this.oViewStub.getModel, "setProperty");

        this.oAppController.onInit();
        this.oAppController.onSearch(oSearchEventStub);

        assert.deepEqual(this.oAppController._aOriginalAssignments[0].headers, allHeaders);
        assert.deepEqual(this.oAppController._aOriginalAssignments[0].allAssignments, allAssignments, "Total assignments");
        assert.strictEqual(this.oAppController._aOriginalAssignments[0].assignments[0], assignment2, "After serach with key 'Design' only assignment2 will be present");
        assert.strictEqual(this.oAppController._aOriginalAssignments[0].assignments.length, 1, "After serach with key 'Design' only one result left");
        assert.strictEqual(this.oAppController.searchQuery, 'Design', "'searchQuery' value set to 'Design'");
        assert.strictEqual(setPropertyStub.calledOnce, false, "'setProperty' method called once");

    });

    QUnit.test("Should handle search assignment correctly with key 'Design' for months view", function (assert) {

        var oSearchEventStub = {
            getSource: function () {
                return {
                    getValue: function () {
                        return 'Design';
                    }
                };
            }
        };
        this.oViewStub.byId = function (ID) {
            return {
                getStartDate: function () {
                    return new Date(2022, 7, 1);
                },
                getEndDate: function(){
                    return new Date(2022, 9, 2);
                }
            };
        };

        sinon.stub(this.oAppController, "byId").returns(this.oViewStub.byId);
        this.oAppController.getModelProperty.withArgs("viewModel", "/selectedCalendarMode")
            .returns("MyMonth");
        var setPropertyStub = sinon.stub(this.oViewStub.getModel, "setProperty");

        this.oAppController.onInit();
        this.oAppController.onSearch(oSearchEventStub);

        assert.deepEqual(this.oAppController._aOriginalAssignments[0].headers, allHeaders);
        assert.deepEqual(this.oAppController._aOriginalAssignments[0].allAssignments, allAssignments, "Total assignments");
        assert.strictEqual(this.oAppController._aOriginalAssignments[0].assignments[0], monthAssignment1, "After serach with key 'Design' only month assignment 1 will be present");
        assert.strictEqual(this.oAppController._aOriginalAssignments[0].assignments.length, 1, "After serach with key 'Design' only one result left");
        assert.strictEqual(this.oAppController.searchQuery, 'Design', "'searchQuery' value set to 'Design'");
        assert.strictEqual(setPropertyStub.calledOnce, false, "'setProperty' method called once");

    });

    QUnit.test("Should handle start date change event correctly when data already prefetched after searchQuery 'Design' present for Weeks View", function (assert) {

        this.oViewStub.byId = function (ID) {
            return {
                getViewKey: function (){
                    return "MyWeek";
                },
                getStartDate: function () {
                    return new Date(2022, 7, 1);
                },
                getEndDate: function(){
                    return new Date(2022, 7, 2);
                }
            };
        };

        sinon.stub(this.oAppController, "byId").returns(this.oViewStub.byId);
        this.oAppController.getModelProperty.withArgs("viewModel", "/selectedCalendarMode")
            .returns("MyWeek");

        this.oAppController.onInit();
        this.oAppController.handleStartDateChange();


        assert.ok(this.instanceCalled.calledOnce, "'getAssignDataManagerInstance' method called once");
        assert.ok(this.oFetchTableDataStub.calledOnce, "'fetchTableData' method called once during initilization.");
        assert.deepEqual(this.oAppController._aOriginalAssignments[0].allHeaders, allHeaders, "Total headers");
        assert.deepEqual(this.oAppController._aOriginalAssignments[0].allAssignments, allAssignments, "Total assignments");

        assert.strictEqual(this.oAppController._aOriginalAssignments[0].assignments[0], assignment2, "After filtered only one 'Assignments' left for date '2022-08-02'");
        assert.strictEqual(this.oAppController._aOriginalAssignments[0].assignments.length, 1, "After filtered only one 'Assignments' left for date '2022-08-02'");
        assert.strictEqual(this.oAppController._aOriginalAssignments[0].headers[0], allHeaders[1], "After filtered only one 'Headers' left for date '2022-08-02'");
        assert.strictEqual(this.oAppController._aOriginalAssignments[0].headers.length, 1, "After filtered only one 'Headers' left for date '2022-08-02'");
    });

    QUnit.test("Should handle start date change event correctly when data already prefetched after searchQuery 'Design' present for Months View", function (assert) {

        this.oViewStub.byId = function (ID) {
            return {
                getViewKey: function (){
                    return "MyWeek";
                },
                getStartDate: function () {
                    return new Date(2022, 7, 1);
                },
                getEndDate: function(){
                    return new Date(2022, 9, 2);
                }
            };
        };

        sinon.stub(this.oAppController, "byId").returns(this.oViewStub.byId);
        this.oAppController.getModelProperty.withArgs("viewModel", "/selectedCalendarMode")
            .returns("MyMonth");

        this.oAppController.onInit();
        this.oAppController.handleStartDateChange();


        assert.ok(this.instanceCalled.calledOnce, "'getAssignDataManagerInstance' method called once");
        assert.ok(this.oFetchTableDataStub.calledOnce, "'fetchTableData' method called once during initilization.");
        assert.deepEqual(this.oAppController._aOriginalAssignments[0].allHeaders, allHeaders, "Total headers");
        assert.deepEqual(this.oAppController._aOriginalAssignments[0].allAssignments, allAssignments, "Total assignments");

        assert.strictEqual(this.oAppController._aOriginalAssignments[0].assignments[0], monthAssignment1, "After filtered only one 'Assignments' left");
        assert.strictEqual(this.oAppController._aOriginalAssignments[0].headers[0], allHeaders[1], "After filtered only one 'Headers' left");
        assert.strictEqual(this.oAppController._aOriginalAssignments[0].headers.length, 1, "After filtered only one 'Headers' left");
    });

    QUnit.test("Should handle search assignment correctly with random value", function (assert) {

        var oSearchEventStub = {
            getSource: function () {
                return {
                    getValue: function () {
                        return 'random9';
                    }
                };
            }
        };
        this.oViewStub.byId = function (ID) {
            return {
                getStartDate: function () {
                    return new Date(2022, 7, 1);
                },
                getEndDate: function(){
                    return new Date(2022, 7, 2);
                }
            };
        };

        sinon.stub(this.oAppController, "byId").returns(this.oViewStub.byId);
        this.oAppController.onInit();
        this.oAppController.onSearch(oSearchEventStub);

        assert.deepEqual(this.oAppController._aOriginalAssignments[0].headers, allHeaders);
        assert.deepEqual(this.oAppController._aOriginalAssignments[0].allAssignments, allAssignments, "Total assignments");
        assert.strictEqual(this.oAppController._aOriginalAssignments[0].assignments.length, 0, "After serach with random value, No result");

    });

    QUnit.test("Should handle search assignment correctly with valid key", function (assert) {

        this.oViewStub.byId = function (ID) {
            return {
                getStartDate: function () {
                    return new Date(2021, 7, 1);
                },
                getEndDate: function(){
                    return new Date(2021, 7, 2);
                }
            };
        };
        var oSearchEventStub = {
            getSource: function () {
                return {
                    getValue: function () {
                        return 'Concept';
                    }
                };
            }
        };

        sinon.stub(this.oAppController, "byId").returns(this.oViewStub.byId);
        this.oAppController.onInit();
        this.oAppController.onSearch(oSearchEventStub);

        assert.deepEqual(this.oAppController._aOriginalAssignments[0].headers, allHeaders);
        assert.deepEqual(this.oAppController._aOriginalAssignments[0].allAssignments, allAssignments, "Total assignments");
        assert.strictEqual(this.oAppController._aOriginalAssignments[0].assignments.length, 1, "After search with key 'Concept' only one result left");
        assert.strictEqual(this.oAppController.searchQuery, 'Concept', "'searchQuery' value set to 'Concept'");

    });

    QUnit.test("Should handle search assignment correctly with space value key", function (assert) {

        this.oViewStub.byId = function (ID) {
            return {
                getStartDate: function () {
                    return new Date(2021, 7, 1);
                },
                getEndDate: function(){
                    return new Date(2022, 7, 2);
                }
            };
        };
        var oSearchEventStub = {
            getSource: function () {
                return {
                    getValue: function () {
                        return ' ';
                    }
                };
            }
        };

        sinon.stub(this.oAppController, "byId").returns(this.oViewStub.byId);
        this.oAppController.onInit();
        this.oAppController.onSearch(oSearchEventStub);

        assert.deepEqual(this.oAppController._aOriginalAssignments[0].allAssignments, allAssignments, "Total assignments");
        assert.strictEqual(this.oAppController._aOriginalAssignments[0].assignments.length, 2, "After search with key blank value no change in result");
        assert.strictEqual(this.oAppController.searchQuery, '', "'searchQuery' value set to blank");

    });


});
