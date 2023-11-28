module.exports = {
	tiles: {
		manageResourceUtilization: element(
			by.control({
				controlType: "sap.m.GenericTile",
				properties: {
					header: "Manage Resource Utilization"
				}
			})
		),
		theKPITileNumericContent:element(
			by.control({
				controlType: "sap.m.NumericContent",
				viewName: "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",
				bindingPath: {
					path: "",
					propertyPath: "/properties/icon"
				}
			})
		),
		theKPITileFooterText:element(
			by.control({
				id: "numericTileContent",
				viewName: "sap.ushell.components.tiles.cdm.applauncherdynamic.DynamicTile",
				interaction: {
					idSuffix: "footer-text"
				}
			})
		),
		staffResourceRequest: element(
			by.control({
				controlType: "sap.m.GenericTile",
				properties: {
					header: "Staff Resource Requests"
				}
			})
		)
	},
	header: {
		xrayButton: element(
			by.control({
				controlType: "sap.ushell.ui.shell.ShellHeadItem",
				properties: {
					icon: "sap-icon://sys-help"
				}
			})
		),
		backButton: element(
			by.control({
				id: "backBtn"
			})
		),
		// Home Button is, seemingly, no separate UI5 control, but lives with a special DOM ID within the UI5 control shell-header
		homeButton: element(
			by.control({
				id: "shell-header"
			})
		).element(by.id("shell-header-logo"))
	},
	errorDialog: {
		dialogControl: element(
			by.control({
				controlType: "sap.m.Dialog",
				properties: {
					title: "Error"
				}
			})
		),
		appCouldNotBeOpenedErrorText: element(
			by.control({
				controlType: "sap.m.Text",
				properties: {
					text: "App could not be opened either due to an incorrect SAP Fiori launchpad configuration or a missing role assignment."
				},
				ancestor: {
					controlType: "sap.m.Dialog"
				}
			})
		),
		okButton: element(
			by.control({
				controlType: "sap.m.Button",
				properties: {
					text: "OK"
				},
				ancestor: {
					controlType: "sap.m.Dialog"
				}
			})
		)
	}
};