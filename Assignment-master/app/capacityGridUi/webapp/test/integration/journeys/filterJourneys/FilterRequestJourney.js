/*global QUnit*/
sap.ui.define(
	[
		"sap/ui/test/opaQunit",
		"../Constants",
		"capacityGridUi/localService/mockserver",
		"capacityGridUi/view/ODataEntities",
		"../../pages/Filter",
		"../../pages/MockServer",
		"../../pages/Page",
		"../../pages/Table"
	],
	function (opaTest, Constants, mockserver, ODataEntities) {
		"use strict";

		QUnit.module("Filter Request Journey", {
			afterEach: function () {
				mockserver.resetRequests();
			}
		});
		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Apply Filter on Resource Name, Resource organization, Cost Center, Utilization and Min free hours", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.enterResourceName("Serena");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(e5e3d7b8-1891-4d3f-80de-856b80217c88)", "lastName");
			When.onTheFilter.enterResourceOrg("Delivery Org Unit America (USA)");
			When.onTheFilter.enterCostCenter("US");
			When.onTheFilter.selectFromValueHelp("/ResourceOrganizationCostCenters('US01')", "costCenterId");
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.COST_CENTER_ENTITY_SET,
				url: "$search=US&$select=costCenterDescription,costCenterId,resourceOrganizationDisplayId,resourceOrganizationName"
			});
			When.onTheFilter.selectUtilization(4);
			When.onTheFilter.enterMinFreeHour(2);
			When.onTheFilter.pressGoButton();
			Then.onTheMockServer.requestSentToServer({
				url: "$filter=(contains(resourceName,'Vishwanathan Tendulkar') or contains(resourceName,'Serena Salah')) and (contains(resourceOrganizationIdForDisplay,'RM-TA-US01')) and (contains(costCenter,'US01')) and (avgUtilization lt 70) and (freeHours ge 2)"
			});
		});

		opaTest("Apply Filter on Project", function (Given, When, Then) {
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterProject("0000000127");
			When.onTheFilter.selectFromValueHelp("/ProjectsVH('0000000127')", "ID");
			When.onTheFilter.enterProject("0000000128");
			When.onTheFilter.selectFromValueHelp("/ProjectsVH('0000000128')", "ID");
			When.onTheFilter.pressGoButton();
			Then.onTheMockServer.requestSentToServer({
				url: "$filter=(resourceAssignment/any(project:project/project_ID eq '0000000127') or resourceAssignment/any(project:project/project_ID eq '0000000128'))"
			});
		});

		opaTest("Apply Filter on Customer", function (Given, When, Then) {
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterCustomer("74215");
			When.onTheFilter.selectFromValueHelp("/CustomerVH('74215')", "ID");
			When.onTheFilter.pressGoButton();
			Then.onTheMockServer.requestSentToServer({ url: "$filter=(resourceAssignment/any(customer:customer/customer_ID eq '74215'))" });
		});

		opaTest("Apply Filter on Project Role", function (Given, When, Then) {
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterProjectRole("UI Developer");
			When.onTheFilter.pressGoButton();
			Then.onTheMockServer.requestSentToServer({
				url: "$filter=(resourceAssignment/any(projectRole:projectRole/projectRole_ID eq 00005b9c-0b7e-4dc5-be3b-0363de26a099))"
			});
		});

		opaTest("Apply Filter on Request", function (Given, When, Then) {
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterRequest("0500000126");
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");
			When.onTheFilter.pressGoButton();
			Then.onTheMockServer.requestSentToServer({ url: "$filter=(resourceAssignment/any(request:request/displayId eq '0500000126'))" });
		});

		opaTest("Apply Filter on Reference Object", function (Given, When, Then) {
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterReferenceObject("Ref Object Id 1");
			When.onTheFilter.selectFromValueHelp("/ReferenceObject(df4aa579-0e01-4bc3-9f4b-75f998a42b9f)", "displayId");
			When.onTheFilter.pressGoButton();
			Then.onTheMockServer.requestSentToServer({
				url: "$filter=(resourceAssignment/any(refObject:refObject/referenceObjectId eq 'Ref Object Id 1'))"
			});
		});

		opaTest("Apply Filter on Reference Object Type", function (Given, When, Then) {
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterReferenceObjectType("Project");
			When.onTheFilter.pressGoButton();
			Then.onTheMockServer.requestSentToServer({
				url: "$filter=(resourceAssignment/any(refObjType:refObjType/referenceObjectTypeCode eq 1))"
			});
		});

		opaTest("Apply Filter on WorkerType", function (Given, When, Then) {
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterWorkerType("Employee");
			When.onTheFilter.pressGoButton();
			Then.onTheMockServer.requestSentToServer({ url: "$filter=(contains(workerType,'Employee'))" });
			When.onTheFilter.pressResetButton();
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
