const uuid = require('uuid').v4;

const moment = require('moment');

const demands = [
    {
        ID: uuid(),
        externalID: 'DEM_EXT1',
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(2, 'months').endOf('month').format('YYYY-MM-DD'),
        requestedQuantity: 600,
        requestedUoM: 'H',
        billingRole_ID: 'B001_CDE2E',
        billingCategory_ID: 'CD1',
        workPackage_ID: 'S4PROJ_CDE2E.1.1',
        deliveryOrganization_code:'Org_1'
    },
    {
        ID: uuid(),
        externalID: 'DEM_EXT2',
        startDate: moment().startOf('month').add(3, 'months').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(5, 'months').endOf('month').format('YYYY-MM-DD'),
        requestedQuantity: 800,
        requestedUoM: 'H',
        billingRole_ID: 'B002_CDE2E',
        billingCategory_ID: 'CD2',
        workPackage_ID: 'S4PROJ_CDE2E.1.2',
        deliveryOrganization_code:'Org_2'
    },
    {
        ID: uuid(),
        externalID: 'DEM_EXT3',
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(2, 'months').endOf('month').format('YYYY-MM-DD'),
        requestedQuantity: 300,
        requestedUoM: 'H',
        billingRole_ID: 'B001_CDE2E',
        billingCategory_ID: 'CD2',
        workPackage_ID: 'EWMPRD_CDE2E.1.1',
        deliveryOrganization_code:'Org_2'
    },
    {
        ID: uuid(),
        externalID: 'DEM_EXT4',
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(2, 'months').endOf('month').format('YYYY-MM-DD'),
        requestedQuantity: 400,
        requestedUoM: 'H',
        billingRole_ID: 'B001_CDE2E',
        billingCategory_ID: 'CD1',
        workPackage_ID: 'mockServerStrictMode',
        deliveryOrganization_code:'Org_2'
    },
    {
        ID: uuid(),
        externalID: 'DEM_EXT5',
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().startOf('month').add(2, 'months').endOf('month').format('YYYY-MM-DD'),
        requestedQuantity: 400,
        requestedUoM: 'H',
        billingRole_ID: 'B001_CDE2E',
        billingCategory_ID: 'CD1',
        workPackage_ID: 'TimeOutWP',
        deliveryOrganization_code:'Org_2'
    }
];

const demandCapacityRequirements = demands.reduce(
    (demandCapacities, element) => {
        const demenadCapacity = {
            ID: uuid(),
            startDate: element.startDate,
            endDate: element.endDate,
            requestedQuantity: element.requestedQuantity,
            requestedUoM: element.requestedUoM,
            demand_ID: element.ID
        };

        demandCapacities = [...demandCapacities, demenadCapacity];

        return demandCapacities;
    },
    []
);

module.exports = { demands, demandCapacityRequirements };
