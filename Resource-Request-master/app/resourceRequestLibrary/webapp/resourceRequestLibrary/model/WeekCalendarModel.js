sap.ui.define(["resourceRequestLibrary/utils/Constants",
	"resourceRequestLibrary/utils/DateHelper",
	"sap/ui/core/format/DateFormat"],
function(Constants, DateHelper, DateFormat) {
	const WeekCalendarModel = {};
	WeekCalendarModel.oFormat = DateFormat.getDateInstance();
	/**
	   * Generates week wise model.
	   * @public
	   * @param {Date} oRRStartDate resource request start date.
	   * @param {Date} oRREndDate resource request end date.
	   * @param {Map} oCapacityRequirements Map containing capacity that is already maintained in the backend.
	   * @param {Object} oI18nedModel i18n model for resource request library.
	   * @return {Object} oModel for Dialog.
	   */
	WeekCalendarModel.generateModel = function(oRRStartDate, oRREndDate, oCapacityRequirements, oI18nedModel) {
		WeekCalendarModel.oSelectedQuarter = undefined;
		let iRRStartYear = oRRStartDate.getFullYear();
		let iRREndYear = oRREndDate.getFullYear();
		iRRStartYear = DateHelper.considerPreviousYearForWeekWise(oRRStartDate) ? iRRStartYear - 1 : iRRStartYear;
		iRREndYear = DateHelper.considerNextYearForWeekWise(oRREndDate) ? iRREndYear + 1 : iRREndYear;
		const oModel = {};
		for (let iCurrentYear = iRRStartYear; iCurrentYear <= iRREndYear; iCurrentYear++) {
			const oYearData = WeekCalendarModel.generateModelForYear(iCurrentYear, oRRStartDate, oRREndDate,
				oCapacityRequirements, oI18nedModel);
			if (Object.keys(oYearData).length !== 0) {
				oModel[iCurrentYear] = {
					"year": iCurrentYear,
					"data": oYearData,
					"Q1enabled": oYearData["Q1 " + iCurrentYear] ? true : false,
					"Q2enabled": oYearData["Q2 " + iCurrentYear] ? true : false,
					"Q3enabled": oYearData["Q3 " + iCurrentYear] ? true : false,
					"Q4enabled": oYearData["Q4 " + iCurrentYear] ? true : false,
					"Q1Key": "Q1 " + iCurrentYear,
					"Q2Key": "Q2 " + iCurrentYear,
					"Q3Key": "Q3 " + iCurrentYear,
					"Q4Key": "Q4 " + iCurrentYear,
					"selectedKey": Constants.unselectKey
				};
			}
		}
		return {
			oModel,
			quarter: WeekCalendarModel.oSelectedQuarter ? WeekCalendarModel.oSelectedQuarter.quarter : undefined,
			year: WeekCalendarModel.oSelectedQuarter ? WeekCalendarModel.oSelectedQuarter.year : undefined
		};
	};
	/**
	   * Check if the week dates are valid based on resource request dates.
	   * Add Value State for partial weeks.
	   * Add Value state for week which has dates from previous/next month.
	   * @public
	   * @param {Date} oWeekStartDate week start date.
	   * @param {Date} oWeekEndDate week end date.
	   * @param {Date} oRRStartDate resource request start date.
	   * @param {Date} oRREndDate resource request end date.
	   * @param {Object} oI18nedModel i18n model for resource request library.
	   * @return {Object} Object containg flag if dates are valid, updated dates(if required),
	   * Value State as information for partial week and week having dates from different months.
	   */
	WeekCalendarModel.checkValidDates = function(oWeekStartDate, oWeekEndDate, oRRStartDate, oRREndDate, oI18nedModel) {
		const oSupported = {
			valid: true,
			valueState: "None",
			valueStateText: ""
		};
		// If week dates are completely outside the resource request date we disbale the input box in UI.
		if (
			(oWeekStartDate.getTime() < oRRStartDate.getTime() && oWeekEndDate.getTime() < oRRStartDate.getTime()) ||
			(oWeekStartDate.getTime() > oRREndDate.getTime() && oWeekEndDate.getTime() > oRREndDate.getTime())) {
			oSupported.valid = false;
			return oSupported;
		}
		const bWeekStartDateinRange = DateHelper.inRange(oWeekStartDate, oRRStartDate, oRREndDate);
		const bWeekEndtDateinRange = DateHelper.inRange(oWeekEndDate, oRRStartDate, oRREndDate);
		oSupported.startDate = oWeekStartDate;
		oSupported.endDate = oWeekEndDate;

		// Add Valuestate and message for weeks which have dates from next/previous month.
		if (bWeekStartDateinRange && bWeekEndtDateinRange) {
			if (oSupported.startDate.getMonth() != oSupported.endDate.getMonth()) {
				/*
				 * If the week start date and week end date are of different months
				 * that means the week is split over different months.
				 */
				if (oSupported.endDate.getDate() <= 3) {
					/*
					 * If the week end date is 1st, 2nd or 3rd
					 * that means some of the dates in this CW are from the next month.
					 * Example:
					 * Start Date is 27th June 2021
					 * End   Date is  3rd july 2021
					 */
					oSupported.valueState = "Information";
					oSupported.valueStateText = oI18nedModel.getProperty("SPLIT_CW_NEXT");
				} else {
					/*
					 * If the week end date is not 1st, 2nd or 3rd
					 * that means we have some dates of previous week in this CW.
					 * Example:
					 * Start Date is 29th August    2021
					 * End   Date is  4th September 2021
					 */
					oSupported.valueState = "Information";
					oSupported.valueStateText = oI18nedModel.getProperty("SPLIT_CW_PREVIOUS");
				}
			}
		}
		/*
		* Week start date is less that the resource request start date thus we use resource request start date as
		* the week start date.
		* We also add a Value State with relevant info.
		*/
		if (!bWeekStartDateinRange) {
			oSupported.startDate = oRRStartDate;
			oSupported.valueState = "Information";
			oSupported.valueStateText = oI18nedModel.getProperty("PARTIAL_WEEK_TIME_PERIOD");
		}
		/*
		* Week end date is greater that the resource request end date thus we use resource request end date as
		* the week end date.
		* We also add a Value State with relevant info.
		*/
		if (!bWeekEndtDateinRange) {
			oSupported.endDate = oRREndDate;
			oSupported.valueState = "Information";
			oSupported.valueStateText = oI18nedModel.getProperty("PARTIAL_WEEK_TIME_PERIOD");
		}
		oSupported.startDate = DateHelper.getCorrectDate(oSupported.startDate);
		oSupported.endDate = DateHelper.getCorrectDate(oSupported.endDate);

		return oSupported;
	};

	/**
	   * Delete quarter data if none of the week input fields are enabled.
	   * @public
	   * @param {Object} oMap map containing year data.
	   * @param {int} iYear year number.
	   * @return {Object} Updated map.
	   */
	WeekCalendarModel.cleanQuarterData = function(oMap, iYear) {
		// Delete quarter in which all weeks are marked as enabled false
		for (const sQuarter in Constants.quarterEnum) {
			const sKey = sQuarter + " " + iYear;
			let bDeleteQuarter = true;

			oMap[sKey].months.forEach((oMonthData) => {
				oMonthData.weeks.forEach((oWeek) => {
					// Mark delete as false if even 1 week has enable as true.
					if (oWeek.enabled == true) {
						bDeleteQuarter = false;
					}
				});
			});
			if (bDeleteQuarter) {
				delete oMap[sKey];
			}
		}
		return oMap;
	};
	/**
	   * Add a 5th non visible week to model if there are only 4 weeks in the month.
	   * @public
	   * @param {Object} oMap Map containing year data.
	   * @param {int} iYear year number.
	   * @return {Object} Updated map.
	   */
	WeekCalendarModel.fillFifthWeekWhereFour = function(oMap, iYear) {
		/*
		* We can have min 4 and max 5 weeks in a month.
		* Our UI expects 5 in the data model so for month which has 4 week we add a 5th week with visible as false.
		*/
		for (const sQuarter in Constants.quarterEnum) {
			const sKey = sQuarter + " " + iYear;
			if (oMap[sKey]) {
				oMap[sKey].months.forEach((oMonthData) => {
					// Add a 5th invisible week if month has only 4 weeks.
					if (oMonthData.weeks.length === 4) {
						oMonthData.weeks.push({
							visible: false
						});
					}
				});
			}
		}
		return oMap;
	};

	/**
	   * Add a 5th non visible week to model if there are only 4 weeks in the month.
	   * @public
	   * @param {int} iMonth month number.
	   * @param {int} iWeeekNumber week number.
	   * @param {Object} oIsDateValid valid week flag, updated dates for partial weeks, Value state wherever required.
	   * @param {Object} oCapacityRequirements Map containing capacity that is already maintained in the backend.
	   * @param {int} iYear Year in which the which is present.
	   * @return {Object} Week info.
	   */
	WeekCalendarModel.getWeekData = function(iMonth, iWeeekNumber, oIsDateValid, oCapacityRequirements, iYear) {
		const oWeekInfo = {
			month: iMonth + 1,
			weekNumber: iWeeekNumber
		};
		if (oIsDateValid.valid) {
			oWeekInfo.startDate = oIsDateValid.startDate;
			oWeekInfo.toolTipForStartDate = WeekCalendarModel.oFormat.format(oIsDateValid.startDate);
			oWeekInfo.endDate = oIsDateValid.endDate;
			oWeekInfo.toolTipForEndDate = WeekCalendarModel.oFormat.format(oIsDateValid.endDate);
			oWeekInfo.enabled = true;
			oWeekInfo.visible = true;
			oWeekInfo.valueState = oIsDateValid.valueState;
			oWeekInfo.valueStateText = oIsDateValid.valueStateText;
			const oStartDateKey = oIsDateValid.startDate.getTime();
			// Set selected quarter as the quarter with first capacity data
			if (oCapacityRequirements.has(oStartDateKey)) {
				oWeekInfo.value = oCapacityRequirements.get(oStartDateKey).capacity;

				if (WeekCalendarModel.oSelectedQuarter) {
					if (WeekCalendarModel.oSelectedQuarter.year > iYear) {
						WeekCalendarModel.oSelectedQuarter = {
							year: iYear,
							quarter: DateHelper.quarterOfMonth(iMonth + 1)
						};
					} else if (WeekCalendarModel.oSelectedQuarter.year == iYear &&
					WeekCalendarModel.oSelectedQuarter.quarter > DateHelper.quarterOfMonth(iMonth + 1)) {
						WeekCalendarModel.oSelectedQuarter.quarter = DateHelper.quarterOfMonth(iMonth + 1);
					}
				} else {
					WeekCalendarModel.oSelectedQuarter = {
						year: iYear,
						quarter: DateHelper.quarterOfMonth(iMonth + 1)
					};
				}
			} else {
				oWeekInfo.value = 0;
			}
		} else {
			oWeekInfo.enabled = false;
			oWeekInfo.visible = true;
			oWeekInfo.value = 0;
		}
		return oWeekInfo;
	};
	/**
	   * Spilt months into quarters.
	   * @public
	   * @param {Object} oMonthMap month wise data in map.
	   * @param {int} iYear year number.
	   * @return {Object} Quarter wise info.
	   */
	WeekCalendarModel.getDataStructuredinQuarter = function(oMonthMap, iYear) {
		const oFinalMap = {};
		for (const sQuarter in Constants.quarterEnum) {
			oFinalMap[sQuarter + " " + iYear] = {
				quarter: sQuarter,
				year: iYear,
				months: [
					oMonthMap[Constants.monthEnum[Constants.quarterEnum[sQuarter][0]]],
					oMonthMap[Constants.monthEnum[Constants.quarterEnum[sQuarter][1]]],
					oMonthMap[Constants.monthEnum[Constants.quarterEnum[sQuarter][2]]]
				]
			};
		}
		return oFinalMap;
	};
	/**
	   * Generates week wise model for specefic year.
	   * @public
	   * @param {int} iYear year number.
	   * @param {Date} oRRStartDate resource request start date.
	   * @param {Date} oRREndDate resource request end date.
	   * @param {Map} oCapacityRequirements Map containing capacity that is already maintained in the backend.
	   * @param {Object} oI18nedModel i18n model for resource request library.
	   * @return {Object} week data of specefic year..
	   */
	WeekCalendarModel.generateModelForYear = function(iYear, oRRStartDate, oRREndDate, oCapacityRequirements,
		oI18nedModel) {
		const iFirstJanDay = new Date(iYear, 0, 1).getDay();
		let oWeekOneStartDate;
		if (iFirstJanDay === 1) {
			/*
            1st January is on Monday
            1st Januray will be start of first week
            */
			oWeekOneStartDate = new Date(iYear, 0, 1);
		} else if (iFirstJanDay === 0) {
			/*
            1st January is on Sunday
            2nd January will be start of first week
            */
			oWeekOneStartDate = new Date(iYear, 0, 2);
		} else if (iFirstJanDay <= 4) {
			/*
            1st Januray is Tuesday   = 31th December will be start of 1st week
            1st Januray is Wednesday = 30th December will be start of 1st week
			1st Januray is Thursday  = 29th December will be start of 1st week
            */
			oWeekOneStartDate = new Date(iYear - 1, 11, 31 - iFirstJanDay + 2);
		} else {
			/*
            1st Januray is Friday   = 4rd Januray will be start of 1st week
            1st Januray is Saturday = 3nd Januray will be start of 1st week
             */
			oWeekOneStartDate = new Date(iYear, 0, 7 - iFirstJanDay + 2);
		}
		// Initialize start points
		const oMonthMap = {};
		let iWeeekNumber = 1;
		let iMonth = 0;
		let oStartDate = oWeekOneStartDate;
		let oEndDate = DateHelper.addDays(oWeekOneStartDate, 6);
		// Generate Data for all weeks of current year
		while (oEndDate.getFullYear() == iYear) {
			if ( (oEndDate.getMonth() !== iMonth ) && (oStartDate.getMonth() === iMonth )) {
				const oFirstDateofNextMonth = new Date(iYear, iMonth + 1, 1);
				if (oFirstDateofNextMonth.getDay() <= 4 && oFirstDateofNextMonth.getDay() != 0) {
					iMonth++;
				}
			} else if ((oEndDate.getMonth() !== iMonth) && (oStartDate.getMonth() !== iMonth)) {
				iMonth++;
			}

			if (!oMonthMap[Constants.monthEnum[iMonth]]) {
				oMonthMap[Constants.monthEnum[iMonth]] = {
					monthText: oI18nedModel.getProperty(Constants.monthEnum[iMonth]),
					weeks: []
				};
			}
			const oIsDateValid = WeekCalendarModel.checkValidDates(oStartDate, oEndDate, oRRStartDate, oRREndDate,
				oI18nedModel);
			const oWeekInfo = WeekCalendarModel.getWeekData(iMonth, iWeeekNumber, oIsDateValid, oCapacityRequirements,
				iYear);
			oMonthMap[Constants.monthEnum[iMonth]]["weeks"].push(oWeekInfo);
			// Prepare for next iteration
			iWeeekNumber++;
			oStartDate = DateHelper.addDays(oStartDate, 7);
			oEndDate = DateHelper.addDays(oEndDate, 7);
		}
		/*
		* If the End Date is 1st Jan/ 2nd Jan/ 3rd Jan then the week will lie in current year
		* else it will be part of next year
		*/
		if (oEndDate.getDate() <= 3 ) {
			const oIsDateValid = WeekCalendarModel.checkValidDates(oStartDate, oEndDate, oRRStartDate, oRREndDate,
				oI18nedModel);
			const oWeekInfo = WeekCalendarModel.getWeekData(iMonth, iWeeekNumber, oIsDateValid, oCapacityRequirements,
				iYear);
			oMonthMap[Constants.monthEnum[iMonth]]["weeks"].push(oWeekInfo);
		}
		let oFinalMap = WeekCalendarModel.getDataStructuredinQuarter(oMonthMap, iYear);
		oFinalMap = WeekCalendarModel.cleanQuarterData(oFinalMap, iYear);
		oFinalMap = WeekCalendarModel.fillFifthWeekWhereFour(oFinalMap, iYear);
		return oFinalMap;
	};

	return WeekCalendarModel;
});
