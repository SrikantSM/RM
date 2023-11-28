var CommonPageElements = require('./CommonPageElements.js');

var listReportTable = element(by.control({
  controlType: 'sap.m.Table',
  id: 'myProjectExperienceUi::MyProjectExperienceListReport--fe::table::MyProjectExperienceHeader::LineItem-innerTable',
  interaction: 'focus'
}));

var listReport = {
  elements: {
    titleString: 'Consultant List',
    tableRows: CommonPageElements.listReport.elements.tableRows,
    header: CommonPageElements.listReport.elements.header
  }
};

var searchField = element(by.control({
  controlType: 'sap.ui.mdc.FilterField',
  id : 'myProjectExperienceUi::MyProjectExperienceListReport--fe::fb::MyProjectExperienceHeader::FF::profile::emailAddress'
}));


var actions = {

  navigateToConsultant: async function(email) {

    var tableRows = listReport.elements.tableRows;
    var cnt = await tableRows.count();
    var rowToBeClicked;

    for (var i = 0; i < cnt ; i++) {

      var row = tableRows.get(i).all(
        by.control({
          controlType: 'sap.ui.mdc.Field',
        })
      );
      var consultantEmail = row.get(2).getText();

      if(email == await consultantEmail) {
        rowToBeClicked = i;
        break;
      }
    }

    rowToBeClicked = 0;

    tableRows.get(rowToBeClicked).click();
  },

  logout: async function() {
    var logoutButton = element(by.control({
        controlType: 'sap.ushell.ui.shell.ShellHeadItem',
        properties: {
          icon : 'sap-icon://person-placeholder'
        }}));

    logoutButton.click();

    var signOutListItem = element(by.control({
      controlType: 'sap.m.StandardListItem',
      properties: {
        title: 'Sign Out'
      }}));

    signOutListItem.click();

    var okButton = element(by.control({
      controlType: 'sap.m.Button',
      properties: {
        text: 'OK'
      }}));

      okButton.click()
  },

  navigate: async function(name) {
    var searchField = await element(by.control({
      controlType: 'sap.ui.mdc.FilterField',
      id : 'myProjectExperienceUi::MyProjectExperienceListReport--fe::fb::MyProjectExperienceHeader::FF::profile::emailAddress'
    }))
   
    await searchField.sendKeys(name);

    var goButton = await element(by.id(
      'myProjectExperienceUi::MyProjectExperienceListReport--fe::fb::MyProjectExperienceHeader-btnSearch'
    ));

    await goButton.click();

  }
};

module.exports = {
  listReportTable: listReportTable,
  listReport: listReport,
  searchField: searchField,
  actions: actions
};
