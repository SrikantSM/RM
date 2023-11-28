const parentElements = {

    managerContactCard: {

        popover: element(
            by.control({
                controlType: 'sap.m.Popover',
            }),
        ),

        headerTitle: element(
            by.id('application-myProjectExperienceUi-Display-component---idInfoPanel'),
        ),

        contactDetails: element(
            by.id('application-myProjectExperienceUi-Display-component---idInfoPanel--idSectionAdditionalContent'),
        ),

    },

    consultantHeaders: {

        title: element(
            by.control({
                controlType: 'sap.uxap.ObjectPageDynamicHeaderTitle',
                interaction: 'focus',
            }),
        ),

        content: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::HeaderContentContainer'),
        ),

        editContent: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::EditableHeaderSection'),
        ),

        collapseButton: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::ObjectPage-OPHeaderContent-collapseBtn'),
        ),

        expandButton: element(
            by.control({
                controlType: 'sap.m.Button',
                properties: {
                    id: /expandBtn$/,
                },
            }),
        ),

        profilePhotoSection: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FormContainer::FieldGroup::ProfilePhoto'),
        ),

    },

};

const errorDialog = {

    dialog: element(
        by.control({
            controlType: 'sap.m.Dialog',
            properties: {
                type: 'Message',
            },
        }),
    ),

};

