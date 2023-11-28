sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/opaQunit',
    'sap/m/AvatarShape',
    'sap/m/AvatarSize'
], function (Opa5, opaTest, AvatarShape,AvatarSize) {


    QUnit.module('Staff Resource Request - Contact Card Journey');

    opaTest('Validate Contact Card Details in Assigned Resources', function (Given, When, Then) {

        Given.iStartMyApp('f33a71e7-6363-43a8-8374-8ace063d7813');

        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithProperty('sap.m.Button', { text: "Assignments" });
        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheTableWithHeader("Assigned Resources")
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Avatar', { src: "../staffResourceRequest/odata/v4/ProcessResourceRequestService/ConsultantProfileHeaders(3f5eec34-046a-11ea-8d71-362b9e155667)/profilePhoto/profileThumbnail", initials: "SA", displayShape: AvatarShape.Circle, displaySize: AvatarSize.XS, showBorder: true });
        When.onTheResourceRequestObjectPage
            .iClickOnTheElementTypeWithBindingPathAndProperty('sap.m.Link',{
                propertyPath: "resourceName"
            },{
                text: 'Smita Anderson'
            });

        Then.onTheResourceRequestObjectPage
            .iShouldSeeTheElementTypeWithProperty('sap.m.Title', { text: "Smita Anderson (smita.anderson)" })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Avatar', { src: "../staffResourceRequest/odata/v4/ProcessResourceRequestService/ConsultantProfileHeaders(3f5eec34-046a-11ea-8d71-362b9e155667)/profilePhoto/profileThumbnail", initials: "SA", displayShape: AvatarShape.Circle, displaySize: AvatarSize.S, showBorder: true })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Text', { text: "User Assistance Developer" })
            .and.iShouldSeeTheElementTypeWithProperty('sap.ui.core.Title', { text: "Organizational Information" })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Label', { text: "Worker Type" })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Text', { text: "External Worker" })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Label', { text: "Resource Organization" })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Text', { text: "Organization ORG_1 India (RORG1) " })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Label', { text: "Cost Center" })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Text', { text: "CostCenter1 (CCIN)" })
            .and.iShouldSeeTheElementTypeWithProperty('sap.ui.core.Title', { text: "Contact Information" })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Label', { text: "Mobile" })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Link', { text: "+91-9999999999" })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Label', { text: "Email" })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Link', { text: "smita.anderson@corp.sap" })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Label', { text: "Office Location" })
            .and.iShouldSeeTheElementTypeWithProperty('sap.m.Text', { text: "dummy_country_name" });
    });

    opaTest('ProcessRequest - Teardown', function (Given, When, Then) {
        When.iTeardownMyAppFrame();
        Then.waitFor({
            success: function () {
                Opa5.assert.ok(true, "teardown successful");
            }
        });
    });


});
