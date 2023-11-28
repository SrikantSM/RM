sap.ui.define(
	[
		"sap/ui/test/Opa5",
		"./arrangements/Startup",
		"./journeys/editJourneys/ChangeDailyUtilizationJourney",
		"./journeys/editJourneys/KeepAliveJourney",
		"./journeys/editJourneys/EditJourney",
		"./journeys/editJourneys/ChangeMonthlyUtilizationJourney",
		"./journeys/editJourneys/ChangeWeeklyUtilizationJourney",
		"./journeys/editJourneys/FocusedEditJourney",
		"./journeys/editJourneys/AssignmentStatusJourney",
		"./journeys/VariantsJourney"
	],
	function (Opa5, Startup) {
		"use strict";

		Opa5.extendConfig({
			arrangements: new Startup(),
			viewNamespace: "capacityGridUi.",
			autoWait: true
		});

		QUnit.extend(QUnit.assert, {
			matches: function (actual, regex, message) {
				var success = !!regex && !!actual && new RegExp(regex).test(actual);
				var expected = "String matching /" + regex.toString() + "/";
				this.push(success, actual, expected, message);
			}
		});
	}
);
