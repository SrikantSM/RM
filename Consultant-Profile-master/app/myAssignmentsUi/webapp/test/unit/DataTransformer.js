sap.ui.define([
    "sap/ui/thirdparty/sinon",
    'myAssignmentsUi/utils/DataTransformer',
    "sap/ui/model/resource/ResourceModel"
], function(sinon, DataTransformer, ResourceModel) {
    'use strict';

    QUnit.module("DataTransformer", {
    });

    QUnit.test("QUnit: I should test the getFilledAssignmentItems", function (assert) {

        var expectedResult = [ {
            assignmentDay: "2021-09-22",
            assignmentId: "1c1473a2-19d3-4814-bd47-967914832bbd",
            employeeId: "6ed817cc-136a-45be-9b94-790663447716",
            endDate: new Date(2021, 8, 23),
            resourceId: "7531c113-3497-4185-99b7-773822d5cd57",
            resourceRequestId: "9a94c38b-d1bb-4725-b483-51fd7868d10f",
            staffedHours: "2",
            startDate: new Date(2021, 8, 22)
        } ];
        var mockContext1 = {
            getObject: function () {
                return;
            }
        };

        var mockContext = [mockContext1];

        var assignmentItem = {
            AssignedHours: "2",
            ID: "01505b85-8174-4296-b750-15a0979de4b8",
            assignmentStartDate: "2021-09-22",
            assignment_ID: "1c1473a2-19d3-4814-bd47-967914832bbd",
            employee_ID: "6ed817cc-136a-45be-9b94-790663447716",
            resourceRequest_ID: "9a94c38b-d1bb-4725-b483-51fd7868d10f",
            resource_ID: "7531c113-3497-4185-99b7-773822d5cd57",
            startTime: "2021-09-22T00:00:00Z"
        };

        var mockContextStub = sinon.stub(mockContext1, "getObject").returns(assignmentItem);

        var actualResult = DataTransformer.getFilledAssignmentItems(mockContext);

        assert.deepEqual(actualResult, expectedResult, 'test assertion');
        assert.ok(mockContextStub.calledOnce, true, "Method 'getObject' was called once");

    });

    QUnit.test("QUnit: I should test the getFilledMonthAssignmentItem", function (assert) {

        var expectedResult = [ {
            assignmentId: "2e30f231-307e-4395-ab39-247da74f61cf",
            employeeId: "6ed817cc-136a-45be-9b94-790663447716",
            resourceRequestId: "3cb0c3db-e0a4-43e7-bfbb-44821e439ae6",
            startDate: new Date(2021, 8, 22),
            endDate: new Date(2021, 11, 23),
            requestDisplayId: "EWMPRD.1.1",
            projectName: "Implementation of SAP S/4HANA 1011",
            customerName: "iTelO",
            assignmentStatusCode: 0,
            assignmentStatus: "Hard-Booked",
            title: "Concept and Design",
            assignmentStartDate: new Date(2021, 8, 22),
            assignmentEndDate: new Date(2021, 11, 23),
            assignmentStartDay: "2021-09-22",
            assignmentEndDay: "2021-12-23",
            staffedHours: "715",
            requestedStartDate: "2021-01-12",
            requestedEndDate: "2099-12-31",
            type: "#1093a2",
            workItemName: "workItemName1"
        } ];
        var mockContext1 = {
            getObject: function () {
                return;
            }
        };

        var mockContext = [mockContext1];

        var assignmentItem = {
            assignment_ID: "2e30f231-307e-4395-ab39-247da74f61cf",
            startDate: "2021-09-22",
            endDate: "2021-12-23",
            employee_ID: "6ed817cc-136a-45be-9b94-790663447716",
            resourceRequest_ID: "3cb0c3db-e0a4-43e7-bfbb-44821e439ae6",
            requestDisplayId: "EWMPRD.1.1",
            requestName: "Concept and Design",
            projectName: "Implementation of SAP S/4HANA 1011",
            customerName: "iTelO",
            workPackageStartDate: "2018-01-10",
            workPackageEndDate: "2021-12-30",
            assignmentStatusCode: 0,
            assignmentStatus: "Hard-Booked",
            requestedStartDate: "2021-01-12",
            requestedEndDate: "2099-12-31",
            assignedCapacityinHour: "715",
            workItemName: "workItemName1"
        };

        var mockContextStub = sinon.stub(mockContext1, "getObject").returns(assignmentItem);

        var actualResult = DataTransformer.getFilledMonthAssignmentItem(mockContext);

        assert.deepEqual(actualResult, expectedResult, 'test assertion');
        assert.ok(mockContextStub.calledOnce, true, "Method 'getObject' was called once");

    });

    QUnit.test("QUnit: I should test the prepareCalendarData", function (assert) {
        var _AllAssignments = new Map(); // eslint-disable-line no-undef

        var expectedAssignments = [ {
            assignmentDay: "2021-09-01",
            assignmentId: "1c1473a2-19d3-4814-bd47-967914832bbd",
            capacityHours: 0,
            customerName: "iTelO",
            employeeId: "6ed817cc-136a-45be-9b94-790663447716",
            endDate: new Date(2021, 8, 23),
            projectName: "Implementation of SAP S/4HANA 1011",
            resourceId: "7531c113-3497-4185-99b7-773822d5cd57",
            resourceRequestId: "9a94c38b-d1bb-4725-b483-51fd7868d10f",
            staffedHours: "2",
            startDate: new Date(2021, 8, 22),
            tentative: false,
            title: "Design",
            assignmentStatus: "Hard-Booked",
            type: "#1093a2",
            requestDisplayId: "S4PROJ.1.1",
            assignmentStartDate: new Date(2020, 1,1),
            assignmentEndDate: new Date(2020, 1, 2),
            workItemName: "workItemName1"
        } ];

        var expectedHeaders = [ {
            assignmentDay: "2021-09-01",
            capacityHours: 6,
            weekColor: "#dc0d0e",
            monthColor: "#dc0d0e",
            endDate: new Date(2021, 8, 2),
            month: 8,
            monthEndDate: new Date(2021, 9, 1),
            monthStartDate: new Date(2021, 8, 1),
            monthlyCapacityHours: 6,
            monthlyStaffedHours: 2,
            staffedHours: 2,
            startDate: new Date(2021, 8, 1)
        }];

        var mockContext1 = {
            getObject: function () {
                return;
            }
        };

        var mockContext = [mockContext1];

        var assignmentItems = [{
            assignmentDay: "2021-09-01",
            assignmentId: "1c1473a2-19d3-4814-bd47-967914832bbd",
            employeeId: "6ed817cc-136a-45be-9b94-790663447716",
            endDate: new Date(2021, 8, 23),
            resourceId: "7531c113-3497-4185-99b7-773822d5cd57",
            resourceRequestId: "9a94c38b-d1bb-4725-b483-51fd7868d10f",
            staffedHours: "2",
            startDate: new Date(2021, 8, 22)
        }];

        var projectItems = [{
            customerName: "iTelO",
            projectName: "Implementation of SAP S/4HANA 1011",
            resourceRequestId: "9a94c38b-d1bb-4725-b483-51fd7868d10f",
            requestDisplayId: "S4PROJ.1.1",
            requestName: "Design",
            assignmentStartDate: new Date(2020, 1, 1),
            assignmentEndDate: new Date(2020, 1, 2),
            assignmentId: "1c1473a2-19d3-4814-bd47-967914832bbd",
            assignmentStatusCode: 0,
            assignmentStatus: "Hard-Booked",
            workItemName: "workItemName1"

        }];

        var capacityData = {
            capacityDate: "2021-09-01",
            dayCapacity: 6,
            employee_ID: "6ed817cc-136a-45be-9b94-790663447716",
            resource_id: "7531c113-3497-4185-99b7-773822d5cd57",
            startTime: "2021-09-01T00:00:00Z"
        };

        var mockContextStub = sinon.stub(mockContext1, "getObject").returns(capacityData);

        Object.assign(_AllAssignments, DataTransformer.prepareCalendarData(mockContext, assignmentItems, projectItems));

        assert.deepEqual(_AllAssignments._assignments, expectedAssignments, 'test assertion for assignments');
        assert.deepEqual(_AllAssignments._headers, expectedHeaders, 'test assertion for headers');
        assert.ok(mockContextStub.calledOnce, true, "Method 'getObject' was called once");

    });


    QUnit.test("QUnit: I should test the getFilledProjectItem", function (assert) {

        var expectedResult = [ {
            customerName: "iTelO",
            projectName: "Implementation of SAP S/4HANA 1011",
            resourceRequestId: "3b023765-fc42-41ea-af72-20d19844461a",
            requestDisplayId: "EWMPRD.1.1",
            requestName: "Concept and Design",
            assignmentStartDate: new Date(2021,0,1),
            assignmentEndDate: new Date(2021,0,2),
            assignmentId: "1c1473a2-19d3-4814-bd47-967914832bbd",
            assignmentStatusCode: 0,
            assignmentStatus: "Hard-Booked",
            workItemName: "workItemName1"
        } ];
        var mockContext1 = {
            getObject: function () {
                return;
            }
        };

        var mockContext = [mockContext1];

        var projectItem = {
            customerName: "iTelO",
            employee_ID: "6ed817cc-136a-45be-9b94-790663447716",
            assignment_ID: "1c1473a2-19d3-4814-bd47-967914832bbd",
            projectName: "Implementation of SAP S/4HANA 1011",
            resourceRequest_ID: "3b023765-fc42-41ea-af72-20d19844461a",
            requestDisplayId: "EWMPRD.1.1",
            requestName: "Concept and Design",
            startDate: "2021-01-01",
            endDate: "2021-01-02",
            assignmentStatusCode: 0,
            assignmentStatus: "Hard-Booked",
            workItemName: "workItemName1"
        };

        var mockContextStub = sinon.stub(mockContext1, "getObject").returns(projectItem);

        var actualResult = DataTransformer.getFilledProjectItem(mockContext);

        assert.deepEqual(actualResult, expectedResult, 'test assertion');
        assert.ok(mockContextStub.calledOnce, true, "Method 'getObject' was called once");

    });

    QUnit.test("Test pupolateHeaderColor for less utilization", function (assert)  {
        var expectedResult = "#dc0d0e"; //turns red
        var color = DataTransformer.pupolateHeaderColor(50);
        assert.equal(color, expectedResult, 'Test Date asserted');
    });

    QUnit.test("Test pupolateHeaderColor for moderate utilization", function (assert)  {
        var expectedResult = "#f5b04d";
        var color = DataTransformer.pupolateHeaderColor(78);
        assert.equal(color, expectedResult, 'Test Date asserted');
    });

    QUnit.test("Test pupolateHeaderColor for good utilization", function (assert)  {
        var expectedResult = "#3fa45b";
        var color = DataTransformer.pupolateHeaderColor(90);
        assert.equal(color, expectedResult, 'Test Date asserted');
    });

    QUnit.test("Test pupolateHeaderColor for high utilization", function (assert)  {
        var expectedResult = "#dc0d0e"; //turns red
        var color = DataTransformer.pupolateHeaderColor(200);
        assert.equal(color, expectedResult, 'Test Date asserted');
    });


    QUnit.test("Test getFilledLegendItem for legend items", function (assert)  {
        this.oResourceBundle = new ResourceModel({
            bundleUrl: jQuery.sap.getModulePath("", "/i18n/i18n.properties")
        }).getResourceBundle();

        var expectedLegends = [
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

        var actualResult = [];
        actualResult = DataTransformer.getFilledLegendItem(this.oResourceBundle);
        assert.deepEqual(actualResult, expectedLegends, 'Test Data asserted');

    });

    QUnit.test("Test getFilledLegendAppointmentItem for legend items", function (assert)  {
        this.oResourceBundle = new ResourceModel({
            bundleUrl: jQuery.sap.getModulePath("", "/i18n/i18n.properties")
        }).getResourceBundle();

        var expectedAppointmentLegends = [
            {
                color: "#1093a2",
                text: "HARD_BOOKED",
                type: "Type04"
            },
            {
                color: "#ffffff",
                text: "SOFT_BOOKED",
                type: "Type05"
            }
        ];

        var actualResult = [];
        actualResult = DataTransformer.getFilledLegendAppointmentItem(this.oResourceBundle);
        assert.deepEqual(actualResult, expectedAppointmentLegends, 'Test Data asserted');

    });


    QUnit.test("Test getAssignmentRequestDetail when found record", function (assert)  {
        var assignmentId = "1c1473a2-19d3-4814-bd47-967914832bbd";

        var assignmentRequestDetails = [
            {
                customerName: "iTelO",
                projectName: "SAP 1001",
                resourceRequestId: "3b023765-fc42-41ea-af72-20d19844461a",
                requestDisplayId: "EWMPRD.1.1",
                requestName: "Concept and Design",
                assignmentId: "1c1473a2-19d3-4814-bd47-967914832bbd"
            },
            {
                customerName: "John & Smith Co",
                projectName: "SAP 9999",
                resourceRequestId: "bfc5985f-656d-43d5-90ed-71382a5548ec",
                requestDisplayId: "EWMPRD.1.1",
                requestName: "Concept and Design"
            }
        ];

        var actualResult = DataTransformer.getAssignmentRequestDetail(assignmentId, assignmentRequestDetails);
        assert.strictEqual(actualResult, assignmentRequestDetails[0], 'Test Date asserted');
    });

    QUnit.test("Test getAssignmentRequestDetail when found No record", function (assert)  {
        var assignmentId = "1c1473a2-19d3-4814-bd47-967914832bbd";

        var assignmentRequestDetails = [
            {
                customerName: "iTelO",
                projectName: "SAP 1001",
                resourceRequestId: "3b023765-fc42-41ea-af72-20d19844461",
                requestDisplayId: "EWMPRD.1.1",
                requestName: "Concept and Design"
            },
            {
                customerName: "John & Smith Co",
                projectName: "SAP 9999",
                resourceRequestId: "bfc5985f-656d-43d5-90ed-71382a5548e",
                requestDisplayId: "EWMPRD.1.1",
                requestName: "Concept and Design"
            }
        ];

        var actualResult = DataTransformer.getAssignmentRequestDetail(assignmentId, assignmentRequestDetails);
        assert.notEqual(actualResult, assignmentRequestDetails[1], 'Test Date asserted');
    });


});
