const PriorExperience = require('./PriorExperience.js');
 
var parentElements = {

  contentSection: element(
    by.control({
      controlType: "sap.uxap.ObjectPageSection",
      id:"myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FacetSection::Qualifications",
      interaction: "focus"
    })
  ),

  draftModeSkillsTable: element(
    by.id(
      "myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem-innerTable "
    )
  ),
};


var qualifications = {

  elements: {

    tableTitle : element(by.id("myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem-title")),

    values: element(
      by.id(
        "myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem-innerTable"
      )
    ),

    buttonInAnchorBar: element(
      by.id("myProjectExperienceUi::MyProjectExperienceObjectPage--fe::ObjectPage-anchBar-myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FacetSection::Qualifications-anchor")
    ),

    skillTableToolbar: element(
      by.id("myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem-toolbar")
    ),

    draftModeOverflowToolbars: element(
      by.id("myProjectExperienceUi::MyProjectExperienceObjectPage--fe::ObjectPage::footer::MyProjectExperienceHeader"))
  }
};

var assertions = {
  async checkSkillValueHelpTableIsEmpty() {
    const table = element(by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::table::skills::LineItem::TableValueHelp::skills::skill_ID::Table-innerTable'));
        const tableRows = table.all(by.control({
            controlType: 'sap.ui.table.Row',
        }));
        const noOfRowsObjectTable = await tableRows.count();
        const row = await tableRows.get(rowNum);
        const dataFields = row.all(by.control({
            controlType: 'sap.m.Text',
        }));

        for (let j = 0; j < noOfRowsObjectTable; j++) {
          const value1 = dataFields[j].getText();
          if (value1 != '' || value1 != null) {
            return false;
          }
        }
    return true;
},
};

var actions = {

  navigateToQualifications: function() {
    qualifications.elements.buttonInAnchorBar.click();
  },

  getQualificationsValues: function () {
    var listOfSkills = qualifications.elements.values.all(
      by.control({
        controlType: "sap.m.ColumnListItem"
      })
    );

    return listOfSkills;
  },

  getColumnHeader: function() {
    var columnHeaders = qualifications.elements.values.all(
    by.control({
      controlType: "sap.m.Column"
    }));

    return columnHeaders;
  },

  getSkillName: function(skillName) {
    var name = parentElements.contentSection.element(
        by.control({
          controlType: "sap.m.Link",
          properties: {
            text: skillName
          }}));
      return name;
  },
  getProficiencyLevelName: function(proficiencyLevelName) {
    var name = parentElements.contentSection.element(
      by.control({
        controlType: "sap.m.Text",
        properties: {
          text: proficiencyLevelName
        }})
    );
    return name;
  }
};

module.exports = {
  actions: actions,
  qualifications: qualifications,
  parentElements: parentElements,
  assertions: assertions
};
