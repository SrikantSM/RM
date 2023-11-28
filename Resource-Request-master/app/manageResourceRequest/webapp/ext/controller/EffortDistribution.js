sap.ui.define(
	["resourceRequestLibrary/controller/EffortDistribution",
		"sap/ui/model/resource/ResourceModel"],
	function(EffortDistribution, ResourceModel) {
		return {
			/**
       * @public
       * @param {Object} oEvent Event
       */
			onOpenCalendarView: function(oEvent) {
				// Set i18ned model for library if not already done.
				if (!this._view.getModel("i18ned")) {
					const i18nModel = new ResourceModel({
						bundleName: "resourceRequestLibrary.i18n.i18n"
					});
					this._view.setModel(i18nModel, "i18ned");
				}
				// Get selected effort distribution
				const iCurrEffortType = oEvent
					.getSource()
					.getBindingContext()
					.getProperty("effortDistributionType_code");
				// Open calendar from reusable library
				EffortDistribution.openEffortView.call(
					this,
					"Manage",
					iCurrEffortType,
					oEvent
				);
			},
		};
	}
);
