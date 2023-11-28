sap.ui.define([
  "sap/ui/test/Opa5",
  "sap/ui/test/actions/Press",
  "sap/ui/test/OpaBuilder"
], function (Opa5, Press, OpaBuilder) {
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
      iClickOnTheElementTypeWithProperty: function (sControlType, mProperties) {
        return OpaBuilder.create(this)
          .viewName(null) //the FE journeyrunner defines viewnamespace, popovers are not in this space, so overwrite this with null
          .viewId(null)
          .hasType(sControlType)
          .hasProperties(mProperties)
          .doPress()
          .execute();
      },
      /**
       * Click on a button of a dialog that has a given type
       * @param {*} sType Type of the button,e.g. "Default", "Emphasized"
       * @returns {*} Opa5.waitFor()
       */
      iClickTheDialogButton: function (sType) {
        return this.waitFor({
          viewName: null,
          viewId: null,
          controlType: "sap.m.Button",
          matchers: {
            ancestor: {
              controlType: "sap.m.Dialog"
            },
            properties: {
              type: sType
            }
          },
          actions: new Press(),
          errorMessage: "Can't see the dialog button of type " + sType
        });
      }
    },
    assertions: {
      iShouldSeeTheElementTypeWithProperty: function (sControlType, mProperties) {
        return OpaBuilder.create(this)
          .viewName(null) //the FE journeyrunner defines viewnamespace, popovers are not in this space, so overwrite this with null
          .viewId(null)
          .hasType(sControlType)
          .hasProperties(mProperties)
          .success("Seeing " + sControlType + " has " + mProperties)
          .execute();
      },
      /**
       * Checks whether a text contains the current time
       * @param {*} sPropertyPath propertyPath of the text to contain the text
       * @param {*} iSecondsDelta delta to check the time with
       * @returns {*} Opa5.waitFor()
       */
      iShouldSeeTheCurrentTimeInTheText: function (sPropertyPath, iSecondsDelta) {
        return this.waitFor({
          controlType: "sap.m.Text",
          bindingPath: {
            propertyPath: sPropertyPath
          },
          success: function (oTexts) {
            var oFieldTime = new Date(oTexts[0].getText()).getTime();
            var oNowTime = new Date().getTime();
            var bIsNow = Math.abs(oNowTime - oFieldTime) < iSecondsDelta * 1000;

            Opa5.assert.ok(bIsNow, "Time content is from now");
          },
          errorMessage: "Can't see text with property path " + sPropertyPath
        });
      },
      /**
       * Checks whether a text contains a given text
       * @param {*} sPropertyPath propertyPath of the text to contain the text
       * @param {*} sExpectedValue value that is expected
       * @returns {*} Opa5.waitFor()
       */
      iShouldSeeTheTextInTheText: function (sPropertyPath, sExpectedValue) {
        return this.waitFor({
          controlType: "sap.m.Text",
          bindingPath: {
            propertyPath: sPropertyPath
          },
          success: function (oTexts) {
            Opa5.assert.strictEqual(oTexts[0].getText(), sExpectedValue, "Control has the expected text");
          },
          errorMessage: "Can't see text with property path " + sPropertyPath
        });
      }
    }
  };
});
