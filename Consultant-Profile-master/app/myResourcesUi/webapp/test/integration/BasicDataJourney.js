sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
    "use strict";

    var Journey = {
        run: function () {
            QUnit.module('Resource Profile Basic Data');


            opaTest('I start the app; I can see 4 header field groups', function (Given, When, Then) {
                // Actions
                Then.onTheObjectPage.iSeeThisPage();
                // Assertions
                Then.onTheObjectPage.iShouldSeeTheFieldGroups(["", "Organizational Information", "Contact Information", "Average Utilization (Current Year)", "Change Record"], 'fe::ObjectPage');

            });

            opaTest('On the object page; I can see 4 header field groups, their names and profile photo control are correctly displayed', function (Given, When, Then) {
                // Assertions
                Then.onTheObjectPage.iShouldSeeTheFieldGroups(["", "Organizational Information", "Contact Information", "Average Utilization (Current Year)", "Change Record"], 'fe::ObjectPage')
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: 'Resource Organization:' })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: 'Office Location:' })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: 'Cost Center:' })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: 'Worker Type:' })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: 'Manager:' })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: 'Mobile:' })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: 'Email:' })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: 'Changed On:' })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: 'Changed By:' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.ProgressIndicator', { percentValue: 20 })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Avatar', { initials: 'TU' });
            });

            opaTest('On object page, I can see 4 sections and their names are correctly displayed', function (Given, When, Then) {
                // Assertions
                Then.onTheObjectPage.iSeeSectionWithTitle("Qualifications")
                    .and.iSeeSectionWithTitle("Availability")
                    .and.iSeeSectionWithTitle("Prior Experience")
                    .and.iSeeSectionWithTitle("Attachment");
                Then.onTheObjectPage.iShouldSeeSubSectionsUnderGivenSection(["Previous Roles", "Internal Work Experience", "External Work Experience"], 'fe::FacetSection::PriorExperience');
            });

            opaTest('In edit mode, on discard of changes made, I should see changes not reflected', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onHeader().iExecuteEdit();
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
