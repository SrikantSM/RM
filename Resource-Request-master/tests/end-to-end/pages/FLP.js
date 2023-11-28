module.exports = {
    tiles: {
        manageResourceRequest: element(
            by.control({
                controlType: 'sap.m.GenericTile',
                properties: { header: 'Manage Resource Requests' }
            })
        ),
        processeResourceRequest: element(
            by.control({
                controlType: 'sap.m.GenericTile',
                properties: { header: 'Staff Resource Requests' }
            })
        )
    },
    header: {
        backButton: element(
            by.control({
                id: 'backBtn'
            })
        ),
        // Home Button is, seemingly, no separate UI5 control, but lives with a special DOM ID within the UI5 control shell-header
        homeButton: element(
            by.control({
                id: 'shell-header'
            })
        ).element(by.id('shell-header-logo'))
    },
    waitForInitialAppLoad: (elementId) => browser.driver.wait(
        () => browser.driver.findElements(by.id(elementId)).then((elements) => !!elements.length),
        browser.getPageTimeout, 'Waiting for app load to finish'
    )
};
