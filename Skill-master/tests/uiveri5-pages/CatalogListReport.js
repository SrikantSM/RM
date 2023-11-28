module.exports = {
  catalogList: element(by.control({
    id: 'skill-catalog::CatalogsListReport--fe::table::Catalogs::LineItem-innerTable',
  })),
  catalogListEntry: (catalogName) => element(by.control({
    controlType: 'sap.m.Text',
    properties: { text: catalogName },
    ancestor: {
      id: 'skill-catalog::CatalogsListReport--fe::table::Catalogs::LineItem-innerTable',
    },
  })),
  catalogListRow: (catalogName) => element(by.control({
    controlType: 'sap.m.ColumnListItem',
    ancestor: {
      id: 'skill-catalog::CatalogsListReport--fe::table::Catalogs::LineItem-innerTable',
    },
    descendant: {
      controlType: 'sap.m.Text',
      properties: { text: catalogName },
    },
  })),
  catalogListEntryDescription: (catalogListRow, catalogDescription) => catalogListRow.element(by.control({
    controlType: 'sap.m.Text',
    id: /fe::table::Catalogs::LineItem::DataField::description/,
    properties: {
      text: catalogDescription,
    },
  })),
  catalogCheckbox: (catalogListRow, name) => catalogListRow.element(by.control({
    controlType: 'sap.m.CheckBox',
    ancestor: {
      controlType: 'sap.m.ColumnListItem',
      descendant: {
        controlType: 'sap.m.Text',
        properties: { text: name },
      },
    },
  })),
  catalogListDraftMarker: (catalogName) => element(by.control({
    // Match an Draft marker, that is child of a ColumnListItem in the CatalogsTable that also contains a field with the given catalogName
    controlType: 'sap.m.ObjectMarker',
    properties: { type: 'Draft' },
    ancestor: {
      controlType: 'sap.m.ColumnListItem',
      ancestor: { id: 'skill-catalog::CatalogsListReport--fe::table::Catalogs::LineItem-innerTable' },
      descendant: { controlType: 'sap.m.Text', properties: { text: catalogName } },
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
  buttons: {
    create: element(by.control({
      id: 'skill-catalog::CatalogsListReport--fe::table::Catalogs::LineItem::StandardAction::Create',
    })),
    delete: element(by.control({
      id: 'skill-catalog::CatalogsListReport--fe::table::Catalogs::LineItem::StandardAction::Delete',
    })),
  },
  errorDialog: {
    dialogControl: element(by.control({
      controlType: 'sap.m.Dialog',
      properties: {
        icon: 'sap-icon://error',
      },
      searchOpenDialogs: true,
    })),
    closeButton: element(by.control({
      controlType: 'sap.m.Button',
      properties: {
        text: 'Close',
      },
      searchOpenDialogs: true,
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
      id: 'skill-catalog::CatalogsListReport--fe::FilterBar::Catalogs-btnSearch',
    })),
  },
};
