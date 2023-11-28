sap.ui.define(
	[
		"capacityGridUi/reuse/variant/VariantController",
		"capacityGridUi/view/variant/StandardVariant",
		"capacityGridUi/view/Views",
		"sap/ui/core/mvc/View"
	],
	function (VariantController, StandardVariant, Views) {
		"use strict";

		return VariantController.extend("capacityGridUi.reuse.variant.Variant", {
			_getStandardVariant: function () {
				return StandardVariant;
			},

			_applyToControllers: function (oVariant) {
				this.oComponent.oControllers.essentialControllersAdded().then(
					function () {
						this.oControllers.header.applyVariant(oVariant);
						this.oControllers.filterBar.applyVariant(oVariant); // depends on header (DateModel)
						this.oControllers.page.applyVariant(oVariant);
						this.oControllers.table.applyVariant(oVariant); // depends on filter
					}.bind(this)
				);
			},

			_migrateVariant: function (oVariant) {
				if (oVariant.version === 1) {
					this._migrateVariantVersion1to2(oVariant);
				}
				if (oVariant.version === 2) {
					this._migrateVariantVersion2to3(oVariant);
				}
				if (oVariant.version === 3) {
					this._migrateVariantVersion3to4(oVariant);
				}
				if (oVariant.version === 4) {
					this._migrateVariantVersion4to5(oVariant);
				}
				if (oVariant.version === 5) {
					this._migrateVariantVersion5to6(oVariant);
				}
				if (oVariant.version === 6) {
					this._migrateVariantVersion6to7(oVariant);
				}
				if (oVariant.version === 7) {
					this._migrateVariantVersion7to8(oVariant);
				}
				if (oVariant.version === 8) {
					this._migrateVariantVersion8to9(oVariant);
				}

				if (oVariant.version !== StandardVariant.version) {
					throw new Error("unexpected variant version " + oVariant.version);
				}
				return oVariant;
			},

			_migrateVariantVersion1to2: function (oVariant) {
				oVariant.columns.forEach((column) => {
					if (column.columnKey === "averageUtil") {
						column.columnKey = "staffingSummary";
						column.width = "120px";
					}
					if (column.columnKey === "utilization") {
						column.columnKey = "staffingHrs";
					}
					if (column.columnKey === "costCenter") {
						column.visible = false;
					}
				});

				let oAssignmentStatusColumn = StandardVariant.columns.find((oColumns) => oColumns.columnKey === "assignmentStatus");
				oVariant.columns.push(oAssignmentStatusColumn);

				oVariant.version = 2;
			},

			_migrateVariantVersion2to3: function (oVariant) {
				oVariant.columns.forEach((column) => {
					if (column.columnKey === "deliveryOrg") {
						column.columnKey = "resourceOrg";
					}
				});

				oVariant.columns.push(StandardVariant.columns.find((oColumns) => oColumns.columnKey === "project"));
				oVariant.columns.push(StandardVariant.columns.find((oColumns) => oColumns.columnKey === "customer"));
				oVariant.columns.push(StandardVariant.columns.find((oColumns) => oColumns.columnKey === "projectRole"));
				oVariant.columns.push(StandardVariant.columns.find((oColumns) => oColumns.columnKey === "request"));

				delete oVariant.filters.deliveryOrgs;
				oVariant.filters.resourceOrgs = [];
				oVariant.filters.projects = [];
				oVariant.filters.customers = [];
				oVariant.filters.projectRoles = [];
				oVariant.filters.requests = [];

				oVariant.version = 3;
			},

			_migrateVariantVersion3to4: function (oVariant) {
				oVariant.columns.push(StandardVariant.columns.find((oColumns) => oColumns.columnKey === "workerType"));
				oVariant.filters.workerTypes = [];
				oVariant.version = 4;
			},

			_migrateVariantVersion4to5: function (oVariant) {
				oVariant.columns.push(StandardVariant.columns.find((oColumns) => oColumns.columnKey === "requestStatus"));
				oVariant.version = 5;
			},

			_migrateVariantVersion5to6: function (oVariant) {
				oVariant.filterPanelExpandState = StandardVariant.filterPanelExpandState;
				oVariant.version = 6;
			},

			_migrateVariantVersion6to7: function (oVariant) {
				oVariant.columns.push(StandardVariant.columns.find((oColumns) => oColumns.columnKey === "workItemName"));
				oVariant.version = 7;
			},

			_migrateVariantVersion7to8: function (oVariant) {
				let oTimePeriod = {
					operator: null,
					values: []
				};
				let sView = oVariant.view;
				switch (sView) {
					case Views.MONTHLY:
						this._migrateMonthlyDateRanges(oTimePeriod, oVariant);
						break;
					case Views.WEEKLY:
						this._migrateWeeklyDateRanges(oTimePeriod, oVariant);
						break;
					case Views.DAILY:
						this._migrateDailyDateRanges(oTimePeriod, oVariant);
						break;
					default:
						throw new Error("unhandled view " + sView);
				}
				oVariant.timePeriod = oTimePeriod;
				oVariant.version = 8;
			},

			_migrateVariantVersion8to9: function (oVariant) {
				oVariant.columns.push(StandardVariant.columns.find((oColumns) => oColumns.columnKey === "referenceObject"));
				oVariant.columns.push(StandardVariant.columns.find((oColumns) => oColumns.columnKey === "referenceObjectType"));
				oVariant.filters.referenceObject = [];
				oVariant.filters.referenceObjectType = [];
				oVariant.version = 9;
			},

			_migrateMonthlyDateRanges: function (oTimePeriod, oVariant) {
				if (oVariant.timePeriod.selectedKey === "6Months") {
					oTimePeriod.operator = "NextXRange";
					oTimePeriod.values = [6];
				} else if (oVariant.timePeriod.selectedKey === "12Months") {
					oTimePeriod.operator = "NextXRange";
					oTimePeriod.values = [12];
				} else if (oVariant.timePeriod.selectedKey === "PastNext3Months") {
					oTimePeriod.operator = "XYRange";
					oTimePeriod.values = [2, 3];
				} else {
					oTimePeriod.operator = "CustomRange";
					oTimePeriod.values = [oVariant.timePeriod.fromDate, oVariant.timePeriod.toDate];
				}
			},

			_migrateWeeklyDateRanges: function (oTimePeriod, oVariant) {
				if (oVariant.timePeriod.selectedKey === "8Weeks") {
					oTimePeriod.operator = "NextXRange";
					oTimePeriod.values = [8];
				} else if (oVariant.timePeriod.selectedKey === "12Weeks") {
					oTimePeriod.operator = "NextXRange";
					oTimePeriod.values = [12];
				} else if (oVariant.timePeriod.selectedKey === "26Weeks") {
					oTimePeriod.operator = "NextXRange";
					oTimePeriod.values = [26];
				} else if (oVariant.timePeriod.selectedKey === "PastNext3Weeks") {
					oTimePeriod.operator = "XYRange";
					oTimePeriod.values = [2, 4];
				} else {
					oTimePeriod.operator = "CustomRange";
					oTimePeriod.values = [oVariant.timePeriod.fromDate, oVariant.timePeriod.toDate];
				}
			},

			_migrateDailyDateRanges: function (oTimePeriod, oVariant) {
				if (oVariant.timePeriod.selectedKey === "4Weeks") {
					oTimePeriod.operator = "NextXRange";
					oTimePeriod.values = [28];
				} else if (oVariant.timePeriod.selectedKey === "CurrentWeek") {
					oTimePeriod.operator = "NextXRange";
					oTimePeriod.values = [7];
				} else if (oVariant.timePeriod.selectedKey === "8Weeks") {
					oTimePeriod.operator = "NextXRange";
					oTimePeriod.values = [56];
				} else if (oVariant.timePeriod.selectedKey === "PastNext2Weeks") {
					oTimePeriod.operator = "XYRange";
					oTimePeriod.values = [14, 14];
				} else {
					oTimePeriod.operator = "CustomRange";
					oTimePeriod.values = [oVariant.timePeriod.fromDate, oVariant.timePeriod.toDate];
				}
			},

			changeColumnWidth: function (sColumnKey, sWidth) {
				if (sColumnKey === "name") {
					this.changeVariant("nameColumnWidth", null, sWidth);
				} else if (sColumnKey) {
					let oVariant = this.getVariant();
					let oColumn = this._getColumn(oVariant.columns, sColumnKey);
					oColumn.width = sWidth;
					this.changeVariant("columns", null, oVariant.columns);
				}
			},

			_getColumn: function (aColumns, sColumnKey) {
				for (let i = 0; i < aColumns.length; i++) {
					let oColumn = aColumns[i];
					if (oColumn.columnKey === sColumnKey) {
						return oColumn;
					}
				}
				throw Error("column not found " + sColumnKey);
			}
		});
	}
);
