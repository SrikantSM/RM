let sPageViewId = "application-capacity-Display-component---idPage";
let sVariantViewId = sPageViewId + "--idVariantManagement";
let sVariantId = sVariantViewId + "--variantManagement-vm";

module.exports = {
	variantPopover: element(
		by.control({
			id: sVariantId + "-popover-popover"
		})
	),

	openButton: element(
		by.control({
			id: sVariantId + "-trigger"
		})
	),

	manageButton: element(
		by.control({
			id: sVariantId + "-manage"
		})
	),
	selectDefaultVariant:element(
		by.control({
			id: sVariantId + "-manage-def-0"
		})
	),
	saveAsButton: element(
		by.control({
			id: sVariantId + "-saveas"
		})
	),
	saveAsDefault:element(
		by.control({
			id:sVariantId + "-default-label"
		})
	),
	nameInput: element(
		by.control({
			id: sVariantId + "-name"
		})
	),

	variantSaveButton: element(
		by.control({
			id: sVariantId + "-variantsave"
		})
	),

	managementSaveButton: element(
		by.control({
			id: sVariantId + "-managementsave"
		})
	),

	variantItem: function (sText) {
		return element(
			by.control({
				controlType: "sap.ui.core.Item",
				properties: {
					text: sText
				}
			})
		);
	},

	deleteButton: element(
		by.control({
			controlType: "sap.m.Button",
			properties: {
				icon: "sap-icon://decline"
			}
		})
	)
};