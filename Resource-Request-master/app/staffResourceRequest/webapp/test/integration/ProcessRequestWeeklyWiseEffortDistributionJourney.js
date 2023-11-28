sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/opaQunit"], function (
    Opa5,
    opaTest
) {


    QUnit.module('Week-wise Effort Distribution | View');

    opaTest('Should open the resource request and validate weekly effort distribution is selected', function (
        Given,
        When,
        Then
    ) {
        // open Object Page
        Given.iStartMyApp('f33a71e7-6363-43a8-8374-8ace063d7822');

        Then
            .onTheResourceRequestObjectPage
            .iShouldSeeTheFormElementWithLabelWithAncestorAndValue(
                'sap.m.Label',
                {text: "Required Effort"},
                {id: "staffResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest"},
                'sap.m.Link',
                {text: "100.00 hr", enabled: true}
            )
            .and.iShouldSeeTheFormElementWithLabelAndValueIdAndBindingPath(
                'sap.m.Label',
                {
                    text: 'Effort Distribution'
                },
                null,
                'sap.m.Text',
                {
                    text: "Weekly Effort"
                },
                {
                    propertyPath: "effortDistributionType/description"
                }
            );
    });


    opaTest('I open calendar view and validate data', function (Given, When, Then) {

        When
            .onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithBindingPathAndProperty('sap.m.Link',
                {
                    propertyPath: "requestedCapacity"
                },
                {
                    text: "100.00 hr",
                    enabled: true
                }
            );
        Then
            .onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', {
                title: "Effort Distribution"
            })
            .and.iShouldSeeTheVBoxWithLabelAndBindingPathAndValue('sap.m.Label', {
                text: "Requested Time Period"
            },
            'sap.m.Text', {
                text: "Jan 25, 2020 - Apr 12, 2020"
            }, {
                propertyPath: "startDate"
            });
    });

    opaTest("Validate data in dialog", function (
        Given,
        When,
        Then
    ) {

        // Validate efforts in dialog as text and not input.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text",{
                text : "10 hr"
            },{
                path: "/currDetails/2020/data/Q1 2020/months/0",
                propertyPath: "weeks/3/value",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text",{
                text : "8 hr"
            },{
                path: "/currDetails/2020/data/Q1 2020/months/1",
                propertyPath: "weeks/1/value",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text",{
                text : "8 hr"
            },{
                path: "/currDetails/2020/data/Q1 2020/months/2",
                propertyPath: "weeks/1/value",
                modelName: "currentQuarterModel"
            });
        // Change Quarter
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementWithoutPrefix('weekWiseCalendar--quarterPicker')
            .and.iClickOnTheElementWithAncestorBindingPath("sap.m.Button",{
                text: "Q2"
            },"sap.m.SegmentedButton",{
                path: "/currDetails/2020",
                propertyPath: "selectedKey",
                modelName: "currentQuarterModel"
            });
        // Validate more records.
        Then.onTheResourceRequestObjectPage
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text",{
                text : "8 hr"
            },{
                path: "/currDetails/2020/data/Q2 2020/months/0",
                propertyPath: "weeks/0/value",
                modelName: "currentQuarterModel"
            })
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text",{
                text : "10 hr"
            },{
                path: "/currDetails/2020/data/Q2 2020/months/0",
                propertyPath: "weeks/1/value",
                modelName: "currentQuarterModel"
            });
        // validate total in dialog.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '100',
                unit: 'hours'
            }, {
                propertyPath: "/totalEffort",
                modelName: "currentQuarterModel"
            });

        // Click OK to close dialog
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'OK'
            });
    });

    opaTest("Teardown", function (
        Given,
        When,
        Then
    ) {
        When.iTeardownMyAppFrame();
        Opa5.assert.ok(true, "teardown triggered successfully");
    });

});
