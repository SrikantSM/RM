const locators = require("../locators/flpLocators");

module.exports = createPageObjects({
	Flp: {
		arrangements: {},
		actions: {
			iClickTileManageResourceUtilization: function () {
				locators.tiles.manageResourceUtilization.click();
			},
			iClickTileStaffResourceRequest: function () {
				locators.tiles.staffResourceRequest.click();
			},
			iClickBack: function () {
				locators.header.backButton.click();
			},
			iClickHomeButton: function () {
				locators.header.homeButton.click();
			},
			waitForInitialAppLoad: function (elementId) {
				browser.driver.wait(
					() => browser.driver.findElements(by.id(elementId)).then((elements) => !!elements.length),
					browser.getPageTimeout,
					"Waiting for app load to finish"
				);
			}
		},
		assertions: {
			theTileManageResourceUtilizationIsVisible: function () {
				let sMsg = "Then.onTheFlpPage.theTileManageResourceUtilizationIsVisible()";
				expect(locators.tiles.manageResourceUtilization.isPresent()).toBeTruthy(sMsg);
			},
			theKPITileNumericContentIsVisible:async function () {
				let sMsg="Then.onTheFlpPage.theKPITileNumericContentIsVisible()";
				let oControl = await locators.tiles.theKPITileNumericContent;
				expect(oControl.asControl().getProperty("visible")).toBeTruthy(sMsg);
			},
			theKPITileFooterTextIsVisible:async function () {
				let sMsg="Then.onTheFlpPage.theKPITileFooterTextIsVisible()";
				let oControl = await locators.tiles.theKPITileFooterText;
				expect(oControl.asControl().getProperty("visible")).toBeTruthy(sMsg);
			},
			theTileManageResourceUtilizationIsNotVisible: function () {
				let sMsg = "Then.onTheFlpPage.theTileManageResourceUtilizationIsNotVisible()";
				expect(locators.tiles.manageResourceUtilization.isPresent()).toBeFalsy(sMsg);
			}
		}
	}
});