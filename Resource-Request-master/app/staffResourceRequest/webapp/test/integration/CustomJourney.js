sap.ui.define([
    'sap/ui/test/Opa5',
    'staffResourceRequest/test/integration/pages/Common',
    'staffResourceRequest/test/integration/pages/RRObjectPage',
    'staffResourceRequest/test/integration/pages/CompareResourcesPage',
    'staffResourceRequest/test/integration/ProcessRequestDayWiseEffortDistributionJourney',
    'staffResourceRequest/test/integration/ProcessRequestWeeklyWiseEffortDistributionJourney',
    'staffResourceRequest/test/integration/ProcessRequestContactCardJourney',
    'staffResourceRequest/test/integration/ProcessRequestCompareResourcesTestJourney',
    'staffResourceRequest/test/integration/ProcessRequestSkillCompareResourcesTestJourney',
    'staffResourceRequest/test/integration/ProcessRequestAvailabilityCompareResourcesTestJourney'
], function (Opa5, Common) {


    Opa5.extendConfig({
        arrangements: new Common(),
        viewNamespace: 'staffResourceRequest.view',
        autoWait: true,
        timeout: 60,
        testLibs: {
            fioriElementsTestLibrary: {
                Common: {
                    appId: 'staffResourceRequest',
                    entitySet: 'ResourceRequest'
                }
            }
        }
    });
});
