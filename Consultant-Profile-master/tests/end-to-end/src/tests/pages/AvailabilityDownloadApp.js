const fileDownloadForm = {

    formControl: element(by.control({
        id: /filedownloadform$/,
    // id: "application-availabilityUpload-Download-component---app--filedownloadform"
    })),

    costCenterInput: element(by.control({
        id: /app--costCenterInput$/,
        interaction: { idSuffix: 'inner' },
    })),
    costCenterSelectedInput: element(by.control({ id: /app--costCenterInput$/, interaction: { idSuffix: 'inner' } })),
    workforceIDInput: element(by.control({
        id: 'application-availabilityUpload-Download-component---app--workforceIDInput',
    })),
    plannedWorkingHoursInput: element(by.control({
        id: 'application-availabilityUpload-Download-component---app--plannedWorkingHoursInput',
    })),
    plannedNonWorkingHoursInput: element(by.control({
        id: 'application-availabilityUpload-Download-component---app--plannedNonWorkingHoursInput',
    })),
    rbCostCenter: element(by.control({
        id: 'application-availabilityUpload-Download-component---app--rbCostCenter',
    })),
    rbWorkforceID: element(by.control({
        id: 'application-availabilityUpload-Download-component---app--rbWorkforceID',
    })),
    datePickIcon: element(by.control({
        id: 'application-availabilityUpload-Download-component---app--datePick-icon',
    })),
    costCenterValueHelp: element(by.control({
        id: 'application-availabilityUpload-Download-component---app--costCenterInput-vhi',
    })),
    costCenterValueHelpList(costCenter) {
        const costCenterValueHelp = element(by.control({
            controlType: 'sap.m.StandardListItem',
            properties: {
                title: costCenter,
            },
        }));
        return costCenterValueHelp;
    },

    workForceValueHelp: element(by.control({
        id: 'application-availabilityUpload-Download-component---app--workforceIDInput-vhi',
    })),
    workForceValueHelpList(workForce) {
        const workForceValueHelp = element(by.control({
            controlType: 'sap.m.StandardListItem',
            properties: {
                title: workForce,
            },
        }));
        return workForceValueHelp;
    },

    currentYear: element(by.control({ id: /app--datePick-cal--Head$/, interaction: { idSuffix: 'B2' } })),
    getYear: (year) => element(by.id(`application-availabilityUpload-Download-component---app--datePick-cal--YP-y${year}0101`)),
    date: (dateValue) => element(by.control({ id: /app--datePick-cal--Month0$/, interaction: { idSuffix: dateValue } })),
    datePickOkButton: element(by.control({ id: /app--datePick-RP-footer$/ })).element(by.control({ controlType: 'sap.m.Button', properties: [{ text: 'OK' }] })),
    dateRangeInput: element(
        by.control({
            id: /app--datePick$/,
            interaction: { idSuffix: 'inner' },
        }),
    ),
    downloadButton: element(by.control({
        id: 'application-availabilityUpload-Download-component---app--downloadButton',
    })),
    costCenterList: element(by.control({
        controlType: 'sap.m.StandardListItem',
        ancestor: {
            id: 'application-availabilityUpload-Download-component---app--costCenterInput-popup-list',
        },
    })),
    workforceList: element(by.control({
        controlType: 'sap.m.StandardListItem',
        ancestor: {
            id: 'application-availabilityUpload-Download-component---app--workforceIDInput-popup-list',
        },
    })),
};

const actions = {
    getLabel(label) {
        const labelName = fileDownloadForm.formControl.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: label,
                },
            }),
        );
        return labelName;
    },
    getInput(value) {
        const inputValue = fileDownloadForm.formControl.element(
            by.control({
                controlType: 'sap.m.Input',
                properties: {
                    value,
                },
            }),
        );
        return inputValue;
    },
};

const messageStrip = {
    control: element(by.control({
    // TODO: Match by the ID
    // id: /ACTUAL-ID/
        controlType: 'sap.m.MessageStrip',
    })),
};

module.exports = {
    fileDownloadForm,
    messageStrip,
    actions,
};
