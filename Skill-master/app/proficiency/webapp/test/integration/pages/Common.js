sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/actions/Press",
  "sap/ui/test/matchers/Properties",
  "sap/ui/test/launchers/iFrameLauncher"
], function (Opa5, Press, Properties, iFrameLauncher) {
  "use strict";

  return {
    actions: {
      /**
       * Click on an element of type sControlType, e.g. sap.m.Button which has certain properties, e.g. text: 'Create'
       * @param {string} sControlType Name of the control type you want to match, e.g. 'sap.m.Button'
       * @param {*} mProperties Set of key value pairs to identify a certain element, e.g. sap.m.Button with properties text: 'Create'
       * @param {string?} sAncestorControlType Optional controlType of the ancestor element
       * @returns {*} Opa5.waitFor()
       */
      iClickOnTheElementTypeWithProperty: function (sControlType, mProperties, sAncestorControlType) {
        var locator = {
          controlType: sControlType,
          matchers: { properties: mProperties },
          actions: new Press(),
          errorMessage: "Can't see properties " + JSON.stringify(mProperties)
        };
        if (sAncestorControlType) {
          locator.ancestor = {
            controlType: sAncestorControlType
          };
          locator.errorMessage += " with ancestor control type " + sAncestorControlType;
        }
        return this.waitFor(locator);
      }
    },

    assertions: {
      /**
       * See an element of type sControlType, e.g. sap.m.Button which has certain properties, e.g. text: 'Create'
       * @param {string} sControlType Name of the control type you want to match, e.g. 'sap.m.Button'
       * @param {*} mProperties Set of key value pairs to identify a certain element, e.g. sap.m.Button with properties text: 'Create'
       * @param {boolean} bSearchDisabled Flag, whether to search for disabled controls as well (defaults to false)
       * @returns {*} Opa5.waitFor()
       */
      iShouldSeeTheElementTypeWithProperty: function (sControlType, mProperties, bSearchDisabled) {
        return this.waitFor({
          controlType: sControlType,
          matchers: new Properties(mProperties),
          enabled: !bSearchDisabled,
          success: function () {
            Opa5.assert.ok(true, "Seen");
          }
        });
      },
      /**
     * Should NOT see an element of type sControlType, e.g. sap.m.Button which has certain properties, e.g. text: 'Create'
     * @param {string} sControlType Name of the control type you want to match, e.g. 'sap.m.Button'
     * @param {*} mProperties Set of key value pairs to identify a certain element, e.g. sap.m.Button with properties text: 'Create'
     * @returns {*} Opa5.waitFor()
     */
      iShouldNotSeeTheElementTypeWithProperty: function (sControlType, mProperties) {
        return this.waitFor({
          controlType: sControlType,
          matchers: { properties: mProperties },
          visible: false,
          success: function (aControls) {
            aControls.forEach(function (oControl) {
              Opa5.assert.ok(!oControl.getVisible(), "Control of type " + oControl.getMetadata().getName() + " with id " + oControl.getId() + " is not visible");
            });
          }
        });
      }
    }
  };
});
