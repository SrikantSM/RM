var listReport = {
	elements: {
		tableRows: element.all(
			by.control({
				controlType: "sap.m.ColumnListItem"
			})
		),
		header: element(
			by.control({
				controlType: "sap.f.DynamicPageTitle"
			})
		).element(
			by.control({
				controlType: "sap.m.Button",
				properties: {
					icon: "sap-icon://slim-arrow-down"
				}
			})
		)
	}
};

var objectPage = {
	elements: {

		backButton: element(by.control({
			controlType: "sap.ushell.ui.ShellHeader"
		})).element(by.id("backBtn")),

		editButton: element(by.control({
			controlType: "sap.uxap.ObjectPageDynamicHeaderTitle"
		})).element(by.control({
			controlType: "sap.m.Button",
			properties: {
				text: "Edit"
			}
		})),
		deleteButton: element(by.control({
			controlType: "sap.uxap.ObjectPageDynamicHeaderTitle"
		})).element(by.control({
			controlType: "sap.m.Button",
			properties: {
				text: "Delete"
			}
		})),

		footer: {
			saveButton: element(
					by.control({
						id: "projectRoleUi::ProjectRoleObjectPage--fe::FooterBar::StandardAction::Save"
					})
			),
			deleteButton: element(
				by.control({
					controlType: "sap.uxap.ObjectPageHeaderActionButton",
					properties: {
						text: "Delete"
					}
				})
			),
			deleteDialogButton: element(
				by.control({
					controlType: "sap.m.Dialog"
				})
			).element(
				by.control({
					controlType: "sap.m.Button",
					properties: {
						text: "Delete"
					}
				})
			),
			cancelButton: element(
					by.control({
						id: "projectRoleUi::ProjectRoleObjectPage--fe::FooterBar::StandardAction::Cancel"
					})
			),
			discardButton: element(
				by.control({
					controlType: "sap.m.Button",
					properties: {
						text: "Discard"
					}
				})
			)
		},
		messageDialog: {
			dialog: element(
				by.control({
					controlType: "sap.m.Dialog"
				})
			),
			closeButton: element(
				by.control({
					controlType: "sap.m.Button",
					properties: {
						text: "Close"
					}
				})
			),
			keepDraftLabel: element(
                by.control({
                    controlType: 'sap.m.Label',
                    properties: {
                        text: 'Keep Draft',
                    },
                }),
            ),
			okButton: element(
                by.control({
                    controlType: 'sap.m.Button',
                    properties: {
                        text: 'OK',
                    },
                }),
            ),
		}
	}
};

module.exports = {
	listReport: listReport,
	objectPage: objectPage
};
