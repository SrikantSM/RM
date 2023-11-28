sap.ui.define(
	[
		"sap/ui/test/Opa5",
		"./arrangements/Startup",
		"./journeys/editJourneys/ActionEnablementJourney",
		"./journeys/editJourneys/CreateAssignmentJourney",
		"./journeys/editJourneys/DeleteAssignmentJourney",
		"./journeys/editJourneys/CopyPasteAssignmentJourney",
		"./journeys/editJourneys/CutPasteAssignmentJourney",
		"./journeys/editJourneys/DragAndDropAssignmentJourney"
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
