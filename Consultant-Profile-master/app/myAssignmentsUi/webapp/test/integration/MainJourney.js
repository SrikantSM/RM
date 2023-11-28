sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/ui/test/opaQunit',
    './pages/AssignmentPage'
], function (Opa5, opaTest) {
    'use strict';

    QUnit.module('My Assignments');

    opaTest("On opening the app, I should see correct app title My Assignments", function(Given, When, Then) {

        var sPath = sap.ui.require.toUrl('myAssignmentsUi/app');
        Given.iStartMyAppInAFrame(sPath + '.html?serverDelay=0&responderOn=true&demoApp=myAssignmentsUi&sap-ui-language=en_US#myAssignmentsUi-Display');
        When.onTheAssignmentPage.iLookAtTheScreen();
        Then.onTheAssignmentPage.iShouldSeeTheElementTypeWithProperty("sap.ushell.ui.shell.ShellAppTitle", { text: "My Assignments" });


    });

    opaTest("On Assignment page, I should see planning calender control with correct properties", function(Given, When, Then) {

        Then.onTheAssignmentPage.iShouldSeeTheElementTypeWithProperty("sap.m.Title", { text: "My Assignments" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { icon: "sap-icon://legend" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.PlanningCalendar", { viewKey: "MyMonth" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.SearchField", { value: "" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.SegmentedButton", { selectedKey: "MyMonth" });

    });

    opaTest("On Assignment page, Click legend and I should see the planning calender legend and it's items", function(Given, When, Then) {

        When.onTheAssignmentPage.iClickOnTheElementTypeWithProperty("sap.m.Button", { icon: "sap-icon://legend" });

        Then.onTheAssignmentPage.iShouldSeeTheElementTypeWithProperty("sap.m.PlanningCalendarLegend", { appointmentItemsHeader: "Assignment Status" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.ui.unified.CalendarLegendItem", { text: "Today" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.ui.unified.CalendarLegendItem", { text: "Selected" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.ui.unified.CalendarLegendItem", { text: "Non-Working Day" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.ui.unified.CalendarLegendItem", { text: "Utilization is good (80 - 110%)", color: "#3fa45b" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.ui.unified.CalendarLegendItem", { text: "Utilization is low (70 - 79%) or high (111 - 120%)", color: "#f5b04d" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.ui.unified.CalendarLegendItem", { text: "Utilization is very low (<70%) or very high (>120%)", color: "#dc0d0e" });

        Then.onTheAssignmentPage.iShouldSeeTheElementTypeWithProperty("sap.m.PlanningCalendarLegend", { appointmentItemsHeader: "Assignment Status" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.ui.unified.CalendarLegendItem", { text: "Hard-Booked", color: "#1093a2" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.ui.unified.CalendarLegendItem", { text: "Soft-Booked", color: "#ffffff" });

        When.onTheAssignmentPage.iClickOnTheElementTypeWithProperty("sap.m.Button", { icon: "sap-icon://legend" });
    });

    opaTest("On Assignment page, I should see navigation buttons", function(Given, When, Then) {

        Then.onTheAssignmentPage.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { icon: "sap-icon://slim-arrow-left" })
            .and.iShouldSeeTheDisableButton("sap.m.Button", { text: "Today" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { icon: "sap-icon://slim-arrow-right" })
            .and.iShouldSeeTheButtonWithId("sap.m.Button", "application-myAssignmentsUi-Display-component---Page--MyPlanningCalendar-Header-NavToolbar-PickerBtn");


    });

    opaTest("On Assignment page, I should planning calender row with correct properties", function(Given, When, Then) {

        When.onTheAssignmentPage.iClickOnTheElementTypeWithProperty("sap.m.Button", { text: "Week" });
        Then.onTheAssignmentPage.iShouldSeeTheElementTypeWithProperty("sap.ui.unified.CalendarAppointment", { title: "Assigned / Available: 5 / 8 hr", color: "#dc0d0e" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.ui.unified.CalendarAppointment", { title: "Assigned / Available: 6 / 8 hr", color: "#f5b04d" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.ui.unified.CalendarAppointment", { title: "Design", text: "2 hr" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.ui.unified.CalendarAppointment", { title: "Concept and Design", text: "3 hr" });

    });

    opaTest("On Assignment page, click of appointment, I should see a popover with correct title, field labels", function(Given, When, Then) {
        When.onTheAssignmentPage.iClickOnTheElementTypeWithProperty("sap.ui.unified.CalendarAppointment", { title: "Concept and Design", text: "3 hr" });

        Then.onTheAssignmentPage.iShouldSeeTheElementTypeWithProperty("sap.m.Popover", { title: "Assignment" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Request ID" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Work Item" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Project Name" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Customer" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Assigned" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Time Period" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Label", { text: "Assignment Status" })
            .and.iShouldSeeTheElementTypeWithProperty("sap.m.Button", { text: "View Details" });

        When.onTheAssignmentPage.iClickOnTheElementTypeWithProperty("sap.ui.unified.CalendarAppointment", { title: "Concept and Design", text: "3 hr" });

    });

    opaTest("On click of date range picker, I should see date range with correct minimum and maximum year", function(Given, When, Then) {
        When.onTheAssignmentPage.iClickOnTheElementTypeWithId("sap.m.Button", "application-myAssignmentsUi-Display-component---Page--MyPlanningCalendar-Header-NavToolbar-PickerBtn");
        var d = new Date();
        var currentYear = d.getFullYear().toString();
        Then.onTheAssignmentPage.iShouldSeeTheElementTypeWithProperty("sap.ui.unified.calendar.Header",
            {   textButton2: currentYear,
                enabledPrevious: true,
                enabledNext: true });


    });


    opaTest('Teardown', function (Given, When, Then) {
        When.iTeardownMyAppFrame();
        Then.waitFor({
            success: function () {
                Opa5.assert.ok(true, "teardown successful");
            }
        });
    });

});
