sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/opaQunit'
], function (Opa5, opaTest) {


    QUnit.module('Staff Resource Request - CompareResources');

    opaTest('Validate compare resources journey', function (Given, When, Then) {

        const BASIC_URL = "/ResourceRequests(16b79902-afa0-4bef-9658-98cd8d671212)/matchingCandidates";

        Given.iStartMyApp('16b79902-afa0-4bef-9658-98cd8d671212');


        When.onTheResourceRequestObjectPage.iClickOnTheElement("fe::ObjectPage-anchBar-staffResourceRequest::ResourceRequestObjectPage--fe::FacetSection::MatchingCandidates-anchor")
            .and.iClickOnTheElementWithAncestorBindingPathDetails(
                {
                    path: BASIC_URL + "(resourceRequest_ID=16b79902-afa0-4bef-9658-98cd8d671212,resource_ID=3f0c80ff-8573-485a-8413-48855551631d)"
                })
            .and.iClickOnTheElementWithAncestorBindingPathDetails(
                {
                    path: BASIC_URL + "(resourceRequest_ID=16b79902-afa0-4bef-9658-98cd8d671212,resource_ID=3c51b7c6-dbfb-47ab-ae98-e3e1557d1c5d)"
                })
            .and.iClickOnTheElementWithAncestorBindingPathDetails(
                {
                    path: BASIC_URL + "(resourceRequest_ID=16b79902-afa0-4bef-9658-98cd8d671212,resource_ID=742e3684-3b44-11ea-b77f-2e728ce88125)"
                })
            .and.iClickOnTheElement("fe::table::matchingCandidates::LineItem::CustomAction::CompareAction",
                {
                    text: "Compare (3)"
                });


        Then.onTheCompareResourcesPage.iShouldSeeTheElementTypeWithProperty("sap.m.Title",{text: "Resource Comparison"})
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.f.cards.Header",
                {
                    title: "Mr. Fantastic",
                    subtitle: "Employee\nUser Assistance Developer",
                    iconDisplayShape : "Circle"
                },
                {
                    path: "/0",
                    propertyPath: "resourceName",
                    modelName: "resourceModel"
                }
            )
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.ObjectStatus",{
                text: "100%"
            },{
                path: "/0",
                propertyPath: "totalMatchPercentage",
                modelName: "resourceModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.ComparisonMicroChartData",{
                value: 50,
                title:"Skills Match",
                color:"Critical"
            },{
                path: "/0",
                propertyPath: "skillMatchPercentage",
                modelName: "resourceModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.ComparisonMicroChartData",{
                value: 10,
                title:"Availability Match",
                color:"Error"
            },{
                path: "/0",
                propertyPath: "availMatchPercentage",
                modelName: "resourceModel"
            })

            // Card 2
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.f.cards.Header",
                {
                    title: "Charles Xavier",
                    subtitle: "Employee\nUser Assistance Developer",
                    iconDisplayShape : "Circle"
                },
                {
                    path: "/1",
                    propertyPath: "resourceName",
                    modelName: "resourceModel"
                }
            )
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.ObjectStatus",{text: "80%"},{
                path: "/1",
                propertyPath: "totalMatchPercentage",
                modelName: "resourceModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.ComparisonMicroChartData",{
                value: 20,
                title:"Skills Match",
                color:"Error"
            },{
                path: "/1",
                propertyPath: "skillMatchPercentage",
                modelName: "resourceModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.suite.ui.microchart.ComparisonMicroChartData",{
                value: 40,
                title:"Availability Match",
                color:"Error"
            },{
                path: "/1",
                propertyPath: "availMatchPercentage",
                modelName: "resourceModel"
            });
    });

    // Validate expand, close, collapse-header,pin-header in the screen

    opaTest('Validate the visibility of the buttons', function (Given, When, Then) {

        Then.onTheCompareResourcesPage.iShouldSeeTheElementWithoutPrefix("application-ResourceRequest-Display-component---CompareResources--enterFullScreenBtn-img",
            {src: "sap-icon://full-screen"})
            .and.iShouldSeeTheElementTypeWithProperty("sap.ui.core.Icon",{src: "sap-icon://decline"})
            .and.iShouldSeeTheElementTypeWithProperty("sap.ui.core.Icon",{src: "sap-icon://pushpin-off"});

    });


    // Validate on Close of flexible column layout , single object page opened
    opaTest('Validate expand button', function (Given, When, Then) {

        When.onTheCompareResourcesPage.iClickOnTheElementWithoutPrefix("application-ResourceRequest-Display-component---CompareResources--enterFullScreenBtn-img");
        Then.onTheCompareResourcesPage.iShouldSeeTheElementWithoutPrefixInFlexibleColumnLayout("appContent",{layout : "MidColumnFullScreen"});

    });

    // Validate on Close of flexible column layout , single object page opened
    opaTest('Validate close button', function (Given, When, Then) {

        When.onTheCompareResourcesPage.iClickOnTheElementWithProperties("sap.ui.core.Icon",{
            src: {
                regex: {
                    source: "decline"
                }
            }
        });
        Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithoutPrefixInFlexibleColumnLayout("appContent",{
            layout : "OneColumn"
        });

    });


});
