const elements = {

    appTitle: element(by.control({
        controlType: 'sap.ushell.ui.ShellHeader',
        id: 'shell-header',
    })),

    planningCalendarHeader: element(by.control({ id: /Page--MyPlanningCalendar-Header$/ })),

    planningCalendar: element(by.control({
        controlType: 'sap.m.PlanningCalendar',
        id: 'application-myAssignmentsUi-Display-component---Page--MyPlanningCalendar',
    })),

    appointments0: element(by.id('__appointment0-application-myAssignmentsUi-Display-component---Page--MyPlanningCalendar-0-__row0-application-myAssignmentsUi-Display-component---Page--MyPlanningCalendar-0-0')),
    appointments1: element(by.id('__appointment0-application-myAssignmentsUi-Display-component---Page--MyPlanningCalendar-0-__row0-application-myAssignmentsUi-Display-component---Page--MyPlanningCalendar-0-1')),

    searchField: element(by.control({ controlType: 'sap.m.SearchField' })),

    planningCalendarAppointment: element(by.control({ controlType: 'sap.ui.unified.CalendarAppointment' })),

    shellHeadItem: element(by.control({ id: /backBtn$/ })),

};

const filterElements = {

    prevButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { icon: 'sap-icon://slim-arrow-left' },
    })),

    nextButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { icon: 'sap-icon://slim-arrow-right' },
    })),

    todayButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'Today' },
    })),

    datePickerButton: element(by.control({
        controlType: 'sap.m.Button',
        id: 'application-myAssignmentsUi-Display-component---Page--MyPlanningCalendar-Header-NavToolbar-PickerBtn',
    })),

    dateRangeSelect: (dateValue) => element(
        by.control({
            id: /application-myAssignmentsUi-Display-component---Page--MyPlanningCalendar-Header-Cal--Month0$/,
            interaction: { idSuffix: dateValue },
        }),
    ),

    datePickerNextMonth: element(by.control({
        id: /application-myAssignmentsUi-Display-component---Page--MyPlanningCalendar-Header-Cal--Head$/,
        interaction: { idSuffix: 'next' },
    })),

    datePickerYearBtn: element(by.control({
        id: /application-myAssignmentsUi-Display-component---Page--MyPlanningCalendar-Header-Cal--Head$/,
        interaction: { idSuffix: 'B2' },
    })),

    datePickerMonthBtn: element(by.control({
        id: /application-myAssignmentsUi-Display-component---Page--MyPlanningCalendar-Header-Cal--Head$/,
        interaction: { idSuffix: 'B1' },
    })),

    monthPicker: (monthValue) => element(by.control({
        id: /application-myAssignmentsUi-Display-component---Page--MyPlanningCalendar-Header-Cal--MP$/,
        interaction: { idSuffix: monthValue }, // "m0" - Jan
    })),

    yearPicker: (yearValue) => element(by.control({
        id: /application-myAssignmentsUi-Display-component---Page--MyPlanningCalendar-Header-Cal--YP$/,
        interaction: { idSuffix: yearValue }, // "y20210101" - 2021
    })),

    yearPickerMonthView: (yearValue) => element(by.control({
        id: /application-myAssignmentsUi-Display-component---Page--MyPlanningCalendar-Header-YearCal--YP$/,
        interaction: { idSuffix: yearValue }, // "y20210101" - 2021
    })),

    backButton: element(by.control({
        controlType: 'sap.ushell.ui.shell.ShellHeadItem',
        properties: { icon: 'sap-icon://nav-back' },
    })),

    searchInput: element(by.control({
        controlType: 'sap.m.SearchField',
        interaction: 'focus',
    })),

    searchPress: element(by.control({
        controlType: 'sap.m.SearchField',
        interaction: 'press',
    })),

    weekButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'Week' },
    })),
    monthButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'Months' },
    })),
    editButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'Edit' },
    })),
    saveButton: (enabledProperty) => element(by.control({
        controlType: 'sap.m.Button',
        properties: {
            text: 'Save',
            enabled: enabledProperty,
        },
    })),
    inputBox: (inputValue) => element(by.control({
        controlType: 'sap.m.Input',
        properties: {
            value: inputValue,
        },
    })),
    inputBoxValue: element(by.control({
        controlType: 'sap.m.Input',
        properties: {
            enabled: true,
        },
    })),

};

