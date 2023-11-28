sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/opaQunit"], function (
    Opa5,
    opaTest
) {

    const CUSTOM_SUBSECTION_ID = 'fe::CustomSubSection::effortcustomSection--';
    const OBJECTPAGE_PREFIX_ID =
        'manageResourceRequest::ResourceRequestObjectPage--';
    const OBJECT_PAGE_ANCHOR_BAR = 'fe::ObjectPage-anchBar-manageResourceRequest::ResourceRequestObjectPage--fe::';

    ////////////////////////////////////////////////////////////////////////
    QUnit.module('Daily Effort Distribution | Calendar Consistency');
    ////////////////////////////////////////////////////////////////////////

    opaTest('Validation Calendar Elements', function (
        Given,
        When,
        Then
    ){

        // Start App directly on Object Page
        Given.iStartMyApp('16b79902-afa0-4bef-9653-98cd8d67e2e9');

        // I click on the Edit action of the Object page
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Edit'
            });

        // Clicks on "Effort" tab and then clicks on the pencil icon to edit the effort distribution
        When.onTheResourceRequestObjectPage
            .and.iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor')
            .and.iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bCalendarEdit");

        // Validating the title of the dialog and the elements inside the dialog
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', {
                title: "Effort Distribution"
            })

            .and.iShouldSeeTheVBoxWithLabelAndBindingPathAndValue('sap.m.Text', {
                text: "Requested Time Period"
            },
            'sap.m.Text', {
                text: "Jan 25, 2019 - Feb 1, 2019"
            }, {
                propertyPath: "startDate"
            })
            .and.iShouldSeeTheElementWithProperties('monthcalendar--MonthDatePicker',
                {
                    value: '1/1/19'
                })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '64',
                unit: 'hours'
            }, {
                propertyPath: "/totalEffort",
                modelName: "currMonth"
            });

        // Clicking on the the arrow button which opens the next month information, then validate that month is changed
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithBindingPathAndProperty('sap.m.Button',
                {
                    propertyPath: "/navForVisi",
                    modelName: "currMonth"
                },
                {
                    enabled: true,
                    icon: 'sap-icon://feeder-arrow'
                });
        Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithProperties('monthcalendar--MonthDatePicker',
            {
                value: '2/1/19'
            })

            .and.iShouldSeeTheVBoxWithIdAndLabelAndValue(
                'sap.m.Label',
                {
                    text: '1'
                },
                'sap.m.Input',
                'monthcalendar--fri-monthcalendar--calendarTable-0',
                {
                    value: '8',
                    enabled: true,
                    description: 'hr'
                })
            .and.iShouldSeeTheElementWithIdEnabled(
                "monthcalendar--sat-monthcalendar--calendarTable-0", false);

        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'OK'
            });

    });
    opaTest('Validate visibiltity of the month navigation arrows based to requested time period', function (
        Given,
        When,
        Then
    ) {

        // Adjust the time period and open calendar
        When.onTheResourceRequestObjectPage
            .iEnterTextInInputField(OBJECTPAGE_PREFIX_ID + CUSTOM_SUBSECTION_ID + 'datePicker12', 'Jan 25, 2019 - Mar 15, 2019')
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
            }, false);

        // Click on the feeder arrow to go to next month
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
            }, true);

        // Click on the feeder arrow to go to next month
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                icon: "sap-icon://feeder-arrow"
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
            }, true);

        // Click on the nav back to go to previous month
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
            }, true);

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
