sap.ui.define([
    'sap/ui/test/opaQunit'
], function (opaTest) {

    return {
        run: function () {

            ////////////////////////////////////////////////////
            QUnit.module('UX Consistency - Staff Resource Request - Read ListReport scenarios');
            ////////////////////////////////////////////////////

            opaTest('I can load the List Report and display the 4 existing ResourceRequest', function (Given, When, Then) {

                Given.iStartMyApp("ResourceRequest-Display");
                Then.onTheResourceRequestListReportPage.iSeeThisPage();

                // Open the Adapt filters
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iOpenFilterAdaptation();

                // Check the default selected adapt filters
                Then.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iCheckAdaptationFilterField("Request ID",{selected: true})
                    .and.iCheckAdaptationFilterField("Request Name",{selected: true})
                    .and.iCheckAdaptationFilterField("Staffing Status",{selected: true})
                    .and.iCheckAdaptationFilterField("Request Priority",{selected: true})
                    .and.iCheckAdaptationFilterField("Request Status",{selected: true})
                    .and.iCheckAdaptationFilterField("Project Role",{selected: true})
                    .and.iCheckAdaptationFilterField("Assignment Status",{selected: false})
                    .and.iCheckAdaptationFilterField("Demand",{selected: false})
                    .and.iCheckAdaptationFilterField("Processing Resource Organization",{selected: false})
                    .and.iCheckAdaptationFilterField("Processor",{selected: false})
                    .and.iCheckAdaptationFilterField("Publishing Status",{selected: false})
                    .and.iCheckAdaptationFilterField("Project",{selected: false})
                    .and.iCheckAdaptationFilterField("Requested Resource Organization",{selected: false})
                    .and.iCheckAdaptationFilterField("Requested End Date",{selected: true})
                    .and.iCheckAdaptationFilterField("Requested Start Date",{selected: true})
                    .and.iCheckAdaptationFilterField("Required Effort",{selected: false})
                    .and.iCheckAdaptationFilterField("Resource Manager",{selected: false})
                    .and.iCheckAdaptationFilterField("Work Package",{selected: false})
                    .and.iCheckAdaptationFilterField("Reference Object ID",{selected: false})
                    .and.iCheckAdaptationFilterField("Reference Object Type",{selected: false})
                    .and.iConfirmFilterAdaptation();

                // Check table attributes and columns
                Then.onTheResourceRequestListReportPage
                    .onTable({ property: "ResourceRequests" })
                    .iCheckCreate({ visible: false, enabled: false })
                    .and.iCheckDelete({ visible: false, enabled: false })
                    .and.iCheckColumnSorting()
                    .and.iCheckSortOrder("Request ID", "Descending")
                    .and.iCheckExport({ visible: true, enabled: true })
                    .and.iCheckColumns(8, {
                        "Request ID": { importance: "High" },
                        "Request Name": { importance: "None" },
                        "Requested Start Date": { importance: "None" },
                        "Requested End Date": { importance: "None" },
                        "Staffing Status": { importance: "None" },
                        "Request Priority": { importance: "None" },
                        "Processor": { importance: "None" },
                        "Project Role": { importance: "None" }
                    });

                // Check for hotspot ID's failure should be discussed with UA
                Then.onTheResourceRequestListReportPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests");
                //Then.onTheResourceRequestListReportPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem::C::DataPoint::StaffingStatusProgress-innerColumn");

                Then.iTeardownMyAppFrame();
            });

            opaTest('Staff Resource Request Object Page', function (Given, When, Then) {

                Given.iStartMyApp("ResourceRequest-Display&/ResourceRequests(16b79902-afa0-4bef-9658-98cd8d671212)");
                Then.onTheResourceRequestObjectPage.iSeeThisPage();

                // Check title on object page
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckTitle("Resource Request 6");

                // Go to section General Information
                When.onTheResourceRequestObjectPage.iGoToSection("General Information");

                // The attributes of Project details are visible
                Then.onTheResourceRequestObjectPage
                    .onForm({ section: "GeneralInformation", fieldGroup: "SubSectionProject" })
                    .iCheckField("Project")
                    .and.iCheckField("Customer")
                    .and.iCheckField("Work Package")
                    .and.iCheckField("Demand");

                // The attributes of Request details are visible
                Then.onTheResourceRequestObjectPage
                    .onForm({ section: "GeneralInformation", fieldGroup: "SubSectionRequest" })
                    .iCheckField("Request Name")
                    .and.iCheckField("Project Role")
                    .and.iCheckField("Resource Manager")
                    .and.iCheckField("Processor")
                    .and.iCheckField("Requested Resource Organization")
                    .and.iCheckField("Processing Resource Organization")
                    .and.iCheckField("Description")
                    .and.iCheckField("Required Effort")
                    .and.iCheckField("Effort Distribution");

                // Go to section Required Skills
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

                // Go to section Assignments
                When.onTheResourceRequestObjectPage.iGoToSection("Assignments");

                // I see sub-section Staffing Summary
                Then.onTheResourceRequestObjectPage.iSeeSubSectionWithTitle("Staffing Summary");

                // The attributes of Staffing summary are visible
                // Then.onTheResourceRequestObjectPage
                //     .onForm({ section: "StaffingSummary", fieldGroup: "SubSectionRequestEffort" })
                //     .iCheckField({property: "Required Effort (Hours)"})
                //     .and.iCheckField("Staffed (Hours)")
                //     .and.iCheckField("Remaining (Hours)");

                // Go to section Assigned Resources
                Then.onTheResourceRequestObjectPage.iSeeSubSectionWithTitle("Assigned Resources");

                // Check columns in the Assigned resources table
                Then.onTheResourceRequestObjectPage
                    .onTable("Assigned Resources")
                    .iCheckColumns(7, {
                        "Name": { importance: "High" },
                        "Worker Type": { importance: "None" },
                        "Assignment Start": { importance: "High" },
                        "Assignment End": { importance: "None" },
                        "Assigned": { importance: "None" },
                        "Assignment Status": { importance: "High" },
                        "": { importance: "High" }
                    });

                // Go to section Matching Resources
                When.onTheResourceRequestObjectPage.iGoToSection("Matching Resources");

                // Check columns in the Matching Resources table
                Then.onTheResourceRequestObjectPage
                    .onTable({property:"matchingCandidates"})
                    .iCheckColumns(8,{
                        "Name": { importance: "High" },
                        "Worker Type": { importance: "None" },
                        "Project Roles": { importance: "High" },
                        "Total Match": { importance: "High" },
                        "Availability Match": { importance: "High" },
                        "Skills Match": { importance: "High" },
                        "Utilization Next 90 Days": { importance: "None" },
                        "": { importance: "High" }
                    })
                    .and.iOpenFilterDialog();
                Then.onTheResourceRequestObjectPage.iCheckTheComboBoxForFilter();
                Then.onTheResourceRequestObjectPage.iPressTheDropDown();
                Then.onTheResourceRequestObjectPage.iSelectTheFieldFromDropDown("Name" );
                Then.onTheResourceRequestObjectPage.iPressTheDropDown();
                Then.onTheResourceRequestObjectPage.iSelectTheFieldFromDropDown("Availability Match" );
                Then.onTheResourceRequestObjectPage.iPressTheDropDown();
                Then.onTheResourceRequestObjectPage.iSelectTheFieldFromDropDown("Skills Match" );
                Then.onTheResourceRequestObjectPage.iPressTheDropDown();
                Then.onTheResourceRequestObjectPage.iSelectTheFieldFromDropDown("Total Match" );
                Then.onTheResourceRequestObjectPage.iPressTheDropDown();
                Then.onTheResourceRequestObjectPage.iSelectTheFieldFromDropDown("Utilization Next 90 Days" );
                Then.onTheResourceRequestObjectPage.iPressTheDropDown();
                Then.onTheResourceRequestObjectPage.iSelectTheFieldFromDropDown("Worker Type" );
                Then.onTheResourceRequestObjectPage.iPressButton("Cancel");
            });

            opaTest("Check All ID's of hotspots", function (Given, When, Then) {

                // Inform UA if changing any ID's in this test.
                When.onTheResourceRequestObjectPage.iGoToSection("General Information");
                // Check Navigation button
                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteAction("Open In");

                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckMenuAction({text: "Manage Resource Requests", enabled: true });

                // Expand page header
                When.onTheResourceRequestObjectPage
                    .iCollapseExpandPageHeader();

                // HotSpot ID's have not changed
                // Staffing Status
                //Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestObjectPage--fe::HeaderFacet::KeyFigure::DataPoint::StaffingStatusDescription");
                // Set My Responsibility
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestObjectPage--fe::DataFieldForAction::ProcessResourceRequestService.setMyResponsibilityResourceRequest");
                // Forward Button
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestObjectPage--fe::DataFieldForAction::ProcessResourceRequestService.forwardResourceRequest");
                // Resolve Button
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestObjectPage--fe::DataFieldForAction::ProcessResourceRequestService.resolveResourceRequest");
                // Requested Resource Org
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest::FormElement::DataField::requestedResourceOrg_ID-label");
                // Processing Resource Org
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest::FormElement::DataField::processingResourceOrg_ID-label");
                // Required Effort
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest::customFormElementAnchor--requiredEfforts");
                // Project
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionProject::FormElement::DataField::project::name-label");

                When.onTheResourceRequestObjectPage.iGoToSection("Required Skills");
                // Proficiency level
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestObjectPage--fe::table::skillRequirements::LineItem::C::proficiencyLevel_ID-innerColumn");
                // Importance
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestObjectPage--fe::table::skillRequirements::LineItem::C::importance::name-innerColumn");

                When.onTheResourceRequestObjectPage.iGoToSection("Assignments");
                // Start Date
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestObjectPage--fe::table::staffing::LineItem::C::startDate-innerColumn"); //done till here
                // Update Unassign Button
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestObjectPage--fe::table::staffing::LineItem::C::assignmentStatus::name-innerColumn");

                When.onTheResourceRequestObjectPage.iGoToSection("Matching Resources");
                // Title
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestObjectPage--fe::table::matchingCandidates::LineItem-title");
                // Total Match
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestObjectPage--fe::table::matchingCandidates::LineItem::C::totalMatchPercentage-innerColumn");
                // Availability Match
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestObjectPage--fe::table::matchingCandidates::LineItem::C::availabilityMatchPercentage-innerColumn");
                // Skill Match
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestObjectPage--fe::table::matchingCandidates::LineItem::C::skillMatchPercentage-innerColumn");

                // Not able to see due to screen size
                // utilization Percentage
                // Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithId("staffResourceRequest::ResourceRequestObjectPage--fe::table::matchingCandidates::LineItem::C::utilizationPercentage-innerColumnHeader");

                // Assign resource
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithKey("ASSIGN");
                // QuickAssign resource
                Then.onTheResourceRequestObjectPage.iShouldSeeTheElementWithKey("QUICKASSIGN");
            });

            opaTest("Teardown", function (Given, When, Then) {
                Given.iTearDownMyApp();
            });
        }
    };

});
