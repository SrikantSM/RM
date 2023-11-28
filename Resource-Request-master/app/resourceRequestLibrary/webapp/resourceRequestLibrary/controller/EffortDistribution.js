sap.ui.define(
	["resourceRequestLibrary/controller/DayWiseCalendar",
		"resourceRequestLibrary/controller/WeekWiseCalendar",
		"resourceRequestLibrary/utils/Constants"],
	function(DayWiseController, WeekWiseCalendar, Constants) {
		return {
			openEffortView: function(sAppName, iEffortDistributionType, oEvent) {
				if (iEffortDistributionType === Constants.DAILY_EFFORT) {
					DayWiseController.setAppName(sAppName);
					DayWiseController.onOpenCalendarView.call(this, oEvent);
				} else if (iEffortDistributionType === Constants.WEEKLY_EFFORT) {
					WeekWiseCalendar.setAppName(sAppName);
					WeekWiseCalendar.onOpenCalendarView.call(this, oEvent);
				}
			},
		};
	}
);
