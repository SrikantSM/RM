sap.ui.define([
    'myAssignmentsUi/utils/AssignmentDataManager',
    'myAssignmentsUi/utils/DataTransformer',
    'sap/ui/model/json/JSONModel',
    "sap/ui/thirdparty/sinon",
    "sap/ui/model/resource/ResourceModel",
    "myAssignmentsUi/controller/Page.controller"
], function(AssignmentDataManager, DataTransformer, JSONModel, sinon, ResourceModel, Controller) {
    'use strict';

    var _AllLegendItems = [];
    var expectedAllAssignments = [];
    var expectedMonthAssignments = [];
    var _AllAssignments = {_assignments: [], _headers: []};
    var _AllProjectItems = [];
    this._AllAssignmentItems = [];
    var oneYearFromNow = new Date(new Date().getFullYear(), 11, 31);
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    var oneYearPastFromNow = new Date(new Date().getFullYear(), 0, 1);
    oneYearPastFromNow.setFullYear(oneYearPastFromNow.getFullYear() - 1);
    oneYearPastFromNow = oneYearPastFromNow.toISOString().split('T')[0];
    oneYearFromNow = oneYearFromNow.toISOString().split('T')[0];

    var getFilledProjectItemStub,
        getFilledAssignmentItemsStub,
        prepareCalendarDataStub;


    var expectedAssignment1 = {
        assignmentDay: "2022-07-01",
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
        assignmentStatus: "",
        type: "#add8e6",
        requestDisplayId: ""
    };

    var expectedAssignment2 = {
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
        assignmentStatus: "",
        type: "#add8e6",
        requestDisplayId: ""
    };
    expectedAllAssignments.push(expectedAssignment1, expectedAssignment2);

    var expectedMonthAssignment1 = {
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
        assignmentStartDate: new Date(2022, 6, 1),
        assignmentEndDate: new Date(2022, 6, 1),
        assignmentStartDay: "2022-07-01",
        assignmentEndDay: "2022-07-01",
        staffedHours: "500",
        type: "#add8e6",
        tentative: true
    };

    var expectedMonthAssignment2 = {
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
        assignmentEndDay: "2023-03-05",
        staffedHours: "250",
        type: "#add8e6",
        tentative: false
    };
    expectedMonthAssignments.push(expectedMonthAssignment1, expectedMonthAssignment2);

    var expectedAllHeaders = [
        {
            assignmentDay: "2022-07-01",
            capacityHours: 8,
            color: "#dc0d0e",
            endDate: new Date(2021, 6, 1),
            month: 6,
            monthEndDate: new Date(2021, 7, 1),
            monthStartDate: new Date(2021, 6, 1),
            monthlyCapacityHours: 6,
            monthlyStaffedHours: 2,
            staffedHours: 4,
            startDate: new Date(2021, 6, 2)
        },
        {
            assignmentDay: "2022-08-02",
            capacityHours: 8,
            color: "#3fa45b",
            endDate: new Date(2021, 6, 2),
            month: 7,
            monthEndDate: new Date(2021, 7, 1),
            monthStartDate: new Date(2021, 6, 1),
            monthlyCapacityHours: 6,
            monthlyStaffedHours: 2,
            staffedHours: 7,
            startDate: new Date(2021, 6, 3)
        }
    ];

    _AllLegendItems = [
        {
            color: "#3fa45b",
            text: "MODERATE_UTLILISATION",
            type: "Type02"
        },
        {
            color: "#f5b04d",
            text: "LOW_UTLILISATION",
            type: "Type01"
        },
        {
            color: "#dc0d0e",
            text: "HIGH_UTLILISATION",
            type: "Type03"
        }
    ];

    var __AllLegendAppointmentItems = [
        {
            text: "HARD_BOOKED",
            type: "Type04",
            color: "#1093a2"
        },
        {
            text: "SOFT_BOOKED",
            type: "Type05",
            color: "#ffffff"
        }
    ];

    QUnit.module("AssignmentDataManager", {
        beforeEach: function () {

            this.oAppController = new Controller();
            this.oAppController.getModelProperty = sinon.stub();
            this.oResourceBundle = new ResourceModel({
                bundleUrl: jQuery.sap.getModulePath("", "/i18n/i18n.properties")
            }).getResourceBundle();

            this.oDataModel = new JSONModel({}, true);
            this.AssignmentDataManager = new AssignmentDataManager(this.oDataModel, this.oResourceBundle);
        }
    });

    QUnit.test("QUnit: I should test the constructor and myAssignments model initialize correctly", function (assert) {
        var oneYearFromNowTemp = new Date(new Date().getFullYear(), 11, 31);
        oneYearFromNowTemp.setFullYear(oneYearFromNowTemp.getFullYear() + 1);
        var oneYearPastFromNowTemp = new Date(new Date().getFullYear(), 0, 1);
        oneYearPastFromNowTemp.setFullYear(oneYearPastFromNowTemp.getFullYear() - 1);

        var oExpectedAssignmentsModel = {
            minDate: oneYearPastFromNowTemp,
            maxDate: oneYearFromNowTemp,
            myAssignments: [{
                assignments: [],
                headers: [],
                allAssignments: [],
                allMonthAssignments: [],
                allHeaders: []
            }],
            legendItems: _AllLegendItems,
            legendAppointmentItems: __AllLegendAppointmentItems
        };

        assert.ok(this.AssignmentDataManager, "Instance for AssignmentDataManager created successful");
        assert.propEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/'), oExpectedAssignmentsModel, "The myAssignmentsModel is initialized with correct values");
        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/legendItems').length, 3, "The myAssignmentsModel is initialized with correct values");
        assert.deepEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/legendItems'), _AllLegendItems, "The myAssignmentsModel is initialized with correct values");
        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getData().maxDate.toISOString().split('T')[0], oneYearFromNow, "Planning calendar maxDate is +1 years from today");
        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getData().minDate.toISOString().split('T')[0], oneYearPastFromNow, "Planning calendar minDate is -1 years from today");

    });

    QUnit.test("QUnit: I should call fetchTableData without date and if NO data fetched for current week then no call to DataTransformer", function (assert) {

        var fDone = assert.async(1);
        var oListItemStub = {
            requestContexts: function () {
                return Promise.resolve([]);
            },
            getLength: function () {
                return;
            }
        };
        var oContextStub = {
            requestObject: function () {
                return Promise.resolve("");
            }
        };

        sinon.stub(this.AssignmentDataManager._oODataModel, "bindContext").returns(oContextStub);
        sinon.stub(this.AssignmentDataManager._oODataModel, "bindList").returns(oListItemStub);
        getFilledProjectItemStub = sinon.stub(DataTransformer, 'getFilledProjectItem').returns(_AllProjectItems);
        getFilledAssignmentItemsStub = sinon.stub(DataTransformer, 'getFilledAssignmentItems').returns(this._AllAssignmentItems);
        prepareCalendarDataStub = sinon.stub(DataTransformer, 'prepareCalendarData').returns(_AllAssignments);
        this.oAppController.getModelProperty.withArgs("viewModel", "/selectedCalendarMode")
            .returns("MyWeek");


        this.AssignmentDataManager.fetchTableData(undefined, undefined, this.oAppController);

        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/legendItems').length, 3, "The myAssignmentsModel is initialized with correct values");

        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getData().maxDate.toISOString().split('T')[0], oneYearFromNow, "Planning calendar maxDate is +1 years from today");
        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getData().minDate.toISOString().split('T')[0], oneYearPastFromNow, "Pleanning calendar minDate is -1 years from today");

        setTimeout(function () {
            assert.ok(getFilledProjectItemStub.notCalled, "'getFilledProjectItem' was NOT called");
            // assert.ok(getFilledAssignmentItemsStub.notCalled, "Method 'getFilledAssignmentItems' was NOT called");
            assert.ok(prepareCalendarDataStub.calledOnce, true, "Method 'prepareCalendarData' was called once");
            fDone();
            prepareCalendarDataStub.restore();
            getFilledProjectItemStub.restore();
            getFilledAssignmentItemsStub.restore();
        });

    });

    QUnit.test("QUnit: I should call fetchTableData without date and if NO data fetched for current months duration then no call to DataTransformer", function (assert) {

        var fDone = assert.async(1);
        var oListItemStub = {
            requestContexts: function () {
                return Promise.resolve([]);
            },
            getLength: function () {
                return;
            }
        };
        var oContextStub = {
            requestObject: function () {
                return Promise.resolve("");
            }
        };

        sinon.stub(this.AssignmentDataManager._oODataModel, "bindContext").returns(oContextStub);
        sinon.stub(this.AssignmentDataManager._oODataModel, "bindList").returns(oListItemStub);
        getFilledProjectItemStub = sinon.stub(DataTransformer, 'getFilledProjectItem').returns(_AllProjectItems);
        getFilledAssignmentItemsStub = sinon.stub(DataTransformer, 'getFilledAssignmentItems').returns(this._AllAssignmentItems);
        prepareCalendarDataStub = sinon.stub(DataTransformer, 'prepareCalendarData').returns(_AllAssignments);
        this.oAppController.getModelProperty.withArgs("viewModel", "/selectedCalendarMode")
            .returns("MyMonth");


        this.AssignmentDataManager.fetchTableData(undefined, undefined);

        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/legendItems').length, 3, "The myAssignmentsModel is initialized with correct values");

        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getData().maxDate.toISOString().split('T')[0], oneYearFromNow, "Planning calendar maxDate is +1 years from today");
        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getData().minDate.toISOString().split('T')[0], oneYearPastFromNow, "Pleanning calendar minDate is -1 years from today");

        setTimeout(function () {
            assert.ok(getFilledProjectItemStub.notCalled, "'getFilledProjectItem' was NOT called");
            // assert.ok(getFilledAssignmentItemsStub.notCalled, "Method 'getFilledAssignmentItems' was NOT called");
            assert.ok(prepareCalendarDataStub.calledOnce, true, "Method 'prepareCalendarData' was called once");
            fDone();
            prepareCalendarDataStub.restore();
            getFilledProjectItemStub.restore();
            getFilledAssignmentItemsStub.restore();
        });

    });

    QUnit.test("QUnit: I should call fetchTableData without date and if data fetched for current week then call made to DataTransformer", function (assert) {

        var fDone = assert.async(1);
        var oListItemStub = {
            requestContexts: function () {
                return Promise.resolve(['DataTransformer']);
            },
            getLength: function () {
                return 12;
            }
        };
        var oContextStub = {
            requestObject: function () {
                return Promise.resolve("");
            }
        };

        var dateFilter = {
            oDateFrom: "2022-07-01",
            oDateTo: "2022-08-02"
        };

        var fetchDataRange = {
            start: new Date(2022, 7, 1),
            end: new Date(2022, 7, 2)
        };
        var oneYearFromNowTemp = new Date(new Date().getFullYear(), 11, 31);
        oneYearFromNowTemp.setFullYear(oneYearFromNowTemp.getFullYear() + 1);
        var oneYearPastFromNowTemp = new Date(new Date().getFullYear(), 0, 1);
        oneYearPastFromNowTemp.setFullYear(oneYearPastFromNowTemp.getFullYear() - 1);
        var oExpectedAssignmentsModel = {
            minDate: oneYearPastFromNowTemp,
            maxDate: oneYearFromNowTemp,
            myAssignments: [{
                assignments: [],
                headers: [],
                allAssignments: [],
                allMonthAssignments: [],
                allHeaders: []
            }],
            legendItems: _AllLegendItems,
            legendAppointmentItems: __AllLegendAppointmentItems
        };
        _AllAssignments = {_assignments: expectedAllAssignments, _headers: expectedAllHeaders};

        sinon.stub(this.AssignmentDataManager._oODataModel, "bindContext").returns(oContextStub);
        sinon.stub(this.AssignmentDataManager._oODataModel, "bindList").returns(oListItemStub);
        getFilledProjectItemStub = sinon.stub(DataTransformer, 'getFilledProjectItem').returns(_AllProjectItems);
        getFilledAssignmentItemsStub = sinon.stub(DataTransformer, 'getFilledAssignmentItems').returns(this._AllAssignmentItems);
        prepareCalendarDataStub = sinon.stub(DataTransformer, 'prepareCalendarData').returns(_AllAssignments);
        this.oAppController.getModelProperty.withArgs("viewModel", "/selectedCalendarMode")
            .returns("MyWeek");

        this.AssignmentDataManager.fetchTableData(dateFilter, fetchDataRange, this.oAppController);

        assert.propEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/'), oExpectedAssignmentsModel, "The myAssignmentsModel is initialized with correct values");
        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/legendItems').length, 3, "The myAssignmentsModel is initialized with correct values");
        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getData().maxDate.toISOString().split('T')[0], oneYearFromNow, "Planning calendar maxDate is +1 years from today");
        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getData().minDate.toISOString().split('T')[0], oneYearPastFromNow, "Pleanning calendar minDate is -1 years from today");

        setTimeout(function () {
            assert.ok(getFilledProjectItemStub.calledOnce, "'getFilledProjectItem' was called once");
            assert.ok(getFilledAssignmentItemsStub.calledOnce, "Method 'getFilledAssignmentItems' was called");
            assert.ok(prepareCalendarDataStub.calledOnce, "Method 'prepareCalendarData' was called once");

            assert.deepEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/myAssignments')[0].assignments, expectedAllAssignments, "The myAssignmentsModel is set with correct values");
            assert.deepEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/myAssignments')[0].headers, expectedAllHeaders, "The myAssignmentsModel is set with correct values");
            prepareCalendarDataStub.restore();
            getFilledProjectItemStub.restore();
            getFilledAssignmentItemsStub.restore();

            fDone();
        }.bind(this));


    });

    QUnit.test("QUnit: I should call fetchTableData without date and if data fetched for current month duration then call made to DataTransformer", function (assert) {

        var fDone = assert.async(1);
        var oListItemStub = {
            requestContexts: function () {
                return Promise.resolve(['DataTransformer']);
            },
            getLength: function () {
                return 12;
            }
        };
        var oContextStub = {
            requestObject: function () {
                return Promise.resolve("");
            }
        };

        var dateFilter = {
            oDateFrom: "2022-05-01",
            oDateTo: "2023-12-02"
        };

        var fetchDataRange = {
            start: new Date(2022, 4, 1),
            end: new Date(2023, 11, 2)
        };
        var oneYearFromNowTemp = new Date(new Date().getFullYear(), 11, 31);
        oneYearFromNowTemp.setFullYear(oneYearFromNowTemp.getFullYear() + 1);
        var oneYearPastFromNowTemp = new Date(new Date().getFullYear(), 0, 1);
        oneYearPastFromNowTemp.setFullYear(oneYearPastFromNowTemp.getFullYear() - 1);
        var oExpectedAssignmentsModel = {
            minDate: oneYearPastFromNowTemp,
            maxDate: oneYearFromNowTemp,
            myAssignments: [{
                assignments: [],
                headers: [],
                allAssignments: [],
                allMonthAssignments: [],
                allHeaders: []
            }],
            legendItems: _AllLegendItems,
            legendAppointmentItems: __AllLegendAppointmentItems
        };
        _AllAssignments = {_assignments: expectedAllAssignments, _headers: expectedAllHeaders};

        sinon.stub(this.AssignmentDataManager._oODataModel, "bindContext").returns(oContextStub);
        sinon.stub(this.AssignmentDataManager._oODataModel, "bindList").returns(oListItemStub);
        getFilledProjectItemStub = sinon.stub(DataTransformer, 'getFilledProjectItem').returns(_AllProjectItems);
        getFilledAssignmentItemsStub = sinon.stub(DataTransformer, 'getFilledAssignmentItems').returns(this._AllAssignmentItems);
        prepareCalendarDataStub = sinon.stub(DataTransformer, 'prepareCalendarData').returns(_AllAssignments);
        this.oAppController.getModelProperty.withArgs("viewModel", "/selectedCalendarMode")
            .returns("MyMonth");

        this.AssignmentDataManager.fetchTableData(dateFilter, fetchDataRange, this.oAppController);

        assert.propEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/'), oExpectedAssignmentsModel, "The myAssignmentsModel is initialized with correct values");
        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/legendItems').length, 3, "The myAssignmentsModel is initialized with correct values");
        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getData().maxDate.toISOString().split('T')[0], oneYearFromNow, "Planning calendar maxDate is +1 years from today");
        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getData().minDate.toISOString().split('T')[0], oneYearPastFromNow, "Pleanning calendar minDate is -1 years from today");

        setTimeout(function () {
            assert.ok(getFilledProjectItemStub.calledOnce, "'getFilledProjectItem' was called once");
            assert.ok(getFilledAssignmentItemsStub.calledOnce, "Method 'getFilledAssignmentItems' was called");
            assert.ok(prepareCalendarDataStub.calledOnce, "Method 'prepareCalendarData' was called once");

            assert.deepEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/myAssignments')[0].headers, expectedAllHeaders, "The myAssignmentsModel is set with correct values");
            prepareCalendarDataStub.restore();
            getFilledProjectItemStub.restore();
            getFilledAssignmentItemsStub.restore();

            fDone();
        }.bind(this));


    });

    QUnit.test("QUnit: I should able to call fetchTableData for particular date and search key for Weeks view", function (assert) {
        var fDone = assert.async(1);
        var oListItemStub = {
            requestContexts: function () {
                return Promise.resolve(['DataTransformer']);
            },
            getLength: function () {
                return 12;
            }
        };
        var oContextStub = {
            requestObject: function () {
                return Promise.resolve("");
            }
        };

        var oneYearFromNowTemp = new Date(new Date().getFullYear(), 11, 31);
        oneYearFromNowTemp.setFullYear(oneYearFromNowTemp.getFullYear() + 1);
        var oneYearPastFromNowTemp = new Date(new Date().getFullYear(), 0, 1);
        oneYearPastFromNowTemp.setFullYear(oneYearPastFromNowTemp.getFullYear() - 1);
        var dateFilter = {
            oDateFrom: "2022-07-01",
            oDateTo: "2022-10-02"
        };

        var fetchDataRange = {
            start: new Date(2022, 6, 1),
            end: new Date(2022, 9, 2)
        };

        var oExpectedAssignmentsModel = {
            minDate: oneYearPastFromNowTemp,
            maxDate: oneYearFromNowTemp,
            myAssignments: [{
                assignments: [],
                headers: [],
                allAssignments: [],
                allMonthAssignments: [],
                allHeaders: []
            }],
            legendItems: _AllLegendItems,
            legendAppointmentItems: __AllLegendAppointmentItems
        };
        _AllAssignments = {_assignments: expectedAllAssignments, _headers: expectedAllHeaders};
        getFilledProjectItemStub = sinon.stub(DataTransformer, 'getFilledProjectItem').returns(_AllProjectItems);
        getFilledAssignmentItemsStub = sinon.stub(DataTransformer, 'getFilledAssignmentItems').returns(this._AllAssignmentItems);
        prepareCalendarDataStub = sinon.stub(DataTransformer, 'prepareCalendarData').returns(_AllAssignments);

        sinon.stub(this.AssignmentDataManager._oODataModel, "bindContext").returns(oContextStub);
        sinon.stub(this.AssignmentDataManager._oODataModel, "bindList").returns(oListItemStub);
        this.oAppController.getModelProperty.withArgs("viewModel", "/selectedCalendarMode")
            .returns("MyWeek");
        this.oAppController.searchQuery = "Concept";
        this.AssignmentDataManager.fetchTableData(dateFilter, fetchDataRange, this.oAppController);

        assert.propEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/'), oExpectedAssignmentsModel, "The myAssignmentsModel is initialized with correct values");
        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/legendItems').length, 3, "The myAssignmentsModel is initialized with correct values");

        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getData().maxDate.toISOString().split('T')[0], oneYearFromNow, "Planning calendar maxDate is +1 years from today");
        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getData().minDate.toISOString().split('T')[0], oneYearPastFromNow, "Pleanning calendar minDate is -1 years from today");

        setTimeout(function () {
            assert.ok(getFilledProjectItemStub.calledOnce, "'getFilledProjectItem' was called once");
            assert.ok(getFilledAssignmentItemsStub.calledOnce, "Method 'getFilledAssignmentItems' was called");
            assert.ok(prepareCalendarDataStub.calledOnce, "Method 'prepareCalendarData' was called once");

            assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/myAssignments')[0].assignments[0], expectedAssignment1, "The myAssignmentsModel is set with correct values");
            assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/myAssignments')[0].headers[0], expectedAllHeaders[0], "The myAssignmentsModel is set with correct values");
            prepareCalendarDataStub.restore();
            getFilledProjectItemStub.restore();
            getFilledAssignmentItemsStub.restore();
            fDone();
        }.bind(this));

    });

    QUnit.test("QUnit: I should able to call fetchTableData for particular date and search key for Months View", function (assert) {
        var fDone = assert.async(1);
        var oListItemStub = {
            requestContexts: function () {
                return Promise.resolve(['DataTransformer']);
            },
            getLength: function () {
                return 12;
            }
        };
        var oContextStub = {
            requestObject: function () {
                return Promise.resolve("");
            }
        };

        var oneYearFromNowTemp = new Date(new Date().getFullYear(), 11, 31);
        oneYearFromNowTemp.setFullYear(oneYearFromNowTemp.getFullYear() + 1);
        var oneYearPastFromNowTemp = new Date(new Date().getFullYear(), 0, 1);
        oneYearPastFromNowTemp.setFullYear(oneYearPastFromNowTemp.getFullYear() - 1);
        var dateFilter = {
            oDateFrom: "2022-07-01",
            oDateTo: "2022-10-02"
        };

        var fetchDataRange = {
            start: new Date(2022, 6, 1),
            end: new Date(2022, 9, 2)
        };

        var oExpectedAssignmentsModel = {
            minDate: oneYearPastFromNowTemp,
            maxDate: oneYearFromNowTemp,
            myAssignments: [{
                assignments: [],
                headers: [],
                allAssignments: [],
                allMonthAssignments: [],
                allHeaders: []
            }],
            legendItems: _AllLegendItems,
            legendAppointmentItems: __AllLegendAppointmentItems
        };
        _AllAssignments = {_assignments: expectedAllAssignments, _headers: expectedAllHeaders};
        getFilledProjectItemStub = sinon.stub(DataTransformer, 'getFilledProjectItem').returns(_AllProjectItems);
        getFilledAssignmentItemsStub = sinon.stub(DataTransformer, 'getFilledAssignmentItems').returns(this._AllAssignmentItems);
        prepareCalendarDataStub = sinon.stub(DataTransformer, 'prepareCalendarData').returns(_AllAssignments);

        sinon.stub(this.AssignmentDataManager._oODataModel, "bindContext").returns(oContextStub);
        sinon.stub(this.AssignmentDataManager._oODataModel, "bindList").returns(oListItemStub);
        this.oAppController.getModelProperty.withArgs("viewModel", "/selectedCalendarMode")
            .returns("MyMonth");
        this.oAppController.searchQuery = "Concept";
        this.AssignmentDataManager.fetchTableData(dateFilter, fetchDataRange, this.oAppController);

        assert.propEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/'), oExpectedAssignmentsModel, "The myAssignmentsModel is initialized with correct values");
        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/legendItems').length, 3, "The myAssignmentsModel is initialized with correct values");

        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getData().maxDate.toISOString().split('T')[0], oneYearFromNow, "Planning calendar maxDate is +1 years from today");
        assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getData().minDate.toISOString().split('T')[0], oneYearPastFromNow, "Pleanning calendar minDate is -1 years from today");

        setTimeout(function () {
            assert.ok(getFilledProjectItemStub.calledOnce, "'getFilledProjectItem' was called once");
            assert.ok(getFilledAssignmentItemsStub.calledOnce, "Method 'getFilledAssignmentItems' was called");
            assert.ok(prepareCalendarDataStub.calledOnce, "Method 'prepareCalendarData' was called once");

            assert.strictEqual(this.AssignmentDataManager.myAssignmentsModel.getProperty('/myAssignments')[0].headers[0], expectedAllHeaders[0], "The myAssignmentsModel is set with correct values");
            prepareCalendarDataStub.restore();
            getFilledProjectItemStub.restore();
            getFilledAssignmentItemsStub.restore();
            fDone();
        }.bind(this));

    });

});
