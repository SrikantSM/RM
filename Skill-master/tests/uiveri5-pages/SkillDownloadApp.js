module.exports = {
  fileDownloadForm: {
    formControl: element(by.control({
      id: /filedownloadform$/,
    })),
    languageInput: element(by.control({
      id: /languageInput$/,
    })),
    downloadButton: element(by.control({
      id: 'application-Skill-Download-component---app--downloadButton',
    })),
  },
  messageStrip: {
    getCurrent: () => element(by.control({
      controlType: 'sap.m.MessageStrip',
    })),
  },
};
