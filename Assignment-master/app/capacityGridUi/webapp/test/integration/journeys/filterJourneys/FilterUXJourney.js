/*global QUnit*/
sap.ui.define(
	[
		"sap/ui/test/opaQunit",
		"../Constants",
		"../../pages/ErrorDialog",
		"../../pages/Filter",
		"../../pages/Header",
		"../../pages/Page",
		"../../pages/Table",
		"../../pages/Variant"
	],
	function (opaTest, Constants) {
		"use strict";

		QUnit.module("Filter UX Journey");

		opaTest("Start App", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theSideContentIsOpen(false);
			Then.onTheTable.theOverlayIsVisible(false);
			Then.onTheTable.theInfoToolbarIsVisible(false);
		});

		opaTest("Unfiltered State - Open Filter", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			Then.onThePage.theSideContentIsOpen(true);
			Then.onTheTable.theOverlayIsVisible(false);
			Then.onTheTable.theInfoToolbarIsVisible(false);
			Then.onTheFilter.theResourceNameHasTokens(0);
			Then.onTheFilter.theResourceOrgHasTokens(0);
			Then.onTheFilter.theCostCenterHasTokens(0);
		});

		opaTest("Unfiltered State - Enter Resource Name", function (Given, When, Then) {
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			Then.onThePage.theSideContentIsOpen(true);
			Then.onTheTable.theOverlayIsVisible(true);
			Then.onTheTable.theInfoToolbarIsVisible(false);
			Then.onTheFilter.theResourceNameHasTokens(1);
			Then.onTheFilter.theResourceOrgHasTokens(0);
			Then.onTheFilter.theCostCenterHasTokens(0);
		});

		opaTest("Dirty State - Close by Close Button", function (Given, When, Then) {
			When.onTheFilter.pressCloseButton();
			Then.onThePage.theSideContentIsOpen(false);
			Then.onTheTable.theOverlayIsVisible(false);
			Then.onTheTable.theInfoToolbarIsVisible(false);
		});

		opaTest("Dirty State - Open Filter", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			Then.onThePage.theSideContentIsOpen(true);
			Then.onTheTable.theOverlayIsVisible(true);
			Then.onTheTable.theInfoToolbarIsVisible(false);
			Then.onTheFilter.theResourceNameHasTokens(1);
			Then.onTheFilter.theResourceOrgHasTokens(0);
			Then.onTheFilter.theCostCenterHasTokens(0);
		});

		opaTest("Dirty State - Close by Edit Button", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			Then.onThePage.theSideContentIsOpen(false);
			Then.onTheTable.theOverlayIsVisible(false);
			Then.onTheTable.theInfoToolbarIsVisible(false);
		});

		opaTest("Dirty State - Cancel Edit + Open Filter", function (Given, When, Then) {
			When.onThePage.pressCancelButton();
			When.onTheTable.pressFilterButton();
			Then.onTheTable.theFilterButtonIsEnabled(true);
			Then.onThePage.theSideContentIsOpen(true);
			Then.onTheTable.theOverlayIsVisible(true);
			Then.onTheTable.theInfoToolbarIsVisible(false);
			Then.onTheFilter.theResourceNameHasTokens(1);
			Then.onTheFilter.theResourceOrgHasTokens(0);
			Then.onTheFilter.theCostCenterHasTokens(0);
		});

		opaTest("Dirty State - End by Reset", function (Given, When, Then) {
			When.onTheFilter.pressResetButton();
			Then.onThePage.theSideContentIsOpen(true);
			Then.onTheTable.theOverlayIsVisible(false);
			Then.onTheTable.theInfoToolbarIsVisible(false);
			Then.onTheFilter.theResourceNameHasTokens(0);
			Then.onTheFilter.theResourceOrgHasTokens(0);
			Then.onTheFilter.theCostCenterHasTokens(0);
		});

		opaTest("Dirty State - Start", function (Given, When, Then) {
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			Then.onThePage.theSideContentIsOpen(true);
			Then.onTheTable.theOverlayIsVisible(true);
			Then.onTheTable.theInfoToolbarIsVisible(false);
			Then.onTheFilter.theResourceNameHasTokens(1);
			Then.onTheFilter.theResourceOrgHasTokens(0);
			Then.onTheFilter.theCostCenterHasTokens(0);
		});

		opaTest("Dirty State - End by Go", function (Given, When, Then) {
			When.onTheFilter.pressGoButton();
			Then.onThePage.theSideContentIsOpen(true);
			Then.onTheTable.theOverlayIsVisible(false);
			Then.onTheTable.theInfoToolbarIsVisible(false);
			Then.onTheFilter.theResourceNameHasTokens(1);
			Then.onTheFilter.theResourceOrgHasTokens(0);
			Then.onTheFilter.theCostCenterHasTokens(0);
		});

		opaTest("Filtered State - Close Filter", function (Given, When, Then) {
			When.onTheFilter.pressCloseButton();
			Then.onThePage.theSideContentIsOpen(false);
			Then.onTheTable.theOverlayIsVisible(false);
			Then.onTheTable.theInfoToolbarIsVisible(true);
			Then.onTheTable.theInfoTextMatches("1 filter active: Name");
		});

		opaTest("Filtered State - Open Filter by Info Toolbar", function (Given, When, Then) {
			When.onTheTable.pressInfoToolbar();
			Then.onThePage.theSideContentIsOpen(true);
			Then.onTheTable.theOverlayIsVisible(false);
			Then.onTheTable.theInfoToolbarIsVisible(false);
			Then.onTheFilter.theResourceNameHasTokens(1);
			Then.onTheFilter.theResourceOrgHasTokens(0);
			Then.onTheFilter.theCostCenterHasTokens(0);
		});

		opaTest("Filtered State - Start Edit", function (Given, When, Then) {
			When.onTheTable.pressEditButton();
			Then.onThePage.theSideContentIsOpen(false);
			Then.onTheTable.theOverlayIsVisible(false);
			Then.onTheTable.theInfoToolbarIsVisible(true);
			Then.onTheTable.theInfoTextMatches("1 filter active: Name");
		});

		opaTest("Filtered State - Cancel Edit + Open Filter", function (Given, When, Then) {
			When.onThePage.pressCancelButton();
			When.onTheTable.pressFilterButton();
			Then.onTheTable.theFilterButtonIsEnabled(true);
			Then.onThePage.theSideContentIsOpen(true);
			Then.onTheTable.theOverlayIsVisible(false);
			Then.onTheTable.theInfoToolbarIsVisible(false);
			Then.onTheFilter.theResourceNameHasTokens(1);
			Then.onTheFilter.theResourceOrgHasTokens(0);
			Then.onTheFilter.theCostCenterHasTokens(0);
		});

		opaTest("Filtered State - End by Reset", function (Given, When, Then) {
			When.onTheFilter.pressResetButton();
			Then.onThePage.theSideContentIsOpen(true);
			Then.onTheTable.theOverlayIsVisible(false);
			Then.onTheTable.theInfoToolbarIsVisible(false);
			Then.onTheFilter.theResourceNameHasTokens(0);
			Then.onTheFilter.theResourceOrgHasTokens(0);
			Then.onTheFilter.theCostCenterHasTokens(0);
		});

		opaTest("Filtered State - Multiple Filter", function (Given, When, Then) {
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.enterResourceOrg("Delivery Org Unit Germany (DE)");
			When.onTheFilter.enterCostCenter("US");
			When.onTheFilter.selectFromValueHelp("/ResourceOrganizationCostCenters('US01')", "costCenterId");
			When.onTheFilter.pressGoButton();
			Then.onThePage.theSideContentIsOpen(true);
			Then.onTheTable.theOverlayIsVisible(false);
			Then.onTheTable.theInfoToolbarIsVisible(false);
			Then.onTheFilter.theResourceNameHasTokens(1);
			Then.onTheFilter.theResourceOrgHasTokens(1);
			Then.onTheFilter.theCostCenterHasTokens(1);
		});

		opaTest("Filtered State - Close Filter", function (Given, When, Then) {
			When.onTheFilter.pressCloseButton();
			Then.onThePage.theSideContentIsOpen(false);
			Then.onTheTable.theOverlayIsVisible(false);
			Then.onTheTable.theInfoToolbarIsVisible(true);
			Then.onTheTable.theInfoTextMatches("3 filters active: Name, Resource Organization, Cost Center");
		});

		opaTest("Filtered State - Input Validation", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			Then.onTheFilter.theFreeHoursHasError(false);
			When.onTheFilter.enterMinFreeHour("XXX");
			Then.onTheFilter.theFreeHoursHasError(true);
			When.onTheFilter.pressGoButton();
			Then.onTheErrorDialog.theTextIsVisible("VERTICAL_FILTER_INVALID");
			When.onTheErrorDialog.pressCloseButton();
			When.onTheFilter.enterMinFreeHour("0");
			Then.onTheFilter.theFreeHoursHasError(false);
			When.onTheFilter.pressGoButton();
		});

		opaTest("Filtered State - End by Reset", function (Given, When, Then) {
			When.onTheFilter.pressResetButton();
			Then.onThePage.theSideContentIsOpen(true);
			Then.onTheTable.theOverlayIsVisible(false);
			Then.onTheTable.theInfoToolbarIsVisible(false);
			Then.onTheFilter.theResourceNameHasTokens(0);
			Then.onTheFilter.theResourceOrgHasTokens(0);
			Then.onTheFilter.theCostCenterHasTokens(0);
		});

		opaTest("Unfiltered State - Close Filter", function (Given, When, Then) {
			When.onTheFilter.pressCloseButton();
			Then.onThePage.theSideContentIsOpen(false);
			Then.onTheTable.theOverlayIsVisible(false);
			Then.onTheTable.theInfoToolbarIsVisible(false);
		});

		opaTest("Filtered State - Error is reset on Select Variant", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_WEEKLY);
			Then.onTheVariant.theCurrentVariantIsModified(true);
			When.onTheTable.pressFilterButton();
			When.onTheFilter.enterResourceName("XXX");
			Then.onTheFilter.theResourceNameHasError(true);
			Then.onTheFilter.theResourceNameHasTokens(0);
			When.onTheVariant.saveTestVariant1();
			When.onTheVariant.selectTestVariant1();
			Then.onTheFilter.theResourceNameHasError(false);
			Then.onTheFilter.theResourceNameHasTokens(0);
			When.onTheFilter.pressResetButton();
		});

		opaTest("Check Empty Time Period Input Validation", function (Given, When, Then) {
			When.onTheHeader.enterDateRange("");
			Then.onTheHeader.theDateRangeSelectedValue("");
			When.onTheFilter.pressGoButton();
			Then.onTheHeader.theDateRangeValueStateIs("Error");
			Then.onTheHeader.theDateRangeValueStateTextIs("VALIDATION_EMPTY_DATE_RANGE");
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);