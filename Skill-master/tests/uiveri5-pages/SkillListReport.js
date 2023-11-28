module.exports = {
  skillList: element(by.control({
    id: 'skill::SkillsListReport--fe::table::Skills::LineItem-innerTable',
  })),
  skillListRows: element.all(by.control({
    controlType: 'sap.m.ColumnListItem',
    ancestor: {
      id: 'skill::SkillsListReport--fe::table::Skills::LineItem-innerTable',
    },
  })),
  skillListEntry: (skillName) => element(by.control({
    controlType: 'sap.m.Text',
    properties: { text: skillName },
    ancestor: {
      id: 'skill::SkillsListReport--fe::table::Skills::LineItem-innerTable',
    },
  })),
  skillListRow: (skillName) => element(by.control({
    controlType: 'sap.m.ColumnListItem',
    ancestor: {
      id: 'skill::SkillsListReport--fe::table::Skills::LineItem-innerTable',
    },
    descendant: {
      controlType: 'sap.m.Text',
      properties: { text: skillName },
    },
  })),
  skillListEntryDescription: (skillListRow, skillDescription) => skillListRow.element(by.control({
    controlType: 'sap.m.ExpandableText',
    bindingPath: {
      propertyPath: 'description',
    },
    properties: {
      text: skillDescription,
    },
  })),
  skillListEntryCommaSeparatedLabels: (skillListRow, skillCommaSeparatedLabels) => skillListRow.element(by.control({
    controlType: 'sap.m.Text',
    bindingPath: {
      propertyPath: 'commaSeparatedAlternativeLabels',
    },
    properties: {
      text: skillCommaSeparatedLabels,
    },
  })),
  skillListDraftMarker: (skillName) => element(by.control({
    // Match an Draft marker, that is child of a ColumnListItem in the SkillsTable that also contains a field with the given skillName
    controlType: 'sap.m.ObjectMarker',
    properties: { type: 'Draft' },
    ancestor: {
      controlType: 'sap.m.ColumnListItem',
      ancestor: { id: 'skill::SkillsListReport--fe::table::Skills::LineItem-innerTable' },
      descendant: { controlType: 'sap.m.Text', properties: { text: skillName } },
    },
  })),
  lifecycleStatusField: (skillListRow, lifecycleStatus) => skillListRow.element(by.control({
    controlType: 'sap.m.ObjectStatus',
    bindingPath: {
      propertyPath: 'lifecycleStatus/criticality',
    },
    properties: {
      text: lifecycleStatus,
    },
  })),

  buttons: {
    create: element(by.control({
      id: 'skill::SkillsListReport--fe::table::Skills::LineItem::StandardAction::Create',
    })),
    delete: element(by.control({
      id: 'skill::SkillsListReport--fe::table::Skills::LineItem::StandardAction::Delete',
    })),
    upload: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Upload' },
    })),
    download: element(by.control({
      controlType: 'sap.m.Button',
      properties: { text: 'Download' },
    })),
    showDetails: (text) => element(by.control({
      controlType: 'sap.m.Button',
      properties: { icon: 'sap-icon://detail-more' },
    })),
    hideDetails: (text) => element(by.control({
      controlType: 'sap.m.Button',
      properties: { icon: 'sap-icon://detail-less' },
    })),
  },
  filterBar: {
    expandButton: element.all(by.control({
      controlType: 'sap.m.Button',
      ancestor: { controlType: 'sap.f.DynamicPageTitle' },
      properties: { icon: 'sap-icon://slim-arrow-down' },
    })).filter((element) => element.getAttribute('class').then((s) => s === 'sapMBtnBase sapMBtn sapFDynamicPageToggleHeaderIndicator')).first(),
    searchField: element(by.control({
      controlType: 'sap.m.SearchField',
      ancestor: { controlType: 'sap.f.DynamicPageHeader' },
      interaction: 'focus',
    })),
    nameFilterField: element(by.control({
      id: 'skill::SkillsListReport--fe::FilterBar::Skills::FilterField::name',
    })),
    searchFieldPress: element(by.control({
      controlType: 'sap.m.SearchField',
      ancestor: { controlType: 'sap.f.DynamicPageHeader' },
      interaction: 'press',
    })),
    goButton: element(by.control({
      controlType: 'sap.m.Button',
      id: 'skill::SkillsListReport--fe::FilterBar::Skills-btnSearch',
    })),
  },
};
