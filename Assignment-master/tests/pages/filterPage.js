const locators = require("../locators/filterLocators");

module.exports = createPageObjects({
	Filter: {
		arrangements: {},
		actions: {
			selectOrg: function (sResourceOrgKey) {
				let orgSelector = locators.getOrgSelector();
				orgSelector.sendKeys(sResourceOrgKey);
				orgSelector.sendKeys(protractor.Key.ENTER);
			},

			selectCC: function (sCostCenter) {
				let costCenterSelector = locators.getCostCenterSelector();
				costCenterSelector.sendKeys(sCostCenter);
			},

			pressGoButton: function () {
				locators.getGoButtonVerticalFilter().click();
			},

			pressResetButton: function () {
				locators.getResetButtonVerticalFilter().click();
			},

			clearNameFilterKey: function () {
				let oNameFilterControl = locators.getNameFilterInnerControl();
				oNameFilterControl.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "A"));
				oNameFilterControl.sendKeys(protractor.Key.BACK_SPACE);
			},

			clearProjectFilterKey: function () {
				let oProjectFilterControl = locators.getProjectInnerSelector();
				oProjectFilterControl.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "A"));
				oProjectFilterControl.sendKeys(protractor.Key.BACK_SPACE);
			},

			clearCustomerFilterKey: function () {
				let oCustomerFilterControl = locators.getCustomerInnerSelector();
				oCustomerFilterControl.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "A"));
				oCustomerFilterControl.sendKeys(protractor.Key.BACK_SPACE);
			},

			clearProjectRoleFilterKey: function () {
				let oProjectRoleFilterControl = locators.getProjectRoleSelector();
				oProjectRoleFilterControl.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "A"));
				oProjectRoleFilterControl.sendKeys(protractor.Key.BACK_SPACE);
			},

			clearRequestFilterKey: function () {
				let oRequestFilterControl = locators.getRequestInnerSelector();
				oRequestFilterControl.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "A"));
				oRequestFilterControl.sendKeys(protractor.Key.BACK_SPACE);
			},

			clearReferenceObjectFilterKey: function () {
				let oReferenceObjectFilterControl = locators.getReferenceObjectInnerSelector();
				oReferenceObjectFilterControl.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "A"));
				oReferenceObjectFilterControl.sendKeys(protractor.Key.BACK_SPACE);
			},

			clearReferenceObjectTypeFilterKey: function () {
				let oReferenceObjectTypeFilterControl = locators.getReferenceObjectTypeSelector();
				oReferenceObjectTypeFilterControl.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "A"));
				oReferenceObjectTypeFilterControl.sendKeys(protractor.Key.BACK_SPACE);
			},

			clearWorkerTypeFilterKey: function () {
				let oWorkerTypeFilterControl = locators.getWorkerTypeInnerSelector();
				oWorkerTypeFilterControl.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "A"));
				oWorkerTypeFilterControl.sendKeys(protractor.Key.BACK_SPACE);
			},

			enterResourceName: function (resName) {
				locators.getNameFilterInnerControl().sendKeys(resName);
			},

			enterCostCenter: function (sCostCenter) {
				locators.getCostCenterInnerSelector().sendKeys(sCostCenter);
			},

			enterProject: function (sProject) {
				locators.getProjectInnerSelector().sendKeys(sProject);
			},

			enterCustomer: function (sCustomer) {
				locators.getCustomerInnerSelector().sendKeys(sCustomer);
			},

			enterProjectRole: function (sProjectRole) {
				let projectRoleSelector = locators.getProjectRoleSelector();
				projectRoleSelector.sendKeys(sProjectRole);
				projectRoleSelector.sendKeys(protractor.Key.ENTER);
			},

			enterRequest: function (sRequest) {
				locators.getRequestInnerSelector().sendKeys(sRequest);
			},

			enterReferenceObject: function (sReferenceObject) {
				locators.getReferenceObjectInnerSelector().sendKeys(sReferenceObject);
			},

			enterReferenceObjectType: function (sReferenceObjectType) {
				let referenceObjectTypeSelector = locators.getReferenceObjectTypeSelector();
				referenceObjectTypeSelector.sendKeys(sReferenceObjectType);
				referenceObjectTypeSelector.sendKeys(protractor.Key.ENTER);
			},

			enterWorkerType: function (sWorkerType) {
				let workerTypeSelector = locators.getWorkerTypeInnerSelector();
				workerTypeSelector.sendKeys(sWorkerType);
				workerTypeSelector.sendKeys(protractor.Key.ENTER);
			},
			expandOrCollapseResourceFilterPanel: function () {
				locators.getResourceFilterPanel.click();
			},
			expandOrCollapseUtilizationFilterPanel: function () {
				locators.getUtilizationFilterPanel.click();
			},
			expandOrCollapseRequestFilterPanel: function () {
				locators.getRequestFilterPanel.click();
			},
			selectActiveSuggestion: function () {
				locators.getActiveSuggestionSelector().click();
			},

			enterMinFreeHour: function (iMinFreeHour) {
				locators.getMinFreeHourSelector().sendKeys(iMinFreeHour);
			},

			selectUtilization: function (iIndex) {
				locators.getUtilizationFilterCheckBox(iIndex).click();
			},

			clearServiceOrgFilters: function () {
				let orgSelector = locators.getOrgSelector();
				orgSelector.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "A"));
				orgSelector.sendKeys(protractor.Key.BACK_SPACE);
			},

			pressCloseButton: function () {
				locators.getFilterCloseButton().click();
			}
		},
		assertions: {
			theVerticalFilterIsVisible: function () {
				let sMsg = "Then.onTheFilterPage.theVerticalFilterIsVisible()";
				expect(locators.getNameFilterControl().isPresent()).toBeTruthy(sMsg);
			},

			theVerticalFilterIsNotVisible: function () {
				let sMsg = "Then.onTheFilterPage.theVerticalFilterIsNotVisible()";
				expect(locators.getNameFilterControl().isPresent()).toBeFalsy(sMsg);
			},
			theResourceFilterPanelIsExpanded: function () {
				let sMsg = "Then.onTheVariantPage.theResourceFilterPanelIsExpanded()";
				expect(locators.theResourceFilterPanel.asControl().getProperty("expanded")).toBeTruthy();
			},
			theUtilizationFilterPanelIsExpanded: function () {
				let sMsg = "Then.onTheVariantPage.theUtilizationFilterPanelIsExpanded()";
				expect(locators.theUtilizationFilterPanel.asControl().getProperty("expanded")).toBeTruthy();
			},
			theRequestFilterPanelIsExpanded: function () {
				let sMsg = "Then.onTheVariantPage.theRequestFilterPanelIsExpanded()";
				expect(locators.theRequestFilterPanel.asControl().getProperty("expanded")).toBeTruthy();
			},
			theResourceFilterPanelIsNotExpanded: function () {
				let sMsg = "Then.onTheVariantPage.theResourceFilterPanelIsNotExpanded()";
				expect(locators.theResourceFilterPanel.asControl().getProperty("expanded")).toBeFalsy();
			},
			theUtilizationFilterPanelIsNotExpanded: function () {
				let sMsg = "Then.onTheVariantPage.theUtilizationFilterPanelIsNotExpanded()";
				expect(locators.theUtilizationFilterPanel.asControl().getProperty("expanded")).toBeFalsy();
			},
			theRequestFilterPanelIsNotExpanded: function () {
				let sMsg = "Then.onTheVariantPage.theRequestFilterPanelIsNotExpanded()";
				expect(locators.theRequestFilterPanel.asControl().getProperty("expanded")).toBeFalsy();
			}
		}
	}
});
