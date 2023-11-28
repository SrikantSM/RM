const { TestHelper } = require('../../utils/TestHelper');

describe('NoAuthorizationForAvailabilityUploadTileJourney', () => {
    const testHelper = new TestHelper();

    testHelper.loginWithRole('Consultant');

    testHelper.failEarlyIt('No Tile for Maintain Availability Data is visible', () => {
        const tile = element.all(
            by.control({
                properties: { header: 'Maintain Availability Data' },
                controlType: 'sap.m.GenericTile',
            }),
        );

        expect(tile.isPresent()).toBeFalsy();
    });

    testHelper.logout();
});