const popupElements = {

    projectNameLabel: element(by.control({
        controlType: 'sap.m.Label',
        properties: {
            text: 'Project Name',
        },
    })),
    projectNameValue: (project) => element(by.control({
        controlType: 'sap.m.Text',
        properties: {
            text: project,
        },
    })),
    requestNameTitle: (requestName) => element(by.control({
        controlType: 'sap.m.Title',
        properties: {
            text: requestName,
        },
    })),
    customerLabel: element(by.control({
        controlType: 'sap.m.Label',
        properties: {
            text: 'Customer',
        },
    })),
    customerValue: (customer) => element(by.control({
        controlType: 'sap.m.Text',
        properties: {
            text: customer,
        },
    })),
    assignedLabel: element(by.control({
        controlType: 'sap.m.Label',
        properties: {
            text: 'Assigned',
        },
    })),
    assignedValue: (assigned) => element(by.control({
        controlType: 'sap.m.Text',
        properties: {
            text: assigned,
        },
    })),
    durationLabel: element(by.control({
        controlType: 'sap.m.Label',
        properties: {
            text: 'Time Period',
        },
    })),
    durationValue: (duration) => element(by.control({
        controlType: 'sap.m.Text',
        properties: {
            text: duration,
        },
    })),
    viewDetailBtn: element(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'View Details' },
    })),
    requestIdLabel: element(by.control({
        controlType: 'sap.m.Label',
        properties: {
            text: 'Request ID',
        },
    })),
    requestIdValue: (requestId) => element(by.control({
        controlType: 'sap.m.Text',
        properties: {
            text: requestId,
        },
    })),
    assignmentStatusLabel: element(by.control({
        controlType: 'sap.m.Label',
        properties: {
            text: 'Assignment Status',
        },
    })),
    assignmentStatusValue: (assignmentStatus) => element(by.control({
        controlType: 'sap.m.Text',
        properties: {
            text: assignmentStatus,
        },
    })),
    workItemLabel: element(by.control({
        controlType: 'sap.m.Label',
        properties: {
            text: 'Work Item',
        },
    })),
    workItemValue: (workItem) => element(by.control({
        controlType: 'sap.m.Text',
        properties: {
            text: workItem,
        },
    })),

};

const actions = {

    getAppTitle(title) {
        const appTitle = elements.appTitle.element(by.control({
            controlType: 'sap.ushell.ui.shell.ShellAppTitle',
            properties: { text: title },
        }));
        return appTitle;
    },

    getSubPageTitle(title) {
        const subTitle = elements.appTitle.element(by.control({
            properties: { text: title },
        }));
        return subTitle;
    },

    getHeaderTitleAndColor(title, color) {
        const headerTitle = element(by.control({
            controlType: 'sap.ui.unified.CalendarAppointment',
            properties: {
                title,
                color,
            },
        }));

        return headerTitle;
    },

    getAppointmentDetail(title, assignedHr) {
        const aTitle = element(by.control({
            controlType: 'sap.ui.unified.CalendarAppointment',
            properties: {
                title,
                text: assignedHr,
            },
        }));
        return aTitle;
    },

    getAppointmentDetailAndColor(title, assignedHr, color) {
        const aTitle = element(by.control({
            controlType: 'sap.ui.unified.CalendarAppointment',
            properties: {
                title,
                text: assignedHr,
                color,
            },
        }));
        return aTitle;
    },

    selectDayAppointment: (title) => element(by.control({
        controlType: 'sap.ui.unified.CalendarAppointment',
        properties: { title },
    })),

    async navigatetoSpecificDate(dateInput) {
        let month;

        const inputYear = dateInput.substring(0, 4);
        const inputMonth = dateInput.substring(4, 6);
        if (inputMonth.substring(0, 1) === 0) {
            month = inputMonth.substring(1, 2);
        } else {
            month = inputMonth;
        }
        month -= 1;

        const yearInput = `y${inputYear}0101`;
        const monthInput = `m${month}`;
        await filterElements.datePickerButton.click();

        // select the year first
        await filterElements.datePickerYearBtn.click();
        await filterElements.yearPicker(yearInput).click();

        // select the month
        await filterElements.datePickerMonthBtn.click();
        await filterElements.monthPicker(monthInput).click();
    },

    async navigatetoSpecificYear(dateInput) {
        const inputYear = dateInput.substring(0, 4);
        const yearInput = `y${inputYear}0101`;
        await filterElements.datePickerButton.click();
        await filterElements.yearPickerMonthView(yearInput).click();
    },
    selectDayAppointmentWithAssigned: (title, assignedHr) => element(by.control({
        controlType: 'sap.ui.unified.CalendarAppointment',
        properties: {
            title,
            text: assignedHr,
        },
    })),

};

module.exports = {
    elements,
    actions,
    filterElements,
    popupElements,
};
