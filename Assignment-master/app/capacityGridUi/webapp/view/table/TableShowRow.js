sap.ui.define(
	[
		"capacityGridUi/reuse/controller/BaseViewChildController",
		"capacityGridUi/view/table/TablePathAnalysis",
		"capacityGridUi/view/table/TableCellFinder"
	],
	function (BaseViewChildController, TablePathAnalysis, TableCellFinder) {
		"use strict";

		return BaseViewChildController.extend("capacityGridUi.view.table.TableShowRow", {
			oTable: undefined,

			onInit: function () {
				this.injectMembers();
				this.oTable = this.byId("tblCapacity");
			},

			showRow: function (sAsgId, sFocusPath) {
				let sAsgPath = this.models.table.getAssignmentPaths(sAsgId).asgPath;
				let oPathAnalysis = new TablePathAnalysis(sAsgPath);
				let iExpandedResourceIndex = this._getExpandedResourceIndex(oPathAnalysis.resourceIndex);
				this._expand(oPathAnalysis, iExpandedResourceIndex);
				this._scroll(oPathAnalysis, iExpandedResourceIndex);
				this._focus(oPathAnalysis, sFocusPath);
			},

			_getExpandedResourceIndex: function (iResourceIndex) {
				let iRowIndex = iResourceIndex;
				for (let i = 0; i < iResourceIndex; i++) {
					let bExpanded = this.models.table.getProperty("/rows/" + i + "/expanded");
					if (bExpanded) {
						iRowIndex += this.models.table.getProperty("/rows/" + i + "/assignments").length;
					}
				}
				return iRowIndex;
			},

			_expand: function (oPathAnalysis, iExpandedResourceIndex) {
				let bResourceExpanded = this.models.table.getProperty(oPathAnalysis.resourcePath + "/expanded");
				if (!bResourceExpanded) {
					this.oTable.expand(iExpandedResourceIndex);
					this.models.table.setProperty(oPathAnalysis.resourcePath + "/expanded", true);
				}
			},

			_scroll: function (oPathAnalysis, iExpandedResourceIndex) {
				let iAsgRowIndex = iExpandedResourceIndex + oPathAnalysis.assignmentIndex + 1;
				this.oTable.setFirstVisibleRow(iAsgRowIndex);
			},

			// why a timeout? must wait for re-rendering after the expand/scroll!
			// why 500ms? no clue. it does not work with 0. i found the 500 in the previous code and hope for the best!
			_focus: function (oPathAnalysis, sFocusPath) {
				setTimeout(() => {
					let oTargetControl = this._findControl(oPathAnalysis, sFocusPath);
					if (oTargetControl) {
						oTargetControl.focus();
					}
				}, 500);
			},

			// Q: why was the control not stored in the message instead of this lengthy code?
			// A: the table creates/destroys controls as you scroll. they are not stable.
			_findControl: function (oPathAnalysis, sFocusPath) {
				let aRows = this.oTable.getRows();
				for (let oRow of aRows) {
					let sRowPath = oRow.getBindingContext().getPath();
					if (sRowPath === oPathAnalysis.assignmentPath) {
						if (sFocusPath === "requestName") {
							return TableCellFinder.findRequestNameInput(oRow);
						} else if (sFocusPath === "assignmentStatusCode") {
							return TableCellFinder.findAssignmentStatusSelect(oRow);
						} else if (sFocusPath.includes("utilization")) {
							return TableCellFinder.findUtilizationInput(oRow, sRowPath + "/" + sFocusPath);
						}
					}
				}
				return null;
			}
		});
	}
);
