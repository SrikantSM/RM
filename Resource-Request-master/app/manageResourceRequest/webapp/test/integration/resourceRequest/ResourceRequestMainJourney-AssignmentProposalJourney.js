sap.ui.define(['sap/ui/test/opaQunit'], function (
    opaTest
) {

    return {
        run: function () {

            ///////////////////////////////////////////////////////////////////////////////
            QUnit.module('Manage Resource Request | Assignment Proposal');
            ///////////////////////////////////////////////////////////////////////////////

            opaTest('Accept Assignment Proposal', function (
                Given,
                When,
                Then
            ) {
                Given.iStartMyApp("ResourceRequest-Manage");
                Then.onTheResourceRequestListReportPage.iSeeThisPage();

                // Set the Filter parameters and search
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: 'name' }, "Resource Request 6", true)
                    .and.iExecuteSearch();

                // Check state of filter bar and assert 1 row in the table
                Then.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iCheckState()
                    .and.then.onTable()
                    .iCheckRows(1);

                // Select the filtered row in the list page
                When.onTheResourceRequestListReportPage
                    .onTable()
                    .iPressRow(0);

                When.onTheResourceRequestObjectPage
                    .iGoToSection("Assignments");

                //Execute Action "Accept"
                When.onTheResourceRequestObjectPage
                    .onTable("Assigned Resources")
                    .iSelectRows(2)
                    .and.iExecuteAction("Accept");

                Then.onTheResourceRequestObjectPage
                    .onConfirmationDialog()
                    .iCheckState({title:"Confirmation"});

                When.onTheResourceRequestObjectPage
                    .onConfirmationDialog()
                    .iConfirm();

                Then.iSeeMessageToast("Resource Diane Jobs is accepted.");

                //After Accepting, check if the action "ACCEPT" is disabled for the selected row.
                Then.onTheResourceRequestObjectPage
                    .onTable("Assigned Resources")
                    .iCheckAction("Accept",{enabled:false});

                When.onTheShell.iNavigateBack();

            });

            opaTest('Reject Assignment Proposal', function (
                Given,
                When,
                Then
            ) {

                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: 'name' }, "Resource Request 5", true)
                    .and.iExecuteSearch();

                When.onTheResourceRequestListReportPage
                    .onTable()
                    .iPressRow(0);

                When.onTheResourceRequestObjectPage
                    .iGoToSection("Assignments");

                //Execute Action "Reject"
                When.onTheResourceRequestObjectPage
                    .onTable("Assigned Resources")
                    .iSelectRows(0)
                    .and.iExecuteAction("Reject");

                Then.onTheResourceRequestObjectPage
                    .onConfirmationDialog()
                    .iCheckState({title:"Confirmation"});

                When.onTheResourceRequestObjectPage
                    .onConfirmationDialog()
                    .iConfirm();

                Then.iSeeMessageToast("Resource Diane Jobs is rejected.");

                //After Rejecting, check if the action "Reject" is disabled for the selected row.
                Then.onTheResourceRequestObjectPage
                    .onTable("Assigned Resources")
                    .iCheckAction("Reject",{enabled:false});

            });

            opaTest("Teardown", function (Given, When, Then) {
                Given.iTearDownMyApp();
            });
        }
    };
});
