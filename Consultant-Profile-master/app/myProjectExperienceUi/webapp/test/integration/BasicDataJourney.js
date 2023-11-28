sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
    "use strict";

    var Journey = {
        run: function () {
            QUnit.module('Consultant Profile Basic Data');

            opaTest('On the object page header; I can see an edit button and four field groups', function (Given, When, Then) {
                // Arrangements
                Given.iResetTestData().and.iStartMyApp("myProjectExperienceUi-Display");
                // Actions
                Then.onTheObjectPage.iSeeThisPage();
                // Assertions
                Then.onTheObjectPage.onHeader().iCheckEdit({ visible: true, enabled: true, type: "Emphasized" });
                Then.onTheObjectPage
                    .iShouldSeeTheElementTypeWithProperty('sap.m.ProgressIndicator', { percentValue: 20 })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Avatar', { initials: 'TU' })
                    .and.iShouldSeeTheFieldGroups(["", "Organizational Information", "Contact Information", "Average Utilization (Current Year)", "Change Record"], 'fe::ObjectPage');
            });

            opaTest('On object page, I can see 3 sections and their names are correctly displayed', function (Given, When, Then) {
                // Assertions
                Then.onTheObjectPage.iSeeSectionWithTitle("Qualifications")
                    .and.iSeeSectionWithTitle("Availability")
                    .and.iSeeSectionWithTitle("Prior Experience");
                Then.onTheObjectPage.iShouldSeeSubSectionsUnderGivenSection(["Previous Roles", "Internal Work Experience", "External Work Experience"], 'fe::FacetSection::PriorExperience');
            });

            opaTest('In edit mode, I should see info for uploading image', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
                // Assertions
                Then.onTheObjectPage
                    .iShouldSeeTheElementTypeWithProperty('sap.m.ObjectStatus', { text: "This picture will be used across apps in resource management." });
            });

            opaTest('In edit mode, on discard of changes made, I should see changes not reflected', function (Given, When, Then) {
                // Assertions
                Then.onTheObjectPage
                    .iSeeObjectPageInEditMode()
                    .and.onFooter()
                    .iCheckDraftStateClear();
                // Actions
                When.onTheObjectPage.onTable({ property: "skills" })
                    .iChangeRow({ "Skill": "CDS test" },
                        { "Skill": "UI5 test" });
                // Assertions
                Then.onTheObjectPage.onFooter().iCheckDraftStateSaved();
                // Actions
                When.onTheObjectPage
                    .onFooter()
                    .iExecuteCancel()
                    .and.iConfirmCancel();
                // Assertions
                Then.onTheObjectPage.onHeader().iCheckEdit({ visible: true, enabled: true, type: "Emphasized" });
                Then.onTheObjectPage.onTable({ property: "skills" }).iCheckRows({ "Skill": "CDS test" });
            });
        }
    };
    return Journey;
});
