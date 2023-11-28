sap.ui.define([], function() {
	return {
		generate: function(sResourceRequestId, bDisplayMode) {
			let link = "/ResourceRequests(ID=" + sResourceRequestId;
			if (bDisplayMode !== undefined) {
				link += ",IsActiveEntity=" + bDisplayMode;
			}
			link += ")/capacityRequirements";
			return link;
		},
	};
});
