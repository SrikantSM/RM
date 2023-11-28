sap.ui.define(["sap/fe/test/ObjectPage", "sap/ui/test/OpaBuilder"], function (ObjectPage, OpaBuilder) {
    "use strict";
    // OPTIONAL
    var AdditionalCustomObjectPageDefinition = {
        actions: {},
        assertions: {
            iShouldSeeTheElementTypeWithProperty: function (sControlType, mProperties) {
                return OpaBuilder.create(this)
                    .hasType(sControlType)
                    .hasProperties(mProperties)
                    .success("Seeing " + sControlType + " has " + mProperties)
                    .execute();
            }
        }
    };
    return new ObjectPage(
        {
            appId: "availabilityUploadUi", // MANDATORY: Compare sap.app.id in manifest.json
            componentId: "AvailabilityDataObjectPage", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
            entitySet: "AvailabilityUploadData" // MANDATORY: Compare entityset in manifest.json
        },
        AdditionalCustomObjectPageDefinition
    );
});
