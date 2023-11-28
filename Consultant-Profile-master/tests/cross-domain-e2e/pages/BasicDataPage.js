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
      by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::ObjectPage-OPHeaderContent'))

    },

}

var basicData = {

  elements: {

    orgInfo: parentElements.consultantHeaders.content.element(
      by.control({
        controlType: "sap.m.Title",
        properties: {
          text: "Organisation Information"
        }
      })),

    orgInfoDeptLabel: parentElements.consultantHeaders.content.element(
      by.control({
        controlType: "sap.m.Label",
        properties: {
          text: "Delivery Organization: "
        }})),

   orgInfoOfficeLocLabel: parentElements.consultantHeaders.content.element(
     by.control({
       controlType: "sap.m.Label",
       properties: {
         text: "Office Location: "
       }
     })),

    orgInfoManagerLabel: parentElements.consultantHeaders.content.element(
      by.control({
        controlType: "sap.m.Label",
        properties: {
          text: "Manager: "
        }})),

    contactInfo: parentElements.consultantHeaders.content.element(
      by.control({
        controlType: "sap.m.Title",
        properties: {
          text: "Contact Information"
        }})),

    contactInfoMobileNoLabel: parentElements.consultantHeaders.content.element(
      by.control({
        controlType: "sap.m.Label",
        properties: {
          text: "Mobile: "
        }})),

    contactInfoEmailLabel: parentElements.consultantHeaders.content.element(
      by.control({
        controlType: "sap.m.Label",
        properties: {
          text: "Email: "
        }})),

    managerContactCardHeader: parentElements.managerContactCard.headerTitle.element(
      by.control({
        controlType: "sap.m.Label",
        properties: {
          text: "Test Usere2e2"
        }})),

    managerContactCardContactDetails: parentElements.managerContactCard.contactDetails.element(
      by.control({
        controlType: "sap.ui.core.Title",
        properties: {
          text: "Contact Information"
        }})),

    managerContactCardContactDetailsNameLabel: parentElements.managerContactCard.contactDetails.element(
      by.control({
        controlType: "sap.m.Label",
        properties: {
          text: "Name"
        }})),

    managerContactCardContactDetailsEmailLabel: parentElements.managerContactCard.contactDetails.element(
      by.control({
        controlType: "sap.m.Label",
        properties: {
          text: "E-Mail"
        }})),

    managerContactCardContactDetailsMobileLabel: parentElements.managerContactCard.contactDetails.element(
      by.control({
        controlType: "sap.m.Label",
        properties: {
          text: "Mobile"
        }}))

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

  getOrgInfoDeptValue: function(consultantDept) {
    var dept = parentElements.consultantHeaders.content.element(
      by.control({
        controlType: "sap.ui.mdc.Field",
        properties: {
          value: consultantDept
        }}));
    return dept;
  },

  getOrgInfoOfficeLocValue: function(consultantOfficeLoc) {
    var officeLocation = parentElements.consultantHeaders.content.element(
      by.control({
        controlType: "sap.ui.mdc.Field",
        properties: {
          value: consultantOfficeLoc
        }}));
    return officeLocation;
  },

  getOrgInfoManagerValue: function(consultantManager) {
    var manager = parentElements.consultantHeaders.content.element(
      by.control({
        controlType: "sap.ui.mdc.Field",
        properties: {
          value: consultantManager
        }}));
    return manager;
  },

  getContactInfoMobileNoValue: function(consultantMobNum) {
    var number = parentElements.consultantHeaders.content.element(
      by.control({
        controlType: "sap.ui.mdc.Field",
        properties: {
          value: consultantMobNum
        }}));
    return number;
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

  navigateToManager: function(consultantManager) {
    debugger;
    this.getOrgInfoManagerValue(consultantManager).click();
  },

  getManagerContactCardNameValue: function(managerName) {
    var name = parentElements.managerContactCard.contactDetails.element(
      by.control({
        controlType: "sap.m.Label",
        properties: {
          text: managerName
        }}));
    return name;
  },

  getManagerContactCardEmailValue: function(managerEmail) {
    var email = parentElements.managerContactCard.contactDetails.element(
      by.control({
        controlType: "sap.m.Link",
        properties: {
          text: managerEmail
        }}));
    return email;
  },

  getManagerContactCardMobileNoValue: function(managerMobNo) {
    var mobileNo = parentElements.managerContactCard.contactDetails.element(
      by.control({
        controlType: "sap.m.Link",
        properties: {
          text: managerMobNo
        }
      }));
    return mobileNo;
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
