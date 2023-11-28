import { OrganizationDetail } from 'test-commons';
import { organizationHeaderUpload3, organizationHeaderUpload2, organizationHeaderUpload1 } from './OrganizationHeaderUpload';

const unitKey1: string = '2710XYZ1';
const unitKey2: string = '2710XYZ2';
const unitKey3: string = '2010XYZ2';
const unitKey4: string = '2710XYZ3';
const companyCode1: string = '2710';
const companyCode2: string = '2010';

const organizationDetailUpload1: OrganizationDetail = {
    code: organizationHeaderUpload1.code,
    unitKey: unitKey1,
    unitType: 'CS',
    compositeUnitKey: `${organizationHeaderUpload1.code}_${unitKey1}`,
};

const organizationDetailUpload2: OrganizationDetail = {
    code: organizationHeaderUpload2.code,
    unitKey: unitKey2,
    unitType: 'CS',
    compositeUnitKey: `${organizationHeaderUpload2.code}_${unitKey2}`,
};

const organizationDetailUpload3: OrganizationDetail = {
    code: organizationHeaderUpload2.code,
    unitKey: companyCode1,
    unitType: 'CC',
    compositeUnitKey: `${organizationHeaderUpload2.code}_${unitKey2}`,
};

const organizationDetailUpload4: OrganizationDetail = {
    code: organizationHeaderUpload1.code,
    unitKey: companyCode1,
    unitType: 'CC',
    compositeUnitKey: `${organizationHeaderUpload1.code}_${companyCode1}`,
};

const organizationDetailUpload5: OrganizationDetail = {
    code: organizationHeaderUpload1.code,
    unitKey: companyCode2,
    unitType: 'CC',
    compositeUnitKey: `${organizationHeaderUpload1.code}_${companyCode1}`,
};

const organizationDetailUpload6: OrganizationDetail = {
    code: organizationHeaderUpload1.code,
    unitKey: unitKey3,
    unitType: 'CS',
    compositeUnitKey: `${organizationHeaderUpload1.code}_${companyCode1}`,
};

const organizationDetailUpload7: OrganizationDetail = {
    code: organizationHeaderUpload3.code,
    unitKey: companyCode1,
    unitType: 'CC',
    compositeUnitKey: `${organizationHeaderUpload3.code}_${companyCode1}`,
};

const organizationDetailUpload8: OrganizationDetail = {
    code: organizationHeaderUpload3.code,
    unitKey: unitKey4,
    unitType: 'CS',
    compositeUnitKey: `${organizationHeaderUpload3.code}_${unitKey4}`,
};

const allOrganizationDetailUploads = [
    organizationDetailUpload1,
    organizationDetailUpload2,
    organizationDetailUpload3,
    organizationDetailUpload4,
    organizationDetailUpload5,
    organizationDetailUpload6,
    organizationDetailUpload7,
    organizationDetailUpload8,
];

export {
    allOrganizationDetailUploads,
    organizationDetailUpload1,
    organizationDetailUpload2,
    organizationDetailUpload3,
    organizationDetailUpload4,
    organizationDetailUpload5,
    organizationDetailUpload6,
    organizationDetailUpload7,
    organizationDetailUpload8,
};
