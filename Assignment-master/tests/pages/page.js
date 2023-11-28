const locators = require("../locators/pageLocators");

var sComponentId = "application-capacity-Display-component";
var sPageViewId = sComponentId + "---idPage";

module.exports = createPageObjects({
	Page: {
		arrangements: {},
		actions: {
			pressSaveButton: function () {
				locators.getSaveButton().click();
			},

			pressCancelButton: function () {
				locators.getCancelButton().click();
			},

			pressShowAllColumnsButton: function () {
				locators.getShowAllColumnsButton().click();
			},

			pressHideLeadingColumnsButton: function () {
				locators.getHideLeadingColumnsButton().click();
			},

			pressCancelConfirmationOKButton: function () {
				locators.getCancelConfirmationOKButton().click();
			},

			pressMessagePopoverButton: function () {
				locators.mesasagePopoverButton.click();
			},

			pressMessagePopoverCloseButton: function () {
				locators.getMessagePopoverCloseButton().click();
			},

			pressMsgDialogCloseButton: function () {
				locators.getMsgDialogCloseButton().click();
			}
		},
		assertions: {
			theErrorPopoverIsVisible: function () {
				let sMsg = "Then.onThePagePage.theErrorPopoverIsVisible()";
				expect(locators.errorMessage.isPresent()).toBeTruthy(sMsg);
			},

			theErrorPopoverIsNotVisible: function () {
				let sMsg = "Then.onThePagePage.theErrorPopoverIsNotVisible()";
				expect(locators.errorMessage.isPresent()).toBeFalsy(sMsg);
			},

			theFooterIsVisible: function () {
				let sMsg = "Then.onThePagePage.theFooterIsVisible()";
				expect(locators.footerToolbar.isPresent()).toBeTruthy(sMsg);
			},

			theAppIsVisible: function () {
				let sAppId = sPageViewId + "--app";
				browser.driver.wait(
					() => browser.driver.findElements(by.id(sAppId)).then((elements) => !!elements.length),
					browser.getPageTimeout,
					"Then.onThePagePage.theAppIsVisible"
				);
			},

			theMessagesButtonIsNotVisible: function () {
				let sMsg = "Then.onThePagePage.theMessagesButtonIsNotVisible()";
				expect(locators.mesasagePopoverButton.isPresent()).toBeFalsy(sMsg);
			},

			thePopoverMessageContains: function (sMsg) {
				expect(locators.getPopoverMessage(sMsg).isPresent()).toBeTruthy();
			},
			theMsgDialogTitleTextIs: function (sText) {
				expect(locators.getMsgDialogTitleText().asControl().getProperty("text")).toEqual(sText);
			},

			theMsgDialogDescTextIs: function (sText) {
				expect(locators.getMsgDialogDescText().asControl().getProperty("text")).toEqual(sText);
			},

			theMsgDialogIsNotVisible: function () {
				expect(locators.getMsgDialog().isPresent()).toBeFalsy();
			}
			
		}
	}
});