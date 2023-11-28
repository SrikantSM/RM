const locatorsListReport = require("../pages/locators/processResourceRequestListReport");
const locatorsObjectPage = require("../pages/locators/processResourceRequestObjectPage");

module.exports = createPageObjects({
	ProcessResourceRequest: {
		arrangements: {
			iStartTheApp: function () {
				// app setup
			}
		},
		actions: {
			iClickonFilterExpandButton: function () {
				locatorsListReport.filterBarExpandButton.click();
			},
			iSearchForProject: function (projectName) {
				locatorsListReport.projectFilterInput.sendKeys(projectName);
				locatorsListReport.projectFilterInput.sendKeys(protractor.Key.ENTER);
				locatorsListReport.goButton.click();
			},
			iSearchForRequestId: function (requestId) {
				locatorsListReport.requestId.sendKeys(requestId);
				locatorsListReport.goButton.click();
			},
			iRemoveProjectFilters: function () {
				locatorsListReport.projectFilterInput.click();
				locatorsListReport.projectFilterDeleteIcons.then(function (icons) {
					icons.forEach((icon) => icon.click());
				});
			},
			iSelectStaffingStatus: function (sStaffingStatus) {
				locatorsListReport.staffingStatusFilter.sendKeys(sStaffingStatus);
				locatorsListReport.staffingStatusFilter.sendKeys(protractor.Key.ENTER);
				locatorsListReport.goButton.click();
			},
			iSelectRequestStatus: function (sRequestStatus) {
				locatorsListReport.requestStatusFilter.sendKeys(sRequestStatus);
				locatorsListReport.requestStatusFilter.sendKeys(protractor.Key.ENTER);
				locatorsListReport.goButton.click();
			},
			iClickTheFirstRow: function () {
				locatorsListReport.visibleRowsInTable.get(0).click();
			},
			iCloseTheResourceRequest: function () {
				locatorsObjectPage.CloseButton.click();
			},
			iForwardTheResourceRequest: function () {
				locatorsObjectPage.ForwardButton.click();
			},

			iClickOnMatchingCandidateSection: function () {
				locatorsObjectPage.matchingCandidatesSection.click();
			},

			iClickonAssignSwitch: function () {
				locatorsObjectPage.assignStatusSwitch.click();
			},

			iSelectAssignmentStatusinPopUp: function (status) {
				locatorsObjectPage.assignStatusSelectInPopup.click();
				locatorsObjectPage.setAssignmentStatus(status).click();
			},

			iClickTheTablesAssignButton: function (testHelper) {
				let resourceName = testHelper.testData.consultantProfile.profileDetails[0].firstName
					.concat(" ")
					.concat(testHelper.testData.consultantProfile.profileDetails[0].lastName);
				locatorsObjectPage.tableRowsAssignButton(resourceName).click();
			},

			iClickTheTablesAssignButtonNeg: function (testHelper) {
				let resourceName = testHelper.testData.consultantProfile.profileDetails[3].firstName
					.concat(" ")
					.concat(testHelper.testData.consultantProfile.profileDetails[3].lastName);
				locatorsObjectPage.tableRowsAssignButton(resourceName).click();
			},

			//Added for SUPA
			iClickTheMatchingResTablesAssignButton: function () {
				locatorsObjectPage.tableRowsAssignButtonsSUPA.get(0).click();
			},

			iClickOnShowDetailsButton: function () {
				locatorsObjectPage.showDetailsButton.click();
			},

			iClickTheTablesQuickAssignButton: function (testHelper) {
				let resourceName = testHelper.testData.consultantProfile.profileDetails[0].firstName
					.concat(" ")
					.concat(testHelper.testData.consultantProfile.profileDetails[0].lastName);
				locatorsObjectPage.tableRowsQuickAssignButton(resourceName).click();
			},

			iClickTheAssignDialogOkButton: function () {
				locatorsObjectPage.assignDialogOkButton.click();
			},

			iClickTheAssignDialogCancelButton: function () {
				locatorsObjectPage.assignDialogCancelButton.click();
			},

			iEnterTheAssignActionInputs: function (testHelper) {
				let helperData = testHelper.testData.resourceRequest.resourceRequestDetails;
				console.log(helperData);
				let sRequestEffort = helperData.requestedEffort ? helperData.requestedEffort : "200";
				let sDateRange = helperData.startDate + " - " + helperData.endDate;
				locatorsObjectPage.assignNumOfHoursInput.clear();
				locatorsObjectPage.assignNumOfHoursInput.sendKeys(sRequestEffort);
				//locatorsObjectPage.assignDateRange.sendKeys(sDateRange);
			},

			iEnterTheHoursSUPA: function (iHours) {
				locatorsObjectPage.assignNumOfHoursInput.clear();
				locatorsObjectPage.assignNumOfHoursInput.sendKeys(iHours);
			},

			iClearTheAssignActionInputs: function (testHelper) {
				locatorsObjectPage.assignDateRange.clear();
				locatorsObjectPage.assignNumOfHoursInput.clear();
				locatorsObjectPage.assignNumOfHoursInput.sendKeys(10);
			},

			//------------- Assignment Edit ----------
			iClickTheTablesUpdateButton: function (testHelper) {
				let resourceName = testHelper.testData.consultantProfile.profileDetails[0].firstName
					.concat(" ")
					.concat(testHelper.testData.consultantProfile.profileDetails[0].lastName);
				locatorsObjectPage.tableRowsUpdateButton(resourceName).click();
			},

			//Added for SUPA
			iClickTheAssignmentsTablesUpdateButton: function () {
				locatorsObjectPage.tableRowsUpdateButtonsSUPA.get(0).click();
			},

			iEnterTheAssignEditInputs: function (testHelper) {
				let AssignDomainHelperData = testHelper.testData.AssignDomain;
				let	newRequestedEffort = parseInt(AssignDomainHelperData.beforeAssignDelete) - 20;
				locatorsObjectPage.assignNumOfHoursInput.clear().then(function () {
					locatorsObjectPage.assignNumOfHoursInput.sendKeys(580);
				});
			},

			iClickOnAssignmentsSection: function () {
				locatorsObjectPage.assignmentsSection.click();
			},

			iClickTheTableRowDeleteButton: function (testHelper) {
				let resourceName = testHelper.testData.consultantProfile.profileDetails[0].firstName
					.concat(" ")
					.concat(testHelper.testData.consultantProfile.profileDetails[0].lastName);
				locatorsObjectPage.tableRowsDeleteButton(resourceName).click();
			},

			//Added for SUPA
			iClickTheAssignmentTableRowDeleteButton: function () {
				locatorsObjectPage.tableRowsUnAssignButtonsSUPA.get(0).click();
			},

			iClickTheConfirmDialogOkButton: function () {
				locatorsObjectPage.dialogOkButton.click();
			},

			iClickTheConfirmDialogCancelButton: function () {
				locatorsObjectPage.dialogCancelButton.click();
			},

			iClickTheErrorDialogCloseButton: function () {
				locatorsObjectPage.closeErrorDialogButton.click();
			},

			iEnterTheS4StrictInputs: function () {
				locatorsObjectPage.assignNumOfHoursInput.sendKeys("50");
			},

			iEnterTheS4StrictEditInputs: function () {
				locatorsObjectPage.assignNumOfHoursInput.clear();
				locatorsObjectPage.assignNumOfHoursInput.sendKeys("30");
			},

			iEnterTheS499Input: function () {
				locatorsObjectPage.assignNumOfHoursInput.sendKeys("99");
			},

			iClickTablesAssignButtonS4: function (testHelper, index) {
				// index++; //"Test Usere2e"+index;//
				let resourceName = testHelper.testData.consultantProfile.profileDetails[index].firstName
					.concat(" ")
					.concat(testHelper.testData.consultantProfile.profileDetails[index].lastName);
				locatorsObjectPage.tableRowsAssignButton(resourceName).click();
			},

			iClickTablesUpdateButtonS4: function (testHelper, index) {
				// index++; //"Test Usere2e"+index;//
				let resourceName = testHelper.testData.consultantProfile.profileDetails[index].firstName
					.concat(" ")
					.concat(testHelper.testData.consultantProfile.profileDetails[index].lastName);
				locatorsObjectPage.tableRowsUpdateButton(resourceName).click();
			},

			iClickOnErrorMsgNav: function () {
				locatorsObjectPage.errorDialogItem.click();
			},

			iEnterTheAssignEditInputS4: function () {
				locatorsObjectPage.assignNumOfHoursInput.clear().then(function () {
					locatorsObjectPage.assignNumOfHoursInput.sendKeys(20);
				});
			},

			iEnterTheAssignInputsOutOfRR: function (testHelper) {
				locatorsObjectPage.assignDateRange.getAttribute("value").then(function (readData) {
					let sToDate = readData.split(" – ")[1];
					let sFromDate = readData.split(" – ")[0];
					console.log("ToDate" + sToDate);
					var oToDate = new Date(sToDate);
					oToDate.setDate(oToDate.getDate() + 2);
					let aDate = oToDate.toString().split(" "),
						sNewToDate = sFromDate + " - " + aDate[1] + " " + aDate[2] + ", " + aDate[3];
					console.log("New ToDate" + sNewToDate);
					locatorsObjectPage.assignDateRange.clear();
					locatorsObjectPage.assignDateRange.sendKeys(sNewToDate);
				});
				locatorsObjectPage.assignNumOfHoursInput.clear();
				locatorsObjectPage.assignNumOfHoursInput.sendKeys(50);
			}
		},
		assertions: {
			theListReportTableShouldBePresent: function () {
				expect(locatorsListReport.resourceRequestTable.isPresent()).toBeTruthy();
			},
			theObjectPageShouldBePresent: function () {
				expect(locatorsObjectPage.Header.objectPageHeaderTitle.isPresent()).toBeTruthy();
			},
			theProjectInfoFacetShouldBePresent: function () {
				expect(locatorsObjectPage.ProjectTitle.isPresent()).toBeTruthy();
			},
			theResourceManagerInfoFacetShouldBePresent: function () {
				expect(locatorsObjectPage.ResourceManagerTitle.isPresent()).toBeTruthy();
			},
			theTableCountIs: function (count) {
				locatorsListReport.visibleRowsInTable.then(function (rows) {
					expect(rows.length).toBe(count);
				});
			},

			//Check for Object Page section
			theObjectPageSectionMatchingCandidatePresent: function () {
				expect(locatorsObjectPage.objectPageSectionMatchingResources.isPresent()).toBeTruthy();
			},

			//Check for matching resource table
			theMatchingResourceTableShouldBePresent: function () {
				expect(locatorsObjectPage.matchingResourceTable.isPresent()).toBeTruthy();
			},

			theMatchingResourceTableCountIsGreaterThan: function (count) {
				locatorsObjectPage.visibleRowsInMatchingResourceTable.then(function (rows) {
					expect(rows.length).toBeGreaterThan(count);
				});
			},

			theAssignDialogShouldBePresent: function () {
				expect(locatorsObjectPage.assignDialog.isPresent()).toBeTruthy();
			},

			theRemainigHoursShouldBe: function (sHrs) {
				expect(locatorsObjectPage.remainingHours.asControl().getProperty("text")).toEqual(sHrs);
			},

			theAssignStatusTextShouldBe: function (sText) {
				expect(locatorsObjectPage.assignStatusText.asControl().getProperty("text")).toEqual(sText);
			},
			theAssignStatusLabelShouldBe: function (sText) {
				expect(locatorsObjectPage.assignStatusLabel.asControl().getProperty("text")).toEqual(sText);
			},

			theAssignDialogShouldBeClosed: function () {
				expect(locatorsObjectPage.assignDialog.isPresent()).toBe(false);
			},

			storeStafferHrs: function (testHelper, bDeleteAction) {
				locatorsObjectPage.staffedEfforts.getText().then(function (value) {
					if (bDeleteAction) {
						testHelper.testData.AssignDomain = {
							beforeAssignDelete: value
						};
					} else {
						testHelper.testData.AssignDomain = {
							beforeAssignCreate: value
						};
					}
				});
			},

			theStaffingHoursValueChanged: function (testHelper, sAction) {
				locatorsObjectPage.staffedEfforts.getText().then(function (value) {
					let oldValue,
						newValue = parseInt(value);
					switch (sAction) {
						case "Assign":
							oldValue = parseInt(testHelper.testData.AssignDomain.beforeAssignCreate);
							expect(newValue).toBeGreaterThan(oldValue);
							break;
						case "UnAssign_OK":
							oldValue = parseInt(testHelper.testData.AssignDomain.beforeAssignDelete);
							expect(newValue).toBeLessThan(oldValue);
							break;
						case "UnAssign_Cancel":
							oldValue = parseInt(testHelper.testData.AssignDomain.beforeAssignDelete);
							expect(newValue).toBe(oldValue);
							break;
						case "EditAssign":
							oldValue = parseInt(testHelper.testData.AssignDomain.beforeAssignDelete);
							expect(newValue).toBeLessThan(oldValue);
							break;
						default:
						// code block
					}
				});
			},

			//------------- Assignment Delete ---------

			theObjectPageSectionAssignmetsPresent: function () {
				expect(locatorsObjectPage.objectPageSectionAssignments.isPresent()).toBeTruthy();
			},

			theAssignedResourcesCountIsGreaterThan: function (count) {
				locatorsObjectPage.visibleRowsInAssignedResourcesTable.then(function (rows) {
					expect(rows.length).toBeGreaterThan(count);
				});
			},

			theAssignedCandidatePresent: function (testHelper) {
				let resourceName = testHelper.testData.consultantProfile.profileDetails[0].firstName
					.concat(" ")
					.concat(testHelper.testData.consultantProfile.profileDetails[0].lastName);
				expect(locatorsObjectPage.getSpecificAssignedResourcesRow(resourceName).isPresent()).toBeTruthy();
			},

			theAssignedCandidatePresent: function (testHelper) {
				let resourceName = testHelper.testData.consultantProfile.profileDetails[0].firstName
					.concat(" ")
					.concat(testHelper.testData.consultantProfile.profileDetails[0].lastName);
				expect(locatorsObjectPage.AssignedResources.AssignedResourcesTableColumnFirstRowName.first().getText()).toBe(resourceName);
			},

			theConfirmDialogShouldBePresent: function () {
				expect(locatorsObjectPage.dialogBar.isPresent()).toBeTruthy();
			},

			theErrorDialogShouldNotBePresent: function () {
				expect(locatorsObjectPage.errorDialog.isPresent()).toBeFalsy();
			},

			theErrorDialogShouldBePresent: function () {
				expect(locatorsObjectPage.errorDialog.isPresent()).toBeTruthy();
			},

			theErrorDialogMsgContains: function (msg) {
				expect(locatorsObjectPage.errorDialogMsg(msg).isPresent()).toBeTruthy();
			}
		}
	}
});
