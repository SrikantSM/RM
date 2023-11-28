sap.ui.define(
	[
		"sap/ui/model/json/JSONModel",
		"resourceRequestLibrary/model/WeekCalendarModel",
		"resourceRequestLibrary/utils/URL",
		"resourceRequestLibrary/utils/Constants",
		"resourceRequestLibrary/utils/DateHelper",
		"sap/m/MessagePopover",
		"sap/m/MessagePopoverItem",
	],
	function(JSONModel, WeekCalendarModel, URL, Constants, DateHelper, MessagePopover, MessagePopoverItem) {
		const oCurrentQuarterModel = new JSONModel();
		const oCapacityRequirements = new Map();
		let sAppName;
		let sSelectedKey;
		let fTotalEffort;
		let oQuarterData;
		/**
	   * Generate key String based on quarter number and year
	   * @public
	   * @param {int} iQuarter Quarter number
	   * @param {int} iYear Year number
	   * @return {String} String of the form Q<iQuarter> <iYear>
	   */
		const generateKey = function(iQuarter, iYear) {
			return "Q" + iQuarter + " " + iYear;
		};
		/**
	   * Set enable property of next and previous quarter button based on current selected quarter
	   * and availability of next/previous quarter data in the oModel
	   */
		const setNavigationVisibility = function() {
			const aSelectedKeySplit = sSelectedKey.split(" ");
			const iQuarterNumber = Number(aSelectedKeySplit[0][1]);
			const iYear = Number(aSelectedKeySplit[1]);
			let iNextQuarterNumber = iQuarterNumber + 1;
			let iYearForNextQuarter = iYear;
			let iPreviousQuarterNumber = iQuarterNumber - 1;
			let iYearForPreviousQuarter = iYear;
			if (iNextQuarterNumber == 5) {
				iYearForNextQuarter++;
				iNextQuarterNumber = 1;
			}
			if (iPreviousQuarterNumber == 0) {
				iYearForPreviousQuarter--;
				iPreviousQuarterNumber = 4;
			}
			const sKeyPrevious = generateKey(iPreviousQuarterNumber, iYearForPreviousQuarter);
			const sKeyNext = generateKey(iNextQuarterNumber, iYearForNextQuarter);
			oCurrentQuarterModel
				.setProperty(
					"/navigateToPreviousQuarterEnabled",
					oCurrentQuarterModel.getProperty(
						"/currDetails/" + iYearForPreviousQuarter + "/data" + "/" + sKeyPrevious) ? true : false);
			oCurrentQuarterModel
				.setProperty(
					"/navigateToNextQuarterEnabled",
					oCurrentQuarterModel.getProperty(
						"/currDetails/" + iYearForNextQuarter + "/data" + "/" + sKeyNext) ? true : false);
		};
		/**
	   * Set enable property as false for ok button, next and previous quarter buttons.
	   */
		const disableAllNavigation = function() {
			oCurrentQuarterModel.setProperty("/okButtonEnabled", false);
			oCurrentQuarterModel.setProperty("/navigateToNextQuarterEnabled", false);
			oCurrentQuarterModel.setProperty("/navigateToPreviousQuarterEnabled", false);
		};

		return {
		/**
	   * Responsible for loading dialog, fetching capacity records from backend, set data model for the dialog.
	   * @public
	   * @param {Object} oEvent Event
	   */
			onOpenCalendarView: function(oEvent) {
				// Initialize
				const that = this;
				const oView = this._view;
				const oBindingContext = oEvent.getSource().getBindingContext();
				const sResourceRequestId = oBindingContext.getProperty("ID");
				const bDisplayMode = !this.getModel("ui").getData().isEditable;
				const oModel = this.getModel();
				const i18ned = oView.getModel("i18ned");
				const startDate = new Date(oBindingContext.getProperty("startDate"));
				const oRequestedStartDate = DateHelper.getCorrectDate(DateHelper.convertDateToUTC(startDate));
				const endDate = new Date(oBindingContext.getProperty("endDate"));
				const oRequestedEndDate = DateHelper.getCorrectDate(DateHelper.convertDateToUTC(endDate));
				fTotalEffort = Number(oBindingContext.getProperty("requestedCapacity"));
				const sUrl = URL.generate(sResourceRequestId, sAppName === "Manage" ? bDisplayMode : undefined);
				this.oList = oModel.bindList(sUrl);
				oCapacityRequirements.clear();
				// Remove below in UI5 v1.90.0
				// Create a message manager and register the message model for error handling.
				// This done to know if any batch call failed due to fast create.
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
				// Remove Till here
				// Load Fragment and attach to the view
				if (!this.pEffortDistributionWeeklyCalendarFragment) {
					this.pEffortDistributionWeeklyCalendarFragment = this.loadFragment({
						id: "weekWiseCalendar",
						name: "resourceRequestLibrary.fragment.WeekWiseCalendar",
						controller: this,
					}).then(function(oDialog) {
						that.addDependent(oDialog);
						oDialog.attachAfterOpen(
							function() {
								oView.addDependent(this.oMessagePopover);
							}.bind(this)
						);
						oDialog.attachAfterClose(
							function() {
								this.oMessagePopover.destroyItems();
								oView.getModel("currentQuarterModel").setProperty("/", {});
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
					}.bind(this));
				}
				// Perform backend call to get capacity data.
				this.oList
					.requestContexts(0, 9999, "$direct")
					.then(function(aCapacityRequirements) {
						aCapacityRequirements.forEach(function(oContext) {
						  const startDate = new Date(oContext.getProperty("startDate"));
							const oDate = DateHelper.getCorrectDate(DateHelper.convertDateToUTC(startDate));

							const iCapacityValue = parseInt(
								oContext.getProperty("requestedCapacity")
							);
							// Set the data fetched from backend in map.
							oCapacityRequirements.set(
								new Date(
									oDate.getFullYear(),
									oDate.getMonth(),
									oDate.getDate()
								).getTime(),
								{
									capacity: iCapacityValue,
									context: oContext,
								}
							);
						});
						// Get structured model.
						const oGeneratedData = WeekCalendarModel.generateModel(oRequestedStartDate, oRequestedEndDate,
							oCapacityRequirements, oView.getModel("i18ned"));
						oQuarterData = oGeneratedData.oModel;
						// Set Model to Dialog.
						oCurrentQuarterModel.setData({currDetails: oQuarterData});
						oView.setModel(oCurrentQuarterModel, "currentQuarterModel");

						// Open the dialog.
						that.pEffortDistributionWeeklyCalendarFragment.then(function(oDialog) {
							oDialog.open();
							// Decide selected quarter and year and set value for quarter select button.
							const oTable = sap.ui.getCore().byId("weekWiseCalendar--quarterCalendarTable");
							// Set year and quarter according to capacity data (first quarter if no data)
							let selectedYear = Object.keys(oQuarterData)[0];
							if (oGeneratedData.year) {
								selectedYear = oGeneratedData.year;
							}

							sSelectedKey = Object.keys(oQuarterData[selectedYear].data)[0];
							if (oGeneratedData.year) {
								sSelectedKey = generateKey(oGeneratedData.quarter, oGeneratedData.year);
							}

							oCurrentQuarterModel.setProperty("/currDetails/" + selectedYear + "/" + "selectedKey",
								sSelectedKey);
							oTable.bindAggregation(
								"items",
								"currentQuarterModel>/currDetails/" + selectedYear + "/data/" + sSelectedKey +
									"/months",
								oTable.getBindingInfo("items").template.clone()
							);

							// Set Keyboard mode
							if (bDisplayMode) {
								oTable.setKeyboardMode(sap.m.ListKeyboardMode.Navigation);
							} else {
								oTable.setKeyboardMode(sap.m.ListKeyboardMode.Edit);
							}

							const oButton = sap.ui.getCore().byId("weekWiseCalendar--quarterPicker");
							const quarterKey = sSelectedKey.split(" ");
							const quarter = i18ned.getResourceBundle().getText(quarterKey[0]);

							oButton.setText(quarter + " " + quarterKey[1]);

							// Enable/Disable Next and previous quarter button.
							setNavigationVisibility();
							// Set Total requested effort in dialog.
							oView
								.getModel("currentQuarterModel")
								.setProperty("/totalEffort", parseFloat(fTotalEffort));
						});
					});
			},
			/**
	   * Responsible for performing backend CRUD calls when effort is changed in any cell.
	   * @public
	   * @param {Object} oEvent Event
	   */
			onWeekEffortChange: function(oEvent) {
				const oView = this._view;
				let iDeviationValue = 0;
				let bUpdateParent = false;
				const oFormat = sap.ui.core.format.DateFormat.getDateInstance({
					format: "yyyyMMdd",
					pattern: "yyyy-MM-dd",
				});
				// Get data for cell in which the data is inserted.
				const iNewEffortValue = oEvent.getParameters().newValue;
				const oStartDate = new Date(
					sap.ui.getCore().byId(oEvent.getParameters().id).getCustomData()[0].getValue().startDate);
				const oEndDate = new Date(
					sap.ui.getCore().byId(oEvent.getParameters().id).getCustomData()[0].getValue().endDate);
				// Check if input is valid.
				if (
					iNewEffortValue >= 0 &&
					iNewEffortValue < 1000 &&
					iNewEffortValue.includes(".") === false &&
					iNewEffortValue !== ""
				) {
					const oList = this.oList;
					// Check if data for the cell which got changed is already present in DB.
					// If yes then it is a Update or Delete scenario else it is an create scenrio.
					if (oCapacityRequirements.has(oStartDate.getTime())) {
						// Update or Delete
						const oCapacityRecord = oCapacityRequirements.get(
							oStartDate.getTime()
						);

						if (iNewEffortValue != 0 && oCapacityRecord.capacity != iNewEffortValue) {
							// Update Scenario
							// Get difference in new and old value to update requestedCapacity in parent.
							bUpdateParent = true;
							iDeviationValue = Number(iNewEffortValue) - Number(oCapacityRecord.capacity);
							oCapacityRecord.capacity = iNewEffortValue;
							// Perform patch call.
							oCapacityRecord.context.setProperty(
								"requestedCapacity",
								iNewEffortValue
							);
						} else if (iNewEffortValue == 0 && oCapacityRecord.capacity != iNewEffortValue) {
							// Delete scenario
							// Get the original value so that parent can be updated.
							bUpdateParent = true;
							iDeviationValue = Number(-oCapacityRecord.capacity);
							// Perform delete call.
							oCapacityRecord.context.delete("$direct");
							oCapacityRequirements.delete(oStartDate.getTime());
						}
					} else if (iNewEffortValue != 0) {
						// Create
						// Get the value inserted so that the value can be added to the parent and update the parent.
						iDeviationValue = Number(iNewEffortValue);
						bUpdateParent = true;
						// Send create call.
						const createContext = oList.create(
							{
								startDate: oFormat.format(oStartDate),
								endDate: oFormat.format(oEndDate),
								requestedCapacity: iNewEffortValue,
							},
							true
						);

						const oCallback = function() {
							// Update context in oCapacityRequirements for later reference
							oCapacityRequirements.set(oStartDate.getTime(), {
								capacity: iNewEffortValue,
								context: createContext,
							});
							oList.detachCreateCompleted(oCallback);
						};
						oList.attachCreateCompleted(oCallback);
					}
					if (this.oMessagePopover.getItems().length != 0) {
						// Disbale all action buttons in dialog when some error has occured.
						disableAllNavigation();
					} else {
						// Enable buttons if no error.
						setNavigationVisibility();
						oView.getModel("currentQuarterModel").setProperty("/okButtonEnabled", true);
					}
				} else {
					disableAllNavigation();
				}

				if (bUpdateParent) {
					// Update total required efforts based on deviation.
					fTotalEffort += iDeviationValue;
					// Set updated value in UI model.
					oView.getModel("currentQuarterModel").setProperty("/totalEffort", fTotalEffort);
				}
			},
			/**
	   * Responsible for closing dialog.
	   * @public
	   * @param {Object} oEvent Event
	   */
			onConfirmCalendarView: function(oEvent) {
				this.pEffortDistributionWeeklyCalendarFragment.then(function(oDialog) {
					oDialog.close();
				});
			},

			/**
	   * Responsible for opening quarter selector control when user clicks on quarter button.
	   * @public
	   * @param {Object} oEvent Event
	   */
			onQuarterSelector: function(oEvent) {
				const oButton = oEvent.getSource();
				const oView = this._view;
				if (!this.oPopOver) {
					this.oPopOver = this.loadFragment({
						name: "resourceRequestLibrary.fragment.QuarterSelector",
						controller: this
					}).then(function(oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this.oPopOver.then(function(oDialog) {
					if (oDialog.isOpen()) {
						oDialog.close();
					} else {
						oDialog.setModel(oCurrentQuarterModel, "currentQuarterModel");
						oDialog.openBy(oButton);
					}
				});
			},

			/**
	   * Responsible for updaing dialog data when the quarter is changed.
	   * @public
	   * @param {Object} oEvent Event
	   */
			onQuarterSelect: function(oEvent) {
				const i18ned = this._view.getModel("i18ned").getResourceBundle();
				const oSelectQuarter = oEvent.getSource();
				oCurrentQuarterModel.setProperty("/currDetails/" + sSelectedKey.split(" ")[1] + "/selectedKey",
					Constants.unselectKey);
				sSelectedKey = oSelectQuarter.getKey();
				this.oPopOver.then(function(oPopOver) {
					oPopOver.close();
				});
				const oTable = sap.ui.getCore().byId("weekWiseCalendar--quarterCalendarTable");
				const iNewSelectedYear = sSelectedKey.split(" ")[1];

				oTable.bindAggregation(
					"items",
					"currentQuarterModel>/currDetails/" + iNewSelectedYear + "/data/" + sSelectedKey + "/months",
					oTable.getBindingInfo("items").template.clone()
				);
				const oButton = sap.ui.getCore().byId("weekWiseCalendar--quarterPicker");
				const quarterKey = sSelectedKey.split(" ");
				oButton.setText(i18ned.getText(quarterKey[0]) + " " + iNewSelectedYear);
				oCurrentQuarterModel.setProperty("/currDetails/" + sSelectedKey.split(" ")[1] + "/selectedKey",
					sSelectedKey);
				setNavigationVisibility();
			},

			/**
	   * Responsible for updaing dialog data when the previous quarter button is pressed.
	   * @public
	   * @param {Object} oEvent Event
	   */
			onPreviousQuarter: function(oEvent) {
				const i18ned = this._view.getModel("i18ned").getResourceBundle();
				const x = sSelectedKey.split(" ");
				let iQuarterNumber = Number(x[0][1]);
				let iYear = Number(x[1]);
				oCurrentQuarterModel.setProperty("/currDetails/" + iYear + "/selectedKey", Constants.unselectKey);
				if (iQuarterNumber == 1) {
					iYear--;
					iQuarterNumber = 4;
				} else {
					iQuarterNumber--;
				}
				sSelectedKey = generateKey(iQuarterNumber, iYear);
				oCurrentQuarterModel.setProperty("/currDetails/" + iYear + "/" + "selectedKey", sSelectedKey);
				const oTable = sap.ui.getCore().byId("weekWiseCalendar--quarterCalendarTable");
				oTable.bindAggregation(
					"items", "currentQuarterModel>/currDetails/" + iYear + "/data/" + sSelectedKey + "/months",
					oTable.getBindingInfo("items").template.clone()
				);
				const oButton = sap.ui.getCore().byId("weekWiseCalendar--quarterPicker");
				const quarterKey = sSelectedKey.split(" ");
				oButton.setText(i18ned.getText(quarterKey[0]) + " " + iYear);
				setNavigationVisibility();
			},
			/**
	   * Responsible for updaing dialog data when the next quarter button is pressed.
	   * @public
	   * @param {Object} oEvent Event
	   */
			onNextQuarter: function(oEvent) {
				const i18ned = this._view.getModel("i18ned").getResourceBundle();
				const x = sSelectedKey.split(" ");
				let iQuarterNumber = Number(x[0][1]);
				let iYear = Number(x[1]);
				oCurrentQuarterModel.setProperty("/currDetails/" + iYear + "/selectedKey", Constants.unselectKey);
				if (iQuarterNumber == 4) {
					iYear++;
					iQuarterNumber = 1;
				} else {
					iQuarterNumber++;
				}
				sSelectedKey = generateKey(iQuarterNumber, iYear);
				oCurrentQuarterModel.setProperty("/currDetails/" + iYear + "/" + "selectedKey", sSelectedKey);
				const oTable = sap.ui.getCore().byId("weekWiseCalendar--quarterCalendarTable");
				oTable.bindAggregation(
					"items", "currentQuarterModel>/currDetails/" + iYear + "/data/" + sSelectedKey + "/months",
					oTable.getBindingInfo("items").template.clone()
				);
				const oButton = sap.ui.getCore().byId("weekWiseCalendar--quarterPicker");
				const quarterKey = sSelectedKey.split(" ");
				oButton.setText(i18ned.getText(quarterKey[0]) + " " + iYear);
				setNavigationVisibility();
			},

			/**
			* This event is called  to keep focus on the input box when enter is pressed.
			* @public
			* @param {Object} oEvent Event
			*/
			onsapenter: function(oEvent) {
				oEvent.stopPropagation();
			},
			/**
			* This function is used to set app name to be used while generating link to fetch capacity requirements.
			* @public
			* @param {String} sName Event
			*/
			setAppName: function(sName) {
				sAppName = sName;
			},
		};
	}
);
