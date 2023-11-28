module.exports = {
  fileUploadForm: {
    formControl: element(by.control({
      id: /fileuploadform$/,
    })),
    fileInput: element(by.css('input[type="file"]')),
    languageInput: element(by.control({
      id: /languageInput$/,
    })),
    uploadButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Upload Skill CSV File' },
    })),
  },
  messageStrip: {
    // Created this function instead of one controller for all message strip types to avoid the error: StaleElementReferenceError: stale element reference: element is not attached to the page document
    getCurrent: () => element(by.control({
      controlType: 'sap.m.MessageStrip',
      id: /uploadMessageStrip/,
    })),
    getCurrentWithoutUploadJob: () => element(by.control({
      controlType: 'sap.m.MessageStrip',
      id: /messageStripWithoutUploadJob$/,
    })),
    moreLink: element(by.control({
      controlType: 'sap.m.Link',
      ancestor: { controlType: 'sap.m.MessageStrip' },
    })),
  },
  uploadJobId: () => element(by.control({
    controlType: 'sap.ui.layout.VerticalLayout',
    id: /messageStripVerticalLayout$/,
  })).getAttribute('data-uploadjobid'),
};
