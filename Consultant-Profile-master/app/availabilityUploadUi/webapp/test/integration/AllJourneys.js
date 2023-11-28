sap.ui.require(
    ["sap/fe/test/JourneyRunner",
        "availabilityUploadUi/test/integration/pages/MainListReport",
        "availabilityUploadUi/test/integration/pages/MainObjectPage",
        "availabilityUploadUi/test/integration/AvailabilityUploadUiMainJourney"],
    function (JourneyRunner, MainListReport, MainObjectPage, Journey) {
        "use strict";
        var AvailabilityUploadJourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl("availabilityUploadUi/app") + ".html", // MANDATORY: Compare resource root definitions in karma.base.conf.js
            launchParameters: {
                serverDelay: 0,
                responderOn: true,
                demoApp: "availabilityUploadUi",
                "sap-ui-language": sap.ui.getCore().getConfiguration().getLanguage()
            },
            opaConfig: {
                // if possible, read from karma config and convert back to seconds
                // eslint-disable-next-line no-undef
                timeout: (__karma__ && __karma__.config.opaTimeout && (__karma__.config.opaTimeout / 1000)) || 15
            },
            pages: { onTheMainPage: MainListReport, onTheDetailPage: MainObjectPage }
        });
        AvailabilityUploadJourneyRunner.run(
            Journey.run
        );
    }
);
