sap.ui.define(
	["resourceRequestLibrary/controller/EffortDistribution",
		"sap/ui/model/resource/ResourceModel",
		"resourceRequestLibrary/utils/Constants"],
	function(EffortDistribution, ResourceModel, Constants) {
		return {
			/**
         * @public
         * @param {Object} oEvent Event
         */
			onOpenCalendarView: function(oEvent) {
				if (!this._view.getModel("i18ned")) {
					const i18nModel = new ResourceModel({
						bundleName: "resourceRequestLibrary.i18n.i18n"
					});
					this._view.setModel(i18nModel, "i18ned");
				}
				const iCurrEffortType = oEvent
					.getSource()
					.getBindingContext()
					.getProperty("effortDistributionType_code");
				EffortDistribution.openEffortView.call(
					this,
					"Staff",
					iCurrEffortType,
					oEvent
				);
			},
		};
	}
);
