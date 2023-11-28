sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/opaQunit'
], function (Opa5, opaTest) {


    QUnit.module('Day-wise Effort Distribution | View');

    opaTest('Validate effort distribution type and required effort', function (Given, When, Then) {

        Given.iStartMyApp('16b79902-afa0-4bef-9658-98cd8d671212');

        Then
            .onTheResourceRequestObjectPage
            .iShouldSeeTheFormElementWithLabelWithAncestorAndValue(
                'sap.m.Label',
                {text: "Required Effort"},
                {id: "staffResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest"},
                'sap.m.Link',
                {text: "472.00 hr", enabled: true}
            )
            .and.iShouldSeeTheFormElementWithLabelAndValueIdAndBindingPath(
                'sap.m.Label',
                {
                    text: 'Effort Distribution'
                },
                null,
                'sap.m.Text',
                {
                    text: "Daily Effort"
                },
                {
                    propertyPath: "effortDistributionType/description"
                }
            );
    });

    // Check Set My Responsibility  of Resource Request
    opaTest('I open calendar view and validate data', function (Given, When, Then) {

        //Check if the object page contains set my responsibility button
        When
            .onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithBindingPathAndProperty('sap.m.Link',
                {
                    propertyPath: "requestedCapacity"
                },
                {
                    text: "472.00 hr",
                    enabled: true
                }
            );
        Then
            .onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', {
                title: "Effort Distribution"
            })
            .and.iShouldSeeTheVBoxWithLabelAndBindingPathAndValue('sap.m.Text', {
                text: "Requested Time Period"
            },
            'sap.m.Text', {
                text: "Jan 1, 2019 - Feb 28, 2019"
            }, {
                propertyPath: "startDate"
            })
            .and.iShouldSeeTheElementWithoutPrefix('monthcalendar--MonthDatePicker',
                {
                    value: '1/1/19'
                })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '472',
                unit: 'hours'
            }, {
                propertyPath: "/totalEffort",
                modelName: "currMonth"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: "0 hr"
            }, {
                path: "/currMonthData/weeks/0",
                propertyPath: "mon/value",
                modelName: "currMonth"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: "8 hr"
            }, {
                path: "/currMonthData/weeks/0",
                propertyPath: "tue/value",
                modelName: "currMonth"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: "8 hr"
            }, {
                path: "/currMonthData/weeks/4",
                propertyPath: "thu/value",
                modelName: "currMonth"
            });
        // Change Month
        When
            .onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty(
                "sap.ui.core.Icon",
                {
                    src: {
                        regex: {
                            source: "feeder\\-arrow"
                        }
                    }
                });
        Then
            .onTheResourceRequestObjectPage
            .iShouldSeeTheElementWithoutPrefix('monthcalendar--MonthDatePicker',
                {
                    value: '2/1/19'
                })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: "8 hr"
            }, {
                path: "/currMonthData/weeks/0",
                propertyPath: "fri/value",
                modelName: "currMonth"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: "8 hr"
            }, {
                path: "/currMonthData/weeks/4",
                propertyPath: "thu/value",
                modelName: "currMonth"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: "0 hr"
            }, {
                path: "/currMonthData/weeks/4",
                propertyPath: "fri/value",
                modelName: "currMonth"
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
