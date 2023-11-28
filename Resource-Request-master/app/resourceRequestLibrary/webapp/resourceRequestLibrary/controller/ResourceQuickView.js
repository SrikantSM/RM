sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function(Controller, JSONModel, MessageToast) {
	return Controller.extend("resourcerequest.controller.ResourceQuickView", {
		getNavigationHash: async function(oEmployeeID) {
			// get a handle on the global XAppNav service
			const oShellServices = sap.ushell.Container.getService("CrossApplicationNavigation");
			const oIntent = {
				target: {
					semanticObject: "myResourcesUi",
					action: "Display"
				},
				params: {
					"ID": oEmployeeID
				}
			};
			const aResponse = await oShellServices.isNavigationSupported([oIntent]);
			if (aResponse[0].supported) {
				return oShellServices.hrefForExternal(oIntent);
			} else {
				return false;
			}
		},

		getResourcePopupModel: async function(oEmployee, oi18nModel, bStaffApp) {
			const oEmployeeModel = new JSONModel();
			let serviceName = "";
			let appName = "";
			if (bStaffApp) {
				serviceName = "ProcessResourceRequestService";
				appName = "staffResourceRequest";
			} else {
				serviceName = "ManageResourceRequestService";
				appName = "manageResourceRequest";
			}
			const oData = {
				"pages": [{
					"pageId": "employeePageId",
					"header": oi18nModel.getProperty("RESOURCE"),
					// eslint-disable-next-line max-len
					"icon": `../${appName}/odata/v4/${serviceName}/ConsultantProfileHeaders(${oEmployee.workforcePersonID})/profilePhoto/profileThumbnail`,
					"title": oEmployee.fullName + " (" + oEmployee.externalID + ")" || "-",
					"description": oEmployee.role || "-",
					"initials": oEmployee.initials || "-",
					"groups": [{
						"heading": oi18nModel.getProperty("ORGANIZATIONAL_INFORMATION"),
						"elements": [{
							"label": oi18nModel.getProperty("WORKER_TYPE"),
							"value": oEmployee.workerType.name || "-",
						},
						{
							"label": oi18nModel.getProperty("RESOURCE_ORGANIZATION"),
							"value": (oEmployee.resourceOrg + " (" + oEmployee.resourceOrgCode + ") ") || "-",
						},
						{
							"label": oi18nModel.getProperty("COST_CENTER"),
							"value": oEmployee.costCenterDesc || "-",
						},
						{
							"label": oi18nModel.getProperty("MANAGER"),
							"value": oEmployee.toManager ? oEmployee.toManager.managerFullName || "-" : "-",
						}
						]
					},
					{
						"heading": oi18nModel.getProperty("CONTACT_INFORMATION"),
						"elements": [{
							"label": oi18nModel.getProperty("MOBILE"),
							"value": oEmployee.mobilePhoneNumber || "-",
							"elementType": "phone"
						},
						{
							"label": oi18nModel.getProperty("EMAIL"),
							"value": oEmployee.emailAddress || "-",
							"emailSubject": "Subject",
							"elementType": "email"
						},
						{
							"label": oi18nModel.getProperty("OFFICE_LOCATION"),
							"value": oEmployee.country_name || "-",
						}
							// ,
							// {
							//  "label": oi18nModel.getProperty("MANAGER"),
							//  "value": oEmployee.toManager ? oEmployee.toManager.managerName || "-" : "-",
							// }
						]
					}
					]
				}]
			};
			const sHash = await this.getNavigationHash(oEmployee.workforcePersonID);
			// const sHash1 = await this.getNavigationHash(oEmployee.managerID);
			if (sHash) {
				oData["pages"][0]["titleUrl"] = window.location.href.split("#")[0] + sHash;
			}
			/* if (sHash1) {
				oData["pages"][0]["groups"][0]["elements"][3]["url"] = window.location.href.split("#")[0] + sHash1;
				oData["pages"][0]["groups"][0]["elements"][3]["type"] = "link";
			}*/
			oEmployeeModel.setData(oData);
			return new Promise((resolve, reject) => {
				resolve(oEmployeeModel);
			});
		}
	});
});
