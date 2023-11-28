var CommonPageElements = require("./CommonPageElements.js");

var listReport = {
  elements: {
    titleString: "Project Roles",
    tableRows: CommonPageElements.listReport.elements.tableRows,
    header: CommonPageElements.listReport.elements.header
  }
}

var elements = {
  listReportTable: element(by.control({
    controlType: "sap.m.Table",
    id: "projectRoleUi::ProjectRoleListReport--fe::table::Roles::LineItem-innerTable",
    interaction: "focus"
  })),
  listReportTableRows: element(by.control({
    controlType: "sap.ui.mdc.Table",
    id: "projectRoleUi::ProjectRoleListReport--fe::table::Roles::LineItem"
  })).all(by.control({controlType: "sap.m.ColumnListItem"})),
  deleteConfirmButton: element(by.control({
    controlType: 'sap.m.Button',
    properties: { text: 'Delete' },
    ancestor: { controlType: 'sap.m.Dialog' }
  })),
  filterBar: element(by.control({
    controlType: "sap.ui.mdc.FilterBar"
  }))
}


var filterElemenents = {

  expandButton: element(by.control({
    controlType: "sap.m.Button",
    properties: { icon: "sap-icon://slim-arrow-down" }
  })),

  editStatus: elements.filterBar.element(
    by.control({
      controlType: "sap.ui.mdc.FilterField",
      id: "projectRoleUi::ProjectRoleListReport--fe::FilterBar::Roles::FilterField::DraftEditingStatus"
    })),

  name: elements.filterBar.element(
    by.control({
      controlType: "sap.ui.mdc.FilterField",
      properties: {
        label: "Name"
      }
    })),

  roleCode: elements.filterBar.element(
    by.control({
      controlType: "sap.ui.mdc.FilterField",
      properties: {
        label: "Code"
      }
    })),

  roleCodeValueHelp: elements.filterBar.element(
    by.control({
      controlType: "sap.ui.mdc.FilterField",
      properties: {
        label: "Code"
      }
    })).element(by.control({
      controlType: "sap.ui.core.Icon",
      properties: {
        src: "sap-icon://value-help"
      }
    })),

  roleCodeValueHelpOkbutton: element(by.id("projectRoleUi::ProjectRoleListReport--fe::FilterBar::Roles::FilterFieldValueHelp::code-ok")),

  goButton: elements.filterBar.element(
    by.id("projectRoleUi::ProjectRoleListReport--fe::FilterBar::Roles-btnSearch"))
}

