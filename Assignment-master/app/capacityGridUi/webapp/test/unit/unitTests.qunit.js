QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require(["capacityGridUi/test/unit/allTests"], function () {
		QUnit.start();
	});
});
