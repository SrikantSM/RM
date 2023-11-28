const locators = require("../locators/quickViewLocators");

module.exports = createPageObjects({
	QuickView: {
		arrangements: {},
		actions: {
			pressResourceNameLink: function (resourceName) {
				locators.resourcePopupTitleLink(resourceName).click();
			},
			pressWorkPackageLink: function (workPackage) {
				locators.workPackageLink(workPackage).click();
			}
		},
		assertions: {
			theContactPopupIsVisible: function () {
				let sMsg = "Then.onTheQuickViewPage.theContactPopupIsVisible()";
				expect(locators.contactDetailsPopUp.isPresent()).toBeTruthy(sMsg);
			},

			theElementIsVisible: function (sControl, sText) {
				let sMsg = "Then.onTheQuickViewPage.theElementIsVisible(" + sControl + "," + sText + ")";
				expect(locators.contactDetailsElement(sControl, sText).isPresent()).toBeTruthy(sMsg);
			}
		}
	}
});
