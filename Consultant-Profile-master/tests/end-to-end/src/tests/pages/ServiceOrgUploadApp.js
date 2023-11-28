const fileUploadForm = {
    formControl: element(by.control({
        id: /fileuploadform$/,
    })),
    // TODO: Match by the ID
    // application-businessServiceOrgUi-upload-component---app--fileuploadform (sap.ui.layout.form.SimpleForm)
    fileInput: /* element(by.control({ id: /ACTUAL-ID/ })) */
        element(by.css('input[type="file"]')),
    uploadButton: element(by.control({
        // TODO: Match by the ID
        // id: /ACTUAL-ID/
        controlType: 'sap.m.Button',
        properties: { text: 'Upload Service Organization CSV File' },
    })),
};

const messageStrip = {
    control: element(by.control({
        controlType: 'sap.m.MessageStrip',
    })),
    downloadText: element(by.control({
        controlType: 'sap.m.MessageStrip',
        properties: { text: "Don't have a file yet? Create one using the following template." },
    })),
    uploadText: element(by.control({
        controlType: 'sap.m.MessageStrip',
        properties: { type: 'Success' },
    })),
    uploadTextW: element(by.control({
        controlType: 'sap.m.MessageStrip',
        properties: { type: 'Warning' },
    })),
    downloadTemplate: element(by.control({
        controlType: 'sap.m.Link',
        properties: { text: 'Template' },
    })),
    moreLink: element(by.control({
        controlType: 'sap.m.Link',
        properties: { text: 'More Information' },
    })),
};

const dialog = {

    closeButton: element(by.control({
        controlType: 'sap.m.Dialog',
    })).all(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'Close' },
    })),

    message: element(by.control({
        controlType: 'sap.m.Dialog',
    })).element(by.control({
        controlType: 'sap.m.Text',
    })),
};

module.exports = {
    fileUploadForm,
    messageStrip,
    dialog,
};
