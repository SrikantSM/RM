sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
    "use strict";

    var Journey = {
        run: function () {
            QUnit.module("Availability Upload Ui");

            // Check the page title and filters in the header
            opaTest("On opening the app, I should see correct page title and filters in the header", function (Given, When, Then) {
                Given.iResetTestData().and.iStartMyApp("availabilityUploadUi-Display");
                Then.onTheMainPage.iSeeThisPage();
                When.onTheMainPage.iCollapseExpandPageHeader(false);
                Then.onTheShell.iSeeShellAppTitle("Maintain Availability Data");
                Then.onTheMainPage.onFilterBar().iCheckFilterField(
                    { property: "workerTypeName" }, undefined, //2nd parameter value
                    { label: "Worker Type" })
                    .and.iCheckFilterField(
                        { property: "resourceOrg" }, undefined, //2nd parameter value
                        { label: "Resource Organization" })
                    .and.iCheckFilterField(
                        { property: "workForcePersonExternalId" }, undefined,
                        { label: "Workforce Person (External ID)" })
                    .and.iCheckFilterField(
                        { property: "s4CostCenterId" }, undefined,
                        { label: "Cost Center" })
                    .and.iCheckFilterField(
                        { property: "availabilitySummaryStatus/code" }, undefined,
                        { label: "Upload Status" });
                Then.onTheMainPage.onFilterBar().iCheckSearch();
            });

            // Check the list of already uploaded availability data
            opaTest("On opening the app, I should see list of already uploaded availability data", function (Given, When, Then) {
                When.onTheMainPage.iExecuteShowDetails();
                Then.onTheMainPage.onTable().iCheckRows(5).and.iCheckAction("Upload").and.iCheckAction("Download Template");
                Then.onTheMainPage.iShouldSeeCorrectSelectionMode("None")
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Button', { text: 'Settings' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Button', { icon: 'sap-icon://excel-attachment' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Button', { icon: 'sap-icon://slim-arrow-down' });
                Then.onTheMainPage.onTable().iCheckColumns(8,{
                    "Name": { headerVisible: true },
                    "Worker Type": { headerVisible: true },
                    "Resource Organization": { headerVisible: true },
                    "Cost Center": { headerVisible: true },
                    "Workforce Person (External ID)": { headerVisible: true },
                    "Work Assignment (External ID)": { headerVisible: true },
                    "Upload Status": { headerVisible: true },
                    "Total Data Uploaded for Time Period": { headerVisible: true }
                });
            });

            //Check adapt filter
            opaTest('Check Adapt filter works on click', function (Given, When, Then) {
                When.onTheMainPage.iCollapseExpandPageHeader(false);
                Then.onTheMainPage.onFilterBar().iOpenFilterAdaptation()
                    .and.iConfirmFilterAdaptation();
            });

            //Add/Remove columns check
            //Added title as 'Upload status' instead of 'Availability Status' FYI https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/722
            opaTest('On click of Add/Remove Columns icon, I should see correct number of columns and data.', function (Given, When, Then) {
                When.onTheMainPage.onTable().iOpenColumnAdaptation();
                Then.onTheMainPage
                    .onTable().iCheckAdaptationColumn("Name", { selected: true })
                    .and.iCheckAdaptationColumn("Worker Type", { selected: true })
                    .and.iCheckAdaptationColumn("Resource Organization", { selected: true })
                    .and.iCheckAdaptationColumn("Cost Center", { selected: true })
                    .and.iCheckAdaptationColumn("Workforce Person (External ID)", { selected: true })
                    .and.iCheckAdaptationColumn("Work Assignment (External ID)", { selected: true })
                    .and.iCheckAdaptationColumn("Upload Status", { selected: true })
                    .and.iCheckAdaptationColumn("Total Data Uploaded for Time Period", { selected: true })
                    .and.iCheckAdaptationColumn("Cost Center (ODM ID)", { selected: false })
                    .and.iCheckAdaptationColumn("End of Time Period", { selected: false })
                    .and.iCheckAdaptationColumn("First Name", { selected: false })
                    .and.iCheckAdaptationColumn("Last Name", { selected: false })
                    .and.iCheckAdaptationColumn("Marked for Deletion", { selected: false })
                    .and.iCheckAdaptationColumn("Resource Organization ID", { selected: false })
                    .and.iCheckAdaptationColumn("Start of Time Period", { selected: false })
                    .and.iCheckAdaptationColumn("Total Days in Time Period", { selected: false })
                    .and.iCheckAdaptationColumn("Upload Status Code", { selected: false })
                    .and.iCheckAdaptationColumn("Uploaded Days in Time Period", { selected: false })
                    .and.iCheckAdaptationColumn("Work Assignment End Date", { selected: false })
                    .and.iCheckAdaptationColumn("Work Assignment Start Date", { selected: false });
                When.onTheMainPage.onTable().iConfirmColumnAdaptation();
                Then.onTheMainPage.onTable().iCheckColumns(8);
            });


            // Search with name
            opaTest("On searching with name, I should see correct availability data", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar().iChangeSearchField("Test Usere2e4")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(1);
                When.onTheMainPage.onFilterBar().iChangeSearchField("")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            // Search with Resource Organization
            opaTest("On searching with Resource Organization, I should see correct availability data", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar().iChangeSearchField("Organization ORG_1 Germany")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(2);
                When.onTheMainPage.onFilterBar().iChangeSearchField("")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            // Search with cost center
            opaTest("On searching with cost center, I should see correct availability data", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar().iChangeSearchField("CCIN")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(2);
                When.onTheMainPage.onFilterBar().iChangeSearchField("")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            //check if cost center is present even though there is no resource org for it
            opaTest("Check if cost center is present even though there is no resource organization maintained for it", function (Given, When, Then){
                When.onTheMainPage.onFilterBar().iChangeSearchField("Test Usere2e5")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows({ "Resource Organization": ""}).and.iCheckRows({ "Cost Center": "Manufacturing 2 (CCEU)" });
                When.onTheMainPage.onFilterBar().iChangeSearchField("")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });


            //Search with Workforce Person (External ID)
            opaTest("On searching with Workforce Person (External ID), I should see correct availability data", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar().iChangeSearchField("test.usere2e1")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(1);
                When.onTheMainPage.onFilterBar().iChangeSearchField("")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            //Search with Work Assignment (External ID)
            opaTest("On searching with Work Assignment (External ID), I should see correct availability data", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar().iChangeSearchField("EMPH2R99217")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(2);
            });

            // Reset the search
            opaTest("On resetting the search, I should see correct list of availability data", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar().iChangeSearchField("")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            // Filter by valid worker type
            opaTest("On filtering by valid worker type name, I should see correct list of availability data", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "workerTypeName" }, "External Worker")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "workerTypeName" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            // Filter by valid resource org name
            opaTest("On filtering by valid resource org name, I should see correct list of availability data", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "resourceOrg" }, "Organization ORG_2 Germany")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(2);

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "resourceOrg" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            // Filter by valid Resource Organization (select Resource Organization from filter value help)
            opaTest("On filtering by valid resource organization(select from value help), I should see correct filtered list", function (Given, When, Then) {
                When.onTheMainPage.iClickOnTheElement('availabilityUploadUi::AvailabilityUploadListReport--fe::FilterBar::AvailabilityUploadData::FilterField::resourceOrg-inner-vhi');

                Then.onTheMainPage
                    .onValueHelpDialog()
                    .iCheckTable()
                    .and.iCheckFilterBar();
                When.onTheMainPage
                    .onValueHelpDialog()
                    .iExecuteShowHideFilters();
                When.onTheMainPage
                    .onValueHelpDialog()
                    .iChangeSearchField('Org_1').and.iExecuteSearch();
                When.onTheMainPage
                    .onValueHelpDialog()
                    .iSelectRows({"ID" : "Org_1"})
                    .and.iConfirm();
                When.onTheMainPage.onFilterBar().iExecuteSearch();

                Then.onTheMainPage.onTable().iCheckRows(2);

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "resourceOrg" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            // Filter by invalid resource org name
            opaTest("On filtering by invalid resource org name, I should see an empty list", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "resourceOrg" }, "test");
                // Issue Link: https://github.wdf.sap.corp/fiori-elements/v4-consulting/issues/2554
                // Issue: Though the OPA5 journey is not bale to capture the error.
                //        Below error appears if the journey is mimicked manually.
                // Then.onTheMainPage.onFilterBar().iCheckFilterField({ property: "resourceOrg" }, undefined, undefined, {
                //     valueState: "Error",
                //     valueStateText: 'Value "test" does not exist.'
                // });

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "resourceOrg" }, "")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            // Filter by valid Workforce Person (External ID)
            opaTest("On filtering by valid Workforce Person (External ID), I should see correct list of availability data", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "workForcePersonExternalId" }, "test.usere2e1")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(1)
                    .and.iCheckCells({ "Workforce Person (External ID)": "test.usere2e1"});

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "workForcePersonExternalId" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            // Filter by valid Workforce Person (External ID)(select Workforce Person from filter value help)
            opaTest("On filtering by valid workforce person ID(select from value help), I should see correct filtered list", function (Given, When, Then) {
                When.onTheMainPage.iClickOnTheElement('availabilityUploadUi::AvailabilityUploadListReport--fe::FilterBar::AvailabilityUploadData::FilterField::workForcePersonExternalId-inner-vhi');

                Then.onTheMainPage
                    .onValueHelpDialog()
                    .iCheckTable()
                    .and.iCheckFilterBar();
                When.onTheMainPage
                    .onValueHelpDialog()
                    .iExecuteShowHideFilters();
                When.onTheMainPage
                    .onValueHelpDialog()
                    .iChangeSearchField('test.usere2e1').and.iExecuteSearch();
                When.onTheMainPage
                    .onValueHelpDialog()
                    .iSelectRows({"Workforce Person (External ID)" : "test.usere2e1"})
                    .and.iConfirm();
                When.onTheMainPage.onFilterBar().iExecuteSearch();

                Then.onTheMainPage.onTable().iCheckRows(1);

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "workForcePersonExternalId" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            // Filter by invalid Workforce Person (External ID)
            opaTest("On filtering by invalid Workforce Person (External ID), I should see an error message", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "workForcePersonExternalId" }, "test");
                // Issue Link: https://github.wdf.sap.corp/fiori-elements/v4-consulting/issues/2554
                // Issue: Though the OPA5 journey is not bale to capture the error.
                //        Below error appears if the journey is mimicked manually.
                // Then.onTheMainPage.onFilterBar().iCheckFilterField({ property: "workForcePersonExternalId" }, undefined, undefined, {
                //     valueState: "Error",
                //     valueStateText: 'Value "test" does not exist.'
                // });

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "workForcePersonExternalId" }, "")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            // Filter by valid Cost center
            opaTest("On filtering by valid Cost center, I should see correct list of availability data", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "s4CostCenterId" }, "CCDE")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(2);

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "s4CostCenterId" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            // Filter by valid cost center (select cost center from filter value help)
            opaTest("On filtering by valid cost center (select from value help), I should see correct filtered list", function (Given, When, Then) {
                When.onTheMainPage.iClickOnTheElement('availabilityUploadUi::AvailabilityUploadListReport--fe::FilterBar::AvailabilityUploadData::FilterField::s4CostCenterId-inner-vhi');

                Then.onTheMainPage
                    .onValueHelpDialog()
                    .iCheckTable()
                    .and.iCheckFilterBar();
                When.onTheMainPage
                    .onValueHelpDialog()
                    .iExecuteShowHideFilters();
                When.onTheMainPage
                    .onValueHelpDialog()
                    .iChangeSearchField('CCDE').and.iExecuteSearch();
                When.onTheMainPage
                    .onValueHelpDialog()
                    .iSelectRows({"Cost Center" : "CCDE"})
                    .and.iConfirm();
                When.onTheMainPage.onFilterBar().iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(2);

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "s4CostCenterId" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            // Filter by invalid Cost center
            opaTest("On filtering by invalid Cost center, I should see an error message", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "s4CostCenterId" }, "CC");

                // Issue Link: https://github.wdf.sap.corp/fiori-elements/v4-consulting/issues/2554
                // Issue: Though the OPA5 journey is not bale to capture the error.
                //        Below error appears if the journey is mimicked manually.
                // Then.onTheMainPage.onFilterBar().iCheckFilterField({ property: "s4CostCenterId" }, undefined, undefined, {
                //     valueState: "Error",
                //     valueStateText: 'Value "CC" does not exist.'
                // });

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "s4CostCenterId" }, "")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            //Filter by upload status - Complete on list report
            opaTest('Filter availability data by upload status (Complete) ', function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "availabilitySummaryStatus/code" }, "Complete")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(1);

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "availabilitySummaryStatus/code" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            //Filter by upload status - Partial on list report
            opaTest('Filter availability data by upload status (Partial) ', function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "availabilitySummaryStatus/code" }, "Partial")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(1);

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "availabilitySummaryStatus/code" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            //Filter by upload status - Failed on list report
            opaTest('Filter availability data by upload status (Failed) ', function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "availabilitySummaryStatus/code" }, "Failed")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(2);

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "availabilitySummaryStatus/code" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            //Filter by upload status - Not Started on list report
            opaTest('Filter availability data by upload status (Not Started ) ', function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "availabilitySummaryStatus/code" }, "Not Started")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(1);

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "availabilitySummaryStatus/code" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(5);
            });

            // Check the variant management
            opaTest("I should be able save a variant of availability data list view", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar().iChangeSearchField("Organization ORG_2 Germany")
                    .and.iExecuteSearch();
                Then.onTheMainPage
                    .iSeeVariantTitle("Standard")
                    .and.iSeeVariantModified(true);
                When.onTheMainPage.iSaveVariant("Variant1");
                Then.onTheMainPage.iSeeVariantTitle("Variant1");
                Then.onTheMainPage.onTable().iCheckRows(2);
                Then.onTheMainPage.onTable().iCheckColumns(8);
                When.onTheMainPage.iSelectVariant("Standard");
                Then.onTheMainPage.iSeeVariantTitle("Standard");
                Then.onTheMainPage.onTable().iCheckRows(5);
                Then.onTheMainPage.onTable().iCheckColumns(8);
            });

            //Navigate to object page and check the details of availability data for one of the employee
            opaTest('Navigate to object page for one of the user and check details', function (Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow({ 5: "H2R4377882-1" }); //6th column
                Then.onTheDetailPage.iSeeThisPage();
                Then.onTheShell.iSeeShellAppTitle("Workforce Person Availability Data Details");
                Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty('sap.m.Label', { text: 'Resource Organization:' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Label', { text: 'Cost Center:' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Label', { text: 'Workforce Person (External ID):' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Label', { text: 'Work Assignment (External ID):' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Label', { text: 'Upload Status:' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.fe.macros.microchart.MicroChartContainer', { chartDescription: 'Total Data Uploaded for Time Period' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.suite.ui.microchart.RadialMicroChart', { percentage: 0 });
                Then.onTheDetailPage.iSeeSubSectionWithTitle("Data Uploaded")
                    .and.iSeeSubSectionWithTitle("Upload Errors");
                Then.onTheDetailPage.onHeader()
                    .iCheckTitle("Test Usere2e1");
                When.iNavigateBack();
                Then.onTheMainPage.iSeeThisPage();
            });

            //Navigate to object page and check Upload Errors section when upload status is Failed
            opaTest('Navigate to object page and check Upload Errors section when upload status is Failed', function (Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow({ 5: "EMPH2R99217" }); //6th column
                Then.onTheDetailPage.iSeeThisPage();
                Then.onTheDetailPage.onHeader()
                    .iCheckTitle("Test Usere2e4");
                Then.onTheDetailPage.onTable({ property: "availabilityUploadErrors"}).iCheckColumns(3)
                    .and.iCheckColumns(3, {
                        "CSV File Entry": { headerVisible: true },
                        "Reference Date": { headerVisible: true },
                        "Message": { headerVisible: true }
                    })
                    .and.iCheckRows(4);
                When.iNavigateBack();
                Then.onTheMainPage.iSeeThisPage();
            });

            //Navigate to object page and check Upload Errors section when upload status is Partial
            opaTest('Navigate to object page and check Upload Errors section when upload status is Partial', function (Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow({ 5: "EMPH2R21905" }); //6th column
                Then.onTheDetailPage.iSeeThisPage();
                Then.onTheDetailPage.onHeader().iCheckTitle("Test Usere2e3");
                Then.onTheDetailPage.onTable({ property: "availabilityUploadErrors" }).iCheckColumns(3)
                    .and.iCheckColumns(3, {
                        "CSV File Entry": { headerVisible: true },
                        "Reference Date": { headerVisible: true },
                        "Message": { headerVisible: true }
                    })
                    .and.iCheckRows(2);
                When.iNavigateBack();
                Then.onTheMainPage.iSeeThisPage();
            });

            //Navigate to object page and check Upload Errors section when upload status is Not Started
            opaTest('Navigate to object page and check Upload Errors section when upload status is Not Started', function (Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow({ 5: "H2R4377882-1" }); //6th column
                Then.onTheDetailPage.iSeeThisPage();
                Then.onTheDetailPage.onHeader().iCheckTitle("Test Usere2e1");
                Then.onTheDetailPage.onTable({ property: "availabilityUploadErrors" }).iCheckColumns(3)
                    .and.iCheckColumns(3, {
                        "CSV File Entry": { headerVisible: true },
                        "Reference Date": { headerVisible: true },
                        "Message": { headerVisible: true }
                    })
                    .and.iCheckRows(0);
                When.iNavigateBack();
                Then.onTheMainPage.iSeeThisPage();
            });

            //Navigate to object page and check Upload Errors section when upload status is Complete
            opaTest('Navigate to object page and check Upload Errors section when upload status is Complete', function (Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow({ 5: "H2R4377882" }); //6th column
                Then.onTheDetailPage.iSeeThisPage();
                Then.onTheDetailPage.onHeader().iCheckTitle("Test Usere2e2");
                Then.onTheDetailPage.onTable({ property: "availabilityUploadErrors" }).iCheckColumns(3)
                    .and.iCheckColumns(3, {
                        "CSV File Entry": { headerVisible: true },
                        "Reference Date": { headerVisible: true },
                        "Message": { headerVisible: true }
                    })
                    .and.iCheckRows(0);
                When.iNavigateBack();
                Then.onTheMainPage.iSeeThisPage();
            });

            //Navigate to object page and check Data Uploaded section when availability data present
            opaTest('Navigate to object page and check  Data Uploaded section when availability data present', function (Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow({ 5: "H2R4377882" }); //6th column
                Then.onTheDetailPage.iSeeThisPage();
                // Assertions
                Then.onTheDetailPage.onHeader().iCheckTitle("Test Usere2e2");
                Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty('sap.fe.macros.microchart.MicroChartContainer', { chartDescription: 'Total Data Uploaded for Time Period' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.suite.ui.microchart.RadialMicroChart', { percentage: 66.7 });
                Then.onTheDetailPage.iSeeSubSectionWithTitle("Data Uploaded");
                Then.onTheDetailPage.iShouldSeeTheElementTypeWithProperty('sap.ui.mdc.Chart', { header: "Data Uploaded for Time Period", chartType: "column" })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Title', { text: 'Data Uploaded for Time Period' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Link', { text: 'Year' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Text', { text: 'Month' });
                When.iNavigateBack();
                Then.onTheMainPage.iSeeThisPage();
            });

            opaTest("#999: Tear down", function (Given, When, Then) {
                Given.iTearDownMyApp();
            });

        }

    };

    return Journey;
});
