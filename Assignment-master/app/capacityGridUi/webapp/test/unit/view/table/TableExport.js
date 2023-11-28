sap.ui.define(
	["capacityGridUi/view/table/TableExport", "capacityGridUi/test/unit/stubs/ControllerStub", "capacityGridUi/view/variant/StandardVariant"],
	function (TableExport, ControllerStub, StandardVariant) {
		"use strict";

		QUnit.module("TableExport", {
			beforeEach: function () {
				this.oController = new TableExport(ControllerStub);
			}
		});

		QUnit.test("Test Exported Table Columns for 2 Months", function (assert) {
			let aColumns = [
				{
					getId: function () {
						return "idMonthColumn";
					},

					getLabel: function () {
						return {
							getText: function () {
								return "Jul 2022";
							}
						};
					}
				},
				{
					getId: function () {
						return "idMonthColumn";
					},

					getLabel: function () {
						return {
							getText: function () {
								return "Aug 2022";
							}
						};
					}
				}
			];

			let aColumnsConfig = this.oController.createColumnConfig(StandardVariant, aColumns);

			assert.equal(aColumnsConfig[0].label, "Name", "Name");
			assert.equal(aColumnsConfig[0].type, "string", "string");
			assert.equal(aColumnsConfig[0].property, "resourceName", "resourceName");

			assert.equal(aColumnsConfig[1].label, "Resource Organization", "is Resource Organization");
			assert.equal(aColumnsConfig[1].template, "{0} ({1})", "{0} ({1})");

			assert.equal(aColumnsConfig[2].label, "Utilization", "is Utilization / Assigned Hours");
			assert.equal(aColumnsConfig[2].type, "number", "number");
			assert.equal(aColumnsConfig[2].property, "avgUtilization", "avgUtilization");

			assert.equal(aColumnsConfig[3].label, "Jul 2022", "Jul 2022");
			assert.equal(aColumnsConfig[3].template, "{0} % \n {1} / {2} hr", "{0} % \n {1} / {2} hr");

			assert.equal(aColumnsConfig[4].label, "Aug 2022", "Aug 2022");
			assert.equal(aColumnsConfig[4].template, "{0} % \n {1} / {2} hr", "{0} % \n {1} / {2} hr");
		});
	}
);
