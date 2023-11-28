const formContainer = element(
    by.control({
        controlType: 'sap.ui.layout.form.FormContainer',
    }),
);

const formElements = formContainer.all(
    by.control({
        controlType: 'sap.ui.layout.form.FormElement',
    }),
);

const elements = {

    nameField: formElements.get(0).element(
        by.control({
            controlType: 'sap.ui.mdc.Field',
        }),
    ),
    codeField: formElements.get(1).element(
        by.control({
            controlType: 'sap.ui.mdc.Field',
        }),
    ),
    descriptionField: formElements.get(2).element(
        by.control({
            controlType: 'sap.ui.mdc.Field',
        }),
    ),
};
const createDialog = {
    dialogControl: element(by.control({
        controlType: 'sap.m.Dialog',
        properties: { title: 'Create' },
    })),
    languageCodeInput: element(by.control({
        id: 'APD_::locale',
    })),
    codeInput: element(by.control({
        id: 'APD_::code',
    })),
    nameInput: element(by.control({
        id: 'APD_::name',
    })),
    descriptionInput: element(by.control({
        id: 'APD_::description',
    })),
    createButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'Continue' },
        ancestor: { controlType: 'sap.m.Dialog' },
    })),
    cancelButton: element(by.control({
        controlType: 'sap.m.Button',
        properties: { text: 'Cancel' },
        ancestor: { controlType: 'sap.m.Dialog' },
    })),
};

const actions = {

    async setName(val) {
        await elements.nameField.sendKeys(val);
    },
    async setCode(val) {
        await elements.codeField.sendKeys(val);
    },
    async setDescription(val) {
        await elements.descriptionField.sendKeys(val);
    },
    async getCreateEnabled() {
        return createDialog.createButton.asControl().getProperty('enabled');
    },
};

module.exports = {
    actions,
    createDialog,
};
