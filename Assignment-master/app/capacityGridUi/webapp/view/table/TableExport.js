sap.ui.define(
	[
		"capacityGridUi/reuse/controller/BaseViewChildController",
		"sap/ui/export/Spreadsheet",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"capacityGridUi/reuse/formatters/DateFormatter",
		"sap/base/util/deepClone",
		"capacityGridUi/reuse/exportDialog/ExportProgressDialog.controller",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/Sorter",
		"capacityGridUi/view/table/TransformResources",
		"capacityGridUi/view/ODataEntities"
	],
	function (
		BaseViewChildController,
		Spreadsheet,
		MessageToast,
		MessageBox,
		DateFormatter,
		deepClone,
		ExportProgressDialog,
		Filter,
		FilterOperator,
		Sorter,
		TransformResources,
		ODataEntities
	) {
		"use strict";

		const TABLE_SKIP_COUNT = 1000;
		const MAX_MONTHS_ALLOWED = 56;
		const MAX_EXCEL_CELL_LIMIT = 1000000;

		return BaseViewChildController.extend("capacityGridUi.view.table.TableExport", {
			oTable: undefined,
			aTransformedRows: [],
			aColumInfo: [],
			oExportProgressDialog: undefined,
			oResBinding: {},

			onInit: function () {
				this.injectMembers();
				this.oTable = this.byId("tblCapacity");
				this.oExportProgressDialog = new ExportProgressDialog(this.getOwnerComponent(), this.getView());
			},

			export: function () {
				let oVariant = this.oControllers.variant.getVariant();
				let aTableColumns = this.oTable.getColumns();
				this.aColumnInfo = this.createColumnConfig(oVariant, aTableColumns);
				let iResCount = this.models.table.getProperty("/resourcesCount");
				let bExceedExcelLimit = this.aColumnInfo.length * iResCount < MAX_EXCEL_CELL_LIMIT;

				if (bExceedExcelLimit) {
					this.initiateExport();
				} else {
					MessageBox.warning(this.oBundle.getText("EXPORT_LIMIT_WARNING", [iResCount, this.aColumnInfo.length]), {
						actions: ["Export", MessageBox.Action.CANCEL],
						emphasizedAction: "Export",
						onClose: function (sAction) {
							if (sAction === "Export") {
								this.initiateExport();
							}
						}.bind(this)
					});
				}
			},

			initiateExport: function () {
				// create sorter
				let oVariant = this.oControllers.variant.getVariant();
				if (!oVariant || !oVariant.sortProperty || !oVariant.sortOrder) {
					throw new Error("failed to sort. invalid variant");
				}
				let oSorter = new Sorter({
					path: oVariant.sortProperty,
					descending: oVariant.sortOrder !== "Ascending",
					group: true
				});

				let aFilters = this.oControllers.filterBar.getFilters();
				// create binding
				let oDateRange = this._getDateRange();
				let sGroupingParameter = this.oControllers.table.getGroupingParameter();
				let oResBinding = this.models.oDataV4.bindList("/" + ODataEntities.RESOURCES_ENTITY_SET, undefined, [oSorter], aFilters, {
					$apply: sGroupingParameter,
					"sap-valid-from": oDateRange.oDateValidFrom,
					"sap-valid-to": oDateRange.oDateValidTo
				});
				this.aTransformedRows = [];
				this.oExportProgressDialog.open(this.models.table.getProperty("/resourcesCount"));
				this.fetchExportData(oResBinding, this.aTransformedRows.length);
			},

			_exportSpreadsheet: function () {
				let sFileName = this.oBundle.getText("RESOURCE_UTILIZATION");

				let timeFrameStart = this.models.date.getProperty("/sFromDate");
				let timeFrameEnd = this.models.date.getProperty("/sEndDate");

				let sView = this.models.app.getProperty("/selectedView");
				let sDateRangeText = DateFormatter.rangeByView(sView, timeFrameStart, timeFrameEnd);

				let oSettings = {
					workbook: {
						columns: this.aColumnInfo
					},
					dataSource: this.aTransformedRows,
					fileName: sFileName + "(" + sDateRangeText + ")" + ".xlsx",
					showProgress: false
				};

				let oSheet = new Spreadsheet(oSettings);
				let sMsg = this.oBundle.getText("SPREADSHEET_EXPORT_FINISHED");
				oSheet
					.build()
					.then(
						function () {
							this.oExportProgressDialog.close();
							MessageToast.show(sMsg);
						}.bind(this)
					)
					.finally(oSheet.destroy());
			},

			createColumnConfig: function (oVariant, aTableColumns) {
				let aColumns = [];

				// The index of resource name column is fixed at 0
				aColumns.push({
					label: this.oBundle.getText("NAME"),
					type: "string",
					property: "resourceName"
				});

				aColumns = aColumns.concat(this.getVariantColumns(oVariant));

				// Push Monthly columns
				let iIndex = -1;
				aTableColumns.forEach((oColumn) => {
					let sColumnId = oColumn.getId();
					let bMonthColumn = sColumnId.indexOf("idMonthColumn") !== -1;
					if (bMonthColumn) {
						iIndex++;
						let util = "utilization/" + iIndex + "/utilization";
						let freeHr = "utilization/" + iIndex + "/freeHours";
						let availHr = "utilization/" + iIndex + "/availableHours";
						let sLabel = oColumn.getLabel().getText();
						sLabel = sLabel.replace("\n", " ");
						aColumns.push({
							property: [util, freeHr, availHr],
							label: sLabel,
							template: "{0} % \n {1} / {2} hr",
							wrap: true,
							textAlign: "Right"
						});
					}
				});

				return aColumns;
			},

			getVariantColumns: function (oVariant) {
				let aVariantColumns = deepClone(oVariant.columns);
				let aResultColumns = [];

				aVariantColumns.sort(function (a, b) {
					return a.index - b.index;
				});
				aVariantColumns.forEach((item) => {
					if (item.columnKey === "costCenter" && item.visible) {
						aResultColumns.push({
							label: this.oBundle.getText("COST_CENTER"),
							type: "string",
							property: "costCenter"
						});
					} else if (item.columnKey === "staffingHrs" && item.visible) {
						aResultColumns.push({
							label: this.oBundle.getText("UTILIZATION"),
							type: "number",
							unit: this.oBundle.getText("PERCENTAGE"),
							property: "avgUtilization",
							textAlign: "Right"
						});
					} else if (item.columnKey === "resourceOrg" && item.visible) {
						aResultColumns.push({
							label: this.oBundle.getText("RESOURCE_ORGANIZATION"),
							property: ["resourceOrganizationNameForDisplay", "resourceOrganizationIdForDisplay"],
							template: "{0} ({1})"
						});
					} else if (item.columnKey === "workerType" && item.visible) {
						aResultColumns.push({
							label: this.oBundle.getText("WORKER_TYPE"),
							type: "string",
							property: "workerType"
						});
					}
				});

				return aResultColumns;
			},

			fetchExportData: function (oBinding, iStartCount) {
				this._fetchResources(oBinding, iStartCount).then(
					(aResources) => {
						this._fetchResourceUtilizations(aResources).then(
							(aTransformedResources) => {
								if (this.oExportProgressDialog.bIsDialogOpen) {
									this.aTransformedRows = this.aTransformedRows.concat(aTransformedResources);
									this.oExportProgressDialog.setProgress(this.aTransformedRows.length, this.models.table.getProperty("/resourcesCount"), true);
									let bResPending = this.aTransformedRows.length < this.models.table.getProperty("/resourcesCount");
									if (bResPending) {
										this.fetchExportData(oBinding, this.aTransformedRows.length);
									} else {
										this._exportSpreadsheet();
									}
								}
							},
							() => {
								this.oExportProgressDialog.close();
							}
						);
					},
					() => {
						this.oExportProgressDialog.close();
					}
				);
			},

			_fetchResources: function (oBinding, iStartCount) {
				return new Promise(
					function (resolve, reject) {
						oBinding.requestContexts(iStartCount, TABLE_SKIP_COUNT).then(
							(aContexts) => {
								let aResources = [];
								aContexts.forEach((oContext) => {
									aResources.push(oContext.getObject());
								});
								resolve(aResources);
							},
							(oError) => {
								this.models.message.addServerMessage("transient", oError);
								this.oControllers.messageDialog.open();
								reject();
							}
						);
					}.bind(this)
				);
			},

			_fetchResourceUtilizations: function (aResources) {
				// prepare the oData listBinding
				let oDateRange = this._getDateRange();
				let sView = this.models.app.getProperty("/selectedView");
				let sEntityPath = "/" + ODataEntities.utilizationEntitySet(sView);
				let oBinding = this.models.oDataV4.bindList(sEntityPath, undefined, undefined, this._getUtilFilters(aResources), {
					"sap-valid-from": oDateRange.oDateValidFrom,
					"sap-valid-to": oDateRange.oDateValidTo
				});

				return new Promise(
					function (resolve, reject) {
						oBinding.requestContexts(0, MAX_MONTHS_ALLOWED * TABLE_SKIP_COUNT).then(
							(aUtilContexts) => {
								let aTransformedResources = TransformResources.transform(this.oComponent.oTimeColumnsMap, aResources, aUtilContexts, sView);
								resolve(aTransformedResources);
							},
							(oError) => {
								this.models.message.addServerMessage("transient", oError);
								this.oControllers.messageDialog.open();
								reject();
							}
						);
					}.bind(this)
				);
			},

			_getUtilFilters: function (aResources) {
				// create Resource filter to fetch exactly 1 page of data at once
				let aUtilFilters = [];
				for (let i = 0; i < aResources.length; i++) {
					aUtilFilters.push(
						new Filter({
							filters: [
								new Filter({
									path: "ID",
									operator: FilterOperator.EQ,
									value1: aResources[i].ID
								}),
								new Filter({
									path: "validFrom",
									operator: FilterOperator.EQ,
									value1: aResources[i].startdatenew
								})
							],
							and: true
						})
					);
				}
				let oFilter = new Filter({
					filters: aUtilFilters,
					and: false
				});
				return oFilter;
			},

			_getDateRange: function () {
				return {
					oDateValidTo: DateFormatter.dateToEdm(this.models.date.getProperty("/sEndDate")),
					oDateValidFrom: DateFormatter.dateToEdm(this.models.date.getProperty("/sFromDate"))
				};
			}
		});
	}
);
