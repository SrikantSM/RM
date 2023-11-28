const display = {
	appTitle: element(
		by.control({
			controlType: "sap.ushell.ui.shell.ShellAppTitle",
			id: "shellAppTitle",
			properties: {
				text: "Resource"
			}
		})
	),

	orgInfo: element(
		by.control({
			id: "fe::HeaderFacet::Form::FieldGroup::OrganizationInformation",
			viewId: "myResourcesUi::MyResourceObjectPage"
		})
	),

	contactInfo: element(
		by.control({
			id: "fe::HeaderFacet::Form::FieldGroup::ContactInformation",
			viewId: "myResourcesUi::MyResourceObjectPage"
		})
	),

	averageUtilIndicator: element(
		by.control({
			id: "fe::HeaderDPTitle::DataPoint::UtilizationIndicator",
			viewId: "myResourcesUi::MyResourceObjectPage"
		})
	),

	objectPageHeaderTitle: (sTitle) => {
		return element(
			by.control({
				controlType: "sap.m.Title",
				viewName: "sap.fe.templates.ObjectPage.ObjectPage",
				properties: {
					text: sTitle
				}
			})
		);
	}
};

module.exports = {
	display
};
