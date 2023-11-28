sap.ui.define(
	["sap/ui/test/Opa5", "sap/ui/test/OpaBuilder", "sap/ui/test/actions/Press", "sap/ui/test/actions/EnterText", "sap/ui/test/matchers/Properties"],
	function (Opa5, OpaBuilder, Press, EnterText, Properties) {
		"use strict";

		var sViewName = "view.filter.FilterBar";

		var fnInputTokensToKeys = function (oInput) {
			var aTokens = oInput.getTokens();
			var aKeys = [];
			for (var i = 0; i < aTokens.length; i++) {
				aKeys.push(aTokens[i].getKey());
			}
			return aKeys;
		};

		Opa5.createPageObjects({
			onTheFilter: {
				actions: {
					pressGoButton: function () {
						var sMsg = "When.onTheFilter.pressGoButton()";
						return this.waitFor({
							viewName: sViewName,
							id: "idGoButton",
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressResetButton: function () {
						var sMsg = "When.onTheFilter.pressResetButton()";
						return this.waitFor({
							viewName: sViewName,
							id: "idResetButton",
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressCloseButton: function () {
						var sMsg = "When.onTheFilter.pressCloseButton()";
						return this.waitFor({
							viewName: sViewName,
							id: "idCloseButton",
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					enterResourceOrg: function (sResourceOrg) {
						var sMsg = "When.onTheFilter.enterResourceOrg(" + sResourceOrg + ")";
						return this.waitFor({
							id: "idResourceOrg",
							viewName: sViewName,
							actions: new EnterText({
								text: sResourceOrg,
								clearTextFirst: true,
								pressEnterKey: true
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					enterResourceName: function (sName) {
						var sMsg = "When.onTheFilter.enterResourceName(" + sName + ")";
						return this.waitFor({
							id: "idResourceNameFilter",
							viewName: sViewName,
							actions: new EnterText({
								text: sName,
								pressEnterKey: true
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					enterCostCenter: function (sCostCenter) {
						var sMsg = "When.onTheFilter.enterCostCenter(" + sCostCenter + ")";
						return this.waitFor({
							id: "idResourceCostCenterFilter",
							viewName: sViewName,
							actions: new EnterText({
								text: sCostCenter,
								clearTextFirst: true,
								pressEnterKey: true
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					enterProject: function (sProject) {
						let sMsg = "When.onTheFilter.enterProject(" + sProject + ")";
						return this.waitFor({
							id: "idProjectFilter",
							viewName: sViewName,
							actions: new EnterText({
								text: sProject,
								clearTextFirst: true,
								pressEnterKey: true
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					enterCustomer: function (sCustomer) {
						let sMsg = "When.onTheFilter.enterCustomer(" + sCustomer + ")";
						return this.waitFor({
							id: "idCustomerFilter",
							viewName: sViewName,
							actions: new EnterText({
								text: sCustomer,
								clearTextFirst: true,
								pressEnterKey: true
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					enterProjectRole: function (sProjectRole) {
						let sMsg = "When.onTheFilter.enterProjectRole(" + sProjectRole + ")";
						return this.waitFor({
							id: "idProjectRoleFilter",
							viewName: sViewName,
							actions: new EnterText({
								text: sProjectRole,
								clearTextFirst: true,
								pressEnterKey: true
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					enterWorkerType: function (sWorkerType) {
						let sMsg = "When.onTheFilter.enterWorkerType(" + sWorkerType + ")";
						return this.waitFor({
							id: "idWorkerTypeFilter",
							viewName: sViewName,
							actions: new EnterText({
								text: sWorkerType,
								clearTextFirst: true,
								pressEnterKey: true
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					enterRequest: function (sRequest) {
						let sMsg = "When.onTheFilter.enterRequest(" + sRequest + ")";
						return this.waitFor({
							id: "idRequestFilter",
							viewName: sViewName,
							actions: new EnterText({
								text: sRequest,
								clearTextFirst: true,
								pressEnterKey: true
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					enterReferenceObject: function (sReferenceObject) {
						let sMsg = "When.onTheFilter.enterReferenceObject(" + sReferenceObject + ")";
						return this.waitFor({
							id: "idReferenceObjectFilter",
							viewName: sViewName,
							actions: new EnterText({
								text: sReferenceObject,
								clearTextFirst: true,
								pressEnterKey: true
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					enterReferenceObjectType: function (sReferenceObjectType) {
						let sMsg = "When.onTheFilter.enterReferenceObjectType(" + sReferenceObjectType + ")";
						return this.waitFor({
							id: "idReferenceObjectTypeFilter",
							viewName: sViewName,
							actions: new EnterText({
								text: sReferenceObjectType,
								clearTextFirst: true,
								pressEnterKey: true
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					selectFromValueHelp: function (sPath, sPropertyPath) {
						var sMsg = "When.onTheFilter.selectFromValueHelp(" + sPath + "," + sPropertyPath + ")";
						return this.waitFor({
							controlType: "sap.m.Text",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: sPropertyPath,
								modelName: "oDataV4"
							},
							searchOpenDialogs: true,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					selectUtilization: function (iIndex) {
						var sMsg = "When.onTheFilter.selectUtilization(Index - " + iIndex + ")";
						return this.waitFor({
							controlType: "sap.m.CheckBox",
							viewName: sViewName,
							properties: {
								editable: true
							},
							ancestor: {
								controlType: "sap.m.CustomListItem",
								viewName: sViewName,
								bindingPath: {
									modelName: "filter",
									path: "/UtilizationFilterRanges/" + iIndex
								},
								ancestor: {
									id: "UtilizationRangeFilterList",
									viewName: sViewName
								}
							},
							actions: new Press({
								idSuffix: "CbBg"
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					expandOrCollapseResourceFilterPanel: function () {
						var sMsg = "When.onTheFilter.expandOrCollapseResourceFilterPanel()";
						return this.waitFor({
							id: "idResourceFilterPanel-expandButton",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					expandOrCollapseUtilizationFilterPanel: function () {
						var sMsg = "When.onTheFilter.expandOrCollapseUtilizationFilterPanel()";
						return this.waitFor({
							id: "idUtilizationFilterPanel-expandButton",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					expandOrCollapseRequestFilterPanel: function () {
						var sMsg = "When.onTheFilter.expandOrCollapseRequestFilterPanel()";
						return this.waitFor({
							id: "idRequestFilterPanel-expandButton",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					enterMinFreeHour: function (sMinFreeHour) {
						var sMsg = "When.onTheFilter.enterMinFreeHour(" + sMinFreeHour + ")";
						return this.waitFor({
							id: "idMinFreeHours",
							viewName: sViewName,
							actions: new EnterText({
								text: sMinFreeHour,
								clearTextFirst: true
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					}
				},
				assertions: {
					theNameTokensAre: function (aTokens) {
						var sMsg = "Then.onTheFilter.theNameTokensAre(" + aTokens + ")";
						return this.waitFor({
							id: "idResourceNameFilter",
							viewName: sViewName,
							success: function (oInput) {
								var aKeys = fnInputTokensToKeys(oInput);
								Opa5.assert.equal("" + aKeys, "" + aTokens, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theResourceFilterPanelIsExpanded: function (bExpand) {
						var sMsg = "Then.onTheFilter.theResourceFilterPanelIsExpanded()";
						return this.waitFor({
							id: "idResourceFilterPanel",
							viewName: sViewName,
							success: function (vControls) {
								var oControl = vControls[0] || vControls;
								Opa5.assert.equal(oControl.getExpanded(), bExpand);
							},
							errorMessage: sMsg
						});
					},
					theUtilizationFilterPanelIsExpanded: function (bExpand) {
						var sMsg = "Then.onTheFilter.theUtilizationFilterPanelIsExpanded()";
						return this.waitFor({
							id: "idUtilizationFilterPanel",
							viewName: sViewName,
							success: function (vControls) {
								var oControl = vControls[0] || vControls;
								Opa5.assert.equal(oControl.getExpanded(), bExpand);
							},
							errorMessage: sMsg
						});
					},
					theRequestFilterPanelIsExpanded: function (bExpand) {
						var sMsg = "Then.onTheFilter.theRequestFilterPanelIsExpanded()";
						return this.waitFor({
							id: "idRequestFilterPanel",
							viewName: sViewName,
							success: function (vControls) {
								var oControl = vControls[0] || vControls;
								Opa5.assert.equal(oControl.getExpanded(), bExpand);
							},
							errorMessage: sMsg
						});
					},
					theCostCenterTokensAre: function (aTokens) {
						var sMsg = "Then.onTheFilter.theCostCenterTokensAre(" + aTokens + ")";
						return this.waitFor({
							id: "idResourceCostCenterFilter",
							viewName: sViewName,
							success: function (oInput) {
								var aKeys = fnInputTokensToKeys(oInput);
								Opa5.assert.equal("" + aKeys, "" + aTokens, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theResourceOrgKeysAre: function (aKeys) {
						var sMsg = "Then.onTheFilter.theResourceOrgKeysAre(" + aKeys + ")";
						return this.waitFor({
							id: "idResourceOrg",
							viewName: sViewName,
							success: function (oMultiComboBox) {
								Opa5.assert.equal("" + oMultiComboBox.getSelectedKeys(), "" + aKeys, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theProjectTokensAre: function (aTokens) {
						var sMsg = "Then.onTheFilter.theProjectTokensAre(" + aTokens + ")";
						return this.waitFor({
							id: "idProjectFilter",
							viewName: sViewName,
							success: function (oInput) {
								var aKeys = fnInputTokensToKeys(oInput);
								Opa5.assert.equal("" + aKeys, "" + aTokens, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theCustomerTokensAre: function (aTokens) {
						var sMsg = "Then.onTheFilter.theCustomerTokensAre(" + aTokens + ")";
						return this.waitFor({
							id: "idCustomerFilter",
							viewName: sViewName,
							success: function (oInput) {
								var aKeys = fnInputTokensToKeys(oInput);
								Opa5.assert.equal("" + aKeys, "" + aTokens, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theProjectRoleKeysAre: function (aKeys) {
						var sMsg = "Then.onTheFilter.theProjectRoleKeysAre(" + aKeys + ")";
						return this.waitFor({
							id: "idProjectRoleFilter",
							viewName: sViewName,
							success: function (oMultiComboBox) {
								Opa5.assert.equal("" + oMultiComboBox.getSelectedKeys(), "" + aKeys, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theRequestTokensAre: function (aTokens) {
						var sMsg = "Then.onTheFilter.theRequestTokensAre(" + aTokens + ")";
						return this.waitFor({
							id: "idRequestFilter",
							viewName: sViewName,
							success: function (oInput) {
								var aKeys = fnInputTokensToKeys(oInput);
								Opa5.assert.equal("" + aKeys, "" + aTokens, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theReferenceObjectTokensAre: function (aTokens) {
						var sMsg = "Then.onTheFilter.theReferenceObjectTokensAre(" + aTokens + ")";
						return this.waitFor({
							id: "idReferenceObjectFilter",
							viewName: sViewName,
							success: function (oInput) {
								var aKeys = fnInputTokensToKeys(oInput);
								Opa5.assert.equal("" + aKeys, "" + aTokens, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theReferenceObjectTypeKeysAre: function (aKeys) {
						var sMsg = "Then.onTheFilter.theReferenceObjectTypeKeysAre(" + aKeys + ")";
						return this.waitFor({
							id: "idReferenceObjectTypeFilter",
							viewName: sViewName,
							success: function (oMultiComboBox) {
								Opa5.assert.equal("" + oMultiComboBox.getSelectedKeys(), "" + aKeys, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theUtilizationIsSelected: function (iIndex, bSelected) {
						var sMsg = "Then.onTheFilter.theUtilizationIsSelected(Index - " + iIndex + ")";
						return this.waitFor({
							controlType: "sap.m.CheckBox",
							viewName: sViewName,
							properties: {
								editable: true
							},
							ancestor: {
								controlType: "sap.m.CustomListItem",
								viewName: sViewName,
								bindingPath: {
									modelName: "filter",
									path: "/UtilizationFilterRanges/" + iIndex
								},
								ancestor: {
									id: "UtilizationRangeFilterList",
									viewName: sViewName
								}
							},
							success: function (aCheckBoxes) {
								Opa5.assert.equal(aCheckBoxes[0].getSelected(), bSelected, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theMinFreeHoursAre: function (sHours) {
						var sMsg = "Then.onTheFilter.theMinFreeHoursAre(" + sHours + ")";
						return this.waitFor({
							id: "idMinFreeHours",
							viewName: sViewName,
							success: function (oInput) {
								Opa5.assert.equal(oInput.getValue(), sHours, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theResourceOrgHasItems: function (iCount) {
						var sMsg = "Then.onTheFilter.theResourceOrgHasItems(" + iCount + ")";
						return this.waitFor({
							id: "idResourceOrg",
							viewName: sViewName,
							success: function (oMultiComboBox) {
								var DropDownRowCount = oMultiComboBox.getItems().length;
								Opa5.assert.equal(DropDownRowCount, iCount, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theResourceNameHasTokens: function (iCount) {
						var sMsg = "Then.onTheFilter.theResourceNameHasTokens(" + iCount + ")";
						return this.waitFor({
							id: "idResourceNameFilter",
							viewName: sViewName,
							success: function (oMultiInput) {
								Opa5.assert.equal(oMultiInput.getTokens().length, iCount, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theResourceNameHasError: function (bError) {
						let sMsg = "Then.onTheFilter.theResourceNameHasError(" + bError + ")";
						return this.waitFor({
							id: "idResourceNameFilter",
							viewName: sViewName,
							success: function (oInput) {
								Opa5.assert.equal(oInput.getValueState() === "Error", bError, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theFreeHoursHasError: function (bError) {
						var sMsg = "Then.onTheFilter.theFreeHoursHasError(" + bError + ")";
						return this.waitFor({
							id: "idMinFreeHours",
							viewName: sViewName,
							success: function (oInput) {
								Opa5.assert.equal(oInput.getValueState() === "Error", bError, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theResourceOrgHasTokens: function (iCount) {
						var sMsg = "Then.onTheFilter.theResourceOrgHasTokens(" + iCount + ")";
						return this.waitFor({
							id: "idResourceOrg",
							viewName: sViewName,
							success: function (oMultiComboBox) {
								Opa5.assert.equal(oMultiComboBox.getSelectedKeys().length, iCount, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theCostCenterHasTokens: function (iCount) {
						var sMsg = "Then.onTheFilter.theCostCenterHasTokens(" + iCount + ")";
						return this.waitFor({
							id: "idResourceCostCenterFilter",
							viewName: sViewName,
							success: function (oMultiInput) {
								Opa5.assert.equal(oMultiInput.getTokens().length, iCount, sMsg);
							},
							errorMessage: sMsg
						});
					}
				}
			}
		});
	}
);