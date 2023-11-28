sap.ui.define(
	[
		"capacityGridUi/view/Views",
		"capacityGridUi/reuse/DateUtils",
		"capacityGridUi/reuse/formatters/DateFormatter",
		"sap/ui/core/format/DateFormat"
	],
	function (Views, Utils, DateFormatter, DateFormat) {
		"use strict";

		return class ColumnsMap extends Map {
			constructor(oBundle, sView, sStartDate, sEndDate) {
				super();
				this.oBundle = oBundle;
				let sDateFormatPattern = sView === Views.MONTHLY ? "yyyyMM" : "yyyyMMdd";
				let oDateFormat = DateFormat.getInstance({ pattern: sDateFormatPattern });
				let sStart = String(oDateFormat.format(sStartDate));
				let sEnd = String(oDateFormat.format(sEndDate));
				this.create(sView, sStart, sEnd);
			}

			create(sView, sStartDate, sEndDate) {
				if (sView === Views.MONTHLY) {
					let iStartMonth = parseInt(sStartDate.substr(4), 10);
					let iStartYear = parseInt(sStartDate.substr(0, 4), 10);
					let iEndMonth = parseInt(sEndDate.substr(4), 10);
					let iEndYear = parseInt(sEndDate.substr(0, 4), 10);
					this.createMonthly(iStartMonth, iStartYear, iEndMonth, iEndYear);
				} else if (sView === Views.WEEKLY) {
					let iCWNoStart = Utils.getCalendarWeek(sStartDate);
					// let oCWStartRange = Utils.getDateRangeOfWeek(iCWNoStart,sStartDate);
					let iCWNoEnd = Utils.getCalendarWeek(sEndDate);
					//  let oCWEndRange = Utils.getDateRangeOfWeek(iCWNoEnd,sEndDate);
					let iStartYear = parseInt(sStartDate.substr(0, 4), 10);
					let iEndYear = parseInt(sEndDate.substr(0, 4), 10);
					this.createWeekly(iCWNoStart, iStartYear, iCWNoEnd, iEndYear);
				} else {
					this.createDaily(sStartDate, sEndDate);
				}
			}

			createMonthly(iStartMonth, iStartYear, iEndMonth, iEndYear) {
				let sColName;
				let oDate = new Date(iStartYear, iStartMonth - 1);
				let iNumsOfMonths = (iEndYear - iStartYear) * 12 + (iEndMonth - iStartMonth) + 1;
				for (let i = 0; i < iNumsOfMonths; i++) {
					sColName = DateFormatter.dateByYearMonth(oDate);
					this.set(this.getKey(oDate), sColName);
					oDate.setMonth(oDate.getMonth() + 1);
				}
			}

			createWeekly(iStartWeek, iStartYear, iEndWeek, iEndYear) {
				let noOfWeeks;
				let iMaxCalYears = this.getNumberofCalWeeks(iStartYear);
				if (iStartWeek > iEndWeek) {
					noOfWeeks = iMaxCalYears - iStartWeek + iEndWeek + 1;
				} else {
					noOfWeeks = iEndWeek - iStartWeek + 1;
				}
				let iWeek = iStartWeek;
				let iYear = iStartYear;

				for (let i = 0; i < noOfWeeks; i++) {
					if (iWeek > iMaxCalYears) {
						iYear = iEndYear;
						iWeek = 1;
					}
					let sWeekRange = this.getWeekDateRange(iWeek, iYear);
					let sColName = this.oBundle.getText("CAL_WEEK", [this.formatCW(iWeek)]) + "\n" + sWeekRange;
					let column = "";
					column = iYear.toString() + this.formatCW(iWeek);
					this.set(column, sColName);
					iWeek++;
				}
			}

			createDaily(sStartDate, sEndDate) {
				let sColName;
				let oDate = new Date(sStartDate.substr(0, 4), sStartDate.substr(4, 2) - 1, sStartDate.substr(6, 2));
				let oEndDate = new Date(sEndDate.substr(0, 4), sEndDate.substr(4, 2) - 1, sEndDate.substr(6, 2));
				let diffInTime = oEndDate.getTime() - oDate.getTime();
				let diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));

				for (let i = 0; i <= diffInDays; i++) {
					sColName = DateFormatter.dateByWeekDay(oDate) + "\n" + DateFormatter.dateByMonthDay(oDate);
					this.set(this.getKey(oDate), sColName);
					oDate.setDate(oDate.getDate() + 1);
				}
			}

			formatCW(week) {
				return week < 10 ? "0" + week.toString() : week.toString();
			}

			getWeekDateRange(iWeek, iYear) {
				let oDate = new Date(iYear, 0, 1 + (iWeek - 1) * 7);
				let dow = oDate.getDay();
				let ISOweekStart = oDate;
				let sRangeWeek;
				if (dow <= 4) ISOweekStart.setDate(oDate.getDate() - oDate.getDay() + 1);
				else ISOweekStart.setDate(oDate.getDate() + 8 - oDate.getDay());

				let ISOweekEnd = new Date(ISOweekStart);
				ISOweekEnd.setDate(ISOweekEnd.getDate() + 6);

				sRangeWeek = DateFormatter.rangeByMonthDay(ISOweekStart, ISOweekEnd);

				return sRangeWeek;
			}

			getNumberofCalWeeks(iYear) {
				let calYear = String(iYear + 1);
				let oDate = new Date(calYear);
				oDate.setHours(0, 0, 0);
				oDate.setDate(oDate.getDate() - 1);
				return Utils.getWeek(oDate);
			}

			getKey(oDate) {
				let iDate = oDate.getDate();
				let iMonth = oDate.getMonth() + 1;
				let sDate = iDate <= 9 ? 0 + iDate.toString() : iDate.toString();
				let sMonth = iMonth <= 9 ? 0 + iMonth.toString() : iMonth.toString();
				return oDate.getFullYear() + sMonth + sDate;
			}

			getKeyByTimePeriod(sTimePeriod, sView) {
				if (sView === Views.DAILY) {
					let oDate = new Date(sTimePeriod);
					return this.getKey(oDate);
				} else if (sView === Views.WEEKLY) {
					return sTimePeriod;
				} else {
					let sYear = sTimePeriod.substr(0, 4);
					let sMonth = sTimePeriod.substr(4, 6) - 1;
					let oDate = new Date(sYear, sMonth);
					return this.getKey(oDate);
				}
			}
		};
	}
);
