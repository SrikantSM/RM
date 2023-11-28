sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
    "use strict";

    var Journey = {
        run: function () {
            QUnit.module("Project Roles");

            // Basic checks when we load the application on list report
            opaTest('Open App (When I load the App, a list report shows list of existing project roles', function (Given, When, Then) {
                Given.iResetTestData().and.iStartMyApp("projectRoleUi-Display");
                Then.onTheMainPage.iSeeThisPage();
                Then.onTheShell.iSeeShellAppTitle("Manage Project Roles");
                // Check default filters
                When.onTheMainPage.iCollapseExpandPageHeader(false);
                Then.onTheMainPage.onFilterBar().iCheckFilterField({
                    property: "DraftEditingStatus"
                }, undefined, {
                    label: "Editing Status"
                }).and.iCheckFilterField({
                    property: "name"
                }, undefined, {
                    label: "Project Role"
                }).and.iCheckFilterField({
                    property: "code"
                }, undefined, {
                    label: "Code"
                });
                Then.onTheMainPage.onFilterBar().iCheckSearch();

                // Check Variant
                Then.onTheMainPage.iSeeVariantTitle("Standard");

                //Check Table toolbar and existing Project Roles
                Then.onTheMainPage.iShouldSeeCorrectSelectionMode("None")
                    .and.iShouldSeeTheTableActionToolbar("Project Roles (5)")
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Button', { text: 'Settings' })
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Button', { icon: 'sap-icon://excel-attachment' })
                    .and.onTable()
                    .iCheckColumns(6,{
                        "Project Role": { headerVisible: true },
                        "Code": { headerVisible: true },
                        "Description": { headerVisible: true },
                        "Usage": { headerVisible: true },
                        "Changed By": { headerVisible: true },
                        "Changed On": { headerVisible: true }
                    }).and.iCheckRows(5);
            });

            // Check adapt filter
            opaTest('Check Adapt filter works on click', function (Given, When, Then) {
                When.onTheMainPage.iCollapseExpandPageHeader(false);
                Then.onTheMainPage.onFilterBar().iOpenFilterAdaptation()
                    .and.iConfirmFilterAdaptation();
            });

            // Add/Remove columns check
            // Added title as 'Usage' instead of 'Role Lifecycle Status' FYI https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/722
            opaTest('On click of Add/Remove Columns icon, I should see correct number of columns and data.', function (Given, When, Then) {
                When.onTheMainPage.onTable().iOpenColumnAdaptation();
                Then.onTheMainPage.onTable()
                    .iCheckAdaptationColumn("Project Role", { selected: true })
                    .and.iCheckAdaptationColumn("Code", { selected: true })
                    .and.iCheckAdaptationColumn("Description", { selected: true })
                    .and.iCheckAdaptationColumn("Usage", { selected: true })
                    .and.iCheckAdaptationColumn("Changed By", { selected: true })
                    .and.iCheckAdaptationColumn("Changed On", { selected: true })
                    .and.iCheckAdaptationColumn("Created On", { selected: false });
                When.onTheMainPage.onTable().iConfirmColumnAdaptation();
                Then.onTheMainPage.onTable().iCheckColumns(6);
            });

            // Restrict cycle
            opaTest('Restrict role life cycle', function (Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow({"Code": "T006"});
                Then.onTheDetailPage.iSeeThisPage();
                Then.onTheShell.iSeeShellAppTitle("Project Role");
                Then.onTheDetailPage.onHeader().iCheckAction("Restrict", { visible: true, enabled: true });
                When.onTheDetailPage.onHeader().iExecuteAction("Restrict");
                When.onTheDetailPage.onConfirmationDialog().iConfirm();
                Then.onTheDetailPage.onHeader().iCheckAction("Restrict", { visible: false, enabled: false });
                When.iNavigateBack();
                Then.onTheMainPage
                    .iSeeThisPage()
                    .and.onTable().iCheckRows({
                        "Project Role": "Junior Consultant1",
                        "Code": "T006",
                        "Usage": "Restricted"
                    },1);
            });

            opaTest('Remove restriction role life cycle', function (Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow({"Code": "T006"});
                Then.onTheDetailPage.iSeeThisPage();
                Then.onTheShell.iSeeShellAppTitle("Project Role");
                Then.onTheDetailPage.onHeader().iCheckAction("Remove Restriction", { visible: true, enabled: true });
                When.onTheDetailPage.onHeader().iExecuteAction("Remove Restriction");
                When.onTheDetailPage.onConfirmationDialog().iConfirm();
                Then.onTheDetailPage.onHeader().iCheckAction("Remove Restriction", { visible: false, enabled: false });
                When.iNavigateBack();
                Then.onTheMainPage
                    .iSeeThisPage()
                    .and.onTable().iCheckRows({
                        "Project Role": "Junior Consultant1",
                        "Code": "T006",
                        "Usage": "UnRestricted"
                    },1);
            });

            opaTest('Cancel Create Project Role dialog (When I click on Create, I see the role creation dialog and on cancel should see List Report with correct number of entry)', function (Given, When, Then) {
                When.onTheMainPage.onTable().iExecuteCreate();
                Then.onTheDetailPage.onCreateDialog().iCheckCreate();
                // When.onTheMainPage.onDialog("Continue").iCancel();
                When.onTheDetailPage.onDialog().iCancel();
            });

            // Project role creation using Create dialog
            opaTest('Create Project Role via Dialog (When I fill out and submit the creation dialog, I see the role edit page)', function (Given, When, Then) {
                When.onTheMainPage.onTable().iExecuteCreate();
                Then.onTheDetailPage.onCreateDialog().iCheckCreate();

                When.onTheDetailPage
                    .onActionDialog()
                    .iChangeDialogField({ property: "code" }, "T000", true)
                    .and.iChangeDialogField({ property: "name" }, "TestRoleName", true)
                    .and.iChangeDialogField({ property: "description" }, "TestRoleDescription", true)
                    .and.iConfirm();

                Then.onTheDetailPage
                    .iSeeObjectPageInEditMode()
                    .and.onFooter()
                    .iCheckDraftStateClear();

                Then.onTheDetailPage
                    .iShouldSeeTheCurrentTimeInTheText('FieldGroup::AdministrativeData1', 'createdAt', 5)
                    .and.iShouldSeeTheCurrentTimeInTheText('FieldGroup::AdministrativeData2', 'modifiedAt', 5)
                    .and.iShouldSeeTimeInCreatedAndModifiedAtTexts()
                    .and.iShouldSeeTheValueInTheField('modifiedBy', 'authenticated-user@sap.com');
                Then.onTheDetailPage.onForm("General Information")
                    .iCheckField(
                        { property: "code" },
                        { value: "T000"},
                        { visible: true }
                    );
                When.onTheDetailPage.iGoToSection("Role Names");
                Then.onTheDetailPage.onTable("Role Names").iCheckRows(1)
                    .and.iCheckRows({
                        "Project Role": "TestRoleName",
                        "Language": "en",
                        "Description": "TestRoleDescription"
                    });
            });

            // Checks on list report and object page when you Create a new project role(draft mode)
            opaTest('Create Project Role and do not save (Draft mode)', function (Given, When, Then) {
                When.iNavigateBack();
                Then.onTheMainPage.onTable()
                    .iCheckRows({
                        "Project Role": "TestRoleName",
                        "Code": "T000",
                        "Description": "TestRoleDescription"
                    });
                Then.onTheMainPage.iShouldSeeTheDraftLink();
            });

            // Checks on list report when you are editing a project role which is in draft mode
            opaTest('Edit Project Role details (When I edit the role name,code,description I should see the changes at the list report)', function (Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow({"Description": "TestRoleDescription"});
                Then.onTheDetailPage.iSeeThisPage();
                When.onTheDetailPage.onForm("General Information")
                    .iChangeField({ property: "code"}, "T001");
                When.onTheDetailPage.iGoToSection("Role Names")
                    .and.onTable("Role Names")
                    .iChangeRow({
                        "Project Role": "TestRoleName",
                        "Language": "en",
                        "Description": "TestRoleDescription"
                    },
                    {
                        "Project Role": "TestRoleName1",
                        "Description": "TestRoleDescription1"
                    });
                When.iNavigateBack();
                Then.onTheMainPage.onTable()
                    .iCheckRows({
                        "Project Role": "TestRoleName1",
                        "Code": "T001",
                        "Description": "TestRoleDescription1"
                    });
            });

            // Adding new entry for localization
            opaTest('Edit Project Role details( Add a new line for name and description)', function (Given, When, Then) {
                // Action: Create Label
                When.onTheMainPage.onTable().iPressRow({"Description": "TestRoleDescription1"});
                When.onTheDetailPage.iGoToSection("Role Names");
                When.onTheDetailPage.onTable("Role Names")
                    .iExecuteCreate();
                // // Assertion: new row appears
                Then.onTheDetailPage.onTable("Role Names").iCheckRows(2);
            });

            // Check for the entries added
            opaTest('Add name and description (When I enter a name and description for the project role, the name and description are visible', function (Given, When, Then) {
                When.onTheDetailPage.iEnterTextOnTheTableElement(0, 0, "TestRoleName2_DE")
                    .and.iEnterTextOnTheTableElement(0, 2, "TestRoleDescription2_DE");
                Then.onTheDetailPage.onTable("Role Names").iCheckRows({
                    "Project Role": "TestRoleName2_DE",
                    "Description": "TestRoleDescription2_DE"
                });
            });

            // Value help for language
            opaTest('Add language (When I click the Value Help button, I see a Value Help Dialog for the language and assign the language)', function (Given, When, Then) {
                //Action value help
                When.onTheDetailPage.iOpenTheValueHelpOnTheTableElement('fe::table::texts::LineItem-innerTable', 0, 1);
                //Assertion:
                Then.onTheDetailPage.onDialog().iCheckState({ title: "Select: Language" });

                Then.onTheDetailPage.iShouldSeeCorrectValueHelpTableColumns("ProjectRoleObjectPage", "table::texts::LineItem::TableValueHelp::texts::locale::Dialog::qualifier::::Table-innerTable", ["Language Code","Language"]);
                Then.onTheDetailPage.onValueHelpDialog().iCheckRows(2);
                //Action: assign value
                When.onTheDetailPage.onValueHelpDialog().iSelectRows({"Language" : "German"});
                //Assertion: assign de
                Then.onTheDetailPage.onTable("Role Names").iCheckRows({
                    "Language": "de"
                },1);
            });

            // Project role with multiple language
            opaTest('Save Project Role with 2 language code', function (Given, When, Then) {
                When.onTheDetailPage.onFooter().iExecuteSave();
                When.iNavigateBack();
                Then.onTheMainPage.iSeeThisPage();
            });

            // Deleting entry in texts(localization) table
            opaTest('Delete project role text table entries', function (Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow({"Description": "TestRoleDescription1"});
                When.onTheDetailPage.onHeader().iExecuteEdit();
                When.onTheDetailPage.iGoToSection("Role Names")
                    .and.onTable("Role Names").iSelectRows({"Language": "de"})
                    .and.iExecuteDelete();
                Then.onTheDetailPage.onDialog().iCheckState({ title: "Delete" });
                When.onTheDetailPage.onDialog("Delete").iConfirm();
                Then.onTheDetailPage.onTable("Role Names").iCheckRows(1);
            });

            // Language validation - same language code is not allowed
            opaTest('Save Project Role with duplicate default language code (When I try to save a project role with same default language, I shoule see an error message)', function (Given, When, Then) {
                When.onTheDetailPage.onTable('Role Names').iExecuteCreate();
                When.onTheDetailPage.iEnterTextOnTheTableElement(0, 0, "TestRoleName_en2")
                    .and.iEnterTextOnTheTableElement(0, 2, "TestRoleDescription_en2");
                When.onTheDetailPage.iOpenTheValueHelpOnTheTableElement('fe::table::texts::LineItem-innerTable', 0, 1);
                Then.onTheDetailPage.onDialog().iCheckState({ title: "Select: Language" });
                Then.onTheDetailPage.iShouldSeeCorrectValueHelpTableColumns("ProjectRoleObjectPage", "table::texts::LineItem::TableValueHelp::texts::locale::Dialog::qualifier::::Table-innerTable", ["Language Code","Language"]);
                Then.onTheDetailPage.onValueHelpDialog().iCheckRows(2);
                //Action: assign value
                When.onTheDetailPage.onValueHelpDialog().iSelectRows({"Language" : "English"});
                When.onTheDetailPage.iClickOnTheElementTypeWithProperty('sap.m.Button',{ text: 'Save'});
                Then.onTheDetailPage.onFooter().iCheckAction("2", { visible: true, type: "Negative" });
                Then.onTheDetailPage.iSeeMessageView();
                When.onTheDetailPage.onFooter().iExecuteCancel()
                    .and.iConfirmCancel();
                When.iNavigateBack();
                Then.onTheMainPage.iSeeThisPage();
            });

            // Role Code Validations - Save not possible when role code is null/Empty
            opaTest('Save Project Role without role code (When I try to save a project role without role code, I should see an error message)', function (Given, When, Then) {
                When.onTheMainPage.onTable().iExecuteCreate();


                When.onTheDetailPage
                    .onActionDialog()
                    .iChangeDialogField({ property: "code" }, "T002", true)
                    .and.iChangeDialogField({ property: "name" }, "TestRoleName2", true)
                    .and.iChangeDialogField({ property: "description" }, "TestRoleDescription2", true)
                    .and.iConfirm();

                When.onTheDetailPage.onForm("General Information")
                    .iChangeField({ property: "code"}, "");
                When.onTheDetailPage.onFooter().iExecuteSave();
                Then.onTheDetailPage.onFooter()
                    .iCheckAction("1", { visible: true, type: "Negative" });
                Then.onTheDetailPage.iSeeMessageView();
            });

            // Role Code Validations - Save not possible when descritpion has forbidden characters
            opaTest('Save Project Role with a descritpion that has forbidden characters (When I try to save a project role with a descritpion that has forbidden characters, I should see an error message)', function (Given, When, Then) {
                When.onTheDetailPage.onForm("General Information").iChangeField({ property: "code"}, "ABCD");
                When.onTheDetailPage.onTable("Role Names").iChangeRow({"Description": "TestRoleDescription2"}, {"Description": "TestRoleDescription1<script>"});
                When.onTheDetailPage.onFooter().iExecuteSave();
                Then.onTheDetailPage.onFooter()
                    .iCheckAction("1", { visible: true, type: "Negative" });
                Then.onTheDetailPage.iSeeMessageView();

                When.onTheDetailPage.iEnterTextOnTheTableElement(0, 2, "TestRoleDescription1<img>");
                When.onTheDetailPage.onFooter().iExecuteSave();
                Then.onTheDetailPage.onFooter()
                    .iCheckAction("1", { visible: true, type: "Negative" });
                Then.onTheDetailPage.iSeeMessageView();
                When.onTheDetailPage.onFooter().iExecuteCancel()
                    .and.iConfirmCancel();
                When.iNavigateBack();
                Then.onTheMainPage.iSeeThisPage();
            });

            // Role Code Validations - Add a valid role code and project role gets saved
            opaTest('Save Project Role with a valid role code (When I try to save a project role with valid role code, then project role should be saved)', function (Given, When, Then) {
                When.onTheMainPage.onTable().iExecuteCreate();

                When.onTheDetailPage.onActionDialog()
                    .iChangeDialogField({ property: "code" }, "T002", true)
                    .and.iChangeDialogField({ property: "name" }, "TestRoleName2", true)
                    .and.iChangeDialogField({ property: "description" }, "TestRoleDescription2", true)
                    .and.iConfirm();

                When.onTheDetailPage.onFooter().iExecuteSave();
                Then.onTheDetailPage.onHeader().iCheckFieldInFieldGroup({ fieldGroup: "FieldGroup::AdministrativeData1", field: "modifiedBy" }, "authenticated-user@sap.com");
                Then.onTheDetailPage
                    .iShouldSeeTheCurrentTimeInTheText('FieldGroup::AdministrativeData2', 'modifiedAt', 5);
                When.iNavigateBack();
                Then.onTheMainPage.onTable()
                    .iCheckRows({
                        "Project Role": "TestRoleName2",
                        "Code": "T002",
                        "Description": "TestRoleDescription2"
                    });
            });

            // Filter by draft status on list report
            opaTest('Filter project role by draft status(Own Draft)', function (Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow({"Code": "T001"});
                When.onTheDetailPage.onHeader().iExecuteEdit();
                When.iNavigateBack();
                When.onTheMainPage.onFilterBar().iChangeFilterField({ property: "DraftEditingStatus" }, "Own Draft")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows({"Description": "TestRoleDescription1"});
                Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty('sap.m.ObjectMarker', { type: 'Draft' });
            });

            // Filter by All status on list report
            opaTest('Filter project role by draft status(All)', function (Given, When, Then) {
                When.onTheMainPage.onFilterBar().iChangeFilterField({ property: "DraftEditingStatus" }, "All")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows({"Description": "TestRoleDescription1"});
                Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty('sap.m.ObjectMarker', { type: 'Draft' });
            });

            // Enable edit mode, edit an existing Project Role Name and see if the changes are reflected
            opaTest('Enable edit mode, edit a project role name and save changes', function (Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow({"Code": "T008"});
                When.onTheDetailPage.onHeader().iExecuteEdit();
                When.onTheDetailPage.iEnterTextOnTheTableElement(0, 0, 'TestRoleName8');
                When.onTheDetailPage.onFooter().iExecuteSave();
                Then.onTheDetailPage.onHeader().iCheckFieldInFieldGroup({ fieldGroup: "FieldGroup::AdministrativeData1", field: "modifiedBy" }, "authenticated-user@sap.com");
                Then.onTheDetailPage
                    .and.iShouldSeeTheCurrentTimeInTheText('FieldGroup::AdministrativeData2', 'modifiedAt', 5);
                When.iNavigateBack();
                Then.onTheMainPage.onTable().iCheckRows({
                    "Project Role": "TestRoleName8",
                    "Code": "T008"
                });
            });

            // Enable edit mode, edit an existing Project Role Description and see if the changes are reflected
            opaTest('Enable edit mode, edit a project role description and save changes', function (Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow({"Code": "T008"});
                When.onTheDetailPage.onHeader().iExecuteEdit();
                When.onTheDetailPage.iEnterTextOnTheTableElement(0, 2, 'TestRoleDescription8');
                When.onTheDetailPage.onFooter().iExecuteSave();
                When.iNavigateBack();
                Then.onTheMainPage.onTable().iCheckRows({
                    "Code": "T008",
                    "Description": "TestRoleDescription8"
                });
            });

            // Enable edit mode, edit an existing Project Role Code and see if the changes are reflected
            opaTest('Enable edit mode, edit a project role code and save changes', function (Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow({"Code": "T008"});
                When.onTheDetailPage.onHeader().iExecuteEdit();
                When.onTheDetailPage.onForm("General Information")
                    .iChangeField({ property: "code"}, "T003");
                When.onTheDetailPage.onFooter().iExecuteSave();
                When.iNavigateBack();
                Then.onTheMainPage.onTable().iCheckRows({ "Code": "T003" });
            });

            // Enable edit mode, edit an existing Project Role Code to empty spaces then save is not possible
            opaTest('Edit existing role code to empty spaces(When I try to save a project role with empty spaces role code, I should see an error message)', function (Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow({"Code": "T003"});
                When.onTheDetailPage.onHeader().iExecuteEdit();
                When.onTheDetailPage.onForm("General Information")
                    .iChangeField({ property: "code"}, " ");
                When.onTheDetailPage.onFooter().iExecuteSave();
                Then.onTheDetailPage.onFooter()
                    .iCheckAction("1", { visible: true, type: "Negative" });
                Then.onTheDetailPage.iSeeMessageView();
                When.onTheDetailPage.iClickOnTheElementTypeWithProperty('sap.fe.macros.messages.MessageButton', { type: "Negative" });
            });

            // Enable edit mode, edit Project Role Code and enter same role code again then save is possible
            opaTest('Edit existing role code with same role code (When I try to save a project role with same role code, then role shoule be saved)', function (Given, When, Then) {
                When.onTheDetailPage.onForm("General Information")
                    .iChangeField({ property: "code"}, "T003");
                When.onTheDetailPage.onFooter().iExecuteSave();
                When.iNavigateBack();
                Then.onTheMainPage.onTable().iCheckRows({ "Code": "T003" });
            });

            // Cancel edit mode
            opaTest('Cancel editing', function (Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow({"Code": "T009"});
                When.onTheDetailPage.onHeader().iExecuteEdit();
                When.onTheDetailPage.onForm("General Information")
                    .iChangeField({ property: "code"}, "T002");
                When.onTheDetailPage.onFooter().iExecuteCancel()
                    .and.iConfirmCancel();
                When.iNavigateBack();
                Then.onTheMainPage.onTable().iCheckRows({ "Code": "T009" });
            });

            // Role Name Validations - Save not possible when role name is null/empty string
            opaTest('Save Project Role without role name (When I try to save a project role without role name, I should see an error message)', function (Given, When, Then) {
                When.onTheMainPage.onTable().iPressRow({"Code": "T003"});
                When.onTheDetailPage.onHeader().iExecuteEdit();
                When.onTheDetailPage.iEnterTextOnTheTableElement(0, 0, ' ');
                When.onTheDetailPage.onFooter().iExecuteSave();
                Then.onTheDetailPage.onFooter()
                    .iCheckAction("1", { visible: true, type: "Negative" });
                Then.onTheDetailPage.iSeeMessageView();
                When.onTheDetailPage.iClickOnTheElementTypeWithProperty('sap.fe.macros.messages.MessageButton', { type: "Negative" });
                When.onTheDetailPage.onFooter().iExecuteCancel()
                    .and.iConfirmCancel();
                When.iNavigateBack();
                Then.onTheMainPage.onTable().iCheckRows({ "Code": "T003" });
            });


            opaTest('Filter project role by entering a valid role code in filter box', function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "code" }, "T006")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable()
                    .iCheckRows({ "Code": "T006" })
                    .and.iCheckRows(1);

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "code" }, true)
                    .and.iExecuteSearch();
                // Changed as the previous steps are not happening due to the issue {paste issue link}
                Then.onTheMainPage.onTable().iCheckRows(7);
            });

            //Filter by typing an invalid code in the filter box instead of selecting it from value help
            opaTest('Filter project role by entering an invalid role code in filter box', function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "code" }, "T61");

                Then.onTheMainPage.onFilterBar().iCheckFilterField({ property: "code" }, undefined, {
                    valueState: "Error",
                    valueStateText: 'Value "T61" does not exist.'
                });

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "code" }, "")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(7);
            });

            // Filter by typing an invalid code in the filter box instead of selecting it from value help and clicking Go
            opaTest('Filter project role by entering an invalid role code in filter box and Search', function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "code" }, "T61")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onDialog().iCheckState({ title: "Error" });
                When.onTheMainPage.onDialog("Error").iCancel();

                //Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "code" }, "")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(7);
            });

            // Filter by selecting code from a value help
            opaTest('Filter project role by selecting code from value help', function (Given, When, Then) {

                Then.onTheMainPage.onFilterBar().iCheckFilterField({ property: "code" });
                When.onTheMainPage.onFilterBar().iOpenValueHelp({ property: "code" });
                Then.onTheMainPage
                    .onValueHelpDialog({ property: "code" })
                    .iCheckTable()
                    .and.iCheckFilterBar();
                When.onTheMainPage
                    .onValueHelpDialog()
                    .iSelectRows({"Code" : "T006"})
                    .and.iConfirm()
                    .and.when.onFilterBar()
                    .iExecuteSearch();
                Then.onTheMainPage.onTable()
                    .iCheckRows({ "Code": "T006" })
                    .and.iCheckRows(1);

                // Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "code" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(7);
            });

            // Filter by name by entering an invalid name in the filter box.
            opaTest('Filter project role by entering an invalid name in the filter box', function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "name" }, "TestName")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(0);

                // Reset the applied filter
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "name" }, true)
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable().iCheckRows(7);
            });

            // Filter by name by entering a valid name in the filter box.
            opaTest('Filter project role by entering a valid name in the filter box', function (Given, When, Then) {
                When.onTheMainPage.onFilterBar()
                    .iChangeFilterField({ property: "name" }, "Junior Consultant1")
                    .and.iExecuteSearch();
                Then.onTheMainPage.onTable()
                    .iCheckRows({ "Project Role": "Junior Consultant1" })
                    .and.iCheckRows(1);
            });

            opaTest("#999: Tear down", function (Given, When, Then) {
                Given.iTearDownMyApp();
            });
        }
    };

    return Journey;
});
