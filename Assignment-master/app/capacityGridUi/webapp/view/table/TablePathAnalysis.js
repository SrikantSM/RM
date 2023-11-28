sap.ui.define(["sap/ui/base/Object"], function (UI5Object) {
	"use strict";

	return UI5Object.extend("capacityGridUi.view.table.TablePathAnalysis", {
		constructor: function (sPath) {
			let aIndizes = sPath.match(/\d+/g);
			this.path = sPath;
			this.isResource = aIndizes.length === 1;
			this.isAssignment = aIndizes.length === 2;
			this.isUtilization = aIndizes.length === 3;
			this.propertyPath = null;
			let aPaths = sPath.split("/");
			let sPropertyPath = aPaths[aPaths.length - 1];
			if (isNaN(parseInt(sPropertyPath))) {
				this.propertyPath = sPropertyPath;
			}
			if (this.isResource) {
				this.resourceIndex = parseInt(aIndizes[0]);
				this.resourcePath = sPath;
			} else if (this.isAssignment) {
				this.resourceIndex = parseInt(aIndizes[0]);
				this.assignmentIndex = parseInt(aIndizes[1]);
				this.resourcePath = "/rows/" + this.resourceIndex;
				this.assignmentPath = "/rows/" + this.resourceIndex + "/assignments/" + this.assignmentIndex;
			} else if (this.isUtilization) {
				this.resourceIndex = parseInt(aIndizes[0]);
				this.assignmentIndex = parseInt(aIndizes[1]);
				this.utilizationIndex = parseInt(aIndizes[2]);
				this.resourcePath = "/rows/" + this.resourceIndex;
				this.assignmentPath = "/rows/" + this.resourceIndex + "/assignments/" + this.assignmentIndex;
				this.resourceUtilizationPath = "/rows/" + this.resourceIndex + "/utilization/" + this.utilizationIndex;
				this.utilizationPath = "/rows/" + this.resourceIndex + "/assignments/" + this.assignmentIndex + "/utilization/" + this.utilizationIndex;
			}
		}
	});
});
