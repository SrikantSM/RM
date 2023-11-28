const CommonPageElements = require('./CommonPageElements.js');

const listReport = {
    elements: {
        id: 'availabilityUploadUi::AvailabilityDataObjectPage--fe::table::availabilityUploadErrors::LineItem',
        tableRows: CommonPageElements.listReport.elements.tableRows,
        header: CommonPageElements.listReport.elements.header,
    },
};

const availabilityHeader = {

    title: element(
        by.control({
            controlType: 'sap.uxap.ObjectPageDynamicHeaderTitle',
        }),
    ),
    objectPageSection: element(
        by.control({
            controlType: 'sap.uxap.ObjectPageSubSection',
        }),
    ),
    objectPageHeader: element(
        by.control({
            controlType: 'sap.uxap.ObjectPageDynamicHeaderContent',
        }),
    ),

    objectPageTableSection: element(
        by.control({
            controlType: 'sap.uxap.ObjectPageSection',
        }),
    ),

    content: element(
        by.id('availabilityUploadUi::AvailabilityDataObjectPage--fe::HeaderContentContainer'),
    ),

};
const availabilityHeaderData = {

    elements: {

        resourceOrgLabel: availabilityHeader.content.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Resource Organization:',
                },
            }),
        ),
        costCenterLabel: availabilityHeader.content.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Cost Center:',
                },
            }),
        ),
        workforcePersonLabel: availabilityHeader.content.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Workforce Person (External ID):',
                },
            }),
        ),
        workAssignmentLabel: availabilityHeader.content.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Work Assignment (External ID):',
                },
            }),
        ),
        uploadStatusLabel: availabilityHeader.content.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Upload Status:',
                },
            }),
        ),
        uploadChartLabel: availabilityHeader.content.element(
            by.control({
                controlType: 'sap.m.Label',
                properties: {
                    text: 'Total Data Uploaded for Time Period',
                },
            }),
        ),
        availabilityDataChartTitle: element(
            by.control({
                controlType: 'sap.uxap.ObjectPageSection',
                properties: {
                    title: 'Data Uploaded',
                },
            }),
        ),
        availabilityDataChartHeader: element(
            by.control({
                controlType: 'sap.ui.mdc.Chart',
                properties: {
                    header: 'Data Uploaded for Time Period',
                },
            }),
        ),
        uploadErrorTitle: element(
            by.control({
                controlType: 'sap.uxap.ObjectPageSection',
                properties: {
                    title: 'Upload Errors',
                },
            }),
        ),
    },
};

const actions = {
    getHeaderText(itext) {
        const textValue = availabilityHeader.content.element(
            by.control({
                controlType: 'sap.m.Text',
                properties: {
                    text: itext,
                },
            }),
        );
        return textValue;
    },

    getUploadStatus(UploadStatus) {
        const uploadStatusCode = availabilityHeader.content.element(
            by.control({
                controlType: 'sap.m.ObjectStatus',
                properties: {
                    text: UploadStatus,
                },
            }),
        );
        return uploadStatusCode;
    },

    getChartPercentage(PercentageValue) {
        const chartPercentageValue = availabilityHeader.content.element(
            by.control({
                controlType: 'sap.suite.ui.microchart.RadialMicroChart',
                properties: {
                    percentage: PercentageValue,
                },
            }),
        );
        return chartPercentageValue;
    },

    async clickOnExpandButton() {
        const expandId = 'availabilityUploadUi::AvailabilityDataObjectPage--fe::ObjectPage-OPHeaderContent-collapseBtn';
        const expandButton = element(by.id(expandId));
        await expandButton.click();
    },

};

const availabilityError = {
    tableTitle: element(
        by.id('availabilityUploadUi::AvailabilityDataObjectPage--fe::FacetSection::availabilityUploadErrors::LineItem'),
    ),

    errorListRow: (fileEntry) => element(by.control({
        controlType: 'sap.m.ColumnListItem',
        ancestor: {
            id: 'availabilityUploadUi::AvailabilityDataObjectPage--fe::table::availabilityUploadErrors::LineItem-innerTable',
        },
        descendant: {
            controlType: 'sap.m.Text',
            properties: { text: fileEntry },
        },
    })),
    csvFileEntry: (fileEntry) => element(by.control({
        controlType: 'sap.m.Text',
        // fe::table::availabilityUploadErrors::LineItem::DataField::csvRecordIndex
        properties: { text: fileEntry },
        ancestor: { id: 'availabilityUploadUi::AvailabilityDataObjectPage--fe::table::availabilityUploadErrors::LineItem-innerTable' },
    })),
    referenceDate: (refDate) => element(by.control({
        controlType: 'sap.m.Text',
        // fe::table::availabilityUploadErrors::LineItem::DataField::startDate
        properties: { text: refDate },
        ancestor: { id: 'availabilityUploadUi::AvailabilityDataObjectPage--fe::table::availabilityUploadErrors::LineItem-innerTable' },
    })),
    errorMessage: (errorListRow, message) => errorListRow.element(by.control({
        controlType: 'sap.m.Text',
        id: /fe::table::availabilityUploadErrors::LineItem::DataField::error_desc/,
        properties: {
            text: message,
        },
    })),
    message: (errorMessage) => element(by.control({
        controlType: 'sap.m.Text',
        properties: { text: errorMessage },
        ancestor: {
            id: 'availabilityUploadUi::AvailabilityDataObjectPage--fe::table::availabilityUploadErrors::LineItem-innerTable',
        },
    })),
};

module.exports = {
    listReport,
    availabilityHeaderData,
    availabilityHeader,
    actions,
    availabilityError,
};
