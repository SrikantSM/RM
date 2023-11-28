sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/opaQunit"], function (
    Opa5,
    opaTest
) {

    const CUSTOM_SUBSECTION_ID = 'fe::CustomSubSection::effortcustomSection--';
    const OBJECT_PAGE_ANCHOR_BAR = 'fe::ObjectPage-anchBar-manageResourceRequest::ResourceRequestObjectPage--fe::';

    QUnit.module('Weekly Effort Distribution | Delete');

    opaTest('Delete Efforts for weekly distribution', function (
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

        // Delete some efforts and add for one week (To test create and delete together)
        When.onTheResourceRequestObjectPage
            .iEnterTextInInputFieldWithBindingPath({
                path: "/currDetails/2019/data/Q4 2019/months/2",
                propertyPath: "weeks/0/enabled",
                modelName: "currentQuarterModel"
            }, "25")
            .and.iEnterTextInInputFieldWithBindingPath({
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/2/enabled",
                modelName: "currentQuarterModel"
            }, "0")
            .and.iEnterTextInInputFieldWithBindingPath({
                path: "/currDetails/2019/data/Q4 2019/months/1",
                propertyPath: "weeks/0/enabled",
                modelName: "currentQuarterModel"
            }, "0");

        // Change Quarter
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementWithBindingPath("sap.m.Button",{
                path: "",
                propertyPath: "/navigateToNextQuarterEnabled",
                modelName: "currentQuarterModel"
            });

        // Add more efforts for different quarter (to test delete, create and update toegther)
        When.onTheResourceRequestObjectPage
            .iEnterTextInInputFieldWithBindingPath({
                path: "/currDetails/2020/data/Q1 2020/months/0",
                propertyPath: "weeks/0/enabled",
                modelName: "currentQuarterModel"
            }, "33");

        // Total effort in dialog should be updated
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '69',
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
                text: '69.00 hr'
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
                value : "11",
                description: "hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/2",
                propertyPath: "weeks/3/enabled",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Input",{
                value : "25",
                description: "hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/2",
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
                value : "33",
                description: "hr"
            },{
                path: "/currDetails/2020/data/Q1 2020/months/0",
                propertyPath: "weeks/0/enabled",
                modelName: "currentQuarterModel"
            });
        // Validate total in dialog.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '69',
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
                text: '69.00 hr'
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
                text: '69.00 hr'
            });
        // Validate efforts in dialog as text and not input.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text",{
                text : "0 hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/2/value",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text",{
                text : "0 hr"
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
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath("sap.m.Text",{
                text : "25 hr"
            },{
                path: "/currDetails/2019/data/Q4 2019/months/2",
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
                text : "33 hr"
            },{
                path: "/currDetails/2020/data/Q1 2020/months/0",
                propertyPath: "weeks/0/value",
                modelName: "currentQuarterModel"
            });
        // validate total in dialog.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '69',
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
                text: '69.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });
    });

    opaTest('Validate warning messages on change of effort Distribution from Weekly to Total (Cancel Change)', function (
        Given,
        When,
        Then
    ) {

        // I click on the Edit action of the Object page
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Edit'
            });
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor')
            .and.iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bEffortDistributionType");

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', { title: 'Change Method of Effort Distribution' });

        // Chanding the effort distribution type to Total Efforts and then I get confirmation popup.
        When.onTheResourceRequestObjectPage
            .iClickOnTheStandardListItem('sap.m.RadioButton', 'sap.m.StandardListItem',
                {
                    path: "/EffortDistributionTypes(0)"
                })
            .and.iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Change'
            });

        // Validate data loss warning is visible
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', {
                title: "Change Method of Effort Distribution"
            })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Text', {
                text: "Change the effort distribution method? This change will redistribute all effort according to the new effort distribution method. You cannot restore the current effort distribution at a later point."
            });
        // Cancel change
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Cancel'
            });
        // No change should be there on Object Page
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheVBoxWithLabelAndBindingPathAndValue('sap.m.Label', {
                text: "Effort Distribution:"
            },
            'sap.m.Text', {
                text: "Weekly Effort"
            }, {
                propertyPath: "effortDistributionType_code"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '69.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });
    });

    opaTest('Validate warning messages on change of effort Distribution (Confirm Change)', function (
        Given,
        When,
        Then
    ) {
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bEffortDistributionType");
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', { title: 'Change Method of Effort Distribution' });

        // Chanding the effort distribution type to Daily Efforts.
        When.onTheResourceRequestObjectPage
            .iClickOnTheStandardListItem('sap.m.RadioButton', 'sap.m.StandardListItem',
                {
                    path: "/EffortDistributionTypes(0)"
                })
            .and.iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Change'
            });

        // Validate data loss warning is visible
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', {
                title: "Change Method of Effort Distribution"
            })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Text', {
                text: "Change the effort distribution method? This change will redistribute all effort according to the new effort distribution method. You cannot restore the current effort distribution at a later point."
            });
        // Confirm Change.
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Change'
            });
        // Validate effort are reset on Object Page.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeMessageToastAppearance()
            .and.iShouldSeeTheVBoxWithLabelAndBindingPathAndValue('sap.m.Label', {
                text: "Effort Distribution:"
            },
            'sap.m.Text', {
                text: "Total Effort"
            }, {
                propertyPath: "effortDistributionType_code"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Input', {
                value: '69.00'
            }, {
                propertyPath: "requestedCapacity"
            });
    });

    opaTest("Save Resource Request and validate type and effort", function (
        Given,
        When,
        Then
    ) {
        // Save the Resource Request,
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement('fe::FooterBar::StandardAction::Save');

        // Validate Effort distribution type and Required effort
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheVBoxWithLabelAndBindingPathAndValue('sap.m.Label', {
                text: "Effort Distribution:"
            },
            'sap.m.Text', {
                text: "Total Effort"
            }, {
                propertyPath: "effortDistributionType_code"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '69.00 hr'
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
