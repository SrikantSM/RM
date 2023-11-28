sap.ui.define([], function() {
	return {
		/**
		 * Add days to given date.
		* @public
		* @param {Date} oDate date to add days in.
		* @param {int} iDays number of days to add.
		* @return {Date} Date with added days.
		*/
		addDays: function(oDate, iDays) {
			const result = new Date(oDate);
			result.setDate(result.getDate() + iDays);
			return result;
		},

		/**
		 * Check if oDate falls between oStartDate and oEndDate.
		* @public
		* @param {Date} oDate date to check if it falls between mentioned dates.
		* @param {Date} oStartDate date to check greater than.
		* @param {Date} oEndDate date to check less than.
		* @return {Boolean} true if the range is between the mentioned dates.
		*/
		inRange: function(oDate, oStartDate, oEndDate ) {
			if (oDate.getTime() >= oStartDate.getTime() && oDate.getTime() <= oEndDate.getTime()) {
				return true;
			}
			return false;
		},

		/**
		 * Get date in correct format.
		* @public
		* @param {Date} oDate refrence date from which correct date is required.
		* @return {Date} Date in correct format.
		*/
		getCorrectDate: function(oDate) {
			/**
			 * Why?
			 * new Date("2021-01-01") and new Date(2021,0,1) are not considered equal.
			 * To avoid any false negative we always generate date object using this method.
			 */
			return new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate());
		},

		/**
		 * Validate if previous month need to be considered for UI model in case of week wise.
		* @public
		* @param {Date} oDate resource request start date.
		* @return {Boolean} true if we should consider the previous year
		*/
		considerPreviousYearForWeekWise: function(oDate) {
			/**
			 * Why?
			 * 1st januray 2021 is RR start date.
			 * this falls in last week of 2020 year.
			 * Thus we need to consider previous year also when we generate UI model
			 */
			if (oDate.getMonth() === 0) {
				const oFirstDayofThisYear = new Date(oDate.getFullYear(), 0, 1);
				const iWeekDay = oFirstDayofThisYear.getDay();
				const oWeekEndDate = new Date(oDate.getFullYear(), 0, 7 - iWeekDay + 1);
				if ( iWeekDay >= 4 && oWeekEndDate.getTime() >= oDate.getTime()) {
					return true;
				}
			}
			return false;
		},

		/**
		 * Validate if next month need to be considered for UI model in case of week wise.
		* @public
		* @param {Date} oDate resource request end date.
		* @return {Boolean} true if we should consider the next year
		*/
		considerNextYearForWeekWise: function(oDate) {
			/**
			 * Why?
			 * 31st december 2018 is RR end date.
			 * this falls in first week of 2019 year.
			 * Thus we need to consider next year also when we generate UI model
			 */
			if (oDate.getMonth() === 11) {
				const oLastDayofThisYear = new Date(oDate.getFullYear(), 11, 31);
				const iWeekDay = oLastDayofThisYear.getDay();
				const oWeekStartDate = new Date(oDate.getFullYear(), 11, 31 - iWeekDay);
				if ( iWeekDay <= 2 && oWeekStartDate.getTime() <= oDate.getTime()) {
					return true;
				}
			}
			return false;
		},

		// eslint-disable-next-line consistent-return
		quarterOfMonth: function(iMonth) {
			// eslint-disable-next-line default-case
			switch (iMonth) {
			case 1:
			case 2:
			case 3: return 1;
			case 4:
			case 5:
			case 6: return 2;
			case 7:
			case 8:
			case 9: return 3;
			case 10:
			case 11:
			case 12: return 4;
			}
		},

		/**
    *
    * Here we are converting the Date with the local browser time
    * using the UTC function to get the UTC Date without the browser time.
    * @param {Date} oDate Date consists Date with consists the local browser timezone.
    * @return {Date} oDate Date in correct format.
    */
		convertDateToUTC: function(oDate) {
			return new Date(oDate.getUTCFullYear(), oDate.getUTCMonth(), oDate.getUTCDate(),
				oDate.getUTCHours(), oDate.getUTCMinutes(), oDate.getUTCSeconds());
		}
	};
});
