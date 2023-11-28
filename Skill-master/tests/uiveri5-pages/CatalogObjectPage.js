module.exports = {
  createDialog: {
    dialogControl: element(by.control({
      controlType: 'sap.m.Dialog',
      properties: { title: 'Create' },
    })),
    nameInput: element(by.control({
      id: 'APD_::name',
    })),
    descriptionInput: element(by.control({
      id: 'APD_::description',
    })),
    createButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Continue' },
      ancestor: { controlType: 'sap.m.Dialog' },
    })),
    cancelButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Cancel' },
      ancestor: { controlType: 'sap.m.Dialog' },
    })),
  },

  primaryDialogButton: element(by.control({
    controlType: 'sap.m.Button',
    properties: { type: 'Emphasized' },
    ancestor: { controlType: 'sap.m.Dialog' },
  })),

  keepDraftChangesDialog: {
    keepDraftButton: element(by.control({
      controlType: 'sap.m.Label',
      properties: { text: 'Keep Draft' },
      ancestor: { controlType: 'sap.m.Dialog' },
    })),
    okButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'OK' },
      ancestor: { controlType: 'sap.m.Dialog' },
    })),
  },

  deleteDialog: {
    deleteButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Delete' },
      ancestor: { controlType: 'sap.m.Dialog' },
    })),
    cancelButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Cancel' },
      ancestor: { controlType: 'sap.m.Dialog' },
    })),
  },

  header: {
    editButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Edit' },
      ancestor: { controlType: 'sap.uxap.ObjectPageDynamicHeaderTitle' },
    })),
    restrictButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Restrict' },
      ancestor: { controlType: 'sap.uxap.ObjectPageDynamicHeaderTitle' },
    })),
    unrestrictButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Remove Restriction' },
      ancestor: { controlType: 'sap.uxap.ObjectPageDynamicHeaderTitle' },
    })),
  },

  footer: {
    saveButton: element(by.control({
      id: 'skill-catalog::CatalogsObjectPage--fe::FooterBar::StandardAction::Save',
    })),
    cancelButton: element(by.control({
      id: 'skill-catalog::CatalogsObjectPage--fe::FooterBar::StandardAction::Cancel',
    })),
    discardPopoverButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Discard' },
    })),
    draftSavedIndicator: element(by.control({
      controlType: 'sap.m.DraftIndicator',
      properties: { state: 'Saved' },
    })),
    waitForDraftSavedIndicator: () => {
      module.exports.anchors.catalogAnchor.click(); // defocus any text input to trigger the draft sync -- do this by clicking somewhere else
      expect(module.exports.footer.draftSavedIndicator.isPresent()).toBeTruthy('Draft synced to backend');
    },
    messageButton: element(by.control({
      id: 'skill-catalog::CatalogsObjectPage--fe::FooterBar::MessageButton',
    })),
  },
  skills: {
    skillSemanticLink: (name) => element(by.control({
      controlType: 'sap.m.Link',
      properties: { text: name },
      ancestor: { id: 'skill-catalog::CatalogsObjectPage--fe::table::skillAssociations::LineItem-innerTable' },
    })),
    createButton: element(by.control({
      id: 'skill-catalog::CatalogsObjectPage--fe::table::skillAssociations::LineItem::StandardAction::Create',
    })),
    deleteButton: element(by.control({
      id: 'skill-catalog::CatalogsObjectPage--fe::table::skillAssociations::LineItem::StandardAction::Delete',
    })),
    newSkillInput: element(by.control({
      controlType: 'sap.ui.mdc.field.FieldInput',
      viewName: 'sap.fe.templates.ObjectPage.ObjectPage',
      properties: {
        value: '',
      },
      interaction: {
        idSuffix: 'inner',
      },
    })),
    skillCheckbox: (name) => element(by.control({
      controlType: 'sap.m.CheckBox',
      ancestor: {
        controlType: 'sap.m.ColumnListItem',
        descendant: {
          controlType: 'sap.m.Input',
          properties: { value: name },
        },
      },
    })),
    deleteDialog: {
      dialogControl: element(by.control({
        controlType: 'sap.m.Dialog',
      })),
      deleteButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'Delete' },
        ancestor: { controlType: 'sap.m.Dialog' },
      })),
      cancelButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'Cancel' },
        ancestor: { controlType: 'sap.m.Dialog' },
      })),
    },
  },
  catalog: {
    create: element(by.control({
      id: 'skill-catalog::CatalogsObjectPage--fe::table::texts::LineItem::StandardAction::Create',
    })),
    nameInput: (catalogName) => element(by.control({
      controlType: 'sap.m.Input',
      properties: { value: catalogName },
      id: 'skill-catalog::CatalogsObjectPage--fe::EditableHeaderForm::EditableHeaderTitle::Field-edit',
    })),
    descriptionInput: (catalogDescription) => element(by.control({
      controlType: 'sap.m.TextArea',
      properties: { value: catalogDescription },
      id: 'skill-catalog::CatalogsObjectPage--fe::EditableHeaderForm::EditableHeaderDescription::Field-edit',
    })),
    descriptionInputErrorHighlighted: (catalogDescription) => element(by.control({
      controlType: 'sap.m.TextArea',
      properties: { value: catalogDescription, valueState: 'Error' },
      id: 'skill-catalog::CatalogsObjectPage--fe::EditableHeaderForm::EditableHeaderDescription::Field-edit',
    })),
  },
  errorDialog: {
    dialogControl: element(by.control({
      controlType: 'sap.m.Dialog',
      properties: { state: 'Error' },
    })),
    closeButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Close' },
      ancestor: { controlType: 'sap.m.Dialog' },
    })),
  },
  messageDialog: {
    dialog: element(
      by.control({
        controlType: 'sap.m.Dialog',
      }),
    ),
    closeButton: element(
      by.control({
        controlType: 'sap.m.Button',
        properties: {
          text: 'Close',
        },
      }),
    ),
    messages: element(
      by.control({
        controlType: 'sap.m.Dialog',
      }),
    ).all(
      by.control({
        controlType: 'sap.m.Text',
      }),
    ),
  },
};
