import { OrganizationDetail } from 'test-commons';
import { allOrganizationHeaders as OrganizationHeaders, organizationHeadersForSO as organizationHeadersSO } from './OrganizationHeader';

const unitKeyCCDE: string = 'CCDE0001';
const unitKeyCCIN: string = 'CCIN0001';
const unitKey1: string = 'C003XYZ01';
const unitKey2: string = 'C003XYZ02';
const unitKey3: string = 'C003XYZ03';
const unitKey4: string = 'C003XYZ04';
const unitKey5: string = 'C003XYZ05';
const unitKey6: string = 'C003XYZ06';
const companyCode1: string = 'C001';
const companyCode2: string = 'C002';
const companyCode3: string = 'C003';

const organizationDetail1: OrganizationDetail = {
    code: OrganizationHeaders[0].code,
    unitKey: unitKeyCCDE,
    unitType: 'CS',
    compositeUnitKey: `${OrganizationHeaders[0].code}_${unitKeyCCDE}`,
};

const organizationDetail2: OrganizationDetail = {
    code: OrganizationHeaders[1].code,
    unitKey: unitKeyCCIN,
    unitType: 'CS',
    compositeUnitKey: `${OrganizationHeaders[1].code}_${unitKeyCCIN}`,
};

const organizationDetail3: OrganizationDetail = {
    code: organizationHeadersSO[0].code,
    unitKey: unitKey1,
    unitType: 'CS',
    compositeUnitKey: `${organizationHeadersSO[0].code}_${unitKey1}`,
};

const organizationDetail4: OrganizationDetail = {
    code: organizationHeadersSO[0].code,
    unitKey: unitKey2,
    unitType: 'CS',
    compositeUnitKey: `${organizationHeadersSO[0].code}_${unitKey2}`,
};

const organizationDetail5: OrganizationDetail = {
    code: organizationHeadersSO[1].code,
    unitKey: unitKey3,
    unitType: 'CS',
    compositeUnitKey: `${organizationHeadersSO[1].code}_${unitKey3}`,
};

const organizationDetail6: OrganizationDetail = {
    code: organizationHeadersSO[1].code,
    unitKey: unitKey4,
    unitType: 'CS',
    compositeUnitKey: `${organizationHeadersSO[1].code}_${unitKey4}`,
};

const organizationDetail7: OrganizationDetail = {
    code: organizationHeadersSO[2].code,
    unitKey: unitKey5,
    unitType: 'CS',
    compositeUnitKey: `${organizationHeadersSO[2].code}_${unitKey5}`,
};

const organizationDetail8: OrganizationDetail = {
    code: organizationHeadersSO[2].code,
    unitKey: unitKey6,
    unitType: 'CS',
    compositeUnitKey: `${organizationHeadersSO[2].code}_${unitKey6}`,
};

const organizationDetail9: OrganizationDetail = {
    code: OrganizationHeaders[0].code,
    unitKey: companyCode1,
    unitType: 'CC',
    compositeUnitKey: `${OrganizationHeaders[0].code}_${companyCode1}`,
};

const organizationDetail10: OrganizationDetail = {
    code: OrganizationHeaders[1].code,
    unitKey: companyCode2,
    unitType: 'CC',
    compositeUnitKey: `${OrganizationHeaders[1].code}_${companyCode2}`,
};

const organizationDetail11: OrganizationDetail = {
    code: organizationHeadersSO[0].code,
    unitKey: companyCode3,
    unitType: 'CC',
    compositeUnitKey: `${organizationHeadersSO[0].code}_${companyCode3}`,
};

const organizationDetail12: OrganizationDetail = {
    code: organizationHeadersSO[1].code,
    unitKey: companyCode3,
    unitType: 'CC',
    compositeUnitKey: `${organizationHeadersSO[1].code}_${companyCode3}`,
};

const organizationDetail13: OrganizationDetail = {
    code: organizationHeadersSO[1].code,
    unitKey: companyCode3,
    unitType: 'CC',
    compositeUnitKey: `${organizationHeadersSO[1].code}_${companyCode3}`,
};

const allOrganizationDetails = [
    organizationDetail1,
    organizationDetail2,
    organizationDetail9,
    organizationDetail10,
];

const organizationDetailsForSO = [
    organizationDetail3,
    organizationDetail4,
    organizationDetail5,
    organizationDetail6,
    organizationDetail7,
    organizationDetail8,
    organizationDetail11,
    organizationDetail12,
    organizationDetail13,
];

export {
    allOrganizationDetails,
    organizationDetailsForSO,
    organizationDetail1,
    organizationDetail2,
    organizationDetail3,
    organizationDetail4,
    organizationDetail5,
    organizationDetail6,
    organizationDetail7,
    organizationDetail8,
    organizationDetail9,
    organizationDetail10,
    organizationDetail11,
    organizationDetail12,
    organizationDetail13,
};
