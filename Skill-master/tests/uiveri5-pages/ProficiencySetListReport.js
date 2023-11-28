module.exports = {
  proficiencySetList: element(by.control({
    id: 'skill-proficiency::ProficiencySetsList--fe::table::ProficiencySets::LineItem-innerTable',
  })),
  proficiencySetListEntry: (proficiencySetName) => element(by.control({
    controlType: 'sap.m.Text',
    properties: { text: proficiencySetName },
    ancestor: {
      id: 'skill-proficiency::ProficiencySetsList--fe::table::ProficiencySets::LineItem-innerTable',
    },
  })),
  proficiencySetListRow: (proficiencySetName) => element(by.control({
    controlType: 'sap.m.ColumnListItem',
    ancestor: {
      id: 'skill-proficiency::ProficiencySetsList--fe::table::ProficiencySets::LineItem-innerTable',
    },
    descendant: {
      controlType: 'sap.m.Text',
      properties: { text: proficiencySetName },
    },
  })),
  proficiencySetListEntryDescription: (proficiencySetListRow, proficiencySetDescription) => proficiencySetListRow.element(by.control({
    controlType: 'sap.m.Text',
    bindingPath: {
      propertyPath: 'description',
    },
    properties: {
      text: proficiencySetDescription,
    },
  })),
  proficiencySetListDraftMarker: (proficiencySetName) => element(by.control({
    // Match an Draft marker, that is child of a ColumnListItem in the ProficienciesTable that also contains a field with the given proficiencySetName
    controlType: 'sap.m.ObjectMarker',
    properties: { type: 'Draft' },
    ancestor: {
      controlType: 'sap.m.ColumnListItem',
      ancestor: { id: 'skill-proficiency::ProficiencySetsList--fe::table::ProficiencySets::LineItem-innerTable' },
      descendant: { controlType: 'sap.m.Text', properties: { text: proficiencySetName } },
    },
  })),
  buttons: {
    create: element(by.control({
      id: 'skill-proficiency::ProficiencySetsList--fe::table::ProficiencySets::LineItem::StandardAction::Create',
    })),
    delete: element(by.control({
      id: 'skill-proficiency::ProficiencySetsList--fe::table::ProficiencySets::LineItem::StandardAction::Delete',
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
    searchFieldPress: element(by.control({
      controlType: 'sap.m.SearchField',
      ancestor: { controlType: 'sap.f.DynamicPageHeader' },
      interaction: 'press',
    })),
    goButton: element(by.control({
      controlType: 'sap.m.Button',
      id: 'skill-proficiency::ProficiencySetsList--fe::FilterBar::ProficiencySets-btnSearch',
    })),
  },
};
