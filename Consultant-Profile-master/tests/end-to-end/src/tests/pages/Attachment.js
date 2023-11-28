const parentElements = {

    attachmentSection: element(
        by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FacetSection::Attachment'),
    ),

};

const basicData = {

    elements: {

        buttonInAnchorBar: element(
            by.id('myProjectExperienceUi::MyProjectExperienceObjectPage--fe::ObjectPage-anchBar-myProjectExperienceUi::MyProjectExperienceObjectPage--fe::FacetSection::Attachment-anchor'),
        ),

        attachmentSectionLabel: element(by.control({
            controlType: 'sap.ui.core.Title',
            properties: {
                text: 'Resume',
            },
        })),

        attachmentUploadButton: parentElements.attachmentSection.element(
            by.control({
                controlType: 'sap.m.Button',
                properties: {
                    icon: 'sap-icon://upload',
                },
            }),
        ),

        attachmentDeleteButton: parentElements.attachmentSection.element(
            by.control({
                controlType: 'sap.m.Button',
                properties: {
                    icon: 'sap-icon://sys-cancel',
                },
            }),
        ),

        attachmentUploadTextButton: parentElements.attachmentSection.element(
            by.control({
                controlType: 'sap.m.ObjectStatus',
                properties: {
                    text: 'Upload a DOCX or PDF file of up to 2 MB.',
                },
            }),
        ),

        attachmentDppTextButton: parentElements.attachmentSection.element(
            by.control({
                controlType: 'sap.m.ObjectStatus',
                properties: {
                    text: 'This document will be used across applications in resource management. Please be aware of your responsibilities in uploading the document, and ensure that information in the document complies with the data protection and privacy regulations of your organization.',
                },
            }),
        ),

        attachmentFileUpload: element.all(by.control({
            controlType: 'sap.ui.unified.FileUploader',
            properties: {
                name: 'FEV4FileUpload',
            },
            interaction: {
                idSuffix: 'fu',
            },
        })).last(),
    },

};

const actions = {

    navigateToAttachments() {
        basicData.elements.buttonInAnchorBar.click();
    },

    getAttachment(attachmentURL) {
        const attachment = parentElements.consultantHeaders.content.element(
            by.control({
                controlType: 'sap.m.Link',
                properties: {
                    text: attachmentURL,
                },
            }),
        );
        return attachment;
    },

    getAttachmentValue(fileValue) {
        const attachmentValue = element.all(by.control({
            controlType: 'sap.ui.unified.FileUploader',
            properties: {
                name: 'FEV4FileUpload',
            },
            interaction: {
                idSuffix: 'fu',
            },
        })).last();
        attachmentValue.sendKeys(fileValue);
        return attachmentValue;
    },

};

module.exports = {

    actions,
    basicData,
    parentElements,
};
