sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "sap/base/util/deepClone"], function (Opa5, OpaBuilder, deepClone) {
	"use strict";

	var sViewName = "view.variant.Variant";

	Opa5.createPageObjects({
		onTheVariant: {
			actions: {
				saveTestVariant1: function () {
					let sMsg = "When.onTheVariant.saveTestVariant1()";
					return this.waitFor({
						id: "variantManagement",
						viewName: sViewName,
						success: function (oVarMgmt) {
							oVarMgmt.getParent().getController().testSave1();
							Opa5.assert.ok(true, sMsg);
						},
						errorMessage: sMsg
					});
				},
				selectStandardVariant: function () {
					let sMsg = "When.onTheVariant.selectStandardVariant()";
					return this.waitFor({
						id: "variantManagement",
						viewName: sViewName,
						success: function (oVarMgmt) {
							oVarMgmt.getParent().getController().testSelectStandard();
							Opa5.assert.ok(true, sMsg);
						},
						errorMessage: sMsg
					});
				},
				selectTestVariant1: function () {
					let sMsg = "When.onTheVariant.selectTestVariant1()";
					return this.waitFor({
						id: "variantManagement",
						viewName: sViewName,
						success: function (oVarMgmt) {
							oVarMgmt.getParent().getController().testSelect1();
							Opa5.assert.ok(true, sMsg);
						},
						errorMessage: sMsg
					});
				},
				changeNameColumnWidth: function (sWidth) {
					let sMsg = "When.onTheVariant.changeNameColumnWidth(" + sWidth + ")";
					return this.waitFor({
						id: "variantManagement",
						viewName: sViewName,
						success: function (oVarMgmt) {
							let oController = oVarMgmt.getParent().getController();
							oController.changeVariant("nameColumnWidth", null, sWidth);
							Opa5.assert.ok(true, sMsg);
						},
						errorMessage: sMsg
					});
				},
				changeCostCenterColumnWidth: function (sWidth) {
					let sMsg = "When.onTheVariant.changeCostCenterColumnWidth(" + sWidth + ")";
					return this.waitFor({
						id: "variantManagement",
						viewName: sViewName,
						success: function (oVarMgmt) {
							let oController = oVarMgmt.getParent().getController();
							var aColumns = deepClone(oController.getVariant().columns);
							for (var i = 0; i < aColumns.length; i++) {
								var oColumn = aColumns[i];
								if (oColumn.columnKey === "costCenter") {
									oColumn.width = sWidth;
								}
							}
							oController.changeVariant("columns", null, aColumns);
							Opa5.assert.ok(true, sMsg);
						},
						errorMessage: sMsg
					});
				}
			},

			assertions: {
				theVariantManagementIsEnabled: function (bEnabled) {
					var sMsg = "Then.onTheVariant.theVariantManagementIsEnabled(" + bEnabled + ")";
					return this.waitFor({
						id: "variantManagement",
						viewName: sViewName,
						autoWait: false,
						success: function (oVariantMgmt) {
							Opa5.assert.equal(oVariantMgmt.getEnabled(), bEnabled, sMsg);
						},
						errorMessage: sMsg
					});
				},
				theCurrentVariantIsModified: function (bModified) {
					var sMsg = "Then.onTheVariant.theCurrentVariantIsModified(" + bModified + ")";
					return this.waitFor({
						id: "variantManagement",
						viewName: sViewName,
						success: function (oVariantMgmt) {
							Opa5.assert.equal(oVariantMgmt.currentVariantGetModified(), bModified, sMsg);
						},
						errorMessage: sMsg
					});
				}
			}
		}
	});
});