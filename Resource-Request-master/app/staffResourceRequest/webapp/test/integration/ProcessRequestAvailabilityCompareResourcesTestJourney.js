sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/opaQunit'
], function (Opa5, opaTest) {


    QUnit.module('Staff Resource Request - Availability Comparison');

    opaTest('Should collapse Skill Comparison Panel and expand Availability comparison panel', function (Given, When, Then) {
        When.onTheCompareResourcesPage
            .iExpandSkillComparisonPanel(false);

        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithProperty("sap.m.Panel",{
                headerText: "Skills Comparison",
                expanded: false
            });

        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithProperty("sap.m.Panel",{
                headerText: "Availability Comparison",
                expanded: false
            });

        When.onTheCompareResourcesPage
            .iExpandAvailabilityComparisonPanel(true);

        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithProperty("sap.m.Panel",{
                headerText: "Availability Comparison",
                expanded: true
            });

        // Check Availability match object status for Resource 1
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.ObjectStatus",{
                text: "10%"
            },{
                path: "/0",
                propertyPath: "availMatchPercentage",
                modelName: "resourcesToShow"
            });

        // Availability Details for Resource 1
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                actualValueLabel: "500",
                targetValueLabel: "0",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/0",
                propertyPath: "resourceAvailability",
                modelName: "resourcesToShow"
            });

        // Check Availability match object status for Resource 2
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.ObjectStatus",{
                text: "40%"
            },{
                path: "/1",
                propertyPath: "availMatchPercentage",
                modelName: "resourcesToShow"
            });

        // Availability Details for Resource 2
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                actualValueLabel: "250",
                targetValueLabel: "0",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/1",
                propertyPath: "resourceAvailability",
                modelName: "resourcesToShow"
            });
    });

    opaTest('Validate details for next page', function (Given, When, Then) {
        When.onTheCompareResourcesPage.iClickOnNextPageInCarousel();

        // Check Availability match object status for Resource 2
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.ObjectStatus",{
                text: "40%"
            },{
                path: "/0",
                propertyPath: "availMatchPercentage",
                modelName: "resourcesToShow"
            });

        // Availability Details for Resource 2
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                actualValueLabel: "250",
                targetValueLabel: "0",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/0",
                propertyPath: "resourceAvailability",
                modelName: "resourcesToShow"
            });

        // Check Availability match object status for Resource 3
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.ObjectStatus",{
                text: "30%"
            },{
                path: "/1",
                propertyPath: "availMatchPercentage",
                modelName: "resourcesToShow"
            });

        // Availability Details for Resource 3
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                actualValueLabel: "470",
                targetValueLabel: "0",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/1",
                propertyPath: "resourceAvailability",
                modelName: "resourcesToShow"
            });

    });

    opaTest('Validate details for previous page', function (Given, When, Then) {
        When.onTheCompareResourcesPage.iClickOnPreviousPageInCarousel();

        // Check Availability match object status for Resource 1
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.ObjectStatus",{
                text: "10%"
            },{
                path: "/0",
                propertyPath: "availMatchPercentage",
                modelName: "resourcesToShow"
            });

        // Availability Details for Resource 1
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                actualValueLabel: "500",
                targetValueLabel: "0",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/0",
                propertyPath: "resourceAvailability",
                modelName: "resourcesToShow"
            });

        // Check Availability match object status for Resource 2
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.ObjectStatus",{
                text: "40%"
            },{
                path: "/1",
                propertyPath: "availMatchPercentage",
                modelName: "resourcesToShow"
            });

        // Availability Details for Resource 2
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                actualValueLabel: "250",
                targetValueLabel: "0",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/1",
                propertyPath: "resourceAvailability",
                modelName: "resourcesToShow"
            });
    });

    opaTest('ProcessRequest - Teardown', function (Given, When, Then) {
        When.iTeardownMyAppFrame();
        Then.waitFor({
            success: function () {
                Opa5.assert.ok(true, "teardown successful");
            }
        });
    });


});

