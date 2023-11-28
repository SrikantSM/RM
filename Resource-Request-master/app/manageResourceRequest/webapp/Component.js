sap.ui.define([
	"sap/fe/core/AppComponent",
	"jquery.sap.global"
], function(AppComponent, jQuery) {
	const Component = AppComponent.extend("manageResourceRequest.Component", {
		metadata: {
			manifest: "json"
		}
	});
	Component.prototype.init = function() {
		AppComponent.prototype.init.apply(this);
	};

	return Component;
});
