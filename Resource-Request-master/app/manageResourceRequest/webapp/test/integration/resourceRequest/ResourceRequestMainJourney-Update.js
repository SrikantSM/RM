sap.ui.define(['sap/ui/test/opaQunit', 'sap/fe/test/api/EditState'], function (
    opaTest,
    EditState
) {

    return {
        run: function () {

            /////////////////////////////////////////////////////////////////////
            QUnit.module('Manage Resource Request | Update');
            /////////////////////////////////////////////////////////////////////

            opaTest('Select a not published and not staffed resource request', function (
                Given,
                When,
                Then
            ) {
                Given.iStartMyApp("ResourceRequest-Manage");
                Then.onTheResourceRequestListReportPage.iSeeThisPage();

                /* When I click on "Edit" button on the resource request object page;
               Then I can see the Save and Cancel button; confirming page is in edit mode */

                // Set the Filter parameters and search
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeEditingStatus(EditState.Unchanged)
                    .and.iChangeFilterField({ property: 'displayId' }, "0000000011", true)
                    .and.iChangeFilterField({ property: "staffingStatus::staffingCode" }, "Not Staffed")
                    .and.iChangeFilterField({ property: "releaseStatus_code" }, "Not Published")
                    .and.iExecuteSearch();

                // Check state of filter bar and assert 1 row in the table
                Then.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iCheckState()
                    .and.then.onTable()
                    .iCheckRows(1);
            });

            opaTest('Object page is editable on edit', function (
                Given,
                When,
                Then
            ) {
                /* When I click on "Edit" button on the resource request object page;
                     Then I can see the Save and Cancel button; confirming page is in edit mode */

                // Select the filtered row in the list page
                When.onTheResourceRequestListReportPage
                    .onTable()
                    .iPressRow(0);

                // Click on Edit button in the Object page header
                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteEdit();

                // Check Save and Delete button is visible in the Object page footer
                Then.onTheResourceRequestObjectPage
                    .onFooter()
                    .iCheckSave({ visible: true, enabled: true })
                    .and.iCheckCancel({ visible: true, enabled: true });
            });

            opaTest('Resource Request Details are visible', function (Given, When, Then) {
                /*  When Project Demand is already selected;
                   Then the Resource Request Details get pre-filled automatically from selected Project Demand.
                    */

                When.onTheResourceRequestObjectPage
                    .iGoToSection("Resource Request Details");

                Then.onTheResourceRequestObjectPage
                    .onForm({ section: "ResourceRequestDetails", fieldGroup: "SubSectionRequest1" })
                    .iCheckField("Request Name", "Resource Request 8")
                    .and.iCheckField("Project Role", "Developer")
                    .and.iCheckField("Resource Manager", "")
                    .and.iCheckField("Request Priority", "Medium")
                    .and.iCheckField("Requested Resource Organization", "Organization ORG_2 Germany");
            });

            opaTest('Skill is updated in requested skill list', function (
                Given,
                When,
                Then
            ) {
                /* I can change the existing skill in requested skill list */

                // Go to Required Skills section
                When.onTheResourceRequestObjectPage
                    .iGoToSection("Required Skills");

                // To get the focus on the 1st row and Name column of Skill Table and open the value help
                When.onTheResourceRequestObjectPage
                    .onTable("Skills")
                    .iPressCell(0, "Skill")
                    .and.iExecuteKeyboardShortcut("F4", {"Skill":"UI5"}, "Skill");

                // Select the filtered row in the Skill value help and press OK
                When.onTheResourceRequestListReportPage
                    .onValueHelpDialog()
                    .iSelectRows({ "Skill": "Cloud Foundry" });

                // To get the focus on the 1st row and Proficiency Level column of Skills table and open the value help
                When.onTheResourceRequestObjectPage
                    .onTable("Skills")
                    .iPressCell(0, "Proficiency Level")
                    .and.iExecuteKeyboardShortcut("F4", {"Proficiency Level":""}, "Proficiency Level");

                // Select proficiency level
                When.onTheResourceRequestObjectPage
                    .iClickOnTheElementTypeWithProperty('sap.m.Text',{
                        text: 'Proficiency Level 2.3'
                    });

                // To get the focus on the 1st row and skill importance column of Skills table and open the value help
                When.onTheResourceRequestObjectPage
                    .onTable("Skills")
                    .iPressCell(0, "Importance")
                    .and.iExecuteKeyboardShortcut("F4", {"Importance":"Mandatory"}, "Importance");

                // Set the skill Importance to Preferred
                When.onTheResourceRequestObjectPage
                    .and.iClickOnTheElementTypeWithBindingPathAndProperty('sap.m.Text', {
                        path: "/SkillImportanceCodes(2)"
                    }, {
                        text: 'Preferred'
                    });

                // Check row values in the skill requirements table
                Then.onTheResourceRequestObjectPage
                    .iSeeSectionWithTitle("Required Skills")
                    .and.onTable("Skills")
                    .iCheckRows({
                        "Skill": "Cloud Foundry",
                        "Proficiency Level": "Proficiency Level 2.3",
                        "Importance": "Preferred",
                        "Comment": ""
                    },1);
            });

            opaTest('Resource Request is updated on save', function (Given, When, Then) {
                /* When I change the Project Role and Requested effort in resource request details facet;
                   And I click on "Save";
                   Then I can see a toast message; And I can see "Edit" and "Delete" button after save; */

                // Open Project Role value help
                When.onTheResourceRequestObjectPage
                    .onForm({ section: "ResourceRequestDetails", fieldGroup: "SubSectionRequest1" })
                    .iOpenValueHelp({ property: "projectRole_ID" });

                // Select the new row in the value help
                When.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iSelectRows({ "Code": "P001", "Project Role": "Junior Consultant" });

                // Save Resource Request
                When.onTheResourceRequestObjectPage
                    .onFooter()
                    .iExecuteSave();

                // Check the Toast message appearance on save
                Then.iSeeMessageToast("Object saved");

                // Check edit and delete button is visible in the header
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckEdit({visible: true})
                    .and.iCheckDelete({visible: true});
            });

            opaTest('Navigate back to list page after update', function (
                Given,
                When,
                Then
            ) {
                /* When I navigate from object page after updating a resource request
                   Then I can see the list report; */

                When.onTheShell.iNavigateBack();

                Then.onTheResourceRequestListReportPage
                    .onTable()
                    .iCheckRows(1);
            });

            opaTest('Publish button is seen in the object Page', function (
                Given,
                When,
                Then
            ) {
                /* When I search by a project which is not published and Not staffed; And I select the record in list page;
                   Then I can see "Publish" button on resource request object page */

                // Select the filtered row in the List page
                When.onTheResourceRequestListReportPage
                    .onTable()
                    .iPressRow(0);

                // Validate action buttons and data points in the header
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckAction("Publish",{enabled: true})
                    .and.iCheckEdit({visible: true})
                    .and.iCheckDelete({visible: true})
                    .and.iCheckDataPoint("Request Status", "Open")
                    .and.iCheckDataPoint("Publishing Status", "Not Published");
            });

            // Publish the resource request.

            opaTest('Resource Request is Published', function (Given, When, Then) {
                /* When I click on "Publish" button;
                     Then I can see the "Withdraw" button; And the Publishing status as "Published"; */

                // Click on Publish action in the Object page header to Publish the Resource Request
                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteAction("Publish");

                // Check the Toast message appearance on publish
                Then.iSeeMessageToast("Resource request published");

                // Check withdraw button is visible in the header and Publishing Status should be Published
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckAction("Withdraw",{visible: true})
                    .and.iCheckDataPoint("Publishing Status", "Published");

                // Navigate back to List page
                When.onTheShell.iNavigateBack();
            });

            opaTest('Resource Request is searched after Publish', function (
                Given,
                When,
                Then
            ) {
                /* When I search a project which is not staffeed and published;
                   Then I can see exactly 1 records in the list report; */

                // Set the Publishing Status to Published and Staffing Status to Not Staffed
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: "releaseStatus_code" }, "Published", true)
                    .and.iChangeFilterField({ property: "staffingStatus::staffingCode" }, "Not Staffed", true)
                    .and.iExecuteSearch();

                // Check state of filter bar and assert 1 row in the table
                Then.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iCheckState()
                    .and.then.onTable()
                    .iCheckRows(1);
            });

            opaTest('Withdraw button is seen in object page', function (
                Given,
                When,
                Then
            ) {
                // Select the filtered row in the List page
                When.onTheResourceRequestListReportPage
                    .onTable()
                    .iPressRow(0);

                // Check withdraw button is visible and validate data points in the header
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckAction("Withdraw",{visible: true})
                    .and.iCheckDataPoint("Publishing Status", "Published")
                    .and.iCheckDataPoint("Request Status", "Open");
            });

            opaTest('Resource Request is Withdrawn', function (Given, When, Then) {
                /* When I click on "Withdraw" button on object page;
                     Then I can see the "Publish" button on object page; */

                // Click on Withdraw action in the Object page header to Withdraw the Resource Request
                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteAction("Withdraw");

                // Check the Toast message appearance on withdraw
                Then.iSeeMessageToast("Resource request withdrawn");

                // Check publish button is visible in the header and Publishing Status should be Not Published
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckAction("Publish",{visible: true})
                    .and.iCheckDataPoint("Publishing Status", "Not Published");

                // Navigate back to List page
                When.onTheShell.iNavigateBack();
            });

            opaTest('Resource Request is searched after withdraw', function (
                Given,
                When,
                Then
            ) {
                /* When I search current resource request by Publishing Status as 'Not Published'; And Staffing Status as Not Staffed;
                     Then I can see exactly 1 records in the list report; */

                // Set the Publishing Status to Not Published and Staffing Status to Not Staffed
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: "releaseStatus_code" }, "Not Published", true)
                    .and.iChangeFilterField({ property: "staffingStatus::staffingCode" }, "Not Staffed", true)
                    .and.iExecuteSearch();

                // Check state of filter bar and assert 1 row in the table
                Then.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iCheckState()
                    .and.then.onTable()
                    .iCheckRows(1);
            });

            opaTest('Resource Request is updated after withdraw', function (
                Given,
                When,
                Then
            ) {
                /* When I select a resource request after withdraw;
                   Then I can see the "Edit" option for futher modification; */

                When.onTheResourceRequestListReportPage
                    .onTable()
                    .iPressRow(0);

                // Check edit button is visible in the header
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckEdit({visible: true});

                /* When I modify the resource request details and click on "Save";
               Then I can see the toast message; confirming successfull resource request updation; */

                // Click on Edit but on the Object Page header
                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteEdit();

                // Go to section Resource Request Details
                When.onTheResourceRequestObjectPage
                    .iGoToSection("Resource Request Details");

                // Check Resource Request details
                Then.onTheResourceRequestObjectPage
                    .onForm({ section: "ResourceRequestDetails", fieldGroup: "SubSectionRequest1" })
                    .iCheckField("Request Name", "Resource Request 8")
                    .and.iCheckField("Project Role", "Junior Consultant")
                    .and.iCheckField("Resource Manager", "")
                    .and.iCheckField("Request Priority", "Medium")
                    .and.iCheckField("Requested Resource Organization", "Organization ORG_2 Germany");

                // Open Project Role value help
                When.onTheResourceRequestObjectPage
                    .onForm({ section: "ResourceRequestDetails", fieldGroup: "SubSectionRequest1" })
                    .iOpenValueHelp({ property: "projectRole_ID" });

                // Filter for Developer role in the value help
                When.onTheResourceRequestObjectPage
                    .iEnterTextInInputField("manageResourceRequest::ResourceRequestObjectPage--fe::FormContainer::SubSectionRequest1::FieldValueHelp::projectRole_ID::Dialog::qualifier::-search", 'Developer');
                Then.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iCheckRows(1);

                // Select the filtered row in the value help
                When.onTheResourceRequestObjectPage
                    .onValueHelpDialog()
                    .iSelectRows({ "Code": "P002", "Project Role": "Developer" });

                // Save Resource Request
                When.onTheResourceRequestObjectPage
                    .onFooter()
                    .iExecuteSave();

                // Check the Toast message appearance on save
                Then.iSeeMessageToast("Object saved");

                // Check edit and delete button is visible in the header
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckEdit({visible: true})
                    .and.iCheckDelete({visible: true});
            });

            opaTest('Resource Request is re-published after withdraw', function (
                Given,
                When,
                Then
            ) {
                /* When I click on "Publish button" after save of an withdrawn request;
                     Then I can re-publish the resorce request; */

                // Click on Publish action in the Object page header to Publish the Resource Request
                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteAction("Publish");

                // Check the Toast message appearance on publish
                Then.iSeeMessageToast("Resource request published");

                // Expand page header
                When.onTheResourceRequestObjectPage
                    .iCollapseExpandPageHeader();

                // Check withdraw button is visible in the header and Publishing Status should be Published
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckAction("Withdraw",{visible: true})
                    .and.iCheckDataPoint("Publishing Status", "Published");

                // Click on Withdraw action in the Object page header to Withdraw the Resource Request
                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteAction("Withdraw");

                // Check the Toast message appearance on withdraw
                Then.iSeeMessageToast("Resource request withdrawn");

                // Navigate back to List page
                When.onTheShell.iNavigateBack();
            });

            opaTest("Open Published resource request with Rejected assignment status", function (Given, When, Then){

                // Set the filter parameters and execute search
                When.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iChangeFilterField({ property: 'displayId' }, "", true)
                    .and.iChangeFilterField({ property: "staffingStatus::staffingCode" }, "Not Staffed", true)
                    .and.iChangeFilterField({property: 'name'}, "Resource Request 10", true)
                    .and.iChangeFilterField({ property: "releaseStatus_code" }, "Published",true)
                    .and.iExecuteSearch();

                // Check state of filter bar and assert 1 row in the table
                Then.onTheResourceRequestListReportPage
                    .onFilterBar()
                    .iCheckState()
                    .and.then.onTable()
                    .iCheckRows(1);

                //Open the Resource Request
                When.onTheResourceRequestListReportPage
                    .onTable()
                    .iPressRow(0);

                // Click on the Assignments Facet
                When.onTheResourceRequestObjectPage
                    .iGoToSection("Assignments");

                //Assert one Assignment with Rejected Assignment Status.
                Then.onTheResourceRequestObjectPage.onTable("Assigned Resources")
                    .iCheckRows(1)
                    .and.iCheckRows({ "Assignment Status": "Rejected" });

            });

            opaTest('Withdraw Resource Request With One assignment in Rejected Status', function (Given, When, Then) {

                /* When I click on "Withdraw" button on object page;
                 Then I can see the "Publish" button on object page; */

                // Click on Withdraw action in the Object page header to Withdraw the Resource Request
                When.onTheResourceRequestObjectPage
                    .onHeader()
                    .iExecuteAction("Withdraw");

                // Check the Toast message appearance on withdraw
                Then.iSeeMessageToast("Resource request withdrawn");

                // Expand page header
                When.onTheResourceRequestObjectPage
                    .iCollapseExpandPageHeader();

                // Check publish button is visible in the header and Publishing Status should be Not Published
                Then.onTheResourceRequestObjectPage
                    .onHeader()
                    .iCheckAction("Publish",{visible: true})
                    .and.iCheckDataPoint("Publishing Status", "Not Published");

                // Navigate back to List page
                When.onTheShell.iNavigateBack();
            });

            opaTest("Teardown", function (Given, When, Then) {
                Given.iTearDownMyApp();
            });
        }
    };
});
