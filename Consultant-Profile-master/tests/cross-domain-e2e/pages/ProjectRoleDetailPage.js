var CommonPageElements = require("./CommonPageElements.js");
var roleHeader = {

        title: element(
            by.control({
                controlType: "sap.uxap.ObjectPageDynamicHeaderTitle",
              })).element(
                by.control({
                    controlType: "sap.m.Title",
                  })
              ),
        objectPageSection: element(
            by.control({
                controlType: "sap.uxap.ObjectPageSubSection",
            }
        )
        )
}
var roleData = {
elements: {
    nameLabel: roleHeader.objectPageSection.element(
        by.control({
          controlType: "sap.m.Label",
          properties: {
            text: "Name"
          }})),
    codeLabel: roleHeader.objectPageSection.element(
        by.control({
          controlType: "sap.m.Label",
          properties: {
            text: "Code"
          }})),
    descriptionLabel: roleHeader.objectPageSection.element(
        by.control({
          controlType: "sap.m.Label",
          properties: {
            text: "Description"
          }}))
}
}

var actions = {
    getName: function(roleName) {
        var name = roleHeader.objectPageSection.element(
            by.control({
              controlType: "sap.ui.mdc.Field",
              properties: {
                value: roleName
              }}));
          return name;  
    },

    //EditScenario
      editValue: function(oldValue,newValue){
      this.clearText(oldValue);
      var nameField =  roleHeader.objectPageSection.element(
        by.control({
          controlType: "sap.ui.mdc.Field",
          properties: {
            value: ""
          }}));
          nameField.sendKeys(newValue);

    },
    deleteRole : async function() {
      await CommonPageElements.objectPage.elements.deleteButton.click();
      var deleteButtonInDialog = element(by.control({
        controlType: "sap.m.Dialog",
        properties : {
            icon: "sap-icon://message-warning"
        }}));

      var deleteBtn = deleteButtonInDialog.element(by.control({
        controlType: "sap.m.Button",
        properties: {
            text: "Delete"
        }}));

    await deleteBtn.click();
    },

    getCode: function(roleCode) {
        var code = roleHeader.objectPageSection.element(
            by.control({
              controlType: "sap.ui.mdc.Field",
              properties: {
                value: roleCode
              }}));
          return code;  
    },
    getDescription: function(roleDescription) {
        var description = roleHeader.objectPageSection.element(
            by.control({
              controlType: "sap.ui.mdc.Field",
              properties: {
                value: roleDescription
              }}));
          return description;  
    },
    getAllInputFields: function() {
      var inputFields = roleHeader.objectPageSection.all(
        by.control({
          controlType: "sap.ui.mdc.Field"}))
          return inputFields;
    },
    clearText: function(oldValue){
      var field =  roleHeader.objectPageSection.element(
        by.control({
          controlType: "sap.ui.mdc.Field",
          properties: {
            value: oldValue
          }}));
          field.clear();

    }
}

module.exports = {
    roleData: roleData,
    roleHeader: roleHeader,
    actions: actions
  };