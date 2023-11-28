// eslint-disable-next-line no-redeclare
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require(["capacityGridUi/test/integration/UiTestJourneysGroup2"], function () {
		QUnit.start();
	});
});
