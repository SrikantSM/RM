sap.ui.define(
	[
		"capacityGridUi/reuse/valuehelp/MultiInputWithValueHelp",
		"capacityGridUi/reuse/valuehelp/ValueHelpConfigCollection",
		"sap/ui/model/json/JSONModel",
		"capacityGridUi/test/unit/stubs/ControllerStub"
	],

	/*
	The reason why we have a qUnit for this control is as follows:
	The input value help is not specific for our capacity grid application. It is a generic implementation which is
	reusable. In such a case, the OPA5 tests might break when it is moved for ease of access.
	Though we are using multiple cascading timeout functions,
	we have implemented extensive tests for the different actions possible in the value help.
	 */

	function (MultiInputWithValueHelp, ValueHelpConfigCollection, JSONModel, ControllerStub) {
		"use strict";

		let oCollection = new ValueHelpConfigCollection();
		let oConfig = {
			modelName: "mymodel",
			entityPath: "/items",
			entityName: "myobject",
			idProperty: "id",
			textProperty: "desc",
			properties: [
				{ name: "id", label: "Identifier", filterable: true, searchable: true },
				{ name: "desc", label: "Description", filterable: true, searchable: true },
				{ name: "type", label: "Type", filterable: false, searchable: true },
				{ name: "country", label: "Country", filterable: true, searchable: false }
			]
		};
		oCollection.set("myValueHelp", oConfig);
		let iFilterCount = oConfig.properties.filter((property) => property.filterable).length;

		let oData = {
			items: [
				{
					id: "1",
					desc: "One",
					type: "a",
					country: "de"
				},
				{
					id: "2",
					desc: "Two",
					type: "a",
					country: "de"
				},
				{
					id: "3",
					desc: "Three",
					type: "a",
					country: "de"
				}
			]
		};
		let oModel = new JSONModel(oData);

		let sDialogId = "id1-VH--dialog";

		QUnit.module("MultiInputWithValueHelp", {
			beforeEach: function () {
				this.oInput = new MultiInputWithValueHelp("id1", {});
				this.oInput.getController = function () {
					return ControllerStub;
				};
				this.oInput.setModel(oModel, "mymodel");
				this.oInput.configure({
					config: oCollection.get("myValueHelp"),
					configCollection: oCollection
				});
			},
			afterEach: function () {
				this.oInput.destroy();
			}
		});

		QUnit.test("rendering", function (assert) {
			this.oInput.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			assert.equal(jQuery.sap.byId("id1").css("visibility"), "visible", "control is visible");
		});

		QUnit.test("suggestions", function (assert) {
			this.oInput.setValue("eee");
			let sSearchValue = this.oInput.getValue();
			this.oInput.fireSuggest();
			let aSuggestionColumns = this.oInput.getSuggestionColumns();
			let aSuggestionRows = this.oInput.getSuggestionRows();
			let aCellsFirstRow = aSuggestionRows[0].getCells();
			let oFirstCell = aCellsFirstRow[0];
			let oSecondCell = aCellsFirstRow[1];

			assert.equal(aSuggestionColumns.length, oConfig.properties.length, "suggestionColumns has config properties length");
			assert.equal(aSuggestionRows.length, oData.items.length, "suggestionRows has data items length 3");
			assert.equal(aCellsFirstRow.length, oConfig.properties.length, "cells of first row has config properties length");
			assert.equal(oFirstCell.getText(), oData.items[0].id, "first cell shows id");
			assert.equal(oSecondCell.getText(), oData.items[0].desc, "second cell shows desc");

			// clicking the "Show All Items" button
			this.oInput._getSuggestionsPopoverPopup().getFooter().getContent()[1].firePress();
			var done = assert.async();
			setTimeout(function () {
				// wait for dialog to open
				let oDialog = sap.ui.getCore().byId(sDialogId);
				let sSearchQuery = oDialog.getFilterBar().getBasicSearchValue();
				assert.equal(sSearchQuery, sSearchValue, "default value of basic search field updated from the input field search value");
				done();
			}, 1000);
		});

		QUnit.test("value help dialog", function (assert) {
			this.oInput.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			let oValueHelpIcon = this.oInput._getValueHelpIcon();
			oValueHelpIcon.firePress();

			// how to wait?
			// found this in UI5 tests but it did not work for me:
			// this.clock = sinon.useFakeTimers();

			var done = assert.async();
			setTimeout(function () {
				// wait for dialog to open

				let oDialog = sap.ui.getCore().byId(sDialogId);
				assert.equal(!!oDialog, true, "value help dialog created");

				assert.equal(jQuery.sap.byId(sDialogId).css("visibility"), "visible", "value help dialog visible");

				let sSearchControlId = oDialog.getFilterBar().getBasicSearch();
				assert.equal(!!sSearchControlId, true, "search control available");

				let aFilterItems = oDialog.getFilterBar().getFilterGroupItems();
				assert.equal(aFilterItems.length, iFilterCount, "correct number of filters");
				assert.equal(aFilterItems[0].getName(), "id", "id", "first filter: correct name");
				assert.equal(aFilterItems[0].getLabel(), "Identifier", "Identifier", "first filter: correct label");

				oDialog.getTableAsync().then(
					// wait for table to be available
					function (oTable) {
						setTimeout(function () {
							// wait for data binding to finish
							let aColumns = oTable.getColumns();
							let aRows = oTable.getRows();
							let aButtons = oDialog.getButtons();
							assert.equal(aColumns.length, oConfig.properties.length, "correct number of columns");
							assert.equal(aColumns[0].getLabel().getText(), "Identifier", "first column: correct label");
							assert.equal(aColumns.length, oConfig.properties.length, "correct number of columns");
							assert.equal(aRows.length >= 4, true, "data rows are loaded by data binding");
							assert.equal(aRows[2].getCells()[0].getText(), "3", "row 3 shows '3'");
							assert.equal(aRows[3].getCells()[0].getText(), "", "row 4 shows ''");
							// fire a search
							let oSearchControl = sap.ui.getCore().byId(sSearchControlId);
							oSearchControl.setValue("1").fireSearch();
							assert.equal(aRows.length >= 2, true, "Only 1st row is shown");

							// clicking the "Cancel" button
							aButtons[1].firePress();
							// check if the Dialog is actually closed.
							setTimeout(function () {
								assert.equal(oDialog.isOpen(), false, "the dialog has been closed");
								// reopening dialog to test "OK" button press
								oDialog.open();
								oSearchControl.setValue("").fireSearch();
								setTimeout(function () {
									assert.equal(aRows.length >= 4, true, "data rows are loaded by data binding");
									assert.equal(aRows[2].getCells()[0].getText(), "3", "row 3 shows '3'");
									assert.equal(aRows[3].getCells()[0].getText(), "", "row 4 shows ''");
									// clicking the OK button
									aButtons[0].firePress();
									setTimeout(function () {
										// check if the Dialog is actually closed.
										assert.equal(oDialog.isOpen(), false, "the dialog has been closed");
										done();
									}, 1000);
								}, 1000);
							}, 1000);
						}, 1500);
					}
				);
			}, 1000);
		});
	}
);
