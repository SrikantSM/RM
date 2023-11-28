sap.ui.define(["sap/ui/test/opaQunit"], function (opaTest) {
    "use strict";

    var Journey = {
        run: function () {
            QUnit.module('Manage Replication Schedules');

            //Open App and Adapt Filters and check for Search Button
            opaTest("On opening the app, I should see correct app title and header controls", function (Given, When, Then) {
                Given.iResetTestData().and.iStartMyApp("replicationScheduleUi-Display");
                Then.onTheMainPage.iSeeThisPage();
                When.onTheMainPage.iCollapseExpandPageHeader(false);
                Then.onTheShell.iSeeShellAppTitle("Manage Replication Schedules");
                Then.onTheMainPage.iSeeVariantTitle("Standard");
                Then.onTheMainPage.onFilterBar().iOpenFilterAdaptation()
                    .and.iConfirmFilterAdaptation()
                    .and.iCheckSearch();
                When.onTheMainPage.iCollapseExpandPageHeader(true);
            });

            // Check table toolbar, columns and row data
            opaTest("On list report page, I should see list of replication schedules", function (Given, When, Then) {
                Then.onTheMainPage.iShouldSeeTheTableTitle('Replication Schedules (6)')
                    .and.iShouldSeeTheElementTypeWithProperty('sap.m.Button', { text: 'Settings' })
                    .and.onTable().iCheckState({ enableExport: true })
                    .and.iCheckAction("Activate")
                    .and.iCheckRows(6)
                    .and.iCheckColumns(6)
                    .and.iCheckColumns({
                        "Business Object Type": { headerVisible: true },
                        "Description": { headerVisible: true },
                        "Status": { headerVisible: true },
                        "Pattern": { headerVisible: true },
                        "Next Run": { headerVisible: true }
                    })
                    .and.iCheckRows({
                        "Business Object Type": "Cost Center",
                        "Description": "Schedule to trigger the initial cost center data replication from the MDI system.",
                        "Status": "Inactive",
                        "Pattern": "One-time",
                        "Next Run": ""
                    }, 1)
                    .and.iCheckRows({
                        "Business Object Type": "Cost Center",
                        "Description": "Schedule to trigger the periodic cost center data replication from the MDI system.",
                        "Status": "Inactive",
                        "Pattern": "Recurring - 30 minutes",
                        "Next Run": ""
                    }, 1)
                    .and.iCheckRows({
                        "Business Object Type": "Workforce Person",
                        "Description": "Schedule to trigger the initial replication of workforce person data from the MDI system.",
                        "Status": "Inactive",
                        "Pattern": "One-time",
                        "Next Run": ""
                    }, 1)
                    .and.iCheckRows({
                        "Business Object Type": "Workforce Person",
                        "Description": "Schedule to trigger the periodic replication of workforce person data from the MDI system.",
                        "Status": "Inactive",
                        "Pattern": "Recurring - 30 minutes",
                        "Next Run": ""
                    }, 1)
                    .and.iCheckRows({
                        "Business Object Type": "Workforce Capability",
                        "Description": "Schedule to trigger the initial replication of workforce capability data from the MDI system.",
                        "Status": "Inactive",
                        "Pattern": "One-time",
                        "Next Run": ""
                    }, 1)
                    .and.iCheckRows({
                        "Business Object Type": "Workforce Capability",
                        "Description": "Schedule to trigger the periodic replication of workforce capability data from the MDI system.",
                        "Status": "Inactive",
                        "Pattern": "Recurring - 30 minutes",
                        "Next Run": ""
                    }, 1);
            });

            // Check the Add/Remove columns
            opaTest("On click of add/remove columns icon, I should see correct number of columns and data", function(Given, When, Then) {
                When.onTheMainPage.onTable().iOpenColumnAdaptation();
                Then.onTheMainPage
                    .onTable().iCheckAdaptationColumn("Business Object Type", { selected: true })
                    .and.iCheckAdaptationColumn("Description", { selected: true })
                    .and.iCheckAdaptationColumn("Status", { selected: true })
                    .and.iCheckAdaptationColumn("Pattern", { selected: true })
                    .and.iCheckAdaptationColumn("Next Run", { selected: true })
                    .and.iCheckAdaptationColumn("Action", { selected: true })
                    .and.iCheckAdaptationColumn("Job ID", { selected: false })
                    .and.iCheckAdaptationColumn("Job Name", { selected: false })
                    .and.iCheckAdaptationColumn("Schedule ID", { selected: false });
                When.onTheMainPage.onTable().iConfirmColumnAdaptation();
                Then.onTheMainPage.onTable().iCheckColumns(6);
            });

            opaTest("Edit and activate the cost center one time schedule", function (Given, When, Then) {
                When.onTheMainPage.iSelectTheRadioButton(0)
                    .and.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Activate" });
                Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty("sap.m.Dialog", { title: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Date and Time" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Cancel" })
                    .and.iShouldSeeControlWithValue("APD_::nextRun-inner", "", true);
                When.onTheMainPage.iSetValueInControlWithId("APD_::nextRun-inner", "Dec 11, 2030, 2:10:34 PM", true)
                    .and.onDialog("Activate").iConfirm();
                Then.onTheMainPage.onTable().iCheckRows({
                    "Business Object Type": "Cost Center",
                    "Description": "Schedule to trigger the initial cost center data replication from the MDI system.",
                    "Status": "Active",
                    "Pattern": "One-time",
                    "Next Run": "Dec 11, 2030, 2:10:34 PM"
                }, 1);
                Then.onTheMainPage.iShouldSeeCorrectButtonInTheTableRow(0, "Deactivate");
            });

            opaTest("Edit and activate the cost center one time schedule with null value", function (Given, When, Then) {
                When.onTheMainPage.iSelectTheRadioButton(0)
                    .and.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Activate" });
                Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty("sap.m.Dialog", { title: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Date and Time" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Cancel" })
                    .and.iShouldSeeControlWithValue("APD_::nextRun-inner", "2030-12-11T14:10:34", true);
                When.onTheMainPage.iSetValueInControlWithId("APD_::nextRun-inner", "", true)
                    .and.onDialog("Activate").iConfirm();
                Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty("sap.ui.mdc.Field", { valueState: "Error", valueStateText: "Please enter a time and date." });
                When.onTheMainPage.onDialog("Activate").iCancel();
            });

            opaTest("Edit and activate the cost center one time schedule with a value in the past", function (Given, When, Then) {
                When.onTheMainPage.iSelectTheRadioButton(0)
                    .and.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Activate" });
                Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty("sap.m.Dialog", { title: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Date and Time" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Cancel" })
                    .and.iShouldSeeControlWithValue("APD_::nextRun-inner", "2030-12-11T14:10:34", true);
                When.onTheMainPage.iSetValueInControlWithId("APD_::nextRun-inner", "Dec 11, 2020, 2:10:34 PM", true)
                    .and.onDialog("Activate").iConfirm();
                // Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty("sap.m.Dialog", { icon: "sap-icon://error", title: "Error" });
                When.onTheMainPage.onDialog("Activate").iCancel();
            });

            opaTest("Edit and activate the cost center recurring schedule", function (Given, When, Then) {
                When.onTheMainPage.iSelectTheRadioButton(1)
                    .and.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Activate" });
                Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty("sap.m.Dialog", { title: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Repeat Interval in Minutes" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Cancel" })
                    .and.iShouldSeeControlWithValue("APD_::interval-inner", "30", true);
                When.onTheMainPage.iSetValueInControlWithId("APD_::interval-inner", "60", true)
                    .and.onDialog("Activate").iConfirm();
                Then.onTheMainPage.onTable().iCheckRows({
                    "Business Object Type": "Cost Center",
                    "Description": "Schedule to trigger the periodic cost center data replication from the MDI system.",
                    "Status": "Active",
                    "Pattern": "Recurring - 60 minutes"
                }, 1);
                Then.onTheMainPage.iShouldSeeCorrectButtonInTheTableRow(1, "Deactivate");
            });

            opaTest("Edit the cost center recurring schedule with negative repeat interval", function (Given, When, Then) {
                When.onTheMainPage.iSelectTheRadioButton(1)
                    .and.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Activate" })
                    .and.iSetValueInControlWithId("APD_::interval-inner", "-60", true)
                    .and.onDialog("Activate").iConfirm();
                Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty("sap.ui.mdc.Field", { valueState: "Error", valueStateText: "The repeat interval must be between 5 and 1440 minutes." });
                When.onTheMainPage.onDialog("Activate").iCancel();
            });

            opaTest("Edit the cost center recurring schedule with very high repeat interval", function (Given, When, Then) {
                When.onTheMainPage.iSelectTheRadioButton(1)
                    .and.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Activate" })
                    .and.iSetValueInControlWithId("APD_::interval-inner", "1600", true)
                    .and.onDialog("Activate").iConfirm();
                Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty("sap.ui.mdc.Field", { valueState: "Error", valueStateText: "The repeat interval must be between 5 and 1440 minutes." });
                When.onTheMainPage.onDialog("Activate").iCancel();
            });

            opaTest("Edit the cost center recurring schedule with no repeat interval", function (Given, When, Then) {
                When.onTheMainPage.iSelectTheRadioButton(1)
                    .and.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Activate" })
                    .and.iSetValueInControlWithId("APD_::interval-inner", "", true)
                    .and.onDialog("Activate").iConfirm();
                Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty("sap.ui.mdc.Field", { valueState: "Error", valueStateText: "The repeat interval must be between 5 and 1440 minutes." });
                When.onTheMainPage.onDialog("Activate").iCancel();
            });

            opaTest("On activation of workforce person recurring schedule when one-time schedule not activated atleast once, I should see an error", function (Given, When, Then) {
                When.onTheMainPage.iSelectTheRadioButton(3)
                    .and.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Activate" });
                Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty("sap.m.Dialog", { title: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Repeat Interval in Minutes" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Cancel" })
                    .and.iShouldSeeControlWithValue("APD_::interval-inner", "30", true);
                When.onTheMainPage.iSetValueInControlWithId("APD_::interval-inner", "60", true)
                    .and.onDialog("Activate").iConfirm();
                // Then.onTheMainPage.iShouldSeeErrorDialog("sap.m.Dialog","The recurring replication schedule can’t be activated. The one-time replication of workforce person data must be completed first.", {title : ""} );
                When.onTheMainPage.onDialog("Activate").iCancel();
            });

            opaTest("Activate the workforce person one time schedule", function (Given, When, Then) {
                When.onTheMainPage.iSelectTheRadioButton(2)
                    .and.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Activate" });
                Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty("sap.m.Dialog", { title: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Date and Time" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Cancel" })
                    .and.iShouldSeeControlWithValue("APD_::nextRun-inner", "", true);
                When.onTheMainPage.iSetValueInControlWithId("APD_::nextRun-inner", "Dec 11, 2030, 2:10:34 PM", true)
                    .and.onDialog("Activate").iConfirm();
                Then.onTheMainPage.onTable().iCheckRows({
                    "Business Object Type": "Workforce Person",
                    "Description": "Schedule to trigger the initial replication of workforce person data from the MDI system.",
                    "Status": "Active",
                    "Pattern": "One-time",
                    "Next Run": "Dec 11, 2030, 2:10:34 PM"
                }, 1);
                Then.onTheMainPage.iShouldSeeCorrectButtonInTheTableRow(2, "Deactivate");
            });

            opaTest("Cancel the edit of cost center recurring schedule and deactivate it", function (Given, When, Then) {
                When.onTheMainPage.iSelectTheRadioButton(1)
                    .and.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Activate" })
                    .and.iSetValueInControlWithId("APD_::interval-inner", "15", true)
                    .and.onDialog("Activate").iCancel();
                When.onTheMainPage.iPressButtonInTheTableRow(1, "Deactivate");
                Then.onTheMainPage.onTable().iCheckRows({
                    "Business Object Type": "Cost Center",
                    "Description": "Schedule to trigger the periodic cost center data replication from the MDI system.",
                    "Status": "Inactive",
                    "Pattern": "Recurring - 60 minutes",
                    "Next Run": ""
                }, 1);
            });

            opaTest("Cancel the edit of workforce person one time schedule and deactivate it", function (Given, When, Then) {
                When.onTheMainPage.iSelectTheRadioButton(2)
                    .and.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Activate" })
                    .and.iSetValueInControlWithId("APD_::nextRun-inner", "Dec 12, 2020, 2:11:34 PM", true)
                    .and.onDialog("Activate").iCancel();
                When.onTheMainPage.iPressButtonInTheTableRow(2, "Deactivate");
                Then.onTheMainPage.onTable().iCheckRows({
                    "Business Object Type": "Workforce Person",
                    "Description": "Schedule to trigger the initial replication of workforce person data from the MDI system.",
                    "Status": "Inactive",
                    "Pattern": "One-time",
                    "Next Run": ""
                }, 1);
            });

            opaTest("On activation of workforce capability recurring schedule when one-time schedule not activated atleast once, I should see an error", function (Given, When, Then) {
                When.onTheMainPage.iSelectTheRadioButton(5)
                    .and.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Activate" });
                Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty("sap.m.Dialog", { title: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Repeat Interval in Minutes" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Cancel" })
                    .and.iShouldSeeControlWithValue("APD_::interval-inner", "30", true);
                When.onTheMainPage.iSetValueInControlWithId("APD_::interval-inner", "60", true)
                    .and.onDialog("Activate").iConfirm();
                Then.onTheMainPage.iShouldSeeErrorDialog("sap.m.Dialog","The recurring replication schedule can’t be activated. The one-time replication of workforce capability data must be completed first.", {title : ""} );
                When.onTheMainPage.onDialog("Activate").iCancel();
            });

            opaTest("Edit and activate the workforce capability one time schedule", function (Given, When, Then) {
                When.onTheMainPage.iSelectTheRadioButton(4)
                    .and.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Activate" });
                Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty("sap.m.Dialog", { title: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Date and Time" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Cancel" })
                    .and.iShouldSeeControlWithValue("APD_::nextRun-inner", "", true);
                When.onTheMainPage.iSetValueInControlWithId("APD_::nextRun-inner", "May 31, 2035, 8:40:55 PM", true)
                    .and.onDialog("Activate").iConfirm();
                Then.onTheMainPage.onTable().iCheckRows({
                    "Business Object Type": "Workforce Capability",
                    "Description": "Schedule to trigger the initial replication of workforce capability data from the MDI system.",
                    "Status": "Active",
                    "Pattern": "One-time",
                    "Next Run": "May 31, 2035, 8:40:55 PM"
                }, 1);
                Then.onTheMainPage.iShouldSeeCorrectButtonInTheTableRow(4, "Deactivate");
            });

            opaTest("Edit and activate the workforce capability one time schedule with null value", function (Given, When, Then) {
                When.onTheMainPage.iSelectTheRadioButton(4)
                    .and.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Activate" });
                Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty("sap.m.Dialog", { title: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Date and Time" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Activate" })
                    .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "Cancel" })
                    .and.iShouldSeeControlWithValue("APD_::nextRun-inner", "2035-05-31T20:40:55", true);
                When.onTheMainPage.iSetValueInControlWithId("APD_::nextRun-inner", "", true)
                    .and.onDialog("Activate").iConfirm();
                Then.onTheMainPage.iShouldSeeTheElementTypeWithProperty("sap.ui.mdc.Field", { valueState: "Error", valueStateText: "Please enter a time and date." });
                When.onTheMainPage.onDialog("Activate").iCancel();
            });

            opaTest("Cancel the edit of workforce capability one time schedule and deactivate it", function (Given, When, Then) {
                When.onTheMainPage.iSelectTheRadioButton(4)
                    .and.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Activate" })
                    .and.iSetValueInControlWithId("APD_::nextRun-inner", "Dec 12, 2020, 2:11:34 PM", true)
                    .and.onDialog("Activate").iCancel();
                When.onTheMainPage.iPressButtonInTheTableRow(4, "Deactivate");
                Then.onTheMainPage.onTable().iCheckRows({
                    "Business Object Type": "Workforce Capability",
                    "Description": "Schedule to trigger the initial replication of workforce capability data from the MDI system.",
                    "Status": "Inactive",
                    "Pattern": "One-time",
                    "Next Run": ""
                }, 1);
            });

            opaTest("#999: Tear down", function (Given, When, Then) {
                Given.iTearDownMyApp();
            });
        }
    };

    return Journey;
});
