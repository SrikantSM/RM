const locators = require("../locators/headerLocators");

module.exports = createPageObjects({
	Header: {
		arrangements: {},
		actions: {
			selectView: function (sText) {
				locators.getViewSegmentedButtonSegment(sText).click();
			},

			changeDateRange: function (sDateRangeText) {
				let oDateRangeSelector = locators.getDateRangeSelector();
				oDateRangeSelector.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "A"));
				oDateRangeSelector.sendKeys(sDateRangeText);
				oDateRangeSelector.sendKeys(protractor.Key.ENTER);
			},

			changeDateRangeForSUPA: function (sDateRangeText) {
				let oDateRangeSelector = locators.getDateRangeSelector();
				oDateRangeSelector.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "A"));
				oDateRangeSelector.sendKeys(sDateRangeText);
			}

		},
		assertions: {
			theViewIs: function (sView) {
				expect(locators.getViewSegmentedButton().asControl().getProperty("selectedKey")).toBe(sView);
			},

			theAvgUtilLabelIsVisible: function () {
				let sMsg = "Then.onTheHeaderPage.theAvgUtilLabelIsVisible()";
				expect(locators.avgUtilizationLabel.isPresent()).toBeTruthy(sMsg);
			},

			theAvgUtilization: function (iNumber) {
				locators.avgUtilization
					.asControl()
					.getProperty("text")
					.then(function (text) {
						let value = parseInt(text);
						expect(value).toBeGreaterThanOrEqual(iNumber);
					});
			},

			theAvgUtilizationIsGreaterThan: function (iNumber) {
				locators.avgUtilization
					.asControl()
					.getProperty("text")
					.then(function (text) {
						let value = parseInt(text);
						expect(value).toBeGreaterThan(iNumber);
					});
			},


			theTotalResourcesLabelIsVisible: function () {
				let sMsg = "Then.onTheHeaderPage.theTotalResourcesLabelIsVisible()";
				expect(locators.totalResourcesLabel.isPresent()).toBeTruthy(sMsg);
			},

			theTotalResourcesNumberIs: function (iNumber) {
				locators.totalResources.getText().then(function (text) {
					let value = parseInt(text);
					expect(value).toBeGreaterThanOrEqual(iNumber);
				});
			},

			theFreeResourcesLabelIsVisible: function () {
				let sMsg = "Then.onTheHeaderPage.theFreeResourcesLabelIsVisible()";
				expect(locators.freeResourcesLabel.isPresent()).toBeTruthy(sMsg);
			},

			theFreeResourcesNumberIs: function (iNumber) {
				locators.freeResources.getText().then(function (text) {
					let value = parseInt(text);
					expect(value).toBeGreaterThanOrEqual(iNumber);
				});
			},

			theOverbookedResourcesLabelIsVisible: function () {
				let sMsg = "Then.onTheHeaderPage.theOverbookedResourcesLabelIsVisible()";
				expect(locators.overbookedResourcesLabel.isPresent()).toBeTruthy(sMsg);
			},

			theOverbookedResourcesNumberIs: function (iNumber) {
				locators.overbookedResources.getText().then(function (text) {
					let value = parseInt(text);
					expect(value).toBeGreaterThanOrEqual(iNumber);
				});
			}
		}
	}
});
