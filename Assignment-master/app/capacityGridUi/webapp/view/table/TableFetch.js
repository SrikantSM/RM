sap.ui.define(
	[
		"capacityGridUi/reuse/controller/BaseViewChildController",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/Sorter",
		"sap/m/MessageToast",
		"capacityGridUi/view/Views",
		"capacityGridUi/view/table/TransformResources",
		"capacityGridUi/view/table/TransformAssignments",
		"capacityGridUi/reuse/formatters/DateFormatter",
		"capacityGridUi/view/ODataEntities"
	],
	function (
		BaseViewChildController,
		Filter,
		FilterOperator,
		Sorter,
		MessageToast,
		Views,
		TransformResources,
		TransformAssignments,
		DateFormatter,
		ODataEntities
	) {
		"use strict";

		const TABLE_SKIP_COUNT = 50;
		const MAX_MONTHS_ALLOWED = 56;

		return BaseViewChildController.extend("capacityGridUi.view.table.TableFetch", {
			oTable: undefined,

			onInit: function () {
				this.injectMembers();
				this.oTable = this.byId("tblCapacity");
			},

			fetchResources: function (bReset) {
				this.oControllers.tracer.reset("Table Loading: ");
				this.models.table.setProperty("/busy", true);
				this.models.table.setProperty("/resetBusyOnRowUpdated", false);
				this.oControllers.tracer.message("columns created");
				this._fetchResources(bReset).then(() => {
					this._fetchResourceUtilizations(bReset).then(() => {
						this.models.table.setProperty("/resetBusyOnRowUpdated", true);
						if (bReset) {
							this.oTable.collapseAll();
						}
					});
				});
			},

			/**
			 * Resets the busy state of the table after the model rows have been updated.
			 *
			 * Why is this not simply done in fetch after the promise resovles?
			 *  - If we have many table columns and cells the UI rendering can take up to some seconds
			 *  - During this time the table would already be shown as unbusy
			 *
			 * Why check on resetBusyOnRowUpdated?
			 *  - This event is fired too often and too early
			 *    - It is fired when the table is resized
			 *    - It is fired when any model data has been updated
			 */
			onRowsUpdated: function () {
				let bBusy = this.models.table.getProperty("/busy");
				let bReset = this.models.table.getProperty("/resetBusyOnRowUpdated");
				if (bBusy && bReset) {
					this.oControllers.tracer.message("UI rendering");
					this.oControllers.tracer.show();
					this.models.table.setProperty("/busy", false);
					this.models.table.setProperty("/resetBusyOnRowUpdated", false);
				}
			},

			fetchOnScroll: function (oEvent) {
				let iVisibleRowCount = oEvent.getSource().getVisibleRowCount();
				let iFirstVisibleRow = oEvent.getParameter("firstVisibleRow");
				let bFetch = this._fetchRequired(iFirstVisibleRow, iVisibleRowCount);
				if (bFetch) {
					this.fetchResources(false);
				}
			},

			_fetchRequired: function (iFirstVisibleRow, iVisibleRowCount) {
				let iResourcesLoaded = this.models.table.getProperty("/resources").length;
				let iResourcesCount = this.models.table.getProperty("/resourcesCount");
				if (iResourcesLoaded >= iResourcesCount) {
					// return fast for this easy to check condition
					return false;
				} else {
					let iVisibleAssignments = this.models.table.countExpandedAssignments();
					let iRequiredRow = iFirstVisibleRow + iVisibleRowCount - iVisibleAssignments;
					return iRequiredRow >= iResourcesLoaded;
				}
			},

			_getResourceFilters: function () {
				let aFilters = [];
				if (this.models.app.getProperty("/IsFocusedEdit")) {
					aFilters = this.models.table.getFocusedEditFilters();
				} else {
					aFilters = this.oControllers.filterBar.getFilters();
				}
				return aFilters;
			},

			_fetchResources: function (bReset) {
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

				let aFilters = this._getResourceFilters();
				// create binding
				let oDateRange = this._getDateRange();
				let sGroupingParameter = this.oControllers.table.getGroupingParameter();
				let oBinding = this.models.oDataV4.bindList("/" + ODataEntities.RESOURCES_ENTITY_SET, undefined, [oSorter], aFilters, {
					$apply: sGroupingParameter,
					"sap-valid-from": oDateRange.oDateValidFrom,
					"sap-valid-to": oDateRange.oDateValidTo,
					$count: true
				});

				this.oControllers.tracer.message("prepare request capacityGridHeaderTemporal");
				return new Promise(
					function (resolve, reject) {
						let iStart = bReset ? 0 : this.models.table.getProperty("/rows").length;
						oBinding.requestContexts(iStart, TABLE_SKIP_COUNT, "$auto." + "tableData").then(
							(aContexts) => {
								this.oControllers.tracer.message("receive response capacityGridHeaderTemporal");
								this._storeResources(bReset, oBinding, aContexts);
								this.oControllers.tracer.message("store capacityGridHeaderTemporal");
								resolve();
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

			_storeResources: function (bReset, oBinding, aContexts) {
				// store resources in table model
				let aResources = bReset ? [] : this.models.table.getProperty("/resources");
				aContexts.forEach((oContext) => {
					let oResource = oContext.getObject();
					aResources.push(oResource);
				});
				this.models.table.setProperty("/resources", aResources);

				// update header model with resources count
				// oBinding.getLength() might have different results before the requestContexts is resolved
				let iResourcesCount = oBinding.getLength();
				this.models.table.setProperty("/resourcesCount", iResourcesCount);
			},

			_fetchResourceUtilizations: function (bReset) {
				// create Resource filter to fetch exactly 1 page of data at once
				let aUtilFilters = [];
				let aRows = bReset ? [] : this.models.table.getProperty("/rows");
				let aResources = this.models.table.getProperty("/resources");
				for (let i = aRows.length; i < aRows.length + TABLE_SKIP_COUNT && i < aResources.length; i++) {
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

				// prepare the oData listBinding
				let oDateRange = this._getDateRange();
				let sView = this.models.app.getProperty("/selectedView");
				let sEntityPath = "/" + ODataEntities.utilizationEntitySet(sView);
				let oBinding = this.models.oDataV4.bindList(sEntityPath, undefined, undefined, oFilter, {
					"sap-valid-from": oDateRange.oDateValidFrom,
					"sap-valid-to": oDateRange.oDateValidTo
				});

				this.oControllers.tracer.message("prepare request AssignmentBuckets");
				return new Promise(
					function (resolve, reject) {
						oBinding.requestContexts(0, MAX_MONTHS_ALLOWED * TABLE_SKIP_COUNT).then(
							(aUtilContexts) => {
								this.oControllers.tracer.message("receive response AssignmentBuckets");
								this._storeResourceUtilizations(bReset, aUtilContexts);
								resolve();
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

			_storeResourceUtilizations: function (bReset, aUtilContexts) {
				// transform from OData to Json
				let aResources = this.models.table.getProperty("/resources");
				let aRows = bReset ? [] : this.models.table.getProperty("/rows");
				let aNewResources = aResources.slice(aRows.length, aRows.length + TABLE_SKIP_COUNT);
				let sView = this.models.app.getProperty("/selectedView");
				let aTransformedResources = TransformResources.transform(this.oComponent.oTimeColumnsMap, aNewResources, aUtilContexts, sView);
				this.oControllers.tracer.message("store AssignmentBuckets - rows");

				// set data to the Table Data Model
				aTransformedResources.forEach((oRow) => {
					aRows.push(oRow);
				});
				this.models.table.setProperty("/rows", aRows);
			},

			fetchAssignments: function (oResourceContext) {
				let oResource = oResourceContext.getObject();
				if (oResource.assignmentsLoaded) {
					return Promise.resolve();
				} else {
					return this._fetchAssignments(oResourceContext);
				}
			},

			_fetchAssignments: function (oResourceContext) {
				// create Resource filter to fetch assignments for expanded resource
				let aFilters = [];
				aFilters.push(
					new Filter({
						path: "resource_ID",
						operator: FilterOperator.EQ,
						value1: oResourceContext.getObject().resourceID
					})
				);

				// create date filter to fetch assigments within the grid period
				let sView = this.models.app.getProperty("/selectedView");
				let oDateRange = this.models.date.getDisplayTimePeriod(sView);

				let oSorterForAssignment = new Sorter({
					path: "requestName",
					descending: false,
					group: true
				});

				aFilters.push(
					new Filter({
						path: "requestStartDate",
						operator: FilterOperator.LE,
						value1: oDateRange.oDateValidTo
					})
				);
				aFilters.push(
					new Filter({
						path: "requestEndDate",
						operator: FilterOperator.GE,
						value1: oDateRange.oDateValidFrom
					})
				);

				// prepare the oData listBinding
				let oParameters = {
					$expand: this._getAssignmentExpandParams(oDateRange.oDateValidFrom, oDateRange.oDateValidTo),
					$select: this._getAsgSelectFields()
				};
				let oBinding = this.models.oDataV4.bindList("/" + ODataEntities.ASSIGNMENT_ENTITY_SET, undefined, [oSorterForAssignment], aFilters, oParameters);

				return new Promise(
					function (resolve, reject) {
						return oBinding.requestContexts().then(
							(aContexts) => {
								this._storeAssignments(oResourceContext, aContexts);
								resolve();
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

			_getAsgSelectFields: function () {
				let aSelectFields = [
					"assignmentDurationInHours",
					"assignment_ID",
					"isAssignmentEditable",
					"remainingRequestedCapacityInHours",
					"requestName",
					"requestedCapacityInHours",
					"resourceRequest_ID",
					"resource_ID",
					"totalRequestBookedCapacityInHours",
					"projectId",
					"projectName"
				];
				let aVariantColumns = this.oControllers.variant.getVariant().columns;
				for (let i = 0; i < aVariantColumns.length; i++) {
					if (aVariantColumns[i].columnKey === "assignmentStatus" && aVariantColumns[i].visible) {
						aSelectFields.push("assignmentStatusCode");
						aSelectFields.push("assignmentStatusText");
					} else if (aVariantColumns[i].columnKey === "customer" && aVariantColumns[i].visible) {
						aSelectFields.push("customerId");
						aSelectFields.push("customerName");
					} else if (aVariantColumns[i].columnKey === "projectRole" && aVariantColumns[i].visible) {
						aSelectFields.push("projectRoleName");
					} else if (aVariantColumns[i].columnKey === "request" && aVariantColumns[i].visible) {
						aSelectFields.push("requestDisplayId");
					} else if (aVariantColumns[i].columnKey === "requestStatus" && aVariantColumns[i].visible) {
						aSelectFields.push("requestStatusDescription");
					} else if (aVariantColumns[i].columnKey === "workItemName" && aVariantColumns[i].visible) {
						aSelectFields.push("workItemName");
					} else if (aVariantColumns[i].columnKey === "referenceObject" && aVariantColumns[i].visible) {
						aSelectFields.push("referenceObjectId");
						aSelectFields.push("referenceObjectName");
					} else if (aVariantColumns[i].columnKey === "referenceObjectType" && aVariantColumns[i].visible) {
						aSelectFields.push("referenceObjectTypeName");
					}
				}
				return aSelectFields;
			},

			_storeAssignments: function (oResourceContext, aContexts) {
				if (aContexts.length > 0) {
					let sView = this.models.app.getProperty("/selectedView");
					let aAssignments = [];
					for (let oContext of aContexts) {
						let oDraftAsg = this.models.table.getDraftAsgByRequest(oContext.getObject().resourceRequest_ID);
						let oTransformed = TransformAssignments.transformAssignment(this.oComponent.oTimeColumnsMap, oContext, this.oBundle, sView, oDraftAsg);
						aAssignments.push(oTransformed);
					}
					let sResourcePath = oResourceContext.getPath();
					this.models.table.setProperty(sResourcePath + "/assignments", aAssignments);
					this.models.table.setProperty(sResourcePath + "/assignmentsLoaded", true);
				} else {
					MessageToast.show(this.oBundle.getText("RESOURCE_HAS_NO_ASSIGNMENTS"));
				}
			},

			_getDateRange: function () {
				return {
					oDateValidTo: DateFormatter.dateToEdm(this.models.date.getProperty("/sEndDate")),
					oDateValidFrom: DateFormatter.dateToEdm(this.models.date.getProperty("/sFromDate"))
				};
			},

			_getAssignmentExpandParams: function (validFrom, validTo) {
				let sView = this.models.app.getProperty("/selectedView");
				let sNavProperty = ODataEntities.bucketNavProperty(sView);
				if (sView === Views.DAILY) {
					return sNavProperty + "($filter=date le " + validTo + " and date ge " + validFrom + ")";
				} else {
					return sNavProperty + "($filter=startDate le " + validTo + " and endDate ge " + validFrom + ")";
				}
			}
		});
	}
);
