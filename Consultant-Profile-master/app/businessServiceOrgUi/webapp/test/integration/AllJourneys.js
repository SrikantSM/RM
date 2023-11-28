sap.ui.require(
    ["sap/fe/test/JourneyRunner",
        "businessServiceOrgUi/test/integration/pages/MainListReport",
        "businessServiceOrgUi/test/integration/MainJourney"],
    function (JourneyRunner, MainListReport, Journey) {
        "use strict";
        var BusinessServiceJourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl("businessServiceOrgUi/app") + ".html", // MANDATORY: Compare resource root definitions in karma.base.conf.js
            launchParameters: {
                serverDelay: 0,
                responderOn: true,
                demoApp: "businessServiceOrgUi",
                "sap-ui-language": sap.ui.getCore().getConfiguration().getLanguage()
            },
            opaConfig: {
                // if possible, read from karma config and convert back to seconds
                // eslint-disable-next-line no-undef
                timeout: (__karma__ && __karma__.config.opaTimeout && (__karma__.config.opaTimeout / 1000)) || 15
            },
            pages: { onTheMainPage: MainListReport}
        });
        BusinessServiceJourneyRunner.run(
            Journey.run
        );
    }
);
