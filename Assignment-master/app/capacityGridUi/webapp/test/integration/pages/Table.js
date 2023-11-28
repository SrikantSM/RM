sap.ui.define(
	[
		"sap/ui/test/Opa5",
		"sap/ui/test/OpaBuilder",
		"sap/ui/test/actions/Press",
		"sap/ui/test/actions/EnterText",
		"sap/ui/test/matchers/Properties",
		"sap/ui/test/matchers/Ancestor",
		"capacityGridUi/view/table/TableCellFinder",
		"sap/ui/test/actions/Drag",
		"sap/ui/test/actions/Drop"
	],
	function (Opa5, OpaBuilder, Press, EnterText, Properties, Ancestor, TableCellFinder, Drag, Drop) {
		"use strict";

		var sViewName = "view.table.Table";
		var sComponentId = "application-capacity-Display-component";
		var sTableViewId = sComponentId + "---idPage--idTable--";

		Opa5.createPageObjects({
			onTheTable: {
				actions: {
					resizeColumn: function (sColumnId, sWidth) {
						sColumnId = sTableViewId + sColumnId;
						let sMsg = "When.onTheTable.resizeColumn(" + sColumnId + "," + sWidth + ")";
						return this.waitFor({
							id: sColumnId,
							success: function (oColumn) {
								oColumn.setWidth(sWidth);
								var oTable = oColumn.getParent();
								var oParams = {
									column: oColumn,
									width: sWidth
								};
								oTable.fireEvent("columnResize", oParams);
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressEditButton: function () {
						let sMsg = "When.onTheTable.pressEditButton()";
						return this.waitFor({
							id: "idBtnEdit",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressPersoButton: function () {
						let sMsg = "When.onTheTable.pressPersoButton()";
						return this.waitFor({
							controlType: "sap.m.Button",
							viewName: sViewName,
							id: "idBtnPersonalization",
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressFilterButton: function () {
						let sMsg = "When.onTheTable.pressFilterButton()";
						return this.waitFor({
							controlType: "sap.m.ToggleButton",
							id: "idFilterToggleButton",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressInfoToolbar: function () {
						let sMsg = "When.onTheTable.pressInfoToolbar()";
						return this.waitFor({
							id: "idInfoToolbar",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressDiscardButton: function () {
						let sMsg = "When.onTheTable.pressDiscardButton()";
						return this.waitFor({
							id: "idBtnRevert",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					scrollToRow: function (iRow) {
						let sMsg = "When.onTheTable.scrollToRow(" + iRow + ")";
						return this.waitFor({
							id: "tblCapacity",
							controlType: "sap.ui.table.TreeTable",
							viewName: sViewName,
							success: function (oTreeTable) {
								oTreeTable.setFirstVisibleRow(iRow);
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressResourceNameLink: function (sName) {
						let sMsg = "When.onTheTable.pressResourceNameLink(" + sName + ")";
						return this.waitFor({
							controlType: "sap.m.Link",
							viewName: sViewName,
							properties: {
								text: sName
							},
							actions: new Press(),
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sViewName,
								id: "tblCapacity"
							},
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressDeletedResourceLink: function (sPath) {
						let sMsg = "When.onTheTable.pressDeletedResourceLink(" + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Link",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "requestName"
							},
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},

					dragAssignment: function (sPath) {
						let sMsg = "When.onTheTable.dragAssignment(" + sPath + ")";
						return this.waitFor({
							controlType: "sap.ui.table.Row",
							viewName: sViewName,
							bindingPath: {
								path: sPath
							},
							actions: new Drag(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},

					dropAssignment: function (sPath) {
						let sMsg = "When.onTheTable.dropAssignment(" + sPath + ")";
						return this.waitFor({
							controlType: "sap.ui.table.Row",
							viewName: sViewName,
							bindingPath: {
								path: sPath
							},
							actions: new Drop(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},

					sortColumn: function (sColumnId, sOrder) {
						sColumnId = sTableViewId + sColumnId;
						let sMsg = "When.onTheTable.sortColumn(" + sColumnId + "," + sOrder + ")";
						return this.waitFor({
							id: sColumnId,
							actions: new Press(),
							success: function () {
								let sMenuId = sOrder === "Descending" ? sColumnId + "-menu-desc" : sColumnId + "-menu-asc";
								this.waitFor({
									id: sMenuId,
									controlType: "sap.ui.unified.MenuItem",
									actions: new Press(),
									success: function () {
										Opa5.assert.ok(true, sMsg);
									},
									errorMessage: sMsg
								});
							},
							errorMessage: sMsg
						});
					},
					enterAssignmentHours: function (sText, sPath) {
						let sMsg = "When.onTheTable.enterAssignmentHours(" + sText + "," + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Input",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "bookedCapacity"
							},
							actions: new EnterText({
								idSuffix: "inner",
								text: sText,
								clearTextFirst: true,
								pressEnterKey: true
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressExpandArrowOfFirstResource: function (sSuffix) {
						let sMsg = "When.onTheTable.pressExpandArrowOfFirstResource()";
						return this.waitFor({
							id: "tblCapacity",
							viewName: sViewName,
							actions: new Press({
								idSuffix: sSuffix
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					selectRow: function (iNumber) {
						let sMsg = "When.onTheTable.selectRow(" + iNumber + ")";
						return this.waitFor({
							id: "tblCapacity",
							viewName: sViewName,
							actions: new Press({
								idSuffix: "rowsel" + iNumber
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressColumn: function (sColumnId) {
						sColumnId = sTableViewId + sColumnId;
						let sMsg = "When.onTheTable.pressColumn(" + sColumnId + ")";
						return this.waitFor({
							id: sColumnId,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					changeAssignStatus: function (sPath, sKey) {
						let sMsg = "When.onTheTable.changeAssignStatus(" + sPath + "," + sKey + ")";
						return this.waitFor({
							controlType: "sap.m.Select",
							actions: new Press(),
							viewName: sViewName,
							success: function (oSelect) {
								return this.waitFor({
									controlType: "sap.ui.core.Item",
									matchers: [new Properties({ key: sKey })],
									actions: new Press(),
									success: function () {
										Opa5.assert.ok(true, sMsg);
									},
									errorMessage: sMsg
								});
							},
							errorMessage: sMsg
						});
					},
					pressTableExportButton: function () {
						let sMsg = "When.onTheTable.pressTableExportButton()";
						return this.waitFor({
							id: "idBtnExcel",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressShowAllColumnsButton: function () {
						let sMsg = "When.onTheTable.pressShowAllColumnsButton()";
						return this.waitFor({
							controlType: "sap.m.Button",
							viewName: sViewName,
							actions: new Press(),
							properties: {
								icon: "sap-icon://show"
							},
							success: function (vControls) {
								var oControl = vControls[0] || vControls;
								Opa5.assert.ok(oControl.getEnabled());
							},
							errorMessage: sMsg
						});
					},
					pressHideLeadingColumnsButton: function () {
						let sMsg = "When.onTheTable.pressHideLeadingColumnsButton()";
						return this.waitFor({
							controlType: "sap.m.Button",
							viewName: sViewName,
							actions: new Press(),
							properties: {
								icon: "sap-icon://hide"
							},
							success: function (vControls) {
								var oControl = vControls[0] || vControls;
								Opa5.assert.ok(oControl.getEnabled());
							},
							errorMessage: sMsg
						});
					},
					pressAddAssignmentButton: function () {
						let sMsg = "Then.onTheTable.pressAddAssignmentButton()";
						return this.waitFor({
							id: "idBtnAddAssignment",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressDeleteAssignmentButton: function () {
						let sMsg = "Then.onTheTable.pressDeleteAssignmentButton()";
						return this.waitFor({
							id: "idBtnDeleteAssignment",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					enterRequest: function (sText, sPath) {
						let sMsg = "When.onTheTable.enterRequest(" + sText + "," + sPath + ")";
						return this.waitFor({
							controlType: "capacityGridUi.reuse.valuehelp.InputWithValueHelp",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "requestName"
							},
							actions: new EnterText({
								idSuffix: "inner",
								text: sText,
								clearTextFirst: true,
								pressEnterKey: true
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressRequestValueHelp: function (sPath) {
						let sMsg = "When.onTheTable.pressRequestValueHelp(" + sPath + ")";
						return this.waitFor({
							controlType: "capacityGridUi.reuse.valuehelp.InputWithValueHelp",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "requestName"
							},
							actions: new Press({ idSuffix: "vhi" }),
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sViewName,
								id: "tblCapacity"
							},
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressCopyAssignmentButton: function () {
						let sMsg = "Then.onTheTable.pressCopyAssignmentButton()";
						return this.waitFor({
							id: "idBtnCopyAssignment",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressCutAssignmentButton: function () {
						let sMsg = "Then.onTheTable.pressCutAssignmentButton()";
						return this.waitFor({
							id: "idBtnCutAssignment",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					pressPasteAssignmentButton: function () {
						let sMsg = "Then.onTheTable.pressPasteAssignmentButton()";
						return this.waitFor({
							id: "idBtnPasteAssignment",
							viewName: sViewName,
							actions: new Press(),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					openTheDropDownMenu: function () {
						let sMsg = "Then.onTheTable.openTheDropDownMenu()";
						return this.waitFor({
							id: "idEditStatus",
							viewName: sViewName,
							actions: new Press({
								idSuffix: "arrow"
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					filterEditedAssignments: function () {
						let sMsg = "Then.onTheTable.filterEditedAssignments()";
						return this.waitFor({
							controlType: "sap.ui.core.ListItem",
							viewId: "application-capacity-Display-component-capacityGridUi---idPage--idTable",
							i18NText: {
								propertyName: "text",
								key: "CHANGED"
							},
							searchOpenDialogs: true,
							actions: new Press(),
							errorMessage: sMsg
						});
					},
					pressDeselectButton: function () {
						let sMsg = "When.onTheTable.pressDeselectButton()";
						return this.waitFor({
							id: "tblCapacity",
							viewName: sViewName,
							actions: new Press({
								idSuffix: "selall"
							}),
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					}
				},
				assertions: {
					theTableIsVisible: function () {
						let sMsg = "Then.onTheTable.theTableIsVisible()";
						return this.waitFor({
							id: "tblCapacity",
							viewName: sViewName,
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theDropDownIsVisible: function () {
						let sMsg = "Then.onTheTable.theDropDownIsVisible()";
						return this.waitFor({
							id: "idEditingStatus",
							viewName: sViewName,
							success: function (vControls) {
								var oControl = vControls[0] || vControls;
								Opa5.assert.ok(oControl.getVisible());
							},
							errorMessage: sMsg
						});
					},
					theDropDownIsEnabled: function () {
						let sMsg = "Then.onTheTable.theDropDownIsEnabled()";
						return this.waitFor({
							id: "idEditStatus",
							viewName: sViewName,
							success: function (vControls) {
								var oControl = vControls[0] || vControls;
								Opa5.assert.ok(oControl.getEnabled());
							},
							errorMessage: sMsg
						});
					},
					theDiscardButtonIsEnabled: function (bEnabled) {
						let sMsg = "Then.onTheTable.theDiscardButtonIsEnabled(" + bEnabled + ")";
						return this.waitFor({
							id: "idBtnRevert",
							viewName: sViewName,
							autoWait: false,
							success: function (oButton) {
								Opa5.assert.equal(oButton.getEnabled(), bEnabled, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theTitleCountIs: function (iTotalCount) {
						let sMsg = "Then.onTheTable.theTitleCountIs(" + iTotalCount + ")";
						return this.waitFor({
							id: "idGridTitle",
							viewName: sViewName,
							success: function (oTitle) {
								let sRegEx = new RegExp(".*\\(" + iTotalCount + "\\)");
								Opa5.assert.matches(oTitle.getText(), sRegEx, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theTableIsNotEmpty: function () {
						let sMsg = "Then.onTheTable.theTableIsNotEmpty()";
						return this.waitFor({
							id: "tblCapacity",
							viewName: sViewName,
							success: function (oTreeTable) {
								var tableRowCount = oTreeTable.getRows().length;
								Opa5.assert.notStrictEqual(tableRowCount, 0, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theColumnsAre: function (aColumnIds) {
						let sMsg = "Then.onTheTable.theColumnsAre(" + aColumnIds + ")";
						return this.waitFor({
							controlType: "sap.ui.table.Column",
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sViewName,
								id: "tblCapacity"
							},
							success: function (aColumns) {
								var aActualColumnIds = [];
								for (var i = 0; i < aColumnIds.length; i++) {
									aColumnIds[i] = sTableViewId + aColumnIds[i];
									aActualColumnIds.push(aColumns[i].getId());
								}
								Opa5.assert.deepEqual(aActualColumnIds, aColumnIds, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theColumnHasWidth: function (sColumnId, sWidth) {
						sColumnId = sTableViewId + sColumnId;
						let sMsg = "Then.onTheTable.theColumnHasWidth(" + sColumnId + "," + sWidth + ")";
						return this.waitFor({
							id: sColumnId,
							success: function (oColumn) {
								Opa5.assert.equal(oColumn.getWidth(), sWidth, sMsg);
							},
							errorMessage: sMsg
						});
					},

					theAssignmentBookedCapacityIsEditable: function (sPath) {
						return this.waitFor({
							controlType: "sap.m.Input",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "bookedCapacity"
							},
							success: function (oInput) {
								Opa5.assert.ok(!oInput.editable);
							}
						});
					},
					theAssignmentBookedCapacityIs: function (sValue, sPath) {
						let sMsg = "Then.onTheTable.theAssignmentInputIs(" + sPath + "," + sValue + ")";
						return this.waitFor({
							controlType: "sap.m.Input",
							viewName: sViewName,
							visible: false,
							bindingPath: {
								path: sPath,
								propertyPath: "bookedCapacity"
							},
							success: function (aColumns) {
								var sCurrentValue = aColumns[0].getValue();
								Opa5.assert.equal(sCurrentValue, sValue, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentBookedCapacityValueStateTextIs: function (sPath, sMsgKey) {
						let sMsg = "Then.onTheTable.theAssignmentBookedCapacityValueStateTextIs(" + sPath + "," + sMsgKey + ")";
						return this.waitFor({
							controlType: "sap.m.Input",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "bookedCapacity"
							},
							success: function (aColumns) {
								let oBundle = aColumns[0].getModel("i18n").getResourceBundle();
								var sExpectedMsgTxt = oBundle.getText(sMsgKey);
								var sActualMsgTxt = aColumns[0].getValueStateText();
								Opa5.assert.equal(sActualMsgTxt, sExpectedMsgTxt, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentStaffedHoursIs: function (sText, sPath) {
						let sMsg = "Then.onTheTable.theAssignmentStaffedHoursIs(" + sText + ")";
						return this.waitFor({
							controlType: "sap.m.ProgressIndicator",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "staffedHoursText"
							},
							success: function (aTexts) {
								Opa5.assert.equal(aTexts[0].getDisplayValue(), sText, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theProgressBarPercentIs: function (iPercent, sPath) {
						let sMsg = "Then.onTheTable.theProgressBarPercentIs(" + iPercent + "%" + ")";
						return this.waitFor({
							controlType: "sap.m.ProgressIndicator",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "staffedHoursText"
							},
							success: function (aTexts) {
								Opa5.assert.equal(aTexts[0].getPercentValue(), iPercent, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentStatusIs: function (sText, sPath) {
						let sMsg = "Then.onTheTable.theAssignmentStatusIs(" + sText + "," + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Text",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "assignmentStatusText"
							},
							success: function (aObjectAttributes) {
								Opa5.assert.equal(aObjectAttributes[0].getText(), sText, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentDurationHoursIs: function (sHours, sPath) {
						let sMsg = "Then.onTheTable.theAssignmentDurationHoursIs(" + sHours + "," + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Text",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "assignmentDurationInHours"
							},
							success: function (aObjectAttributes) {
								Opa5.assert.equal(aObjectAttributes[0].getText(), sHours, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theResourceUtilizationIs: function (sValue, sPath) {
						let sMsg = "Then.onTheTable.theResourceUtilizationIs(" + sValue + "," + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.ObjectStatus",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "utilization"
							},
							success: function (aObjectStatuses) {
								let sText = aObjectStatuses[0].getText();
								Opa5.assert.equal(sText, sValue + " %", sMsg);
							},
							errorMessage: sMsg
						});
					},
					theResourceOrganitionNameForDisplay: function (sPath, sText) {
						let sMsg = "Then.onTheTable.theResourceOrganitionNameForDisplay(" + sPath + "," + sText + ")";
						return this.waitFor({
							controlType: "sap.m.Text",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "resourceOrganizationNameForDisplay"
							},
							success: function (vControls) {
								var oControl = vControls[0] || vControls;
								Opa5.assert.strictEqual(oControl.getText(), sText);
							},
							errorMessage: sMsg
						});
					},
					theFirstVisibleRowIs: function (sId, iRow) {
						sId = sTableViewId + sId;
						var sMsg = "Then.onTheTable.theFirstVisibleRowIs(" + sId + " " + iRow + ")";
						return this.waitFor({
							id: sId,
							success: function (oTable) {
								Opa5.assert.strictEqual(oTable.getFirstVisibleRow(), iRow, sMsg);
							},
							errorMessage: sMsg
						});
					},

					theResourceNameLinkIsVisible: function (sResourceName) {
						let sMsg = "Then.onTheTable.theResourceNameLinkIsVisible(" + sResourceName + ")";
						return this.waitFor({
							controlType: "sap.m.Link",
							viewName: sViewName,
							properties: {
								text: sResourceName
							},
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sViewName,
								id: "tblCapacity"
							},
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theColumnsCountIs: function (iCount) {
						let sMsg = "Then.onTheTable.theColumnsCountIs(" + iCount + ")";
						return this.waitFor({
							controlType: "sap.ui.table.Column",
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sViewName,
								id: "tblCapacity"
							},
							success: function (aColumns) {
								Opa5.assert.equal(aColumns.length, iCount, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theColumnIsSorted: function (sColumnId, sOrder) {
						sColumnId = sTableViewId + sColumnId;
						let sMsg = "Then.onTheTable.theColumnIsSorted(" + sColumnId + "," + sOrder + ")";
						return this.waitFor({
							id: sColumnId,
							success: function (oColumn) {
								Opa5.assert.equal(oColumn.getSorted() + "-" + oColumn.getSortOrder(), "true-" + sOrder, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theFilterButtonIsEnabled: function (bEnabled) {
						let sMsg = "Then.onTheTable.theFilterButtonIsEnabled(" + bEnabled + ")";
						return this.waitFor({
							id: "idFilterToggleButton",
							viewName: sViewName,
							autoWait: false,
							success: function (oButton) {
								Opa5.assert.equal(oButton.getEnabled(), bEnabled, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theRowsAreNotExpandable: function () {
						let sMsg = "Then.onTheTable.theRowsAreNotExpandable()";
						return this.waitFor({
							id: "tblCapacity",
							viewName: sViewName,
							success: function (oTreeTable) {
								var oRows = oTreeTable.getRows();
								oRows.forEach((row) => {
									if (row.isExpandable() === false) {
										return;
									}
								});
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theColumnMenuIsVisible: function () {
						let sMsg = "Then.onTheTable.theColumnMenuIsVisible()";
						return this.waitFor({
							controlType: "sap.ui.table.ColumnMenu",
							viewName: sViewName,
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentBookedCapacityValueStateIs: function (sPath, sValueState) {
						let sMsg = "Then.onTheTable.theAssignmentBookedCapacityValueStateIs(" + sPath + "," + sValueState + ")";
						return this.waitFor({
							controlType: "sap.m.Input",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "bookedCapacity"
							},
							success: function (aInputs) {
								var valueState = aInputs[0].getValueState();
								Opa5.assert.equal(valueState, sValueState, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theOverlayIsVisible: function (bValue) {
						let sMsg = "Then.onTheTable.theOverlayIsVisible(" + bValue + ")";
						return this.waitFor({
							id: "tblCapacity",
							viewName: sViewName,
							success: function (oTreeTable) {
								Opa5.assert.equal(oTreeTable.getShowOverlay(), bValue, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theInfoToolbarIsVisible: function (bValue) {
						let sMsg = "Then.onTheTable.theInfoToolbarIsVisible(" + bValue + ")";
						return this.waitFor({
							id: "idInfoToolbar",
							viewName: sViewName,
							visible: false,
							success: function (oToolbar) {
								Opa5.assert.equal(oToolbar.getVisible(), bValue, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theInfoTextMatches: function (sRegex) {
						let sMsg = "Then.onTheTable.theInfoTextMatches(" + sRegex + ")";
						return this.waitFor({
							id: "idFilterInfoText",
							viewName: sViewName,
							visible: false,
							success: function (oText) {
								Opa5.assert.matches(oText.getText(), sRegex, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentStatusIsEditable: function (sPath, bEditable) {
						let sMsg = "Then.onTheTable.theAssignmentStatusIsEditable(" + sPath + "," + bEditable + ")";
						this.waitFor({
							controlType: "sap.m.Select",
							bindingPath: {
								path: sPath,
								propertyPath: "assignmentStatusCode"
							},
							success: function (oSelect) {
								Opa5.assert.strictEqual(oSelect[0].getEditable(), bEditable, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentStatusSelectedKeyIs: function (sPath, sText) {
						let sMsg = "Then.onTheTable.theAssignmentStatusSelectedKeyIs(" + sPath + "," + sText + ")";
						this.waitFor({
							controlType: "sap.m.Select",
							bindingPath: {
								path: sPath,
								propertyPath: "assignmentStatusCode"
							},
							success: function (oSelect) {
								Opa5.assert.strictEqual(oSelect[0].getSelectedKey(), sText, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentValueStateIs: function (sPath, sText) {
						let sMsg = "Then.onTheTable.theAssignmentValueStateIs(" + sPath + "," + sText + ")";
						this.waitFor({
							controlType: "sap.m.Select",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "assignmentStatusCode"
							},
							success: function (oSelect) {
								Opa5.assert.strictEqual(oSelect[0].getValueState(), sText, sMsg);
							}
						});
					},
					theAssignmentStatusValueStateRawTextIs: function (sPath, sMsgText) {
						let sMsg = "Then.onTheTable.theAssignmentStatusValueStateRawTextIs(" + sPath + "," + sMsgText + ")";
						return this.waitFor({
							controlType: "sap.m.Select",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "assignmentStatusCode"
							},
							success: function (oSelect) {
								Opa5.assert.strictEqual(oSelect[0].getValueStateText(), sMsgText, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentStatusValueStateTextIs: function (sPath, sMsgKey) {
						let sMsg = "Then.onTheTable.theAssignmentStatusValueStateTextIs(" + sPath + "," + sMsgKey + ")";
						return this.waitFor({
							controlType: "sap.m.Select",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "assignmentStatusCode"
							},
							success: function (aSelect) {
								let oBundle = aSelect[0].getModel("i18n").getResourceBundle();
								var sExpectedMsgTxt = oBundle.getText(sMsgKey);
								var sActualMsgTxt = aSelect[0].getValueStateText();
								Opa5.assert.strictEqual(sActualMsgTxt, sExpectedMsgTxt, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignStatusTextIs: function (sPath, sText) {
						let sMsg = "Then.onTheTable.theAssignStatusTextIs(" + sPath + "," + sText + ")";
						this.waitFor({
							controlType: "sap.m.Text",
							bindingPath: {
								path: sPath,
								propertyPath: "assignmentStatusText"
							},
							success: function (oText) {
								Opa5.assert.strictEqual(oText[0].getText(), sText, sMsg);
							},
							errorMessage: sMsg
						});
					},
					// there is no UI5 API to read the row's highlight
					// as a workaround we check the model values used to format the row highlight
					theRowHighlightIs: function (sPath, sText) {
						let sMsg = "Then.onTheTable.theRowHighlightIs(" + sPath + "," + sText + ")";
						return this.waitFor({
							id: "tblCapacity",
							viewName: sViewName,
							success: function (oTable) {
								let oModel = oTable.getModel();
								let bError = oModel.getProperty(sPath + "/error");
								let bChanged = oModel.getProperty(sPath + "/changed");
								let bWarning = oModel.getProperty(sPath + "/warning");
								if (sText === "Error") {
									Opa5.assert.equal(bError, true, sMsg);
								} else if (sText === "Information") {
									Opa5.assert.equal(bError, false, sMsg);
									Opa5.assert.equal(bChanged, true, sMsg);
								} else if (sText === "Warning") {
									Opa5.assert.equal(bError, false, sMsg);
									Opa5.assert.equal(bWarning, true, sMsg);
								} else {
									Opa5.assert.equal(bError, false, sMsg);
									Opa5.assert.equal(bChanged, false, sMsg);
								}
							},
							errorMessage: sMsg
						});
					},
					theResourceAvgUtilizationTextIs: function (sPath, sText) {
						let sMsg = "Then.onTheTable.theResourceAvgUtilizationTextIs(" + sPath + "," + sText + ")";
						return this.waitFor({
							controlType: "sap.m.ObjectStatus",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "avgUtilization"
							},
							success: function (oObjStatus) {
								Opa5.assert.strictEqual(oObjStatus[0].getText(), sText, sMsg);
							}
						});
					},
					theResourceAvgUtilizationStateIs: function (sPath, sText) {
						let sMsg = "Then.onTheTable.theResourceAvgUtilizationStateIs(" + sPath + "," + sText + ")";
						return this.waitFor({
							controlType: "sap.m.ObjectStatus",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "avgUtilization"
							},
							success: function (oObjStatus) {
								Opa5.assert.strictEqual(oObjStatus[0].getState(), sText, sMsg);
							}
						});
					},
					theUtilFreeHoursIs: function (sHours, sPath) {
						let sMsg = "Then.onTheTable.theUtilFreeHoursIs(" + sHours + "," + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Text",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "freeHours"
							},
							success: function (oText) {
								let sRegEx = new RegExp("" + sHours + "\\ /.*");
								Opa5.assert.matches(oText[0].getText(), sRegEx, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theResourceUtilizationValueStateIs: function (sPath, sText) {
						let sMsg = "Then.onTheTable.theResourceUtilizationValueStateIs(" + sPath + "," + sText + ")";
						return this.waitFor({
							controlType: "sap.m.ObjectStatus",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "utilization"
							},
							success: function (aObjectStatuses) {
								Opa5.assert.equal(aObjectStatuses[0].getState(), sText, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theResourceCostCenterIs: function (sValue, sPath) {
						let sMsg = "Then.onTheTable.theResourceCostCenterIs(" + sValue + "," + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Text",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "costCenter"
							},
							success: function (aTextControls) {
								Opa5.assert.equal(aTextControls[0].getText(), sValue, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theRequestStatusIs: function (sValue, sPath) {
						let sMsg = "Then.onTheTable.theRequestStatusIs(" + sValue + "," + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Text",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "requestStatusDescription"
							},
							success: function (vControls) {
								var oControl = vControls[0] || vControls;
								Opa5.assert.strictEqual(oControl.getText(), sValue, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theworkItemNameIs: function (sValue, sPath) {
						let sMsg = "Then.onTheTable.theRequestStatusIs(" + sValue + "," + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Text",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "workItemName"
							},
							success: function (vControls) {
								var oControl = vControls[0] || vControls;
								Opa5.assert.strictEqual(oControl.getText(), sValue, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentCustomerIs: function (sValue, sPath) {
						let sMsg = "Then.onTheTable.theAssignmentCustomerIs(" + sValue + "," + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Text",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "customerName"
							},
							success: function (aTextControls) {
								Opa5.assert.equal(aTextControls[0].getText(), sValue, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentProjectIs: function (sValue, sPath) {
						let sMsg = "Then.onTheTable.theAssignmentProjectIs(" + sValue + "," + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Text",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "projectName"
							},
							success: function (aTextControls) {
								Opa5.assert.equal(aTextControls[0].getText(), sValue, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theFilteredRowIs: function (sPath) {
						let sMsg = "When.onTheTable.theFilteredRowIs(" + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Link",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "parent"
							},
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theNewlyAddedFilteredAssignmentIs: function (sPath) {
						let sMsg = "When.onTheTable.theFilteredAssignmentIs(" + sPath + ")";
						return this.waitFor({
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "child"
							},
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theFilteredAssignmentIs: function (sPath) {
						let sMsg = "When.onTheTable.theFilteredAssignmentIs(" + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Link",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "requestName"
							},
							success: function () {
								Opa5.assert.ok(true, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentProjectRoleIs: function (sValue, sPath) {
						let sMsg = "Then.onTheTable.theAssignmentProjectRoleIs(" + sValue + "," + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Text",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "projectRoleName"
							},
							success: function (aTextControls) {
								Opa5.assert.equal(aTextControls[0].getText(), sValue, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentRequestIs: function (sValue, sPath) {
						let sMsg = "Then.onTheTable.theAssignmentRequestIs(" + sValue + "," + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Text",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "requestName"
							},
							success: function (aTextControls) {
								Opa5.assert.equal(aTextControls[0].getText(), sValue, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentReferenceObjectIs: function (sValue, sPath) {
						let sMsg = "Then.onTheTable.theAssignmentReferenceObjectIs(" + sValue + "," + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Text",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "referenceObjectName"
							},
							success: function (aTextControls) {
								Opa5.assert.equal(aTextControls[0].getText(), sValue, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentReferenceObjectTypeIs: function (sValue, sPath) {
						let sMsg = "Then.onTheTable.theAssignmentReferenceObjectTypeIs(" + sValue + "," + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Text",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "referenceObjectTypeName"
							},
							success: function (aTextControls) {
								Opa5.assert.equal(aTextControls[0].getText(), sValue, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAddAssignmentButtonIsEnabled: function (bEnabled) {
						var sMsg = "Then.onTheTable.theAddAssignmentButtonIsEnabled(" + bEnabled + ")";
						return this.waitFor({
							id: "idBtnAddAssignment",
							viewName: sViewName,
							autoWait: false,
							success: function (oButton) {
								Opa5.assert.equal(oButton.getEnabled(), bEnabled, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theDeleteAssignmentButtonIsEnabled: function (bEnabled) {
						var sMsg = "Then.onTheTable.theDeleteAssignmentButtonIsEnabled(" + bEnabled + ")";
						return this.waitFor({
							id: "idBtnDeleteAssignment",
							viewName: sViewName,
							autoWait: false,
							success: function (oButton) {
								Opa5.assert.equal(oButton.getEnabled(), bEnabled, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theCopyAssignmentButtonIsEnabled: function (bEnabled) {
						var sMsg = "Then.onTheTable.theCopyAssignmentButtonIsEnabled(" + bEnabled + ")";
						return this.waitFor({
							id: "idBtnCopyAssignment",
							viewName: sViewName,
							autoWait: false,
							success: function (oButton) {
								Opa5.assert.equal(oButton.getEnabled(), bEnabled, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theCutAssignmentButtonIsEnabled: function (bEnabled) {
						var sMsg = "Then.onTheTable.theCutAssignmentButtonIsEnabled(" + bEnabled + ")";
						return this.waitFor({
							id: "idBtnCutAssignment",
							viewName: sViewName,
							autoWait: false,
							success: function (oButton) {
								Opa5.assert.equal(oButton.getEnabled(), bEnabled, sMsg);
							},
							errorMessage: sMsg
						});
					},
					thePasteAssignmentButtonIsEnabled: function (bEnabled) {
						var sMsg = "Then.onTheTable.thePasteAssignmentButtonIsEnabled(" + bEnabled + ")";
						return this.waitFor({
							id: "idBtnPasteAssignment",
							viewName: sViewName,
							autoWait: false,
							success: function (oButton) {
								Opa5.assert.equal(oButton.getEnabled(), bEnabled, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theRequestInputIsVisible: function (sPath, bVisible) {
						let sMsg = "Then.onTheTable.theRequestInputIsVisible(" + sPath + "," + bVisible + ")";
						return this.waitFor({
							controlType: "sap.ui.table.Row",
							bindingPath: {
								path: sPath
							},
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sViewName,
								id: "tblCapacity"
							},
							autoWait: false,
							success: function (aRows) {
								let oRequestInput = TableCellFinder.findRequestNameInput(aRows[0]);
								Opa5.assert.equal(oRequestInput.getVisible(), bVisible, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theResourceIsExpanded: function (sPath, bExpanded) {
						let sMsg = "Then.onTheTable.theRequestInputIsVisible(" + sPath + "," + bExpanded + ")";
						return this.waitFor({
							controlType: "sap.ui.table.Row",
							bindingPath: {
								path: sPath
							},
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sViewName,
								id: "tblCapacity"
							},
							autoWait: false,
							success: function (aRows) {
								Opa5.assert.equal(aRows[0].isExpandable(), bExpanded, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theRequestInputIsVisible: function (sPath, bVisible) {
						let sMsg = "Then.onTheTable.theRequestInputIsVisible(" + sPath + "," + bVisible + ")";
						return this.waitFor({
							controlType: "sap.ui.table.Row",
							bindingPath: {
								path: sPath
							},
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sViewName,
								id: "tblCapacity"
							},
							autoWait: false,
							success: function (aRows) {
								let oRequestInput = TableCellFinder.findRequestNameInput(aRows[0]);
								Opa5.assert.equal(oRequestInput.getVisible(), bVisible, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theRequestLinkIsVisible: function (sPath, bVisible) {
						let sMsg = "Then.onTheTable.theRequestLinkIsVisible(" + sPath + "," + bVisible + ")";
						return this.waitFor({
							controlType: "sap.ui.table.Row",
							bindingPath: {
								path: sPath
							},
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sViewName,
								id: "tblCapacity"
							},
							autoWait: false,
							success: function (aRows) {
								let oRequestLink = TableCellFinder.findRequestNameLink(aRows[0]);
								Opa5.assert.equal(oRequestLink.getVisible(), bVisible, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theDeletedRequestLinkIsVisible: function (sPath, bVisible) {
						let sMsg = "Then.onTheTable.theDeletedRequestLinkIsVisible(" + sPath + "," + bVisible + ")";
						return this.waitFor({
							controlType: "sap.ui.table.Row",
							bindingPath: {
								path: sPath
							},
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sViewName,
								id: "tblCapacity"
							},
							autoWait: false,
							success: function (aRows) {
								let oRequestLink = TableCellFinder.findDeletedRequestNameLink(aRows[0]);
								Opa5.assert.equal(oRequestLink.getVisible(), bVisible, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theStaffingSummaryIsVisible: function (sPath, bVisible) {
						let sMsg = "Then.onTheTable.theStaffingSummaryIsVisible(" + sPath + "," + bVisible + ")";
						return this.waitFor({
							controlType: "sap.ui.table.Row",
							bindingPath: {
								path: sPath
							},
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sViewName,
								id: "tblCapacity"
							},
							autoWait: false,
							success: function (aRows) {
								let oProgressIndicator = TableCellFinder.findStaffingSummaryProgressInd(aRows[0]);
								Opa5.assert.equal(oProgressIndicator.getVisible(), bVisible, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theUtilPerAsgHourIsVisible: function (sPath, bVisible) {
						let sMsg = "Then.onTheTable.theUtilPerAsgHourIsVisible(" + sPath + "," + bVisible + ")";
						return this.waitFor({
							controlType: "sap.ui.table.Row",
							bindingPath: {
								path: sPath
							},
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sViewName,
								id: "tblCapacity"
							},
							autoWait: false,
							success: function (aRows) {
								let oUtilPerAsgHourText = TableCellFinder.findUtilPerAsgHourText(aRows[0]);
								Opa5.assert.equal(oUtilPerAsgHourText.getVisible(), bVisible, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentStatusIsVisible: function (sPath, bVisible) {
						let sMsg = "Then.onTheTable.theAssignmentStatusIsVisible(" + sPath + "," + bVisible + ")";
						return this.waitFor({
							controlType: "sap.ui.table.Row",
							bindingPath: {
								path: sPath
							},
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sViewName,
								id: "tblCapacity"
							},
							autoWait: false,
							success: function (aRows) {
								let oAsgStatusSelect = TableCellFinder.findAssignmentStatusSelect(aRows[0]);
								Opa5.assert.equal(oAsgStatusSelect.getVisible(), bVisible, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theProjectIsVisible: function (sPath, bVisible) {
						let sMsg = "Then.onTheTable.theProjectIsVisible(" + sPath + "," + bVisible + ")";
						return this.waitFor({
							controlType: "sap.ui.table.Row",
							bindingPath: {
								path: sPath
							},
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sViewName,
								id: "tblCapacity"
							},
							autoWait: false,
							success: function (aRows) {
								let oProjectText = TableCellFinder.findAdditionalColumnTextControl(aRows[0], "projectName");
								Opa5.assert.equal(oProjectText.getVisible(), bVisible, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theCustomerIsVisible: function (sPath, bVisible) {
						let sMsg = "Then.onTheTable.theCustomerIsVisible(" + sPath + "," + bVisible + ")";
						return this.waitFor({
							controlType: "sap.ui.table.Row",
							bindingPath: {
								path: sPath
							},
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sViewName,
								id: "tblCapacity"
							},
							autoWait: false,
							success: function (aRows) {
								let oCustomerText = TableCellFinder.findAdditionalColumnTextControl(aRows[0], "customerName");
								Opa5.assert.equal(oCustomerText.getVisible(), bVisible, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theProjectRoleIsVisible: function (sPath, bVisible) {
						let sMsg = "Then.onTheTable.theProjectRoleIsVisible(" + sPath + "," + bVisible + ")";
						return this.waitFor({
							controlType: "sap.ui.table.Row",
							bindingPath: {
								path: sPath
							},
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sViewName,
								id: "tblCapacity"
							},
							autoWait: false,
							success: function (aRows) {
								let oProjectRoleText = TableCellFinder.findProjectRoleControl(aRows[0]);
								Opa5.assert.equal(oProjectRoleText.getVisible(), bVisible, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theUtilInputIsVisible: function (sPath, bVisible) {
						let sMsg = "Then.onTheTable.theUtilInputIsVisible(" + sPath + "," + bVisible + ")";
						return this.waitFor({
							controlType: "sap.ui.table.Row",
							bindingPath: {
								path: sPath
							},
							ancestor: {
								controlType: "sap.ui.table.TreeTable",
								viewName: sViewName,
								id: "tblCapacity"
							},
							autoWait: false,
							success: function (aRows) {
								let oUtilizationInput = TableCellFinder.findUtilizationInput(aRows[0], sPath + "/utilization/0");
								Opa5.assert.equal(oUtilizationInput.getVisible(), bVisible, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theRequestInputValueStateTextIs: function (sPath, sMsgKey) {
						let sMsg = "Then.onTheTable.theRequestInputValueStateTextIs(" + sPath + "," + sMsgKey + ")";
						return this.waitFor({
							controlType: "capacityGridUi.reuse.valuehelp.InputWithValueHelp",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "requestName"
							},
							success: function (aInputs) {
								let oBundle = aInputs[0].getModel("i18n").getResourceBundle();
								var sMsgText = oBundle.getText(sMsgKey);
								Opa5.assert.equal(aInputs[0].getValueStateText(), sMsgText, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theRequestInputValueStateIs: function (sPath, sValueState) {
						let sMsg = "Then.onTheTable.theRequestInputValueStateIs(" + sPath + "," + sValueState + ")";
						return this.waitFor({
							controlType: "capacityGridUi.reuse.valuehelp.InputWithValueHelp",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "requestName"
							},
							success: function (aInputs) {
								var sRequestValueState = aInputs[0].getValueState();
								Opa5.assert.equal(sRequestValueState, sValueState, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentCountIs: function (sPath, iAsgCount) {
						let sMsg = "Then.onTheTable.theAssignmentCountIs(" + sPath + "," + iAsgCount + ")";
						return this.waitFor({
							id: "tblCapacity",
							viewName: sViewName,
							success: function (oTable) {
								let oModel = oTable.getModel();
								let aAssignments = oModel.getProperty(sPath) || [];
								Opa5.assert.equal(aAssignments.length, iAsgCount, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theAssignmentUtilizationInputValueIs: function (sHours, sPath) {
						let sMsg = "Then.onTheTable.theAssignmentUtilizationInputValueIs(" + sHours + "," + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Input",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "asgUtil"
							},
							success: function (aInputs) {
								Opa5.assert.equal(aInputs[0].getValue(), sHours, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theResourceWorkerTypeIs: function (sValue, sPath) {
						let sMsg = "Then.onTheTable.theResourceWorkerTypeIs(" + sValue + "," + sPath + ")";
						return this.waitFor({
							controlType: "sap.m.Text",
							viewName: sViewName,
							bindingPath: {
								path: sPath,
								propertyPath: "workerType"
							},
							success: function (aTextControls) {
								Opa5.assert.equal(aTextControls[0].getText(), sValue, sMsg);
							},
							errorMessage: sMsg
						});
					},

					theAssignmentIsCopied: function (sPath, bCopied) {
						let sMsg = "Then.onTheTable.theAssignmentIsCopied(" + sPath + "," + bCopied + ")";
						return this.waitFor({
							id: "tblCapacity",
							viewName: sViewName,
							success: function (oTable) {
								let oModel = oTable.getModel();
								Opa5.assert.equal(
									oModel.getCopiedAssignmentPaths().some((val) => val === sPath),
									bCopied,
									sMsg
								);
							},
							errorMessage: sMsg
						});
					},
					theNumberOfAssignmentCopied: function (iCount) {
						let sMsg = "Then.onTheTable.theNumbeOfAssignmentCopied(" + iCount + ")";
						return this.waitFor({
							id: "tblCapacity",
							viewName: sViewName,
							success: function (oTable) {
								let oModel = oTable.getModel();
								Opa5.assert.equal(oModel.getCopiedAssignmentPaths().length, iCount, sMsg);
							},
							errorMessage: sMsg
						});
					},
					theTablePersoButtonIsEnabled: function (bEnabled) {
						let sMsg = "Then.onTheTable.theTablePersoButtonIsEnabled(" + bEnabled + ")";
						return this.waitFor({
							id: "idBtnPersonalization",
							viewName: sViewName,
							autoWait: false,
							success: function (oButton) {
								Opa5.assert.equal(oButton.getEnabled(), bEnabled, sMsg);
							},
							errorMessage: sMsg
						});
					},
					checkEditButtonText: function (iSelectedCount) {
						let sMsg = "When.onTheTable.checkEditButtonText()";
						return this.waitFor({
							id: "idBtnEdit",
							viewName: sViewName,
							success: function (oButton) {
								let sEditText = iSelectedCount > 0 ? "Edit (" + iSelectedCount + ")" : "Edit";
								Opa5.assert.equal(oButton.getText(), sEditText);
							},
							errorMessage: sMsg
						});
					}
				}
			}
		});
	}
);
