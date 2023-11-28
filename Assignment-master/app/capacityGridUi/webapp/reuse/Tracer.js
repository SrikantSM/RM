sap.ui.define(["capacityGridUi/reuse/controller/BaseComponentController"], function (BaseComponentController) {
	"use strict";

	return BaseComponentController.extend("capacityGridUi.reuse.Tracer", {
		sMessage: undefined,
		iCurrentTime: undefined,
		iCount: undefined,

		constructor: function (oComponent) {
			BaseComponentController.apply(this, arguments);
			this.injectMembers();
		},

		reset: function (sMessage) {
			this.models.app.setProperty("/traceMessage", "");
			this.sMessage = sMessage;
			this.iCount = 1;
			this.iCurrentTime = new Date().getTime();
		},

		message: function (sMessage) {
			let iNewTime = new Date().getTime();
			let iDuration = iNewTime - this.iCurrentTime;
			this.iCurrentTime = iNewTime;
			let sNewMessage = this.iCount + ". " + sMessage + " @ " + iDuration + "ms | ";
			this.sMessage += sNewMessage;
			this.iCount++;
		},

		show: function () {
			this.models.app.setProperty("/traceMessage", this.sMessage);
		}
	});
});
