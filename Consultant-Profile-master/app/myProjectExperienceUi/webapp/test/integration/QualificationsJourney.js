sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
    "use strict";

    var Journey = {
        run: function () {
            QUnit.module('Consultant Profile Qualifications');

            opaTest('On object page I can navigate to skills subsection', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.iGoToSection('Qualifications');
                // Assertions
                Then.onTheObjectPage.iShouldSeeTheTable("fe::table::skills::LineItem-innerTable", "Skills (2)");
                Then.onTheObjectPage.onTable({ property: "skills" })
                    .iCheckColumns(2, {
                        "Skill": { headerVisible: true },
                        "Proficiency Level": { headerVisible: true }
                    }).and.iCheckRows(2);
            });

            opaTest('On object page, on click of a skill from skills subsection, I should see a popover', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.onTable({ property: "skills" }).iPressCell({ 0: "CDS test" }, "Skill");
                // Assertions
                Then.onTheObjectPage.iShouldSeeTheElementTypeWithProperty('sap.m.Popover', { title: "" });
            });
        }
    };
    return Journey;
});