var actions = {

  navigateToRole: async function (code) {
    var rowToBeClicked = await this.getIndex(code, undefined);
    await elements.listReportTableRows.get(rowToBeClicked).click();
  },
  navigateToRoleWithDescription: async function (description) {
    var rowToBeClicked = this.getIndex(undefined, description);
    await elements.listReportTableRows.get(rowToBeClicked).click();
  },
  isRecordPresent: async function(code){
	  var index = await this.getIndex(code, undefined);
	  if(index === -1)
		  {
		  	return false;
		  }else{
			return true;
		  }
  },
  getIndex: async function (code, description) {
  var tableRows = elements.listReportTableRows;
  var cnt = await tableRows.count();
    var index = -1;
    for (var i = 0; i < cnt; i++) {

      var row = tableRows.get(i).all(
        by.control({
          controlType: "sap.m.Text",
        })
      );
      if (code === undefined) {
        var roleDescription = await row.get(1).getText();
        if (description == await roleDescription) {
          index = i;
          break;
        }
      }
      else {
        var roleCode = row.get(0).getText();
        if (code == await roleCode) {
          index = i;
          break;
        }
      }
    }
    return index;
  },

  clickOnCreateButton: async function () {
    var createId = "projectRoleUi::ProjectRoleListReport--fe::table::Roles::LineItem::StandardAction::Create";
    var createButton = element(by.id(createId));
    await createButton.click();
  },

  clickOnExpandButton: async function () {
    var expandButton = element.all(by.control({
	controlType: "sap.m.Button",
	properties:{icon:"sap-icon://slim-arrow-down"},
	ancestor: {
		controlType: "sap.f.DynamicPageTitle"
	}
	})).last();
    await expandButton.click();
  },
  deleteMultipleRows: async function () {
    var deleteId = "projectRoleUi::ProjectRoleListReport--fe::table::Roles::LineItem::Delete";
    var tableRows = listReport.elements.tableRows;
    var selectAll = element(by.id('projectRoleUi::ProjectRoleListReport--fe::table::Roles::LineItem-innerTable-sa'));
    await selectAll.click();
    var deleteBtn = element(by.id(deleteId));
    await deleteBtn.click();

    var deleteButtonInDialog = element(by.control({
      controlType: "sap.m.Dialog",
      properties: {
        icon: "sap-icon://message-warning"
      }
    }));

    var deleteBtn = deleteButtonInDialog.element(by.control({
      controlType: "sap.m.Button",
      properties: {
        text: "Delete"
      }
    }));

    await deleteBtn.click();
  },
  getRecordState: async function (description) {
    var tableRows = listReport.elements.tableRows;
    var rowToBeClicked = this.getIndex(undefined, description);
    var state = await tableRows.get(rowToBeClicked).element(
      by.control({
        controlType: "sap.m.ObjectMarker",
      })
    ).getText();
    return state;
  },
  isDraftRecord: async function (description) {
    var tableRows = listReport.elements.tableRows;
    var rowToBeClicked = this.getIndex(undefined, description);
    return (tableRows.get(rowToBeClicked).element(
      by.control({
        controlType: "sap.m.ObjectMarker",
      })
    )).isPresent();
  },
  getRecordStateWithCode: async function (code) {
    var tableRows = listReport.elements.tableRows;
    var rowToBeClicked = this.getIndex(code,undefined);
    var state = await tableRows.get(rowToBeClicked).element(
      by.control({
        controlType: "sap.m.ObjectMarker",
      })
    ).getText();
    return state;
  },
  getRoleLifecycleStatus: async function (code, roleLifecycleStatus) {
    var tableRows = listReport.elements.tableRows;
    var rowToBeChecked = this.getIndex(code, undefined);
    var status = await tableRows.get(rowToBeChecked).element(
      by.control({
                  controlType: "sap.m.ObjectStatus",
                  properties: {
                    text: roleLifecycleStatus
                  }
                })
    ).isPresent();   
    return status;
  },
  setEditStatusFilter: async function (value) {
    await filterElemenents.editStatus.click();
    await filterElemenents.editStatus.sendKeys(value);
    await filterElemenents.editStatus.sendKeys(protractor.Key.ENTER);
  },
  selectCodeFromValueHelp: async function (code) {
    var valueHelpTableID = "projectRoleUi::ProjectRoleListReport--fe::FilterBar::Roles::FilterFieldValueHelp::code::Table";
    var valueHelpOkButtonID = "projectRoleUi::ProjectRoleListReport--fe::FilterBar::Roles::FilterFieldValueHelp::code-ok";
    var valueHelpTable = element(by.id(valueHelpTableID));
    var valueHelpTableRows = valueHelpTable.all(by.control({
      controlType: "sap.m.ColumnListItem"
    }));
    var noOfRows = await valueHelpTableRows.count();
    var elementToBeClicked;
    for (var i = 0; i < noOfRows; i++) {
      var row = valueHelpTableRows.get(i).element(by.control({
        controlType: "sap.m.Text"
      }));
      var value = row.getText();
      if (code == await value) {
        elementToBeClickedSub = i;
        break;
      }
    }
    await valueHelpTableRows.get(i).element(by.control({
      controlType: "sap.m.CheckBox"
    })).click();
  }
};

module.exports = {
  elements: elements,
  listReport: listReport,
  actions: actions,
  filterElemenents: filterElemenents
};