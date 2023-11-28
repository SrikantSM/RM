const locators = require("../locators/persoDialogLocators");
const tablelocators = require("../locators/tableLocators");

module.exports = createPageObjects({
	PersoDialog: {
		arrangements: {},
		actions: {
			selectCheckBox: function (iIndex) {
				locators.getCheckBoxesinPersonalizationDialog().then(function (aCheckBoxes) {
					aCheckBoxes[iIndex].sendKeys(protractor.Key.ENTER);
				});
			},
			pressCancelButton: function () {
				locators.getCancelBtnInPersonalizationDialog().click();
			},
			pressOkButton: function () {
				locators.getOKBtnInPersonalizationDialog().click();
			},
			pressResetButton: function () {
				locators.getResetBtnInPersonalizationDialog().click();
			}
		},
		assertions: {
			theDialogIsOpen: function () {
				let sMsg = "Then.onThePersoDialogPage.theDialogIsOpen()";
				tablelocators.getSettingsBtn().click();
				expect(locators.getPersonalizationDialog().isPresent()).toBeTruthy(sMsg);
			}
		}
	}
});
