sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "myResourcesUi/reuse/nav/objectPageNav"
], function (Controller, JSONModel, objectPageNav) {
    "use strict";
    return Controller.extend("controller.ResourceQuickView",
        {

            getResourcePopupModel: function (oEmployee, resourceID, oi18nModel) {
                var oEmployeeModel = new JSONModel();
                var oData = {
                    "pages": [{
                        "pageId": "employeePageId",
                        "header": oi18nModel.getProperty("QUICKVIEW_TITLE"),
                        "title": oEmployee.name || "-",
                        "titleUrl": this.onNavigatetoResourceObjectPage(resourceID),
                        "description": oEmployee.role || "-",
                        "ID": `../myResourcesUi/odata/v4/MyResourcesService/ProjectExperienceHeader(ID=${oEmployee.ID},IsActiveEntity=true)/profilePhoto/profileThumbnail`,
                        "initials": oEmployee.initials || "-",
                        "groups": [{
                            "heading": oi18nModel.getProperty("ORGANIZATIONAL_INFORMATION"),
                            "elements": [{
                                "label": oi18nModel.getProperty("WORKER_TYPE"),
                                "value": oEmployee.workerType.name || "-"
                            },
                            {
                                "label": oi18nModel.getProperty("RESOURCE_ORGANIZATION"),
                                "value": oEmployee.resourceOrg || "-"
                            },
                            {
                                "label": oi18nModel.getProperty("COST_CENTER"),
                                // "value": oEmployee.costCenterDescription || "-" + " (" + (oEmployee.costCenter || "-") + ")"
                                "value": this._prepareCostCenterDisplay(oEmployee.costCenter, oEmployee.costCenterDescription)
                            },
                            {
                                "label": oi18nModel.getProperty("MANAGER_NAME"),
                                "value": oEmployee.toManager ? oEmployee.toManager.managerName || "-" : "-"
                            }
                            ]
                        },
                        {
                            "heading": oi18nModel.getProperty("CONTACT_INFORMATION"),
                            "elements": [{
                                "label": oi18nModel.getProperty("MOBILE_NUMBER"),
                                "value": oEmployee.mobilePhoneNumber || "-",
                                "elementType": "phone"
                            },
                            {
                                "label": oi18nModel.getProperty("EMAIL_ID"),
                                "value": oEmployee.emailAddress || "-",
                                "emailSubject": "Subject",
                                "elementType": "email"

                            },
                            {
                                "label": oi18nModel.getProperty("OFFICE_LOCATION"),
                                "value": oEmployee.officeLocation || "-"
                            }
                            ]
                        }
                        ]
                    }]
                };
                oEmployeeModel.setData(oData);
                return new Promise((resolve, reject) => {
                    resolve(oEmployeeModel);
                });
            },

            onNavigatetoResourceObjectPage: function (resourceID) {
                let oParms = {
                    semanticObject: "myResourcesUi",
                    action: "Display",
                    params: { ID: resourceID }
                };
                return objectPageNav(oParms);
            },

            _prepareCostCenterDisplay: function (costCenter, description) {
                var result = "-";
                if (costCenter) {
                    result = description + " (" + costCenter + ")";
                }
                return result;
            }
        });
});
