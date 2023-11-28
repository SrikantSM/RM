sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/opaQunit"], function (
    Opa5,
    opaTest
) {

    const OBJECT_PAGE_ANCHOR_BAR = 'fe::ObjectPage-anchBar-manageResourceRequest::ResourceRequestObjectPage--fe::';

    ////////////////////////////////////////////////////////////////////////
    QUnit.module('Daily Effort Distribution | Total Effort');
    ////////////////////////////////////////////////////////////////////////

    opaTest('Read labels and values for Effort Facet', function (
        Given,
        When,
        Then
    ) {

        // Start App directly on Object Page
        Given.iStartMyApp('0a944173-9b29-400b-8710-c697883cf334');

        // Clicks on "Effort" tab
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor');

        // Verify the labels and values inside the facet
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheVBoxWithLabelAndBindingPathAndValue('sap.m.Label', {
                text: "Effort Distribution:"
            },
            'sap.m.Text', {
                text: "Total Effort"
            }, {
                propertyPath: "effortDistributionType_code"
            })
            .and.iShouldSeeTheVBoxWithLabelAndBindingPathAndValue('sap.m.Label', {
                text: "Requested Time Period:"
            },
            'sap.m.Text', {
                text: "Jan 1, 2019 - Feb 28, 2019"
            }, {
                propertyPath: "startDate"
            })
            .and.iShouldSeeTheVBoxWithLabelAndBindingPathAndValue('sap.m.Label', {
                text: "Required Effort:"
            },
            'sap.m.Text', {
                text: "350.00 hr"
            }, {
                propertyPath: "requestedCapacity"
            });

    });

    opaTest('Edit Total Requested efforts and save', function (
        Given,
        When,
        Then
    ) {
        // Click on Edit action of the object page
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Edit'
            });

        // Clicks on "Effort" tab and then settings button for effort distribution type is enabled for edit mode
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor');
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Button', {
                enabled: true,
                icon: "sap-icon://edit"
            });

        // Change the total effort required and then save resource request
        When.onTheResourceRequestObjectPage
            .iEnterTextInInputFieldWithBindingPath({
                propertyPath: "requestedCapacity"
            }, '300.00')
            .and.iClickOnTheElementTypeWithProperty('sap.m.Button', {
                text: 'Save'
            });

        // Click on "Effort" tab and check the updated total effort required from the previous step
        When.onTheResourceRequestObjectPage
            .iClickOnTheElement(OBJECT_PAGE_ANCHOR_BAR + 'CustomSection::effortcustomSection-anchor');
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithPropertyAndBindingPath('sap.m.Text', {
                text: '300.00 hr'
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
