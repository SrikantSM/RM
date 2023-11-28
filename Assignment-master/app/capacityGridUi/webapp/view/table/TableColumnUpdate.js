sap.ui.define(
	[
		"capacityGridUi/reuse/controller/BaseViewChildController",
		"capacityGridUi/view/Views",
		"sap/base/util/deepClone",
		"capacityGridUi/view/table/TableColumnFactory"
	],
	function (BaseViewChildController, Views, deepClone, TableColumnFactory) {
		"use strict";

		return BaseViewChildController.extend("capacityGridUi.view.table.TableColumnUpdate", {
			constructor: function () {
				BaseViewChildController.apply(this, arguments);
				this.injectMembers();
				this.oTable = this.byId("tblCapacity");
				this.oFactory = new TableColumnFactory(this.oComponent);
			},

			update: function (sView) {
				this.oTable.destroyColumns();
				let oVariant = this.oControllers.variant.getVariant();
				this._aColumns = [];
				this._pushNameColumn(oVariant);
				this._pushVariantColumns(oVariant);
				this._pushTimeColumns(sView);
				for (let oColumn of this._aColumns) {
					this.oTable.addColumn(oColumn);
				}
			},

			_pushNameColumn: function (oVariant) {
				if (!oVariant || !oVariant.nameColumnWidth) {
					throw Error("cannot create name column. invalid variant");
				}
				this._aColumns.push(this.oFactory.createNameColumn(oVariant.nameColumnWidth));
			},

			_pushVariantColumns: function (oVariant) {
				if (!oVariant || !oVariant.columns) {
					throw Error("cannot create variant columns. invalid variant");
				}

				let aVariantColumns = deepClone(oVariant.columns);

				// The index property is set to undefined for columns with visible property false
				// This is need to get the correct order of columns
				let iNumOfCols = aVariantColumns.length;
				aVariantColumns.forEach((item) => {
					if (item.index === undefined || item.index === null) {
						item.index = iNumOfCols;
					}
				});

				aVariantColumns.sort(function (a, b) {
					return a.index - b.index;
				});

				aVariantColumns.forEach((item) => {
					switch (item.columnKey) {
						case "costCenter":
							this._aColumns.push(this.oFactory.createCostCenterColumn(item.visible, item.width));
							break;
						case "workerType":
							this._aColumns.push(this.oFactory.createWorkerTypeColumn(item.visible, item.width));
							break;
						case "staffingHrs":
							this._aColumns.push(this.oFactory.createStaffingHoursColumn(item.visible, item.width));
							break;
						case "staffingSummary":
							this._aColumns.push(this.oFactory.createStaffingSummaryColumn(item.visible, item.width));
							break;
						case "resourceOrg":
							this._aColumns.push(this.oFactory.createResourceOrgColumn(item.visible, item.width));
							break;
						case "assignmentStatus":
							this._aColumns.push(this.oFactory.createAssignmentStatusColumn(item.visible, item.width));
							break;
						case "project":
							this._aColumns.push(this.oFactory.createProjectColumn(item.visible, item.width));
							break;
						case "customer":
							this._aColumns.push(this.oFactory.createCustomerColumn(item.visible, item.width));
							break;
						case "projectRole":
							this._aColumns.push(this.oFactory.createProjectRoleColumn(item.visible, item.width));
							break;
						case "request":
							this._aColumns.push(this.oFactory.createRequestColumn(item.visible, item.width));
							break;
						case "requestStatus":
							this._aColumns.push(this.oFactory.createRequestStatusColumn(item.visible, item.width));
							break;
						case "workItemName":
							this._aColumns.push(this.oFactory.createworkItemNameColumn(item.visible, item.width));
							break;
						case "referenceObject":
							this._aColumns.push(this.oFactory.createReferenceObjectColumn(item.visible, item.width));
							break;
						case "referenceObjectType":
							this._aColumns.push(this.oFactory.createReferenceObjectTypeColumn(item.visible, item.width));
							break;
						default:
							throw new Error("unknown column key: " + item.columnKey);
					}
				});
			},

			_pushTimeColumns: function (sView) {
				let iIndex = 0;
				this.oComponent.oTimeColumnsMap.forEach((value, key) => {
					let sWidth = sView === Views.WEEKLY ? "130px" : "110px";
					let oColumn = this.oFactory.createTimeColumn(value, iIndex, sWidth);
					this._aColumns.push(oColumn);
					iIndex++;
				});
			}
		});
	}
);
