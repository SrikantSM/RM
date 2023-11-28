const parentElements = {
    managerContactCard: {
        popover: element(by.control({
            controlType: 'sap.m.Popover',
        })),

        headerTitle: element(by.id('application-myResourcesUi-Display-component---idInfoPanel')),

        contactDetails: element(by.id('application-myResourcesUi-Display-component---idInfoPanel--idSectionAdditionalContent')),
    },

    consultantHeaders: {
        title: element(by.control({
            controlType: 'sap.uxap.ObjectPageDynamicHeaderTitle',
            interaction: 'focus',
        })),

        content: element(by.id('myResourcesUi::MyResourceObjectPage--fe::ObjectPage-OPHeaderContent')),

        collapseButton: element(
            by.id('myResourcesUi::MyResourceObjectPage--fe::ObjectPage-OPHeaderContent-collapseBtn'),
        ),
    },

    attachmentSection: element(
        by.id('myResourcesUi::MyResourceObjectPage--fe::FacetSection::Attachment'),
    ),

    buttonInAnchorBar: element(
        by.id('myResourcesUi::MyResourceObjectPage--fe::ObjectPage-anchBar-myResourcesUi::MyResourceObjectPage--fe::FacetSection::Modifications-anchor'),
    ),

    attachmentAnchor: element(
        by.id('myResourcesUi::MyResourceObjectPage--fe::ObjectPage-anchBar-myResourcesUi::MyResourceObjectPage--fe::FacetSection::Attachment-anchor'),
    ),

};

const staticAssertions = {

    async orgInfoLabel() {
        const label = await element(
            by.control({
                controlType: 'sap.m.Title',
                properties: {
                    text: 'Organizational Information',
                },
            }),
        );
        expect(await label.isPresent()).toBe(true, 'Org info field group title found');
    },

    async contactInfo() {
        const label = await element(
            by.control({
                controlType: 'sap.m.Title',
                properties: {
                    text: 'Contact Information',
                },
            }),
        );
        expect(await label.isPresent()).toBe(true, 'Contact Info field group title found');
    },

    async workerTypeInfo() {
        const label = await element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Worker Type:',
                },
            }),
        );
        expect(await label.isPresent()).toBe(true, 'Worker Type Info field group title found');
    },

    async managerContactCardHeader(managerName) {
        const label = await element(
            by.control({
                controlType: 'sap.m.Title',
                properties: {
                    text: managerName,
                },
            }),
        );
        expect(await label.isPresent()).toBe(true, 'Manager contact card header found');
    },

    async managerContactCardContactDetails() {
        const label = await element(
            by.control({
                controlType: 'sap.ui.core.Title',
                properties: {
                    text: 'Contact Information',
                },
            }),
        );
        expect(await label.isPresent()).toBe(true, 'Manager contact card deatils found');
    },

    async managerContactCardContactDetailsEmailLabel() {
        const label = await element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'E-Mail',
                },
            }),
        );
        expect(await label.isPresent()).toBe(true, 'Manager contact card details email label found');
    },

    async managerContactCardContactDetailsMobileLabel() {
        const label = await element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Phone',
                },
            }),
        );
        expect(await label.isPresent()).toBe(true, 'Manager contact card deatils mobile label found');
    },

    async changeRecordInfo() {
        const label = await element(
            by.control({
                controlType: 'sap.m.Title',
                properties: {
                    text: 'Change Record',
                },
            }),
        );
        expect(await label.isPresent()).toBe(true, 'Change Record field group title found');
    },

    async changedOnLabel() {
        const label = await element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Changed On:',
                },
            }),
        );
        expect(await label.isPresent()).toBe(true, 'Changed On label found');
    },

    async changedByLabel() {
        const label = await element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Changed By:',
                },
            }),
        );
        expect(await label.isPresent()).toBe(true, 'Changed By label found');
    },
};

