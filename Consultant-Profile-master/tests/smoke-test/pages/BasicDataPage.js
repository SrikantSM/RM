var parentElements = {

  managerContactCard: {

    popover: element(
      by.control({
        controlType: "sap.m.Popover"
      })),

    headerTitle: element(
      by.id("application-myProjectExperienceUi-Display-component---idInfoPanel")
    ),

    contactDetails: element(
       by.id("application-myProjectExperienceUi-Display-component---idInfoPanel--idSectionAdditionalContent")
     )

},

  consultantHeaders: {

    title: element(
      by.control({
        controlType: "sap.uxap.ObjectPageDynamicHeaderTitle",
        interaction: "focus"
      })),

      content: element(
      by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::HeaderContentContainer'))

    },

}

var basicData = {

  elements: {

    orgInfo: parentElements.consultantHeaders.content.element(
      by.control({
        controlType: "sap.m.Title",
        properties: {
          text: "Organizational Information"
        }
      })),
    
    orgInfoCostCenterLabel: parentElements.consultantHeaders.content.element(
      by.control({
          controlType: 'sap.m.Label',
          properties: {
              text: 'Cost Center:',
          },
      }),
    ),

    orgInfoResOrgLabel: parentElements.consultantHeaders.content.element(
      by.control({
        controlType: "sap.m.Label",
        properties: {
          text: "Resource Organization:"
        }})),

  }
};

var actions = {
  getHeaderTitle: function(consultantName) {
    var title = parentElements.consultantHeaders.title.element(
      by.control({
        controlType: "sap.m.Title",
        properties: {
          text: consultantName
        }}));
    return title;
  },

  getHeaderLabel: function(consultantProfile) {
    var profile = parentElements.consultantHeaders.title.element(
      by.control({
        controlType: "sap.m.Label",
        properties: {
          text: consultantProfile
        }}));
    return profile;
  },

  getContactInfoEmailValue: function(consultantEmail) {
    var email = parentElements.consultantHeaders.content.element(
      by.control({
        controlType: "sap.ui.mdc.Field",
        properties: {
          value: consultantEmail
        }}));
    return email;
  },

  getWorkerCostCenterValue(consultantCostCenter) {
    const costCenter = parentElements.consultantHeaders.content.element(
        by.control({
            controlType: 'sap.m.Text',
            properties: {
                text: consultantCostCenter,
            },
        }),
    );
    return costCenter;
},

  onClickEdit: function() {
    var editButton = basicData.elements.headerTitle
      .element(
        by.control({
          controlType: "sap.m.Button",
          properties: {
            text: "Edit"
          }})).click();
  }
};

module.exports = {

  actions: actions,
  basicData: basicData,
  parentElements: parentElements

};
