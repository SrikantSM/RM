sap.ui.define(
	[
		"sap/ui/model/json/JSONModel",
		"resourceRequestLibrary/model/CalendarModel",
		"sap/m/MessagePopover",
		"sap/m/MessagePopoverItem",
		"resourceRequestLibrary/utils/URL",
		"resourceRequestLibrary/utils/DateHelper",
	],
	function(JSONModel, CalendarModel, MessagePopover, MessagePopoverItem, URL, DateHelper) {
		let aCalData = [];
		const oCapacityRequirements = new Map();
		const oCurrMonthModel = new JSONModel();
		let fTotalEffort = 0;
		let sAppName;
		let iMinMonth;
		let iMaxMonth;
		const setNavigationVisibility = function(oView) {
			oView.getModel("currMonth").setProperty("/visible", true);
			oView.getModel("currMonth").setProperty("/navForVisi", true);
			oView.getModel("currMonth").setProperty("/navBackVisi", true);
			if (
				iMinMonth === oCurrMonthModel.getData().currMonthData.month
			) {
				oView.getModel("currMonth").setProperty("/navBackVisi", false);
			}
			if (
				iMaxMonth === oCurrMonthModel.getData().currMonthData.month
			) {
				oView.getModel("currMonth").setProperty("/navForVisi", false);
			}
		};

		const disableMonthNavigation = function(oView) {
			oView.getModel("currMonth").setProperty("/visible", false);
			oView.getModel("currMonth").setProperty("/navForVisi", false);
			oView.getModel("currMonth").setProperty("/navBackVisi", false);
		};

		return {
			/**
	   * Set the App Name
	   * @public
	   * @param {String} sName App name
	   */
			setAppName: function(sName) {
				sAppName = sName;
			},
			/**
	   * This is called on press of open Calender View Icon
	   * Following steps occurs:
	   *   1. Data from capacity requirement table is loaded in a Map
	   *   2. Calendar Model function to generate the months wise data
	   *   3. Current month data is set to the JSONModel
	   * @public
	   * @param {Object} oEvent Event
	   */
			onOpenCalendarView: function(oEvent) {
				const that = this;
				const oView = this._view;
				const oBindingContext = oEvent.getSource().getBindingContext();
				const sResourceRequestId = oBindingContext.getProperty("ID");
				const startDate = new Date(oBindingContext.getProperty("startDate"));
				const oRequestedStartDate = DateHelper.convertDateToUTC(startDate);
				const endDate = new Date(oBindingContext.getProperty("endDate"));
				const oRequestedEndDate = DateHelper.convertDateToUTC(endDate);
				const bDisplayMode = !this.getModel("ui").getData().isEditable;
				const oModel = this.getModel();
				fTotalEffort = Number(oBindingContext.getProperty("requestedCapacity"));
				const sUrl = URL.generate(sResourceRequestId, sAppName === "Manage" ? bDisplayMode : undefined);
				this.oList = oModel.bindList(sUrl);
				oCapacityRequirements.clear();
				// create a message manager and register the message model for error handling
				this._oMessageManager = sap.ui.getCore().getMessageManager();
				this._oMessageManager.registerObject(oView, true);
				oView.setModel(this._oMessageManager.getMessageModel(), "message");

				this.oMessageTemplate = new MessagePopoverItem({
					type: "{message>type}",
					title: "{message>message}",
					subtitle: "{message>additionalText}",
					description: "{message>description}",
				});

				this.oMessagePopover = new MessagePopover({
					items: {
						path: "message>/",
						template: this.oMessageTemplate,
					},
				});

				// Load Fragment and attach to the view
				if (!this.pEffortDistCalendarView) {
					this.pEffortDistCalendarView = this.loadFragment({
						id: "monthcalendar",
						name: "resourceRequestLibrary.fragment.DayWiseCalendar",
						controller: this,
					}).then(
						function(oDialog) {
							that.addDependent(oDialog);
							oDialog.attachAfterOpen(
								function() {
									oView.addDependent(this.oMessagePopover);
								}.bind(this)
							);
							oDialog.attachAfterClose(
								function() {
									this.oMessagePopover.destroyItems();
									oView.getModel("currMonth").setProperty("/", {});
									if (!bDisplayMode) {
										// Below code is added to avoid inconsistency when Dialog is closed.
										oView.getBindingContext().requestSideEffects(["requestedCapacity"]);
									}
								}.bind(this)
							);
							oDialog.attachAfterOpen(
								function() {
									this.oMessagePopover.destroyItems();
									const aMessages = sap.ui
										.getCore()
										.getMessageManager()
										.getMessageModel()
										.getData();
									const sMessage = aMessages.filter(function(mItem) {
										return mItem.target === "";
									});
									sap.ui.getCore().getMessageManager().removeMessages(sMessage);
								}.bind(this)
							);
							return oDialog;
						}.bind(this)
					);
				}

				this.oList
					.requestContexts(0, 9999, "$direct")
					.then(function(aCapacityRequirements) {
						aCapacityRequirements.forEach(function(oContext) {
						  const startDate = new Date(oContext.getProperty("startDate"));
							const oDate = DateHelper.convertDateToUTC(startDate);

							const iQuantity = parseInt(
								oContext.getProperty("requestedCapacity")
							);

							if (oRequestedStartDate <= oDate && oRequestedEndDate >= oDate) {
								oCapacityRequirements.set(
									new Date(
										oDate.getFullYear(),
										oDate.getMonth(),
										oDate.getDate()
									).getTime(),
									{
										quantity: iQuantity,
										context: oContext,
									}
								);
							}
						});
						const oGeneratedData = CalendarModel.generateData(
							oRequestedStartDate,
							oRequestedEndDate,
							oCapacityRequirements
						);
						aCalData = oGeneratedData.aMonthWiseCalendar;
						let selectedmonthData;
						// Set year and month according to capacity data (first month if no data)
						if (oGeneratedData.year) {
							// eslint-disable-next-line consistent-return
							selectedmonthData = aCalData.filter((monthInformation ) => {
								if (monthInformation.month == (new Date(
									oGeneratedData.year, oGeneratedData.month)).getTime()) {
									return monthInformation;
								}
							})[0];
						}
						oCurrMonthModel.setData({currMonthData: (selectedmonthData ? selectedmonthData : aCalData[0])});
						oView.setModel(oCurrMonthModel, "currMonth");

						iMinMonth = aCalData[0].month;
						iMaxMonth = aCalData[aCalData.length - 1].month;

						// setting total entered effort
						oView
							.getModel("currMonth")
							.setProperty("/totalEffort", parseFloat(fTotalEffort));
						that.pEffortDistCalendarView.then(function(oDialog) {
							oDialog.open();
						});
					});
			},

			/**
	   * This is called after the dialog is opened.
	   * Set intial value's for month date picker
	   * @public
	   * @param {Object} oEvent Event
	   */
			afterOpenDialog: function(oEvent) {
				const oView = this._view;
				const bDisplayMode = !this.getModel("ui").getData().isEditable;
				const oBindingContext = oEvent.getSource().getBindingContext();

				// will be replaced with extenstionAPI byID method in next release
				const oMonthPicker = sap.ui
					.getCore()
					.byId("monthcalendar--MonthDatePicker");

				const selectedMonthDate = new Date(oView.getModel("currMonth").oData.currMonthData.month);
				const startDate = new Date(oBindingContext.getProperty("startDate"));
				const oStartDate = DateHelper.convertDateToUTC(startDate);
				const endDate = new Date(oBindingContext.getProperty("endDate"));
				const oEndDate = DateHelper.convertDateToUTC(endDate);

				// Set First Day of the month as min date
				oMonthPicker.setMinDate(
					new Date(oStartDate.getFullYear(), oStartDate.getMonth())
				);

				// Set Last Day of the month as max date
				oMonthPicker.setMaxDate(
					new Date(oEndDate.getFullYear(), oEndDate.getMonth() + 1, 0)
				);

				// Set First Day of the month as current date
				oMonthPicker.setDateValue(selectedMonthDate);

				// Set Keyboard mode
				const oTable = sap.ui.getCore().byId("monthcalendar--calendarTable");
				if (bDisplayMode) {
					oTable.setKeyboardMode(sap.m.ListKeyboardMode.Navigation);
				} else {
					oTable.setKeyboardMode(sap.m.ListKeyboardMode.Edit);
				}

				// setting back button visibility of forward backward buttons
				setNavigationVisibility(oView);
			},

			// This event is called  to keep focus on the input box when enter is pressed
			onsapenter: function(oEvent) {
				oEvent.stopPropagation();
			},

			/**
	   * This is called when user changes month using date picker
	   * @public
	   * @param {Object} oEvent Event
	   */
			onMonthChange: function(oEvent) {
				const oView = this._view;
				// Try with sap date formatter
				const oSelectedMonth = new Date(
					oEvent
						.getParameters()
						.newValue.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3")
				);

				const iSelectedMonth = new Date(
					oSelectedMonth.getFullYear(),
					oSelectedMonth.getMonth()
				).getTime();

				const aMonthData = aCalData.find((o) => o.month === iSelectedMonth);

				if (typeof aMonthData !== "undefined") {
					// to persist the value on change of months through date picker
					const iLen = aMonthData.weeks.length;
					if (
						oCurrMonthModel.getData().currMonthData.weeks[0].weekNumber ===
						aMonthData.weeks[iLen - 1].weekNumber
					) {
						aMonthData.weeks[
							iLen - 1
						].mon.value = oCurrMonthModel.getData().currMonthData.weeks[0].mon.value;
						aMonthData.weeks[
							iLen - 1
						].tue.value = oCurrMonthModel.getData().currMonthData.weeks[0].tue.value;
						aMonthData.weeks[
							iLen - 1
						].wed.value = oCurrMonthModel.getData().currMonthData.weeks[0].wed.value;
						aMonthData.weeks[
							iLen - 1
						].thu.value = oCurrMonthModel.getData().currMonthData.weeks[0].thu.value;
						aMonthData.weeks[
							iLen - 1
						].fri.value = oCurrMonthModel.getData().currMonthData.weeks[0].fri.value;
						aMonthData.weeks[
							iLen - 1
						].sat.value = oCurrMonthModel.getData().currMonthData.weeks[0].sat.value;
						aMonthData.weeks[
							iLen - 1
						].sun.value = oCurrMonthModel.getData().currMonthData.weeks[0].sun.value;
					}
					const iLength = oCurrMonthModel.getData().currMonthData.weeks.length;
					if (
						oCurrMonthModel.getData().currMonthData.weeks[iLength - 1]
							.weekNumber === aMonthData.weeks[0].weekNumber
					) {
						aMonthData.weeks[0].mon.value = oCurrMonthModel.getData().currMonthData.weeks[
							iLength - 1
						].mon.value;
						aMonthData.weeks[0].tue.value = oCurrMonthModel.getData().currMonthData.weeks[
							iLength - 1
						].tue.value;
						aMonthData.weeks[0].wed.value = oCurrMonthModel.getData().currMonthData.weeks[
							iLength - 1
						].wed.value;
						aMonthData.weeks[0].thu.value = oCurrMonthModel.getData().currMonthData.weeks[
							iLength - 1
						].thu.value;
						aMonthData.weeks[0].fri.value = oCurrMonthModel.getData().currMonthData.weeks[
							iLength - 1
						].fri.value;
						aMonthData.weeks[0].sat.value = oCurrMonthModel.getData().currMonthData.weeks[
							iLength - 1
						].sat.value;
						aMonthData.weeks[0].sun.value = oCurrMonthModel.getData().currMonthData.weeks[
							iLength - 1
						].sun.value;
					}
					const iMonthSum = oView
						.getModel("currMonth")
						.getProperty("/totalEffort");
					oCurrMonthModel.setData({currMonthData: aMonthData});
					oView.setModel(oCurrMonthModel, "currMonth");
					oView.getModel("currMonth").setProperty("/totalEffort", iMonthSum);

					// to set the visibility of back arrow if selected month is first month
					setNavigationVisibility(oView);
				}
			},

			/**
	   * This is called when "Back" button is clicked
	   * Set model with previous month data
	   * @public
	   * @param {Object} oEvent Event
	   */
			onPreviousMonth: function(oEvent) {
				const oView = this._view;

				const oCurrMonth = new Date(
					oView.getModel("currMonth").getProperty("/currMonthData/month")
				);

				// Get previous month
				const iPreviousMonth = oCurrMonth.setMonth(oCurrMonth.getMonth() - 1);

				// find the if previous month exists in the aCalData model then set it to a model
				const aMonthData = aCalData.find((o) => o.month === iPreviousMonth);

				if (typeof aMonthData !== "undefined") {
					const iLen = aMonthData.weeks.length;
					if (
						oCurrMonthModel.getData().currMonthData.weeks[0].weekNumber ===
						aMonthData.weeks[iLen - 1].weekNumber
					) {
						aMonthData.weeks[
							iLen - 1
						].mon.value = oCurrMonthModel.getData().currMonthData.weeks[0].mon.value;
						aMonthData.weeks[
							iLen - 1
						].tue.value = oCurrMonthModel.getData().currMonthData.weeks[0].tue.value;
						aMonthData.weeks[
							iLen - 1
						].wed.value = oCurrMonthModel.getData().currMonthData.weeks[0].wed.value;
						aMonthData.weeks[
							iLen - 1
						].thu.value = oCurrMonthModel.getData().currMonthData.weeks[0].thu.value;
						aMonthData.weeks[
							iLen - 1
						].fri.value = oCurrMonthModel.getData().currMonthData.weeks[0].fri.value;
						aMonthData.weeks[
							iLen - 1
						].sat.value = oCurrMonthModel.getData().currMonthData.weeks[0].sat.value;
						aMonthData.weeks[
							iLen - 1
						].sun.value = oCurrMonthModel.getData().currMonthData.weeks[0].sun.value;
					}
					const iMonthSum = oView
						.getModel("currMonth")
						.getProperty("/totalEffort");
					oCurrMonthModel.setData({currMonthData: aMonthData});
					oEvent.getSource().setModel(oCurrMonthModel, "currMonth");
					oView.getModel("currMonth").setProperty("/totalEffort", iMonthSum);
					const oMonth = new Date(iPreviousMonth);
					// setting the visibility of forward and backward buttons
					setNavigationVisibility(oView);
					sap.ui
						.getCore()
						.byId("monthcalendar--MonthDatePicker")
						.setDateValue(new Date(oMonth.getFullYear(), oMonth.getMonth()));
				}
			},

			/**
	   * This is called when "Forward" button is clicked
	   * Set model with next month data
	   * @public
	   * @param {Object} oEvent Event
	   */
			onNextMonth: function(oEvent) {
				const oView = this._view;

				const oCurrMonth = new Date(
					oView.getModel("currMonth").getProperty("/currMonthData/month")
				);
				const iNextMonth = oCurrMonth.setMonth(oCurrMonth.getMonth() + 1);

				const aMonthData = aCalData.find((o) => o.month === iNextMonth);

				if (typeof aMonthData !== "undefined") {
					const iLen = oCurrMonthModel.getData().currMonthData.weeks.length;
					if (
						oCurrMonthModel.getData().currMonthData.weeks[iLen - 1]
							.weekNumber === aMonthData.weeks[0].weekNumber
					) {
						aMonthData.weeks[0].mon.value = oCurrMonthModel.getData().currMonthData.weeks[
							iLen - 1
						].mon.value;
						aMonthData.weeks[0].tue.value = oCurrMonthModel.getData().currMonthData.weeks[
							iLen - 1
						].tue.value;
						aMonthData.weeks[0].wed.value = oCurrMonthModel.getData().currMonthData.weeks[
							iLen - 1
						].wed.value;
						aMonthData.weeks[0].thu.value = oCurrMonthModel.getData().currMonthData.weeks[
							iLen - 1
						].thu.value;
						aMonthData.weeks[0].fri.value = oCurrMonthModel.getData().currMonthData.weeks[
							iLen - 1
						].fri.value;
						aMonthData.weeks[0].sat.value = oCurrMonthModel.getData().currMonthData.weeks[
							iLen - 1
						].sat.value;
						aMonthData.weeks[0].sun.value = oCurrMonthModel.getData().currMonthData.weeks[
							iLen - 1
						].sun.value;
					}
					const iMonthSum = oView
						.getModel("currMonth")
						.getProperty("/totalEffort");
					oCurrMonthModel.setData({currMonthData: aMonthData});
					oView.setModel(oCurrMonthModel, "currMonth");
					oView.getModel("currMonth").setProperty("/totalEffort", iMonthSum);

					const oMonth = new Date(iNextMonth);
					// setting the visibilty of forward and backward navigation buttons
					setNavigationVisibility(oView);
					sap.ui
						.getCore()
						.byId("monthcalendar--MonthDatePicker")
						.setDateValue(new Date(oMonth.getFullYear(), oMonth.getMonth()));
				}
			},

			/**
	   * This is called when user changes value in input field
	   * Following steps occurs:
	   *   1. Based on input value determine operation type (create,update or delete) and update the draft
	   *   2. Recalculate Total Required Effort and set to model
	   *
	   * @public
	   * @param {Object} oEvent Event
	   */
			onDayEffortChange: function(oEvent) {
				let iDeviationValue = 0;
				let actionFlag = false;
				const oView = this._view;
				const iNewEffortValue = oEvent.getParameters().newValue;

				const oChangedDate = new Date(
					sap.ui
						.getCore()
						.byId(oEvent.getParameters().id)
						.getCustomData()[0]
						.getKey()
				);

				if (
					iNewEffortValue >= 0 &&
					iNewEffortValue < 1000 &&
					iNewEffortValue.includes(".") === false &&
					iNewEffortValue !== ""
				) {
					const oList = this.oList;
					const oFormat = sap.ui.core.format.DateFormat.getDateInstance({
						format: "yyyyMMdd",
						pattern: "yyyy-MM-dd",
					});
					if (oCapacityRequirements.has(oChangedDate.getTime())) {
						// Can be update or delete operation
						const oCapacityRecord = oCapacityRequirements.get(
							oChangedDate.getTime()
						);

						if (
							iNewEffortValue != 0 &&
							oCapacityRecord.quantity != iNewEffortValue
						) {
							actionFlag = true;
							oCapacityRecord.context.setProperty(
								"requestedCapacity",
								iNewEffortValue
							);
							iDeviationValue = Number(iNewEffortValue) - Number(oCapacityRecord.quantity);
							oCapacityRecord.quantity = iNewEffortValue;
						} else if (
							iNewEffortValue == 0 &&
							oCapacityRecord.quantity != iNewEffortValue
						) {
							// Delete scenario
							// oCapacityRecord.context.delete('$auto');'$direct'
							actionFlag = true;
							iDeviationValue = -Number(oCapacityRecord.quantity);
							oCapacityRecord.context.delete("$direct");
							oCapacityRequirements.delete(oChangedDate.getTime());
						}
					} else if (iNewEffortValue != 0) {
						// Create
						actionFlag = true;
						iDeviationValue = Number(iNewEffortValue);
						const createContext = oList.create(
							{
								startDate: oFormat.format(new Date(oChangedDate)),
								endDate: oFormat.format(new Date(oChangedDate)),
								requestedCapacity: iNewEffortValue,
							},
							true
						);

						const oCallback = function() {
							oCapacityRequirements.set(oChangedDate.getTime(), {
								quantity: iNewEffortValue,
								context: createContext,
							});
							oList.detachCreateCompleted(oCallback);
						};
						oList.attachCreateCompleted(oCallback);
					}
					if (this.oMessagePopover.getItems().length != 0) {
						// Disbale all action buttons in dialog when some error has occured.
						disableMonthNavigation(oView);
					} else {
						// Enable buttons if no error.
						setNavigationVisibility(oView);
					}
				} else {
					disableMonthNavigation(oView);
				}
				if (actionFlag) {
					fTotalEffort = Number(fTotalEffort) + iDeviationValue;
					oView.getModel("currMonth").setProperty("/totalEffort", fTotalEffort);
				}
			},

			/**
	   * This is called when "OK" action is clicked
	   * @public
	   * @param {Object} oEvent Event
	   */
			onConfirmCalendarView: function(oEvent) {
				this.pEffortDistCalendarView.then(function(oDialog) {
					oDialog.close();
				});
			},
		};
	}
);
