var parentElements = {

  contentSection: element(
    by.control({
      controlType: "sap.uxap.ObjectPageSection",
      interaction: "focus",
      properties: {
        title: "Prior Experience"
      }})),

  addRolesDialog: element(
    by.control({
      controlType: "sap.m.Dialog",
      properties: { title: "Roles"}
  }))};

var priorExperience = {

  elements: {
    
    tableTitle: element(by.id("myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem-title")),

    values: element(
      by.id(
        "myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem-innerTable"
      )),

    buttonInAnchorBar: element(
      by.id("myProjectExperienceUi::MyProjectExperienceObjectPage--fe::ObjectPage-anchBar-myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FacetSection::PriorExperience-anchor")
    ),

    rolesTableToolbar: element(
      by.id("myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem-toolbar")
    ),

      draftModeOverflowToolbars: element(
      by.id("myProjectExperienceUi::MyProjectExperienceObjectPage--fe::op::footer::MyProjectExperienceHeader")
    ),

    table: element(
      by.id("myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem-innerTable")
    ),

    addRolesTable: parentElements.addRolesDialog.element(
      by.id("myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Table")
    ),

    valueHelpShowFiltersBtn: element(
      by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::::FilterBar-btnShowFilters'),
    ),

    roleValueHelpShowFiltersBtn: element(
      by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Dialog::qualifier::::FilterBar-btnShowFilters'),
    ),

    valueHelpSearchInput: element(by.control({
      controlType: 'sap.m.SearchField',
      interaction: 'focus',
    })),

    valueHelpSearchPress: element(by.control({
        controlType: 'sap.m.SearchField',
        interaction: 'press',
    })),

    valueHelpSearchInput_roles: element(by.control({
      id: 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Dialog::qualifier::-search-inner',
      searchOpenDialogs: true,
    })),

    valueHelpSearchPress_roles: element(by.control({
      id: "myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::roles::LineItem::TableValueHelp::roles::role_ID::Dialog::qualifier::::FilterBar-btnSearch",
        searchOpenDialogs: true,
    })),

    valueHelpSearchInput_skills: element(by.control({
      id: 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::-search-inner',
      searchOpenDialogs: true,
  })),

    valueHelpSearchPress_skills: element(by.control({
        id: "myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Dialog::qualifier::::FilterBar-btnSearch",
        searchOpenDialogs: true
    })),
  }
}


var actions = {

  navigateToPriorExperience: function() {
    priorExperience.elements.buttonInAnchorBar.click();
  },

  getPriorExperienceValues: function () {
    var listOfRoles = priorExperience.elements.values.all(
      by.control({
        controlType: "sap.m.ColumnListItem"
      })
    );
    return listOfRoles;
  },

  getColumnHeader: function() {

    var columnHeaders = priorExperience.elements.values.all(by.control({
      controlType : "sap.m.Column"
    }));

    return columnHeaders;
  },

  getRoleName(roleName) {
    const name = priorExperience.elements.table.element(
        by.control({
            controlType: 'sap.m.Link',
            properties: {
                text: roleName,
            },
        }),
    );
    return name;
},
 
};


module.exports = {
  actions: actions,
  priorExperience: priorExperience,
  parentElements: parentElements
};
