sap.ui.define(
    [
        'sap/fe/test/JourneyRunner',
        'manageResourceRequest/test/integration/pages/ResourceRequestListReport',
        'manageResourceRequest/test/integration/pages/ResourceRequestObjectPage',
        'manageResourceRequest/test/integration/resourceRequest/ResourceRequestMainJourney-Query',
        'manageResourceRequest/test/integration/resourceRequest/ResourceRequestMainJourney-Read',
        'manageResourceRequest/test/integration/resourceRequest/ResourceRequestMainJourney-Create',
        'manageResourceRequest/test/integration/resourceRequest/ResourceRequestMainJourney-Update',
        'manageResourceRequest/test/integration/resourceRequest/ResourceRequestMainJourney-Delete',
        'manageResourceRequest/test/integration/resourceRequest/ResourceRequestListPageUxConsistencyTestJourney',
        'manageResourceRequest/test/integration/resourceRequest/ResourceRequestObjectPageUxConsistencyTestJourney',
        'manageResourceRequest/test/integration/resourceRequest/ResourceRequestMainJourney-AssignmentProposalJourney'
    ],
    function (JourneyRunner, ResourceRequestListReport, ResourceRequestObjectPage,
        MainQuery, MainRead, MainCreate, MainUpdate, MainDelete, ListPageUxConsistency, ObjectPageUxConsistency , AssignmentProposalJourney) {

        var RRJourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl("manageResourceRequest/app") + ".html", // MANDATORY: Compare resource root definitions in karma.base.conf.js
            launchParameters: {
                serverDelay: 0,
                responderOn: true,
                demoApp: "manageResourceRequest",
                'sap-ui-language': "en_US"
            }
        });

        RRJourneyRunner.run(
            {
                pages: { onTheResourceRequestListReportPage: ResourceRequestListReport, onTheResourceRequestObjectPage: ResourceRequestObjectPage }
            },
            MainQuery.run,
            MainRead.run,
            MainCreate.run,
            MainUpdate.run,
            MainDelete.run,
            ListPageUxConsistency.run,
            ObjectPageUxConsistency.run,
            AssignmentProposalJourney.run
        );
    }
);
