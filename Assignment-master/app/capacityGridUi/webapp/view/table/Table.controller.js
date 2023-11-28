sap.ui.define(
	[
		"capacityGridUi/reuse/controller/BaseViewController",
		"capacityGridUi/reuse/valuehelp/ValueHelpDialog.controller",
		"capacityGridUi/view/quickView/QuickView.controller",
		"capacityGridUi/view/persoDialog/PersoDialog.controller",
		"capacityGridUi/view/table/TableExport",
		"capacityGridUi/view/table/TableShowRow",
		"capacityGridUi/view/table/TableFetch",
		"capacityGridUi/view/table/TableColumnUpdate",
		"capacityGridUi/view/table/TimeColumnsMap",
		"capacityGridUi/view/table/TablePathAnalysis",
		"capacityGridUi/view/table/TableCellFinder",
		"capacityGridUi/view/Views",
		"sap/m/MessageToast",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	],
	function (
		BaseViewController,
		ValueHelpDialogController,
		QuickViewController,
		PersoDialogController,
		TableExport,
		TableShowRow,
		TableFetch,
		TableColumnUpdate,
		TimeColumnsMap,
		TablePathAnalysis,
		TableCellFinder,
		Views,
		MessageToast,
		Filter,
		FilterOperator
	) {
		"use strict";

		return BaseViewController.extend("capacityGridUi.view.table.Table", {
			oTable: null,
			oQuickViewController: undefined,
			oPersoDialogController: undefined,
			oTableColumnUpdate: undefined,
			oTableFetch: undefined,
			oTableExport: undefined,
			oTableShowRow: undefined,
			oRequestValueHelpDialogController: undefined,

			onInit: function () {
				this.injectMembers();

				// controllers
				this.oComponent.oControllers.add("table", this);
				this.oQuickViewController = new QuickViewController(this.getOwnerComponent(), this.getView());
				this.oPersoDialogController = new PersoDialogController(this.getOwnerComponent(), this.getView());

				// table
				this.oTable = this.byId("tblCapacity");
				this.oTable.setModel(this.models.table);

				// bind model
				this.oTable.bindRows({
					path: "/rows",
					parameters: {
						arrayNames: ["assignments"]
					}
				});

				this.oRequestValueHelpDialogController = new ValueHelpDialogController({
					fragmentId: this.oTable.getId() + "-requestValueHelp",
					component: this.oComponent,
					dependent: this.getView(),
					config: this.oComponent.oValueHelpConfigCollection.get("createAsgRequest"),
					configCollection: this.oComponent.oValueHelpConfigCollection,
					supportMultiselect: false
				});

				this.oTableColumnUpdate = new TableColumnUpdate(this);
				this.oTableFetch = new TableFetch(this);
				this.oTableExport = new TableExport(this);
				this.oTableShowRow = new TableShowRow(this);
			},

			onExit: function () {
				this.oQuickViewController.destroy();
				this.oPersoDialogController.destroy();
			},

			// TODO optimize along leadingColumns & timeColumns params
			updateColumns: function (oParams) {
				let sView = this.models.app.getProperty("/selectedView");
				if (oParams.timeColumns) {
					this.oComponent.oTimeColumnsMap = new TimeColumnsMap(
						this.oBundle,
						sView,
						this.models.date.getProperty("/sFromDate"),
						this.models.date.getProperty("/sEndDate")
					);
				}
				this.oTableColumnUpdate.update(sView);
			},

			fetchResources: function (oParams) {
				this.oTableFetch.fetchResources(oParams.reset);
			},

			getGroupingParameter: function () {
				let aGroupingFields = [
					"ID",
					"resourceName",
					"workforcePersonID",
					"assignmentExistsForTheResource",
					"resourceOrganizationNameForDisplay",
					"resourceOrganizationIdForDisplay",
					"isPhotoPresent"
				];
				let aVariantColumns = this.oControllers.variant.getVariant().columns;
				for (let i = 0; i < aVariantColumns.length; i++) {
					if (aVariantColumns[i].columnKey === "costCenter" && aVariantColumns[i].visible) {
						aGroupingFields.push("costCenterForDisplay");
					} else if (aVariantColumns[i].columnKey === "workerType" && aVariantColumns[i].visible) {
						aGroupingFields.push("workerType");
					} else if (aVariantColumns[i].columnKey === "staffingHrs" && aVariantColumns[i].visible) {
						aGroupingFields.push("avgUtilization");
					}
				}
				return "groupby((" + aGroupingFields.toString() + "),aggregate(validFrom with min as startdatenew))";
			},

			applyVariant: function (oVariant) {
				this.models.table.setProperty("/sortOrder", oVariant.sortOrder);
				this.models.table.setProperty("/sortProperty", oVariant.sortProperty);
				this.oControllers.header.fetchKPI();
				this.updateColumns({ leadingColumns: true, timeColumns: true });
				this.fetchResources({ reset: true });
			},

			onUtilizationChanged: function (oEvent) {
				let oInput = oEvent.getSource();
				this.oControllers.draftUpdateHours.update(oInput);
				this.models.table.unmarkAssignmentCopiedOrCut([this._getAssignmentPathForCurrentRow(oInput)]);
			},

			onAssigmentStatusChanged: function (oEvent) {
				let oSelect = oEvent.getSource();
				this.oControllers.draftUpdateStatus.update(oEvent);
				this.models.table.unmarkAssignmentCopiedOrCut([this._getAssignmentPathForCurrentRow(oSelect)]);
			},

			_getAssignmentPathForCurrentRow: function (oControl) {
				let oUtilContext = oControl.getBindingContext();
				let sAsgPath = new TablePathAnalysis(oUtilContext.getPath()).assignmentPath;
				return sAsgPath;
			},

			onSort: function (oEvent) {
				oEvent.preventDefault();
				let oSortedColumn = oEvent.getParameter("column");
				let sSortOrder = oEvent.getParameter("sortOrder");
				let sSortProperty = oSortedColumn.getSortProperty();
				this.models.table.setProperty("/sortOrder", sSortOrder);
				this.models.table.setProperty("/sortProperty", sSortProperty);
				this.oControllers.variant.changeVariant("sortOrder", null, sSortOrder);
				this.oControllers.variant.changeVariant("sortProperty", null, sSortProperty);
				this.fetchResources({ reset: true });
			},

			onExpandRow: function (oEvent) {
				let bExpanded = oEvent.getParameter("expanded");
				let oResourceContext = oEvent.getParameter("rowContext");
				if (bExpanded) {
					let iRowIndex = oEvent.getParameter("rowIndex");
					this.expandRow(oResourceContext, iRowIndex);
				} else {
					this.models.table.setProperty(oResourceContext.getPath() + "/expanded", false);
				}
			},

			expandRow: function (oResourceContext, iRowIndex) {
				return new Promise(
					function (resolve, reject) {
						this.oTable.collapse(iRowIndex);
						this.models.table.setProperty("/busy", true);
						this.oTableFetch
							.fetchAssignments(oResourceContext)
							.then(() => {
								this.oTable.expand(iRowIndex);
								this.models.table.setProperty(oResourceContext.getPath() + "/expanded", true);
								this.models.table.setProperty("/busy", false);
								resolve();
							})
							.catch(reject);
					}.bind(this)
				);
			},

			handleColumnMenuOpen: function (oEvent) {
				let bEditMode = this.models.app.getProperty("/IsEditMode");
				if (bEditMode) {
					oEvent.preventDefault();
					MessageToast.show(this.oBundle.getText("SAVE_CHANGES_TO_PROCEED"));
				}
			},

			onResourceLinkPress: function (oEvent) {
				let oResourceLink = oEvent.getSource();
				this.oQuickViewController.openResource(oResourceLink);
			},

			onRequestLinkPress: function (oEvent) {
				let oRequestLink = oEvent.getSource();
				this.oQuickViewController.openRequest(oRequestLink);
			},

			onOpenViewDetails: function (oEvent) {
				let oSource = oEvent.getSource();
				let oContext = oSource.getBindingContext();
				let oObject = oContext.getObject();
				let oRow = this._getRowByContextPath(oContext.getPath());
				if (!oRow) {
					throw new Error("row not found for path" + oContext.getPath());
				}
				if (oObject.parent) {
					let oResourceLink = TableCellFinder.findResourceOrRequestNameLink(oRow, "resourceName");
					this.oQuickViewController.openResource(oResourceLink);
				} else {
					let oOpenByControl;
					if (oObject.changeState === "created") {
						oOpenByControl = TableCellFinder.findRequestNameInput(oRow, "requestName");
					} else if (oObject.changeState === "deleted") {
						oOpenByControl = TableCellFinder.findDeletedRequestNameLink(oRow, "requestName");
					} else {
						oOpenByControl = TableCellFinder.findResourceOrRequestNameLink(oRow, "requestName");
					}
					this.oQuickViewController.openRequest(oOpenByControl);
				}
			},

			_getRowByContextPath: function (sPath) {
				let aRows = this.oTable.getRows();
				for (let i = 0; i < aRows.length; i++) {
					if (aRows[i].getBindingContext().getPath() === sPath) {
						return aRows[i];
					}
				}
				return null;
			},

			formatTitle: function (iTotalResources) {
				if (iTotalResources !== undefined && iTotalResources !== null) {
					return this.oBundle.getText("RESOURCES", [iTotalResources]);
				}
			},

			onScroll: function (oEvent) {
				this.oQuickViewController.closeContactCardOnScroll();
				this.oTableFetch.fetchOnScroll(oEvent);
			},

			onColumnResize: function (oEvent) {
				let sWidth = oEvent.getParameter("width");
				let oColumn = oEvent.getParameter("column");
				let sVariantColumnKey = oColumn.data("variantColumnKey");
				this.oControllers.variant.changeColumnWidth(sVariantColumnKey, sWidth);
			},

			onOpenPersoDialog: function (oEvent) {
				this.oPersoDialogController.open();
			},

			onExportToExcel: function (oEvent) {
				this.oTableExport.export();
			},

			onToggleFilter: function (oEvent) {
				this.oControllers.page.toggleFilter();
			},

			onEdit: function (oEvent) {
				let bIsFocusedEdit = oEvent.getSource().data("EditMode") === "FocusedEdit";
				this.oControllers.page.toggleEditMode({ bFocusedEdit: bIsFocusedEdit });
				if (bIsFocusedEdit) {
					this.fetchResources({ reset: true });
				}
				this.clearSelectionInTable();
				this.calculateResourceCount();
			},

			showRow: function (sPath, sFocusPath) {
				this.oTableShowRow.showRow(sPath, sFocusPath);
			},

			onRowSelectionChange: function (oEvent) {
				let bEditMode = this.models.app.getProperty("/IsEditMode");
				if (bEditMode) {
					this.calculateButtonEnablement();
				} else {
					this.calculateResourceCount();
				}
			},

			onBeforeContextMenuOpen: function (oEvent) {
				let iIndex = oEvent.getParameter("rowIndex");
				if (!this.getSelectedIndicesInTable().includes(iIndex)) {
					this.clearSelectionInTable();
					this.setSelectedIndexInTable(iIndex);
				}
			},

			clearSelectionInTable: function () {
				this.oTable.getPlugin("sap.ui.table.plugins.MultiSelectionPlugin").clearSelection();
			},

			setSelectedIndexInTable: function (iIndex) {
				this.oTable.getPlugin("sap.ui.table.plugins.MultiSelectionPlugin").setSelectedIndex(iIndex);
			},

			onCancelSelected: function () {
				let aAsgPaths = this.getSelectedAssignmentPaths();
				this.oControllers.draftCancel.cancelSelected(aAsgPaths);
			},

			getSelectedAssignmentPaths: function () {
				let aAsgPaths = [];
				this.getSelectedIndicesInTable().forEach((index) => {
					let oContext = this.oTable.getContextByIndex(index);
					let sPath = oContext.getPath();
					let oAnalysis = new TablePathAnalysis(sPath);
					if (oAnalysis.isAssignment) {
						aAsgPaths.push(sPath);
					}
				});
				return aAsgPaths;
			},

			getResourceDetailsForAddAsg: function () {
				let aResources = [];
				this.getSelectedIndicesInTable().forEach((iResourceIndex) => {
					let oContext = this.oTable.getContextByIndex(iResourceIndex);
					let oAnalysis = new TablePathAnalysis(oContext.getPath());
					if (oAnalysis.isResource) {
						let oResource = {
							resourceIndex: iResourceIndex,
							resourceContext: oContext
						};
						aResources.push(oResource);
					}
				});
				return aResources;
			},

			onRowsUpdated: function () {
				this.oTableFetch.onRowsUpdated();
			},

			onInfoBar: function (oEvent) {
				let bDisplayMode = this.models.app.getProperty("/IsDisplayMode");
				if (bDisplayMode) {
					this.oControllers.page.toggleFilter();
				}
			},

			formatInfoBarText: function (iCount, aItems) {
				if (iCount && aItems) {
					let sInfobarText = "";
					if (iCount <= 1) {
						sInfobarText = this.oBundle.getText("FILTER_ACTIVE", [iCount]) + ": ";
					} else {
						sInfobarText = this.oBundle.getText("FILTERS_ACTIVE", [iCount]) + ": ";
					}
					aItems.forEach(function (sItem, iIndex) {
						if (iIndex !== aItems.length - 1) {
							sInfobarText += sItem + ", ";
						} else {
							sInfobarText += sItem;
						}
					});
					return sInfobarText;
				}
			},

			calculateButtonEnablement: function () {
				let iResourceCount = this.oControllers.table.getSelectedResourceCount();
				let aAsgPaths = this.oControllers.table.getSelectedAssignmentPaths();
				let bAtLEastOneAssignmentNotDeleted = this.models.table.atLeastOneAssignmentNotDeleted(aAsgPaths);

				let bResSel = iResourceCount > 0;
				this.models.table.setProperty("/cancelEnabled", !bResSel && this.models.table.atLeastOneAssignmentChanged(aAsgPaths));
				this.models.table.setProperty("/addAsgEnabled", iResourceCount === 1 && aAsgPaths.length === 0);
				this.models.table.setProperty("/deleteAsgEnabled", iResourceCount === 0 && aAsgPaths.length > 0 && bAtLEastOneAssignmentNotDeleted);
				this.oControllers.table.calculateFilterDropDownEnablement();
				this.oControllers.cutCopyPaste.calculateButtonEnablement(iResourceCount, aAsgPaths);
			},

			calculateResourceCount: function () {
				const aCounts = new Set();
				const aSelectedResources = this.getSelectedIndicesInTable().map((index) => {
					const oContext = this.oTable.getContextByIndex(index);
					const oObject = oContext.getObject();
					return oObject.parent ? oObject.resourceID : oObject.resource_ID;
				});

				aSelectedResources.forEach((resourceID) => {
					aCounts.add(resourceID);
				});

				this.models.table.setProperty("/IsFocusedEditOnLimit", aCounts.size <= 15);
				if (aCounts.size >= 15) {
					MessageToast.show(this.oBundle.getText("LIMIT_REACHED_FOR_FOCUSED_EDIT"));
				}

				this.models.table.setProperty("/SelectedResourceCount", aCounts.size);
				this.models.table.setProperty("/SelectedResourcesID", Array.from(aCounts));
			},

			calculateEnablementForToolbarElements: function () {
				this.calculateButtonEnablement();
				this.calculateFilterDropDownEnablement();
			},
			getSelectedResourceCount: function () {
				let iResourceCount = 0;
				this.getSelectedIndicesInTable().forEach((index) => {
					let oContext = this.oTable.getContextByIndex(index);
					let oObject = oContext.getObject();
					if (oObject.parent) {
						iResourceCount++;
					}
				});
				return iResourceCount;
			},

			getSelectedIndicesInTable: function () {
				return this.oTable.getPlugin("sap.ui.table.plugins.MultiSelectionPlugin").getSelectedIndices();
			},

			getContextByIndex: function (index) {
				return this.oTable.getContextByIndex(index);
			},

			onCloseFilterBar: function () {
				this.byId("idFilterToggleButton").focus();
			},

			formatRowHighlight: function (bError, bWarning, bChanged) {
				if (bError) {
					return "Error";
				} else if (bWarning) {
					return "Warning";
				} else if (bChanged) {
					return "Information";
				} else {
					return "None";
				}
			},

			onAddAssignment: function () {
				this.oControllers.draftCreate.addNewAssignment();
			},

			focusNewRequest: function (oResourceDetail) {
				let sResourcePath = oResourceDetail.resourceContext.getPath();
				let iNewAsgIndex = this.models.table.getNewAsgIndex(sResourcePath);
				let sAsgPath = sResourcePath + "/assignments/" + iNewAsgIndex;
				let oAsgRow = this._getRowByContextPath(sAsgPath);
				if (!oAsgRow) {
					let iScrolToRowIndex = iNewAsgIndex + oResourceDetail.resourceIndex + 1;
					this.oTable.setFirstVisibleRow(iScrolToRowIndex);
				}
				setTimeout(() => {
					// why row detail is fetched again inside timeout?
					// when new rows are added beyond the visible row, we scroll to the new row to get the row content.
					// first call checks weather row is availble and decision to scroll is taken.
					oAsgRow = this._getRowByContextPath(sAsgPath);
					if (oAsgRow) {
						let oInput = TableCellFinder.findRequestNameInput(oAsgRow);
						oInput.focus();
					}
				}, 500);
			},

			onDeleteAssignment: function () {
				let aSelectedAsgPaths = this.getSelectedAssignmentPaths();
				this.oControllers.draftDelete.deleteAssignment(aSelectedAsgPaths);
			},

			onCopyAssignment: function (oEvent) {
				let aSelectedAsgPaths = this.getSelectedAssignmentPaths();
				this.oControllers.cutCopyPaste.copyAssignment(aSelectedAsgPaths);
			},

			onCutAssignment: function (oEvent) {
				let aSelectedAsgPaths = this.getSelectedAssignmentPaths();
				this.oControllers.cutCopyPaste.cutAssignment(aSelectedAsgPaths);
			},

			onPasteAssignment: function (oEvent) {
				let oResourceDetails = this.oControllers.table.getResourceDetailsForAddAsg()[0];
				let aCopiedAssignmentPaths = this.models.table.getCopiedAssignmentPaths();
				this.oControllers.cutCopyPaste.pasteAssignment(oResourceDetails, aCopiedAssignmentPaths);
			},

			onDragStart: function (oEvent) {
				this.oControllers.dragAndDrop.dragStart(oEvent);
			},

			onDragEnter: function (oEvent) {
				this.oControllers.dragAndDrop.dragEnter(oEvent);
			},
			onDrop: function (oEvent) {
				this.oControllers.dragAndDrop.onDrop(oEvent);
			},
			onEditStatusFilterChange: function (oEvent) {
				let key = oEvent.getSource().getSelectedKey();
				let oBinding = this.oTable.getBinding("rows");
				let filter;

				if (key === "Changed") {
					filter = this._getFilterForChangedResources();
				} else {
					filter = [];
				}

				oBinding.filter(filter);
				this.calculateFilterDropDownEnablement();
			},
			calculateFilterDropDownEnablement: function () {
				let aResources = this.models.table.getProperty("/rows");
				const changed = aResources.some((oResource) => oResource.changed);
				this.models.table.setProperty("/filterDropDownEnabled", this.models.table.getProperty("/SelectedEditStatus") === "Changed" || changed);
			},
			_getFilterForChangedResources: function () {
				let aFilters = [];
				let aResourceIdsForChangesResources = this.models.table.getResourceIdsForChangedResources();
				for (let i = 0; i < aResourceIdsForChangesResources.length; i++) {
					aFilters.push(new Filter("resource_ID", FilterOperator.EQ, aResourceIdsForChangesResources[i]));
				}
				return new Filter({
					filters: aFilters,
					and: false
				});
			},

			formatEditButton: function (sEditText, iResCount) {
				if (iResCount > 0) {
					return sEditText + " (" + iResCount + ")";
				} else {
					return sEditText;
				}
			}
		});
	}
);