const assertions = {

    checkAppTitle: element(by.control({
        controlType: 'sap.ushell.ui.shell.ShellHeadItem',
        properties: {
            text: 'Resource',
        },
    })),

    title: element(
        by.control({
            controlType: 'sap.uxap.ObjectPageDynamicHeaderTitle',
        }),
    ),

    async checkHeaderTitle(consultantName) {
        const title = await parentElements.consultantHeaders.title.element(by.control({
            controlType: 'sap.m.Title',
            properties: {
                text: consultantName,
            },
        }));
        expect(await title.isPresent()).toBe(true, 'Header title found');
    },

    async checkHeaderLabel(consultantProfile) {
        const profile = await parentElements.consultantHeaders.title.element(by.control({
            controlType: 'sap.m.Label',
            properties: {
                text: consultantProfile,
            },
        }));
        expect(await profile.isPresent()).toBe(true, 'Header label found');
    },

    async checkProfilePhoto(imageURL) {
        const photoURL = await element(
            by.control({
                controlType: 'sap.m.Avatar',
                properties: {
                    src: imageURL,
                },
            }),
        );
        expect(await photoURL.isPresent()).toBe(true, 'Profile photo found');
    },

    async checkOrgInfoDeptValue(consultantDept) {
        const dept = await element(by.control({
            controlType: 'sap.m.Text',
            properties: {
                text: consultantDept,
            },
        }));
        expect(await dept.isPresent()).toBe(true, 'Dept value found under org info field group');
    },

    async checkOrgInfoOfficeLocValue(consultantOfficeLoc) {
        const officeLocation = await element(by.control({
            controlType: 'sap.m.Text',
            properties: {
                text: consultantOfficeLoc,
            },
        }));
        expect(await officeLocation.isPresent()).toBe(true, 'Office location value found under org info field group');
    },

    async checkWorkerCostCenterValue(consultantCostCenter) {
        const costCenter = await element(by.control({
            controlType: 'sap.m.Text',
            properties: {
                text: consultantCostCenter,
            },
        }));
        expect(await costCenter.isPresent()).toBe(true, 'Cost center value found under org info field group');
    },

    async checkContactInfoEmailValue(consultantEmail) {
        const email = await element(by.control({
            controlType: 'sap.m.Link',
            properties: {
                text: consultantEmail,
            },
        }));
        expect(await email.isPresent()).toBe(true, 'Email value found under contact info field group');
    },

    async checkContactInfoMobileNoValue(consultantMobNum) {
        const number = await element(by.control({
            controlType: 'sap.m.Link',
            properties: {
                text: consultantMobNum,
            },
        }));
        expect(await number.isPresent()).toBe(true, 'Mobile number value found under contact info field group');
    },

    async checkWorkerTypeValue(workerType) {
        const workerTypeValue = await element(by.control({
            controlType: 'sap.m.Text',
            properties: {
                text: workerType,
            },
        }));
        expect(await workerTypeValue.isPresent()).toBe(true, 'Worker Type value found under Worker Type info field group');
    },

    async checkOrgInfoManagerValue(consultantManager) {
        const manager = await actions.getOrgInfoManagerValue(consultantManager);
        expect(await manager.isPresent()).toBe(true, 'Manager value is found under OrgInfo field group');
    },

    async checkManagerContactCardEmailValue(managerEmail) {
        const email = await element(by.control({
            controlType: 'sap.m.Link',
            properties: {
                text: managerEmail,
            },
        }));
        expect(await email.isPresent()).toBe(true, 'Manager contact card email value found');
    },

    async checkManagerContactCardMobileNoValue(managerMobNo) {
        const mobileNo = await element(by.control({
            controlType: 'sap.m.Link',
            properties: {
                text: managerMobNo,
            },
        }));
        expect(await mobileNo.isPresent()).toBe(true, 'Manager contact card mobile number value found');
    },

    async checkProfilePhotoAvatarOnHeader(personInitials) {
        const profilePhoto = await element(by.control({
            controlType: 'sap.m.Avatar',
            properties: {
                initials: personInitials,
            },
        }));
        expect(await profilePhoto.isPresent()).toBe(true, 'profile photo avatar found');
    },

    navigateToGeneralInfo() {
        parentElements.buttonInAnchorBar.click();
    },

};

const actions = {
    async openManagerContactCard(consultantManager) {
        await this.getOrgInfoManagerValue(consultantManager).click();
    },

    getOrgInfoManagerValue(consultantManager) {
        return element(by.control({
            controlType: 'sap.ui.mdc.Field',
            properties: {
                value: consultantManager,
            },
        }));
    },

    navigateToAttachments() {
        parentElements.attachmentAnchor.click();
    },
};

module.exports = {
    actions,
    assertions,
    parentElements,
    staticAssertions,
};
