sap.ui.define(
    ['sap/ui/test/opaQunit', 'sap/fe/test/api/EditState'],
    function (opaTest, EditState) {

        return {
            run: function () {
                ////////////////////////////////////////////////////////////////////////
                QUnit.module('Manage Resource Request | Create');
                ////////////////////////////////////////////////////////////////////////

                opaTest(
                    'Navigate to Resource Request Object page on create',
                    function (Given, When, Then) {
                        Given.iStartMyApp('ResourceRequest-Manage');
                        Then.onTheResourceRequestListReportPage.iSeeThisPage();

                        /* When I click on "Create" button on Resource Request List Report;
                        Then I can see Save and Cancel button; confirming landing on Resource request object page in create mode; */

                        When.onTheResourceRequestListReportPage
                            .onTable()
                            .iExecuteCreate();

                        Then.onTheResourceRequestObjectPage
                            .onHeader()
                            .iCheckTitle("New: Resource Request");

                        When.onTheResourceRequestObjectPage
                            .iClickOnThePin();

                        Then.onTheResourceRequestObjectPage
                            .onFooter()
                            .iCheckSave()
                            .and.iCheckCancel();
                    }
                );

                opaTest(
                    'Select Reference Type Project',
                    function (Given, When, Then) {

                        When.onTheResourceRequestObjectPage
                            .iClickOnTheElement("fe::FormContainer::SubSectionReference1::FormElement::DataField::referenceObjectType_code::Field-edit-inner-vhi");


                        // Click on the Project - Reference Type
                        When.onTheResourceRequestObjectPage.iClickOnTheElementTypeWithProperty(
                            'sap.m.Text',
                            {
                                text: 'Project'
                            }
                        );

                        When.onTheResourceRequestObjectPage
                            .iClickOnTheElement("fe::FormContainer::SubSectionReferenceObject::FormElement::DataField::referenceObject_ID::Field-edit-inner-vhi");

                        // Select a reference object
                        When.onTheResourceRequestObjectPage.iClickOnTheElementTypeWithProperty(
                            'sap.m.Text',
                            {
                                text: 'Project B'
                            }
                        );

                        When.onTheResourceRequestObjectPage
                            .iClickOnTheElement("fe::FormContainer::SubSectionReference1::FormElement::DataField::referenceObjectType_code::Field-edit-inner-vhi");

                        When.onTheResourceRequestObjectPage.iClickOnTheElementTypeWithProperty(
                            'sap.m.Text',
                            {
                                text: 'None'
                            }
                        );

                    }
                );

                opaTest(
                    'Request Priority is set to Medium by default during create',
                    function (Given, When, Then) {
                        /* Requested Priority is set to "Medium" as default value during Resource request creation; */
                        Then.onTheResourceRequestObjectPage
                            .onForm({
                                section: 'ResourceRequestDetails',
                                fieldGroup: 'SubSectionRequest1'
                            })
                            .iCheckField('Request Priority', 'Medium');
                    }
                );

                opaTest(
                    'Resource Request Details are provided',
                    function (Given, When, Then) {
                        /* When I select the draft resource request in list page; And fill all the mandatory fields; And I click on Save
                        Then a toast message is appeared, confirming a successfull Resource Request creation;
                        Edit and Delete button is visible in the object page after Resource Request is created; */

                        //Add Name
                        When.onTheResourceRequestObjectPage
                            .onForm({
                                section: 'ResourceRequestDetails',
                                fieldGroup: 'SubSectionRequest1'
                            })
                            .iChangeField({ property: 'name' }, "Resource Request 8");

                        // Add Resource organization
                        When.onTheResourceRequestObjectPage
                            .onForm({
                                section: 'ResourceRequestDetails',
                                fieldGroup: 'SubSectionRequest1'
                            })
                            .iOpenValueHelp({ property: 'requestedResourceOrg_ID' });

                        When.onTheResourceRequestObjectPage
                            .onValueHelpDialog()
                            .iSelectRows({ 'ID': 'RORG2', 'Resource Organization': 'Organization ORG_2 Germany', 'Description': 'Organization ORG_2 Germany' });
                    }
                );

                opaTest(
                    'Resource Request is saved as draft',
                    function (Given, When, Then) {
                        /* When I click on back button in object page on create mode
                        And I filter based on my own draft;
                        Then I can see exactly one resource request as drfat in list report */

                        When.onTheShell.iNavigateBack();

                        When.onTheResourceRequestObjectPage.onMessageDialog().iSelectDraftDataLossOption("draftDataLossOptionKeep").and.iConfirm();

                        Then.onTheResourceRequestListReportPage.iSeeThisPage();

                        When.onTheResourceRequestListReportPage
                            .onFilterBar()
                            .iChangeEditingStatus(EditState.OwnDraft)
                            .and.iExecuteSearch();

                        Then.onTheResourceRequestListReportPage.onTable().iCheckRows(1);

                        Then.onTheResourceRequestListReportPage.iSeeDraftIndicator();
                    }
                );

                opaTest(
                    'Requested duration and effort is provided',
                    function (Given, When, Then) {
                        When.onTheResourceRequestListReportPage.onTable().iPressRow(0);

                        // Enter dates
                        When.onTheResourceRequestObjectPage.iEnterTextInInputField(
                            'manageResourceRequest::ResourceRequestObjectPage--fe::CustomSubSection::effortcustomSection--datePicker12',
                            'Oct 1, 2020 - Nov 26, 2020'
                        );

                        // Enter required efforts.
                        When.onTheResourceRequestObjectPage.iEnterTextInInputFieldWithBindingPath({
                            propertyPath: "requestedCapacity"
                        }, "500.00"
                        );
                    });

                opaTest(
                    'Resource Request is created on Save without project role',
                    function (Given, When, Then) {

                        When.onTheResourceRequestObjectPage.onFooter().iExecuteSave();

                        // Check the Toast message appearance on save
                        Then.iSeeMessageToast('Object created');

                        // Check edit and delete button is visible in the header
                        Then.onTheResourceRequestObjectPage
                            .onHeader()
                            .iCheckEdit({ visible: true })
                            .and.iCheckDelete({ visible: true })
                            .and.iCheckTitle("Resource Request 8");
                    }
                );

                opaTest(
                    'Request and Release Status are set to default values after save',
                    function (Given, When, Then) {
                        /* I can see the Request status is "Open" and Release status is "Not Published" after save */
                        Then.onTheResourceRequestObjectPage
                            .onHeader()
                            .iCheckDataPoint('Request Status', 'Open')
                            .and.iCheckDataPoint('Publishing Status', 'Not Published');
                    }
                );

                opaTest('Project role is added to resource request', function(Given, When, Then) {
                    // Click on Edit
                    When.onTheResourceRequestObjectPage.onHeader().iExecuteEdit();
                    // Add project role.
                    When.onTheResourceRequestObjectPage
                        .onForm({
                            section: 'ResourceRequestDetails',
                            fieldGroup: 'SubSectionRequest1'
                        })
                        .iOpenValueHelp({ property: 'projectRole_ID' });

                    When.onTheResourceRequestObjectPage
                        .onValueHelpDialog()
                        .iSelectRows({ Code: 'P002', 'Project Role': 'Developer' });
                });

                opaTest(
                    'Inline empty skill row is created into skill list',
                    function (Given, When, Then) {
                        /* When I click on create button on Required Skill list page;
                        Then I can see an inline empty skill row in the required skill list */

                        When.onTheResourceRequestObjectPage.iGoToSection(
                            'Required Skills'
                        );

                        When.onTheResourceRequestObjectPage
                            .onTable('Skills')
                            .iExecuteCreate();

                        Then.onTheResourceRequestObjectPage.onTable('Skills').iCheckRows(1);
                        Then.onTheResourceRequestObjectPage.iShouldSeeTheElementTypeWithProperty(
                            'sap.ui.mdc.field.FieldInput',
                            {
                                editable: false
                            }
                        );
                    }
                );

                opaTest(
                    'Skill is added to the resource request',
                    function (Given, When, Then) {
                        // to check if proficiency level are getting updated according to skill and also getting filtered

                        // To get the focus on the 1st row and Name column of Skills table and open the value help
                        When.onTheResourceRequestObjectPage
                            .onTable('Skills')
                            .iPressCell(0, 'Skill')
                            .and.iExecuteKeyboardShortcut('F4', { 'Skill': '' }, 'Skill');

                        // Select the row with skill name Cloud Foundry and press OK
                        When.onTheResourceRequestListReportPage
                            .onValueHelpDialog()
                            .iChangeSearchField('Cloud Foundry')
                            .and.iExecuteSearch();

                        When.onTheResourceRequestListReportPage
                            .onValueHelpDialog()
                            .iSelectRows({ 'Skill': 'Cloud Foundry' });

                        // To get the focus on the 1st row and Proficiency Level column of Skills table and open the value help
                        When.onTheResourceRequestObjectPage
                            .onTable('Skills')
                            .iPressCell(0, 'Proficiency Level')
                            .and.iExecuteKeyboardShortcut(
                                'F4',
                                { 'Proficiency Level': '' },
                                'Proficiency Level'
                            );

                        // Assert row count for proficiency levels available for selected skill
                        // Then.onTheResourceRequestObjectPage.iShouldSeeCorrectValueHelpTableRowCount(
                        //     OBJECTPAGE_PREFIX_ID +
                        //     'fe::table::skillRequirements::LineItem::TableValueHelp::skillRequirements::proficiencyLevel_ID::SuggestTable',
                        //     3
                        //const OBJECTPAGE_PREFIX_ID ='manageResourceRequest::ResourceRequestObjectPage--';
                        //
                        // );

                        // Select proficiency level
                        When.onTheResourceRequestObjectPage.iClickOnTheElementTypeWithProperty(
                            'sap.m.Text',
                            {
                                text: 'Proficiency Level 2.3'
                            }
                        );

                        // Selected proficiency level is visible in the skill requirements table
                        Then.onTheResourceRequestObjectPage.iShouldSeeTheElementTypeWithProperty(
                            'sap.ui.mdc.field.FieldInput',
                            {
                                value: 'Proficiency Level 2.3'
                            }
                        );

                        /* When I choose a Skill and skill importance in the required skill list;
                        And I click on save
                        Then I can see a toast message; And I can see "Edit" and "Delete" button after save;
                        (This confirms skill is added sucessfully to the resource request) */

                        // To get the focus on the 1st row and Name column of Skill Table and open the value help
                        When.onTheResourceRequestObjectPage
                            .onTable('Skills')
                            .iPressCell(0, 'Skill')
                            .and.iExecuteKeyboardShortcut(
                                'F4',
                                { 'Skill': 'Cloud Foundry' },
                                'Skill'
                            );

                        // Select the row with skill name UI5 and press OK
                        When.onTheResourceRequestListReportPage
                            .onValueHelpDialog()
                            .iChangeSearchField('UI5')
                            .and.iExecuteSearch();

                        When.onTheResourceRequestListReportPage
                            .onValueHelpDialog()
                            .iSelectRows({ 'Skill': 'UI5' });

                        // To get the focus on the 1st row and Proficiency Level column of Skills table and open the value help
                        When.onTheResourceRequestObjectPage
                            .onTable('Skills')
                            .iPressCell(0, 'Proficiency Level')
                            .and.iExecuteKeyboardShortcut(
                                'F4',
                                { 'Proficiency Level': '' },
                                'Proficiency Level'
                            );

                        // Assert row count for proficiency levels available for selected skill
                        // Then.onTheResourceRequestObjectPage.iShouldSeeCorrectValueHelpTableRowCount(
                        //     OBJECTPAGE_PREFIX_ID +
                        //     'fe::table::skillRequirements::LineItem::TableValueHelp::skillRequirements::proficiencyLevel_ID::SuggestTable',
                        //     3
                        // );

                        // Select proficiency level
                        When.onTheResourceRequestObjectPage.iClickOnTheElementTypeWithProperty(
                            'sap.m.Text',
                            {
                                text: 'Proficiency Level 1.3'
                            }
                        );

                        // To get the focus on the 1st row and skill importance column of Skills table and open the value help
                        When.onTheResourceRequestObjectPage
                            .onTable('Skills')
                            .iPressCell(0, 'Importance')
                            .and.iExecuteKeyboardShortcut(
                                'F4',
                                { Importance: '' },
                                'Importance'
                            );

                        // Select skill importance
                        When.onTheResourceRequestObjectPage.and.iClickOnTheElementTypeWithBindingPathAndProperty(
                            'sap.m.Text',
                            {
                                path: '/SkillImportanceCodes(1)'
                            },
                            {
                                text: 'Mandatory'
                            }
                        );

                        // Check row values in the skill requirements table
                        Then.onTheResourceRequestObjectPage
                            .iSeeSectionWithTitle('Required Skills')
                            .and.onTable('Skills')
                            .iCheckRows(
                                {
                                    'Skill': 'UI5',
                                    'Proficiency Level': 'Proficiency Level 1.3',
                                    Importance: 'Mandatory',
                                    Comment: ''
                                },
                                1
                            );
                    });

                opaTest('Save resource request', function(Given, When, Then) {
                    // Save Resource Request
                    When.onTheResourceRequestObjectPage.onFooter().iExecuteSave();

                    // Check the Toast message appearance on save
                    Then.iSeeMessageToast('Object saved');

                    // Expand Object page header
                    When.onTheResourceRequestObjectPage
                        .iCollapseExpandPageHeader();

                    // Check edit and delete button is visible in the header
                    Then.onTheResourceRequestObjectPage
                        .onHeader()
                        .iCheckEdit({ visible: true })
                        .and.iCheckDelete({ visible: true })
                        .and.iCheckTitle("Resource Request 8");
                });

                opaTest(
                    'Navigate back to list page after save',
                    function (Given, When, Then) {
                        /* When I navigate from object page after save
        Then I can see the list report in resource request list page; */

                        When.onTheShell.iNavigateBack();

                        // There should be 0 rows in list page as previous filter was draft
                        Then.onTheResourceRequestListReportPage
                            .onTable()
                            .iCheckRows(0);

                        // Set Editing Status to All and Filter for created project
                        When.onTheResourceRequestListReportPage
                            .onFilterBar()
                            .iChangeEditingStatus(EditState.All)
                            .and.iChangeFilterField({ property: 'displayId' }, "0000000011", true);

                        // Press Go to search with the applied filters
                        When.onTheResourceRequestListReportPage
                            .onFilterBar()
                            .iExecuteSearch();

                        // Only 1 row should be visible
                        Then.onTheResourceRequestListReportPage
                            .onTable()
                            .iCheckRows(1);
                    }
                );

                opaTest(
                    'Create and publish a Resource Request with Reference Object Type as Project',
                    function (Given, When, Then) {

                        /* When I click on "Create" button on Resource Request List Report;
                        Then I can see Save and Cancel button; confirming landing on Resource request object page in create mode; */

                        When.onTheResourceRequestListReportPage
                            .onTable()
                            .iExecuteCreate();

                        Then.onTheResourceRequestObjectPage
                            .onHeader()
                            .iCheckTitle("New: Resource Request");

                        /* Select Reference Object Type as Project &
                            select a reference object. */

                        When.onTheResourceRequestObjectPage
                            .iClickOnTheElement("fe::FormContainer::SubSectionReference1::FormElement::DataField::referenceObjectType_code::Field-edit-inner-vhi");


                        // Click on the Project - Reference Type
                        When.onTheResourceRequestObjectPage.iClickOnTheElementTypeWithProperty(
                            'sap.m.Text',
                            {
                                text: 'Project'
                            }
                        );

                        When.onTheResourceRequestObjectPage
                            .iClickOnTheElement("fe::FormContainer::SubSectionReferenceObject::FormElement::DataField::referenceObject_ID::Field-edit-inner-vhi");

                        // Select a reference object "PROJECT B"
                        When.onTheResourceRequestObjectPage.iClickOnTheElementTypeWithProperty(
                            'sap.m.Text',
                            {
                                text: 'Project B'
                            }
                        );

                        // Enter Resource Request Mandatory Details
                        When.onTheResourceRequestObjectPage
                            .onForm({
                                section: 'ResourceRequestDetails',
                                fieldGroup: 'SubSectionRequest1'
                            })
                            .iChangeField({ property: 'name' }, "Resource Request with Reference Object");

                        // Add Resource organization
                        When.onTheResourceRequestObjectPage
                            .onForm({
                                section: 'ResourceRequestDetails',
                                fieldGroup: 'SubSectionRequest1'
                            })
                            .iOpenValueHelp({ property: 'requestedResourceOrg_ID' });

                        When.onTheResourceRequestObjectPage
                            .onValueHelpDialog()
                            .iSelectRows({ 'ID': 'RORG2', 'Resource Organization': 'Organization ORG_2 Germany', 'Description': 'Organization ORG_2 Germany' });

                        // Enter date range of the request
                        When.onTheResourceRequestObjectPage.iEnterTextInInputField(
                            'manageResourceRequest::ResourceRequestObjectPage--fe::CustomSubSection::effortcustomSection--datePicker12',
                            'Oct 1, 2020 - Nov 26, 2020'
                        );

                        // Enter required efforts.
                        When.onTheResourceRequestObjectPage.iEnterTextInInputFieldWithBindingPath({
                            propertyPath: "requestedCapacity"
                        }, "200.00"
                        );

                        //Create & publish the Resource Request
                        When.onTheResourceRequestObjectPage.onFooter().iExecuteSave();

                        // Check the Toast message appearance on create
                        Then.iSeeMessageToast('Object created');

                        // Publish the Resource Request
                        When.onTheResourceRequestObjectPage.iClickOnTheElementTypeWithProperty('sap.m.Button', { text: "Publish"});

                    }
                );

                opaTest("Update published resource request", function(Given,When,Then){
                    // Check Edit button is visible in the header in the published state
                    Then.onTheResourceRequestObjectPage
                        .onHeader()
                        .iCheckEdit({visible: true});

                    // Click on the Edit Button in the object page header
                    When.onTheResourceRequestObjectPage
                        .onHeader()
                        .iExecuteEdit();

                    // Check Save and Delete button is visible on the footer
                    Then.onTheResourceRequestObjectPage
                        .onFooter()
                        .iCheckSave({visible: true, enabled: true})
                        .and.iCheckCancel({visible: true, enabled: true});

                    // Update Resource Request duration & required Effort.
                    When.onTheResourceRequestObjectPage.iEnterTextInInputField(
                        'manageResourceRequest::ResourceRequestObjectPage--fe::CustomSubSection::effortcustomSection--datePicker12',
                        'Jan 1, 2021 - Dec 26, 2021'
                    );

                    // Update required efforts.
                    When.onTheResourceRequestObjectPage.iEnterTextInInputFieldWithBindingPath({
                        propertyPath: "requestedCapacity"
                    }, "400.00"
                    );

                    // Activate the draft
                    When.onTheResourceRequestObjectPage.onFooter().iExecuteSave();

                    // Check the Toast message appearance on save
                    Then.iSeeMessageToast('Object saved');
                });
                opaTest("Teardown", function (Given, When, Then) {
                    Given.iTearDownMyApp();
                });
            }
        };
    }
);
