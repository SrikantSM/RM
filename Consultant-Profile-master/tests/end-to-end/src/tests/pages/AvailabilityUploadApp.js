const fileUploadForm = {
    formControl: element(by.control({
        id: /fileuploadform$/,
    })),
    // TODO: Match by the ID
    fileInput: /* element(by.control({ id: /ACTUAL-ID/ })) */
        element(by.css('input[type="file"]')),

    costCenterInput: element(by.control({
        id: /app--costCenterInput$/,
        interaction: { idSuffix: 'inner' },
    })),

    uploadButton: element(by.control({
        // TODO: Match by the ID
        // id: /ACTUAL-ID/
        controlType: 'sap.m.Button',
        properties: { text: 'Upload Availability Data CSV File' },
    })),

    costCenterList: element(by.control({
        controlType: 'sap.m.StandardListItem',
        ancestor: {
            id: 'application-availabilityUpload-Upload-component---app--costCenterInput-popup-list',
        },
    })),
    costCenterDropDown: element(by.control({
        controlType: 'sap.ui.core.Icon',
        ancestor: {
            id: 'application-availabilityUpload-Upload-component---app--costCenterInput',
        },
    })),
};

const actions = {
    getLabel(label) {
        const labelName = fileUploadForm.formControl.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: label,
                },
            }),
        );
        return labelName;
    },
};

const messageStrip = {
    control: element(by.control({
        controlType: 'sap.m.MessageStrip',
    })),
    moreLink: element(by.control({
        controlType: 'sap.m.Link',
        ancestor: {
            controlType: 'sap.m.MessageStrip',
        },
    })),
};

module.exports = {
    fileUploadForm,
    messageStrip,
    actions,
};
