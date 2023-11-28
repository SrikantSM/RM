sap.ui.define(["sap/ui/test/opaQunit"], function (
    opaTest
) {

    return {
        run: function () {

            ///////////////////////////////////////////////////////////////////////////
            QUnit.module("Manage Resource Request | List Report UX Consistency");
            ///////////////////////////////////////////////////////////////////////////

            opaTest("List page displays all the columns in default order", function (
                Given,
                When,
                Then
            ) {
                Given.iStartMyApp("ResourceRequest-Manage");
                Then.onTheResourceRequestListReportPage.iSeeThisPage();

                // Open the Adapt filters
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iOpenFilterAdaptation();

                // Check the default selected adapt filters
                Then.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iCheckAdaptationFilterField("Editing Status",{selected: true})
                    .and.iCheckAdaptationFilterField("Request ID",{selected: true})
                    .and.iCheckAdaptationFilterField("Request Name",{selected: true})
                    .and.iCheckAdaptationFilterField("Staffing Status",{selected: true})
                    .and.iCheckAdaptationFilterField("Request Priority",{selected: true})
                    .and.iCheckAdaptationFilterField("Publishing Status",{selected: true})
                    .and.iCheckAdaptationFilterField("Project Role",{selected: true})
                    .and.iCheckAdaptationFilterField("Assignment Status",{selected: false})
                    .and.iCheckAdaptationFilterField("Demand",{selected: false})
                    .and.iCheckAdaptationFilterField("Processor",{selected: false})
                    .and.iCheckAdaptationFilterField("Project",{selected: false})
                    .and.iCheckAdaptationFilterField("Request Status",{selected: false})
                    .and.iCheckAdaptationFilterField("Requested Resource Organization",{selected: false})
                    .and.iCheckAdaptationFilterField("Requested End Date",{selected: true})
                    .and.iCheckAdaptationFilterField("Requested Start Date",{selected: true})
                    .and.iCheckAdaptationFilterField("Required Effort",{selected: false})
                    .and.iCheckAdaptationFilterField("Resource Manager",{selected: false})
                    .and.iCheckAdaptationFilterField("Work Package",{selected: false})
                    .and.iCheckAdaptationFilterField("Reference Object ID",{selected: false})
                    .and.iCheckAdaptationFilterField("Reference Object Type",{selected: false})
                    .and.iConfirmFilterAdaptation();

                Then.onTheResourceRequestListReportPage
                    .onTable({ property: "ResourceRequests" })
                    .iCheckCreate({ visible: true, enabled: true })
                    .and.iCheckDelete({ visible: true, enabled: false })
                    .and.iCheckColumnSorting()
                    .and.iCheckSortOrder("Request ID", "Descending")
                    .and.iCheckExport({ visible: true, enabled: true })
                    .and.iCheckColumns(9, {
                        "Request ID": { importance: "High" },
                        "Request Name": { importance: "None" },
                        "Requested Start Date": { importance: "None" },
                        "Requested End Date": { importance: "None" },
                        "Staffing Status": { importance: "None" },
                        "Request Priority": { importance: "None" },
                        "Publishing Status": { importance: "None" },
                        "Processor": { importance: "None" },
                        "Project Role": { importance: "None" }
                    });
                // Check for hotspot ID's failure should be discussed with UA
                Then.onTheResourceRequestListReportPage.iShouldSeeTheElementWithId('manageResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests');
                //  Then.onTheResourceRequestListReportPage.iShouldSeeTheElementWithId('manageResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem::C::DataPoint::StaffingStatusProgress-innerColumn');
            });

            opaTest("Test the filter fields of Project Role value help", function (
                Given,
                When,
                Then
            ) {

                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iOpenValueHelp({ property: 'projectRole_ID' });
                When.onTheResourceRequestListReportPage
                    .onValueHelpDialog({ property: 'projectRole_ID' })
                    .iExecuteShowHideFilters();
                Then.onTheResourceRequestListReportPage
                    .onValueHelpDialog({ property: 'projectRole_ID' })
                    .iCheckState({ title: "Project Role" })
                    .and.iCheckSearchField()
                    .and.iCheckFilterField({ property: "code" })
                    .and.iCheckFilterField({ property: "name" })
                    .and.iCheckTable()
                    .and.iCheckFilterBar();

                // Add filter for Code in the Project Role value help dialog
                When.onTheResourceRequestListReportPage
                    .onValueHelpDialog()
                    .iChangeFilterField("Code", "P002", true)
                    .and.iExecuteSearch();

                Then.onTheResourceRequestListReportPage
                    .onValueHelpDialog()
                    .iCheckRows(1);

                // Clear Code filter and filter for name in the Project Role value help dialog
                When.onTheResourceRequestListReportPage
                    .onValueHelpDialog()
                    .iChangeFilterField("Code", "", true)
                    .and.iChangeFilterField("Project Role", "Junior Consultant", true)
                    .and.iExecuteSearch();

                Then.onTheResourceRequestListReportPage
                    .onValueHelpDialog()
                    .iCheckRows(1);

                // Clear all filters and all rows should be visible
                When.onTheResourceRequestListReportPage
                    .onValueHelpDialog()
                    .iChangeFilterField("Project Role", "", true)
                    .and.iExecuteSearch();

                Then.onTheResourceRequestListReportPage
                    .onValueHelpDialog()
                    .iCheckRows(3);

                When.onTheResourceRequestListReportPage
                    .onValueHelpDialog()
                    .iConfirm();
            });

            opaTest("Test the search field of Project Role value help", function (
                Given,
                When,
                Then
            ) {
                // Open Project role value help
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iOpenValueHelp({ property: 'projectRole_ID' });

                // Search in the Project Role dialog by Project Role ID
                When.onTheResourceRequestListReportPage
                    .onValueHelpDialog()
                    .iChangeSearchField("P002")
                    .and.iExecuteSearch();

                Then.onTheResourceRequestListReportPage
                    .onValueHelpDialog()
                    .iCheckRows(1);

                // Search in the Project Role dialog by Project Role name
                When.onTheResourceRequestListReportPage
                    .onValueHelpDialog()
                    .iChangeSearchField("Junior Consultant")
                    .and.iExecuteSearch();

                Then.onTheResourceRequestListReportPage
                    .onValueHelpDialog()
                    .iCheckRows(1);

                // Clear Search in the Project Role dialog and all rows should be visible
                When.onTheResourceRequestListReportPage
                    .onValueHelpDialog()
                    .iResetSearchField()
                    .and.iExecuteSearch();
                Then.onTheResourceRequestListReportPage
                    .onValueHelpDialog()
                    .iCheckRows(3);

                When.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iConfirm();
            });

            opaTest("Teardown", function (Given, When, Then) {
                Given.iTearDownMyApp();
            });
        }
    };
});
