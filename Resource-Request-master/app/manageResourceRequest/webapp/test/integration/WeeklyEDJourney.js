sap.ui.define(
    [
        'sap/ui/test/Opa5',
        'manageResourceRequest/test/integration/pages/Common',
        'manageResourceRequest/test/integration/pages/RRObjectPage',
        'manageResourceRequest/test/integration/weeklyEffortDistribution/WeeklyED-Journey-Aggregate',
        'manageResourceRequest/test/integration/weeklyEffortDistribution/WeeklyED-Journey-Create',
        'manageResourceRequest/test/integration/weeklyEffortDistribution/WeeklyED-Journey-Update',
        'manageResourceRequest/test/integration/weeklyEffortDistribution/WeeklyED-Journey-Delete',
        'manageResourceRequest/test/integration/weeklyEffortDistribution/WeeklyED-Journey-CalendarConsistency'
    ],
    function (Opa5, Common) {

        Opa5.extendConfig({
            arrangements: new Common(),
            viewNamespace: 'manageResourceRequest.view',
            autoWait: true,
            timeout: 60,
            testLibs: {
                fioriElementsTestLibrary: {
                    Common: {
                        appId: 'manageResourceRequest',
                        entitySet: 'ResourceRequest'
                    }
                }
            }
        });
    }
);
