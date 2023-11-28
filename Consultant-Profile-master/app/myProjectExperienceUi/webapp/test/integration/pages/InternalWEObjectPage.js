sap.ui.define(["sap/fe/test/ObjectPage", "sap/ui/test/OpaBuilder",
    "sap/ui/test/Opa5", 'sap/ui/test/matchers/Properties',
    'sap/ui/test/actions/Press'], function (InternalWEObjectPage, OpaBuilder, Opa5, Properties, Press ) {
    "use strict";

    var PREFIX_ID = 'myProjectExperienceUi::InternalWorkExperienceObjectPage--';
    var AdditionalCustomObjectPageDefinition = {
        actions: {
        },
        assertions: {
            iShouldSeeTheElementTypeWithProperty: function (sControlType, mProperties) {
                return OpaBuilder.create(this)
                    .hasType(sControlType)
                    .hasProperties(mProperties)
                    .success("Seeing " + sControlType + " has " + mProperties)
                    .execute();
            },
            iShouldSeeTheTable: function (aSubSection) {
                var sId = "fe::table::internalWorkExperienceSkills::LineItem-innerTable";
                return this.waitFor({
                    id: PREFIX_ID + sId,
                    timeout: 70,
                    success: function (oTable) {
                        var oSubSection = oTable.getHeaderToolbar().getTitleControl().getText();
                        Opa5.assert.ok(true, 'List of ' + aSubSection + ' seen\n');
                        if (oSubSection === aSubSection) {
                            Opa5.assert.ok(true, aSubSection + " subsection table heading displayed on the object page is same as the actual heading");
                        } else {
                            Opa5.assert.ok(false, aSubSection + " subsection table heading displayed on the object page is not same as the actual heading");
                        }
                    },
                    errorMessage: 'Can\'t see ' + PREFIX_ID + sId
                });
            },
            iShouldSeeCorrectLabelsInGeneralInfoSection: function (aLabels) {
                return this.waitFor({
                    id: "myProjectExperienceUi::InternalWorkExperienceObjectPage--fe::FormContainer::FieldGroup::GeneralInformation",
                    success: function (oForm) {
                        var aLabelsFound = oForm.getFormElements();
                        if (aLabelsFound.length === aLabels.length) {
                            for (var i = 0; i < aLabels.length; i++) {
                                if (aLabelsFound[i].getLabel() === aLabels[i]) {
                                    Opa5.assert.ok(true, "Label found is same as actual label");
                                } else {
                                    Opa5.assert.ok(false, "Label found " + aLabelsFound[i].getLabel() + " is not same as actual label " + aLabels[i]);
                                }
                            }
                        } else {
                            Opa5.assert(false, "Number of labels found is not same as actual number");
                        }
                    },
                    errorMessage: "General Info section form container not found"
                });
            }
        }
    };
    return new InternalWEObjectPage(
        {
            appId: "myProjectExperienceUi", // MANDATORY: Compare sap.app.id in manifest.json
            componentId: "InternalWorkExperienceObjectPage", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
            entitySet: "InternalWorkExperience" // MANDATORY: Compare entityset in manifest.json
        },
        AdditionalCustomObjectPageDefinition
    );
});
