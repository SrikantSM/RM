sap.ui.define([], function () {
	"use strict";
	return {
		findUtilizationInput: function (oRow, sUtilPath) {
			let aCells = oRow.getCells();
			for (let oCell of aCells) {
				let sCellPath = oCell.getBindingContext().getPath();
				if (sCellPath === sUtilPath) {
					if (oCell.getContent) {
						let aContent = oCell.getContent();
						for (let oControl of aContent) {
							let sControlName = oControl.getMetadata().getName();
							if (sControlName === "sap.m.Input") {
								return oControl;
							}
						}
					}
				}
			}
			return null;
		},

		findAssignmentStatusSelect: function (oRow) {
			let aCells = oRow.getCells();
			for (let oCell of aCells) {
				if (oCell.getItems) {
					let aItems = oCell.getItems();
					for (let oItem of aItems) {
						let sControlName = oItem.getMetadata().getName();
						if (sControlName === "sap.m.Select") {
							return oItem;
						}
					}
				}
			}
			return null;
		},
		findResourceOrRequestNameLink: function (oRow, sPropertyPath) {
			let aCells = oRow.getCells();
			for (let i = 0; i < aCells.length; i++) {
				if (aCells[i].getItems) {
					let aItems = aCells[i].getItems();
					for (let j = 0; j < aItems.length; j++) {
						let oItem = aItems[j];
						let oBinding = oItem.getBinding("text");
						if (oBinding && oBinding.getPath() === sPropertyPath) {
							return oItem;
						}
					}
				}
			}
			return null;
		},

		findDeletedRequestNameLink: function (oRow) {
			let aCells = oRow.getCells();
			for (let i = 0; i < aCells.length; i++) {
				if (aCells[i].getItems) {
					let aItems = aCells[i].getItems();
					for (let j = 0; j < aItems.length; j++) {
						let oItem = aItems[j];
						let oBinding = oItem.getBinding("text");
						if (
							oBinding &&
							oBinding.getPath() === "requestName" &&
							oItem.aCustomStyleClasses &&
							oItem.aCustomStyleClasses[0] === "capacityGridUiDeleted"
						) {
							return oItem;
						}
					}
				}
			}
			return null;
		},

		findRequestNameInput: function (oRow) {
			let aCells = oRow.getCells();
			for (let i = 0; i < aCells.length; i++) {
				if (aCells[i].getItems) {
					let aItems = aCells[i].getItems();
					for (let j = 0; j < aItems.length; j++) {
						let oItem = aItems[j];
						let oBinding = oItem.getBinding("value");
						if (oBinding && oBinding.getPath() === "requestName") {
							return oItem;
						}
					}
				}
			}
			return null;
		},

		findRequestNameLink: function (oRow) {
			let aCells = oRow.getCells();
			for (let i = 0; i < aCells.length; i++) {
				if (aCells[i].getItems) {
					let aItems = aCells[i].getItems();
					for (let j = 0; j < aItems.length; j++) {
						let oItem = aItems[j];
						let oBinding = oItem.getBinding("text");
						if (oBinding && oBinding.getPath() === "requestName") {
							return oItem;
						}
					}
				}
			}
			return null;
		},

		findStaffingSummaryProgressInd: function (oRow) {
			let aCells = oRow.getCells();
			for (let i = 0; i < aCells.length; i++) {
				let oCell = aCells[i];
				let oBinding = aCells[i].getBinding("displayValue");
				if (oBinding && oBinding.getPath() === "staffedHoursText") {
					return oCell;
				}
			}
			return null;
		},

		findAdditionalColumnTextControl: function (oRow, sBindingPath) {
			let aCells = oRow.getCells();
			for (let i = 0; i < aCells.length; i++) {
				let oCell = aCells[i];
				let oBinding = oCell.getBinding("text");
				if (oBinding && oBinding.getBindings && oBinding.getBindings()[0].getPath() === sBindingPath) {
					return oCell;
				}
			}
			return null;
		},

		findProjectRoleControl: function (oRow) {
			let aCells = oRow.getCells();
			for (let i = 0; i < aCells.length; i++) {
				let oCell = aCells[i];
				let oBinding = oCell.getBinding("text");
				if (oBinding && oBinding.getPath() === "projectRoleName") {
					return oCell;
				}
			}
			return null;
		},

		findUtilPerAsgHourText: function (oRow) {
			let aCells = oRow.getCells();
			for (let i = 0; i < aCells.length; i++) {
				if (aCells[i].getContent) {
					let aContents = aCells[i].getContent();
					for (let j = 0; j < aContents.length; j++) {
						let oContent = aContents[j];
						let oBinding = oContent.getBinding("text");
						if (oBinding.getBindings && oBinding.getBindings()[0].getPath() === "assignmentDurationInHours") {
							return oContent;
						}
					}
				}
			}
			return null;
		}
	};
});
