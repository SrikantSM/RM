sap.ui.define([
  "sap/fe/test/ObjectPage",
  "sap/ui/test/Opa5",
  "sap/ui/test/actions/Press",
  "sap/ui/test/actions/EnterText",
  "sap/ui/test/actions/Drag",
  "sap/ui/test/actions/Drop",
  "skill-proficiency/test/integration/pages/Common",
  "sap/ui/test/matchers/Properties"
],
function (ObjectPage, Opa5, Press, EnterText, Drag, Drop, Common, Properties) {
  "use strict";

  var PREFIX_ID = "skill-proficiency::ProficiencySetsDetails--";

  // OPTIONAL
  var AdditionalCustomObjectPageDefinition = {
    actions: {
      /**
       * Type text into an element identified by id sId, e.g. the description of a catalog
       * @param {*} sId Id of the element
       * @param {*} sText Text to be entered
       * @returns {*} Opa5.waitFor()
       */
      iTypeTextIntoTheElement: function (sId, sText) {
        return this.waitFor({
          id: PREFIX_ID + sId,
          actions: new EnterText({ text: sText }),
          errorMessage: "Can't see " + PREFIX_ID + sId
        });
      },
      iTypeTextIntoProficiencyLevelCreateDialog: function (sId, sText) {
        return this.waitFor({
          id: sId,
          searchOpenDialogs: true,
          actions: new EnterText({ text: sText }),
          errorMessage: "Can't see " + sId
        });
      },
      /**
       * Click on an element identified by id sId, e.g. a button sap.m.Button
       * @param {*} sId Id of the element
       * @returns {*} Opa5.waitFor()
       */
      iClickOnTheElement: function (sId) {
        return this.waitFor({
          id: PREFIX_ID + sId,
          actions: new Press(),
          errorMessage: "Can't see " + PREFIX_ID + sId
        });
      },
      /**
       * Select the nth row of a table by clicking the corresponding checkbox/radio button
       * @param {*} sInnerTableId Inner table id of the table
       * @param {*} iRow Row number of the table
       * @returns {*} Opa5.waitFor()
       */
      iSelectRowInCustomSection: function (sInnerTableId, iRow) {
        return this.waitFor({
          id: PREFIX_ID + sInnerTableId,
          actions: function (oTable) {
            var sTargetId = oTable.getItems()[iRow].getModeControl().getId();
            return this.waitFor({
              matchers: {
                properties:{
                  id: sTargetId
                }
              },
              actions: new Press(),
              errorMessage: "Can't see property " + sTargetId
            });
          }.bind(this),
          errorMessage: "Can't see " + PREFIX_ID + sInnerTableId
        });
      },
      /**
       * Starts dragging a row inside the specified table
       * @param {*} sInnerTableId Inner table id of the table
       * @param {*} iRow Row number to be dragged
       * @returns {*} Opa5.waitFor()
       */
      iDragColumnListItem: function (sInnerTableId, iRow) {
        return this.waitFor({
          id: PREFIX_ID + sInnerTableId,
          actions: function (oTable) {
            var sTargetId = oTable.getItems()[iRow].getId();
            return this.waitFor({
              matchers: {
                properties:{
                  id: sTargetId
                }
              },
              actions: new Drag(),
              errorMessage: "Can't see property " + sTargetId
            });
          }.bind(this),
          errorMessage: "Can't see " + PREFIX_ID + sInnerTableId
        });
      },
      /**
       * Drops the currently dragged row AFTER the specified row
       * @param {*} sInnerTableId Inner table id of the table
       * @param {*} iRow Row index to drop the currently dragged row on
       * @returns {*} Opa5.waitFor()
       */
      iDropAfterColumnListItem: function (sInnerTableId, iRow) {
        return this.waitFor({
          id: PREFIX_ID + sInnerTableId,
          actions: function (oTable) {
            var sTargetId = oTable.getItems()[iRow].getId();
            return this.waitFor({
              matchers: {
                properties:{
                  id: sTargetId
                }
              },
              actions: new Drop({
                after: true
              }),
              errorMessage: "Can't see property " + sTargetId
            });
          }.bind(this),
          errorMessage: "Can't see " + PREFIX_ID + sInnerTableId
        });
      },
      /**
       * Drops the currently dragged row BEFORE the specified row
       * @param {*} sInnerTableId Inner table id of the table
       * @param {*} iRow Row index to drop the currently dragged row on
       * @returns {*} Opa5.waitFor()
       */
      iDropBeforeColumnListItem: function (sInnerTableId, iRow) {
        return this.waitFor({
          id: PREFIX_ID + sInnerTableId,
          actions: function (oTable) {
            var sTargetId = oTable.getItems()[iRow].getId();
            return this.waitFor({
              matchers: {
                properties:{
                  id: sTargetId
                }
              },
              actions: new Drop({
                before: true
              }),
              errorMessage: "Can't see property " + sTargetId
            });
          }.bind(this),
          errorMessage: "Can't see " + PREFIX_ID + sInnerTableId
        });
      },
      /**
       * Click a row in a table of a custom section
       * @param {*} sInnerTableId Inner table id of the table
       * @param {*} iRow Row index to be clicked on
       * @returns {*} Opa5.waitFor()
       */
      iPressRowInCustomSection: function (sInnerTableId, iRow) {
        return this.waitFor({
          id: PREFIX_ID + sInnerTableId,
          actions: function (oTable) {
            var sTargetId = oTable.getItems()[iRow].getId();
            return this.waitFor({
              //id: sTargetId,
              matchers: {
                properties:{
                  id: sTargetId
                }
              },
              actions: new Press(),
              errorMessage: "Can't see property " + sTargetId
            });
          }.bind(this),
          errorMessage: "Can't see " + PREFIX_ID + sInnerTableId
        });
      }
    },
    assertions: {
      /**
       * See an element identified id sId
       * @param {*} sId Id of the element
       * @returns {*} Opa5.waitFor()
       */
      iShouldSeeTheElement: function (sId) {
        return this.waitFor({
          id: PREFIX_ID + sId,
          success: function () {
            Opa5.assert.ok(true, "Seen");
          },
          errorMessage: "Can't see " + PREFIX_ID + sId
        });
      },
      /**
       * Checks whether a text contains the current time
       * @param {*} sId id of control
       * @param {*} mProperties Set of key value pairs to identify a certain element, e.g. sap.m.Button with properties text: 'Create'
       * @returns {*} Opa5.waitFor()
       */
      iShouldSeeTheElementTypeWithIdAndProperty: function (sId, mProperties) {
        return this.waitFor({
          id: sId,
          matchers: new Properties(mProperties),
          searchOpenDialogs: true,
          success: function () {
            Opa5.assert.ok(true, "Seen");
          }
        });
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
      },

      /**
       * Check the visibility of a field of state Error
       * @param {*} sID id of the field
       * @returns {*} Opa5.waitFor()
       */
      iShouldSeeAFieldWithError: function (sID) {
        return this.iShouldSeeTheElement(sID, { state: "Error" });
      },
      /**
       * Checks the row count of a table
       * @param {*} sTableId Inner table id of the table
       * @param {*} iCount expected row count
       * @returns {*} Opa5.waitFor()
       */
      iCheckRowCount: function (sTableId, iCount) {
        return this.waitFor({
          controlType: "sap.m.Table",
          id: PREFIX_ID + sTableId,
          success: function (oTable) {
            Opa5.assert.strictEqual(oTable.getItems().length, iCount, sTableId + " has " + iCount + " rows" );
          },
          errorMessage: "Table has more or less than " + iCount + " rows"
        });
      },
      /**
       * Checks a rows content of a table in a custom section
       * @param {*} sTableId Inner table id of the table
       * @param {*} iRowIndex Row index to be checked
       * @param {*} oContent expected content in form of a map
       * @returns {*} Opa5.waitFor()
       */
      iCheckRowContent: function (sTableId, iRowIndex, oContent) {
        return this.waitFor({
          controlType: "sap.m.Table",
          id: PREFIX_ID + sTableId,
          success: function (oTable) {
            var mColumnNameToIndex = this._getColumnNameToIndexMap(oTable);

            var mColumnIndexToValue = this._getColumnIndexToValueMap(mColumnNameToIndex, oContent);

            var oItems = oTable.getItems();
            var aCells = oItems[iRowIndex].getCells();

            Object.keys(mColumnIndexToValue).forEach(function (index) {
              Opa5.assert.strictEqual(this._getTextFromCell(aCells[index]), mColumnIndexToValue[index]);
            }.bind(this));
          },
          errorMessage: "Row not found"
        });
      },
      _getColumnIndexToValueMap: function (mColumnNameToIndex, oContent){
        return Object.keys(oContent).map(function (columnName) {
          if (typeof mColumnNameToIndex[columnName] != "undefined"){
            var index = mColumnNameToIndex[columnName];
            return [index, oContent[columnName]];
          } else {
            return Opa5.assert.ok(false, "Column name " + columnName + " not found. Unable to check column content");
          }
        }).reduce(function (map, currentValue) { map[currentValue[0]] = currentValue[1]; return map; }, {});
      },
      _getColumnNameToIndexMap: function (oTable){
        return oTable.getColumns().map(function (oColumn, index){
          return [oColumn.getAggregation("header").getText(), index];
        }).reduce(function (oMap, aColumnIndexPair) {
          oMap[aColumnIndexPair[0]] = aColumnIndexPair[1];
          return oMap;
        }, {});
      },
      _getTextFromCell: function (oCell) {
        var cellType = oCell.getMetadata().getName();
        if (cellType == "sap.m.ObjectIdentifier") {
          return oCell.getTitle();
        }
        return oCell.getText();
      }
    }
  };

  AdditionalCustomObjectPageDefinition.actions = Object.assign({}, Common.actions, AdditionalCustomObjectPageDefinition.actions);
  AdditionalCustomObjectPageDefinition.assertions = Object.assign({}, Common.assertions, AdditionalCustomObjectPageDefinition.assertions);

  return new ObjectPage(
    {
      appId: "skill-proficiency", // MANDATORY: Compare sap.app.id in manifest.json
      componentId: "ProficiencySetsDetails", // MANDATORY: Compare sap.ui5.routing.targets.id in manifest.json
      entitySet: "ProficiencySets" // MANDATORY: Compare entityset in manifest.json
    },
    AdditionalCustomObjectPageDefinition
  );
});
