window.suite = function () {
	"use strict";
	/* eslint-disable new-cap */
	var oSuite = new parent.jsUnitTestSuite(),
		sContextPath = location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1);

	oSuite.addTestPage(sContextPath + "integration/opaTestsGroup3.qunit.html");

	return oSuite;
};
