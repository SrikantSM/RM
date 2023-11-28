const resourceRequestListReport = {
	goButton: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests-btnSearch"
		})
	),
	filterBarExpandButton: element(
		by.control({
			controlType: "sap.m.Button",
			id: /-expandBtn$/
		})
	),
	projectFilterInput: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::project_ID"
		})
	),
	requestId: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::displayId"
		})
	),
	staffingStatusFilter: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::staffingStatus::staffingCode"
		})
	),
	requestStatusFilter: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::requestStatus_code"
		})
	),
	projectFilterDeleteIcons: element.all(
		by.control({
			controlType: "sap.ui.core.Icon",
			id: /^staffResourceRequest::ResourceRequestListReport--fe::FilterBar::ResourceRequests::FilterField::project_ID-inner-token/
		})
	),
	resourceRequestTable: element(
		by.control({
			id: "staffResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-innerTable"
		})
	),
	visibleRowsInTable: element.all(
		by.control({
			controlType: "sap.m.ColumnListItem",
			viewName: "sap.fe.templates.ListReport.ListReport",
			ancestor: {
				id: "staffResourceRequest::ResourceRequestListReport--fe::table::ResourceRequests::LineItem-innerTable"
			}
		})
	)
};

module.exports = resourceRequestListReport;
