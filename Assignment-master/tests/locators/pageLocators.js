let sPageViewName = "capacityGridUi.view.Page";
let sPageViewId = "application-capacity-Display-component---idPage";
let sComponentId = "application-capacity-Display-component";

module.exports = {
	errorMessage: element(
		by.control({
			id: sPageViewId + "--messagePopoverBtn-img"
		})
	),

	mesasagePopoverButton: element(
		by.control({
			id: sPageViewId + "--messagePopoverBtn"
		})
	),

	footerToolbar: element(
		by.control({
			controlType: "sap.m.OverflowToolbar",
			viewName: sPageViewName,
			id: "idEditFooter"
		})
	),

	getSaveButton: () => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				viewId: sPageViewId,
				i18NText: {
					propertyName: "text",
					key: "SAVE_BUTTON"
				},
				interaction: {
					idSuffix: "content"
				}
			})
		);
	},

	getCancelButton: () => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				viewId: sPageViewId,
				i18NText: {
					propertyName: "text",
					key: "CANCEL_BUTTON"
				},
				interaction: {
					idSuffix: "BDI-content"
				}
			})
		);
	},

	getShowAllColumnsButton: () => {
		return element(
			by.control({
				id: "application-capacity-Display-component---idPage--idTable--idShowAll-button-img"
			})
		);
	},

	getHideLeadingColumnsButton: () => {
		return element(
			by.control({
				id: "application-capacity-Display-component---idPage--idTable--idHideLeading-button-img"
			})
		);
	},

	getCancelConfirmationOKButton: () => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				properties: {
					text: "OK"
				},
				ancestor: {
					controlType: "sap.m.Dialog",
					searchOpenDialogs: true
				}
			})
		);
	},
	getPopoverMessage: (sMsg) => {
		return element(
			by.control({
				controlType: "sap.m.Link",
				properties: {
					text: sMsg
				},
				searchOpenDialogs: true
			})
		);
	},
	getMessagePopoverCloseButton: function () {
		return element(
			by.control({
				controlType: "sap.m.Button",
				properties: {
					icon: "sap-icon://decline"
				},
				searchOpenDialogs: true,
				interaction: {
					idSuffix: "inner"
				}
			})
		);
	},
	getMsgDialogTitleText: function () {
		return element(
			by.control({
				id: sComponentId + "---MessageDialog--messageViewMessageTitleText",
				searchOpenDialogs: true
			})
		);
	},
	getMsgDialogDescText: function () {
		return element(
			by.control({
				id: sComponentId + "---MessageDialog--messageViewMessageDescriptionText",
				searchOpenDialogs: true
			})
		);
	},
	getMsgDialog: function () {
		return element(
			by.control({
				id: sComponentId + "---MessageDialog--dialog",
				searchOpenDialogs: true
			})
		);
	},
	getMsgDialogCloseButton: function () {
		return element(
			by.control({
				searchOpenDialogs: true,
				interaction: {
					idSuffix: "content"
				}
			})
		);
	}
};