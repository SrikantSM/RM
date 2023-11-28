sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/opaQunit'
], function (Opa5, opaTest) {


    QUnit.module('Staff Resource Request - Skill Comparison');

    opaTest('Navigate to Resource Comparison', function (Given, When, Then) {

        const MATCHING_SECTION = "fe::ObjectPage-anchBar-staffResourceRequest::ResourceRequestObjectPage--fe::FacetSection::MatchingCandidates-anchor";
        const COMPARE_ACTION = "fe::table::matchingCandidates::LineItem::CustomAction::CompareAction";


        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(MATCHING_SECTION)
            .and.iClickOnTheElement(COMPARE_ACTION,{
                text: "Compare (3)"
            });


        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithProperty("sap.m.Title",{
                text: "Resource Comparison"
            });

        // Skill Comparison panel should be expanded by default
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithProperty("sap.m.Panel",{
                headerText: "Skills Comparison",
                expanded: true
            });

        // Check Skill match object status
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.ObjectStatus",{
                text: "50%"
            },{
                path: "/0",
                propertyPath: "skillMatchPercentage",
                modelName: "resourcesToShow"
            });

        // Check Skill compare table columns and group headers
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementWithAncestorBindingPath("sap.m.Text", {
                text: "Skill"
            }, "sap.m.Table", {
                path: "/0",
                propertyPath: "resourceSkills/",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementWithAncestorBindingPath("sap.m.Text", {
                text: "Proficiency Level"
            }, "sap.m.Table", {
                path: "/0",
                propertyPath: "resourceSkills/",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementWithAncestorBindingPath("sap.m.GroupHeaderListItem", {
                title: "Mandatory Skills"
            }, "sap.m.Table", {
                path: "/0",
                propertyPath: "resourceSkills/",
                modelName: "resourcesToShow"
            });

        // Skill Details for Resource 1
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "Core Data Service"
            }, {
                path: "/0/resourceSkills/0",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                targetValue: 1,
                maxValue: 1,
                targetValueLabel: "1",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/0/resourceSkills/0",
                propertyPath: "skillThresholds",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "NodeJavaScript"
            }, {
                path: "/0/resourceSkills/1",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                targetValue: 2,
                maxValue: 3,
                targetValueLabel: "2",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/0/resourceSkills/1",
                propertyPath: "skillThresholds",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "Cloud Foundry"
            }, {
                path: "/0/resourceSkills/2",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                targetValue: 2,
                targetValueLabel: "2",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/0/resourceSkills/2",
                propertyPath: "skillThresholds",
                modelName: "resourcesToShow"
            });

        // Skill Details for Resource 2

        // Check Skill match object status
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.ObjectStatus",{
                text: "20%"
            },{
                path: "/1",
                propertyPath: "skillMatchPercentage",
                modelName: "resourcesToShow"
            });

        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "Core Data Service"
            }, {
                path: "/1/resourceSkills/0",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                targetValue: 1,
                maxValue: 1,
                targetValueLabel: "1",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/1/resourceSkills/0",
                propertyPath: "skillThresholds",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "NodeJavaScript"
            }, {
                path: "/1/resourceSkills/1",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                targetValue: 2,
                maxValue: 3,
                targetValueLabel: "2",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/1/resourceSkills/1",
                propertyPath: "skillThresholds",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "Cloud Foundry"
            }, {
                path: "/1/resourceSkills/2",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                targetValue: 2,
                targetValueLabel: "2",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/1/resourceSkills/2",
                propertyPath: "skillThresholds",
                modelName: "resourcesToShow"
            });
    });

    opaTest('Validate details for next page', function (Given, When, Then) {
        When.onTheCompareResourcesPage.iClickOnNextPageInCarousel();

        // Skill Details for Resource 2

        // Check Skill match object status
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.ObjectStatus",{
                text: "20%"
            },{
                path: "/0",
                propertyPath: "skillMatchPercentage",
                modelName: "resourcesToShow"
            });

        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "Core Data Service"
            }, {
                path: "/0/resourceSkills/0",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                targetValue: 1,
                maxValue: 1,
                targetValueLabel: "1",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/0/resourceSkills/0",
                propertyPath: "skillThresholds",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "NodeJavaScript"
            }, {
                path: "/0/resourceSkills/1",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                targetValue: 2,
                targetValueLabel: "2",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/1/resourceSkills/1",
                propertyPath: "skillThresholds",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "Cloud Foundry"
            }, {
                path: "/0/resourceSkills/2",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                targetValue: 2,
                targetValueLabel: "2",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/0/resourceSkills/2",
                propertyPath: "skillThresholds",
                modelName: "resourcesToShow"
            });

        // Skill Details for Resource 3

        // Check Skill match object status
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.ObjectStatus",{
                text: "30%"
            },{
                path: "/1",
                propertyPath: "skillMatchPercentage",
                modelName: "resourcesToShow"
            });

        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "Core Data Service"
            }, {
                path: "/1/resourceSkills/0",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                targetValue: 1,
                targetValueLabel: "1",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/1/resourceSkills/0",
                propertyPath: "skillThresholds",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "NodeJavaScript"
            }, {
                path: "/1/resourceSkills/1",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "Cloud Foundry"
            }, {
                path: "/1/resourceSkills/2",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            });
    });

    opaTest('Validate details for previous page', function (Given, When, Then) {
        When.onTheCompareResourcesPage.iClickOnPreviousPageInCarousel();

        // Skill Details for Resource 1

        // Check Skill match object status
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.ObjectStatus",{
                text: "50%"
            },{
                path: "/0",
                propertyPath: "skillMatchPercentage",
                modelName: "resourcesToShow"
            });

        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "Core Data Service"
            }, {
                path: "/0/resourceSkills/0",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                targetValue: 1,
                maxValue: 1,
                targetValueLabel: "1",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/0/resourceSkills/0",
                propertyPath: "skillThresholds",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "NodeJavaScript"
            }, {
                path: "/0/resourceSkills/1",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                targetValue: 2,
                maxValue: 3,
                targetValueLabel: "2",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/0/resourceSkills/1",
                propertyPath: "skillThresholds",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "Cloud Foundry"
            }, {
                path: "/0/resourceSkills/2",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                targetValue: 2,
                targetValueLabel: "2",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/0/resourceSkills/2",
                propertyPath: "skillThresholds",
                modelName: "resourcesToShow"
            });

        // Skill Details for Resource 2

        // Check Skill match object status
        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.ObjectStatus",{
                text: "20%"
            },{
                path: "/1",
                propertyPath: "skillMatchPercentage",
                modelName: "resourcesToShow"
            });

        Then.onTheCompareResourcesPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "Core Data Service"
            }, {
                path: "/1/resourceSkills/0",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                targetValue: 1,
                maxValue: 1,
                targetValueLabel: "1",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/1/resourceSkills/0",
                propertyPath: "skillThresholds",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "NodeJavaScript"
            }, {
                path: "/1/resourceSkills/1",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                targetValue: 2,
                maxValue: 3,
                targetValueLabel: "2",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/1/resourceSkills/1",
                propertyPath: "skillThresholds",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text", {
                text: "Cloud Foundry"
            }, {
                path: "/1/resourceSkills/2",
                propertyPath: "requestedSkillName",
                modelName: "resourcesToShow"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.BulletMicroChart", {
                targetValue: 2,
                targetValueLabel: "2",
                showActualValue: true,
                showTargetValue: true,
                showThresholds: true
            }, {
                path: "/1/resourceSkills/2",
                propertyPath: "skillThresholds",
                modelName: "resourcesToShow"
            });
    });

});
