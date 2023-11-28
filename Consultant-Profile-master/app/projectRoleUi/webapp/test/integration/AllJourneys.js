sap.ui.require(
    ["sap/fe/test/JourneyRunner",
        "projectRoleUi/test/integration/pages/MainListReport",
        "projectRoleUi/test/integration/pages/MainObjectPage",
        "projectRoleUi/test/integration/ProjectRoleMainJourney"],
    function (JourneyRunner, MainListReport, MainObjectPage, Journey) {
        "use strict";
        var ProjectRoleJourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl("projectRoleUi/app") + ".html", // MANDATORY: Compare resource root definitions in karma.base.conf.js
            launchParameters: {
                serverDelay: 0,
                responderOn: true,
                demoApp: "projectRoleUi",
                'sap-ui-language': "en_US"
            },
            opaConfig: {
                // if possible, read from karma config and convert back to seconds
                // eslint-disable-next-line no-undef
                timeout: (__karma__ && __karma__.config.opaTimeout && (__karma__.config.opaTimeout / 1000)) || 15
            },
            pages: { onTheMainPage: MainListReport, onTheDetailPage: MainObjectPage }
        });
        ProjectRoleJourneyRunner.run(
            Journey.run
        );
    }
);
