sap.ui.define([
    'sap/fe/test/JourneyRunner',
    'staffResourceRequest/test/integration/pages/ResourceRequestListReport',
    'staffResourceRequest/test/integration/pages/ResourceRequestObjectPage',
    'staffResourceRequest/test/integration/ProcessRequestMainJourney',
    'staffResourceRequest/test/integration/ProcessRequestUxConsistencyTestJourney'
], function (JourneyRunner, ResourceRequestListReport, ResourceRequestObjectPage, MainJourney, UxConsistency) {

    var RRJourneyRunner = new JourneyRunner({
        // start index.html in web folder
        launchUrl: sap.ui.require.toUrl("staffResourceRequest/app") + ".html", // MANDATORY: Compare resource root definitions in karma.base.conf.js
        launchParameters: {
            serverDelay: 0,
            responderOn: true,
            demoApp: "staffResourceRequest",
            'sap-ui-language': "en_US"
        }
    });

    RRJourneyRunner.run(
        {
            pages: { onTheResourceRequestListReportPage: ResourceRequestListReport, onTheResourceRequestObjectPage: ResourceRequestObjectPage }
        },
        MainJourney.run,
        UxConsistency.run
    );
});
