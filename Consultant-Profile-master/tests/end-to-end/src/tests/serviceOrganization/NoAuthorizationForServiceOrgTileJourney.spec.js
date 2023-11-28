const { TestHelper } = require('../../utils/TestHelper');

describe('NoAuthorizationForServiceOrgTileJourney', () => {
    const testHelper = new TestHelper();

    testHelper.loginWithRole('Consultant');

    testHelper.failEarlyIt('No Tile for Maintain Service Organizations is visible', () => {
        const tile = element.all(
            by.control({
                properties: { header: 'Maintain Service Organizations' },
                controlType: 'sap.m.GenericTile',
            }),
        );

        expect(tile.isPresent()).toBeFalsy();
    });

    testHelper.logout();
});
