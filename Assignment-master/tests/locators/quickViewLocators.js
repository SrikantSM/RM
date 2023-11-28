let sFragmentId = "application-capacity-Display-component---QuickView--quickView-quickView-popover";

module.exports = {
	contactDetailsPopUp: element(
		by.control({
			controlType: "sap.m.Popover",
			id: sFragmentId
		})
	),

	contactDetailsElement: (sControl, sText) => {
		return element(
			by.control({
				controlType: sControl,
				properties: {
					text: sText
				},
				ancestor: {
					controlType: "sap.m.Popover",
					id: sFragmentId
				}
			})
		);
	},

	resourcePopupTitleLink: (resourceName) => {
		return element(
			by.control({
				controlType: "sap.m.Link",
				properties: {
					text: resourceName
				},
				ancestor: {
					controlType: "sap.m.Popover",
					id: sFragmentId
				}
			})
		);
	},

	workPackageLink: (workPackage) => {
		return element(
			by.control({
				controlType: "sap.m.Link",
				properties: {
					text: workPackage
				},
				ancestor: {
					controlType: "sap.m.Popover",
					id: sFragmentId
				}
			})
		);
	}
};