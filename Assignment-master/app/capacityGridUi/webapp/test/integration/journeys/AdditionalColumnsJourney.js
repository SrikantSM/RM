/*global QUnit*/
sap.ui.define(
	[
		"sap/ui/test/opaQunit",
		"./Constants",
		"capacityGridUi/view/ODataEntities",
		"capacityGridUi/view/Views",
		"../pages/Filter",
		"../pages/Header",
		"../pages/Page",
		"../pages/PersoDialog",
		"../pages/Table"
	],
	function (opaTest, Constants, ODataEntities, Views) {
		"use strict";

		QUnit.module("Additional Columns Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Select monthly view", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_MONTHLY);
			Then.onTheHeader.theDateRangeMatches(/6 Months/);
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.RESOURCES_ENTITY_SET,
				url: "$apply=groupby((ID,resourceName,workforcePersonID,assignmentExistsForTheResource,resourceOrganizationNameForDisplay,resourceOrganizationIdForDisplay,isPhotoPresent,avgUtilization),aggregate(validFrom with min as startdatenew))"
			});
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.utilizationEntitySet(Views.MONTHLY),
				url: "ID eq e4beae01-a0ef-41fa-9037-e4da36a12741 and validFrom eq 19-04-19"
			});
		});

		opaTest("Select date range", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("Jan 2023 - Dec 2023");
			Then.onTheHeader.theDateRangeValueStateIs("None");
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 12);
		});

		opaTest("Filter Resource Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(1);
		});

		opaTest("Expand Assignments of Vishwanathan Tendulkar (Additional Columns)", function (Given, When, Then) {
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				url: "$select=assignmentDurationInHours,assignmentStatusCode,assignmentStatusText,assignment_ID,isAssignmentEditable,projectId,projectName,remainingRequestedCapacityInHours,requestName,requestedCapacityInHours,resourceRequest_ID,resource_ID,totalRequestBookedCapacityInHours"
			});
			When.onTheTable.pressPersoButton();
			Then.onThePersoDialog.theDialogIsOpen();
			When.onThePersoDialog.pressResetButton();
			When.onThePersoDialog.selectCheckBox(0);
			When.onThePersoDialog.selectCheckBox(1);
			When.onThePersoDialog.selectCheckBox(2);
			When.onThePersoDialog.selectCheckBox(3);
			When.onThePersoDialog.selectCheckBox(4);
			When.onThePersoDialog.selectCheckBox(5);
			When.onThePersoDialog.selectCheckBox(6);
			When.onThePersoDialog.selectCheckBox(7);
			When.onThePersoDialog.selectCheckBox(8);
			When.onThePersoDialog.selectCheckBox(9);
			When.onThePersoDialog.selectCheckBox(10);
			When.onThePersoDialog.selectCheckBox(11);
			When.onThePersoDialog.selectCheckBox(12);
			When.onThePersoDialog.selectCheckBox(13);
			When.onThePersoDialog.pressOkButton();
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.RESOURCES_ENTITY_SET,
				url: "$apply=groupby((ID,resourceName,workforcePersonID,assignmentExistsForTheResource,resourceOrganizationNameForDisplay,resourceOrganizationIdForDisplay,isPhotoPresent,costCenterForDisplay,avgUtilization,workerType),aggregate(validFrom with min as startdatenew))"
			});
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.ASSIGNMENT_ENTITY_SET,
				url: "$select=assignmentDurationInHours,assignmentStatusCode,assignmentStatusText,assignment_ID,customerId,customerName,isAssignmentEditable,projectId,projectName,projectRoleName,referenceObjectId,referenceObjectName,referenceObjectTypeName,remainingRequestedCapacityInHours,requestDisplayId,requestName,requestStatusDescription,requestedCapacityInHours,resourceRequest_ID,resource_ID,totalRequestBookedCapacityInHours"
			});
			Then.onTheTable.theResourceCostCenterIs("(DE01)", "/rows/0");
			Then.onTheTable.theResourceWorkerTypeIs("External Worker", "/rows/0");
			Then.onTheTable.theAssignmentCustomerIs("Company Inlandskunde DE 1 (74214)", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentCustomerIs("Company Inlandskunde DE 2 (74215)", "/rows/0/assignments/1");
			Then.onTheTable.theAssignmentProjectIs("JG 2206 CustProj 1 (0000000127)", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentProjectIs("JG 2206 CustProj 2 (0000000128)", "/rows/0/assignments/1");
			Then.onTheTable.theAssignmentProjectRoleIs("Project Manager", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentProjectRoleIs("UI Developer", "/rows/0/assignments/1");
			Then.onTheTable.theAssignmentRequestIs("Prototype Talent Management 01 (0500000126)", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentRequestIs("Prototype Talent Management 04 (0500000129)", "/rows/0/assignments/1");
			Then.onTheTable.theAssignmentReferenceObjectIs("Test Object Name 1 (Ref Object ID 1)", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentReferenceObjectIs("Test Object Name 3 (Ref Object ID 3)", "/rows/0/assignments/1");
			Then.onTheTable.theAssignmentReferenceObjectTypeIs("None", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentReferenceObjectTypeIs("Project", "/rows/0/assignments/1");
			When.onTheTable.pressPersoButton();
			Then.onThePersoDialog.theDialogIsOpen();
			When.onThePersoDialog.pressResetButton();
			When.onThePersoDialog.selectCheckBox(0);
			When.onThePersoDialog.selectCheckBox(1);
			When.onThePersoDialog.selectCheckBox(4);
			When.onThePersoDialog.pressOkButton();
		});

		opaTest("Reset Filter", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.pressCloseButton();
		});

		opaTest("Filter Kardashian Alex", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.pressResetButton();
			When.onTheFilter.enterResourceName("Alex Kardashian");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(9e2550e9-ab47-4807-b39b-0658917a1645)", "lastName");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();
			Then.onTheTable.theTitleCountIs(2);
		});

		opaTest("Expand both Assignments of Kardashian Alex (Additional Columns)", function (Given, When, Then) {
			When.onTheTable.pressPersoButton();
			Then.onThePersoDialog.theDialogIsOpen();
			When.onThePersoDialog.pressResetButton();
			When.onThePersoDialog.selectCheckBox(0);
			When.onThePersoDialog.selectCheckBox(1);
			When.onThePersoDialog.selectCheckBox(2);
			When.onThePersoDialog.selectCheckBox(3);
			When.onThePersoDialog.selectCheckBox(4);
			When.onThePersoDialog.selectCheckBox(5);
			When.onThePersoDialog.selectCheckBox(6);
			When.onThePersoDialog.selectCheckBox(7);
			When.onThePersoDialog.selectCheckBox(8);
			When.onThePersoDialog.selectCheckBox(9);
			When.onThePersoDialog.selectCheckBox(10);
			When.onThePersoDialog.selectCheckBox(11);
			When.onThePersoDialog.selectCheckBox(12);
			When.onThePersoDialog.selectCheckBox(13);
			When.onThePersoDialog.pressOkButton();
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row2-treeicon");
			Then.onTheTable.theResourceCostCenterIs("(DE01)", "/rows/0");
			Then.onTheTable.theResourceCostCenterIs("(IN02)", "/rows/1");
			Then.onTheTable.theResourceWorkerTypeIs("External Worker", "/rows/0");
			Then.onTheTable.theResourceWorkerTypeIs("Employee", "/rows/1");
			Then.onTheTable.theAssignmentCustomerIs("Company Inlandskunde DE 1 (74214)", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentCustomerIs("Company Inlandskunde DE 3 (74216)", "/rows/1/assignments/0");
			Then.onTheTable.theAssignmentProjectIs("JG 2206 CustProj 1 (0000000127)", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentProjectIs("JG 2206 CustProj 3 (0000000129)", "/rows/1/assignments/0");
			Then.onTheTable.theRequestStatusIs("Open", "/rows/0/assignments/0");
			Then.onTheTable.theRequestStatusIs("Open", "/rows/1/assignments/0");
			Then.onTheTable.theworkItemNameIs("workItem", "/rows/0/assignments/0");
			Then.onTheTable.theworkItemNameIs("workItem", "/rows/1/assignments/0");
			Then.onTheTable.theAssignmentProjectRoleIs("UI Developer", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentProjectRoleIs("Project Manager", "/rows/1/assignments/0");
			Then.onTheTable.theAssignmentRequestIs("Prototype Talent Management 02 (0500000127)", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentRequestIs("Prototype Talent Management 03 (0500000128)", "/rows/1/assignments/0");
			Then.onTheTable.theAssignmentReferenceObjectIs("Test Object Name 2 (Ref Object ID 2)", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentReferenceObjectIs("Test Object Name 1 (Ref Object ID 1)", "/rows/1/assignments/0");
			Then.onTheTable.theAssignmentReferenceObjectTypeIs("Project", "/rows/0/assignments/0");
			Then.onTheTable.theAssignmentReferenceObjectTypeIs("None", "/rows/1/assignments/0");
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
