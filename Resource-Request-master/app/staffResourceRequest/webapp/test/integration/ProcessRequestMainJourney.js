sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/opaQunit'
], function (Opa5, opaTest) {

    return {
        run: function () {
            QUnit.module('Staff Resource Request - MainJourney');

            opaTest('I can load the List Report and display all existing ResourceRequests', function (Given, When, Then) {

                Given.iStartMyApp("ResourceRequest-Display");
                Then.onTheResourceRequestListReportPage.iSeeThisPage();

                Then.onTheResourceRequestListReportPage
                    .onTable()
                    .iCheckRows(4);

            });

            // Check Set My Responsibility  of Resource Request
            opaTest('I can click on set my responsibility button', function (Given, When, Then) {

                // Set the Request Status to Open
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: "requestStatus_code" }, "Open");

                // Check the applied filter text in filter field
                Then.onTheResourceRequestListReportPage
                    .onFilterBar().
                    iCheckFilterField({ property: "requestStatus_code" }, { description: "Open" });

                // Click on Go to search
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iExecuteSearch();

                // Check status of filters and assert 3 rows
                Then.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iCheckState()
                    .and.then.onTable()
                    .iCheckRows(4);

                // Click on the second row to navigate to object page
                When.onTheResourceRequestListReportPage
                    .onTable()
                    .iPressRow({ "Request ID": "0000000007" });

                Then.onTheResourceRequestObjectPage.iSeeThisPage();

                // Check Set My Responsibilities button is visible in the header
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckAction("Set My Responsibilities");

                // Click on Set My Responsibilities button in the header
                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteAction("Set My Responsibilities");

                // Validate labels in the Set My Responsibilities dialog
                Then.onTheResourceRequestObjectPage
                    .onDialog("Set My Responsibilities")
                    .iCheckDialogField({property:'processor'})
                    .and.iCheckDialogField({property:'resourceManager'});

                // Press Cancel button in the Set My Responsibilities dialog
                When.onTheResourceRequestObjectPage
                    .onDialog("Set My Responsibilities")
                    .iConfirm();

                When.onTheShell.iNavigateBack();

            });

            // Check Reference Object Details in the Resource Request
            opaTest('I can see the Reference Object Details in the Resource Request', function (Given, When, Then) {

                When.onTheResourceRequestListReportPage
                    .onTable()
                    .iPressRow({ "Request Name": "Resource Request with Reference Object" });


                Then.onTheResourceRequestObjectPage
                    .onForm({
                        section: 'Reference',
                        fieldGroup: 'SubSectionReferenceObject'
                    }).iCheckField('Reference Object Type', 'Project')
                    .and.iCheckField('Reference Object ID','Project B');

                When.onTheShell.iNavigateBack();

            });


            // Check the Forward Action
            opaTest('I Can Forward the Resource Request', function (Given, When, Then) {

                // Click on the second row to navigate to object page
                When.onTheResourceRequestListReportPage
                    .onTable()
                    .iPressRow({ "Request ID": "0000000007" });

                // Check Forward button is visible in the header
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckAction("Forward");

                // Click on Forward button in the header
                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteAction("Forward");

                // Validate existing resource organization
                Then.onTheResourceRequestObjectPage
                    .iShouldSeeLabel('Forward To')
                    .and.iShouldSeeTheElementTypeWithProperty('sap.ui.mdc.Field',{
                        value: 'Organization ORG_1 India'
                    })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.ui.mdc.Field', {
                        value: "Organization ORG_1 India"
                    });

                // Open value help to change processing resource organization
                When.onTheResourceRequestObjectPage
                    .iClickOnTheElementTypeWithProperty('sap.ui.core.Icon',{
                        src: 'sap-icon://value-help'
                    });

                // Select the row with code Org_1 and press OK
                When.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iSelectRows({ "ID": "RORG2", "Resource Organization": "Organization ORG_2 Germany", "Description": "Organization ORG_2 Germany" });

                // Change resource organization and forward
                When.onTheResourceRequestObjectPage
                    .onDialog("Forward")
                    .iChangeDialogField({property:'processingResourceOrg_ID'}, "Organization ORG_2 Germany")
                    .and.iConfirm();

                // Validate updated resource organization
                Then.onTheResourceRequestObjectPage
                    .onForm({ section: "GeneralInformation", fieldGroup: "SubSectionRequest" })
                    .iCheckField("Processing Resource Organization", "Organization ORG_2 Germany");

                When.onTheShell.iNavigateBack();
            });

            // opaTest('Create Assignment Scenarios', function (Given, When, Then) {
            //   When
            //     .onTheResourceRequestListReportPage
            //     // iClickOnTheElementTypeWithAncestorProperty('sap.ui.mdc.FilterField', {
            //     //     label: 'Request Status'
            //     //   }, 'sap.ui.core.Icon')
            //     //   .and.iClickOnTheElementInsideFilterPopover('Open')
            //     .iClickOnTheGoButton()
            //     .and.iSelectTheNthItem(1); // Click 1st row
            //   // Check for Matching Candidates
            //   // Check for Assign Button
            //   // Check for Dates Prefilled

            //   Then
            //     .onTheResourceRequestObjectPage
            //     .iShouldSeeTheElementWithProperties('fe::table::matchingCandidates::LineItem-innerTable')
            //     .iClickOnTheElementTypeWithProperty(
            //       'sap.m.Button', {
            //       text: "Matching Resources"
            //     })
            //     .iClickOnTheElementTypeWithProperty('sap.m.Button', {
            //       text: "Assign"
            //     })
            //     .iShouldSeeTheDialog("Assign")
            //     .iShouldSeeTheDatePrefilled(
            //       "sap.m.Label", {
            //       text: "Assignment Start",
            //     },
            //       "sap.m.DatePicker", {
            //       innerText: 'Jan 25, 2019',
            //     },
            //       "APD_::assignedStart-inner"
            //     )
            //     .iShouldSeeTheDatePrefilled(
            //       "sap.m.Label", {
            //       text: "Assignment End",
            //     },
            //       "sap.m.DatePicker", {
            //       innerText: 'Feb 1, 2019',
            //     },
            //       "APD_::assignedEnd-inner"
            //     )
            //     .and.iClickOnCancelInsideDialog("Assign")
            //     .and.iNavigateBack();
            // });


            // opaTest('Delete Assignment Scenarios', function (Given, When, Then) {
            //   When
            //     .onTheResourceRequestListReportPage
            //     .iClickOnTheGoButton()
            //     .and.iSelectTheNthItem(2);

            //   Then
            //     .onTheResourceRequestObjectPage
            //     .iShouldSeeTheElementWithProperties('fe::table::staffing::LineItem-innerTable')
            //     .iClickOnTheElementTypeWithProperty(
            //       'sap.m.Button', {
            //       text: "Assignments"
            //     })
            //     .iClickOnTheElementTypeWithProperty('sap.m.Button', {
            //       text: "Unassign"
            //     })
            //     .iShouldSeeTheDialog("Confirmation")
            //     .and.iClickOnCancelInsideDialog("Confirmation")
            //     .and.iNavigateBack();
            // });

            // opaTest('Edit Assignment Scenarios', function (Given, When, Then) {
            //   When
            //     .onTheResourceRequestListReportPage
            //     .iClickOnTheGoButton()
            //     .and.iSelectTheNthItem(2);

            //   Then
            //     .onTheResourceRequestObjectPage
            //     .iShouldSeeTheElementWithProperties('fe::table::staffing::LineItem-innerTable')
            //     .iClickOnTheElementTypeWithProperty(
            //       'sap.m.Button', {
            //       text: "Assignments"
            //     })
            //     .iClickOnTheElementTypeWithProperty('sap.m.Button', {
            //       text: "Update"
            //     })
            //     .iShouldSeeTheDialog("Update")
            //     .iShouldSeeTheDatePrefilled(
            //       "sap.m.Label", {
            //       text: "Assignment Start",
            //     },
            //       "sap.m.DatePicker", {
            //       innerText: 'Jan 25, 2019',
            //     },
            //       "APD_::assignedStart-inner"
            //     )
            //     .iShouldSeeTheDatePrefilled(
            //       "sap.m.Label", {
            //       text: "Assignment End",
            //     },
            //       "sap.m.DatePicker", {
            //       innerText: 'Feb 1, 2019',
            //     },
            //       "APD_::assignedEnd-inner"
            //     )
            //     .iShouldSeeTheHoursPrefilled(
            //       "sap.m.Label", {
            //       text: "Number of Hours",
            //     },
            //       "sap.m.Input", {
            //       innerText: '1',
            //     },
            //       "APD_::assignedDuration-inner"
            //     )
            //     .and.iClickOnCancelInsideDialog("Update")
            //     .and.iNavigateBack();
            // });

            opaTest('I can see the matching resources for the request',function(Given,When,Then){
                //Click on the second request
                When.onTheResourceRequestListReportPage
                    .onTable()
                    .iPressRow({"Request ID": "0000000006"});
                //Click on the section "Matching Resources"
                When.onTheResourceRequestObjectPage
                    .iGoToSection("Matching Resources");
                //Assert that "Matching Resources" Table is visible
                Then.onTheResourceRequestObjectPage
                    .iShouldSeeTheTableWithHeader("Matching Resources");
                //Assert the no of contents in the matching table
                Then.onTheResourceRequestObjectPage
                    .onTable("Matching Resources")
                    .iCheckRows(3);
                Then.onTheResourceRequestObjectPage.onTable("Matching Resources").iCheckRows({ "Project Roles": "Junior Consultant" });
                When.onTheShell.iNavigateBack();
            });

            opaTest('I can resolve the Resource Request', function (Given, When, Then) {
                // Click on the second row to navigate to object page
                When.onTheResourceRequestListReportPage
                    .onTable()
                    .iPressRow({ "Request ID": "0000000005" });

                // Check Resolve button is visible in the header
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckAction("Resolve");

                // Check Request Status is set to Open
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckDataPoint("Request Status", "Open");

                // Click on Resolve button in the header
                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteAction("Resolve");

                // Confirm Resolve Resource request
                When.onTheResourceRequestObjectPage
                    .onConfirmationDialog()
                    .iConfirm();

                // Check Request Status is set to Resolved
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckDataPoint("Request Status", "Resolved");

                // Check Set My Responsibilities button is not visible
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckAction("Set My Responsibilities", { visible: false });

                // Check Forward button is not visible
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckAction("Forward", { visible: false });

                // Check Resolve button is not visible
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckAction("Resolve", { visible: false });

                // Check Matching Resources section is not visible
                Then.onTheResourceRequestObjectPage
                    .and.iShouldNotSeeTheElementTypeWithProperty('sap.m.Button', {
                        text: 'Matching Resources'
                    });
            });

            opaTest('Check Buttons in Staffing facet are disabled and validate assignments', function (Given, When, Then) {
                // Go to Assignments Section
                When.onTheResourceRequestObjectPage
                    .iGoToSection("Assignments");

                // Unassign button should not be visible in the Assigned Resources table
                Then.onTheResourceRequestObjectPage
                    .iShouldSeeTheTableWithHeader("Assigned Resources")
                    .iShouldNotSeeTheElementTypeWithProperty('sap.m.Button', { text: "Unassign" });

                //verify the assignments data
                Then.onTheResourceRequestObjectPage.onTable("Assigned Resources")
                    .iCheckRows({
                        "Name": "Smita Anderson",
                        "Worker Type": "External Worker",
                        "Assignment Start": "",
                        "Assignment Status": "Hard-Booked"
                    });

                When.onTheShell.iNavigateBack();
            });

            opaTest('Filter for Resolved Request', function (Given, When, Then) {
                // Filter by request status which is resolved and check if there is no unassign button
                // Set the Request Status to Open
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: "requestStatus_code" }, "Resolved", true);

                // Check the applied filter text in filter field
                Then.onTheResourceRequestListReportPage
                    .onFilterBar().
                    iCheckFilterField({ property: "requestStatus_code" }, { description: "Resolved" });

                // Click on Go to search
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iExecuteSearch();

                // Check status of filters and assert 3 rows
                Then.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iCheckState()
                    .and.then.onTable()
                    .iCheckRows(1);
            });

            opaTest("Teardown", function (Given, When, Then) {
                Given.iTearDownMyApp();
            });
        }
    };

});
