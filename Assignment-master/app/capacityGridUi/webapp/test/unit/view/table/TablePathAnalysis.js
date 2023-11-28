sap.ui.define(["capacityGridUi/view/table/TablePathAnalysis"], function (TablePathAnalysis) {
	"use strict";

	QUnit.module("TablePathAnalysis");

	QUnit.test("Test Table Resouce Path", function (assert) {
		let sPath = "/rows/57";
		let tablePathAnalysis = new TablePathAnalysis(sPath);

		assert.equal(tablePathAnalysis.resourcePath, "/rows/57", "resourceIndex is /rows/57");
		assert.equal(tablePathAnalysis.resourceIndex, "57", "resourcePath is 57");
		assert.equal(tablePathAnalysis.propertyPath, null, "propertyPath is null");
	});

	QUnit.test("Test Table Assignment Path", function (assert) {
		let sPath = "/rows/57/assignments/0/requestName";
		let tablePathAnalysis = new TablePathAnalysis(sPath);

		assert.equal(tablePathAnalysis.resourceIndex, "57", "resourceIndex is 57");
		assert.equal(tablePathAnalysis.assignmentIndex, "0", "assignmentIndex is 0");
		assert.equal(tablePathAnalysis.resourcePath, "/rows/57", "resourcePath is /rows/57");
		assert.equal(tablePathAnalysis.assignmentPath, "/rows/57/assignments/0", "assignmentPath is /rows/57/assignments/0");
		assert.equal(tablePathAnalysis.propertyPath, "requestName", "propertyPath is requestName");
	});

	QUnit.test("Test Table Utilization Path", function (assert) {
		let sPath = "/rows/57/assignments/0/utilization/0/asgUtil";
		let tablePathAnalysis = new TablePathAnalysis(sPath);

		assert.equal(tablePathAnalysis.resourceIndex, "57", "resourceIndex is 57");
		assert.equal(tablePathAnalysis.assignmentIndex, "0", "assignmentIndex is 0");
		assert.equal(tablePathAnalysis.utilizationIndex, "0", "utilizationIndex is 0");
		assert.equal(tablePathAnalysis.resourcePath, "/rows/57", "resourcePath is /rows/57");
		assert.equal(tablePathAnalysis.assignmentPath, "/rows/57/assignments/0", "assignmentPath is /rows/57/assignments/0");
		assert.equal(tablePathAnalysis.resourceUtilizationPath, "/rows/57/utilization/0", "resourceUtilizationPath is /rows/57/utilization/0");
		assert.equal(
			tablePathAnalysis.utilizationPath,
			"/rows/57/assignments/0/utilization/0",
			"utilizationPath is /rows/57/assignments/0/utilization/0"
		);
		assert.equal(tablePathAnalysis.propertyPath, "asgUtil", "propertyPath is asgUtil");
	});
});
