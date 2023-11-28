module.exports = {
  createDialog: {
    dialogControl: element(by.control({
      controlType: 'sap.m.Dialog',
      properties: { title: 'Create' },
    })),
    labelInput: element(by.control({
      id: 'APD_::label',
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

  restrictDialog: {
    okButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'OK' },
      ancestor: { controlType: 'sap.m.Dialog' },
    })),
    cancelButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Cancel' },
      ancestor: { controlType: 'sap.m.Dialog' },
    })),
  },

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

  anchors: {
    skillAnchor: element(by.control({
      id: 'skill::SkillsObjectPage--fe::ObjectPage-anchBar-skill::SkillsObjectPage--fe::FacetSection::texts::LineItem-anchor',
    })),
    alternativeNamesAnchor: element(by.control({
      id: 'skill::SkillsObjectPage--fe::ObjectPage-anchBar-skill::SkillsObjectPage--fe::FacetSection::alternativeLabels::LineItem-anchor',
    })),
    catalogsAnchor: element(by.control({
      id: 'skill::SkillsObjectPage--fe::ObjectPage-anchBar-skill::SkillsObjectPage--fe::FacetSection::catalogAssociations::PresentationVariant-anchor',
    })),
    proficiencyLevelsAnchor: element(by.control({
      id: 'skill::SkillsObjectPage--fe::ObjectPage-anchBar-skill::SkillsObjectPage--fe::FacetSection::proficiencySet::proficiencyLevels::PresentationVariant-anchor',
    })),
  },

  footer: {
    saveButton: element(by.control({
      id: 'skill::SkillsObjectPage--fe::FooterBar::StandardAction::Save',
    })),
    cancelButton: element(by.control({
      id: 'skill::SkillsObjectPage--fe::FooterBar::StandardAction::Cancel',
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
    waitForDraftSavedIndicator: async () => {
      await module.exports.anchors.skillAnchor.click(); // defocus any text input to trigger the draft sync -- do this by clicking somewhere else
      expect(await module.exports.footer.draftSavedIndicator.isPresent()).toBeTruthy('Draft synced to backend');
    },
  },

  skill: {
    create: element(by.control({
      id: 'skill::SkillsObjectPage--fe::table::texts::LineItem::StandardAction::Create',
    })),
    skillListRow: (skillName) => element(by.control({
      controlType: 'sap.m.ColumnListItem',
      ancestor: {
        id: 'skill::SkillsObjectPage--fe::table::texts::LineItem-innerTable',
      },
      descendant: {
        controlType: 'sap.m.Text',
        properties: { text: skillName },
      },
    })),
    nameText: (skillName) => element(by.control({
      controlType: 'sap.m.Text',
      properties: { text: skillName },
      ancestor: { id: 'skill::SkillsObjectPage--fe::table::texts::LineItem-innerTable' },
    })),
    nameInput: (skillName) => element(by.control({
      controlType: 'sap.m.Input',
      properties: { value: skillName },
      ancestor: { id: 'skill::SkillsObjectPage--fe::table::texts::LineItem-innerTable' },
    })),
    localeText: (skillListRow, skillLocale) => skillListRow.element(by.control({
      controlType: 'sap.m.Text',
      properties: { text: skillLocale },
      ancestor: { id: 'skill::SkillsObjectPage--fe::table::texts::LineItem-innerTable' },
    })),
    localeInput: (skillLocale) => element(by.control({
      controlType: 'sap.ui.mdc.field.FieldInput',
      properties: { value: skillLocale },
      ancestor: { id: 'skill::SkillsObjectPage--fe::table::texts::LineItem-innerTable' },
    })),
    descriptionText: (skillDescription) => element(by.control({
      controlType: 'sap.m.ExpandableText',
      properties: { text: skillDescription },
      ancestor: { id: 'skill::SkillsObjectPage--fe::table::texts::LineItem-innerTable' },
    })),
    descriptionInput: (skillDescription) => element(by.control({
      controlType: 'sap.m.TextArea',
      properties: { value: skillDescription },
      ancestor: { id: 'skill::SkillsObjectPage--fe::table::texts::LineItem-innerTable' },
    })),
    proficiencySetInput: (proficiencySetName) => element(by.control({
      controlType: 'sap.ui.mdc.Field',
      properties: { additionalValue: proficiencySetName },
      id: 'skill::SkillsObjectPage--fe::HeaderFacet::FormContainer::FieldGroup::ProficiencySet::FormElement::DataField::proficiencySet_ID::Field-edit',
    })),
    proficiencySetSemanticLink: (name) => element(by.control({
      controlType: 'sap.m.Link',
      properties: { text: name },
      ancestor: { id: 'skill::SkillsObjectPage--fe::HeaderFacetContainer::FieldGroup::ProficiencySet' },
    })),
  },

  alternativeNames: {
    createButton: element(by.control({
      id: 'skill::SkillsObjectPage--fe::table::alternativeLabels::LineItem::StandardAction::Create',
    })),
    deleteButton: element(by.control({
      id: 'skill::SkillsObjectPage--fe::table::alternativeLabels::LineItem::StandardAction::Delete',
    })),
    alternativeNameText: (name) => element(by.control({
      controlType: 'sap.m.Text',
      bindingPath: {
        propertyPath: 'name',
      },
      properties: { text: name },
      ancestor: {
        controlType: 'sap.m.Table',
        id: 'skill::SkillsObjectPage--fe::table::alternativeLabels::LineItem-innerTable',
      },
    })),
    alternativeNameInput: (name) => element(by.control({
      controlType: 'sap.m.Input',
      bindingPath: {
        propertyPath: 'name',
      },
      properties: { value: name },
      ancestor: {
        controlType: 'sap.m.Table',
        id: 'skill::SkillsObjectPage--fe::table::alternativeLabels::LineItem-innerTable',
      },
    })),
    newAlternativeNameInput: element.all(by.control({
      controlType: 'sap.m.Input',
      bindingPath: {
        propertyPath: 'name',
      },
      ancestor: {
        controlType: 'sap.m.Table',
        id: 'skill::SkillsObjectPage--fe::table::alternativeLabels::LineItem-innerTable',
      },
    })).filter((element) => element.asControl().getProperty('value').then((s) => s === '')).first(),
    alternativeNameCheckbox: (name) => element(by.control({
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
  catalogs: {
    addButton: element(by.control({
      id: 'skill::SkillsObjectPage--fe::table::catalogAssociations::LineItem::CustomAction::openAssignCatalogsDialog',
    })),
    removeButton: element(by.control({
      id: 'skill::SkillsObjectPage--fe::table::catalogAssociations::LineItem::CustomAction::openUnassignCatalogsDialog',
    })),
    catalogListRows: element.all(by.control({
      controlType: 'sap.m.ColumnListItem',
      ancestor: {
        id: 'skill::SkillsObjectPage--fe::table::catalogAssociations::LineItem-innerTable',
      },
    })),
    catalogSemanticLink: (name) => element(by.control({
      controlType: 'sap.m.Link',
      properties: { text: name },
      ancestor: { id: 'skill::SkillsObjectPage--fe::table::catalogAssociations::LineItem-innerTable' },
    })),
  },
  catalogDialog: {
    catalogCheckbox: (name) => element(by.control({
      controlType: 'sap.m.CheckBox',
      ancestor: {
        controlType: 'sap.m.StandardListItem',
        properties: { title: name },
      },
    })),
    searchField: element(by.control({
      controlType: 'sap.m.SearchField',
      ancestor: { controlType: 'sap.m.Dialog' },
      interaction: 'focus',
    })),
    catalogAssignmentListRows: element.all(by.control({
      controlType: 'sap.m.StandardListItem',
      ancestor: {
        id: 'skill::SkillsObjectPage--catalogAssignmentDialog-list',
      },
    })),
    cancelButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Cancel' },
      ancestor: { controlType: 'sap.m.Dialog' },
    })),
    confirmButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'OK' },
      ancestor: { controlType: 'sap.m.Dialog' },
    })),
  },
  proficiencyLevels: {
    levelsListRows: element.all(by.control({
      controlType: 'sap.m.ColumnListItem',
      ancestor: {
        id: 'skill::SkillsObjectPage--fe::table::proficiencySet::proficiencyLevels::LineItem-innerTable',
      },
    })),
    proficiencyLevelNameText: (name) => element(by.control({
      controlType: 'sap.m.Text',
      properties: { text: name },
      ancestor: {
        controlType: 'sap.m.ObjectIdentifier',
        bindingPath: {
          propertyPath: 'name',
        },
      },
    })),
    proficiencyLevelDescriptionText: (description) => element(by.control({
      controlType: 'sap.m.ExpandableText',
      bindingPath: {
        propertyPath: 'description',
      },
      properties: { text: description },
      ancestor: {
        controlType: 'sap.m.Table',
        id: 'skill::SkillsObjectPage--fe::table::proficiencySet::proficiencyLevels::LineItem-innerTable',
      },
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
  errorPopover: {
    footerButton: element(by.control({
      id: 'skill::SkillsObjectPage--fe::FooterBar::MessageButton',
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
