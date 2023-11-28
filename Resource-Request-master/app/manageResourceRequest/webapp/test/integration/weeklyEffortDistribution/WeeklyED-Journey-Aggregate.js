sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/opaQunit"], function (
    Opa5,
    opaTest
) {

    const CUSTOM_SUBSECTION_ID = 'fe::CustomSubSection::effortcustomSection--';
    const OBJECT_PAGE_ANCHOR_BAR = 'fe::ObjectPage-anchBar-manageResourceRequest::ResourceRequestObjectPage--fe::';

    QUnit.module('Weekly Effort Distribution | Aggregate');

    opaTest('Search a resource request in list page', function (
        Given,
        When,
        Then
    ) {
        // Start App directly on Object Page
        Given.iStartMyApp('16b79902-afa0-4bef-9658-98cd8d67e2e9');
        // Resource Request should be in view mode.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Button',
                {
                    text: 'Edit'
                }
            );
    });

    opaTest('Should change effort Distribution type from daily to weekly', function (
        Given,
        When,
        Then
    ) {
    // I click on the Edit action of the Object page
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Edit'
            });

        // Clicks on "Effort" tab and then clicks on the pencil icon to edit the effort distribution type
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor')
            .and.iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bEffortDistributionType");

        // Effort distribution Types dialog should load and provide the possible selection options
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', { title: 'Change Method of Effort Distribution' })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.StandardListItem', {
                title: 'Total Effort',
                selected: false
            },
            {
                path: "/EffortDistributionTypes(0)"
            })
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.StandardListItem', {
                title: 'Daily Effort',
                selected: true
            },
            {
                path: "/EffortDistributionTypes(1)"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.StandardListItem', {
                title: 'Weekly Effort',
                selected: false
            },
            {
                path: "/EffortDistributionTypes(2)"
            });

        // Chnage effort distribution type to Weekly.
        When.onTheResourceRequestObjectPage
            .iClickOnTheStandardListItem('sap.m.RadioButton', 'sap.m.StandardListItem',
                {
                    path: "/EffortDistributionTypes(2)"
                })
            .and.iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Change'
            });

        // Validate warning message is displayed
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', {
                title: "Change Method of Effort Distribution"
            })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Text', {
                text: "Change the effort distribution method? This change will redistribute all effort according to the new effort distribution method. You cannot restore the current effort distribution at a later point."
            });
        // Accept the warning
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Change'
            });
        // Validate values on Object Page.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeMessageToastAppearance()
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '1,368.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });

    });

    opaTest('Validate aggregated data of effort Distribution', function (
        Given,
        When,
        Then
    ) {
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bCalendarEdit");

        // Validate Aggregated values in some cells.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Input', {
                value: '56',
                description: 'hr'
            },
            {
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/1/enabled",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Input', {
                value: '56',
                description: 'hr'
            },
            {
                path: "/currDetails/2019/data/Q4 2019/months/0",
                propertyPath: "weeks/2/enabled",
                modelName: "currentQuarterModel"
            });
        // Change Quarter
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithBindingPathAndProperty('sap.m.Button',
                {
                    propertyPath: "/navigateToNextQuarterEnabled",
                    modelName: "currentQuarterModel"
                },
                {
                    enabled: true,
                    icon: 'sap-icon://feeder-arrow'
                });
        // Validate aggregated values in new quarter
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Input', {
                value: '56',
                description: 'hr'
            },
            {
                path: "/currDetails/2020/data/Q1 2020/months/2",
                propertyPath: "weeks/2/enabled",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Input', {
                value: '24',
                description: 'hr'
            },
            {
                path: "/currDetails/2020/data/Q1 2020/months/2",
                propertyPath: "weeks/3/enabled",
                modelName: "currentQuarterModel"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.ObjectNumber', {
                number: '1368',
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

    opaTest('Validate warning messages on change of effort Distribution[cancel change]', function (
        Given,
        When,
        Then
    ) {
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor')
            .and.iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bEffortDistributionType");

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', { title: 'Change Method of Effort Distribution' })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.StandardListItem', {
                title: 'Total Effort',
                selected: false
            },
            {
                path: "/EffortDistributionTypes(0)"
            })
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.StandardListItem', {
                title: 'Daily Effort',
                selected: false
            },
            {
                path: "/EffortDistributionTypes(1)"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.StandardListItem', {
                title: 'Weekly Effort',
                selected: true
            },
            {
                path: "/EffortDistributionTypes(2)"
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

        // Validate data loss warning is visible
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', {
                title: "Change Method of Effort Distribution"
            })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Text', {
                text: "Change the effort distribution method? This change will delete all effort already distributed."
            });
        // Cancel change
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Cancel'
            });
        // No change should be there on Object Page
        Then.onTheResourceRequestObjectPage
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '1,368.00 hr'
            }, {
                propertyPath: "requestedCapacity"
            });
    });

    opaTest('Validate warning messages on change of effort Distribution[confirm change]', function (
        Given,
        When,
        Then
    ) {
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor')
            .and.iClickOnTheElement(CUSTOM_SUBSECTION_ID + "bEffortDistributionType");
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Dialog', { title: 'Change Method of Effort Distribution' })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.StandardListItem', {
                title: 'Total Effort',
                selected: false
            },
            {
                path: "/EffortDistributionTypes(0)"
            })
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.StandardListItem', {
                title: 'Daily Effort',
                selected: false
            },
            {
                path: "/EffortDistributionTypes(1)"
            })
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.StandardListItem', {
                title: 'Weekly Effort',
                selected: true
            },
            {
                path: "/EffortDistributionTypes(2)"
            });

        // Chanding the effort distribution type to Daily Efforts.
        When.onTheResourceRequestObjectPage
            .iClickOnTheStandardListItem('sap.m.RadioButton', 'sap.m.StandardListItem',
                {
                    path: "/EffortDistributionTypes(1)"
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
                text: "Change the effort distribution method? This change will delete all effort already distributed."
            });
        // Confirm Change.
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Change'
            });
        // Validate effort are reset on Object Page.
        Then.onTheResourceRequestObjectPage
            .iShouldSeeMessageToastAppearance()
            .and.iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '0.00 hr'
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
