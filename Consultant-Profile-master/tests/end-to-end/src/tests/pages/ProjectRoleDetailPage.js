const roleHeader = {
    title: element(
        by.control({
            controlType: 'sap.uxap.ObjectPageDynamicHeaderTitle',
        }),
    ),
    overflowToolbar: element(
        by.control({
            controlType: 'sap.m.OverflowToolbar',
            properties: {
                id: 'projectRoleUi::ProjectRoleObjectPage--fe::FooterBar',
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
    objectPageSection: element(
        by.control({
            controlType: 'sap.uxap.ObjectPageSubSection',
            properties: {
                id: /fe::FacetSubSection::texts::LineItem/,
            },
        }),
    ),
    objectPageSectionProjectDetails: element(
        by.control({
            controlType: 'sap.uxap.ObjectPageSubSection',
            properties: {
                id: /fe::FacetSubSection::FieldGroup::RoleCode/,
            },
        }),
    ),
    objectPageHeader: element(
        by.id('projectRoleUi::ProjectRoleObjectPage--fe::HeaderContentContainer'),
    ),
    roleNamesButton: element(
        by.control({
            controlType: 'sap.m.Button',
            properties: {
                text: 'Role Names',
            },
        }),
    ),
    generalInfoButton: element(
        by.control({
            controlType: 'sap.m.Button',
            properties: {
                text: 'General Information',
            },
        }),
    ),
};

const roleData = {
    elements: {
        nameLabel: roleHeader.objectPageSection.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Project Role',
                },
            }),
        ),
        codeLabel: roleHeader.objectPageSectionProjectDetails.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Code',
                },
            }),
        ),
        descriptionLabel: roleHeader.objectPageSection.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Description',
                },
            }),
        ),
    },
};

const roleHeaderData = {
    elements: {
        headerTitle: (roleName) => roleHeader.title.element(
            by.control({
                controlType: 'sap.m.Title',
                properties: {
                    text: roleName,
                },
            }),
        ),
        usageLabel: roleHeader.objectPageHeader.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Usage:',
                },
            }),
        ),
    },
};

