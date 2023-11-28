sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Core",
  "sap/m/Dialog",
  "sap/m/DialogType",
  "sap/m/Label", "sap/m/Input", "sap/m/Button", "sap/m/ButtonType"
], function (Controller, Core, Dialog, DialogType, Label, Input, Button, ButtonType) {
  "use strict";

  return Controller.extend("skill-proficiency.ext.controller.ProficiencyLevelsTable", {

    maxLevelCount: 50, // Must be in sync with the backend implementation
    Constants: {
      idForDefaultLanguage: "defaultLanguage",
      idForNameField: "nameOfProficiencyLevel",
      idForDescriptionField: "descriptionOfProficiencyLevel"
    },

    onUpdateFinished: function(oEvent) {
      this.onSelectionChange();
      this.setCreateButtonEnabled(oEvent);
    },

    onDrop: function (oEvent) {
      var oDraggedItem = oEvent.getParameter("draggedControl");
      var oDroppedOntoItem = oEvent.getParameter("droppedControl");

      var sDraggedLevelId = oDraggedItem.getBindingContext().getProperty("ID");
      var sDroppedLevelId = oDroppedOntoItem.getBindingContext().getProperty("ID");

      var sDropPosition = oEvent.getParameter("dropPosition");

      var oListBinding = oDraggedItem.getBindingContext().getBinding();
      oListBinding.requestContexts().then(function (aContexts) {
        this.reorderContexts(aContexts, sDraggedLevelId, sDroppedLevelId, sDropPosition);
        oListBinding.getContext().requestSideEffects([{ $NavigationPropertyPath: "proficiencyLevels" }]);
      }.bind(this));
    },

    reorderContexts: function(aContexts, sDraggedLevelId, sDroppedLevelId, sDropPosition) {
      if (sDraggedLevelId === sDroppedLevelId) {
        return;
      }
      var aLevelIds = aContexts.map(function(oContext) {
        return oContext.getProperty("ID");
      });
      var iIndexOfDragTarget = aLevelIds.indexOf(sDraggedLevelId);
      var oDragItemContext = aContexts.splice(iIndexOfDragTarget, 1)[0];
      aLevelIds.splice(iIndexOfDragTarget, 1); //remove Id also from levels

      var iIndexOfDropTarget = aLevelIds.indexOf(sDroppedLevelId);
      var iTargetIndex = sDropPosition === "Before" ? iIndexOfDropTarget : iIndexOfDropTarget + 1;
      aContexts.splice(iTargetIndex, 0, oDragItemContext);

      aContexts.forEach(function(oContext, index) {
        if (oContext.getProperty("rank") !== aContexts.length - index){
          oContext.setProperty("rank", aContexts.length - index); //start at rank 1
        }
      });
    },

    onCreateProficiencyLevel: function(oEvent) {
      // Create binding to get the default language code.
      var oProperty = this.oView.getModel().bindProperty("/DefaultLanguage/language_code");

      // Create Dialog if not already present.
      if (!this.proficiencyCreateDialog) {
        // Request language code from backend.
        oProperty.requestValue()
          .then(function(defaultLanguage) {
            // Set the value in input field.
            Core.byId(this.Constants.idForDefaultLanguage).setValue(defaultLanguage);
          }.bind(this));

        // Fetch the i18n model for labels
        var i18nModel = this.getView().getModel("i18n");

        // Create the dialog.
        this.proficiencyCreateDialog = new Dialog({
          type: DialogType.Message,
          contentWidth: "20%",
          title: i18nModel.getProperty("buttonCreate"),
          content: [
            // Label and Input for language field.
            new Label({
              text: i18nModel.getProperty("labelProficiencyLevelLanguage") + ":",
              labelFor: this.Constants.idForDefaultLanguage
            }),
            new Input(this.Constants.idForDefaultLanguage,{ enabled: false }),

            // Label and Input for name field.
            new Label({
              text: i18nModel.getProperty("labelProficiencyLevelName") + ":",
              labelFor: this.Constants.idForNameField,
              required: true
            }),
            new Input(this.Constants.idForNameField,{
              liveChange: function (oEvent) {
                // Get value of input fields.
                var sName = Core.byId(this.Constants.idForNameField).getValue().trim();
                var sDescription = Core.byId(this.Constants.idForDescriptionField).getValue().trim();
                // Enable disable the create button based on values.
                this.proficiencyCreateDialog.getBeginButton().setEnabled(sName.length > 0 && sDescription.length > 0);
              }.bind(this)
            }),

            // Label and Input for description field.
            new Label({
              text: i18nModel.getProperty("labelProficiencyLevelDescription") + ":",
              labelFor: this.Constants.idForDescriptionField,
              required: true
            }),
            new Input(this.Constants.idForDescriptionField,{
              liveChange: function (oEvent) {
                // Get value of input fields.
                var sName = Core.byId(this.Constants.idForNameField).getValue().trim();
                var sDescription = Core.byId(this.Constants.idForDescriptionField).getValue().trim();

                // Enable disable the create button based on values.
                this.proficiencyCreateDialog.getBeginButton().setEnabled(sName.length > 0 && sDescription.length > 0);
              }.bind(this)
            })
          ],
          beginButton: new Button({
            type: ButtonType.Emphasized,
            text: i18nModel.getProperty("buttonCreate"),
            enabled: false,
            press: function () {
              // Get Fields
              var oNameInputField = Core.byId(this.Constants.idForNameField);
              var oDescriptionInputField = Core.byId(this.Constants.idForDescriptionField);

              // Get Value of Fields
              var sName = oNameInputField.getValue();
              var sDescription = oDescriptionInputField.getValue();

              // Trigger backend call for create.
              var oTable = this.getView().byId("proficiencyLevelsTable");
              oTable.getBinding("items").create({ name:sName, description: sDescription });

              // Close the Dialog.
              this.proficiencyCreateDialog.close();
              this.proficiencyCreateDialog.getBeginButton().setEnabled(false);

              // Reset the Input fields.
              oNameInputField.setValue("");
              oDescriptionInputField.setValue("");
            }.bind(this)
          }),
          endButton: new Button({
            text: i18nModel.getProperty("buttonCancel"),
            press: function () {
              // Close the Dialog.
              this.proficiencyCreateDialog.close();

              // Reset the Input fields.
              Core.byId(this.Constants.idForNameField).setValue("");
              Core.byId(this.Constants.idForDescriptionField).setValue("");
              this.proficiencyCreateDialog.getBeginButton().setEnabled(false);
            }.bind(this)
          })
        });

        // to get access to the controller's model
        this.getView().addDependent(this.proficiencyCreateDialog);
      }

      // Open Dialog
      this.proficiencyCreateDialog.open();

    },

    onMoveUp: function(){
      var oTable = this.getView().byId("proficiencyLevelsTable");
      var oListBinding = oTable.getBinding("items");
      var oColumnListItem = oTable.getSelectedItem();
      var sMovedUpItemKey = oColumnListItem.getBindingContext().getProperty("ID");
      oListBinding.requestContexts().then(function(aContexts){
        this.swapLevelRanks(aContexts, sMovedUpItemKey, true);
        oListBinding.getContext().requestSideEffects([{ $NavigationPropertyPath: "proficiencyLevels" }]);
      }.bind(this));
    },

    onMoveDown: function() {
      var oTable = this.getView().byId("proficiencyLevelsTable");
      var oListBinding = oTable.getBinding("items");
      var oColumnListItem = oTable.getSelectedItem();
      var sMovedDownItemKey = oColumnListItem.getBindingContext().getProperty("ID");
      oListBinding.requestContexts().then(function(aContexts) {
        this.swapLevelRanks(aContexts, sMovedDownItemKey, false);
        oListBinding.getContext().requestSideEffects([{ $NavigationPropertyPath: "proficiencyLevels" }]);
      }.bind(this));
    },

    swapLevelRanks: function(aContexts, sMovedItemKey, bUp) {
      var iMovedItemPosition = aContexts.findIndex(function(el) {
        return el.getProperty("ID") === sMovedItemKey;
      });

      var oUpperLevelContext = aContexts[bUp ? iMovedItemPosition - 1 : iMovedItemPosition];
      var oLowerLevelContext = aContexts[bUp ? iMovedItemPosition : iMovedItemPosition + 1];
      var iUpperLevelRank = oUpperLevelContext.getProperty("rank");
      oUpperLevelContext.setProperty("rank", iUpperLevelRank - 1);
      oLowerLevelContext.setProperty("rank", iUpperLevelRank);
    },

    navigateToProficiencyLevelText: function(oEvent) {
      var oBindingContext = oEvent.getSource().getBindingContext();
      var oExtensionAPI = this.getOwnerComponent().getExtensionAPI();
      oExtensionAPI.navigateToTarget("ProficiencyLevelsDetails", oBindingContext);
    },

    onSelectionChange: function(){
      var bMoveUpButtonEnabled = this.moveUpEnabled();
      var oMoveUpButton = this.getView().byId("moveUpButton");
      oMoveUpButton.setEnabled(bMoveUpButtonEnabled);

      var bMoveDownButtonEnabled = this.moveDownEnabled();
      var oMoveDownButton = this.getView().byId("moveDownButton");
      oMoveDownButton.setEnabled(bMoveDownButtonEnabled);
    },

    selectionConsistent: function(oBindingContext, aSelectedContexts) {
      // We this function must return a boolean (no nullish values allowed) -- hence, we must coerce null values to false via !!
      return aSelectedContexts.length === 1 // no item (or multiple items) selected
        // no model at the binding
        // happens during activation: list on the object page is empty, function is still called with a binding. model is undefined, throws on getProperty
        // TypeError: Cannot read property 'checkSuspended' of undefined, at constructor.C.getProperty (Context-dbg.js:660)
        && !!aSelectedContexts[0].getModel()
        // no binding context given
        // happens when saving the draft while having selected a level.
        // TypeError: Cannot read property 'getBinding' of null, at constructor.O.getBaseForPathReduction (ODataParentBinding-dbg.js:864), at constructor.C.fetchValue (Context-dbg.js:499), at f (Context-dbg.js:37), at constructor.C.getProperty (Context-dbg.js:661)
        && !!oBindingContext; // === aSelectedContexts[0].getBinding().getContext()
    },

    isDraft: function(aSelectedContexts) {
      // item is draft -- however, getProperty() might return undefined after activation (async fetching?), which we should consider as "disable button" as well
      return aSelectedContexts[0].getProperty("IsActiveEntity") === false;
    },

    isTop: function(aSelectedContexts) {
      return aSelectedContexts[0].getProperty("rank") >= aSelectedContexts[0].getBinding().getLength();
    },

    isBottom: function(aSelectedContexts) {
      return aSelectedContexts[0].getProperty("rank") <= 1;
    },

    moveUpEnabled: function () {
      var oTable = this.getView().byId("proficiencyLevelsTable");
      var oSelectedItem = oTable.getSelectedItem();
      var oBindingContext = oSelectedItem && oSelectedItem.getBindingContext();

      return this.selectionConsistent(oBindingContext, oTable.getSelectedContexts()) && this.isDraft(oTable.getSelectedContexts()) && !this.isTop(oTable.getSelectedContexts());
    },

    moveDownEnabled: function () {
      var oTable = this.getView().byId("proficiencyLevelsTable");
      var oSelectedItem = oTable.getSelectedItem();
      var oBindingContext = oSelectedItem && oSelectedItem.getBindingContext();

      return this.selectionConsistent(oBindingContext, oTable.getSelectedContexts()) && this.isDraft(oTable.getSelectedContexts()) && !this.isBottom(oTable.getSelectedContexts());
    },

    setCreateButtonEnabled: function(oEvent) {
      var iLevelCount = oEvent.getParameter("actual");
      this.getView().byId("proficiencyLevelCreateButton").setEnabled(iLevelCount < this.maxLevelCount);
    }
  });
});