const basicData = {

    elements: {

        orgInfo: parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Title',
                properties: {
                    text: 'Organizational Information',
                },
            }),
        ),

        orgInfoDeptLabel: parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Resource Organization:',
                },
            }),
        ),

        orgInfoOfficeLocLabel: parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Office Location:',
                },
            }),
        ),

        orgInfoCostCenterLabel: parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Cost Center:',
                },
            }),
        ),

        orgInfoManagerLabel: parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Manager:',
                },
            }),
        ),

        contactInfo: parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Title',
                properties: {
                    text: 'Contact Information',
                },
            }),
        ),

        contactInfoMobileNoLabel: parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Mobile:',
                },
            }),
        ),

        contactInfoEmailLabel: parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Email:',
                },
            }),
        ),

        workerType: parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Worker Type:',
                },
            }),
        ),

        changeRecordInfo: parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Title',
                properties: {
                    text: 'Change Record',
                },
            }),
        ),

        changedOnLabel: parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Changed On:',
                },
            }),
        ),

        changedByLabel: parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Changed By:',
                },
            }),
        ),

        profilePhotoAvatar: parentElements.consultantHeaders.profilePhotoSection.element(
            by.control({
                controlType: 'sap.m.Avatar',
            }),
        ),

        profilePhotoSectionLabel: element(by.control({
            controlType: 'sap.ui.core.Title',
            properties: {
                text: 'Profile Picture',
            },
        })),

        profilePhotoIcon: parentElements.consultantHeaders.profilePhotoSection.element(
            by.control({
                controlType: 'sap.ui.core.Icon',
                properties: {
                    icon: 'sap-icon://product',
                },
            }),
        ),

        profilePhotoUploadButton: parentElements.consultantHeaders.profilePhotoSection.element(
            by.control({
                controlType: 'sap.m.Button',
                properties: {
                    icon: 'sap-icon://upload',
                },
            }),
        ),

        profilePhotoDeleteButton: parentElements.consultantHeaders.profilePhotoSection.element(
            by.control({
                controlType: 'sap.m.Button',
                properties: {
                    icon: 'sap-icon://sys-cancel',
                },
            }),
        ),

        profilePhotoFileUpload: element(by.control({
            controlType: 'sap.ui.unified.FileUploader',
            properties: {
                name: 'FEV4FileUpload',
            },
            interaction: {
                idSuffix: 'fu',
            },
        })),

        managerContactCardContactDetails: element(
            by.control({
                controlType: 'sap.ui.core.Title',
                properties: {
                    text: 'Contact Information',
                },
            }),
        ),

        managerContactCardContactDetailsEmailLabel: element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'E-Mail',
                },
            }),
        ),

        managerContactCardContactDetailsNameLabel: element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Name',
                },
            }),
        ),

        managerContactCardContactDetailsMobileLabel: element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Mobile',
                },
            }),
        ),

        profilePhotoAvataronHeader: parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Avatar',
                properties: {
                    initials: 'EE',
                },
            }),
        ),

        profilePhotoAvataronEditHeader: parentElements.consultantHeaders.title.element(
            by.control({
                controlType: 'sap.m.Avatar',
                properties: {
                    initials: 'EE',
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

        buttonInAnchorBar: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::ObjectPage-anchBar-myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FacetSection::Header-anchor'),
        ),

    },
};

const actions = {

    async logout() {
        const logoutButton = element(by.control({
            controlType: 'sap.ushell.ui.shell.ShellHeadItem',
            properties: {
                icon: 'sap-icon://person-placeholder',
            },
        }));

        logoutButton.click();

        const signOutListItem = element(by.control({
            controlType: 'sap.m.StandardListItem',
            properties: {
                title: 'Sign Out',
            },
        }));

        signOutListItem.click();

        const okButton = element(by.control({
            controlType: 'sap.m.Button',
            properties: {
                text: 'OK',
            },
        }));

        okButton.click();
    },

    getHeaderTitle(consultantName) {
        const title = parentElements.consultantHeaders.title.element(
            by.control({
                controlType: 'sap.m.Title',
                properties: {
                    text: consultantName,
                },
            }),
        );
        return title;
    },

    getHeaderLabel(consultantProfile) {
        const profile = parentElements.consultantHeaders.title.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: consultantProfile,
                },
            }),
        );
        return profile;
    },

    getProfilePhoto(imageURL) {
        const photoURL = parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Avatar',
                properties: {
                    src: imageURL,
                },
            }),
        );
        return photoURL;
    },

    getOrgInfoDeptValue(consultantDept) {
        const dept = parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: consultantDept,
                },
            }),
        );
        return dept;
    },

    getOrgInfoOfficeLocValue(consultantOfficeLoc) {
        const officeLocation = parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: consultantOfficeLoc,
                },
            }),
        );
        return officeLocation;
    },

    getWorkerCostCenterValue(consultantCostCenter) {
        const costCenter = parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: consultantCostCenter,
                },
            }),
        );
        return costCenter;
    },

    getOrgInfoManagerValue(consultantManager) {
        const manager = parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.ui.mdc.Field',
                properties: {
                    value: consultantManager,
                },
            }),
        );
        return manager;
    },

    getContactInfoMobileNoValue(consultantMobNum) {
        const number = parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: consultantMobNum,
                },
            }),
        );
        return number;
    },

    getContactInfoEmailValue(consultantEmail) {
        const email = parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: consultantEmail,
                },
            }),
        );
        return email;
    },

    getWorkerTypeValue(consultantWorkerType) {
        const workerType = parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: consultantWorkerType,
                },
            }),
        );
        return workerType;
    },

    getOrgInfoDeptValueonEdit(consultantDept) {
        const dept = parentElements.consultantHeaders.editContent.element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: consultantDept,
                },
            }),
        );
        return dept;
    },

    getOrgInfoOfficeLocValueonEdit(consultantOfficeLoc) {
        const officeLocation = parentElements.consultantHeaders.editContent.element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: consultantOfficeLoc,
                },
            }),
        );
        return officeLocation;
    },

    getWorkforcePersonIdValueonEdit(consultantWorkforcePersonID) {
        const workforcePersonID = parentElements.consultantHeaders.editContent.element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: consultantWorkforcePersonID,
                },
            }),
        );
        return workforcePersonID;
    },

    getWorkerCostCenterValueonEdit(consultantCostCenter) {
        const costCenter = parentElements.consultantHeaders.editContent.element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: consultantCostCenter,
                },
            }),
        );
        return costCenter;
    },

    getOrgInfoManagerValueonEdit(consultantManager) {
        const manager = parentElements.consultantHeaders.editContent.element(
            by.control({
                controlType: 'sap.ui.mdc.Field',
                properties: {
                    value: consultantManager,
                },
            }),
        );
        return manager;
    },

    getContactInfoMobileNoValueonEdit(consultantMobNum) {
        const number = parentElements.consultantHeaders.editContent.element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: consultantMobNum,
                },
            }),
        );
        return number;
    },

    getContactInfoEmailValueonEdit(consultantEmail) {
        const email = parentElements.consultantHeaders.editContent.element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: consultantEmail,
                },
            }),
        );
        return email;
    },

    getWorkerTypeValueonEdit(consultantWorkerType) {
        const workerTypeValue = parentElements.consultantHeaders.editContent.element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: consultantWorkerType,
                },
            }),
        );
        return workerTypeValue;
    },

    navigateToManager(consultantManager) {
        this.getOrgInfoManagerValue(consultantManager).click();
    },

    getManagerContactCardNameValue(managerName) {
        const name = element(
            by.control({
                controlType: 'sap.m.Title',
                properties: {
                    text: managerName,
                },
            }),
        );
        return name;
    },

    getManagerContactCardEmailValue(managerEmail) {
        const email = element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: managerEmail,
                },
            }),
        );
        return email;
    },

    getManagerContactCardMobileNoValue(managerMobNo) {
        const mobileNo = element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: managerMobNo,
                },
            }),
        );
        return mobileNo;
    },

    onClickEdit() {
        basicData.elements.headerTitle
            .element(
                by.control({
                    controlType: 'sap.m.Button',
                    properties: {
                        text: 'Edit',
                    },
                }),
            ).click();
    },

    getProfilePhotoValue(fileValue) {
        const profilePhotoValue = element(by.control({
            controlType: 'sap.ui.unified.FileUploader',
            properties: {
                name: 'FEV4FileUpload',
            },
            interaction: {
                idSuffix: 'fu',
            },
        }));
        return profilePhotoValue;
    },

    getErrorDialogMessageText(errorMessage) {
        const errorMsg = element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: errorMessage,
                },
            }),
        );
        return errorMsg;
    },

    navigateToHeaderInfo() {
        basicData.elements.buttonInAnchorBar.click();
    },

};

module.exports = {

    actions,
    basicData,
    parentElements,
    errorDialog,
};
