const { TestHelper } = require('../../utils/TestHelper');

describe('NoAuthorizationForMyAssignTileJourney', () => {
    const testHelper = new TestHelper();

    testHelper.loginWithRole('ConfigurationExpert');

    testHelper.failEarlyIt('No Tile for My Assignments is visible', () => {
        const tile = element.all(
            by.control({
                properties: { header: 'My Assignments' },
                controlType: 'sap.m.GenericTile',
            }),
        );

        expect(tile.isPresent()).toBeFalsy();
    });

    testHelper.logout();
});
