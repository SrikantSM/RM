sap.ui.require(
    ["sap/fe/test/JourneyRunner",
        "replicationScheduleUi/test/integration/pages/MainListReport",
        "replicationScheduleUi/test/integration/MainJourney"],
    function (JourneyRunner, MainListReport, Journey) {
        "use strict";
        var ReplicationScheduleJourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl("replicationScheduleUi/app") + ".html", // MANDATORY: Compare resource root definitions in karma.base.conf.js
            launchParameters: {
                serverDelay: 0,
                responderOn: true,
                demoApp: "replicationScheduleUi",
                'sap-ui-language': "en_US"
            },
            opaConfig: {
                // if possible, read from karma config and convert back to seconds
                // eslint-disable-next-line no-undef
                timeout: (__karma__ && __karma__.config.opaTimeout && (__karma__.config.opaTimeout / 1000)) || 15
            },
            pages: { onTheMainPage: MainListReport}
        });
        ReplicationScheduleJourneyRunner.run(
            Journey.run
        );
    }
);

