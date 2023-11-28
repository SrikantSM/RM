const elements = {

    appTitle: element(by.control({
        controlType: 'sap.ushell.ui.ShellHeader',
        id: 'shell-header',
    })),

    editButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'Edit' },
    })),
    headerValue: (title) => element(by.control({
        controlType: 'sap.ui.unified.CalendarAppointment',
        properties: { title: title },
    })),
    weekButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'Week' },
    })),
    monthButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'Months' },
    }))
};

const actions = {

    getAppTitle(title) {
        const appTitle = elements.appTitle.element(by.control({
            controlType: 'sap.ushell.ui.shell.ShellAppTitle',
            properties: { text: title },
        }));
        return appTitle;
    },

    selectDayAppointmentWithAssigned: (title, assignedHr) => element(by.control({
        controlType: 'sap.ui.unified.CalendarAppointment',
        properties: {
            title,
            text: assignedHr,
        },
    }))
};

const editDialogElements = {

    dialogLabel: (title) => element(by.control({
        controlType: 'sap.m.Dialog',
        properties: {
            title: title,
        },
    })),
    requestedTimePeriodLabel: element(by.control({
        controlType: 'sap.m.Label',
        properties: {
            text: 'Requested Time Period',
        },
    })),
    backButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: {
            icon: 'sap-icon://nav-back',
        },
    })),
    nextButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: {
            icon: 'sap-icon://feeder-arrow',
        },
    })),
    monthColumnLabel: element(by.control({
        controlType: 'sap.m.Text',
        properties: {
            text: 'Month',
        },
    })),
    weeklyEffortLabel: element(by.control({
        controlType: 'sap.m.Text',
        properties: {
            text: 'Week / Effort',
        },
    })),
    requiredEffortLabel: element(by.control({
        controlType: 'sap.m.ObjectAttribute',
        properties: {
            title: 'Assigned Effort',
        },
    })),
    hoursUnitLabel: element(by.control({
        controlType: 'sap.m.ObjectNumber',
        properties: {
            unit: 'hours',
        },
    })),
    saveButton: (enabled) => element(by.control({
        controlType: 'sap.m.Button',
        properties: {
            text: 'Save',
            enabled: enabled,
        },
    })),
    cancelButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: {
            text: 'Cancel',
        },
    })),
    reqTimePeriodValue: (duration) => element(by.control({
        controlType: 'sap.m.Text',
        properties: {
            text: duration,
        },
    })),
    inputBoxValue: (value) => element(by.control({
        controlType: 'sap.m.Input',
        properties: {
            value: value,
        },
    })),
    errorInputBoxValue: (value, valueState, valueStateText) => element(by.control({
        controlType: 'sap.m.Input',
        properties: {
            value: value,
            valueState: valueState,
            valueStateText: valueStateText,
        },
    })),
    totalEffortsValue: (value) => element(by.control({
        controlType: 'sap.m.ObjectNumber',
        properties: {
            number: value,
        },
    })),
    infoDialogText: element(by.control({
        controlType: 'sap.m.Text',
        properties: {
            text: 'There are no changes to save.',
        },
    })),
    okButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: {
            text: 'OK',
        },
    })),
};

module.exports = {
    actions,
    elements,
    editDialogElements,
};