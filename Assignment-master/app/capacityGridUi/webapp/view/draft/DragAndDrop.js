sap.ui.define(["capacityGridUi/view/draft/DraftChange", "capacityGridUi/view/table/TablePathAnalysis"], function (DraftChange, TablePathAnalysis) {
	"use strict";
	return DraftChange.extend("capacityGridUi.view.draft.DragAndDrop", {
		sScenario: undefined,
		onInit: function () {
			this.injectMembers();
		},

		dragStart: function (oEvent) {
			let aAsgPaths = [];
			let oDragSession = oEvent.getParameter("dragSession");
			this.oControllers.cutCopyPaste.sScenario = "CutPaste";
			aAsgPaths = this._getDraggedAssignments(oEvent);
			let aValidDraggableItems = this._getVaidDraggableItem(aAsgPaths);
			if (aValidDraggableItems.length > 0) {
				oDragSession.setComplexData("assignemtToBeMoved", {
					draggedRowPath: aValidDraggableItems
				});
			} else {
				oEvent.preventDefault();
			}
		},

		_getDraggedAssignments: function (oEvent) {
			let aAsgPaths = [];
			let oDraggedRow = oEvent.getParameter("target");
			let iDraggedRowIndex = oDraggedRow.getIndex();
			let aSelectedIndices = this.oControllers.table.getSelectedIndicesInTable();
			if (this._isAnyResourceRow([iDraggedRowIndex]) || this._isAnyResourceRow(aSelectedIndices)) {
				oEvent.preventDefault();
				return [];
			}
			if (aSelectedIndices.length <= 1) {
				aAsgPaths.push(this.oControllers.table.getContextByIndex(iDraggedRowIndex).getPath());
				return aAsgPaths;
			}
			if (this._isDraggedRowPartOfSelection(aSelectedIndices, iDraggedRowIndex)) {
				for (let i = 0; i < aSelectedIndices.length; i++) {
					aAsgPaths.push(this.oControllers.table.getContextByIndex(aSelectedIndices[i]).getPath());
				}
			} else {
				this.oControllers.table.clearSelectionInTable();
				this.oControllers.table.setSelectedIndexInTable(iDraggedRowIndex);
				aAsgPaths.push(this.oControllers.table.getContextByIndex(iDraggedRowIndex).getPath());
			}

			return aAsgPaths;
		},

		_isAnyResourceRow: function (aSelectedIndices) {
			for (let i = 0; i < aSelectedIndices.length; i++) {
				let sDraggedRowPath = this.oControllers.table.getContextByIndex(aSelectedIndices[i]).getPath();
				if (new TablePathAnalysis(sDraggedRowPath).isResource) {
					return true;
				}
			}
			return false;
		},

		_getVaidDraggableItem: function (aAsgPaths) {
			let aValidAssignmentPathsForCopy = aAsgPaths.filter((sPath) => this.models.table.getProperty(sPath).changeState !== "deleted");
			return aValidAssignmentPathsForCopy;
		},

		dragEnter: function (oEvent) {
			let oDroppedRowPath = oEvent.getParameter("target").getRowBindingContext().getPath();
			if (new TablePathAnalysis(oDroppedRowPath).isAssignment) {
				oEvent.preventDefault();
			}
		},
		onDrop: function (oEvent) {
			this.models.table.setProperty("/Scenario", "CutPaste");
			let oDragSession = oEvent.getParameter("dragSession");
			let sDroppedRowPath = oEvent.getParameter("droppedControl").getRowBindingContext().getPath();
			if (this._isDroppingAllowedOnCurrentRow(sDroppedRowPath)) {
				let iDroppedRowIndex = oEvent.getParameter("droppedControl").getIndex();
				let oResourceDetails = this._getResourceDetails(iDroppedRowIndex);

				this.oControllers.cutCopyPaste
					.pasteAssignment(oResourceDetails, oDragSession.getComplexData("assignemtToBeMoved").draggedRowPath)
					.then(() => {
						this.models.table.unmarkAssignmentCopiedOrCut(this.models.table.getCopiedAssignmentPaths() || []);
						this.oControllers.table.clearSelectionInTable();
					});
			} else {
				oEvent.preventDefault();
				return;
			}
		},

		_getResourceDetails: function (iDroppedRowIndex) {
			let oContext = this.oControllers.table.getContextByIndex(iDroppedRowIndex);
			let oResourceDetails = {
				resourceIndex: iDroppedRowIndex,
				resourceContext: oContext
			};

			return oResourceDetails;
		},

		_isDraggedRowPartOfSelection: function (aSelectedIndices, iDraggedRowIndex) {
			if (aSelectedIndices.indexOf(iDraggedRowIndex) === -1) {
				return false;
			}
			return true;
		},

		_isDroppingAllowedOnCurrentRow: function (sDroppedRowPath) {
			if (new TablePathAnalysis(sDroppedRowPath).isAssignment) {
				return false;
			}
			return true;
		}
	});
});
