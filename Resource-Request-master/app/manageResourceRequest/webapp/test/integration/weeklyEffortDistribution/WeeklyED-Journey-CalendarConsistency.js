sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/opaQunit"], function (
    Opa5,
    opaTest
) {

    const CUSTOM_SUBSECTION_ID = 'fe::CustomSubSection::effortcustomSection--';
    const OBJECT_PAGE_ANCHOR_BAR = 'fe::ObjectPage-anchBar-manageResourceRequest::ResourceRequestObjectPage--fe::';

    ////////////////////////////////////////////////////////////////////////
    QUnit.module('Weekly Effort Distribution | Calendar Consistency');
    ////////////////////////////////////////////////////////////////////////

    opaTest('Validation Calendar Elements', function (
        Given,
        When,
        Then
    ){

        // Start App directly on Object Page
        Given.iStartMyApp('132656c2-f6e2-44de-9b00-43042f273e0d');

        // I click on the Edit action of the Object page
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Edit'
            });

        // Clicks on the pencil icon to edit the effort distribution
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor')
            .and.iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bCalendarEdit");

        // Validating the title of the dialog and the elements inside the dialog
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', {
                title: "Effort Distribution"
            })

            .and.iShouldSeeTheVBoxWithLabelAndBindingPathAndValue('sap.m.Label', {
                text: "Requested Time Period"
            },
            'sap.m.Text', {
                text: "Jan 25, 2019 - Feb 1, 2020"
            }, {
                propertyPath: "startDate"
            })
            .and.iShouldSeeTheElementWithProperties('weekWiseCalendar--quarterPicker',
                {
                    text: 'Q1 2019'
                })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '120',
                unit: 'hours'
            }, {
                propertyPath: "/totalEffort",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheVBoxWithLabelAndBindingPathAndValueEnabled(
                'sap.m.Label',
                {
                    text: 'CW4'
                },
                'sap.m.Input',
                {
                    value: '40',
                    enabled: true,
                    description: 'hr'
                },
                {
                    path: "/currDetails/2019/data/Q1 2019/months/0",
                    propertyPath: "weeks/3/enabled",
                    modelName: "currentQuarterModel"
                }, true)
            .and.iShouldSeeTheVBoxWithLabelAndBindingPathAndValueEnabled(
                'sap.m.Label',
                {
                    text: 'CW3'
                },
                'sap.m.Input',
                {
                    value: '0',
                    enabled: false,
                    description: 'hr'
                },
                {
                    path: "/currDetails/2019/data/Q1 2019/months/0",
                    propertyPath: "weeks/2/enabled",
                    modelName: "currentQuarterModel"
                }, false);

        // Open Quarter picker
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementWithId('weekWiseCalendar--quarterPicker');

        // Change quater ana validate effort
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementWithAncestorBindingPath("sap.m.Button",{
                text: "Q1"
            },"sap.m.SegmentedButton",{
                path: "/currDetails/2020",
                propertyPath: "selectedKey",
                modelName: "currentQuarterModel"
            });

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Input",{
                value : "40",
                description: "hr"
            },{
                path: "/currDetails/2020/data/Q1 2020/months/0",
                propertyPath: "weeks/4/enabled",
                modelName: "currentQuarterModel"
            });

        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'OK'
            });

    });

    opaTest('Validate visibiltity of the quarter navigation arrows based to requested time period', function (
        Given,
        When,
        Then
    ) {

        // Open calendar
        When.onTheResourceRequestObjectPage
            .and.iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bCalendarEdit");

        // Nav Back should be disabled and feeder should be enabled
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyEnabled('sap.m.Button', {
                enabled: true,
                icon: "sap-icon://feeder-arrow"
            }, true)
            .and.iShouldSeeTheElementTypeWithPropertyEnabled('sap.m.Button', {
                enabled: false,
                icon: "sap-icon://nav-back"
            }, false)
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Button', {
                text: "Q1 2019"
            });

        // Click on the feeder arrow to go to next quarter
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                icon: "sap-icon://feeder-arrow"
            });

        // Nav Back and feeder both should be enabled
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyEnabled('sap.m.Button', {
                enabled: true,
                icon: "sap-icon://feeder-arrow"
            }, true)
            .and.iShouldSeeTheElementTypeWithPropertyEnabled('sap.m.Button', {
                enabled: true,
                icon: "sap-icon://nav-back"
            }, true)
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Button', {
                text: "Q2 2019"
            });

        // Go to last Quarter
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementWithId('weekWiseCalendar--quarterPicker')
            .and.iClickOnTheElementWithAncestorBindingPath("sap.m.Button",{
                text: "Q1"
            },"sap.m.SegmentedButton",{
                path: "/currDetails/2020",
                propertyPath: "selectedKey",
                modelName: "currentQuarterModel"
            });

        // Nav Back should be enabled and feeder should be disabled
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyEnabled('sap.m.Button', {
                enabled: false,
                icon: "sap-icon://feeder-arrow"
            }, false)
            .and.iShouldSeeTheElementTypeWithPropertyEnabled('sap.m.Button', {
                enabled: true,
                icon: "sap-icon://nav-back"
            }, true)
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Button', {
                text: "Q1 2020"
            });

        // Click on the nav back to go to previous quarter
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                icon: "sap-icon://nav-back"
            });

        // Nav Back and feeder both should be enabled
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyEnabled('sap.m.Button', {
                enabled: true,
                icon: "sap-icon://feeder-arrow"
            }, true)
            .and.iShouldSeeTheElementTypeWithPropertyEnabled('sap.m.Button', {
                enabled: true,
                icon: "sap-icon://nav-back"
            }, true)
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Button', {
                text: "Q4 2019"
            });

        // Click on OK to close calendar
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'OK'
            });
    });

    opaTest('Validate visibiltity of the quarters based to requested time period', function (
        Given,
        When,
        Then
    ) {

        // Open calendar
        When.onTheResourceRequestObjectPage
            .and.iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bCalendarEdit");

        // Click on the current quarter to open dialog to show all quarters
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: "Q1 2019"
            });

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Popover', {
                title: "Select Quarter"
            });

        // Validate the visibility of quarters in the quarter selector
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementWithAncestorBindingPathEnabled("sap.m.Button",{
                text: "Q1",
                enabled: true
            },"sap.m.SegmentedButton",{
                path: "/currDetails/2019",
                propertyPath: "selectedKey",
                modelName: "currentQuarterModel"
            }, true)
            .and.iShouldSeeTheElementWithAncestorBindingPathEnabled("sap.m.Button",{
                text: "Q2",
                enabled: true
            },"sap.m.SegmentedButton",{
                path: "/currDetails/2019",
                propertyPath: "selectedKey",
                modelName: "currentQuarterModel"
            }, true)
            .and.iShouldSeeTheElementWithAncestorBindingPathEnabled("sap.m.Button",{
                text: "Q3",
                enabled: true
            },"sap.m.SegmentedButton",{
                path: "/currDetails/2019",
                propertyPath: "selectedKey",
                modelName: "currentQuarterModel"
            }, true)
            .and.iShouldSeeTheElementWithAncestorBindingPathEnabled("sap.m.Button",{
                text: "Q4",
                enabled: true
            },"sap.m.SegmentedButton",{
                path: "/currDetails/2019",
                propertyPath: "selectedKey",
                modelName: "currentQuarterModel"
            }, true)
            .and.iShouldSeeTheElementWithAncestorBindingPathEnabled("sap.m.Button",{
                text: "Q1",
                enabled: true
            },"sap.m.SegmentedButton",{
                path: "/currDetails/2020",
                propertyPath: "selectedKey",
                modelName: "currentQuarterModel"
            }, true)
            .and.iShouldSeeTheElementWithAncestorBindingPathEnabled("sap.m.Button",{
                text: "Q2",
                enabled: false
            },"sap.m.SegmentedButton",{
                path: "/currDetails/2020",
                propertyPath: "selectedKey",
                modelName: "currentQuarterModel"
            }, false)
            .and.iShouldSeeTheElementWithAncestorBindingPathEnabled("sap.m.Button",{
                text: "Q3",
                enabled: false
            },"sap.m.SegmentedButton",{
                path: "/currDetails/2020",
                propertyPath: "selectedKey",
                modelName: "currentQuarterModel"
            }, false)
            .and.iShouldSeeTheElementWithAncestorBindingPathEnabled("sap.m.Button",{
                text: "Q4",
                enabled: false
            },"sap.m.SegmentedButton",{
                path: "/currDetails/2020",
                propertyPath: "selectedKey",
                modelName: "currentQuarterModel"
            }, false);

        // Click on OK to close calendar
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
