"use strict";

const testHelper = require("../utils/TestHelper");
require("../../../pages/flpPage");
require("../../../pages/page");
require("../../../pages/tablePage");
require("../../../pages/persoDialogPage");
require("../../../pages/headerPage");
require("../../../pages/filterPage");

const { browser, element, by } = require("protractor");
require("jasmine");

describe("Authorization Journey", function () {
	testHelper.loginWithRole("ResourceManager");

	testHelper.it("should see the Resource Utilization app as Resource Manager along with the KPI Tile", function () {
		Then.onTheFlpPage.theTileManageResourceUtilizationIsVisible();
		Then.onTheFlpPage.theKPITileFooterTextIsVisible();
		Then.onTheFlpPage.theKPITileNumericContentIsVisible();
	});

	testHelper.logout();

	testHelper.loginWithRole("ProjectManager");

	testHelper.it("should not see the Resource Utilization app as Project Manager", function () {
		Then.onTheFlpPage.theTileManageResourceUtilizationIsNotVisible();
	});

	testHelper.logout();
});