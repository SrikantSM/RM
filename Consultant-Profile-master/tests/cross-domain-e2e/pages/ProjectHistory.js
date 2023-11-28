var currentProfile = '';

var parentElements = {

    subSection : element(by.id('consultantProfileUi::ConsultantProfileObjectPage--fe::opss::PriorExperience3')),

    objectPage: element(by.id("consultantProfileUi::Project"+currentProfile+"ObjectPage--fe::op")),

    headerTitle : element(by.control({
        controlType: "sap.uxap.ObjectPageDynamicHeaderTitle"
    })),

    headerContent : element(by.control({
        controlType: "sap.uxap.ObjectPageDynamicHeaderContent"
    })),

    objectPageSections : {
        skillsRequired: element(by.id("consultantProfileUi::Project"+currentProfile+"ObjectPage--fe::ops::SkillsRequired")),
        comments: element(by.id("consultantProfileUi::Project"+currentProfile+"ObjectPage--fe::ops::Comments"))
    }
    
 
}

var projectHistory = {

   projectDetails : {

        title : parentElements.headerContent.element(by.control({
            controlType: "sap.m.Title",
            properties: {
                text : "Project Details"
            }})),
        
        customerLabel: parentElements.headerContent.element(by.control({
            controlType: "sap.m.Label",
            properties: {
                text: "Customer : "
            }})),

        effortLabel: parentElements.headerContent.element(by.control({
            controlType: "sap.m.Label",
            properties : {
                text: "Effort: "
            }})),

        assigmentStartDate: parentElements.headerContent.element(by.control({
            controlType: "sap.m.Label",
            properties : {
                text: "Assignment Start: "
            }})),
        
        assigmentEndDate: parentElements.headerContent.element(by.control({
            controlType: "sap.m.Label",
            properties : {
                text: "Assignment End: "
            }}))

    },

    employeeInformation: {

        companyLabel : parentElements.headerContent.element(by.control({
            controlType: "sap.m.Label",
            properties: {
                text: "Company : "
            }})),

        roleLabel : parentElements.headerContent.element(by.control({
            controlType: "sap.m.Label",
            properties : {
                text: "Role: "
            }}))
    },

    anchorBar : parentElements.objectPage.element(by.id("consultantProfileUi::Project"+currentProfile+"ObjectPage--fe::op-anchBar")),

    table: {
        skillsRequired: element(by.id("consultantProfileUi::Project"+currentProfile+"ObjectPage--fe::table::skillsUsed::LineItem-innerTable"))
    }

}





var actions = {

    currentTab: async function(workExperienceType) {

        if(workExperienceType == "Internal Work Experience") 
        currentProfile = "Current";
        else if(workExperienceType == "External Work Experience")
        currentProfile = "History";

    },

    navigateToProjectHistory: async function(entity) {
        
        console.log("\n current profile is  \n", currentProfile);
        
        var splitButtonID = "consultantProfileUi::ConsultantProfileObjectPage--fe::op-anchBar-consultantProfileUi::ConsultantProfileObjectPage--fe::ops::PriorExperience-anchor-internalSplitBtn";
        var splitButton = element(by.id(splitButtonID));

        var dropDownToProjects = splitButton.element(by.control({
            controlType: "sap.ui.core.Icon",
            properties: { src : "sap-icon://slim-arrow-down"}
        }));
        
        browser.wait(function(){return dropDownToProjects.isPresent();},105000);
        await dropDownToProjects.click();

        var menu = element(by.control({
            controlType: "sap.ui.unified.Menu"
        }));

        var menuItems = menu.all(by.control({
            controlType: "sap.ui.unified.MenuItem"
        }));

        var noOfRows = await menuItems.count();
        
        for(var i=0; i<noOfRows; i++) {
            
            if( await menuItems.get(i).getText() == entity) {

                await menuItems.get(i).click();
                break;

            }
        }

    },

    navigateToProject: async function(projectName) {
        console.log("\n current profile is  \n", currentProfile);

        if(currentProfile == "Current") 
        var tableID = "consultantProfileUi::ConsultantProfileObjectPage--fe::table::projectCurrent::LineItem-innerTable";
        else if(currentProfile == "History")
        var tableID = "consultantProfileUi::ConsultantProfileObjectPage--fe::table::projectPrevious::LineItem-innerTable";

        var table = element(by.id(tableID));
        var tableRows = table.all(by.control({
             controlType: "sap.m.ColumnListItem"
        }));
        var projectToBeSelected;
        var noOfRows = await tableRows.count();

        for(var i=0; i<noOfRows; i++) {
            var row = tableRows.get(i).element(by.control({
                controlType: "sap.ui.mdc.Field"
            }));
            var value = row.getText();
            if(projectName == await value) {
                projectToBeSelected = i;
                break;
            }
        }

        await tableRows.get(projectToBeSelected).click();
    },

    navigateToSkillRequired: async function(workExperienceType) {

        var skillRequiredButton = projectHistory.anchorBar.element(by.id('consultantProfileUi::Project'+currentProfile+'ObjectPage--fe::op-anchBar-consultantProfileUi::Project'+currentProfile+'ObjectPage--fe::ops::SkillsRequired-anchor'));
        await skillRequiredButton.click();
    }, 

    navigateToComments: async function() {

        var commentsButton = projectHistory.anchorBar.element(by.id("consultantProfileUi::Project"+ currentProfile +"ObjectPage--fe::op-anchBar-consultantProfileUi::Project"+ currentProfile +"ObjectPage--fe::ops::Comments-anchor"));
        await commentsButton.click();
    },

    getSkillsRequiredValues: async function() {
        
        var tableValues = projectHistory.table.skillsRequired.all(element(
            by.control({
                controlType: "sap.m.ColumnListItem"
            })
        ));

        return tableValues;
        
    },

    getProjectTitle: async function(projectTitle) {

        var titleElement = parentElements.headerTitle.element(by.control({
            controlType: "sap.m.Title",
            properties : { 
                text : projectTitle 
            }}));
        return titleElement;
    },

    getCustomerName: async function(customerName) {

        var name = parentElements.headerContent.element(by.control({
            controlType: "sap.ui.mdc.Field",
            properties : {
                value : customerName
            }}));

        return name;
    },

    getEfforts: async function(effortsNumber) {

        var efforts = parentElements.headerContent.element(by.control({
            controlType: "sap.ui.mdc.Field",
            properties : {
                value : effortsNumber
            }}));
            
        return efforts;

    },

    getAssingmentStartDate: async function(startDate) {

        var date = parentElements.headerContent.element(by.control({
            controlType: "sap.ui.mdc.Field",
            properties : {
                value : startDate
            }}));
            
        return date;

    },

    getAssingmentEndDate: async function(endDate) {

        var endDate = parentElements.headerContent.element(by.control({
            controlType: "sap.ui.mdc.Field",
            properties : {
                value : endDate
            }}));
            
        return endDate;

    },




}

module.exports = {
    parentElements : parentElements,
    projectHistory : projectHistory,
    actions : actions
}