const actions = {
    getName(roleName) {
        const name = element(by.control({
            controlType: 'sap.m.Text',
            properties: {
                text: roleName,
            },
            ancestor: {
                id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable',
            },
        }));
        return name;
    },
    editCodeValue(newValue) {
        const nameField = roleHeader.objectPageSectionProjectDetails.element(
            by.control({
                controlType: 'sap.ui.mdc.Field',
                properties: {
                    id: /fe::FormContainer::FieldGroup::RoleCode::FormElement::DataField::code::Field/,
                },
            }),
        );
        return nameField.clear().sendKeys(newValue);
    },
    // Edit row value
    async editRowValue(rowValue, newName, newlocale, newDesc) {
        let elementToBeClicked;
        const objectTableID = 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem';
        const objectTable = element(by.id(objectTableID));
        const objectTableRows = objectTable.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRowsObjectTable = await objectTableRows.count();
        for (let i = 0; i < noOfRowsObjectTable; i++) {
            const value = await objectTableRows.get(i).all(by.control({
                controlType: 'sap.m.Input',
                ancestor: {
                    id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable',
                },
            })).get(0).getAttribute('value');
            if (rowValue === value) {
                elementToBeClicked = i;
                break;
            }
        }

        const rowToBeFilled = await objectTableRows.get(elementToBeClicked);
        const rowInputFields = rowToBeFilled.all(by.control({
            controlType: 'sap.m.Input',
            ancestor: {
                id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable',
            },
        }));
        const rowMDCFieldFields = rowToBeFilled.all(by.control({
            controlType: 'sap.ui.mdc.Field',
            ancestor: {
                id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable',
            },
        }));

        if (newName !== '') {
            const nameInput = rowInputFields.get(0);
            nameInput.clear();
            await nameInput.sendKeys(newName);
        }
        if (newlocale !== '') {
            const languageInput = rowMDCFieldFields.get(0);
            languageInput.clear();
            await languageInput.sendKeys(newlocale);
        }
        if (newDesc !== '') {
            const descriptionInput = rowInputFields.get(1);
            descriptionInput.clear();
            await descriptionInput.sendKeys(newDesc);
        }
    },
    // Edit name
    async editNameValue(oldValue, newValue) {
        let elementToBeClicked;
        const objectTableID = 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem';
        const objectTable = element(by.id(objectTableID));
        const objectTableRows = objectTable.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRowsObjectTable = await objectTableRows.count();
        for (let i = 0; i < noOfRowsObjectTable; i++) {
            const value = await objectTableRows.get(i).all(by.control({
                controlType: 'sap.m.Input',
                ancestor: {
                    id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable',
                },
            })).get(0).getAttribute('value');
            if (oldValue === value) {
                elementToBeClicked = i;
                break;
            }
        }
        const rowToBeFilled = await objectTableRows.get(elementToBeClicked);
        const rowInputFields = rowToBeFilled.all(by.control({
            controlType: 'sap.m.Input',
            ancestor: {
                id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable',
            },
        }));
        if (newValue !== '') {
            const nameInput = rowInputFields.get(0);
            nameInput.clear();
            await nameInput.sendKeys(newValue);
        }
    },

    async editNewName(newValue) {
        const objectTableID = 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem';
        const objectTable = element(by.id(objectTableID));
        const objectTableRows = objectTable.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const rowToBeFilled = await objectTableRows.get(0);
        const rowInputFields = rowToBeFilled.all(by.control({
            controlType: 'sap.m.Input',
            ancestor: {
                id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable',
            },
        }));
        if (newValue !== '') {
            const nameInput = rowInputFields.get(0);
            nameInput.clear();
            await nameInput.sendKeys(newValue);
        }
    },

    async editNewLanguage(oldValue, newValue) {
        let elementToBeClicked;
        const objectTableID = 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem';
        const objectTable = element(by.id(objectTableID));
        const objectTableRows = objectTable.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRowsObjectTable = await objectTableRows.count();
        for (let i = 0; i < noOfRowsObjectTable; i++) {
            const value = await objectTableRows.get(i).all(by.control({
                controlType: 'sap.ui.mdc.Field',
                ancestor: {
                    id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable',
                },
            })).get(0).getAttribute('value');
            if (oldValue === value) {
                elementToBeClicked = i;
                break;
            }
        }
        const rowToBeFilled = await objectTableRows.get(elementToBeClicked);
        const rowMDCFieldFields = rowToBeFilled.all(by.control({
            controlType: 'sap.ui.mdc.Field',
            ancestor: {
                id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable',
            },
        }));

        if (newValue !== '') {
            const languageInput = rowMDCFieldFields.get(0);
            languageInput.clear();
            await languageInput.sendKeys(newValue);
        }
    },

    async editNewDescription(oldValue, newValue) {
        let elementToBeClicked;
        const objectTableID = 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem';
        const objectTable = element(by.id(objectTableID));
        const objectTableRows = objectTable.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRowsObjectTable = await objectTableRows.count();
        for (let i = 0; i < noOfRowsObjectTable; i++) {
            const value = await objectTableRows.get(i).all(by.control({
                controlType: 'sap.m.Input',
                ancestor: {
                    id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable',
                },
            })).get(1).getAttribute('value');
            if (oldValue === value) {
                elementToBeClicked = i;
                break;
            }
        }
        const rowToBeFilled = await objectTableRows.get(elementToBeClicked);
        const rowInputFields = rowToBeFilled.all(by.control({
            controlType: 'sap.m.Input',
            ancestor: {
                id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable',
            },
        }));
        if (newValue !== '') {
            const descriptionInput = rowInputFields.get(1);
            descriptionInput.clear();
            await descriptionInput.sendKeys(newValue);
        }
    },

    async deleteEntry(valueToBeDeleted) {
        const tableId = 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem';
        const deleteId = 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem::StandardAction::Delete';
        const table = element(by.id(tableId));
        const rowsOfTable = table.all(by.control({
            controlType: 'sap.m.ColumnListItem',
        }));
        const noOfRows = await rowsOfTable.count();
        let noRowToBeDeleted;
        for (let i = 0; i < noOfRows; i++) {
            const value = await rowsOfTable.get(i).all(by.control({
                controlType: 'sap.m.Input',
                ancestor: {
                    id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable',
                },
            })).get(0).getAttribute('value');
            if (valueToBeDeleted === await value) {
                noRowToBeDeleted = i;
                break;
            }
        }

        const rowToBeDeleted = await rowsOfTable.get(noRowToBeDeleted);
        const checkBox = await rowToBeDeleted.element(by.control({
            controlType: 'sap.m.CheckBox',
            ancestor: {
                id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable',
            },
        }));
        await checkBox.click();
        await element(by.id(deleteId)).click();
        const deleteButtonInDialog = await element(by.control({
            controlType: 'sap.m.Dialog',
        }));
        const deletes = await deleteButtonInDialog.element(by.control({
            controlType: 'sap.m.Button',
            properties: {
                text: 'Delete',
            },
        }));
        await deletes.click();
    },
    getCode(roleCode) {
        const code = roleHeader.objectPageSectionProjectDetails.element(
            by.control({
                controlType: 'sap.ui.mdc.Field',
                properties: {
                    value: roleCode,
                },
            }),
        );
        return code;
    },
    getCodeinRead(roleCode) {
        const code = roleHeader.objectPageSectionProjectDetails.element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: roleCode,
                },
            }),
        );
        return code;
    },
    async getMessageButtonState1() {
        return roleHeader.overflowToolbar.element(
            by.control({
                controlType: 'sap.fe.macros.messages.MessageButton',
                properties: {
                    id: /fe::FooterBar::MessageButton/,
                },
            }),
        ).asControl().getProperty('type');
    },
    getMessageButtonState(buttonType) {
        const text = roleHeader.overflowToolbar.element(
            by.control({
                controlType: 'sap.fe.macros.messages.MessageButton',
                properties: {
                    type: buttonType,
                    id: /fe::FooterBar::MessageButton/,
                },
            }),
        );
        return text;
    },
    getMessageErrorList(errorMessage) {
        const message = roleHeader.messagePopover.element(
            by.control({
                controlType: 'sap.m.MessageListItem',
                properties: {
                    title: errorMessage,
                },
            }),
        );
        return message;
    },
    getMessageErrorLink(errorMessage) {
        const message = roleHeader.messagePopoverContainer.element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: errorMessage,
                },
            }),
        );
        return message;
    },
    getDescription(roleDescription) {
        const description = roleHeader.objectPageSection.element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: roleDescription,
                    id: /fe::table::texts::LineItem::DataField::description/,
                },
            }),
        );
        return description;
    },
    getAllInputFields() {
        const inputFields = roleHeader.objectPageSection.all(
            by.control({
                controlType: 'sap.ui.mdc.Field',
            }),
        );
        return inputFields;
    },
    clearText() {
        const field = roleHeader.objectPageSection.element(
            by.control({
                controlType: 'sap.ui.mdc.Field',
                properties: {
                    id: /fe::FormContainer::FieldGroup::RoleCode::FormElement::DataField::code::Field/,
                },
            }),
        );
        field.clear();
    },
    getRoleLifecycleStatus(roleLifecycleStatus) {
        const rolelifecycleCode = roleHeader.objectPageHeader.element(
            by.control({
                controlType: 'sap.m.ObjectStatus',
                properties: {
                    text: roleLifecycleStatus,
                },
            }),
        );
        return rolelifecycleCode;
    },
};
const role = {
    tableTitle: element(by.id('projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-title')),

    create: element(by.control({
        id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem::StandardAction::Create',
    })),
    roleListRow: (roleName) => element(by.control({
        controlType: 'sap.m.ColumnListItem',
        ancestor: {
            id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable',
        },
        descendant: {
            controlType: 'sap.ui.mdc.Field',
            properties: { value: roleName },
        },
    })),
    name: (roleName) => element(by.control({
        controlType: 'sap.m.Text',
        properties: {
            text: roleName,
        },
        ancestor: { id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable' },
    })),
    nameInEditMode: (roleName) => element(by.control({
        controlType: 'sap.m.Input',
        properties: {
            value: roleName,
        },
        ancestor: { id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable' },
    })),
    locale: (roleLocale) => element(by.control({
        controlType: 'sap.m.Text',
        properties: {
            text: roleLocale,
        },
        ancestor: { id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable' },
    })),
    description: (roleDescription) => element(by.control({
        controlType: 'sap.m.Text',
        properties: {
            text: roleDescription,
        },
        ancestor: { id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable' },
    })),
    descriptionInEditMode: (roleDescription) => element(by.control({
        controlType: 'sap.m.Input',
        properties: {
            value: roleDescription,
        },
        ancestor: { id: 'projectRoleUi::ProjectRoleObjectPage--fe::table::texts::LineItem-innerTable' },
    })),
    objPageCancelButton: element(by.id('projectRoleUi::ProjectRoleObjectPage--fe::FooterBar::StandardAction::Cancel')),
};
module.exports = {
    roleData,
    roleHeader,
    roleHeaderData,
    actions,
    role,
};
