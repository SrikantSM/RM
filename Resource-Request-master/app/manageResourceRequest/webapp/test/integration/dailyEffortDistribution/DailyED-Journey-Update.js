sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/opaQunit"], function (
    Opa5,
    opaTest
) {

    const OBJECTPAGE_PREFIX_ID = 'manageResourceRequest::ResourceRequestObjectPage--';
    const CUSTOM_SUBSECTION_ID = 'fe::CustomSubSection::effortcustomSection--';
    const OBJECT_PAGE_ANCHOR_BAR = 'fe::ObjectPage-anchBar-manageResourceRequest::ResourceRequestObjectPage--fe::';

    ////////////////////////////////////////////////////////////////////////
    QUnit.module('Daily Effort Distribution | Update');
    ////////////////////////////////////////////////////////////////////////

    opaTest('Update Day-wise effort Distribution data', function (
        Given,
        When,
        Then
    ) {

        // Start App directly on Object Page
        Given.iStartMyApp('0a944173-9b29-400b-8710-c697883cf334');

        // I click on the Edit action of the Object page
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Edit'
            });

        // Clicks on "Effort" tab and then clicks on the pencil icon to edit the effort distribution
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor')
            .and.iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bCalendarEdit");

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', {
                title: "Effort Distribution"
            });

        // Update the existing values to the new values in the input cells
        When.onTheResourceRequestObjectPage
            .iEnterTextInInputField('monthcalendar--sat-monthcalendar--calendarTable-0', 20)
            .and.iEnterTextInInputField('monthcalendar--thu-monthcalendar--calendarTable-1', 10)
            .and.iEnterTextInInputField('monthcalendar--fri-monthcalendar--calendarTable-1', 10)
            .and.iEnterTextInInputField('monthcalendar--sat-monthcalendar--calendarTable-1', 10)
            //to change focus
            .and.iClickOnTheElementTypeWithProperty('sap.m.Title', {
                text: "Effort Distribution"
            });

        // Total hours is updated in the bottom right corner of the dialog
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '50',
                unit: 'hours'
            }, {
                propertyPath: "/totalEffort",
                modelName: "currMonth"
            });

        // Click on OK to close the dialog
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'OK'
            });

        // Verify the updated efforts in the object page
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '50.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });
    });

    opaTest('Validate data loss warning should not come for change in requested time period', function (
        Given,
        When,
        Then
    ) {
        // Check Date range condition : Use start date before existing start date
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor')
            .and.iClickOnTheElement('fe::CustomSubSection::effortcustomSection--datePicker12-icon')
            .and.iEnterTextInInputField(OBJECTPAGE_PREFIX_ID + CUSTOM_SUBSECTION_ID + 'datePicker12', 'Dec 10, 2018 - Feb 28, 2019');

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '50.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });

        // Check Date range condition : Use end date after existing end date
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement('fe::CustomSubSection::effortcustomSection--datePicker12-icon')
            .and.iEnterTextInInputField(OBJECTPAGE_PREFIX_ID + CUSTOM_SUBSECTION_ID + 'datePicker12', 'Dec 10, 2018 - Mar 28, 2019');

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '50.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });

        // Check Date range condition : Use start date before existing start date and end date after existing end date
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement('fe::CustomSubSection::effortcustomSection--datePicker12-icon')
            .and.iEnterTextInInputField(OBJECTPAGE_PREFIX_ID + CUSTOM_SUBSECTION_ID + 'datePicker12', 'Nov 10, 2018 - Apr 28, 2019');

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '50.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });

    });

    opaTest('Validate data loss warning should come for change in requested time period', function (
        Given,
        When,
        Then
    ) {
        // Check Date range condition : Use start date after existing start date
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement('fe::CustomSubSection::effortcustomSection--datePicker12-icon')
            .and.iEnterTextInInputField(OBJECTPAGE_PREFIX_ID + CUSTOM_SUBSECTION_ID + 'datePicker12', 'Jan 1, 2019 - Apr 28, 2019');

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', {
                title: "Change Requested Time Period"
            });

        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Change'
            });

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '50.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });

        // Check Date range condition : Use end date before existing end date
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement('fe::CustomSubSection::effortcustomSection--datePicker12-icon')
            .and.iEnterTextInInputField(OBJECTPAGE_PREFIX_ID + CUSTOM_SUBSECTION_ID + 'datePicker12', 'Jan 1, 2019 - Feb 28, 2019');

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', {
                title: "Change Requested Time Period"
            });

        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Change'
            });

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '50.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });
    });

    opaTest('Required Effort should update on change in Required time period', function (
        Given,
        When,
        Then
    ) {
        // Check Date range condition : Use start date after existing start date and end date before existing end date
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement('fe::CustomSubSection::effortcustomSection--datePicker12-icon')
            .and.iEnterTextInInputField(OBJECTPAGE_PREFIX_ID + CUSTOM_SUBSECTION_ID + 'datePicker12', 'Jan 10, 2019 - Feb 1, 2019');

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', {
                title: "Change Requested Time Period"
            });

        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Change'
            });

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '30.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });
    });

    opaTest('Save RR', function (
        Given,
        When,
        Then
    ) {
        // Save resource request
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Save'
            });
        Then.onTheResourceRequestObjectPage
            .iShouldSeeMessageToastAppearance();
    });

    opaTest('Validate updated values for Day-wise effort Distribution data', function (
        Given,
        When,
        Then
    ) {
        // Clicks on "Effort" tab and then clicks on the glasses icon to view the effort distribution
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor')
            .and.iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bCalendarDisplay");
        // Effort distribution dialog opens and verify the values inserted in previous step
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '0 hr'
            }, {
                path: "/currMonthData/weeks/0",
                propertyPath: "sat/value",
                modelName: "currMonth"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '10 hr'
            }, {
                path: "/currMonthData/weeks/1",
                propertyPath: "thu/value",
                modelName: "currMonth"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '10 hr'
            }, {
                path: "/currMonthData/weeks/1",
                propertyPath: "fri/value",
                modelName: "currMonth"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '10 hr'
            }, {
                path: "/currMonthData/weeks/1",
                propertyPath: "sat/value",
                modelName: "currMonth"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '30',
                unit: 'hours'
            }, {
                propertyPath: "/totalEffort",
                modelName: "currMonth"
            });

        // Click on OK to close the dialog
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
