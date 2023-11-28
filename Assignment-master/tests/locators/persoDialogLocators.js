let sPersoDialogId = "application-capacity-Display-component---PersoDialog--dialog";

module.exports = {
	getCheckBoxesinPersonalizationDialog: () => {
		return element.all(
			by.control({
				controlType: "sap.m.CheckBox",
				ancestor: {
					id: sPersoDialogId
				}
			})
		);
	},

	getCancelBtnInPersonalizationDialog: () => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				properties: {
					text: "Cancel"
				},
				ancestor: {
					id: sPersoDialogId
				}
			})
		);
	},

	getOKBtnInPersonalizationDialog: () => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				properties: {
					text: "OK"
				},
				ancestor: {
					id: sPersoDialogId
				}
			})
		);
	},

	getResetBtnInPersonalizationDialog: () => {
		return element(
			by.control({
				controlType: "sap.m.Button",
				properties: {
					text: "Reset"
				},
				ancestor: {
					id: sPersoDialogId
				}
			})
		);
	},

	getCostCenterCheckBoxText: () => {
		return element(
			by.control({
				controlType: "sap.m.Text",
				properties: {
					text: "Cost Center"
				},
				ancestor: {
					id: sPersoDialogId
				}
			})
		);
	},

	getMoveToDownBtn: () => {
		return element(
			by.control({
				controlType: "sap.m.OverflowToolbarButton",
				ancestor: {
					id: sPersoDialogId
				},
				bindingPath: {
					path: "",
					propertyPath: "/isMoveDownButtonEnabled"
				},
				searchOpenDialogs: true,
				interaction: {
					idSuffix: "inner"
				}
			})
		);
	},

	getPersonalizationDialog: () => {
		return element(
			by.control({
				id: sPersoDialogId,
				searchOpenDialogs: true
			})
		);
	}
};
