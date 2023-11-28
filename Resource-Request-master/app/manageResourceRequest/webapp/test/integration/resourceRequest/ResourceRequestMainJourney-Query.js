sap.ui.define(["sap/ui/test/opaQunit", "sap/fe/test/api/EditState"], function (
    opaTest,
    EditState
) {

    return {
        run: function () {

            /////////////////////////////////////////////////////////
            QUnit.module("Manage Resource Request | Query");
            /////////////////////////////////////////////////////////

            opaTest("All the Resource Requests are loaded in the list page", function (
                Given,
                When,
                Then
            ) {
                /* When I set the Editing Status filter to "Unchanged"
                I can see all the resource requests in the list */

                Given.iResetTestData().and.iStartMyApp("ResourceRequest-Manage");
                Then.onTheResourceRequestListReportPage.iSeeThisPage();

                // Set the Editing Status filter to Unchanged and press GO
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeEditingStatus(EditState.Unchanged)
                    .and.iExecuteSearch();

                // I can see all the resource requests in the list
                Then.onTheResourceRequestListReportPage
                    .onTable()
                    .iCheckRows(8);
            });

            opaTest("Search by Request ID", function (
                Given,
                When,
                Then
            ) {

                // Filter for Request name
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: 'displayId' }, "0000000002", true)
                    .and.iExecuteSearch();

                // Only 1 row is visible
                Then.onTheResourceRequestListReportPage.
                    onTable()
                    .iCheckRows(1);
                Then.onTheResourceRequestListReportPage
                    .onFilterBar().
                    iCheckFilterField({ property: "displayId" }, { description: "0000000002" });

                // Reset the Project Filter
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: 'displayId' }, true)
                    .and.iExecuteSearch();
                Then.onTheResourceRequestListReportPage
                    .onTable()
                    .iCheckRows(8);
            });

            opaTest("Search by Request Name", function (
                Given,
                When,
                Then
            ) {

                // Filter for Request name
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: 'name' }, "Resource Request 1", true)
                    .and.iExecuteSearch();

                // Only 1 row is visible
                Then.onTheResourceRequestListReportPage.
                    onTable()
                    .iCheckRows(1);
                Then.onTheResourceRequestListReportPage
                    .onFilterBar().
                    iCheckFilterField({ property: "name" }, { description: "Resource Request 1" });

                // Reset the Project Filter
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: 'name' }, true)
                    .and.iExecuteSearch();
                Then.onTheResourceRequestListReportPage
                    .onTable()
                    .iCheckRows(8);
            });

            opaTest("Search by Project Role", function (
                Given,
                When,
                Then
            ) {
                /* When I filter by Project Role
                Then I can see the list result is filtered by Project Role*/

                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iOpenValueHelp({ property: 'projectRole_ID' });

                // Select the filtered row in the Project Role value help dialog
                When.onTheResourceRequestListReportPage
                    .onValueHelpDialog()
                    .iSelectRows({ "Code": "P002", "Project Role": "Developer" })
                    .and.iConfirm()
                    .and.when.onFilterBar()
                    .iExecuteSearch();
                Then.onTheResourceRequestListReportPage
                    .onTable()
                    .iCheckRows(5);
                Then.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iCheckFilterField({ property: "projectRole_ID" }, { description: "Developer" });

                // Reset Project Role filter
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: 'projectRole_ID' }, true)
                    .and.iExecuteSearch();
                Then.onTheResourceRequestListReportPage.
                    onTable()
                    .iCheckRows(8);
            });

            opaTest("Search by Staffing Status", function (
                Given,
                When,
                Then
            ) {
                /* When I filter by Staffing Status
                Then I can see the list result is filtered by Staffing Status*/
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: "staffingStatus::staffingCode" }, "Not Staffed")
                    .and.iExecuteSearch();

                Then.onTheResourceRequestListReportPage
                    .onTable()
                    .iCheckRows(6);
                Then.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iCheckFilterField({ property: "staffingStatus::staffingCode" }, { description: "Not Staffed" });

                // Reset Staffing status filter
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: "staffingStatus::staffingCode" }, true)
                    .and.iExecuteSearch();
                Then.onTheResourceRequestListReportPage
                    .onTable()
                    .iCheckRows(8);
            });

            opaTest("Search by Request Priority", function (
                Given,
                When,
                Then
            ) {
                /* When I filter by Request Priority
                Then I can see the list result is filtered by Request Priority */

                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: "priority_code" }, "High")
                    .and.iExecuteSearch();
                Then.onTheResourceRequestListReportPage
                    .onTable()
                    .iCheckRows(2);
                Then.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iCheckFilterField({ property: "priority_code" }, { description: "High" });

                // Reset Request Priority applied filter
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: "priority_code" }, true)
                    .and.iExecuteSearch();
                Then.onTheResourceRequestListReportPage
                    .onTable()
                    .iCheckRows(8);

            });

            opaTest("Search by Publishing Status", function (
                Given,
                When,
                Then
            ) {
                /* When I filter by Publishing Status
                Then I can see the list result is filtered by Publishing Status */

                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: "releaseStatus_code" }, "Published")
                    .and.iExecuteSearch();
                Then.onTheResourceRequestListReportPage
                    .onTable()
                    .iCheckRows(4);
                Then.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iCheckFilterField({ property: "releaseStatus_code" }, { description: "Published" });

                // Reset Publishing Status applied filter
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: "releaseStatus_code" }, true)
                    .and.iExecuteSearch();
                Then.onTheResourceRequestListReportPage
                    .onTable()
                    .iCheckRows(8);
            });

            opaTest("Teardown", function (Given, When, Then) {
                Given.iTearDownMyApp();
            });
        }
    };
});
