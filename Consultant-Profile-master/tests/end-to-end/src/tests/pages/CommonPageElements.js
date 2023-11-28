const listReport = {
    elements: {
        tableRows: element.all(
            by.control({
                controlType: 'sap.m.ColumnListItem',
            }),
        ),
        header: element(
            by.control({
                controlType: 'sap.f.DynamicPageTitle',
            }),
        ).element(
            by.control({
                controlType: 'sap.m.Button',
                properties: {
                    icon: 'sap-icon://slim-arrow-down',
                },
            }),
        ),
    },
};

const errorDialog = {
    dialog: element(
        by.control({
            controlType: 'sap.m.Dialog',
            properties: {
                state: 'Error',
            },
        }),
    ),
};

const objectPage = {
    elements: {

        backButton: element(
            by.control({
                id: 'backBtn',
            }),
        ),

        editButton: element(by.control({
            controlType: 'sap.uxap.ObjectPageDynamicHeaderTitle',
        })).element(by.control({
            controlType: 'sap.m.Button',
            properties: {
                text: 'Edit',
            },
        })),
        deleteButton: element(by.control({
            controlType: 'sap.uxap.ObjectPageDynamicHeaderTitle',
        })).element(by.control({
            controlType: 'sap.m.Button',
            properties: {
                text: 'Delete',
            },
        })),
        restrictButton: element(by.control({
            controlType: 'sap.uxap.ObjectPageDynamicHeaderTitle',
        })).element(by.control({
            controlType: 'sap.m.Button',
            properties: {
                text: 'Restrict',
            },
        })),
        removeRestrictionButton: element(by.control({
            controlType: 'sap.uxap.ObjectPageDynamicHeaderTitle',
        })).element(by.control({
            controlType: 'sap.m.Button',
            properties: {
                text: 'Remove Restriction',
            },
        })),

        expandHeaderButton: element(by.control({
            controlType: 'sap.uxap.ObjectPageDynamicHeaderTitle',
        })).element(by.control({
            controlType: 'sap.m.Button',
            properties: {
                icon: 'sap-icon://slim-arrow-down',
            },
        })),

        collapseHeaderButton: element(
            by.control({
                id: 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::ObjectPage-OPHeaderContent-collapseBtn',
            }),
        ),

        footer: {
            saveButton: element(
                by.control({
                    id: 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FooterBar::StandardAction::Save',
                }),
            ),
            saveButtonRole: element(
                by.control({
                    id: 'projectRoleUi::ProjectRoleObjectPage--fe::FooterBar::StandardAction::Save',
                }),
            ),
            deleteButton: element(
                by.control({
                    controlType: 'sap.uxap.ObjectPageHeaderActionButton',
                    properties: {
                        text: 'Delete',
                    },
                }),
            ),
            deleteDialogButton: element(
                by.control({
                    controlType: 'sap.m.Dialog',
                }),
            ).element(
                by.control({
                    controlType: 'sap.m.Button',
                    properties: {
                        text: 'Delete',
                    },
                }),
            ),
            applyButton: element(
                by.control({
                    controlType: 'sap.m.Button',
                    properties: {
                        text: 'Apply',
                    },
                }),
            ),
            cancelButton: element(
                by.control({
                    id: 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FooterBar::StandardAction::Cancel',
                }),
            ),
            messageButton: element(
                by.control({
                    autoWait: false,
                    controlType: 'sap.fe.macros.messages.MessageButton',
                    properties: {
                        type: 'Negative',
                    },
                }),
            ),
            discardButton: element(
                by.control({
                    controlType: 'sap.m.Button',
                    properties: {
                        text: 'Discard',
                    },
                }),
            ),
        },
        messageDialog: {
            dialog: element(
                by.control({
                    controlType: 'sap.m.Dialog',
                }),
            ),
            closeButton: element(
                by.control({
                    controlType: 'sap.m.Button',
                    properties: {
                        text: 'Close',
                    },
                }),
            ),
            keepDraftLabel: element(
                by.control({
                    controlType: 'sap.m.Label',
                    properties: {
                        text: 'Keep Draft',
                    },
                }),
            ),
            messages: element(
                by.control({
                    controlType: 'sap.m.Dialog',
                }),
            ).all(
                by.control({
                    controlType: 'sap.m.Text',
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
        },

        errorDialogMessageText: (errorMessage) => errorDialog.dialog.element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: errorMessage,
                },
            }),
        ),
        errorDialogCloseButton: errorDialog.dialog.element(
            by.control({
                controlType: 'sap.m.Button',
                properties: {
                    text: 'Close',
                },
            }),
        ),

        popover: {

            closeButton: element(by.control({
                controlType: 'sap.m.Popover',
            })).all(by.control({
                controlType: 'sap.m.Button',
            })),

            message: element(by.control({
                controlType: 'sap.m.Page',
            })).element(by.control({
                controlType: 'sap.m.Text',
            })),
        },

        overflowToolbar: element(by.control({
            controlType: 'sap.m.OverflowToolbar',
            id: 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::op::footer::MyProjectExperienceHeader',
        })),
        belowOverflowToolbar: element(by.control({
            controlType: 'sap.m.OverflowToolbar',
            id: 'myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FooterBar',
        })),
        belowOverflowToolbarExternalWorkExperience: element(by.control({
            controlType: 'sap.m.OverflowToolbar',
            id: 'myProjectExperienceUi::ExternalWorkExperienceObjectPage--fe::FooterBar',
        })),

        errorPage: element(
            by.control({
                controlType: 'sap.m.MessagePage',
                properties: {
                    text: 'Unable to load the data.',
                },
            }),
        ),
        messagePopover: element(
            by.control({
                controlType: 'sap.m.MessageView',
            }),
        ).element(
            by.control({
                controlType: 'sap.m.NavContainer',
            }),
        ).element(
            by.control({
                controlType: 'sap.m.List',
            }),
        ),
        messagePopoverContainer: element(
            by.control({
                controlType: 'sap.m.MessageView',
            }),
        ).element(
            by.control({
                controlType: 'sap.m.NavContainer',
            }),
        ),
    },
};
const actions = {
    getMessageButtonState(buttonType) {
        const text = objectPage.elements.belowOverflowToolbar.element(
            by.control({
                controlType: 'sap.fe.macros.messages.MessageButton',
                properties: {
                    type: buttonType,
                },
            }),
        );
        return text;
    },
    getMessageButtonStateExternalWorkExperience(buttonType) {
        const text = objectPage.elements.belowOverflowToolbarExternalWorkExperience.element(
            by.control({
                controlType: 'sap.fe.macros.messages.MessageButton',
                properties: {
                    type: buttonType,
                },
            }),
        );
        return text;
    },
    getMessageErrorList(errorMessage) {
        const message = objectPage.elements.messagePopover.element(
            by.control({
                controlType: 'sap.m.MessageListItem',
                properties: {
                    title: errorMessage,
                },
            }),
        );
        return message;
    },
    getMessageError(errorMessage) {
        const message = objectPage.elements.messagePopoverContainer.element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: errorMessage,
                },
            }),
        );
        return message;
    },
    getMessageErrorLink(errorMessage) {
        const message = objectPage.elements.messagePopoverContainer.element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: errorMessage,
                },
            }),
        );
        return message;
    },
};

module.exports = {
    listReport,
    objectPage,
    actions,
};
