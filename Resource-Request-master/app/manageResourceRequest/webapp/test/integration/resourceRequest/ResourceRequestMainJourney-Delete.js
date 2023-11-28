sap.ui.define(['sap/ui/test/opaQunit'], function (
    opaTest
) {

    return {
        run: function () {

            ///////////////////////////////////////////////////////////////////////////////
            QUnit.module('Manage Resource Request | Delete');
            ///////////////////////////////////////////////////////////////////////////////

            opaTest('Delete button is visible in object page', function (
                Given,
                When,
                Then
            ) {
                Given.iStartMyApp("ResourceRequest-Manage");
                Then.onTheResourceRequestListReportPage.iSeeThisPage();

                /* When I select a Not Published, Not Stuffed Resource Request; And I navigate to Object Page;
               Then I can see a Delete button in object page */

                // Set the Filter parameters and search
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: 'displayId' }, "0000000011", true)
                    .and.iChangeFilterField({ property: "staffingStatus::staffingCode" }, "Not Staffed")
                    .and.iChangeFilterField({ property: "releaseStatus_code" }, "Not Published")
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

                // Check Delete button is visible in the Object page header
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckDelete({visible: true, enabled: true});
            });

            opaTest('Skill is deleted from the required skill list', function (
                Given,
                When,
                Then
            ) {
                /* When I click on Edit button and I press select all checkbox on skill list;
       And I click on delete button on skill table
       Then I can see a delete confirmation dialog screen  */

                // Click on Edit button in the Object page header
                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteEdit();

                // Go to Required Skills section
                When.onTheResourceRequestObjectPage
                    .iGoToSection("Required Skills");

                // Select the 1st row of Skill Table and Click on Delete button
                When.onTheResourceRequestObjectPage
                    .onTable("Skills")
                    .iSelectRows(0)
                    .and.iExecuteDelete();

                // Warning Delete dialog is displayed on skill delete
                Then.onTheResourceRequestObjectPage
                    .onDialog("Delete")
                    .iCheckState("Warning");

                /* When I choose delete inside the confirmation dialog
                Then I can see a delete toast message, confirming the deletion of the skill;
                Then I save the changes*/

                // Confirm Delete in the confirmation dialog for skill delete
                When.onTheResourceRequestObjectPage
                    .onDialog("Delete")
                    .iConfirm();

                // Check the Toast message appearance on skill delete
                Then.iSeeMessageToast("Object deleted.");

                When.onTheResourceRequestObjectPage
                    .onFooter()
                    .iExecuteSave();

                // Check the Toast message appearance on save
                Then.iSeeMessageToast("Object saved");
            });

            opaTest('Resource Request is deleted', function (Given, When, Then) {
                /* When I choose Delete inside the confirmation dialog
        Then I can see a delete toast message, confirming the deletion of the Resource Request */

                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteDelete();

                // Warning Delete dialog is displayed on resource request delete
                Then.onTheResourceRequestObjectPage
                    .onDialog("Delete")
                    .iCheckState("Warning");

                // Confirm Delete in the confirmation dialog for skill delete
                When.onTheResourceRequestObjectPage
                    .onDialog("Delete")
                    .iConfirm();

                // Check the Toast message appearance on skill delete
                Then.iSeeMessageToast("Object deleted.");

                // This validates that after delete, we landed back to list page
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iExecuteSearch();

                // Check state of filter bar and assert 0 row in the table as it was deleted
                Then.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iCheckState()
                    .and.then.onTable()
                    .iCheckRows(0);
            });

            opaTest("Teardown", function (Given, When, Then) {
                Given.iTearDownMyApp();
            });
        }
    };
});
