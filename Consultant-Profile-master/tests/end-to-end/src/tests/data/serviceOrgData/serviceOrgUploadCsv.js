function getCSVData(code1, code2, code3, costCenter1, costCenter2, costCenter3, costCenter4, costCenter5, costCenter6) {
    const data = [
        {
            code: code1,
            description: 'Organization Portland',
            isDelivery: 'X',
            companyCode: 'ZZZZ',
            costCenterID: costCenter1,
        },
        {
            code: code1,
            description: 'Organization Portland',
            isDelivery: 'X',
            companyCode: 'ZZZZ',
            costCenterID: costCenter2,
        },
        {
            code: code2,
            description: 'Organization Singapore',
            isDelivery: 'X',
            companyCode: 'ZZZZ',
            costCenterID: costCenter3,
        },
        {
            code: code2,
            description: 'Organization Singapore',
            isDelivery: 'X',
            companyCode: 'ZZZZ',
            costCenterID: costCenter4,
        },
        {
            code: code3,
            description: 'Organization Scotland',
            isDelivery: 'X',
            companyCode: 'ZZZZ',
            costCenterID: costCenter5,
        },
        {
            code: code3,
            description: 'Organization Scotland',
            isDelivery: 'X',
            companyCode: 'ZZZZ',
            costCenterID: costCenter6,
        },
    ];
    return data;
}

function getDuplicateCostCenterData(code1, costCenter1, code2) {
    const data = [
        {
            code: code1,
            description: 'Organization Germany',
            isDelivery: 'X',
            companyCode: 'YYYY',
            costCenterID: costCenter1,
        },

        {
            code: code2,
            description: 'Organization India',
            isDelivery: 'X',
            companyCode: 'YYYY',
            costCenterID: costCenter1,
        },
    ];
    return data;
}

function getOneValidRecord(code1, costCenter1) {
    const data = [
        {
            code: code1,
            description: 'Organization Germany',
            isDelivery: 'X',
            companyCode: 'YYYY',
            costCenterID: costCenter1,
        },
    ];
    return data;
}

function getInvalidDefaultCCData(code, costCenter1, costCenter2) {
    const data = [
        {
            code,
            description: 'Organization Germany',
            isDelivery: 'X',
            companyCode: 'YYYY',
            costCenterID: costCenter1,
        },

        {
            code,
            description: 'Organization India',
            isDelivery: 'X',
            companyCode: 'YYYY',
            costCenterID: costCenter2,
        },
    ];
    return data;
}

function getMissingColContentData(code) {
    const data = [
        {
            code,
            description: 'Organization Germany',
            isDelivery: 'X',
            companyCode: 'YYYY',
            costCenterID: '',
        },
    ];
    return data;
}

function getMissingColumnData(code1, code2) {
    const data = [
        {
            code: code1,
            description: 'Organization Germany',
            isDelivery: 'X',
            companyCode: 'YYYY',
        },

        {
            code: code2,
            description: 'Organization India',
            isDelivery: 'X',
            companyCode: 'YYYY',
        },
    ];
    return data;
}

function getInvalidCostCenter(code) {
    const data = [
        {
            code,
            description: 'Organization Germany',
            isDelivery: 'X',
            companyCode: 'YYYY',
            costCenterID: '1010ZZZZ',
        },
    ];
    return data;
}

function getCSVDataUpdate(code, costCenter1, costCenter2) {
    const data = [
        {
            code,
            description: 'Organization Germany',
            isDelivery: 'X',
            companyCode: 'YYYY',
            costCenterID: costCenter1,
        },
        {
            code,
            description: 'Organization Germany',
            isDelivery: 'X',
            companyCode: 'YYYY',
            costCenterID: costCenter2,
        },
    ];
    return data;
}

function getChangeCCAssociations(code1, code2, costCenter1, costCenter2, costCenter3, costCenter4) {
    const data = [
        {
            code: code2,
            description: 'Organization Singapore',
            isDelivery: 'X',
            companyCode: 'ZZZZ',
            costCenterID: costCenter1,
        },
        {
            code: code2,
            description: 'Organization Singapore',
            isDelivery: 'X',
            companyCode: 'ZZZZ',
            costCenterID: costCenter2,
        },
        {
            code: code1,
            description: 'Organization Portland',
            isDelivery: 'X',
            companyCode: 'ZZZZ',
            costCenterID: costCenter3,
        },
        {
            code: code1,
            description: 'Organization Portland',
            isDelivery: 'X',
            companyCode: 'ZZZZ',
            costCenterID: costCenter4,
        },
    ];
    return data;
}

function getChangeCCAssociationsWithDanglingSO(code1, costCenter1, costCenter2) {
    const data = [
        {
            code: code1,
            description: 'Organization Portland',
            isDelivery: 'X',
            companyCode: 'ZZZZ',
            costCenterID: costCenter1,
        },
        {
            code: code1,
            description: 'Organization Portland',
            isDelivery: 'X',
            companyCode: 'ZZZZ',
            costCenterID: costCenter2,
        },
    ];
    return data;
}

function getChangeWithRRAssignment(code1, companyCode1, costCenter1, costCenter2) {
    const data = [
        {
            code: code1,
            description: 'Service Organization for RR check',
            isDelivery: 'X',
            companyCode: companyCode1,
            costCenterID: costCenter1,
        },
        {
            code: code1,
            description: 'Service Organization for RR check',
            isDelivery: 'X',
            companyCode: companyCode1,
            costCenterID: costCenter2,
        },
    ];
    return data;
}

module.exports.getCSVData = getCSVData;
module.exports.getDuplicateCostCenterData = getDuplicateCostCenterData;
module.exports.getOneValidRecord = getOneValidRecord;
module.exports.getInvalidDefaultCCData = getInvalidDefaultCCData;
module.exports.getMissingColContentData = getMissingColContentData;
module.exports.getMissingColumnData = getMissingColumnData;
module.exports.getInvalidCostCenter = getInvalidCostCenter;
module.exports.getCSVDataUpdate = getCSVDataUpdate;
module.exports.getChangeCCAssociations = getChangeCCAssociations;
module.exports.getChangeCCAssociationsWithDanglingSO = getChangeCCAssociationsWithDanglingSO;
module.exports.getChangeWithRRAssignment = getChangeWithRRAssignment;
