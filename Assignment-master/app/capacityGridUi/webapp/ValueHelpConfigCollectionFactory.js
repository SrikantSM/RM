sap.ui.define(
	[
		"capacityGridUi/reuse/valuehelp/ValueHelpConfigCollection",
		"capacityGridUi/view/ODataEntities",
		"capacityGridUi/view/table/TablePathAnalysis",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"capacityGridUi/reuse/formatters/DateFormatter"
	],
	function (ValueHelpConfigCollection, ODataEntities, TablePathAnalysis, Filter, FilterOperator, DateFormatter) {
		"use strict";

		return {
			get: function (oBundle, oModels) {
				let oCollection = new ValueHelpConfigCollection();

				oCollection.set("name", {
					modelName: "oDataV4",
					entityPath: "/" + ODataEntities.RESOURCE_DETAILS_ENTITY_SET,
					entityName: oBundle.getText("NAME"),
					idProperty: "fullName",
					textProperty: "fullName",
					properties: [
						{ name: "firstName", label: oBundle.getText("FIRST_NAME"), filterable: true },
						{ name: "lastName", label: oBundle.getText("LAST_NAME"), filterable: true },
						{ name: "fullName", label: oBundle.getText("FULL_NAME"), filterable: true }
					]
				});

				oCollection.set("costCenter", {
					modelName: "oDataV4",
					entityPath: "/" + ODataEntities.COST_CENTER_ENTITY_SET,
					entityName: oBundle.getText("COST_CENTER"),
					idProperty: "costCenterId",
					textProperty: "costCenterId",
					properties: [
						{
							name: "costCenterId",
							label: oBundle.getText("COSTCENTERID"),
							filterable: true
						},
						{
							name: "costCenterDescription",
							label: oBundle.getText("COSTCENTERDESC"),
							filterable: true
						},
						{
							name: "resourceOrganizationDisplayId",
							additionalName: "resourceOrganizationName",
							label: oBundle.getText("RESOURCE_ORGANIZATION"),
							filterable: true,
							valueHelp: "resourceOrg"
						}
					]
				});

				// this value help is populated from the filter model !
				oCollection.set("resourceOrg", {
					modelName: "oDataV4",
					entityPath: "/" + ODataEntities.RESOURCE_ORG_ENTITY_SET,
					entityName: oBundle.getText("RESOURCE_ORGANIZATION"),
					idProperty: "resourceOrganizationDisplayId",
					textProperty: "resourceOrganizationDisplayId",
					properties: [
						{
							name: "resourceOrganizationDisplayId",
							label: oBundle.getText("RESOURCE_ORGANIZATION"),
							filterable: true,
							groupable: true
						},
						{
							name: "resourceOrganizationName",
							label: oBundle.getText("RESOURCE_ORGANIZATION_DESCRIPTION"),
							filterable: true,
							groupable: true
						}
					]
				});

				oCollection.set("project", {
					modelName: "oDataV4",
					entityPath: "/" + ODataEntities.PROJECT_VH_ENTITY_SET,
					entityName: oBundle.getText("PROJECT"),
					idProperty: "ID",
					textProperty: "ID",
					properties: [
						{ name: "ID", label: oBundle.getText("PROJECTID"), filterable: true },
						{ name: "name", label: oBundle.getText("PROJECTNAME"), filterable: true }
					]
				});

				oCollection.set("projectRole", {
					modelName: "oDataV4",
					entityPath: "/" + ODataEntities.PROJECT_ROLE_VH_ENTITY_SET,
					entityName: oBundle.getText("PROJECT_ROLE"),
					idProperty: "name",
					textProperty: "name",
					properties: [{ name: "name", label: oBundle.getText("PROJECT_ROLE"), filterable: true }]
				});

				oCollection.set("referenceObject", {
					modelName: "oDataV4",
					entityPath: "/" + ODataEntities.REFERENCE_OBJECT_SET,
					entityName: oBundle.getText("REFERENCE_OBJECT_ID"),
					idProperty: "displayId",
					textProperty: "displayId",
					properties: [
						{ name: "displayId", label: oBundle.getText("REFERENCE_OBJECT_ID"), filterable: true },
						{ name: "name", label: oBundle.getText("REFERENCE_OJECT_NAME"), filterable: true }
					]
				});

				oCollection.set("customer", {
					modelName: "oDataV4",
					entityPath: "/" + ODataEntities.CUSTOMER_VH_ENTITY_SET,
					entityName: oBundle.getText("CUSTOMER"),
					idProperty: "ID",
					textProperty: "ID",
					properties: [
						{ name: "ID", label: oBundle.getText("CUSTOMERID"), filterable: true },
						{ name: "name", label: oBundle.getText("CUSTOMERNAME"), filterable: true }
					]
				});

				oCollection.set("request", {
					modelName: "oDataV4",
					entityPath: "/" + ODataEntities.REQUEST_VH_ENTITY_SET,
					entityName: oBundle.getText("REQUEST"),
					idProperty: "displayId",
					textProperty: "displayId",
					setDialogMaxWidth: true,
					properties: [
						{ name: "displayId", label: oBundle.getText("REQUESTID"), filterable: true },
						{ name: "name", label: oBundle.getText("REQUESTNAME"), filterable: true },
						{
							name: "projectId",
							additionalName: "projectName",
							label: oBundle.getText("PROJECT"),
							additionalFilterLabel: oBundle.getText("PROJECTID"),
							filterable: true,
							valueHelp: "project"
						},
						{
							name: "processingResourceOrganizationId",
							additionalName: "processingResourceOrganizationName",
							label: oBundle.getText("RESOURCE_ORGANIZATION"),
							filterable: true,
							valueHelp: "resourceOrg"
						},
						{
							name: "customerId",
							additionalName: "customerName",
							label: oBundle.getText("CUSTOMER"),
							additionalFilterLabel: oBundle.getText("CUSTOMERID"),
							filterable: true,
							valueHelp: "customer"
						},
						{
							name: "startDate",
							label: oBundle.getText("REQUEST_START_DATE"),
							filterable: false,
							formatter: function (sDate) {
								return sDate ? DateFormatter.dateByDay(new Date(sDate)) : "";
							}
						},
						{
							name: "endDate",
							label: oBundle.getText("REQUEST_END_DATE"),
							filterable: false,
							formatter: function (sDate) {
								return sDate ? DateFormatter.dateByDay(new Date(sDate)) : "";
							}
						},
						{
							name: "requestedCapacityInHours",
							formatter: function (sName) {
								if (sName) {
									return sName + " " + oBundle.getText("HOUR");
								} else {
									return "";
								}
							},
							label: oBundle.getText("REQUIRED_EFFORT_HOURS"),
							filterable: false
						}
					],
					customParameters: function () {
						let sView = oModels.app.getProperty("/selectedView");
						let oDateRange = oModels.date.getDisplayTimePeriod(sView);
						let oCustomParameters = {
							"sap-valid-from": oDateRange.oDateValidFrom,
							"sap-valid-to": oDateRange.oDateValidTo
						};
						return oCustomParameters;
					}
				});

				oCollection.set("createAsgRequest", {
					modelName: "oDataV4",
					entityPath: "/" + ODataEntities.REQUEST_VH_ENTITY_SET,
					entityName: oBundle.getText("REQUEST"),
					idProperty: "Id",
					textProperty: "name",
					setDialogMaxWidth: true,
					properties: [
						{ name: "displayId", label: oBundle.getText("REQUESTID"), filterable: true },
						{ name: "name", label: oBundle.getText("REQUESTNAME"), filterable: true },
						{
							name: "projectId",
							additionalName: "projectName",
							label: oBundle.getText("PROJECT"),
							additionalFilterLabel: oBundle.getText("PROJECTID"),
							filterable: true,
							valueHelp: "project"
						},
						{
							name: "processingResourceOrganizationId",
							defaultFilter: true,
							filterOnly: true,
							label: oBundle.getText("RESOURCE_ORGANIZATION"),
							filterable: true,
							formatter: function (oContext) {
								let sAsgPath = oContext.getPath();
								let oAnalysis = new TablePathAnalysis(sAsgPath);
								let sResourceOrg = oModels.table.getProperty(oAnalysis.resourcePath + "/resourceOrganizationIdForDisplay");
								return sResourceOrg;
							},
							value: "resourceOrg"
						},
						{
							name: "customerId",
							additionalName: "customerName",
							label: oBundle.getText("CUSTOMER"),
							additionalFilterLabel: oBundle.getText("CUSTOMERID"),
							filterable: true,
							valueHelp: "customer"
						},
						{
							name: "startDate",
							label: oBundle.getText("REQUEST_START_DATE"),
							filterable: false,
							formatter: function (sDate) {
								return sDate ? DateFormatter.dateByDay(new Date(sDate)) : "";
							}
						},
						{
							name: "endDate",
							label: oBundle.getText("REQUEST_END_DATE"),
							filterable: false,
							formatter: function (sDate) {
								return sDate ? DateFormatter.dateByDay(new Date(sDate)) : "";
							}
						},
						{
							name: "requestedCapacityInHours",
							formatter: function (sName) {
								if (sName) {
									return sName + " " + oBundle.getText("HOUR");
								} else {
									return "";
								}
							},
							label: oBundle.getText("REQUIRED_EFFORT_HOURS"),
							filterable: false
						}
					],
					customParameters: function () {
						let sView = oModels.app.getProperty("/selectedView");
						let oDateRange = oModels.date.getDisplayTimePeriod(sView);
						let oCustomParameters = {
							"sap-valid-from": oDateRange.oDateValidFrom,
							"sap-valid-to": oDateRange.oDateValidTo
						};
						return oCustomParameters;
					},
					customFilters: function (oContext) {
						let aFilters = [];
						let sAsgPath = oContext.getPath();
						let oAnalysis = new TablePathAnalysis(sAsgPath);
						let sResourceOrg = oModels.table.getProperty(oAnalysis.resourcePath + "/resourceOrganizationIdForDisplay");
						aFilters.push(
							new Filter({
								path: "requestStatusCode",
								operator: FilterOperator.EQ,
								value1: 0
							})
						);
						aFilters.push(
							new Filter({
								path: "processingResourceOrganizationId",
								operator: FilterOperator.EQ,
								value1: sResourceOrg
							})
						);
						return aFilters;
					}
				});

				return oCollection;
			}
		};
	}
);
