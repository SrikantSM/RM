module.exports = {
  tiles: {
    skill: element(
      by.control({
        controlType: 'sap.m.GenericTile',
        properties: { header: 'Manage Skills' },
      }),
    ),
    catalog: element(
      by.control({
        controlType: 'sap.m.GenericTile',
        properties: { header: 'Manage Skill Catalogs' },
      }),
    ),
    proficiency: element(
      by.control({
        controlType: 'sap.m.GenericTile',
        properties: { header: 'Manage Proficiency Sets' },
      }),
    ),
  },
  waitForInitialAppLoad: (elementId) => browser.driver.wait(
    () => browser.driver.findElements(by.id(elementId)).then((elements) => !!elements.length),
    browser.getPageTimeout, 'Waiting for app load to finish',
  ),
  header: {
    xrayButton: element(by.control({
      controlType: 'sap.ushell.ui.shell.ShellHeadItem',
      properties: { icon: 'sap-icon://sys-help' },
    })),
    backButton: element(
      by.control({
        id: 'backBtn',
      }),
    ),
    // Home Button is, seemingly, no separate UI5 control, but lives with a special DOM ID within the UI5 control shell-header
    homeButton: element(by.control({
      id: 'shell-header',
    })).element(by.id('shell-header-logo')),
  },
  errorDialog: {
    dialogControl: element(by.control({
      controlType: 'sap.m.Dialog',
      properties: { title: 'Error' },
    })),
    appCouldNotBeOpenedErrorText: element(by.control({
      controlType: 'sap.m.Text',
      properties: { text: 'App could not be opened either due to an incorrect SAP Fiori launchpad configuration or a missing role assignment.' },
      ancestor: { controlType: 'sap.m.Dialog' },
    })),
    closeButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Close' },
      ancestor: { controlType: 'sap.m.Dialog' },
    })),
  },
};
