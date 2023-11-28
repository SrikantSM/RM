sap.ui.define(
	[
		"sap/ui/test/Opa5",
		"./arrangements/Startup",
		"./journeys/assignmentJourneys/AssignmentDailyJourney",
		"./journeys/assignmentJourneys/AssignmentWeeklyJourney",
		"./journeys/assignmentJourneys/AssignmentMonthlyJourney",
		"./journeys/MessageDialogJourney",
		"./journeys/QuickViewJourney",
		"./journeys/filterJourneys/FilterRequestJourney",
		"./journeys/filterJourneys/FilterUXJourney",
		"./journeys/filterJourneys/FilterResourcesWithEditedAssignmentJourney",
		"./journeys/PersonalizationJourney",
		"./journeys/resourceJourneys/ResourceJourney",
		"./journeys/resourceJourneys/ResourceDailyJourney",
		"./journeys/resourceJourneys/ResourceMonthlyJourney",
		"./journeys/resourceJourneys/ResourceWeeklyJourney",
		"./journeys/HideLeadingColumnsJourney",
		"./journeys/AdditionalColumnsJourney",
		"./journeys/TableExportJourney",
		"./journeys/timePeriodPaginationJourneys/TimePeriodPaginationMonthlyJourney",
		"./journeys/timePeriodPaginationJourneys/TimePeriodPaginationWeeklyJourney",
		"./journeys/timePeriodPaginationJourneys/TimePeriodPaginationDailyJourney",
		"./journeys/DynamicDateRangeControlJourneys/DynamicDateRangeMonthlyJourney",
		"./journeys/DynamicDateRangeControlJourneys/DynamicDateRangeWeeklyJourney",
		"./journeys/DynamicDateRangeControlJourneys/DynamicDateRangeDailyJourney"
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
