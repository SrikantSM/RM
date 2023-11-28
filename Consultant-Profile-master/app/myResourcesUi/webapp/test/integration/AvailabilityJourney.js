sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
    "use strict";

    var Journey = {
        run: function () {

            QUnit.module('Resource Profile Availability');

            opaTest('On object page I can navigate to Availability section and see correct columns, controls', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.iGoToSection('Availability');
                // Assertions
                Then.onTheObjectPage.iShouldSeeTheTable("fe::table::periodicAvailability::LineItem-innerTable", "Monthly Availability (6)");
                Then.onTheObjectPage.onTable({ property: "periodicAvailability" }).iCheckColumns(5)
                    .and.iCheckColumns(5, {
                        "Month": { headerVisible: true },
                        "Available (Hours)": { headerVisible: true },
                        "Assigned (Hours)": { headerVisible: true },
                        "Free (Hours)": { headerVisible: true },
                        "Utilization (%)": { headerVisible: true }
                    })
                    .and.iCheckRows(6);
                Then.onTheObjectPage.iShouldSeeTheElementTypeWithProperty('sap.m.Button', { text: 'Settings' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Title', { text: 'Standard' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Button', { icon: 'sap-icon://slim-arrow-down' });
            });

            opaTest('On object page I can navigate to availability chart section and see correct controls', function (Given, When, Then) {
                // Actions
                When.onTheObjectPage.iGoToSection('Availability');
                // Assertions
                Then.onTheObjectPage.iShouldSeeTheElementTypeWithProperty('sap.ui.mdc.Chart', { header: "Monthly Utilization", chartType: "line" })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Title', { text: 'Monthly Utilization' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Text', { text: 'Month' })
                    .and.iShouldSeeTheElementWithId('fe::Chart::periodicUtilization::Chart--innerChart');
            });

            //Add/Remove columns check
            opaTest('On click of Add/Remove Columns icon, I should see correct number of columns and data.', function (Given, When, Then) {
                //Actions
                When.onTheObjectPage.onTable({ property: "periodicAvailability" }).iOpenColumnAdaptation();
                //Assertions
                Then.onTheObjectPage.onTable({ property: "periodicAvailability" }).iCheckAdaptationColumn("Month", { selected: true })
                    .and.iCheckAdaptationColumn("Available (Hours)", { selected: true })
                    .and.iCheckAdaptationColumn("Assigned (Hours)", { selected: true })
                    .and.iCheckAdaptationColumn("Free (Hours)", { selected: true })
                    .and.iCheckAdaptationColumn("Utilization (%)", { selected: true })
                    .and.iCheckAdaptationColumn("Month (YYYYMM)", { selected: false })
                    .and.iConfirmColumnAdaptation();
            });
        }
    };
    return Journey;
});
