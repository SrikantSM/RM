sap.ui.define(
	[
		"capacityGridUi/view/variant/Variant.controller",
		"capacityGridUi/view/variant/StandardVariant",
		"capacityGridUi/test/unit/stubs/ComponentStub",
		"capacityGridUi/test/unit/view/variant/VariantVersion1",
		"capacityGridUi/test/unit/view/variant/VariantVersion2",
		"capacityGridUi/test/unit/view/variant/VariantVersion3",
		"capacityGridUi/test/unit/view/variant/VariantVersion4",
		"capacityGridUi/test/unit/view/variant/VariantVersion5",
		"capacityGridUi/test/unit/view/variant/VariantVersion6",
		"capacityGridUi/test/unit/view/variant/VariantVersion7",
		"capacityGridUi/test/unit/view/variant/VariantVersion8"
	],

	function (
		VariantController,
		StandardVariant,
		ComponentStub,
		VariantVersion1,
		VariantVersion2,
		VariantVersion3,
		VariantVersion4,
		VariantVersion5,
		VariantVersion6,
		VariantVersion7,
		VariantVersion8
	) {
		"use strict";

		QUnit.module("VariantController", {
			beforeEach: function () {
				this.oController = new VariantController(ComponentStub, {});
			}
		});

		QUnit.test("Migrate Version 1 to Current", function (assert) {
			fnAssertVariantMigration(VariantVersion1, assert, this.oController);
		});

		QUnit.test("Migrate Version 2 to Current", function (assert) {
			fnAssertVariantMigration(VariantVersion2, assert, this.oController);
		});

		QUnit.test("Migrate Version 3 to Current", function (assert) {
			fnAssertVariantMigration(VariantVersion3, assert, this.oController);
		});

		QUnit.test("Migrate Version 4 to Current", function (assert) {
			fnAssertVariantMigration(VariantVersion4, assert, this.oController);
		});

		QUnit.test("Migrate Version 5 to Current", function (assert) {
			fnAssertVariantMigration(VariantVersion5, assert, this.oController);
		});

		QUnit.test("Migrate Version 6 to Current", function (assert) {
			fnAssertVariantMigration(VariantVersion6, assert, this.oController);
		});

		QUnit.test("Migrate Version 7 to Current", function (assert) {
			fnAssertVariantMigration(VariantVersion7, assert, this.oController);
		});

		QUnit.test("Migrate Version 8 to Current", function (assert) {
			fnAssertVariantMigration(VariantVersion8, assert, this.oController);
		});

		QUnit.test("Migrate Current to Current", function (assert) {
			fnAssertVariantMigration(StandardVariant, assert, this.oController);
		});

		var fnAssertVariantMigration = function (oVariantVersion, assert, oController) {
			// Migrating to Standard Variant
			let oMigrated = oController._migrateVariant(oVariantVersion);
			assert.equal(oMigrated.version, StandardVariant.version, "Migrated variant has version of standard variant");
			// Asserting View
			assert.equal(oMigrated.view, StandardVariant.view, "Migrated variant has version of standard variant");
			// Asserting Sort order and property
			assert.equal(oMigrated.sortOrder, StandardVariant.sortOrder, "Migrated variant has sortOrder of standard variant");
			assert.equal(oMigrated.sortProperty, StandardVariant.sortProperty, "Migrated variant has sortProperty of standard variant");
			// Asserting timeperiod and default selections properties
			assert.equal(
				oMigrated.timePeriod.operator,
				StandardVariant.timePeriod.operator,
				"Migrated variant has default timeperiod operator of standard variant"
			);
			assert.equal(
				oMigrated.timePeriod.values[0],
				StandardVariant.timePeriod.values[0],
				"Migrated variant has default timeperiod values of standard variant"
			);
			assert.equal(oMigrated.timePeriod.fromDate, StandardVariant.timePeriod.fromDate, "Migrated variant has default fromDate of standard variant");
			assert.equal(oMigrated.timePeriod.toDate, StandardVariant.timePeriod.toDate, "Migrated variant has default toDate of standard variant");
			// Asserting default empty filters
			assert.equal(
				oMigrated.filters.resourceOrgs.length,
				StandardVariant.filters.resourceOrgs.length,
				"Migrated variant has resourceOrgs filters of standard variant"
			);
			assert.equal(oMigrated.filters.deliveryOrgs, undefined, "Migrated variant doesn't have deliveryOrgs filters");

			assert.equal(
				oMigrated.filters.costCenters.length,
				StandardVariant.filters.costCenters.length,
				"Migrated variant has costCenters filters of standard variant"
			);
			assert.equal(
				oMigrated.filters.projects.length,
				StandardVariant.filters.projects.length,
				"Migrated variant has projects filters of standard variant"
			);
			assert.equal(
				oMigrated.filters.customers.length,
				StandardVariant.filters.customers.length,
				"Migrated variant has customers filters of standard variant"
			);
			assert.equal(
				oMigrated.filters.projectRoles.length,
				StandardVariant.filters.projectRoles.length,
				"Migrated variant has projectRoles filters of standard variant"
			);
			assert.equal(
				oMigrated.filters.requests.length,
				StandardVariant.filters.requests.length,
				"Migrated variant has requests filters of standard variant"
			);
			assert.equal(
				oMigrated.filters.workerTypes.length,
				StandardVariant.filters.workerTypes.length,
				"Migrated variant has workerTypes filters of standard variant"
			);
			assert.equal(
				oMigrated.filters.referenceObject.length,
				StandardVariant.filters.referenceObject.length,
				"Migrated variant has referenceObject filters of standard variant"
			);
			assert.equal(
				oMigrated.filters.referenceObjectType.length,
				StandardVariant.filters.referenceObjectType.length,
				"Migrated variant has referenceObjectType filters of standard variant"
			);
			assert.equal(
				oMigrated.filters.utilizations.length,
				StandardVariant.filters.utilizations.length,
				"Migrated variant has utilizations filters of standard variant"
			);
			assert.equal(
				oMigrated.filters.minFreeHours.length,
				StandardVariant.filters.minFreeHours.length,
				"Migrated variant has minFreeHours filters of standard variant"
			);

			//Asserting FilterPanel expanded or collapsed state
			assert.equal(
				oMigrated.filterPanelExpandState.ResourceFilterPanel,
				StandardVariant.filterPanelExpandState.ResourceFilterPanel,
				"Migrated variant has same organization filter panel state (expanded or collapsed) of standard variant"
			);
			assert.equal(
				oMigrated.filterPanelExpandState.UtilizationFilterPanel,
				StandardVariant.filterPanelExpandState.UtilizationFilterPanel,
				"Migrated variant has same utilization filter panel state (expanded or collapsed) of standard variant"
			);
			assert.equal(
				oMigrated.filterPanelExpandState.RequestFilterPanel,
				StandardVariant.filterPanelExpandState.RequestFilterPanel,
				"Migrated variant has same Request filter panel state (expanded or collapsed) of standard variant"
			);

			// Asserting default column width
			assert.equal(oMigrated.nameColumnWidth, StandardVariant.nameColumnWidth, "Migrated variant has nameColumnWidth of standard variant");
			// Asserting Newly Added conlumn Config with version 2 and Asserting each Column Properties

			//Resource Org Column
			assert.equal(
				oMigrated.columns[0].columnKey,
				StandardVariant.columns[0].columnKey,
				"Migrated variant has Resource Org Column  of standard variant"
			);
			assert.equal(
				oMigrated.columns[0].visible,
				StandardVariant.columns[0].visible,
				"Migrated variant has Resource Org Column visible property  of standard variant"
			);
			assert.equal(
				oMigrated.columns[0].index,
				StandardVariant.columns[0].index,
				"Migrated variant has Resource Org Column index  of standard variant"
			);
			assert.equal(
				oMigrated.columns[0].width,
				StandardVariant.columns[0].width,
				"Migrated variant has Resource Org Column width of standard variant"
			);
			//costCenter Column
			assert.equal(
				oMigrated.columns[1].columnKey,
				StandardVariant.columns[1].columnKey,
				"Migrated variant has costCenter Column  of standard variant"
			);
			assert.equal(
				oMigrated.columns[1].visible,
				StandardVariant.columns[1].visible,
				"Migrated variant has costCenter Column visible property  of standard variant"
			);
			assert.equal(oMigrated.columns[1].index, StandardVariant.columns[1].index, "Migrated variant has costCenter Column index  of standard variant");
			assert.equal(oMigrated.columns[1].width, StandardVariant.columns[1].width, "Migrated variant has costCenter Column width of standard variant");

			//staffingSummary
			assert.equal(
				oMigrated.columns[2].columnKey,
				StandardVariant.columns[2].columnKey,
				"Migrated variant has staffingSummary Column  of standard variant"
			);
			assert.equal(
				oMigrated.columns[2].visible,
				StandardVariant.columns[2].visible,
				"Migrated variant has staffingSummary Column visible property  of standard variant"
			);
			assert.equal(
				oMigrated.columns[2].index,
				StandardVariant.columns[2].index,
				"Migrated variant has staffingSummary Column index  of standard variant"
			);
			assert.equal(
				oMigrated.columns[2].width,
				StandardVariant.columns[2].width,
				"Migrated variant has staffingSummary Column width of standard variant"
			);
			//staffingHrs
			assert.equal(
				oMigrated.columns[3].columnKey,
				StandardVariant.columns[3].columnKey,
				"Migrated variant has staffingHrs Column  of standard variant"
			);
			assert.equal(
				oMigrated.columns[3].visible,
				StandardVariant.columns[3].visible,
				"Migrated variant has staffingHrs Column visible property  of standard variant"
			);
			assert.equal(
				oMigrated.columns[3].index,
				StandardVariant.columns[3].index,
				"Migrated variant has staffingHrs Column index  of standard variant"
			);
			assert.equal(oMigrated.columns[3].width, StandardVariant.columns[3].width, "Migrated variant has staffingHrs Column width of standard variant");
			//assignmentStatus
			assert.equal(
				oMigrated.columns[4].columnKey,
				StandardVariant.columns[4].columnKey,
				"Migrated variant has assignmentStatus Column  of standard variant"
			);
			assert.equal(
				oMigrated.columns[4].visible,
				StandardVariant.columns[4].visible,
				"Migrated variant has assignmentStatus Column visible property  of standard variant"
			);
			assert.equal(
				oMigrated.columns[4].index,
				StandardVariant.columns[4].index,
				"Migrated variant has assignmentStatus Column index  of standard variant"
			);
			assert.equal(
				oMigrated.columns[4].width,
				StandardVariant.columns[4].width,
				"Migrated variant has assignmentStatus Column width of standard variant"
			);

			//projectName
			assert.equal(
				oMigrated.columns[5].columnKey,
				StandardVariant.columns[5].columnKey,
				"Migrated variant has projectName Column  of standard variant"
			);
			assert.equal(
				oMigrated.columns[5].visible,
				StandardVariant.columns[5].visible,
				"Migrated variant has projectName Column visible property  of standard variant"
			);
			assert.equal(
				oMigrated.columns[5].index,
				StandardVariant.columns[5].index,
				"Migrated variant has projectName Column index  of standard variant"
			);
			assert.equal(oMigrated.columns[5].width, StandardVariant.columns[5].width, "Migrated variant has projectName Column width of standard variant");

			//customerName
			assert.equal(
				oMigrated.columns[6].columnKey,
				StandardVariant.columns[6].columnKey,
				"Migrated variant has customerName Column  of standard variant"
			);
			assert.equal(
				oMigrated.columns[6].visible,
				StandardVariant.columns[6].visible,
				"Migrated variant has customerName Column visible property  of standard variant"
			);
			assert.equal(
				oMigrated.columns[6].index,
				StandardVariant.columns[6].index,
				"Migrated variant has customerName Column index  of standard variant"
			);
			assert.equal(
				oMigrated.columns[6].width,
				StandardVariant.columns[6].width,
				"Migrated variant has customerName Column width of standard variant"
			);

			//projectRoleName
			assert.equal(
				oMigrated.columns[7].columnKey,
				StandardVariant.columns[7].columnKey,
				"Migrated variant has projectRoleName Column  of standard variant"
			);
			assert.equal(
				oMigrated.columns[7].visible,
				StandardVariant.columns[7].visible,
				"Migrated variant has projectRoleName Column visible property  of standard variant"
			);
			assert.equal(
				oMigrated.columns[7].index,
				StandardVariant.columns[7].index,
				"Migrated variant has projectRoleName Column index  of standard variant"
			);
			assert.equal(
				oMigrated.columns[7].width,
				StandardVariant.columns[7].width,
				"Migrated variant has projectRoleName Column width of standard variant"
			);

			//requestName
			assert.equal(
				oMigrated.columns[8].columnKey,
				StandardVariant.columns[8].columnKey,
				"Migrated variant has requestName Column  of standard variant"
			);
			assert.equal(
				oMigrated.columns[8].visible,
				StandardVariant.columns[8].visible,
				"Migrated variant has requestName Column visible property  of standard variant"
			);
			assert.equal(
				oMigrated.columns[8].index,
				StandardVariant.columns[8].index,
				"Migrated variant has requestName Column index  of standard variant"
			);
			assert.equal(oMigrated.columns[8].width, StandardVariant.columns[8].width, "Migrated variant has requestName Column width of standard variant");

			//workerType
			assert.equal(
				oMigrated.columns[9].columnKey,
				StandardVariant.columns[9].columnKey,
				"Migrated variant has workerType Column  of standard variant"
			);
			assert.equal(
				oMigrated.columns[9].visible,
				StandardVariant.columns[9].visible,
				"Migrated variant has workerType Column visible property  of standard variant"
			);
			assert.equal(oMigrated.columns[9].index, StandardVariant.columns[9].index, "Migrated variant has workerType Column index  of standard variant");
			assert.equal(oMigrated.columns[9].width, StandardVariant.columns[9].width, "Migrated variant has workerType Column width of standard variant");
			//Request Status Column
			assert.equal(
				oMigrated.columns[10].columnKey,
				StandardVariant.columns[10].columnKey,
				"Migrated variant has Request Status Column  of standard variant"
			);
			assert.equal(
				oMigrated.columns[10].visible,
				StandardVariant.columns[10].visible,
				"Migrated variant has Request Status Column visible property  of standard variant"
			);
			assert.equal(
				oMigrated.columns[10].index,
				StandardVariant.columns[10].index,
				"Migrated variant hasRequest Status Column index  of standard variant"
			);
			assert.equal(
				oMigrated.columns[10].width,
				StandardVariant.columns[10].width,
				"Migrated variant has Request Status Column width of standard variant"
			);
			//Work Item Column
			assert.equal(
				oMigrated.columns[11].columnKey,
				StandardVariant.columns[11].columnKey,
				"Migrated variant has Work Item Column  of standard variant"
			);
			assert.equal(
				oMigrated.columns[11].visible,
				StandardVariant.columns[11].visible,
				"Migrated variant has Work Item Column visible property  of standard variant"
			);
			assert.equal(
				oMigrated.columns[11].index,
				StandardVariant.columns[11].index,
				"Migrated variant hasRequest Status Column index  of standard variant"
			);
			assert.equal(oMigrated.columns[11].width, StandardVariant.columns[11].width, "Migrated variant has Work Item Column width of standard variant");

			// Reference Object
			assert.equal(
				oMigrated.columns[12].columnKey,
				StandardVariant.columns[12].columnKey,
				"Migrated variant has Reference Object Column  of standard variant"
			);
			assert.equal(
				oMigrated.columns[12].visible,
				StandardVariant.columns[12].visible,
				"Migrated variant has Reference Object Column visible property  of standard variant"
			);
			assert.equal(
				oMigrated.columns[12].index,
				StandardVariant.columns[12].index,
				"Migrated variant has Reference Object Column index  of standard variant"
			);
			assert.equal(
				oMigrated.columns[12].width,
				StandardVariant.columns[12].width,
				"Migrated variant has Reference Object Column width of standard variant"
			);

			// Reference Object Type
			assert.equal(
				oMigrated.columns[13].columnKey,
				StandardVariant.columns[13].columnKey,
				"Migrated variant has Reference Object Type Column  of standard variant"
			);
			assert.equal(
				oMigrated.columns[13].visible,
				StandardVariant.columns[13].visible,
				"Migrated variant has Reference Object Type Column visible property  of standard variant"
			);
			assert.equal(
				oMigrated.columns[13].index,
				StandardVariant.columns[13].index,
				"Migrated variant has Reference Object Type Column index  of standard variant"
			);
			assert.equal(
				oMigrated.columns[13].width,
				StandardVariant.columns[13].width,
				"Migrated variant has Reference Object Type Column width of standard variant"
			);
		};
	}
);
