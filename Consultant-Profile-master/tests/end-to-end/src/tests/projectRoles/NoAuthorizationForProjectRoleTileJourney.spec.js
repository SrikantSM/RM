const { TestHelper } = require('../../utils/TestHelper');

describe('NoAuthorizationForProjectRoleTileJourney', () => {
    const testHelper = new TestHelper();

    testHelper.loginWithRole('Consultant');

    testHelper.failEarlyIt('No Tile for Project Role Management is visible', () => {
        const tile = element.all(
            by.control({
                properties: { header: 'Manage Project Roles' },
                controlType: 'sap.m.GenericTile',
            }),
        );

        expect(tile.isPresent()).toBeFalsy();
    });

    testHelper.logout();
});
