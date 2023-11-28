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

  header: {
    editButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Edit' },
      ancestor: { controlType: 'sap.uxap.ObjectPageDynamicHeaderTitle' },
    })),
    disabledEditButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Edit', enabled: false },
      ancestor: { controlType: 'sap.uxap.ObjectPageDynamicHeaderTitle' },
    })),
  },

  anchors: {
    skillAnchor: element(by.control({
      id: 'skill-proficiency::ProficiencySetsDetails--fe::ObjectPage-anchBar-skill-proficiency::ProficiencySetsDetails--fe::FacetSection::skills::LineItem-anchor',
    })),
    proficiencyLevelAnchor: element(by.control({
      id: 'skill-proficiency::ProficiencySetsDetails--fe::ObjectPage-anchBar-skill-proficiency::ProficiencySetsDetails--fe::CustomSection::proficiencyLevelTableSection-anchor',
    })),
  },

  footer: {
    saveButton: element(by.control({
      id: 'skill-proficiency::ProficiencySetsDetails--fe::FooterBar::StandardAction::Save',
    })),
    cancelButton: element(by.control({
      id: 'skill-proficiency::ProficiencySetsDetails--fe::FooterBar::StandardAction::Cancel',
    })),
    discardPopoverButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Discard' },
      // ancestor: { controlType: "sap.m.Popover" }
    })),
    draftSavedIndicator: element(by.control({
      controlType: 'sap.m.DraftIndicator',
      properties: { state: 'Saved' },
    })),
    messageButton: element(by.control({
      id: 'skill-proficiency::ProficiencySetsDetails--fe::FooterBar::MessageButton',
    })),
    waitForDraftSavedIndicator: () => {
      module.exports.anchors.proficiencyLevelAnchor.click(); // defocus any text input to trigger the draft sync -- do this by clicking somewhere else
      expect(module.exports.footer.draftSavedIndicator.isPresent()).toBeTruthy('Draft synced to backend');
    },
  },

  proficiencyLevels: {
    proficiencyLevel: (name) => element(by.control({
      controlType: 'sap.m.Text',
      properties: { text: name },
      ancestor: { id: 'skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelsTable' },
    })),
    proficiencyLevelRadioButton: (name) => element(by.control({
      controlType: 'sap.m.RadioButton',
      ancestor: {
        controlType: 'sap.m.ColumnListItem',
        descendant: {
          controlType: 'sap.m.Text',
          properties: { text: name },
        },
      },
    })),
    proficiencyLevelColumnListItem: (name) => element(by.control({
      controlType: 'sap.m.ColumnListItem',
      descendant: {
        controlType: 'sap.m.Text',
        properties: { text: name },
      },
    })),
    proficiencyLevelListRow: (proficiencyLevelName) => element(by.control({
      controlType: 'sap.m.ColumnListItem',
      descendant: {
        controlType: 'sap.m.Text',
        properties: { text: proficiencyLevelName },
      },
    })),
    proficiencyLevelRank: (coloumnListItem, rank) => coloumnListItem.element(by.control({
      controlType: 'sap.m.Text',
      bindingPath: {
        propertyPath: 'rank',
      },
      properties: {
        text: rank,
      },
    })),
    createButton: element(by.control({
      id: 'skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--proficiencyLevelCreateButton',
    })),
    moveUpButton: element(by.control({
      id: 'skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveUpButton',
    })),
    moveDownButton: element(by.control({
      id: 'skill-proficiency::ProficiencySetsDetails--fe::CustomSubSection::proficiencyLevelTableSection--proficiencyLevelXmlViewId--moveDownButton',
    })),
    proficiencyLevelCreateDialog: {
      nameField: element(by.control({
        id: 'nameOfProficiencyLevel',
        searchOpenDialogs: true,
      })),
      descriptionField: element(by.control({
        id: 'descriptionOfProficiencyLevel',
        searchOpenDialogs: true,
      })),
      createButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'Create' },
        ancestor: { controlType: 'sap.m.Dialog' },
      })),
    },
    proficiencyLevelSubObjectPage: {
      createButton: element(by.control({
        id: 'skill-proficiency::ProficiencyLevelsDetails--fe::table::texts::LineItem::StandardAction::Create',
      })),
      deleteButton: element(by.control({
        id: 'skill-proficiency::ProficiencyLevelsDetails--fe::table::texts::LineItem::StandardAction::Delete',
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
      proficiencyLevelCheckbox: (name, descendantType = 'sap.m.Input') => element(by.control({
        controlType: 'sap.m.CheckBox',
        ancestor: {
          controlType: 'sap.m.ColumnListItem',
          descendant: {
            controlType: descendantType,
            properties: { value: name },
          },
        },
      })),
      proficiencyLevelNameInput: (sValue) => element(by.control({
        controlType: 'sap.m.Input',
        viewName: 'sap.fe.templates.ObjectPage.ObjectPage',
        properties: { value: sValue },
        bindingPath: {
          propertyPath: 'name',
        },
        interaction: {
          idSuffix: 'inner',
        },
      })),
      proficiencyLevelDescriptionInput: (sValue) => element(by.control({
        controlType: 'sap.m.TextArea',
        viewName: 'sap.fe.templates.ObjectPage.ObjectPage',
        properties: { value: sValue },
        bindingPath: {
          propertyPath: 'description',
        },
        interaction: {
          idSuffix: 'inner',
        },
      })),
      proficiencyLevelLanguageInput: (sValue) => element(by.control({
        controlType: 'sap.ui.mdc.field.FieldInput',
        viewName: 'sap.fe.templates.ObjectPage.ObjectPage',
        properties: { value: sValue },
        bindingPath: {
          path: '',
          propertyPath: '/conditions',
          modelName: '$field',
        },
        interaction: {
          idSuffix: 'inner',
        },
      })),
      applyButton: element(by.control({
        controlType: 'sap.m.Button',
        viewName: 'sap.fe.templates.ObjectPage.ObjectPage',
        properties: {
          text: 'Apply',
        },
        interaction: {
          idSuffix: 'inner',
        },
      })),
    },
  },
  skills: {
    skillSemanticLink: (name) => element(by.control({
      controlType: 'sap.m.Link',
      properties: { text: name },
      ancestor: { id: 'skill-proficiency::ProficiencySetsDetails--fe::table::skills::LineItem-innerTable' },
    })),
  },
  proficiencySet: {
    create: element(by.control({
      id: 'skill-proficiency::ProficiencySetsDetails--fe::table::texts::LineItem::StandardAction::Create',
    })),
    nameInput: (proficiencySetName) => element(by.control({
      controlType: 'sap.m.Input',
      properties: { value: proficiencySetName },
      id: 'skill-proficiency::ProficiencySetsDetails--fe::EditableHeaderForm::EditableHeaderTitle::Field-edit',
    })),
    nameInputErrorHighlighted: (proficiencySetName) => element(by.control({
      controlType: 'sap.m.Input',
      properties: { value: proficiencySetName, valueState: 'Error' },
      id: 'skill-proficiency::ProficiencySetsDetails--fe::EditableHeaderForm::EditableHeaderTitle::Field-edit',
    })),
    descriptionInput: (proficiencySetDescription) => element(by.control({
      controlType: 'sap.m.TextArea',
      properties: { value: proficiencySetDescription },
      // skill- proficiency:: ProficiencySetsDetails--fe:: EditableHeaderForm:: EditableHeaderDescription:: Field - edit
      id: 'skill-proficiency::ProficiencySetsDetails--fe::EditableHeaderForm::EditableHeaderDescription::Field-edit',
    })),
    descriptionInputErrorHighlighted: (proficiencySetDescription) => element(by.control({
      controlType: 'sap.m.TextArea',
      properties: { value: proficiencySetDescription, valueState: 'Error' },
      id: 'skill-proficiency::ProficiencySetsDetails--fe::EditableHeaderForm::EditableHeaderDescription::Field-edit',
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
