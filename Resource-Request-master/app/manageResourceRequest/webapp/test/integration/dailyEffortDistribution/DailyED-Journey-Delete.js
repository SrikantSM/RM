sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/opaQunit"], function (
    Opa5,
    opaTest
) {


    const CUSTOM_SUBSECTION_ID = 'fe::CustomSubSection::effortcustomSection--';
    const OBJECT_PAGE_ANCHOR_BAR = 'fe::ObjectPage-anchBar-manageResourceRequest::ResourceRequestObjectPage--fe::';

    ////////////////////////////////////////////////////////////////////////
    QUnit.module('Daily Effort Distribution | Delete');
    ////////////////////////////////////////////////////////////////////////

    opaTest('Delete values for Day-wise effort Distribution data', function(
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

        // Effort distribution dialog opens and then check the total effort
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', {
                title: "Effort Distribution"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber',{
                number: '30',
                unit: 'hours'
            },{
                propertyPath: "/totalEffort",
                modelName: "currMonth"
            });

        // Delete entry from 2 input cells and see the change in total effort in the bottom right corner of the dialog
        When.onTheResourceRequestObjectPage
            .iEnterTextInInputField('monthcalendar--thu-monthcalendar--calendarTable-1', 0)
            .and.iEnterTextInInputField('monthcalendar--fri-monthcalendar--calendarTable-1', 0)
            //to change focus
            .and.iClickOnTheElementTypeWithProperty('sap.m.Title',{
                text: "Effort Distribution"
            });

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber',{
                number: '10',
                unit: 'hours'
            },{
                propertyPath: "/totalEffort",
                modelName: "currMonth"
            });

        //create some new daywise records and try to delete them at the same time
        When.onTheResourceRequestObjectPage
            .iEnterTextInInputField('monthcalendar--mon-monthcalendar--calendarTable-3', 1)
            .and.iEnterTextInInputField('monthcalendar--tue-monthcalendar--calendarTable-3', 2)
            .and.iEnterTextInInputField('monthcalendar--wed-monthcalendar--calendarTable-3', 3)
            .and.iEnterTextInInputField('monthcalendar--thu-monthcalendar--calendarTable-3', 4)
            //to change focus
            .and.iClickOnTheElementTypeWithProperty('sap.m.Title',{
                text: "Effort Distribution"
            });
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber',{
                number: '20',
                unit: 'hours'
            },{
                propertyPath: "/totalEffort",
                modelName: "currMonth"
            });
        When.onTheResourceRequestObjectPage
            .iEnterTextInInputField('monthcalendar--mon-monthcalendar--calendarTable-3', 0)
            .and.iEnterTextInInputField('monthcalendar--tue-monthcalendar--calendarTable-3', 0)
            .and.iEnterTextInInputField('monthcalendar--wed-monthcalendar--calendarTable-3', 0)
            .and.iEnterTextInInputField('monthcalendar--thu-monthcalendar--calendarTable-3', 0)
            //to change focus
            .and.iClickOnTheElementTypeWithProperty('sap.m.Title',{
                text: "Effort Distribution"
            });

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber',{
                number: '10',
                unit: 'hours'
            },{
                propertyPath: "/totalEffort",
                modelName: "currMonth"
            });

        // Click on OK to close the dialog
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'OK'
            });

        // Verify the change in value in the object page
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '10.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });

    });

    opaTest("Save", function (
        Given,
        When,
        Then
    ) {
        // Save the resource request
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Save'
            });
        Then.onTheResourceRequestObjectPage
            .iShouldSeeMessageToastAppearance();
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
