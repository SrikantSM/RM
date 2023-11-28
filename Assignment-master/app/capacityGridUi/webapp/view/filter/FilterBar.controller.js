sap.ui.define(
	[
		"capacityGridUi/reuse/filter/FilterBar.controller",
		"capacityGridUi/view/filter/RequestCustomerFilter",
		"capacityGridUi/view/filter/RequestIdFilter",
		"capacityGridUi/view/filter/RequestProjectFilter",
		"capacityGridUi/view/filter/RequestProjectRoleFilter",
		"capacityGridUi/view/filter/ResourceCostCenterFilter",
		"capacityGridUi/view/filter/ResourceMinFreeHoursFilter",
		"capacityGridUi/view/filter/ResourceNameFilter",
		"capacityGridUi/view/filter/ResourceOrgFilter",
		"capacityGridUi/view/filter/ResourceUtilizationFilter",
		"capacityGridUi/view/filter/ResourceWorkerTypeFilter",
		"capacityGridUi/view/filter/RequestReferenceObjectFilter",
		"capacityGridUi/view/filter/RequestReferenceObjectTypeFilter"
	],
	function (
		FilterBarController,
		RequestCustomerFilter,
		RequestIdFilter,
		RequestProjectFilter,
		RequestProjectRoleFilter,
		ResourceCostCenterFilter,
		ResourceMinFreeHoursFilter,
		ResourceNameFilter,
		ResourceOrgFilter,
		ResourceUtilizationFilter,
		ResourceWorkerTypeFilter,
		RequestReferenceObjectFilter,
		RequestReferenceObjectTypeFilter
	) {
		"use strict";

		return FilterBarController.extend("capacityGridUi.view.filter.FilterBar", {
			onInit: function () {
				FilterBarController.prototype.onInit.apply(this, arguments);
				this.oComponent.oControllers.add("filterBar", this);
			},

			// it's important to create the filter controllers in the same order as they appear in the UI
			// e.g. the sequence in the info toolbar depends on this
			_createFilterControllers: function () {
				this.oFilterControllers = new Map();
				this.oFilterControllers.set("resourceName", new ResourceNameFilter(this));
				this.oFilterControllers.set("resourceOrg", new ResourceOrgFilter(this));
				this.oFilterControllers.set("resourceCostCenter", new ResourceCostCenterFilter(this));
				this.oFilterControllers.set("resourceWorkerType", new ResourceWorkerTypeFilter(this));
				this.oFilterControllers.set("resourceUtilization", new ResourceUtilizationFilter(this));
				this.oFilterControllers.set("resourceMinFreeHours", new ResourceMinFreeHoursFilter(this));
				this.oFilterControllers.set("requestProject", new RequestProjectFilter(this));
				this.oFilterControllers.set("requestCustomer", new RequestCustomerFilter(this));
				this.oFilterControllers.set("requestProjectRole", new RequestProjectRoleFilter(this));
				this.oFilterControllers.set("requestId", new RequestIdFilter(this));
				this.oFilterControllers.set("referenceObject", new RequestReferenceObjectFilter(this));
				this.oFilterControllers.set("referenceObjectType", new RequestReferenceObjectTypeFilter(this));
			},

			onExpandingFilterPanel: function (oEvent, sfilterPanel) {
				let bExpand = oEvent.getParameter("expand");
				oEvent.getSource().setProperty("expanded", bExpand);
				this.oControllers.variant.changeVariant("filterPanelExpandState", sfilterPanel, bExpand);
			}
		});
	}
);
