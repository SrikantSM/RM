const locators = require("../locators/variantLocators");

module.exports = createPageObjects({
	Variant: {
		arrangements: {},
		actions: {
			pressOpenButton: function () {
				locators.openButton.click();
			},
			pressManageButton: function () {
				locators.manageButton.click();
			},
			pressSaveAsButton: function () {
				locators.saveAsButton.click();
			},
			selectStandardAsDefaultVariant:function ()
			{
				locators.selectDefaultVariant.click();
			},
			pressSaveAsDefaultVariant:function () {
				locators.saveAsDefault.click();
			},
			enterName: function (sName) {
				locators.nameInput.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "A"));
				locators.nameInput.sendKeys(protractor.Key.BACK_SPACE);
				locators.nameInput.sendKeys(sName);
			},
			pressVariantSaveButton: function () {
				locators.variantSaveButton.click();
			},
			pressManagementSaveButton: function () {
				locators.managementSaveButton.click();
			},
			pressVariantItem: function (sText) {
				locators.variantItem(sText).click();
			},
			pressDeleteButtonsUntilNotPresent: function () {
				var bBreak = false;
				for (var i = 0; i < 10; i++) {
					locators.deleteButton.isPresent().then(function (bPresent) {
						if (bPresent) {
							locators.deleteButton.click();
						} else {
							bBreak = true;
						}
					});
					if (bBreak) {
						break;
					}
				}
			}
		},
		assertions: {
			theVariantPopoverIsOpen: function () {
				let sMsg = "Then.onTheVariantPage.theVariantPopoverIsOpen()";
				expect(locators.variantPopover.isPresent()).toBeTruthy(sMsg);
			}
		}
	}
});