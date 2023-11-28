const locators = require("../locators/tableLocators");

var sComponentId = "application-capacity-Display-component";
var sTableViewId = sComponentId + "---idPage" + "--idTable--";

module.exports = createPageObjects({
	Table: {
		arrangements: {},
		actions: {
			pressResourceNameLink: function (resourceName) {
				locators.contactLink(resourceName).click();
			},

			pressFirstResourceNameLink: function () {
				locators.getAllResources().then(function (aResources) {
					aResources[0].click();
				});
			},
			openRowContextMenu: async function (sPath) {
				var oElement = locators.assignmentRow(sPath); //get the location of the element we want to click
				loc = oElement.getLocation(); //get the location of the element we want to click
				await browser.actions().mouseMove(loc).perform(); //takes the mouse to hover the element
				await browser.actions().click(protractor.Button.RIGHT).perform(); //performs the right click
			},
			closeContextMenu: async function () {
				var oElement = locators.getTitle();
				loc = oElement.getLocation();
				await browser.actions().mouseMove(loc).perform();
				await browser.actions().click(protractor.Button.LEFT).perform();
			},
			pressFilterButton: function () {
				locators.getGlobalFilterControl().click();
			},
			pressDiscardButton: function () {
				locators.getDiscardButton().click();
			},
			pressAddButton: function () {
				locators.getAddButton().click();
			},
			pressDeleteButton: function () {
				locators.getDeleteButton().click();
			},
			pressDiscardConfirmationOKButton: function () {
				locators.getDiscardConfirmationOKButton().click();
			},
			selectAssignmentRow: function (sRow) {
				locators.assignmentRow(sRow).click();
			},

			editAssignment: function (iNum, sPath) {
				let utilizationCell = locators.getEditableUtilizationCell(sPath);
				utilizationCell.clear();
				utilizationCell.sendKeys(iNum);
				utilizationCell.sendKeys(protractor.Key.ENTER);
			},

			enterRequest: function (sRequest, sPath) {
				let oRequestCell = locators.getRequestInputCell(sPath);
				oRequestCell.sendKeys(sRequest);
			},

			enterRequestForSUPA: function (sRequest, sPath) {
				let oRequestCell = locators.getRequestInputCellForSUPA(sPath);
				oRequestCell.sendKeys(sRequest);
			},

			selectActiveSuggestion: function () {
				locators.getActiveSuggestionSelector().click();
			},

			selectActiveSuggestionForSUPA: function () {
				locators.getActiveSuggestionSelectorForSUPA().click();
			},

			pressWorkPackageName: function (workPackageName) {
				locators.workPackageName(workPackageName).click();
			},

			openResourceNameColumnMenu: function () {
				locators.getResourceNameColumnMenuSUPA().click();
			},

			openCostCenterColumnMenu: function () {
				locators.getCostCenterColumn().click();
			},

			openUtilizationColumnMenu: function () {
				locators.getUtilizationColumn().click();
			},

			sortColumnInAscending: function () {
				locators.getSortAscColumnMenuItem().click();
			},

			sortColumnInDescending: function () {
				locators.getSortDescendingColumnMenuItem().click();
			},

			pressExpandArrowOfFirstResource: function () {
				locators.expandArrowOfFirstResource().click();
			},
			pressDropDown: function () {
				locators.filterDropDown().click();
			},
			selectChangedOption: function () {
				locators.ChangedDropDownOption().click();
			},
			pressExpandArrowOfSecondResource: function () {
				locators.expandArrowOfSecondResource().click();
			},

			scrollOnePageDown: function () {
				var sId = sTableViewId + "tblCapacity";
				browser.executeScript('sap.ui.getCore().byId("' + sId + '").setFirstVisibleRow(51)');
			},

			scrollSecondPageDown: function () {
				var sId = sTableViewId + "tblCapacity";
				browser.executeScript('sap.ui.getCore().byId("' + sId + '").setFirstVisibleRow(101)');
			},

			scrollToTop: function () {
				var sId = sTableViewId + "tblCapacity";
				browser.executeScript('sap.ui.getCore().byId("' + sId + '").setFirstVisibleRow(0)');
			},

			expandRowWithAssignments: function () {
				var sId = sTableViewId + "tblCapacity";
				browser.executeScript(
					'var rows=sap.ui.getCore().byId("' + sId + '").getRows(); rows.forEach(row => { if(row.isExpandable()){row.expand();return;}});'
				);
			},
			clearAllRowSelection: function () {
				var sId = sTableViewId + "tblCapacity";
				browser.executeScript('sap.ui.getCore().byId("' + sId + '").getPlugin("sap.ui.table.plugins.MultiSelectionPlugin").clearSelection();');
			},
			pressEditButton: function () {
				locators.getEditAssignmentButton().click();
			},
			pressFocusedEditToolbar: function (iCount) {
				locators.getFocusedEditToolbar(iCount).click();
			},
			pressEditContextMenuItem: function () {
				locators.getEditContextMenuItem().click();
			},
			pressViewDetailsContextMenuItem() {
				locators.getViewDetailsContextMenuItem().click();
			},
			changeAssignStatusStepByStep: function (sPath, sKey, sKeyText) {
				locators.selectAssignmentStatusCode(sPath, sKey).click();
				locators.getSelectedAssignmentStatusText(sKeyText).click();
			},

			storeUtilizationHrs: function (utilHrs, sPath, sAssignment) {
				locators
					.editableInputBox(sPath)
					.asControl()
					.getProperty("value")
					.then(function (value) {
						let testData = {};
						if (sAssignment === "assignment1") {
							testData.utilHrs = {
								assignment1: parseInt(value)
							};
							utilHrs.assignment1 = testData.utilHrs.assignment1;
						}
						if (sAssignment === "assignment2") {
							testData.utilHrs = {
								assignment2: parseInt(value)
							};
							utilHrs.assignment2 = testData.utilHrs.assignment2;
						}
					});
			},

			storeStaffedHrs: function (staffedHrs, sPath, sAssignment) {
				locators
					.getStaffedHours(sPath)
					.asControl()
					.getProperty("text")
					.then(function (value) {
						let testData = {};
						if (sAssignment === "assignment1") {
							testData.staffedHrs = {
								assignment1: parseInt(value)
							};
							staffedHrs.assignment1 = testData.staffedHrs.assignment1;
						}
						if (sAssignment === "assignment2") {
							testData.staffedHrs = {
								assignment2: parseInt(value)
							};
							staffedHrs.assignment2 = testData.staffedHrs.assignment2;
						}
					});
			},

			pressDeselectButton() {
				locators.getDeselectButton().click();
			}
		},
		assertions: {
			theUtilizationCellValueIs: function (sText, sPath) {
				expect(locators.getUtilizationCell(sPath).asControl().getProperty("text")).toBe(sText);
			},

			theAssignmentStatusIs: function (sKey, sPath) {
				expect(locators.getAssignmentStatusSelect(sPath).asControl().getProperty("selectedKey")).toBe(sKey);
			},

			theResourceProfilePhotoIsVisible: function (sText, sPath) {
				expect(locators.getProfilePhoto(sPath).asControl().getProperty("visible")).toBeTruthy();
			},

			theSourceOfProfilePhotoIs: function (sPath, sText) {
				expect(locators.getProfilePhoto(sPath).asControl().getProperty("src")).toEqual(sText);
			},
			theFilterButtonIsVisible: function () {
				expect(locators.getGlobalFilterControl().asControl().getProperty("visible")).toBeTruthy();
			},
			theFilterButtonIsNotVisible: function () {
				let sMsg = "Then.onTheTablePage.theFilterButtonIsNotVisible()";
				expect(locators.getGlobalFilterControl().isPresent()).toBeFalsy(sMsg);
			},
			theFilterDropDownIsVisible: function () {
				expect(locators.filterDropDown().asControl().getProperty("visible")).toBeTruthy();
			},
			theFilterDropDownIsEnabled: function () {
				expect(locators.filterDropDown().asControl().getProperty("enabled")).toBeTruthy();
			},
			filterResourceIs: function (sPath) {
				let sMsg = "Then.onTheTablePage.filterResourceIs(" + sPath + ")";
				expect(locators.filteredResource(sPath).isPresent()).toBeTruthy(sMsg);
			},
			filteredAssignmentIs: function (sPath) {
				let sMsg = "Then.onTheTablePage.filteredAssignmentIs(" + sPath + ")";
				expect(locators.filteredAssignment(sPath).isPresent()).toBeTruthy(sMsg);
			},
			filteredNewAssignmentIs: function (sPath) {
				let sMsg = "Then.onTheTablePage.filteredNewAssignmentIs(" + sPath + ")";
				expect(locators.filteredNewlyAddedAssignment(sPath).isPresent()).toBeTruthy(sMsg);
			},
			theTitleCountIs: function (sText) {
				locators
					.getTitle()
					.asControl()
					.getProperty("text")
					.then(function (text) {
						let value = String(text).match(/\(([^)]+)\)/)[1];
						expect(value).toEqual(String(sText));
					});
			},

			theUtilizationValueIs: function (sText, sPath) {
				locators
					.getAvgUtilizationStatus(sPath)
					.asControl()
					.getProperty("text")
					.then(function (text) {
						let value = String(text).match(/\d*/)[0];
						expect(value).toEqual(String(sText));
					});
			},

			//Check for CapacityGrid Table
			theTableIsVisible: function () {
				let sMsg = "Then.onTheTablePage.theTableIsVisible()";
				expect(locators.capacityGridTable.isPresent()).toBeTruthy(sMsg);
			},

			theColumnsCountIs: function (numCols) {
				locators.getNumOfVisibleColumns().then(function (col) {
					expect(col.length).toEqual(numCols);
				});
			},

			theResourceRowIsFound: function (resName) {
				let sMsg = "Then.onTheTablePage.theResourceRowIsFound(" + resName + ")";
				expect(locators.getSpecificResourceRow(resName).isPresent()).toBeTruthy(sMsg);
			},

			theResourceIsVisible: function (resName) {
				let sMsg = "Then.onTheTablePage.theResourceIsVisible(" + resName + ")";
				expect(locators.resourceName(resName).isPresent()).toBeTruthy(sMsg);
			},

			theColumnHeaderIsVisible: function (sText) {
				let sMsg = "Then.onTheTablePage.theColumnHeaderIsVisible(" + sText + ")";
				expect(locators.resourceColumnHeader(sText).isPresent()).toBeTruthy(sMsg);
			},

			theResourceNameColumnIsSorted: function () {
				expect(locators.getFirstColumn().asControl().getProperty("sortOrder")).toBe("Ascending");
			},

			theResourceIsNotVisible: function (resName) {
				let sMsg = "Then.onTheTablePage.theResourceIsNotVisible(" + resName + ")";
				expect(locators.resourceName(resName).isPresent()).toBeFalsy(sMsg);
			},

			theAssignmentShouldNotBeEditable: function (sPath) {
				let sMsg = "Then.onTheTablePage.theAssignmentShouldNotBeEditable(" + sPath + ")";
				expect(locators.getEditableUtilizationCell(sPath).isPresent()).toBeFalsy(sMsg);
			},

			theColumnMenuIsVisible: function () {
				let sMsg = "Then.onTheTablePage.theColumnMenuIsVisible()";
				locators.getFirstColumn().click();
				expect(locators.getResourceNameColumnMenu().isPresent()).toBeTruthy(sMsg);
			},

			theColumnIsSortedDescending: function () {
				locators.getSortDescendingColumnMenuItem().click();
				expect(locators.getFirstColumn().asControl().getProperty("sortOrder")).toBe("Descending");
			},

			theMontUtilization: function (resName, month, utilization) {
				let resourceName = resName; //Get this from Helper
				let monthColumn = month - 1; //Changing to array index
				locators.allCellsInRow(resourceName, "sap.m.ObjectStatus").then(function (cell) {
					//Look for No of columns in the Grid
					expect(cell.length).toBe(12);
					if (cell.length > 0) {
						cell[0].getText().then(function (text) {
							console.log(text);
						});

						//monthly Utilization Of Resource row
						cell[monthColumn].getText().then(function (text) {
							let value = parseInt(text.split("%")[0]);
							console.log(value);
							expect(value).toBe(utilization);
						});
					}
				});
			},

			theExpandArrowIsVisibleForFirstResource: function () {
				let sMsg = "Then.onTheTablePage.theExpandArrowIsVisibleForFirstResource()";
				expect(locators.expandArrowOfFirstResource().isPresent()).toBeTruthy(sMsg);
			},

			theAssignmentsOfFirstResourceAreVisible: function (workPackageName) {
				let sMsg = "Then.onTheTablePage.theAssignmentsOfFirstResourceAreVisible(" + workPackageName + ")";
				expect(locators.workPackageName(workPackageName).isPresent()).toBeTruthy(sMsg);
			},

			theAssignmentsOfResourceAreVisible: function (workPackageName) {
				let sMsg = "Then.onTheTablePage.theAssignmentsOfResourceAreVisible(" + workPackageName + ")";
				expect(locators.workPackageName(workPackageName).isPresent()).toBeTruthy(sMsg);
			},

			theAssignmentBookedCapacityIs: function (sText, sPath) {
				expect(locators.getEditableUtilizationCell(sPath).asControl().getProperty("value")).toBe(sText);
			},

			theAssignmentChangeMsgIs: function (sPath, sMsg) {
				expect(locators.getEditableUtilizationCell(sPath).asControl().getProperty("valueStateText")).toBe(sMsg);
			},

			theColumnConfigurationIs: function (aCols) {
				locators.getAllColumns().then(function (col) {
					for (var i = 0; i < aCols.length; i++) {
						var sCols = sTableViewId.concat(aCols[i]);
						expect(col[i + 1].asControl().getProperty("id")).toBe(sCols);
					}
				});
			},

			theRowsAreSelected: function (aIndex) {
				var sId = sTableViewId + "tblCapacity";
				var aSelRow = browser.executeScript(
					'var rows=sap.ui.getCore().byId("' + sId + '").getPlugin("sap.ui.table.plugins.MultiSelectionPlugin").getSelectedIndices(); return rows;'
				);
				expect(aSelRow).toEqual(aIndex);
			},
			theInfoToolbarTextIs: function (sText) {
				expect(locators.getInfoToolbarText().asControl().getProperty("text")).toBe(sText);
			},

			theUtilizationHrsAre: function (sText, sPath) {
				expect(locators.getStaffedHours(sPath).asControl().getProperty("text")).toEqual(sText);
			},

			theResourceCostCenterIs: function (sText, sPath) {
				expect(locators.getCostCenter(sPath).asControl().getProperty("text")).toEqual(sText);
			},

			theAssignmentCustomerIs: function (sText, sPath) {
				expect(locators.getCustomer(sPath).asControl().getProperty("text")).toEqual(sText);
			},

			theAssignmentProjectIs: function (sText, sPath) {
				expect(locators.getProject(sPath).asControl().getProperty("text")).toEqual(sText);
			},

			theAssignmentProjectRoleIs: function (sText, sPath) {
				expect(locators.getProjectRole(sPath).asControl().getProperty("text")).toEqual(sText);
			},

			theAssignmentRequestIs: function (sText, sPath) {
				expect(locators.getRequest(sPath).asControl().getProperty("text")).toEqual(sText);
			},

			theAssignmentReferenceObjectIs: function (sText, sPath) {
				expect(locators.getReferenceObject(sPath).asControl().getProperty("text")).toEqual(sText);
			},

			theAssignmentReferenceObjectTypeIs: function (sText, sPath) {
				expect(locators.getReferenceObjectType(sPath).asControl().getProperty("text")).toEqual(sText);
			},

			theRequestStatusIs: function (sText, sPath) {
				expect(locators.getRequestStatus(sPath).asControl().getProperty("text")).toEqual(sText);
			},
			theworkItemNameIs: function (sText, sPath) {
				expect(locators.getworkItemName(sPath).asControl().getProperty("text")).toEqual(sText);
			},
			theResourceWorkerTypeIs: function (sText, sPath) {
				expect(locators.getWorkerType(sPath).asControl().getProperty("text")).toEqual(sText);
			},
			theEditButtonIsEnabled: function (bEnabled) {
				expect(locators.getEditAssignmentButton().asControl().getProperty("enabled")).toBe(bEnabled);
			},
			theEditContextMenuItemIsEnabled: function (bEnabled) {
				expect(locators.getEditContextMenuItem().asControl().getProperty("enabled")).toBe(bEnabled);
			},
			theFocusedEditContextMenuItemIsEnabled: function (bEnabled) {
				expect(locators.getFocusedEditContextMenuItem().asControl().getProperty("enabled")).toBe(bEnabled);
			},
			theViewDetailsContextMenuItemIsEnabled: function (bEnabled) {
				expect(locators.getViewDetailsContextMenuItem().asControl().getProperty("enabled")).toBe(bEnabled);
			}
		}
	}
});
