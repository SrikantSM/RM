sap.ui.define([], function() {
	const CalendarModel = {};

	/**
   * Calcuate all the months between start date and end date
   *
   * @public
   * @param {String} sStartDate start date of the requested duration
   * @param {String} sEndDate end date of the requested duration
   * @return {Array} Range of months between start date and end date
   */
	CalendarModel.getMonthRange = function(sStartDate, sEndDate) {
		let oStartDate = new Date(sStartDate);
		let oEndDate = new Date(sEndDate);
		oStartDate = new Date(oStartDate.getFullYear(), oStartDate.getMonth(), 1);
		oEndDate = new Date(oEndDate.getFullYear(), oEndDate.getMonth(), 1);
		const aDateRange = [];
		while (
			oStartDate.getFullYear() != oEndDate.getFullYear() ||
      oStartDate.getMonth() != oEndDate.getMonth()
		) {
			aDateRange.push([oStartDate.getFullYear(), oStartDate.getMonth()]);
			oStartDate.setMonth(oStartDate.getMonth() + 1);
		}
		aDateRange.push([oStartDate.getFullYear(), oStartDate.getMonth()]);
		return aDateRange;
	};

	/**
   * Calculate dates for the given month
   *
   * @public
   * @param {Integer} iYear Year for which dates needs to generated
   * @param {Integer} iMonth Month for which dates needs to generated
   * @param {Object} oCapacityRequirements Map containing capacity requirements data from backend
   * @param {Object} oRRStartDate start date of the requested duration
   * @param {Object} oRREndDate end date of the requested duration
   * @return {Array} Dates for given month
   */
	CalendarModel.monthInformation = function(
		iYear,
		iMonth,
		oCapacityRequirements,
		oRRStartDate,
		oRREndDate
	) {
		iMonth = iMonth - 1; /* month given to Date() starts at 0 = January */
		this.oStartDate = new Date(iYear, iMonth, 1);
		this.oEndDate = new Date(
			iYear,
			iMonth + 1,
			0
		); /* 0 `day` gets last day from prior month */

		/* result of getDay(): 0 means Sunday and 6 means Saturday */
		this.iStartDay = this.oStartDate.getDay();
		/* Marking day value as 7 if it is Sunday, as it is last day in week */
		if (this.iStartDay == 0) {
			this.iStartDay = 7;
		}
		/* last day number = total days in current month */
		this.iCurrentMonthTotalDays = this.oEndDate.getDate();
		this.iTotalWeeks = Math.ceil(
			(this.iCurrentMonthTotalDays + this.iStartDay - 1) / 7
		);

		const oPrevMonthEndDate = new Date(iYear, iMonth, 0);
		let iPrevMonthDay = oPrevMonthEndDate.getDate() - this.iStartDay + 2;
		let iNextMonthDay = 1;

		oRRStartDate = new Date(
			oRRStartDate.getFullYear(),
			oRRStartDate.getMonth(),
			oRRStartDate.getDate()
		);

		oRREndDate = new Date(
			oRREndDate.getFullYear(),
			oRREndDate.getMonth(),
			oRREndDate.getDate()
		);

		this.aDates = [];
		let bVisibility;
		let iValue;

		for (let i = 1; i <= this.iTotalWeeks * 7; i += 1) {
			let oDate;
			/* Previous month dates (if month does not start on Sunday) */
			if (i < this.iStartDay) {
				oDate = new Date(iYear, iMonth - 1, iPrevMonthDay);
				iPrevMonthDay = iPrevMonthDay + 1;
				bVisibility = false;
				/* Next month dates (if month does not end on Saturday) */
			} else if (i > this.iCurrentMonthTotalDays + (this.iStartDay - 1)) {
				oDate = new Date(iYear, iMonth + 1, iNextMonthDay);
				iNextMonthDay = iNextMonthDay + 1;
				bVisibility = false;
				/* Current month dates. */
			} else {
				oDate = new Date(iYear, iMonth, i - this.iStartDay + 1);
				bVisibility = true;
			}

			if (!(oRRStartDate <= oDate && oRREndDate >= oDate)) {
				bVisibility = false;
			}
			// Set selected month as the month with first capacity data
			if (oCapacityRequirements.has(oDate.getTime())) {
				iValue = oCapacityRequirements.get(oDate.getTime()).quantity;
				if (CalendarModel.oSelectedMonth) {
					if (CalendarModel.oSelectedMonth.year > oDate.getFullYear()) {
						CalendarModel.oSelectedMonth = {
							month: oDate.getMonth(),
							year: oDate.getFullYear()
						};
					} else if (CalendarModel.oSelectedMonth.year == oDate.getFullYear()								&&
								CalendarModel.oSelectedMonth.month > oDate.getMonth()) {
						CalendarModel.oSelectedMonth.month = oDate.getMonth();
					}
				} else {
					CalendarModel.oSelectedMonth = {
						month: oDate.getMonth(),
						year: oDate.getFullYear()
					};
				}
			} else {
				iValue = "0";
			}
			this.aDates.push({
				date: oDate,
				visibility: bVisibility,
				day: oDate.getDate(),
				value: iValue,
			});
		}
		return this.aDates;
	};

	// eslint-disable-next-line no-extend-native
	Date.prototype.getWeek = function() {
		const date = new Date(this.getTime());
		date.setHours(0, 0, 0, 0);
		// Thursday in current week decides the year.
		date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
		// January 4 is always in week 1.
		const week1 = new Date(date.getFullYear(), 0, 4);
		// Adjust to Thursday in week 1 and count number of weeks from date to week1.
		return (1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7));
	};

	/**
   * Generate month wise calander data which includes dates, weeks numbers and values
   *
   * @public
   * @param {Object} oStartDate start date of the requested duration
   * @param {Object} oEndDate end date of the requested duration
   * @param {Object} oCapacityRequirements Map containing capacity requirements data from backend
   * @return {Array} array of objects containing month wise calendar data
   */
	CalendarModel.generateData = function(
		oStartDate,
		oEndDate,
		oCapacityRequirements
	) {
		CalendarModel.oSelectedMonth = undefined;
		const aMonthRange = CalendarModel.getMonthRange(
			oStartDate.getTime(),
			oEndDate.getTime()
		);

		const aMonthWiseCalendar = [];
		let oMonth;
		let aWeeks;
		let oWeek;

		for (let j = 0; j < aMonthRange.length; j++) {
			oMonth = {};
			oMonth["month"] = new Date(
				aMonthRange[j][0],
				aMonthRange[j][1]
			).getTime();
			oMonth["monthTotal"] = "0";
			aWeeks = [];

			const currmonth = CalendarModel.monthInformation(
				aMonthRange[j][0],
				aMonthRange[j][1] + 1,
				oCapacityRequirements,
				oStartDate,
				oEndDate
			);

			for (let i = 0; i < currmonth.length; i += 7) {
				oWeek = {};
				oWeek["weekNumber"] = currmonth[i + 1]["date"].getWeek();
				oWeek["weekTotal"] = "10";
				oWeek["mon"] = currmonth[i];
				oWeek["tue"] = currmonth[i + 1];
				oWeek["wed"] = currmonth[i + 2];
				oWeek["thu"] = currmonth[i + 3];
				oWeek["fri"] = currmonth[i + 4];
				oWeek["sat"] = currmonth[i + 5];
				oWeek["sun"] = currmonth[i + 6];
				aWeeks.push(oWeek);
			}
			oMonth["weeks"] = aWeeks;
			aMonthWiseCalendar.push(oMonth);
		}

		return {
			aMonthWiseCalendar,
			month: CalendarModel.oSelectedMonth ? CalendarModel.oSelectedMonth.month : undefined,
			year: CalendarModel.oSelectedMonth ? CalendarModel.oSelectedMonth.year : undefined
		};
	};

	return CalendarModel;
});

