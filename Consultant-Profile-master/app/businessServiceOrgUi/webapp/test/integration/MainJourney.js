sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
    "use strict";

    var Journey = {
        run: function () {
            QUnit.module("Maintain Service Organizations");

            // Check the page title and filters in the header
            opaTest("On opening the app, I should see correct page title and filters in the header", function(Given, When, Then) {
                Given.iResetTestData().and.iStartMyApp("businessServiceOrgUi-Display");
                Then.onTheMainPage.iSeeThisPage();
                When.onTheMainPage.iCollapseExpandPageHeader(false);
                Then.onTheShell.iSeeShellAppTitle("Maintain Service Organizations");
                Then.onTheMainPage.onFilterBar().iCheckFilterField(
                    { property: "description" }, undefined, //2nd parameter value
                    { label: "Service Organization" })
                    .and.iCheckFilterField(
                        { property: "costCenter" }, undefined,
                        { label: "Cost Center" })
                    .and.iCheckFilterField(
                        { property: "code" }, undefined,
                        { label: "Code" });
                Then.onTheMainPage.onFilterBar().iCheckSearch();
            });

            //Check adapt filter
            opaTest('Check Adapt filter works on click', function (Given, When, Then) {
                When.onTheMainPage.iCollapseExpandPageHeader(false);
                Then.onTheMainPage.onFilterBar().iOpenFilterAdaptation()
                    .and.iConfirmFilterAdaptation();
            });

            // Check the Add/Remove columns
            opaTest("On click of add/remove columns icon, I should see correct number of columns and data", function(Given, When, Then) {
                When.onTheMainPage.onTable().iOpenColumnAdaptation();
                Then.onTheMainPage
                    .onTable().iCheckAdaptationColumn("Code", { selected: true })
                    .and.iCheckAdaptationColumn("Service Organization", { selected: true })
                    .and.iCheckAdaptationColumn("Delivery Organization", { selected: true })
                    .and.iCheckAdaptationColumn("Company Code", { selected: true })
                    .and.iCheckAdaptationColumn("Controlling Area", { selected: true })
                    .and.iCheckAdaptationColumn("Cost Center", { selected: true })
                    .and.iCheckAdaptationColumn("Cost Center (ODM ID)", { selected: false });
                When.onTheMainPage.onTable().iConfirmColumnAdaptation();
                Then.onTheMainPage.onTable().iCheckColumns(6);
            });

            // Check the list of already existing service orgs
            opaTest("On opening the app, I should see list of already uploaded service orgs", function(Given, When, Then) {
                Then.onTheMainPage.onTable().iCheckRows(3).and.iCheckAction("Upload");
                Then.onTheMainPage.iShouldSeeCorrectSelectionMode("None");
                Then.onTheMainPage.onTable().iCheckState({ enableExport: true });
                Then.onTheMainPage.onTable().iCheckColumns(6)
                    .and.iCheckColumns(6, {
                        "Code": { headerVisible: true },
                        "Service Organization": { headerVisible: true },
                        "Delivery Organization": { headerVisible: true },
                        "Company Code": { headerVisible: true },
                        "Controlling Area": { headerVisible: true },
                        "Cost Center": { headerVisible: true }
                    });
            });

            // Search for service orgs with service org name
            opaTest("On searching with service org name, I should see correct list of service orgs", function(Given, When, Then) {
                When.onTheMainPage.onFilterBar().iChangeSearchField("Organization ORG_2 Germany")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(1);
                When.onTheMainPage.onFilterBar().iChangeSearchField("")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(3);
            });

            // Search for service orgs with costcenter
            opaTest("On searching with costcenter, I should see correct list of service orgs", function(Given, When, Then) {
                When.onTheMainPage.onFilterBar().iChangeSearchField("CCIN")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(1);
                When.onTheMainPage.onFilterBar().iChangeSearchField("")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(3);
            });

            // Search for service orgs with service org code
            opaTest("On searching with service org code, I should see correct list of service orgs", function(Given, When, Then) {
                When.onTheMainPage.onFilterBar().iChangeSearchField("Org_1")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(1);
            });

            // Reset the search
            opaTest("On resetting the search, I should see correct list of service orgs", function(Given, When, Then) {
                When.onTheMainPage.onFilterBar().iChangeSearchField("")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(3);
            });

            // Filter by valid service org name
            opaTest("On filtering by valid service org name, I should see correct list of service orgs", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "description" }, "Organization ORG_2 Germany")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(1);

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "description" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(3);
            });

            // Filter by valid service org code(select code from filter value help)
            opaTest("On filtering by valid service org code(select from value help), I should see correct list of service orgs", function (Given, When, Then) {
                When.onTheMainPage.iClickOnTheElement('businessServiceOrgUi::OrganizationListReport--fe::FilterBar::BSODetails::FilterField::code-inner-vhi');
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
                    .iSelectRows({"Code" : "Org_1"})
                    .and.iConfirm();
                When.onTheMainPage.onFilterBar().iExecuteSearch();

                Then.onTheMainPage.onTable().iCheckRows(1);
            });

            // Reset the service org code filter
            opaTest("On reset of serice org code filter, I should see correct list of service orgs", function (Given, When, Then){
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "code" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(3);
            });

            //Filter by valid service org code(enter code as text in filter)
            opaTest("On filtering by valid service org code(enter as text), I should see correct list of service orgs", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "code" }, "Org_2")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(1);
            });

            // Reset the service org code filter
            opaTest("On reset of serice org code filter, I should see correct list of service orgs", function (Given, When, Then){
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "code" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(3);
            });

            // Filter by invalid service org code
            opaTest("On filtering by invalid service org code, I should see an error message", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "code" }, "org");

                // Issue Link: https://github.wdf.sap.corp/fiori-elements/v4-consulting/issues/2554
                // Issue: Though the OPA5 journey is not bale to capture the error.
                //        Below error appears if the journey is mimicked manually.
                // Then.onTheMainPage.onFilterBar().iCheckFilterField({ property: "code" }, undefined, {
                //     valueState: "Error",
                //     valueStateText: 'Value "org" does not exist.'
                // });

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "code" }, "")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(3);
            });

            // Filter by valid cost center(select cost center from filter value help)
            opaTest("On filtering by valid cost center(select from value help), I should see correct list of service orgs", function (Given, When, Then) {
                When.onTheMainPage.iClickOnTheElement('businessServiceOrgUi::OrganizationListReport--fe::FilterBar::BSODetails::FilterField::costCenter-inner-vhi');
                Then.onTheMainPage
                    .onValueHelpDialog()
                    .iCheckTable()
                    .and.iCheckFilterBar();
                When.onTheMainPage
                    .onValueHelpDialog()
                    .iExecuteShowHideFilters();
                When.onTheMainPage
                    .onValueHelpDialog()
                    .iChangeSearchField('CCIN').and.iExecuteSearch();
                When.onTheMainPage
                    .onValueHelpDialog()
                    .iSelectRows({"Cost Center" : "CCIN"})
                    .and.iConfirm();
                When.onTheMainPage.onFilterBar().iExecuteSearch();

                Then.onTheMainPage.onTable().iCheckRows(1);
            });

            // Reset the cost center filter
            opaTest("On reset of cost center filter, I should see correct list of service orgs", function (Given, When, Then){
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "costCenter" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(3);
            });

            //Filter by valid cost center(enter cost center as text in filter)
            opaTest("On filtering by valid cost center(enter as text), I should see correct list of service orgs", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "costCenter" }, "CCDE")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(1);
            });

            // Reset the cost center filter
            opaTest("On reset of cost center filter, I should see correct list of service orgs", function (Given, When, Then){
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "costCenter" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(3);
            });

            // Filter by invalid cost center
            opaTest("On filtering by invalid cost center, I should see an error message", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "costCenter" }, "CC");

                // Issue Link: https://github.wdf.sap.corp/fiori-elements/v4-consulting/issues/2554
                // Issue: Though the OPA5 journey is not bale to capture the error.
                //        Below error appears if the journey is mimicked manually.
                // Then.onTheMainPage.onFilterBar().iCheckFilterField({ property: "costCenter" }, undefined, {
                //     valueState: "Error",
                //     valueStateText: 'Value "CC" does not exist.'
                // });

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "costCenter" }, "")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(3);
            });

            // Check the variant management
            opaTest("I should be able save a variant of the business service org list view", function (Given, When, Then) {
                When.onTheMainPage.onFilterBar().iChangeSearchField("Organization ORG_2 Germany")
                    .and.iExecuteSearch();
                Then.onTheMainPage
                    .iSeeVariantTitle("Standard")
                    .and.iSeeVariantModified(true);
                When.onTheMainPage.iSaveVariant("Variant1");
                Then.onTheMainPage.iSeeVariantTitle("Variant1");
                Then.onTheMainPage.onTable().iCheckRows(1);
                Then.onTheMainPage.onTable().iCheckColumns(6);
                When.onTheMainPage.iSelectVariant("Standard");
                Then.onTheMainPage.iSeeVariantTitle("Standard");
                Then.onTheMainPage.onTable().iCheckRows(3);
                Then.onTheMainPage.onTable().iCheckColumns(6);
            });
            opaTest("I should be able to see correct column width for Code,Delivery Organization and CostCenter", function (Given, When, Then) {
                Then.onTheMainPage.theColumnHasWidth("code","10em");
                Then.onTheMainPage.theColumnHasWidth("toDeliveryStatus::code","10em");
                Then.onTheMainPage.theColumnHasWidth("costCenter","10em");
            });

            opaTest("Tear down", function (Given, When, Then) {
                Given.iTearDownMyApp();
            });

        }
    };

    return Journey;
});
