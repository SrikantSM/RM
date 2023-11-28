sap.ui.define(
	[
		"capacityGridUi/reuse/controller/BaseFragmentController",
		"sap/ui/model/json/JSONModel",
		"capacityGridUi/reuse/nav/crossAppNav",
		"sap/ui/model/Filter",
		"capacityGridUi/reuse/formatters/DateFormatter",
		"capacityGridUi/view/ODataEntities",
		"capacityGridUi/reuse/formatters/descAndCodeFormatter"
	],
	function (BaseFragmentController, JSONModel, crossAppNav, Filter, DateFormatter, ODataEntities, descAndCodeFormatter) {
		"use strict";

		return BaseFragmentController.extend("capacityGridUi.view.quickView.QuickView", {
			constructor: function (component, dependent) {
				BaseFragmentController.prototype.constructor.call(this, {
					fragmentName: "capacityGridUi.view.quickView.QuickView",
					fragmentId: component.createId("QuickView"),
					component: component,
					dependent: dependent
				});
				this.injectMembers();
			},
			closeContactCardOnScroll: function () {
				this.getFragment().then(function (oFragment) {
					oFragment.close();
				});
			},
			openResource: function (oResourceLink) {
				let oResource = oResourceLink.getBindingContext().getObject();
				let aGroupingFields = [
					"ID",
					"emailAddress",
					"mobileNumber",
					"resourceName",
					"managerDetails/managerName",
					"costCenterForDisplay",
					"resourceOrganizationNameForDisplay",
					"resourceOrganizationIdForDisplay",
					"isPhotoPresent",
					"workerType",
					"jobTitle",
					"country",
					"workforcePersonID",
					"employeeExternalID"
				];
				let sFromDate = this.models.date.getProperty("/sFromDate");
				let sEndDate = this.models.date.getProperty("/sEndDate");
				oResourceLink.setBusy(true);
				this._getResourceDetails(oResource.ID, sFromDate, sEndDate, aGroupingFields).then(
					function (oResourceDetails) {
						this.getFragment()
							.then(
								function (oFragment) {
									let oResourcePopupModel = this._getResourcePopupModel(oResourceDetails);
									let oHBox = oResourceLink.getParent();
									oFragment.setModel(oResourcePopupModel);
									oFragment.close();
									oFragment.openBy(oHBox); // opening by ResourceLink aligns the quick view with the resourceLink
								}.bind(this)
							)
							.finally(oResourceLink.setBusy(false));
					}.bind(this)
				);
			},

			_getResourceDetails: function (sResourceId, sFromDate, sEndDate, aGroupingFields) {
				return new Promise(
					function (resolve, reject) {
						let aFilters = [
							new Filter({
								path: "ID",
								operator: "EQ",
								value1: sResourceId
							})
						];
						let oBinding = this.models.oDataV4.bindList("/" + ODataEntities.RESOURCES_ENTITY_SET, undefined, undefined, aFilters, {
							$apply: "groupby((" + aGroupingFields.toString() + "),aggregate(validFrom with min as startdatenew))",
							"sap-valid-from": DateFormatter.dateToEdm(sFromDate),
							"sap-valid-to": DateFormatter.dateToEdm(sEndDate)
						});
						return oBinding.requestContexts().then(
							function (aContexts) {
								resolve(aContexts[0].getObject());
							},
							function (oError) {
								this.models.message.addServerMessage("transient", oError);
								this.oControllers.messageDialog.open();
								reject();
							}.bind(this)
						);
					}.bind(this)
				);
			},

			openRequest: function (oRequestControl) {
				let oAssignmentLocal = oRequestControl.getBindingContext().getObject();
				let sFromDate = this.models.date.getProperty("/sFromDate");
				let sEndDate = this.models.date.getProperty("/sEndDate");
				let aSelectFields = [
					"requestName",
					"requestDisplayId",
					"resourceRequest_ID",
					"requestedResourceOrganizationName",
					"requestedResourceOrganizationDisplayId",
					"requestStartDate",
					"requestEndDate",
					"requestStatusDescription"
				];
				oRequestControl.setBusy(true);
				this._getRequestDetails(oAssignmentLocal.resourceRequest_ID, sFromDate, sEndDate, aSelectFields).then(
					function (oRequestDetails) {
						this.getFragment()
							.then(
								function (oFragment) {
									let oRequestPopupModel = this._getRequestPopupModel(oAssignmentLocal, oRequestDetails);
									let oHBox = oRequestControl.getParent();
									oFragment.setModel(oRequestPopupModel);
									oFragment.close();
									oFragment.openBy(oHBox); // opening by requestControl aligns the quick view with the requestLink or requestInputField
								}.bind(this)
							)
							.finally(oRequestControl.setBusy(false));
					}.bind(this)
				);
			},

			_getRequestDetails: function (sRequestId, sFromDate, sEndDate, aSelectFields) {
				return new Promise(
					function (resolve, reject) {
						let aFilters = [
							new Filter({
								path: "resourceRequest_ID",
								operator: "EQ",
								value1: sRequestId
							})
						];
						let oBinding = this.models.oDataV4.bindList("/" + ODataEntities.REQUEST_ENTITY_SET, undefined, undefined, aFilters, {
							"sap-valid-from": DateFormatter.dateToEdm(sFromDate),
							"sap-valid-to": DateFormatter.dateToEdm(sEndDate),
							$select: aSelectFields
						});
						return oBinding.requestContexts().then(
							function (aContexts) {
								resolve(aContexts[0].getObject());
							},
							function (oError) {
								this.models.message.addServerMessage("transient", oError);
								this.oControllers.messageDialog.open();
								reject();
							}.bind(this)
						);
					}.bind(this)
				);
			},

			_getRequestPopupModel: function (oAssignmentLocal, oRequestDetails) {
				let oRequestPopupModel = new JSONModel();
				oRequestPopupModel.setData({
					pages: [
						{
							pageId: "AssignmentPageId",
							header: this.oBundle.getText("RESOURCE_REQUEST"),
							title: oRequestDetails.requestName,
							avatarVisible: false,
							titleUrl: this.onNavigatetoResourceRequest(oRequestDetails.resourceRequest_ID),
							description: oRequestDetails.requestDisplayId,
							groups: [
								{
									heading: this.oBundle.getText("REQUEST_DETAILS"),
									elements: [
										{
											label: this.oBundle.getText("REQUESTED_RESOURCE_ORGANIZATION"),
											value: descAndCodeFormatter(
												oRequestDetails.requestedResourceOrganizationName,
												oRequestDetails.requestedResourceOrganizationDisplayId
											)
										},
										{
											label: this.oBundle.getText("REQUEST_START_DATE"),
											value: DateFormatter.dateByDay(new Date(oRequestDetails.requestStartDate))
										},
										{
											label: this.oBundle.getText("REQUEST_END_DATE"),
											value: DateFormatter.dateByDay(new Date(oRequestDetails.requestEndDate))
										},
										{
											label: this.oBundle.getText("REQUEST_STATUS"),
											value: oRequestDetails.requestStatusDescription
										}
									]
								},
								{
									heading: this.oBundle.getText("STAFFING_SUMMARY"),
									elements: [
										{
											label: this.oBundle.getText("STAFFED_EFFORT"),
											value:
												oAssignmentLocal.staffedHours +
												" " +
												this.oBundle.getText("HOUR") +
												" " +
												"/" +
												" " +
												oAssignmentLocal.RequiredEffort +
												" " +
												this.oBundle.getText("HOUR")
										},
										{
											label: this.oBundle.getText("REMAINING_EFFORT"),
											value: this.oBundle.getText("REMAINING_HOURS", [oAssignmentLocal.RemainingEffort])
										}
									]
								}
							]
						}
					]
				});
				return oRequestPopupModel;
			},

			_getResourcePopupModel: function (oResourceDetails) {
				let oResourcePopUpModel = new JSONModel();
				oResourcePopUpModel.setData({
					pages: [
						{
							pageId: "employeePageId",
							header: this.oBundle.getText("RESOURCE"),
							icon: "../capacityGridUi/odata/v4/profilePhoto/profileThumbnail(" + oResourceDetails.workforcePersonID + ")",
							title: oResourceDetails.resourceName + " (" + oResourceDetails.employeeExternalID + ")",
							tooltip: oResourceDetails.resourceName + " (" + oResourceDetails.employeeExternalID + ")",
							avatarVisible: true,
							titleUrl: this.onNavigatetoConsultantProfile(oResourceDetails.workforcePersonID),
							description: oResourceDetails.jobTitle,
							groups: [
								{
									heading: this.oBundle.getText("ORGANIZATIONAL_INFORMATION"),
									elements: [
										{
											label: this.oBundle.getText("WORKER_TYPE"),
											value: oResourceDetails.workerType
										},
										{
											label: this.oBundle.getText("RESOURCE_ORGANIZATION"),
											value: descAndCodeFormatter(
												oResourceDetails.resourceOrganizationNameForDisplay,
												oResourceDetails.resourceOrganizationIdForDisplay
											)
										},
										{
											label: this.oBundle.getText("COST_CENTER"),
											value: oResourceDetails.costCenterForDisplay
										},
										{
											label: this.oBundle.getText("MANAGER"),
											value: oResourceDetails.managerDetails.managerName
										}
									]
								},
								{
									heading: this.oBundle.getText("CONTACT_INFORMATION"),
									elements: [
										{
											label: this.oBundle.getText("MOBILE"),
											value: oResourceDetails.mobileNumber,
											elementType: "phone"
										},
										{
											label: this.oBundle.getText("EMAIL"),
											value: oResourceDetails.emailAddress,
											emailSubject: "Subject",
											elementType: "email"
										},
										{
											label: this.oBundle.getText("OFFICE_LOCATION"),
											value: oResourceDetails.country
										}
									]
								}
							]
						}
					]
				});
				return oResourcePopUpModel;
			},

			onNavigatetoResourceRequest: function (resourceRequestID) {
				let oParms = {
					semanticObject: "ResourceRequest",
					action: "Display",
					params: { ID: resourceRequestID }
				};
				return crossAppNav(oParms);
			},

			onNavigatetoConsultantProfile: function (employeeID) {
				let oParms = {
					semanticObject: "myResourcesUi",
					action: "Display",
					params: { ID: employeeID }
				};
				return crossAppNav(oParms);
			}
		});
	}
);
