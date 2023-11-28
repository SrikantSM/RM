sap.ui.define([
    'sap/fe/test/JourneyRunner',
    'myProjectExperienceUi/test/integration/pages/MainObjectPage',
    'myProjectExperienceUi/test/integration/pages/ExternalWEObjectPage',
    'myProjectExperienceUi/test/integration/pages/InternalWEObjectPage',
    'myProjectExperienceUi/test/integration/BasicDataJourney',
    'myProjectExperienceUi/test/integration/AvailabilityJourney',
    'myProjectExperienceUi/test/integration/QualificationsJourney',
    'myProjectExperienceUi/test/integration/PriorExperienceJourney',
    'myProjectExperienceUi/test/integration/QualificationsEditJourney',
    'myProjectExperienceUi/test/integration/PriorExperienceEditJourney',
    'myProjectExperienceUi/test/integration/ExternalWorkExperienceEditJourney',
    'myProjectExperienceUi/test/integration/InternalWorkExperienceJourney',
    'myProjectExperienceUi/test/integration/ProfilePhotoEditJourney',
    'myProjectExperienceUi/test/integration/AttachmentJourney',
    'myProjectExperienceUi/test/integration/AttachmentEditJourney'
], function (JourneyRunner, MainObjectPage, ExternalWEObjectPage, InternalWEObjectPage,
    BasicDataJourney, AvailabilityJourney, QualificationsJourney, PriorExperienceJourney, QualificationsEditJourney, PriorExperienceEditJourney, ExternalWorkExperienceEditJourney, InternalWorkExperienceJourney, ProfilePhotoEditJourney,
    AttachmentJourney, AttachmentEditJourney
) {
    'use strict';

    var MPEJourneyRunner = new JourneyRunner({
        // start index.html in web folder
        launchUrl: sap.ui.require.toUrl("myProjectExperienceUi/app") + ".html", // MANDATORY: Compare resource root definitions in karma.base.conf.js
        launchParameters: {
            serverDelay: 0,
            responderOn: true,
            demoApp: "myProjectExperienceUi",
            "sap-ui-language": sap.ui.getCore().getConfiguration().getLanguage()
        },
        opaConfig: {
            // if possible, read from karma config and convert back to seconds
            // eslint-disable-next-line no-undef
            timeout: (__karma__ && __karma__.config.opaTimeout && (__karma__.config.opaTimeout / 1000)) || 15
        },
        pages: {
            onTheObjectPage: MainObjectPage, onExternalWrkExpOP: ExternalWEObjectPage,
            onInternalWrkExpOP: InternalWEObjectPage
        }
    });
    MPEJourneyRunner.run(
        BasicDataJourney.run,
        AvailabilityJourney.run,
        QualificationsJourney.run,
        PriorExperienceJourney.run,
        QualificationsEditJourney.run,
        PriorExperienceEditJourney.run,
        ExternalWorkExperienceEditJourney.run,
        ProfilePhotoEditJourney.run,
        AttachmentJourney.run,
        AttachmentEditJourney.run,
        InternalWorkExperienceJourney.run
    );
});
