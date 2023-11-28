const { TestHelper } = require('../../utils/TestHelper');

describe('NoAuthorizationForProjExpTileJourney', () => {
    const testHelper = new TestHelper();

    testHelper.loginWithRole('ConfigurationExpert');

    testHelper.failEarlyIt('No Tile for My Project Experience is visible', () => {
        const tile = element.all(
            by.control({
                properties: { header: 'My Project Experience' },
                controlType: 'sap.m.GenericTile',
            }),
        );

        expect(tile.isPresent()).toBeFalsy();
    });

    testHelper.logout();
});
