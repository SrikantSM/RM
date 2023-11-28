sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
    "use strict";

    var Journey = {
        run: function () {
            QUnit.module('My Resources List Page');
            // Check the page title and filters in the header
            opaTest("On opening the app, I should see correct page title and filters in the header", function(Given, When, Then) {
                Given.iResetTestData().and.iStartMyApp("myResourcesUi-Display");
                Then.onTheListPage.iSeeThisPage();
                When.onTheListPage.iCollapseExpandPageHeader(false);
                Then.onTheShell.iSeeShellAppTitle("My Resources");
                Then.onTheListPage.onFilterBar().iCheckFilterField("Name")
                    .and.iCheckFilterField("Project Roles" )
                    .and.iCheckFilterField("Worker Type" )
                    .and.iCheckFilterField("Cost Center")
                    .and.iCheckFilterField("Office Location");
                Then.onTheListPage.onFilterBar().iCheckSearch();
            });

            //Check adapt filter
            opaTest('Check Adapt filter works on click', function (Given, When, Then) {
                When.onTheListPage.iCollapseExpandPageHeader(false);
                Then.onTheListPage.onFilterBar().iOpenFilterAdaptation()
                    .and.iConfirmFilterAdaptation();
            });

            // Check the Add/Remove columns
            opaTest("On click of add/remove columns icon, I should see correct number of columns and data", function(Given, When, Then) {
                When.onTheListPage.onTable().iOpenColumnAdaptation();
                Then.onTheListPage
                    .onTable().iCheckAdaptationColumn("Name", { selected: true })
                    .and.iCheckAdaptationColumn("Project Roles", { selected: true })
                    .and.iCheckAdaptationColumn("Worker Type", { selected: true })
                    .and.iCheckAdaptationColumn("Employee ID", { selected: false })
                    .and.iCheckAdaptationColumn("Cost Center", { selected: true })
                    .and.iCheckAdaptationColumn("Office Location", { selected: true })
                    .and.iCheckAdaptationColumn("Skills", { selected: true })
                    .and.iCheckAdaptationColumn("Changed By", { selected: false })
                    .and.iCheckAdaptationColumn("Changed On", { selected: false })
                    .and.iCheckAdaptationColumn("Created By", { selected: false })
                    .and.iCheckAdaptationColumn("Created On", { selected: false });
                When.onTheListPage.onTable().iConfirmColumnAdaptation();
            });

            // Check the list of already existing resources
            opaTest("On opening the app, I should see list of already uploaded resources", function(Given, When, Then) {
                When.onTheListPage.iExecuteShowDetails();
                Then.onTheListPage.onTable().iCheckColumns(6)
                    .and.iCheckColumns(6, {
                        "Name": { headerVisible: true },
                        "Worker Type": { headerVisible: true },
                        "Project Roles": { headerVisible: true },
                        "Cost Center": { headerVisible: true },
                        "Office Location": { headerVisible: true },
                        "Skills": { headerVisible: true }
                    });
            });

            // Search for resources with resource name
            opaTest("On searching with resource name, I should see correct list of resources", function(Given, When, Then) {
                When.onTheListPage.onFilterBar().iChangeSearchField("Test Usere2e3")
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(1);
                When.onTheListPage.onFilterBar().iChangeSearchField("")
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(5);
            });

            opaTest("On searching with Project Roles, I should see correct list of resources", function(Given, When, Then) {
                When.onTheListPage.onFilterBar().iChangeSearchField("Senior Consultant1")
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(2);
                When.onTheListPage.onFilterBar().iChangeSearchField("")
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(5);
            });

            opaTest("On searching with worker type, I should see correct list of resources", function(Given, When, Then) {
                When.onTheListPage.onFilterBar().iChangeSearchField("External Worker")
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(5);
                When.onTheListPage.onFilterBar().iChangeSearchField("")
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(5);
            });

            opaTest("On searching with cost center, I should see correct list of resources", function(Given, When, Then) {
                When.onTheListPage.onFilterBar().iChangeSearchField("CCDE")
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(1);
                When.onTheListPage.onFilterBar().iChangeSearchField("")
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(5);
            });

            opaTest("On resetting the search, I should see correct list of resources", function(Given, When, Then) {
                When.onTheListPage.onFilterBar().iChangeSearchField("")
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(5);
            });


            // Filter by valid name
            opaTest("On filtering by valid name, I should see correct list of resources", function (Given, When, Then) {
                When.onTheListPage.onFilterBar()
                    .iChangeFilterField({ property: "profile/fullName" }, "Test Usere2e3")
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(1);

                //Reset the applied filter
                When.onTheListPage.onFilterBar()
                    .iChangeFilterField({ property: "profile/fullName" }, true)
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(5);
            });

            // Filter by valid project role
            opaTest("On filtering by valid Project Roles(direct value input), I should see correct list of resources", function (Given, When, Then) {
                When.onTheListPage.onFilterBar()
                    .iChangeFilterField({ property: "roles/role_ID" }, "Junior Consultant1")
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(2);

                //Reset the applied filter
                When.onTheListPage.onFilterBar()
                    .iChangeFilterField({ property: "roles/role_ID" }, true)
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(5);
            });

            // Filter by valid role(select role from filter value help)
            opaTest("On filtering by valid Project Roles(select from value help), I should see correct list of resources", function (Given, When, Then) {
                When.onTheListPage.iClickOnTheElement('myResourcesUi::MyResourceListReport--fe::FilterBar::ProjectExperienceHeader::FilterField::roles::role_ID-inner-vhi');
                Then.onTheListPage
                    .onValueHelpDialog()
                    .iCheckTable()
                    .and.iCheckFilterBar();
                When.onTheListPage
                    .onValueHelpDialog()
                    .iExecuteShowHideFilters();
                When.onTheListPage
                    .onValueHelpDialog()
                    .iChangeSearchField('Junior Consultant1').and.iExecuteSearch();
                When.onTheListPage
                    .onValueHelpDialog()
                    .iSelectRows({"Project Role" : "Junior Consultant1"})
                    .and.iConfirm();
                When.onTheListPage.onFilterBar().iExecuteSearch();

                Then.onTheListPage.onTable().iCheckRows(2);
            });

            // Reset the Project Roles filter
            opaTest("On reset of Project Roles filter, I should see correct list of resources", function (Given, When, Then){
                When.onTheListPage.onFilterBar()
                    .iChangeFilterField({ property: "roles/role_ID" }, true)
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(5);
            });

            // Filter by valid worker type(select worker type from filter dropdown)
            opaTest("On filtering by valid worker type(select from dropdown), I should see correct list of resources", function (Given, When, Then) {
                When.onTheListPage.iClickOnTheElement('myResourcesUi::MyResourceListReport--fe::FilterBar::ProjectExperienceHeader::FilterField::profile::workerType::name-inner-vhi');
                When.onTheListPage.onFilterBar()
                    .iChangeFilterField({ property: "profile/workerType/name" }, "External Worker")
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(5);

                //Reset the applied filter
                When.onTheListPage.onFilterBar()
                    .iChangeFilterField({ property: "profile/workerType/name" }, true)
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(5);
            });

            // Filter by valid cost center(select cost center from filter value help)
            opaTest("On filtering by valid cost center(select from value help), I should see correct list of resources", function (Given, When, Then) {
                When.onTheListPage.iClickOnTheElement('myResourcesUi::MyResourceListReport--fe::FilterBar::ProjectExperienceHeader::FilterField::profile::costCenter-inner-vhi');
                Then.onTheListPage
                    .onValueHelpDialog()
                    .iCheckTable()
                    .and.iCheckFilterBar();
                When.onTheListPage
                    .onValueHelpDialog()
                    .iExecuteShowHideFilters();
                When.onTheListPage
                    .onValueHelpDialog()
                    .iChangeSearchField('CCDE').and.iExecuteSearch();
                When.onTheListPage
                    .onValueHelpDialog()
                    .iSelectRows({"Cost Center" : "CCDE"})
                    .and.iConfirm();
                When.onTheListPage.onFilterBar().iExecuteSearch();

                Then.onTheListPage.onTable().iCheckRows(1);
            });

            // Reset the cost center filter
            opaTest("On reset of cost center filter, I should see correct list of resources", function (Given, When, Then){
                When.onTheListPage.onFilterBar()
                    .iChangeFilterField({ property: "profile/costCenter" }, true)
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(5);
            });

            // Filter by valid office location
            opaTest("On filtering by valid office location, I should see correct list of resources", function (Given, When, Then) {
                When.onTheListPage.onFilterBar()
                    .iChangeFilterField({ property: "profile/officeLocation" }, "Germany")
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(3);

                //Reset the applied filter
                When.onTheListPage.onFilterBar()
                    .iChangeFilterField({ property: "profile/officeLocation" }, true)
                    .and.iExecuteSearch();
                Then.onTheListPage.onTable().iCheckRows(5);
            });

            opaTest('On the ListReport table, validate Contact Card Details of resource', function (Given, When, Then) {
                Then.onTheListPage
                    .iShouldSeeTheElementTypeWithProperty('sap.m.Avatar', { initials: "TU" });
                When.onTheListPage.iClickOnTheElementTypeWithProperty("sap.m.Link", { text: "Test Usere2e2" });
                Then.onTheListPage
                    .iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Popover', { placement: "Right" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Title', { text: "Resource" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Avatar', { initials: "TU" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Link', { text: "Test Usere2e2 (test.usere2e2)" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Text', { text: "Senior Consultant" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.ui.core.Title', { text: "Organizational Information" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Label', { text: "Worker Type" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Text', { text: "External Worker" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Label', { text: "Resource Organization" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Text', { text: "Organization ORG_2 Germany (Org_2)" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Label', { text: "Cost Center" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Text', { text: "Consulting Unit A (CCIN)" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Label', { text: "Manager" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Text', { text: "Test Usere2e1 (test.usere2e1)" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.ui.core.Title', { text: "Contact Information" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Label', { text: "Mobile" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Link', { text: "+2345-20-23456789" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Label', { text: "Email" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Link', { text: "test.usere2e2@sap.com" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Label', { text: "Office Location" })
                    .and.iShouldSeeTheElementTypeWithPropertyonDialog('sap.m.Text', { text: "Germany" });
                When.iClosePopover();
            });

            opaTest('Check navigation to object page', function (Given, When, Then) {
                When.onTheListPage.onTable().iPressRow({"Name": "Test Usere2e1"});
                Then.onTheObjectPage.iSeeThisPage();
                Then.onTheShell.iSeeShellAppTitle("Resource");
            });


        }
    };
    return Journey;
});
