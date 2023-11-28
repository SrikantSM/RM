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
		"../pages/QuickView",
		"../pages/Table"
	],
	function (opaTest, Constants, ODataEntities, Views) {
		"use strict";

		QUnit.module("Quick View Journey");

		opaTest("Start app", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Select daily view", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_DAILY);
			Then.onTheHeader.theDateRangeMatches(/28 Days/);
			Then.onTheHeader.theAverageUtilizationStatusIs("74%");
			Then.onTheHeader.theTotalResourcesNumberIs(61);
			Then.onTheHeader.theFreeResourcesNumberIs(32);
			Then.onTheHeader.theOverbookedResourcesNumberIs(12);
			Then.onTheTable.theTableIsVisible();
			Then.onTheTable.theResourceNameLinkIsVisible("Alex Kardashian");
			Then.onTheTable.theResourceNameLinkIsVisible("Ayan Smith");
			Then.onTheTable.theResourceNameLinkIsVisible("Ayan Musk");
			Then.onTheTable.theResourceUtilizationIs(114, null);
		});
		opaTest("Open Quick View for Ayan Musk", function (Given, When, Then) {
			When.onTheTable.pressResourceNameLink("Ayan Musk");
			Then.onTheQuickView.theQuickIsOpen();
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.RESOURCES_ENTITY_SET,
				url: "$filter=ID eq e4beae01-a0ef-41fa-9037-e4da36a12741"
			});
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.RESOURCES_ENTITY_SET,
				url: "$apply=groupby((ID,emailAddress,mobileNumber,resourceName,managerDetails/managerName,costCenterForDisplay,resourceOrganizationNameForDisplay,resourceOrganizationIdForDisplay,isPhotoPresent,workerType,jobTitle,country,workforcePersonID,employeeExternalID),aggregate(validFrom with min as startdatenew))"
			});
			Then.onTheQuickView.thereIsAnMTitle("Ayan Musk (6615314ed515)");
			Then.onTheQuickView.theDescriptionIs("jobTitle 1.1");
			Then.onTheQuickView.theElementIs("WORKER_TYPE", "External Worker");
			Then.onTheQuickView.theElementIs("MOBILE", "'+49-6227-31002'");
			Then.onTheQuickView.theElementIs("EMAIL", "Musk.Ayan@sap.com");
			Then.onTheQuickView.theElementIs("OFFICE_LOCATION", "US");
			Then.onTheQuickView.theElementIs("RESOURCE_ORGANIZATION", "Delivery Org Unit ( America) (RM-TA-US01)");
			Then.onTheQuickView.theElementIs("COST_CENTER", "(US01)");
			Then.onTheQuickView.theElementIs("MANAGER", "Manager 1.1");
		});

		opaTest("Open Quick View for Ayan Smith", function (Given, When, Then) {
			When.onTheTable.pressResourceNameLink("Ayan Smith");
			Then.onTheQuickView.theQuickIsOpen();
			Then.onTheQuickView.thereIsAnMTitle("Ayan Smith (6615314ed9315)");
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

		opaTest("Open Assignment Quick View of Vishwanathan Tendulkar", function (Given, When, Then) {
			When.onTheTable.pressExpandArrowOfFirstResource("rows-row0-treeicon");
			When.onTheTable.pressResourceNameLink("Prototype Talent Management 01");
			Then.onTheQuickView.theQuickIsOpen();
			Then.onTheMockServer.requestSentToServer({
				entitySet: ODataEntities.REQUEST_ENTITY_SET,
				url: "$select=requestDisplayId,requestEndDate,requestName,requestStartDate,requestStatusDescription,requestedResourceOrganizationDisplayId,requestedResourceOrganizationName,resourceRequest_ID&$filter=resourceRequest_ID eq f803f93f-6acc-4b86-ba80-1d0ded613b49"
			});
			Then.onTheQuickView.thereIsAnMTitle("Resource Request");
			Then.onTheQuickView.thereIsAnMTitle("Talent Management 01");
			Then.onTheQuickView.theDescriptionIs("WP02");
			Then.onTheQuickView.thereIsACoreTitle("REQUEST_DETAILS");
			Then.onTheQuickView.theElementIs("REQUESTED_RESOURCE_ORGANIZATION", "Delivery Org Unit India (BLR) (RM-TA-IN01)");
			Then.onTheQuickView.theElementIs("REQUEST_START_DATE", "Jan 1, 2021");
			Then.onTheQuickView.theElementIs("REQUEST_END_DATE", "Dec 31, 2021");
			Then.onTheQuickView.theElementIs("REQUEST_STATUS", "Open");
			Then.onTheQuickView.thereIsACoreTitle("STAFFING_SUMMARY");
			Then.onTheQuickView.theElementIs("STAFFED_EFFORT", "1140 hr / 1038 hr");
			Then.onTheQuickView.theElementIs("REMAINING_EFFORT", "-102 hr");
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);