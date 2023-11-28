sap.ui.define([
    'sap/ui/test/Opa5',
    'sap/fe/test/JourneyRunner',
    'myResourcesUi/test/integration/pages/ListReportPage',
    'myResourcesUi/test/integration/pages/MainObjectPage',
    'myResourcesUi/test/integration/pages/ExternalWrkExpOP',
    'myResourcesUi/test/integration/pages/InternalWrkExpOP',
    'myResourcesUi/test/integration/MyResourcesListPageJourney',
    'myResourcesUi/test/integration/BasicDataJourney',
    'myResourcesUi/test/integration/AvailabilityJourney',
    'myResourcesUi/test/integration/QualificationsJourney',
    'myResourcesUi/test/integration/QualificationsEditJourney',
    'myResourcesUi/test/integration/InternalWorkExperienceJourney',
    'myResourcesUi/test/integration/ExternalWorkExperienceEditJourney',
    'myResourcesUi/test/integration/PriorExperienceJourney',
    'myResourcesUi/test/integration/PriorExperienceEditJourney',
    'myResourcesUi/test/integration/AttachmentJourney',
    'myResourcesUi/test/unit/AllTests'
], function (Opa5, JourneyRunner, ListReportPage, MainObjectPage, ExternalWrkExpOP, InternalWrkExpOP,
    MyResourcesListPageJourney, BasicDataJourney, AvailabilityJourney, QualificationsJourney, QualificationsEditJourney, InternalWorkExperienceJourney, ExternalWorkExperienceEditJourney, PriorExperienceJourney, PriorExperienceEditJourney,
    AttachmentJourney
) {
    'use strict';

    var MyResourcesJourneyRunner = new JourneyRunner({
        // start index.html in web folder
        launchUrl: sap.ui.require.toUrl("myResourcesUi/app") + ".html", // MANDATORY: Compare resource root definitions in karma.base.conf.js
        launchParameters: {
            serverDelay: 0,
            responderOn: true,
            demoApp: "myResourcesUi",
            'sap-ui-language': "en_US"
        },
        opaConfig: {
            // if possible, read from karma config and convert back to seconds
            // eslint-disable-next-line no-undef
            timeout: (__karma__ && __karma__.config.opaTimeout && (__karma__.config.opaTimeout / 1000)) || 15
        },
        pages: {
            onTheListPage:ListReportPage, onTheObjectPage: MainObjectPage,
            onExternalWrkExpOP: ExternalWrkExpOP, onInternalWrkExpOP: InternalWrkExpOP
        }
    });
    MyResourcesJourneyRunner.run(
        MyResourcesListPageJourney.run,
        BasicDataJourney.run,
        AvailabilityJourney.run,
        QualificationsJourney.run,
        PriorExperienceJourney.run,
        QualificationsEditJourney.run,
        PriorExperienceEditJourney.run,
        ExternalWorkExperienceEditJourney.run,
        InternalWorkExperienceJourney.run,
        AttachmentJourney.run
    );
});
