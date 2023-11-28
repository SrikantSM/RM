sap.ui.define(
	[
		"capacityGridUi/reuse/controller/BaseComponentController",
		"capacityGridUi/reuse/formatters/uilizationPercentStateFormatter",
		"sap/m/ObjectStatus",
		"sap/m/ObjectAttribute",
		"sap/m/HBox",
		"sap/m/Link",
		"sap/m/Label",
		"sap/m/Text",
		"sap/m/Input",
		"sap/m/Avatar",
		"sap/m/Select",
		"sap/ui/core/Item",
		"sap/ui/core/CustomData",
		"sap/m/ProgressIndicator",
		"sap/ui/layout/VerticalLayout",
		"sap/ui/layout/HorizontalLayout",
		"sap/ui/table/Column",
		"capacityGridUi/view/draft/AssignmentStatus",
		"capacityGridUi/reuse/formatters/descAndCodeFormatter",
		"capacityGridUi/reuse/valuehelp/InputWithValueHelp",
		"sap/tnt/InfoLabel"
	],
	function (
		BaseComponentController,
		formatUtilizationPercentState,
		ObjectStatus,
		ObjectAttribute,
		HBox,
		Link,
		Label,
		Text,
		Input,
		Avatar,
		Select,
		Item,
		CustomData,
		ProgressIndicator,
		VerticalLayout,
		HorizontalLayout,
		Column,
		AssignmentStatus,
		descAndCodeFormatter,
		InputWithValueHelp,
		InfoLabel
	) {
		"use strict";

		return BaseComponentController.extend("capacityGridUi.view.table.TableColumnFactory", {
			constructor: function () {
				BaseComponentController.apply(this, arguments);
				this.injectMembers();
			},

			createNameColumn: function (sWidth) {
				return this._createColumn({
					template: this.createNameTemplate(),
					id: "idNameLabel",
					variantColumnKey: "name",
					label: this.oBundle.getText("NAME"),
					sortProperty: "resourceName",
					visible: true,
					width: sWidth,
					hAlign: "Left"
				});
			},

			createNameTemplate: function () {
				return new HBox({
					alignItems: "Center",
					width: "100%",
					items: [
						new Avatar({
							visible: "{parent}",
							initials: {
								path: "resourceName",
								formatter: this.formatNameInitials
							},
							src: "{profilePicture}",
							displaySize: "XS"
						}),
						new Link({
							visible: "{parent}",
							text: "{resourceName}",
							tooltip: "{resourceName}",
							textAlign: "Begin",
							press: this.oControllers.table.onResourceLinkPress.bind(this.oControllers.table)
						}).addStyleClass("sapUiTinyMarginBegin"),
						new Link({
							text: "{requestName}",
							tooltip: "{requestName}",
							visible: {
								parts: ["child", "changeState"],
								formatter: this.formatRequestLinkVisible
							},
							textAlign: "Begin",
							press: this.oControllers.table.onRequestLinkPress.bind(this.oControllers.table)
						}),
						new Link({
							text: "{requestName}",
							visible: {
								parts: ["child", "changeState"],
								formatter: this.formatRequestLinkVisibleOnDelete
							},
							textAlign: "Begin",
							press: this.oControllers.table.onRequestLinkPress.bind(this.oControllers.table)
						}).addStyleClass("capacityGridUiDeleted"),
						this._getRequestInput(),
						new InfoLabel({
							text: "{i18n>COPIED_ASSIGNMENT}",
							visible: {
								parts: ["child", "copyState"],
								formatter: this.formatInfoLabelCopyVisible
							}
						}).addStyleClass("capacityGridUiCopied"),
						new InfoLabel({
							text: "{i18n>CUT_ASSIGNMENT}",
							visible: {
								parts: ["child", "copyState"],
								formatter: this.formatInfoLabelCutVisible
							}
						}).addStyleClass("capacityGridUiCopied")
					]
				});
			},

			_getRequestInput: function () {
				let oInputRequest = new InputWithValueHelp({
					visible: {
						parts: ["child", "changeState"],
						formatter: this.formatRequestInputVisible
					},
					tooltip: {
						parts: ["requestName", "requestDisplayId"],
						formatter: descAndCodeFormatter
					},
					value: "{requestName}",
					// selectedKey: "{resourceRequest_ID}",
					valueState: "{requestValueState}",
					valueStateText: "{requestValueStateText}",
					change: this.oControllers.draftCreate.onChangeRequest.bind(this.oControllers.draftCreate)
				});
				oInputRequest.configure({
					config: this.oComponent.oValueHelpConfigCollection.get("createAsgRequest"),
					configCollection: this.oComponent.oValueHelpConfigCollection,
					valueHelpDialogController: this.oControllers.table.oRequestValueHelpDialogController
				});
				return oInputRequest;
			},

			createResourceOrgColumn: function (bVisible, sWidth) {
				return this._createColumn({
					template: this.createResourceOrgTemplate(),
					id: "idResourceOrg",
					variantColumnKey: "resourceOrg",
					label: this.oBundle.getText("RESOURCE_ORGANIZATION"),
					sortProperty: "resourceOrganizationNameForDisplay",
					visible: {
						parts: [{ path: "app>/columnsVisibility" }, { value: bVisible }],
						formatter: this.formatColumnVisibility
					},
					width: sWidth,
					hAlign: "Left"
				});
			},

			createResourceOrgTemplate: function () {
				return new Text({
					text: {
						parts: ["resourceOrganizationNameForDisplay", "resourceOrganizationIdForDisplay"],
						formatter: descAndCodeFormatter
					},
					visible: "{parent}",
					tooltip: "{resourceOrg}",
					maxLines: 2
				});
			},

			createCostCenterColumn: function (bVisible, sWidth) {
				return this._createColumn({
					template: this.createCostCenterTemplate(),
					id: "idCostCenterLabel",
					variantColumnKey: "costCenter",
					label: this.oBundle.getText("COST_CENTER"),
					sortProperty: "costCenterForDisplay",
					visible: {
						parts: [{ path: "app>/columnsVisibility" }, { value: bVisible }],
						formatter: this.formatColumnVisibility
					},
					width: sWidth,
					hAlign: "Left"
				});
			},

			createCostCenterTemplate: function () {
				return new Text({
					text: "{costCenter}",
					tooltip: "{costCenter}",
					maxLines: 2
				});
			},

			createWorkerTypeColumn: function (bVisible, sWidth) {
				return this._createColumn({
					template: this.createWorkerTypeTemplate(),
					id: "idWorkerType",
					variantColumnKey: "workerType",
					label: this.oBundle.getText("WORKER_TYPE"),
					sortProperty: "workerType",
					visible: {
						parts: [{ path: "app>/columnsVisibility" }, { value: bVisible }],
						formatter: this.formatColumnVisibility
					},
					width: sWidth,
					hAlign: "Left"
				});
			},

			createWorkerTypeTemplate: function () {
				return new Text({
					text: "{workerType}",
					tooltip: "{workerType}",
					maxLines: 2,
					visible: "{parent}"
				});
			},

			createStaffingSummaryColumn: function (bVisible, sWidth) {
				return this._createColumn({
					template: this.createStaffingSummaryTemplate(),
					id: "idStaffingSummary",
					variantColumnKey: "staffingSummary",
					label: this.oBundle.getText("STAFFING_SUMMARY"),
					sortProperty: null,
					visible: bVisible,
					width: sWidth,
					hAlign: "Left"
				});
			},

			createStaffingSummaryTemplate: function () {
				return new ProgressIndicator({
					displayAnimation: false,
					displayValue: "{staffedHoursText}",
					percentValue: {
						parts: ["staffedHours", "requestedCapacityInHours"],
						formatter: this.formatUtilizationPercent
					},
					showValue: true,
					state: "None",
					width: "100%",
					visible: {
						parts: ["child", "changeState"],
						formatter: this.formatAsgCellVisible
					}
				});
			},

			createStaffingHoursColumn: function (bVisible, sWidth) {
				return this._createColumn({
					template: this.createStaffingHoursTemplate(),
					id: "idStaffingHrs",
					variantColumnKey: "staffingHrs",
					label: this.oBundle.getText("STAFFING_HRS"),
					sortProperty: "avgUtilization",
					visible: {
						parts: [{ path: "app>/columnsVisibility" }, { value: bVisible }],
						formatter: this.formatColumnVisibility
					},
					width: sWidth,
					hAlign: "Right"
				});
			},

			createStaffingHoursTemplate: function () {
				return new VerticalLayout({
					content: [
						new ObjectStatus({
							text: "{avgUtilization} %",
							inverted: true,
							state: {
								path: "avgUtilization",
								formatter: formatUtilizationPercentState
							},
							visible: "{parent}"
						}),
						new Text({
							text: "{assignmentDurationInHours} {i18n>HOUR}",
							visible: {
								parts: ["child", "changeState"],
								formatter: this.formatAsgCellVisible
							}
						})
					]
				});
			},

			createAssignmentStatusColumn: function (bVisible, sWidth) {
				return this._createColumn({
					template: this.createAssignmentStatusTemplate(),
					id: "idAssignmentStatus",
					variantColumnKey: "assignmentStatus",
					label: this.oBundle.getText("ASSIGNMENT_STATUS"),
					sortProperty: null,
					visible: {
						parts: [{ path: "app>/columnsVisibility" }, { value: bVisible }],
						formatter: this.formatColumnVisibility
					},
					width: sWidth,
					hAlign: "Left"
				});
			},

			createAssignmentStatusTemplate: function () {
				return new HBox({
					alignItems: "Center",
					width: "100%",
					items: [
						new Text({
							text: "{assignmentStatusText}",
							visible: {
								parts: ["child", "app>/IsDisplayMode"],
								formatter: this.formatStatusTextVisible
							}
						}),
						new Select({
							items: [
								new Item({
									key: AssignmentStatus.SOFT_BOOKED_STRING,
									text: "{i18n>SOFT_BOOKED}"
								}),
								new Item({
									key: AssignmentStatus.HARD_BOOKED_STRING,
									text: "{i18n>HARD_BOOKED}"
								})
							],
							selectedKey: "{assignmentStatusCode}",
							visible: {
								parts: ["child", "app>/IsEditMode", "changeState"],
								formatter: this.formatStatusSelectVisible
							},
							editable: {
								parts: ["isAssignmentEditable", "changeState", "copyAssignmentStatusCode"],
								formatter: this.formatStatusEditable
							},
							valueState: "{assignmentStatusValueState}",
							valueStateText: "{assignmentStatusValueStateText}",
							change: this.oControllers.table.onAssigmentStatusChanged.bind(this.oControllers.table)
						}).addStyleClass("sapUiTinyMarginBegin")
					]
				});
			},
			createworkItemNameColumn: function (bVisible, sWidth) {
				return this._createColumn({
					template: this.createworkItemNameTemplate(),
					id: "idworkItemName",
					variantColumnKey: "workItemName",
					label: this.oBundle.getText("WORK_ITEM"),
					sortProperty: null,
					visible: {
						parts: [{ path: "app>/columnsVisibility" }, { value: bVisible }],
						formatter: this.formatColumnVisibility
					},
					width: sWidth,
					hAlign: "Left"
				});
			},

			createworkItemNameTemplate: function () {
				return new Text({
					text: "{workItemName}",
					tooltip: "{workItemName}",
					visible: {
						parts: ["child", "changeState"],
						formatter: this.formatAsgCellVisible
					}
				});
			},

			createReferenceObjectColumn: function (bVisible, sWidth) {
				return this._createColumn({
					template: this.createReferenceObjectTemplate(),
					id: "idReferenceObject",
					variantColumnKey: "referenceObject",
					label: this.oBundle.getText("REFERENCE_OBJECT"),
					sortProperty: null,
					visible: {
						parts: [{ path: "app>/columnsVisibility" }, { value: bVisible }],
						formatter: this.formatColumnVisibility
					},
					width: sWidth,
					hAlign: "Left"
				});
			},

			createReferenceObjectTemplate: function () {
				return new Text({
					text: {
						parts: ["referenceObjectName", "referenceObjectId"],
						formatter: descAndCodeFormatter
					},
					tooltip: {
						parts: ["referenceObjectName", "referenceObjectId"],
						formatter: descAndCodeFormatter
					},
					maxLines: 2,
					visible: {
						parts: ["child", "changeState"],
						formatter: this.formatAsgCellVisible
					}
				});
			},

			createReferenceObjectTypeColumn: function (bVisible, sWidth) {
				return this._createColumn({
					template: this.createReferenceObjectTypeTemplate(),
					id: "idReferenceObjectType",
					variantColumnKey: "referenceObjectType",
					label: this.oBundle.getText("REFERENCE_OBJECT_TYPE"),
					sortProperty: null,
					visible: {
						parts: [{ path: "app>/columnsVisibility" }, { value: bVisible }],
						formatter: this.formatColumnVisibility
					},
					width: sWidth,
					hAlign: "Left"
				});
			},

			createReferenceObjectTypeTemplate: function () {
				return new Text({
					text: "{referenceObjectTypeName}",
					tooltip: "{referenceObjectTypeName}",
					maxLines: 2,
					visible: {
						parts: ["child", "changeState"],
						formatter: this.formatAsgCellVisible
					}
				});
			},

			createProjectColumn: function (bVisible, sWidth) {
				return this._createColumn({
					template: this.createProjectTemplate(),
					id: "idProject",
					variantColumnKey: "project",
					label: this.oBundle.getText("PROJECT"),
					sortProperty: null,
					visible: {
						parts: [{ path: "app>/columnsVisibility" }, { value: bVisible }],
						formatter: this.formatColumnVisibility
					},
					width: sWidth,
					hAlign: "Left"
				});
			},

			createProjectTemplate: function () {
				return new Text({
					text: {
						parts: ["projectName", "projectId"],
						formatter: descAndCodeFormatter
					},
					tooltip: {
						parts: ["projectName", "projectId"],
						formatter: descAndCodeFormatter
					},
					maxLines: 2,
					visible: {
						parts: ["child", "changeState"],
						formatter: this.formatAsgCellVisible
					}
				});
			},

			createCustomerColumn: function (bVisible, sWidth) {
				return this._createColumn({
					template: this.createCustomerTemplate(),
					id: "idCustomer",
					variantColumnKey: "customer",
					label: this.oBundle.getText("CUSTOMER"),
					sortProperty: null,
					visible: {
						parts: [{ path: "app>/columnsVisibility" }, { value: bVisible }],
						formatter: this.formatColumnVisibility
					},
					width: sWidth,
					hAlign: "Left"
				});
			},

			createCustomerTemplate: function () {
				return new Text({
					text: {
						parts: ["customerName", "customerId"],
						formatter: descAndCodeFormatter
					},
					tooltip: {
						parts: ["customerName", "customerId"],
						formatter: descAndCodeFormatter
					},
					maxLines: 2,
					visible: {
						parts: ["child", "changeState"],
						formatter: this.formatAsgCellVisible
					}
				});
			},

			createProjectRoleColumn: function (bVisible, sWidth) {
				return this._createColumn({
					template: this.createProjectRoleTemplate(),
					id: "idProjectRole",
					variantColumnKey: "projectRole",
					label: this.oBundle.getText("PROJECT_ROLE"),
					sortProperty: null,
					visible: {
						parts: [{ path: "app>/columnsVisibility" }, { value: bVisible }],
						formatter: this.formatColumnVisibility
					},
					width: sWidth,
					hAlign: "Left"
				});
			},

			createProjectRoleTemplate: function () {
				return new Text({
					text: "{projectRoleName}",
					tooltip: "{projectRoleName}",
					maxLines: 2,
					visible: {
						parts: ["child", "changeState"],
						formatter: this.formatAsgCellVisible
					}
				});
			},

			createRequestColumn: function (bVisible, sWidth) {
				return this._createColumn({
					template: this.createRequestTemplate(),
					id: "idRequest",
					variantColumnKey: "request",
					label: this.oBundle.getText("REQUEST"),
					sortProperty: null,
					visible: {
						parts: [{ path: "app>/columnsVisibility" }, { value: bVisible }],
						formatter: this.formatColumnVisibility
					},
					width: sWidth,
					hAlign: "Left"
				});
			},

			createRequestTemplate: function () {
				return new Text({
					text: {
						parts: ["requestName", "requestDisplayId"],
						formatter: descAndCodeFormatter
					},
					tooltip: {
						parts: ["requestName", "requestDisplayId"],
						formatter: descAndCodeFormatter
					},
					maxLines: 2,
					visible: {
						parts: ["child", "changeState"],
						formatter: this.formatAsgCellVisible
					}
				});
			},

			createRequestStatusColumn: function (bVisible, sWidth) {
				return this._createColumn({
					template: this.createRequestStatusTemplate(),
					id: "idRequestStatus",
					variantColumnKey: "requestStatus",
					label: this.oBundle.getText("REQUEST_STATUS"),
					sortProperty: null,
					visible: {
						parts: [{ path: "app>/columnsVisibility" }, { value: bVisible }],
						formatter: this.formatColumnVisibility
					},
					width: sWidth,
					hAlign: "Left"
				});
			},

			createRequestStatusTemplate: function () {
				return new Text({
					text: "{requestStatusDescription}",
					tooltip: "{requestStatusDescription}",
					visible: {
						parts: ["child", "changeState"],
						formatter: this.formatAsgCellVisible
					}
				});
			},

			createTimeColumn: function (sName, iUtilIndex, sWidth) {
				return this._createColumn({
					template: this.createTimeTemplate(iUtilIndex),
					id: "idMonthColumn" + iUtilIndex,
					variantColumnKey: null,
					label: sName,
					sortProperty: null,
					visible: true,
					width: sWidth,
					hAlign: "Right"
				});
			},

			createTimeTemplate: function (iUtilIndex) {
				let oTemplate = new VerticalLayout({
					content: [
						new ObjectStatus({
							text: "{utilization} {i18n>PERCENTAGE}",
							visible: "{parent}",
							state: {
								path: "utilization",
								formatter: formatUtilizationPercentState
							}
						}),
						new Text({
							text: "{freeHours} / {availableHours} {i18n>HOUR}",
							visible: "{parent}",
							tooltip: "{freeHours} / {availableHours} {i18n>HOUR}",
							wrapping: false
						}),
						new Input({
							value: "{bookedCapacity}",
							visible: {
								parts: ["child", "empty"],
								formatter: this.formatHourInputVisible
							},
							type: "Number",
							description: "{i18n>HOUR}",
							width: "100%",
							textAlign: "End",
							fieldWidth: "60%", // ratio of field and description
							autocomplete: false,
							editable: {
								parts: ["app>/IsEditMode", "isAssignmentEditable"],
								formatter: this.formatUtilizationEditable
							},
							change: this.oControllers.table.onUtilizationChanged.bind(this.oControllers.table),
							valueState: "{utilizationValueState}",
							valueStateText: "{utilizationValueStateText}"
						}).addEventDelegate({
							onfocusin: function (oEvent) {
								oEvent.currentTarget.getElementsByTagName("input")[0].select();
							}
						})
					]
				});
				oTemplate.bindContext("utilization/" + iUtilIndex);
				return oTemplate;
			},

			_createColumn: function (oParams) {
				return new Column({
					label: new Label({
						text: oParams.label,
						wrapping: true
					}),
					id: this.oControllers.table.createId(oParams.id),
					customData: new CustomData({
						key: "variantColumnKey",
						value: oParams.variantColumnKey
					}),
					hAlign: oParams.hAlign,
					visible: oParams.visible,
					sorted: {
						path: "/sortProperty",
						formatter: function (sSortProperty) {
							return oParams.sortProperty === sSortProperty;
						}
					},
					tooltip: oParams.label,
					template: oParams.template,
					sortProperty: oParams.sortProperty,
					minWidth: 50, // Internal Incident: 2180105333 is raised to fix issue is with minWidth
					width: oParams.width,
					sortOrder: "{/sortOrder}",
					columnMenuOpen: this.oControllers.table.handleColumnMenuOpen.bind(this.oControllers.table)
				});
			},

			formatUtilizationPercent: function (iStaffedHrs, iRequestedCapacityInHours) {
				return Math.round((iStaffedHrs / iRequestedCapacityInHours) * 100);
			},

			formatColumnVisibility: function (sTableColumnVisibility, bVisible) {
				return bVisible && sTableColumnVisibility === "showAll";
			},

			formatNameInitials: function (sName) {
				if (sName) {
					let aSplit = sName.split(" ");
					let sInitial = aSplit[0].charAt(0).toUpperCase() + aSplit[1].charAt(0).toUpperCase();
					return sInitial;
				} else {
					return "NN";
				}
			},

			formatStatusTextVisible: function (bChild, bDisplayMode) {
				return bChild && bDisplayMode;
			},

			formatStatusSelectVisible: function (bChild, bEditMode, sChangeState) {
				return bChild && bEditMode && !(sChangeState === "empty" || sChangeState === "deleted");
			},

			formatStatusEditable: function (bAssignmentEditable, sChangeState, sAssignmentStatusCode) {
				return bAssignmentEditable && (sChangeState === "created" ? true : sAssignmentStatusCode === AssignmentStatus.SOFT_BOOKED_STRING);
			},

			formatHourTextVisible: function (bChild, bEmpty, bDisplayMode) {
				return bChild && !bEmpty && bDisplayMode;
			},

			formatHourInputVisible: function (bChild, bEmpty, bEditMode) {
				return bChild && !bEmpty && bEditMode;
			},

			formatRequestLinkVisible: function (bChild, sChangeState) {
				return bChild && !(sChangeState === "empty" || sChangeState === "created" || sChangeState === "deleted");
			},

			formatRequestInputVisible: function (bChild, sChangeState) {
				return bChild && (sChangeState === "empty" || sChangeState === "created");
			},

			formatAsgCellVisible: function (bChild, sChangeState) {
				return bChild && !(sChangeState === "empty" || sChangeState === "deleted");
			},

			formatRequestLinkVisibleOnDelete: function (bChild, sChangeState) {
				return bChild && sChangeState === "deleted";
			},

			formatUtilizationEditable: function (bMode, isAssignmentEditable) {
				return bMode && isAssignmentEditable;
			},
			formatInfoLabelCopyVisible: function (bChild, sCopyState) {
				return bChild && sCopyState === "CopyPaste";
			},

			formatInfoLabelCutVisible: function (bChild, sCopyState) {
				return bChild && sCopyState === "CutPaste";
			}
		});
	}
);
