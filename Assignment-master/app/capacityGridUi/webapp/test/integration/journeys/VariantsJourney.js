/*global QUnit*/
sap.ui.define(
	[
		"sap/ui/test/opaQunit",
		"./Constants",
		"../pages/Filter",
		"../pages/Header",
		"../pages/Page",
		"../pages/PersoDialog",
		"../pages/Table",
		"../pages/Variant"
	],
	function (opaTest, Constants) {
		"use strict";

		QUnit.module("Variants Journey");

		var cols = Constants.columnIds;
		var fnCheckStandard = function (When, Then) {
			// header
			Then.onTheHeader.theViewIs("Monthly");
			Then.onTheHeader.theDateRangeMatches(/6 Months/);

			// filter
			When.onTheTable.pressFilterButton();
			Then.onTheFilter.theNameTokensAre([]);
			Then.onTheFilter.theCostCenterTokensAre([]);
			Then.onTheFilter.theResourceOrgKeysAre([]);
			Then.onTheFilter.theProjectTokensAre([]);
			Then.onTheFilter.theCustomerTokensAre([]);
			Then.onTheFilter.theProjectRoleKeysAre([]);
			Then.onTheFilter.theRequestTokensAre([]);
			Then.onTheFilter.theReferenceObjectTokensAre([]);
			Then.onTheFilter.theReferenceObjectTypeKeysAre([]);
			Then.onTheFilter.theUtilizationIsSelected(0, false);
			Then.onTheFilter.theUtilizationIsSelected(1, false);
			Then.onTheFilter.theUtilizationIsSelected(2, false);
			Then.onTheFilter.theUtilizationIsSelected(3, false);
			Then.onTheFilter.theUtilizationIsSelected(4, false);
			Then.onTheFilter.theMinFreeHoursAre("");
			When.onTheFilter.pressCloseButton();

			// table
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 7);
			Then.onTheTable.theColumnsAre([cols.NAME, cols.RESOURCE_ORG, cols.STAFFING_SUMMARY, cols.STAFFING_HRS, cols.ASSIGNMENT_STATUS]);
			Then.onTheTable.theColumnHasWidth(cols.NAME, "250px");
			Then.onTheTable.theColumnIsSorted(cols.NAME, "Ascending");

			// perso dialog
			When.onTheTable.pressPersoButton();
			Then.onThePersoDialog.theDialogIsOpen();
			Then.onThePersoDialog.theCheckBoxIsSelected(0, true);
			Then.onThePersoDialog.theCheckBoxIsSelected(1, true);
			Then.onThePersoDialog.theCheckBoxIsSelected(2, true);
			Then.onThePersoDialog.theCheckBoxIsSelected(3, true);
			Then.onThePersoDialog.theCheckBoxIsSelected(4, false);
			Then.onThePersoDialog.theCheckBoxIsSelected(5, false);
			Then.onThePersoDialog.theCheckBoxIsSelected(6, false);
			Then.onThePersoDialog.theCheckBoxIsSelected(7, false);
			Then.onThePersoDialog.theCheckBoxIsSelected(8, false);
			Then.onThePersoDialog.theCheckBoxIsSelected(9, false);
			Then.onThePersoDialog.theCheckBoxIsSelected(10, false);
			Then.onThePersoDialog.theCheckBoxIsSelected(11, false);
			Then.onThePersoDialog.theCheckBoxIsSelected(12, false);
			Then.onThePersoDialog.theCheckBoxIsSelected(13, false);
			When.onThePersoDialog.pressCancelButton();
		};

		var fnCheckTestVariant1 = function (When, Then) {
			// header
			Then.onTheHeader.theViewIs("Weekly");
			Then.onTheHeader.theDateRangeMatches(/8.*Weeks/);

			// filter
			When.onTheTable.pressFilterButton();
			Then.onTheFilter.theNameTokensAre(["Vishwanathan Tendulkar", "Serena Salah"]);
			Then.onTheFilter.theCostCenterTokensAre(["US01"]);
			Then.onTheFilter.theResourceOrgKeysAre(["RM-TA-US01"]);
			Then.onTheFilter.theProjectTokensAre(["0000000127"]);
			Then.onTheFilter.theCustomerTokensAre(["74215", "74217"]);
			Then.onTheFilter.theProjectRoleKeysAre(["00005b9c-0b7e-4dc5-be3b-0363de26a099"]);
			Then.onTheFilter.theRequestTokensAre(["0500000126"]);
			Then.onTheFilter.theReferenceObjectTokensAre(["Ref Object Id 1"]);
			Then.onTheFilter.theReferenceObjectTypeKeysAre([1]);
			Then.onTheFilter.theUtilizationIsSelected(0, false);
			Then.onTheFilter.theUtilizationIsSelected(1, false);
			Then.onTheFilter.theUtilizationIsSelected(2, false);
			Then.onTheFilter.theUtilizationIsSelected(3, true);
			Then.onTheFilter.theUtilizationIsSelected(4, true);
			Then.onTheFilter.theMinFreeHoursAre("2");
			When.onTheFilter.pressCloseButton();

			//Column Size Check
			Then.onTheTable.theColumnHasWidth(cols.RESOURCE_ORG, "150px");
			Then.onTheTable.theColumnHasWidth(cols.ASSIGNMENT_STATUS, "300px");
			Then.onTheTable.theColumnHasWidth(cols.NAME, "200px");
			// table
			Then.onTheTable.theColumnsCountIs(Constants.STATIC_COLUMN_COUNT + 9 /*week cols*/ - 2 /*hidden cols*/);
			Then.onTheTable.theColumnsAre([cols.NAME, cols.RESOURCE_ORG]);

			// perso dialog
			When.onTheTable.pressPersoButton();
			Then.onThePersoDialog.theDialogIsOpen();
			Then.onThePersoDialog.theCheckBoxIsSelected(0, true);
			Then.onThePersoDialog.theCheckBoxIsSelected(1, true);
			Then.onThePersoDialog.theCheckBoxIsSelected(2, false);
			Then.onThePersoDialog.theCheckBoxIsSelected(3, false);
			Then.onThePersoDialog.theCheckBoxIsSelected(4, false);
			Then.onThePersoDialog.theCheckBoxIsSelected(5, false);
			Then.onThePersoDialog.theCheckBoxIsSelected(6, false);
			Then.onThePersoDialog.theCheckBoxIsSelected(7, false);
			Then.onThePersoDialog.theCheckBoxIsSelected(8, false);
			Then.onThePersoDialog.theCheckBoxIsSelected(9, false);

			When.onThePersoDialog.pressCancelButton();
		};

		opaTest("Start App", function (Given, When, Then) {
			Given.iStartMyApp();
			Then.onThePage.theAppIsVisible();
		});

		opaTest("Check Standard Variant", function (Given, When, Then) {
			fnCheckStandard(When, Then);
		});

		opaTest("Save Test Variant 1", function (Given, When, Then) {
			// header
			When.onTheHeader.selectView(Constants.VIEW_WEEKLY);
			Then.onTheVariant.theCurrentVariantIsModified(true);
			// filter
			When.onTheTable.pressFilterButton();
			When.onTheFilter.enterResourceName("Vishwanathan");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(7a4da86a-94cd-4969-a297-cf066038d6f8)", "lastName");
			When.onTheFilter.enterResourceName("Serena");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(e5e3d7b8-1891-4d3f-80de-856b80217c88)", "lastName");
			When.onTheFilter.enterResourceOrg("Delivery Org Unit America (USA)");
			When.onTheFilter.enterCostCenter("US");
			When.onTheFilter.selectFromValueHelp("/ResourceOrganizationCostCenters('US01')", "costCenterId");
			When.onTheFilter.selectUtilization(3);
			When.onTheFilter.selectUtilization(4);
			When.onTheFilter.enterMinFreeHour(2);
			When.onTheFilter.enterProject("0000000127");
			When.onTheFilter.selectFromValueHelp("/ProjectsVH('0000000127')", "ID");
			When.onTheFilter.enterCustomer("74215");
			When.onTheFilter.selectFromValueHelp("/CustomerVH('74215')", "ID");
			When.onTheFilter.enterCustomer("74217");
			When.onTheFilter.selectFromValueHelp("/CustomerVH('74217')", "ID");
			When.onTheFilter.enterProjectRole("UI Developer");
			When.onTheFilter.enterRequest("0500000126");
			When.onTheFilter.selectFromValueHelp("/RequestsVH(f803f93f-6acc-4b86-ba80-1d0ded613b49)", "displayId");
			When.onTheFilter.enterReferenceObject("Ref Object Id 1");
			When.onTheFilter.selectFromValueHelp("/ReferenceObject(df4aa579-0e01-4bc3-9f4b-75f998a42b9f)", "displayId");
			When.onTheFilter.enterReferenceObjectType("Project");
			When.onTheFilter.pressGoButton();
			When.onTheFilter.pressCloseButton();

			// perso dialog
			When.onTheTable.pressPersoButton();
			Then.onThePersoDialog.theDialogIsOpen();
			// When.onThePersoDialog.pressMoveDownButton(); TODO
			When.onThePersoDialog.selectCheckBox(1);
			When.onThePersoDialog.selectCheckBox(2);
			When.onThePersoDialog.pressOkButton();

			// Column Resize
			When.onTheTable.resizeColumn(cols.RESOURCE_ORG, "150px");
			When.onTheTable.resizeColumn(cols.ASSIGNMENT_STATUS, "300px");
			When.onTheTable.resizeColumn(cols.NAME, "200px");
			When.onTheVariant.saveTestVariant1();

			fnCheckTestVariant1(When, Then);
		});

		opaTest("Select Standard Variant", function (Given, When, Then) {
			When.onTheVariant.selectStandardVariant();
			fnCheckStandard(When, Then);
		});

		opaTest("Select Test Variant 1", function (Given, When, Then) {
			When.onTheVariant.selectTestVariant1();
			fnCheckTestVariant1(When, Then);
		});

		opaTest("Reset Filters to Test Variant 1", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.enterResourceName("Alex Kardashian");
			When.onTheFilter.selectFromValueHelp("/ResourceDetails(9e2550e9-ab47-4807-b39b-0658917a1645)", "lastName");
			Then.onTheVariant.theCurrentVariantIsModified(true);
			When.onTheFilter.enterResourceOrg("Delivery Org Unit Germany (DE)");
			When.onTheFilter.enterCostCenter("DE");
			When.onTheFilter.selectFromValueHelp("/ResourceOrganizationCostCenters('DE01')", "costCenterId");
			When.onTheFilter.selectUtilization(0);
			When.onTheFilter.selectUtilization(1);
			When.onTheFilter.enterMinFreeHour(4);
			When.onTheFilter.enterProject("0000000128");
			When.onTheFilter.selectFromValueHelp("/ProjectsVH('0000000128')", "ID");
			When.onTheFilter.enterCustomer("74214");
			When.onTheFilter.selectFromValueHelp("/CustomerVH('74214')", "ID");
			When.onTheFilter.enterProjectRole("Project Manager");
			When.onTheFilter.enterRequest("0500000128");
			When.onTheFilter.selectFromValueHelp("/RequestsVH(556341da-46c2-4ba7-adb7-14cfbae1d350)", "displayId");
			When.onTheFilter.enterReferenceObject("Ref Object Id 2");
			When.onTheFilter.selectFromValueHelp("/ReferenceObject(33cdddae-2cbd-4f7c-9ece-d1df2d24be50)", "displayId");
			When.onTheFilter.enterReferenceObjectType("None");
			When.onTheFilter.pressResetButton();
			Then.onTheVariant.theCurrentVariantIsModified(false);
			When.onTheFilter.pressCloseButton();
			fnCheckTestVariant1(When, Then);
		});

		opaTest("Reset Table Perso to Test Variant 1", function (Given, When, Then) {
			When.onTheTable.pressPersoButton();
			Then.onThePersoDialog.theDialogIsOpen();
			When.onThePersoDialog.selectCheckBox(1);
			When.onThePersoDialog.selectCheckBox(2);
			When.onThePersoDialog.pressResetButton();
			When.onThePersoDialog.pressOkButton();
			Then.onTheVariant.theCurrentVariantIsModified(false);
			fnCheckTestVariant1(When, Then);
		});

		opaTest("Time Period Predefined Date Range", function (Given, When, Then) {
			When.onTheVariant.selectStandardVariant();
			When.onTheHeader.selectView(Constants.VIEW_WEEKLY);
			Then.onTheVariant.theCurrentVariantIsModified(true);
			When.onTheHeader.enterDateRange("Current Week + 11 Weeks");
			When.onTheVariant.saveTestVariant1();
			When.onTheVariant.selectStandardVariant();
			When.onTheVariant.selectTestVariant1();
			Then.onTheHeader.theDateRangeMatches(/11.*Weeks/);
		});

		opaTest("Time Period Custom Date Range", function (Given, When, Then) {
			When.onTheVariant.selectStandardVariant();
			When.onTheHeader.enterDateRange("Mar 2022 - Aug 2022");
			Then.onTheHeader.theDateRangeSelectedValue("Mar 2022 - Aug 2022");
			Then.onTheVariant.theCurrentVariantIsModified(true);
			When.onTheVariant.saveTestVariant1();
			When.onTheVariant.selectStandardVariant();
			When.onTheVariant.selectTestVariant1();
			Then.onTheHeader.theDateRangeSelectedValue("Mar 2022 - Aug 2022");
		});

		opaTest("Save Test Variant 1 With Addtional Columns", function (Given, When, Then) {
			When.onTheHeader.selectView(Constants.VIEW_WEEKLY);
			Then.onTheVariant.theCurrentVariantIsModified(true);
			// perso dialog
			When.onTheTable.pressPersoButton();
			Then.onThePersoDialog.theDialogIsOpen();
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
			Then.onTheTable.theColumnHasWidth(cols.REFERENCE_OBJECT, "150px");
			Then.onTheTable.theColumnHasWidth(cols.REFERENCE_OBJECT_TYPE, "150px");
			When.onTheTable.resizeColumn(cols.COST_CENTER, "200px");
			When.onTheTable.resizeColumn(cols.CUSTOMER, "250px");
			When.onTheTable.resizeColumn(cols.PROJECT, "200px");
			When.onTheTable.resizeColumn(cols.PROJECT_ROLE, "100px");
			When.onTheTable.resizeColumn(cols.REQUEST, "200px");
			When.onTheTable.resizeColumn(cols.REFERENCE_OBJECT, "200px");
			When.onTheTable.resizeColumn(cols.REFERENCE_OBJECT_TYPE, "200px");
			Then.onTheTable.theColumnsAre([
				cols.NAME,
				cols.COST_CENTER,
				cols.CUSTOMER,
				cols.PROJECT,
				cols.PROJECT_ROLE,
				cols.REFERENCE_OBJECT,
				cols.REFERENCE_OBJECT_TYPE,
				cols.REQUEST,
				cols.REQUEST_STATUS,
				cols.WORK_ITEM,
				cols.WORKER_TYPE
			]);
			Then.onTheTable.theColumnHasWidth(cols.COST_CENTER, "200px");
			Then.onTheTable.theColumnHasWidth(cols.CUSTOMER, "250px");
			Then.onTheTable.theColumnHasWidth(cols.PROJECT, "200px");
			Then.onTheTable.theColumnHasWidth(cols.PROJECT_ROLE, "100px");
			Then.onTheTable.theColumnHasWidth(cols.REQUEST, "200px");
			Then.onTheTable.theColumnHasWidth(cols.REQUEST, "200px");
			Then.onTheTable.theColumnHasWidth(cols.REFERENCE_OBJECT, "200px");
			Then.onTheTable.theColumnHasWidth(cols.REFERENCE_OBJECT_TYPE, "200px");
		});
		opaTest("Save Test Variant 1 with different filter states(expanded or collapsed)", function (Given, When, Then) {
			When.onTheTable.pressFilterButton();
			When.onTheFilter.expandOrCollapseResourceFilterPanel();
			When.onTheFilter.expandOrCollapseUtilizationFilterPanel();
			When.onTheFilter.expandOrCollapseRequestFilterPanel();
			When.onTheFilter.expandOrCollapseUtilizationFilterPanel();
			Then.onTheFilter.theUtilizationFilterPanelIsExpanded(true);
			When.onTheVariant.saveTestVariant1();
			When.onTheVariant.selectStandardVariant();
			Then.onTheFilter.theResourceFilterPanelIsExpanded(true);
			Then.onTheFilter.theUtilizationFilterPanelIsExpanded(true);
			Then.onTheFilter.theRequestFilterPanelIsExpanded(true);
			When.onTheVariant.selectTestVariant1();
			Then.onTheFilter.theUtilizationFilterPanelIsExpanded(true);
			Then.onTheFilter.theResourceFilterPanelIsExpanded(false);
			Then.onTheFilter.theRequestFilterPanelIsExpanded(false);
		});

		opaTest("Tear down app", function (Given, When, Then) {
			Then.onThePage.theAppIsVisible();
			Then.iTeardownMyApp();
		});
	}
);
