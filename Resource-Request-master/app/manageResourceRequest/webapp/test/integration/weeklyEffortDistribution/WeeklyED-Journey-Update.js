sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/opaQunit"], function (
    Opa5,
    opaTest
) {
    const OBJECTPAGE_PREFIX_ID = 'manageResourceRequest::ResourceRequestObjectPage--';
    const CUSTOM_SUBSECTION_ID = 'fe::CustomSubSection::effortcustomSection--';
    const OBJECT_PAGE_ANCHOR_BAR = 'fe::ObjectPage-anchBar-' + OBJECTPAGE_PREFIX_ID + 'fe::';

    QUnit.module('Weekly Effort Distribution | Update');

    opaTest('Update Efforts for weekly distribution', function (
        Given,
        When,
        Then
    ) {

        // open Object Page
        Given.iStartMyApp('16b79902-afa0-4bef-9658-98cd8d67e2e9');

        // I click on the Edit action of the Object page
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Edit'
            });

        // Open Weekly Distribution calendar
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor')
            .and.iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bCalendarEdit");

        // Update some efforts and add for one week (To test create and update together)
        When.onTheResourceRequestObjectPage
            .iEnterTextInInputFieldWithBindingPath({
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/1/enabled",
                modelName: "currentQuarterModel"
            }, "14")
            .and.iEnterTextInInputFieldWithBindingPath({
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/2/enabled",
                modelName: "currentQuarterModel"
            }, "24")
            .and.iEnterTextInInputFieldWithBindingPath({
                path: "/currDetails/2019/data/Q4 2019/months/1",
                propertyPath: "weeks/0/enabled",
                modelName: "currentQuarterModel"
            }, "54")
            .and.iEnterTextInInputFieldWithBindingPath({
                path: "/currDetails/2019/data/Q4 2019/months/2",
                propertyPath: "weeks/3/enabled",
                modelName: "currentQuarterModel"
            }, "11");

        // Change Quarter
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementWithBindingPath("sap.m.Button",{
                path: "",
                propertyPath: "/navigateToNextQuarterEnabled",
                modelName: "currentQuarterModel"
            });

        // Add more efforts for different quarter
        When.onTheResourceRequestObjectPage
            .iEnterTextInInputFieldWithBindingPath({
                path: "/currDetails/2020/data/Q1 2020/months/0",
                propertyPath: "weeks/0/enabled",
                modelName: "currentQuarterModel"
            }, "14");

        // Total effort in dialog should be updated
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '117',
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
        // Total effort on object page should be updated.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '117.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });
    });

    opaTest("Validate draft data", function (
        Given,
        When,
        Then
    ) {
        // Open Dialog
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bCalendarEdit");

        // Validate draft values
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Input",{
                value : "14",
                description: "hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/1/enabled",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Input",{
                value : "24",
                description: "hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/2/enabled",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Input",{
                value : "54",
                description: "hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/1",
                propertyPath: "weeks/0/enabled",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Input",{
                value : "11",
                description: "hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/2",
                propertyPath: "weeks/3/enabled",
                modelName: "currentQuarterModel"
            });
        // Chnage Quarter
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementWithBindingPath("sap.m.Button",{
                path: "",
                propertyPath: "/navigateToNextQuarterEnabled",
                modelName: "currentQuarterModel"
            });

        // Validate more records.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Input",{
                value : "14",
                description: "hr"
            },{
                path: "/currDetails/2020/data/Q1 2020/months/0",
                propertyPath: "weeks/0/enabled",
                modelName: "currentQuarterModel"
            });
        // Validate total in dialog.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '117',
                unit: 'hours'
            }, {
                propertyPath: "/totalEffort",
                modelName: "currentQuarterModel"
            });

        // Click OK to close dialog.
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'OK'
            });
        // Validate total on Object Page.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '117.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });
    });

    opaTest('Validate data loss warning should not come for expanding requested time period', function (
        Given,
        When,
        Then
    ) {

        // Expand resource request time period
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor')
            .and.iClickOnTheElement('fe::CustomSubSection::effortcustomSection--datePicker12-icon')
            .and.iEnterTextInInputField(OBJECTPAGE_PREFIX_ID + CUSTOM_SUBSECTION_ID + 'datePicker12', 'Oct 1, 2019 - Oct 7, 2020');

        // Requested time period and capacity should not change
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '117.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            })
            .and.iShouldSeeTheElementWithProperties(OBJECTPAGE_PREFIX_ID + CUSTOM_SUBSECTION_ID + 'datePicker12', {
                value: 'Oct 1, 2019 - Oct 7, 2020'
            });
    });

    opaTest('Validate data loss warning for shrinking requested time period (Cancel Change)', function (
        Given,
        When,
        Then
    ) {

        // Shrink resource request time period
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor')
            .and.iClickOnTheElement('fe::CustomSubSection::effortcustomSection--datePicker12-icon')
            .and.iEnterTextInInputField(OBJECTPAGE_PREFIX_ID + CUSTOM_SUBSECTION_ID + 'datePicker12', 'Oct 14, 2019 - Oct 7, 2020');

        // Confirmation Dialog
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', {
                title: "Change Requested Time Period"
            });

        // Press cancel
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Cancel'
            });

        // Requested time period and capacity should not change
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '117.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            })
            .and.iShouldSeeTheElementWithProperties(OBJECTPAGE_PREFIX_ID + CUSTOM_SUBSECTION_ID + 'datePicker12', {
                value: 'Oct 1, 2019 - Oct 7, 2020'
            });

        // Open Dialog
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bCalendarEdit");

        // Validate efforts in the calendar
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Input",{
                value : "14",
                description: "hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/1/enabled",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Input",{
                value : "24",
                description: "hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/2/enabled",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Input",{
                value : "54",
                description: "hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/1",
                propertyPath: "weeks/0/enabled",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Input",{
                value : "11",
                description: "hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/2",
                propertyPath: "weeks/3/enabled",
                modelName: "currentQuarterModel"
            });

        // Click OK to close dialog
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'OK'
            });
    });

    opaTest('Validate data loss warning for shrinking requested time period (Confirm Change)', function (
        Given,
        When,
        Then
    ) {

        // Shrink resource request time period
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor')
            .and.iClickOnTheElement('fe::CustomSubSection::effortcustomSection--datePicker12-icon')
            .and.iEnterTextInInputField(OBJECTPAGE_PREFIX_ID + CUSTOM_SUBSECTION_ID + 'datePicker12', 'Oct 14, 2019 - Oct 7, 2020');

        // Confirmation Dialog
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', {
                title: "Change Requested Time Period"
            });

        // Confirm change
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Change'
            });

        // Requested Time Period and capacity are updated
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '103.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            })
            .and.iShouldSeeTheElementWithProperties(OBJECTPAGE_PREFIX_ID + CUSTOM_SUBSECTION_ID + 'datePicker12', {
                value: 'Oct 14, 2019 - Oct 7, 2020'
            });

        // Open Dialog
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bCalendarEdit");

        // Validate efforts in the calendar
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Input",{
                value : "24",
                description: "hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/2/enabled",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Input",{
                value : "54",
                description: "hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/1",
                propertyPath: "weeks/0/enabled",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Input",{
                value : "11",
                description: "hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/2",
                propertyPath: "weeks/3/enabled",
                modelName: "currentQuarterModel"
            });
        // Click OK to close dialog
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'OK'
            });
    });

    opaTest("Save Resource Request", function (
        Given,
        When,
        Then
    ) {
        // Save the Resource Request,
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement('fe::FooterBar::StandardAction::Save');
        // Edit Action should be visible.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Button',{
                text: 'Edit'
            });
    });


    opaTest("Validate saved data", function (
        Given,
        When,
        Then
    ) {
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor');

        // Click on link on Object Page
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithBindingPathAndProperty('sap.m.Link', {
                propertyPath: "requestedCapacity"
            },{
                text: '103.00 hr'
            });
        // Validate efforts in dialog as text and not input.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text",{
                text : "0 hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/1/value",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text",{
                text : "24 hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/2/value",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text",{
                text : "54 hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/1",
                propertyPath: "weeks/0/value",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text",{
                text : "11 hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/2",
                propertyPath: "weeks/3/value",
                modelName: "currentQuarterModel"
            });
        // Change Quarter
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementWithBindingPath("sap.m.Button",{
                path: "",
                propertyPath: "/navigateToNextQuarterEnabled",
                modelName: "currentQuarterModel"
            });

        // Validate more records.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text",{
                text : "14 hr"
            },{
                path: "/currDetails/2020/data/Q1 2020/months/0",
                propertyPath: "weeks/0/value",
                modelName: "currentQuarterModel"
            });
        // validate total in dialog.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '103',
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
        // Validate total on Object Page.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Link', {
                text: '103.00 hr'
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
