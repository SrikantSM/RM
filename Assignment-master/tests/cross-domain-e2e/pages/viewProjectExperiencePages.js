const viewProjectExperiencePage = require("../pages/locators/viewProjectExperienceObjectPage");

module.exports = createPageObjects({
	ProjectExperienceView: {
		arrangements: {},
		actions: {},
		assertions: {
			theViewProjectExperienceAppToBePresent: function () {
				expect(viewProjectExperiencePage.display.appTitle.isPresent()).toBeTruthy();
			},

			theOrganizationInformationFacettoBePresent: function () {
				expect(viewProjectExperiencePage.display.orgInfo.isPresent()).toBeTruthy();
			},

			theContactInformationFacettoBePresent: function () {
				expect(viewProjectExperiencePage.display.contactInfo.isPresent()).toBeTruthy();
			},

			theaverageUtilIndicatortoBePresent: function () {
				expect(viewProjectExperiencePage.display.averageUtilIndicator.isPresent()).toBeTruthy();
			},

			theObjectPageShouldBePresent: function (sResName) {
				expect(viewProjectExperiencePage.display.objectPageHeaderTitle(sResName).isPresent()).toBeTruthy();
			},

			theTitleShoudBe: function (refValue) {
				viewProjectExperiencePage.display.objectPageHeaderTitle.getText().then(function (text) {
					expect(text).toContain(refValue);
				});
			}
		}
	}
});