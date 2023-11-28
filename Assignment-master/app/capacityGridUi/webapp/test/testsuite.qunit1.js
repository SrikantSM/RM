window.suite = function () {
	"use strict";
	/* eslint-disable new-cap */
	var oSuite = new parent.jsUnitTestSuite(),
		sContextPath = location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1);

	oSuite.addTestPage(sContextPath + "unit/unitTests.qunit.html");
	oSuite.addTestPage(sContextPath + "integration/opaTestsGroup1.qunit.html");
	
	return oSuite;
};
