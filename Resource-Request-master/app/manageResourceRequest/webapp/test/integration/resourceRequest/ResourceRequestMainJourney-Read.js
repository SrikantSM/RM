sap.ui.define(['sap/ui/test/opaQunit', "sap/fe/test/api/EditState"], function (
    opaTest,
    EditState
) {

    return {
        run: function () {

            //////////////////////////////////////////////////////////
            QUnit.module('Manage Resource Request | Read');
            //////////////////////////////////////////////////////////

            opaTest('Search a resource request in list page', function (
                Given,
                When,
                Then
            ) {
                Given.iStartMyApp("ResourceRequest-Manage");
                Then.onTheResourceRequestListReportPage.iSeeThisPage();

                // Change editing status to Unchanged and set request name filter
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeEditingStatus(EditState.Unchanged)
                    .and.iChangeFilterField({ property: 'name' }, "Resource Request 2", true);

                // Open project role value help
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iOpenValueHelp({ property: 'projectRole_ID' });

                // Select row with code P004 and press OK
                When.onTheResourceRequestListReportPage
                    .onValueHelpDialog()
                    .iSelectRows({ "Code": "P004" })
                    .and.iConfirm();

                // Set staffing status to Not staffed and priority code to High
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: "staffingStatus::staffingCode" }, "Not Staffed")
                    .and.iChangeFilterField({ property: "priority_code" }, "High");

                // Search and check the table for filtered Resource Request
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iExecuteSearch();
                Then.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iCheckState()
                    .and.then.onTable()
                    .iCheckRows(1);
            });

            opaTest('Navigate to object page in read only mode', function (
                Given,
                When,
                Then
            ) {
                /* When I select a resource request (not stuffed) from the list;
                Then I can see the edit, delete and publish button in the object page; */

                When.onTheResourceRequestListReportPage
                    .onTable()
                    .iPressRow({ "Request ID": "0000000002" });

                // Check edit, delete and publish button is visible in the header
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckEdit({visible: true})
                    .and.iCheckDelete({visible: false})
                    .and.iCheckAction("Publish");
            });

            opaTest('Read header details in the resource request object page', function (
                Given,
                When,
                Then
            ) {
                /* Then I can see the resource request header details in object page; */

                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckTitle("Resource Request 2")
                    .and.iCheckFieldInFieldGroup(
                        { fieldGroup: "FieldGroup::Effort", field: "startDate" },
                        "Jan 1, 2019"
                    )
                    .and.iCheckFieldInFieldGroup(
                        { fieldGroup: "FieldGroup::Effort", field: "endDate" },
                        "Feb 28, 2019"
                    )
                    .and.iCheckFieldInFieldGroup(
                        { fieldGroup: "FieldGroup::Effort", field: "requestedCapacity" },
                        "350 hr"
                    );

                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckDataPoint("Request Priority", "High")
                    .and.iCheckDataPoint("Request Status", "Open")
                    .and.iCheckDataPoint("Publishing Status", "Not Published");

                // Then.onTheResourceRequestObjectPage
                //     .onHeader()
                //     .iCheckDataPoint("Assignment Status Overview (Hours)", "0.00 of 350.00");

                Then.onTheResourceRequestObjectPage
                    .iShouldSeeTheVBoxWithLabelAndBindingPathAndValue(
                        'sap.m.Title', {
                            text: 'Assignment Status Overview'
                        },
                        'sap.suite.ui.microchart.StackedBarMicroChartBar', {
                            displayValue: '350.00 hr'
                        }, {
                            propertyPath: "staffingStatus/remainingCapacity"
                        }
                    );

                Then.onTheResourceRequestObjectPage
                    .iShouldSeeTheVBoxWithLabelAndBindingPathAndValue(
                        'sap.m.Title', {
                            text: 'Staffing Status'
                        },
                        'sap.suite.ui.microchart.BulletMicroChart', {
                            forecastValue: 0,
                            targetValue: 350
                        }, {
                            propertyPath: "requestedCapacity"
                        }
                    );
            });


            opaTest('Read information in Assignment Status Overview chart popover', function (
                Given,
                When,
                Then
            ) {
                /* When I click on the Assignment Status Overview chart */
                When.onTheResourceRequestObjectPage.iClickOnStackedBarChart();
                /* Then I can see the details of Assignment status in the popover; */
                Then.onTheResourceRequestObjectPage
                    .iShouldSeeTheElementTypeWithProperty('sap.m.Popover',
                        {
                            title: 'Assignment Status Overview'
                        })
                    .and.iShouldSeeTheElementWithProperties('manageResourceRequest::ResourceRequestObjectPage--StaffingSummaryPopover--labelRequested',
                        {
                            title: 'Required Effort'
                        })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.suite.ui.microchart.StackedBarMicroChartBar',
                        {
                            value: 100,
                            valueColor: 'sapUiChartPaletteQualitativeHue22'
                        })
                    .and.iShouldSeeTheElementWithProperties('manageResourceRequest::ResourceRequestObjectPage--StaffingSummaryPopover--labelHardBooked',
                        {
                            title: 'Hard-Booked'
                        })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.suite.ui.microchart.StackedBarMicroChartBar',
                        {
                            value: 100,
                            valueColor: 'sapUiChartPaletteQualitativeHue1'
                        })
                    .and.iShouldSeeTheElementWithProperties('manageResourceRequest::ResourceRequestObjectPage--StaffingSummaryPopover--labelSoftBooked',
                        {
                            title: 'Soft-Booked'
                        })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.suite.ui.microchart.StackedBarMicroChartBar',
                        {
                            value: 100,
                            valueColor: 'sapUiChartPaletteSemanticNeutralLight3'
                        })
                    .and.iShouldSeeTheElementWithProperties('manageResourceRequest::ResourceRequestObjectPage--StaffingSummaryPopover--labelUnstaffed',
                        {
                            title: 'Remaining'
                        });
            }
            );

            opaTest('Read project information in the resource request object page', function (
                Given,
                When,
                Then
            ) {
                /* Then I can see the resource request project information details in object page; */

                Then.onTheResourceRequestObjectPage
                    .onForm({ section: "ProjectInformation", fieldGroup: "SubSectionProjectDemand" })
                    .iCheckField("Demand", "Junior Consultant");

                Then.onTheResourceRequestObjectPage
                    .onForm({ section: "ProjectInformation", fieldGroup: "SubSectionWorkpackage" })
                    .iCheckField("Work Package", "Concept and Design");

                Then.onTheResourceRequestObjectPage
                    .onForm({ section: "ProjectInformation", fieldGroup: "SubSectionProject" })
                    .iCheckField("Project", "EWM-Prod")
                    .and.iCheckField("Customer", "iTelO");
            }
            );

            opaTest('Read resource request details in the resource request object page', function (
                Given,
                When,
                Then
            ) {
                /* Then I can see the resource request details in object page; */

                When.onTheResourceRequestObjectPage.iGoToSection("Resource Request Details");

                Then.onTheResourceRequestObjectPage
                    .onForm({ section: "ResourceRequestDetails", fieldGroup: "SubSectionRequest1" })
                    .iCheckField("Request Name", "Resource Request 2")
                    .and.iCheckField("Project Role", "Senior Consultant")
                    .and.iCheckField("Resource Manager", "diane.jobs@sap.com")
                    .and.iCheckField("Request Priority", "High")
                    .and.iCheckField("Requested Resource Organization", "Organization ORG_2 Germany");

                Then.onTheResourceRequestObjectPage
                    .onForm({ section: "ResourceRequestDetails", fieldGroup: "SubSectionRequest2" })
                    .iCheckField("Description", "Budget constraints/high demand in the Project so please assign accordingly");
            });

            opaTest('Read skill details in the object page', function (
                Given,
                When,
                Then
            ) {
                /* Then I can see required skill row in object page; */

                Then.onTheResourceRequestObjectPage
                    .iSeeSectionWithTitle("Required Skills")
                    .and.onTable("Skills")
                    .iCheckRows({
                        "Skill": "Core Data Service",
                        "Proficiency Level": "Not Set",
                        "Importance": "Mandatory",
                        "Comment": "Skill required"
                    },1);
            });

            opaTest('Navigate back to list page after read', function (
                Given,
                When,
                Then
            ) {
                /* When I navigate from object page after read
                Then I can see the list report in resource request list page; */

                When.onTheShell.iNavigateBack();

                Then.onTheResourceRequestListReportPage.onTable().iCheckRows(1);
            });

            opaTest("Teardown", function (Given, When, Then) {
                Given.iTearDownMyApp();
            });
        }
    };
});
