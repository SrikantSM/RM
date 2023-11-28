sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/opaQunit"], function (
    Opa5,
    opaTest
) {


    const CUSTOM_SUBSECTION_ID = 'fe::CustomSubSection::effortcustomSection--';
    const OBJECT_PAGE_ANCHOR_BAR = 'fe::ObjectPage-anchBar-manageResourceRequest::ResourceRequestObjectPage--fe::';

    ////////////////////////////////////////////////////////////////////////
    QUnit.module('Daily Effort Distribution | Create');
    ////////////////////////////////////////////////////////////////////////

    opaTest('Should change effort Distribution type', function (
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

        /* Clicks on "Effort" tab and then clicks on the pencil icon to edit the effort distribution
        and then change the requested duration and the effort distribution type
        */
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor')
            .and.iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bEffortDistributionType");

        // Effort distribution Types dialog should load and provide the possible selection options
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', { title: 'Change Method of Effort Distribution' })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.StandardListItem', {
                title: 'Total Effort',
                selected: true
            },
            {
                path: "/EffortDistributionTypes(0)"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.StandardListItem', {
                title: 'Daily Effort',
                selected: false
            },
            {
                path: "/EffortDistributionTypes(1)"
            });

        // Chanding the effort distribution type to Daily Efforts and then I get confirmation popup.
        When.onTheResourceRequestObjectPage
            .iClickOnTheStandardListItem('sap.m.RadioButton', 'sap.m.StandardListItem',
                {
                    path: "/EffortDistributionTypes(1)"
                })
            .and.iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Change'
            });
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementWithProperties('effortdistconfirm--effortdistconfirm', {
                title: 'Change Method of Effort Distribution'
            });

        // Confirm the change operation in the confirmation popup and should see toast message after that
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Change'
            });
        Then.onTheResourceRequestObjectPage
            .iShouldSeeMessageToastAppearance()
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '0.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });

    });

    opaTest('Validate data loss warning message should not come when required effort is 0', function (
        Given,
        When,
        Then
    ) {
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bEffortDistributionType")
            .and.iClickOnTheStandardListItem('sap.m.RadioButton', 'sap.m.StandardListItem',
                {
                    path: "/EffortDistributionTypes(0)"
                })
            .and.iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Change'
            });
        Then.onTheResourceRequestObjectPage
            .iShouldSeeMessageToastAppearance()
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: 'Total Effort'
            }, {
                propertyPath: "effortDistributionType_code"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Input', {
                value: '0.00'
            }, {
                propertyPath: "requestedCapacity"
            });

        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bEffortDistributionType")
            .and.iClickOnTheStandardListItem('sap.m.RadioButton', 'sap.m.StandardListItem',
                {
                    path: "/EffortDistributionTypes(1)"
                })
            .and.iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Change'
            });
        Then.onTheResourceRequestObjectPage
            .iShouldSeeMessageToastAppearance()
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: 'Daily Effort'
            }, {
                propertyPath: "effortDistributionType_code"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '0.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });
    });

    opaTest('Create Day-wise effort Distribution', function (
        Given,
        When,
        Then
    ) {
    // Click on the pencil icon to open the effort distribution dialog
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bCalendarEdit");

        // Verify title and initial distribution to be 0 hours
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', {
                title: "Effort Distribution"
            })
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '0',
                unit: 'hours'
            }, {
                propertyPath: "/totalEffort",
                modelName: "currMonth"
            });

        // Inserts the value in the input cells in effort distribution dialog
        When.onTheResourceRequestObjectPage
            .iEnterTextInInputField('monthcalendar--thu-monthcalendar--calendarTable-1', 8)
        // to change focus
            .and.iClickOnTheElementTypeWithProperty('sap.m.Title', {
                text: "Effort Distribution"
            })
            .and.iEnterTextInInputField('monthcalendar--fri-monthcalendar--calendarTable-1', 7)
        // to change focus
            .and.iClickOnTheElementTypeWithProperty('sap.m.Title', {
                text: "Effort Distribution"
            })
            .and.iEnterTextInInputField('monthcalendar--sat-monthcalendar--calendarTable-1', 6)
        // to change focus
            .and.iClickOnTheElementTypeWithProperty('sap.m.Title', {
                text: "Effort Distribution"
            });

        // In the same dialog, total effort is updated on the bottom right corner
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '21',
                unit: 'hours'
            }, {
                propertyPath: "/totalEffort",
                modelName: "currMonth"
            });

        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'OK'
            });
    });
    opaTest('Validate if buttons are disabled in case of errrs', function (
        Given,
        When,
        Then
    ) {
        // Click on the pencil icon to open the effort distribution dialog
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bCalendarEdit");
        When.onTheResourceRequestObjectPage
            .iEnterTextInInputField('monthcalendar--tue-monthcalendar--calendarTable-2', -1)
            // to change focus
            .and.iClickOnTheElementTypeWithProperty('sap.m.Title', {
                text: "Effort Distribution"
            })
            .and.iEnterTextInInputField('monthcalendar--thu-monthcalendar--calendarTable-2', 1.6)
            // to change focus
            .and.iClickOnTheElementTypeWithProperty('sap.m.Title', {
                text: "Effort Distribution"
            })
            .and.iEnterTextInInputField('monthcalendar--wed-monthcalendar--calendarTable-2', 6)
            // to change focus
            .and.iClickOnTheElementTypeWithProperty('sap.m.Title', {
                text: "Effort Distribution"
            });
        //Check if OK , forward and backward navigation buttons are disabled
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyEnabled('sap.m.Button', {
                enabled: false,
                text: "OK"
            }, false)
            .iShouldSeeTheElementTypeWithPropertyEnabled('sap.m.Button', {
                enabled: false,
                icon: "sap-icon://feeder-arrow"
            }, false)
            .iShouldSeeTheElementTypeWithPropertyEnabled('sap.m.Button', {
                enabled: false,
                icon: "sap-icon://nav-back"
            }, false);

        //Remove error values  in all the fields
        When.onTheResourceRequestObjectPage
            .iEnterTextInInputField('monthcalendar--tue-monthcalendar--calendarTable-2', 0)
            // to change focus
            .and.iClickOnTheElementTypeWithProperty('sap.m.Title', {
                text: "Effort Distribution"
            })
            .and.iEnterTextInInputField('monthcalendar--thu-monthcalendar--calendarTable-2', 0)
            // to change focus
            .and.iClickOnTheElementTypeWithProperty('sap.m.Title', {
                text: "Effort Distribution"
            })
            .and.iEnterTextInInputField('monthcalendar--wed-monthcalendar--calendarTable-2', 0)
            // to change focus
            .and.iClickOnTheElementTypeWithProperty('sap.m.Title', {
                text: "Effort Distribution"
            });
        //Check if the buttons get enabled after errored values are removed
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyEnabled('sap.m.Button', {
                text: "OK",
                enabled: true
            }, true)
            .iShouldSeeTheElementTypeWithPropertyEnabled('sap.m.Button', {
                enabled: true,
                icon: "sap-icon://feeder-arrow"
            }, false)
            .iShouldSeeTheElementTypeWithPropertyEnabled('sap.m.Button', {
                enabled: false,
                icon: "sap-icon://nav-back"
            }, false);
        //close the dialog
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'OK'
            });
    });

    opaTest('Validate data loss warning message should come when required effort is provided', function (
        Given,
        When,
        Then
    ) {
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bEffortDistributionType")
            .and.iClickOnTheStandardListItem('sap.m.RadioButton', 'sap.m.StandardListItem',
                {
                    path: "/EffortDistributionTypes(0)"
                })
            .and.iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Change'
            });

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', {
                title: "Change Method of Effort Distribution"
            })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Text', {
                text: "Change the effort distribution method? This change will redistribute all effort according to the new effort distribution method. You cannot restore the current effort distribution at a later point."
            });

        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Cancel'
            });

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '21.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });
    });

    opaTest('Validate Draft values for Day-wise effort Distribution', function (
        Given,
        When,
        Then
    ) {
    // Click on the pencil icon again to open the effort distribution dialog to verify the saving of draft entries from the previous step.
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bCalendarEdit");
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementWithProperties('monthcalendar--thu-monthcalendar--calendarTable-1', {
                value: '8'
            })
            .and.iShouldSeeTheElementWithProperties('monthcalendar--fri-monthcalendar--calendarTable-1', {
                value: '7'
            })
            .and.iShouldSeeTheElementWithProperties('monthcalendar--sat-monthcalendar--calendarTable-1', {
                value: '6'
            })

            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '21',
                unit: 'hours'
            }, {
                propertyPath: "/totalEffort",
                modelName: "currMonth"
            });

        // Click OK to close dialog and then save resource request
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'OK'
            });
    });

    opaTest('Save Resource Request and validate requested capacity ', function (
        Given,
        When,
        Then
    ) {
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Save'
            });

        Then.onTheResourceRequestObjectPage
            .iShouldSeeMessageToastAppearance();

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Link', {
                text: '21.00 hr'
            }, {
                propertyPath: "requestedCapacity"
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
