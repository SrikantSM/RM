sap.ui.define(["sap/ui/test/opaQunit"], function (
    opaTest
) {

    return {
        run: function () {

            ///////////////////////////////////////////////////////////////////////////
            QUnit.module("Manage Resource Request | Object Page UX Consistency");
            ///////////////////////////////////////////////////////////////////////////

            opaTest("All the Object page Facets are consistent", function (
                Given,
                When,
                Then
            ) {
                Given.iStartMyApp("ResourceRequest-Manage");
                When.onTheResourceRequestListReportPage
                    .onTable()
                    .iPressRow({ "Request ID": "0000000002" });

                When.onTheResourceRequestObjectPage.iGoToSection("Project Information");

                // The attributes of Demand details are visible
                Then.onTheResourceRequestObjectPage
                    .onForm({ section: "ProjectInformation", fieldGroup: "SubSectionProjectDemand" })
                    .iCheckField("Demand")
                    .and.iCheckField("Billing Category")
                    .and.iCheckField("Estimated Effort");

                // The attributes of Workpackge details are filled visible
                Then.onTheResourceRequestObjectPage
                    .onForm({ section: "ProjectInformation", fieldGroup: "SubSectionWorkpackage" })
                    .iCheckField("Work Package")
                    .and.iCheckField("Work Package Start Date")
                    .and.iCheckField("Work Package End Date");

                // The attributes of Project details are visible
                Then.onTheResourceRequestObjectPage
                    .onForm({ section: "ProjectInformation", fieldGroup: "SubSectionProject" })
                    .iCheckField("Project")
                    .and.iCheckField("Project Start Date")
                    .and.iCheckField("Project End Date")
                    .and.iCheckField("Customer");

                When.onTheResourceRequestObjectPage.iGoToSection("Resource Request Details");

                // The attributes of Resource Request details are visible
                Then.onTheResourceRequestObjectPage
                    .onForm({ section: "ResourceRequestDetails", fieldGroup: "SubSectionRequest1" })
                    .iCheckField("Request Name")
                    .and.iCheckField("Project Role")
                    .and.iCheckField("Resource Manager")
                    .and.iCheckField("Request Priority")
                    .and.iCheckField("Requested Resource Organization");

                Then.onTheResourceRequestObjectPage
                    .onForm({ section: "ResourceRequestDetails", fieldGroup: "SubSectionRequest2" })
                    .iCheckField("Description");

                When.onTheResourceRequestObjectPage.iGoToSection("Effort");

                // The attributes of Effort are visible
                // Then.onTheResourceRequestObjectPage
                //     .onForm({ section: "Effort", fieldGroup: "SubSectionRequestEffort" })
                //     .iCheckField("Requested Time Frame")
                //     .and.iCheckField("Effort Distribution")
                //     .and.iCheckField("Required Effort (Hours)");

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

                When.onTheResourceRequestObjectPage.iGoToSection("Required Skills");

                // Check columns in the Skills table
                Then.onTheResourceRequestObjectPage
                    .onTable("Skills")
                    .iCheckColumns(4,{
                        "Skill": { importance: "None" },
                        "Proficiency Level": { importance: "None" },
                        "Importance": { importance: "None" },
                        "Comment": { importance: "None" }
                    });

                When.onTheResourceRequestObjectPage.iGoToSection("Assignments");
                Then.onTheResourceRequestObjectPage.iSeeSubSectionWithTitle("Staffing Summary");

                // The attributes of Staffing summary are visible
                // Then.onTheResourceRequestObjectPage
                //     .onForm({ section: "StaffingSummary", fieldGroup: "SubSectionRequestEffort" })
                //     .iCheckField({property: "Required Effort (Hours)"})
                //     .and.iCheckField("Staffed (Hours)")
                //     .and.iCheckField("Remaining (Hours)");

                Then.onTheResourceRequestObjectPage.iSeeSubSectionWithTitle("Assigned Resources");

                // Check columns in the Assigned resources table
                Then.onTheResourceRequestObjectPage
                    .onTable("Assigned Resources")
                    .iCheckColumns(6, {
                        "Name": { importance: "None" },
                        "Worker Type": { importance: "None" },
                        "Assignment Start": { importance: "None" },
                        "Assignment End": { importance: "None" },
                        "Assigned": { importance: "None" },
                        "Assignment Status": { importance: "None" }
                    });
            });

            opaTest("Test the filter fields of Skill value help", function (
                Given,
                When,
                Then
            ) {

                // Click on Edit button in the Object page header
                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteEdit();

                // Go to Required Skills section
                When.onTheResourceRequestObjectPage
                    .iGoToSection("Required Skills");

                // To get the focus on the 1st row and Name column of Skills table and open the value help
                When.onTheResourceRequestObjectPage
                    .onTable("Skills")
                    .iPressCell(0, "Skill")
                    .and.iExecuteKeyboardShortcut("F4", {"Skill":""}, "Skill");

                // Show filters in skill value help dialog
                When.onTheResourceRequestObjectPage
                    .onValueHelpDialog({ property: 'skill_ID' })
                    .iExecuteShowHideFilters();

                // Validate attributes and filter fields in skill value help
                Then.onTheResourceRequestObjectPage
                    .onValueHelpDialog({ property: 'skill_ID' })
                    .iCheckState({ title: "Skill" })
                    .and.iCheckSearchField()
                    .and.iCheckFilterField({ property: "commaSeparatedAlternativeLabels" })
                    .and.iCheckFilterField({ property: "name" })
                    .and.iCheckFilterField({ property: "description" })
                    .and.iCheckFilterField({ property: "catalogAssociations::catalog::name" })
                    .and.iCheckTable()
                    .and.iCheckFilterBar();

                // Add filter for Skill name in the Skill value help dialog
                When.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iChangeFilterField("Skill", "Fiori", true)
                    .and.iExecuteSearch();
                Then.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iCheckRows(1);

                // Clear Name filter and Add filter for Description in the Skill value help dialog
                When.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iChangeFilterField("Skill", "", true)
                    .and.iChangeFilterField("Description", "Description for CAP", true)
                    .and.iExecuteSearch();
                Then.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iCheckRows(1);

                // Clear Description filter and Add filter for Catalogs in the Skill value help dialog
                When.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iChangeFilterField("Description", "", true)
                    .and.iChangeFilterField("Catalogs", "Catalog One", true)
                    .and.iExecuteSearch();
                Then.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iCheckRows(8);

                // Clear All filters and all rows should be visible
                When.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iChangeFilterField("Catalogs", "", true)
                    .and.iExecuteSearch();
                Then.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iCheckRows(15);

                When.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iCancel();

            });

            opaTest("Test the search field of Skill value help", function (
                Given,
                When,
                Then
            ) {

                // To get the focus on the 1st row and Name column of Skills table and open the value help
                When.onTheResourceRequestObjectPage
                    .onTable("Skills")
                    .iPressCell(0, "Skill")
                    .and.iExecuteKeyboardShortcut("F4", {"Skill":""}, "Skill");

                // Search in Skill dialog by Skill name
                When.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iChangeSearchField("Cloud Foundry")
                    .and.iExecuteSearch();
                Then.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iCheckRows(1);

                // Search in Skill dialog by description
                When.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iChangeSearchField("Description for CAP")
                    .and.iExecuteSearch();
                Then.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iCheckRows(1);

                // Search in Skill dialog by catalog
                When.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iChangeSearchField("Catalog One")
                    .and.iExecuteSearch();
                Then.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iCheckRows(8);

                // Clear Search in the Skill dialog and all rows should be visible
                When.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iResetSearchField()
                    .and.iExecuteSearch();
                Then.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iCheckRows(15);

                When.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iCancel();

                // Save Resource Request
                When.onTheResourceRequestObjectPage
                    .onFooter()
                    .iExecuteSave();

                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckEdit();

            });

            opaTest("Check All ID's of hotspots", function (Given, When, Then) {

                // Inform UA if changing any ID's in this test.
                When.onTheResourceRequestObjectPage.iGoToSection("Project Information");

                // Expand page header
                When.onTheResourceRequestObjectPage
                    .iCollapseExpandPageHeader();

                // HotSpot ID's have not changed
                // Publishing Status
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("manageResourceRequest::ResourceRequestObjectPage--fe::HeaderFacet::KeyFigure::DataPoint::ReleaseStatus");
                // Staffing Sumarry(Hours)
                //Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("manageResourceRequest::ResourceRequestObjectPage--fe::HeaderDPTitle::DataPoint::StaffingStatusProgress");
                // Publish Button
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("manageResourceRequest::ResourceRequestObjectPage--fe::DataFieldForAction::ManageResourceRequestService.publishResourceRequest");
                // Demand
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionProjectDemand::FormElement::DataField::demand::ID-label");
                // Billing Category
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionProjectDemand::FormElement::DataField::demand::billingCategory::name-label");
                // Project
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionProject::FormElement::DataField::project::name-label");

                When.onTheResourceRequestObjectPage.iGoToSection("Resource Request Details");
                // Project Role
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FormElement::DataField::projectRole_ID-label");
                // Requested Resource Org
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FormElement::DataField::requestedResourceOrg_ID-label");

                When.onTheResourceRequestObjectPage.iGoToSection("Effort");
                // Effort Distribution Type
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("manageResourceRequest::ResourceRequestObjectPage--fe::CustomSubSection::effortcustomSection--effortDistributionTypes");
                // Required Efforts(Hours)
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("manageResourceRequest::ResourceRequestObjectPage--fe::CustomSubSection::effortcustomSection--requiredEffort");

                When.onTheResourceRequestObjectPage.iGoToSection("Required Skills");
                // Skills(Count)
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("manageResourceRequest::ResourceRequestObjectPage--fe::table::skillRequirements::LineItem-title");
                // Proficiency Level
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("manageResourceRequest::ResourceRequestObjectPage--fe::table::skillRequirements::LineItem::C::proficiencyLevel_ID-innerColumn");
                // Importance
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("manageResourceRequest::ResourceRequestObjectPage--fe::table::skillRequirements::LineItem::C::importance_code-innerColumn");

                // Check Navigation button should be disabled for published Resource Request
                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteAction("Open In");

                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckMenuAction({text: "Staff Resource Requests", enabled: false });

                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteAction("Publish");

                // Check Navigation button should be enabled for unpublished Resource Request
                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteAction("Open In");

                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckMenuAction({text: "Staff Resource Requests", enabled: true });

                // Withdraw Button
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("manageResourceRequest::ResourceRequestObjectPage--fe::DataFieldForAction::ManageResourceRequestService.withdrawResourceRequest");
                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteAction("Withdraw");
            });

            opaTest("Teardown", function (Given, When, Then) {
                Given.iTearDownMyApp();
            });
        }
    };
});
