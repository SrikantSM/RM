sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/opaQunit"], function (
    Opa5,
    opaTest
) {

    const CUSTOM_SUBSECTION_ID = 'fe::CustomSubSection::effortcustomSection--';
    const OBJECT_PAGE_ANCHOR_BAR = 'fe::ObjectPage-anchBar-manageResourceRequest::ResourceRequestObjectPage--fe::';

    QUnit.module('Weekly Effort Distribution | Create');

    opaTest('Should open the resource request and change distribution to weekly', function (
        Given,
        When,
        Then
    ) {
        // open Object Page
        Given.iStartMyApp('16b79902-afa0-4bef-9658-98cd8d67e2e9');

        // Change effort distribution type to weekly
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor')
            .and.iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bEffortDistributionType");

        // Effort distribution Types dialog should load.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', { title: 'Change Method of Effort Distribution' });

        // Chanding the effort distribution type to Weekly Effort.
        When.onTheResourceRequestObjectPage
            .iClickOnTheStandardListItem('sap.m.RadioButton', 'sap.m.StandardListItem',
                {
                    path: "/EffortDistributionTypes(2)"
                })
            .and.iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Change'
            });
        // No warning message since the effort are already 0
        Then.onTheResourceRequestObjectPage
            .iShouldSeeMessageToastAppearance()
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '0.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });
    });

    opaTest('Add Efforts for weekly distribution', function (
        Given,
        When,
        Then
    ) {

        // Open Weekly Distribution calendar
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bCalendarEdit");

        // Validate first quarter to have capacity is opened
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Button', {
                text: "Q4 2019"
            });

        // Change Quarter
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementWithBindingPath("sap.m.Button",{
                path: "",
                propertyPath: "/navigateToNextQuarterEnabled",
                modelName: "currentQuarterModel"
            });

        // Add some efforts
        When.onTheResourceRequestObjectPage
            .iEnterTextInInputFieldWithBindingPath({
                path: "/currDetails/2020/data/Q1 2020/months/0",
                propertyPath: "weeks/0/enabled",
                modelName: "currentQuarterModel"
            }, "41");

        // Click OK to close dialog
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'OK'
            });

        // Open Weekly Distribution calendar
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bCalendarEdit");

        // Validate first quarter to have capacity is opened
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Button', {
                text: "Q1 2020"
            });

        // Change Quarter
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementWithBindingPath("sap.m.Button",{
                path: "",
                propertyPath: "/navigateToPreviousQuarterEnabled",
                modelName: "currentQuarterModel"
            });

        // Add some efforts.
        When.onTheResourceRequestObjectPage
            .iEnterTextInInputFieldWithBindingPath({
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/1/enabled",
                modelName: "currentQuarterModel"
            }, "41")
            .and.iEnterTextInInputFieldWithBindingPath({
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/2/enabled",
                modelName: "currentQuarterModel"
            }, "42")
            .and.iEnterTextInInputFieldWithBindingPath({
                path: "/currDetails/2019/data/Q4 2019/months/1",
                propertyPath: "weeks/0/enabled",
                modelName: "currentQuarterModel"
            }, "45");

        // Total effort in dialog should be updated
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '169',
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
                text: '169.00 hr'
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

        // Validate first quarter to have capacity is opened
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Button', {
                text: "Q4 2019"
            });

        // Validate draft values
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Input",{
                value : "41",
                description: "hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/1/enabled",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Input",{
                value : "42",
                description: "hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/2/enabled",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Input",{
                value : "45",
                description: "hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/1",
                propertyPath: "weeks/0/enabled",
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
                value : "41",
                description: "hr"
            },{
                path: "/currDetails/2020/data/Q1 2020/months/0",
                propertyPath: "weeks/0/enabled",
                modelName: "currentQuarterModel"
            });
        // Validate total in dialog.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '169',
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
                text: '169.00 hr'
            }, {
                propertyPath: "requestedCapacity"
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
            .iShouldSeeTheElementTypeWithProperty('sap.m.Button',
                {
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
                text: '169.00 hr'
            });
        // Validate efforts in dialog as text and not input.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text",{
                text : "41 hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/1/value",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text",{
                text : "42 hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/2/value",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text",{
                text : "45 hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/1",
                propertyPath: "weeks/0/value",
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
                text : "41 hr"
            },{
                path: "/currDetails/2020/data/Q1 2020/months/0",
                propertyPath: "weeks/0/value",
                modelName: "currentQuarterModel"
            });
        // validate total in dialog.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '169',
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
        // Validate totla on Object Page.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Link', {
                text: '169.00 hr'
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
