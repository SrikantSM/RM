sap.ui.define([
  "sap/ui/base/ManagedObject",
  "skill-proficiency/controller/ProficiencyLevelsTable.controller",
  "sap/ui/thirdparty/sinon"
], function (ManagedObject, ProficiencyLevelsTabelController, sinon) {
  "use strict";

  QUnit.module("Test ProficiencyLevelsTable", {
    beforeEach: function () {
      this.oProficiencyLevelsTabelController = new ProficiencyLevelsTabelController();
      this.oViewStub = new ManagedObject({});
    }
  });

  QUnit.test("Should handle on update finished correctly", function (assert) {
    var onSelectionChangeStub = sinon.stub(this.oProficiencyLevelsTabelController, "onSelectionChange");
    var setCreateButtonEnabledStub = sinon.stub(this.oProficiencyLevelsTabelController, "setCreateButtonEnabled");

    this.oProficiencyLevelsTabelController.onUpdateFinished(null);

    assert.ok(onSelectionChangeStub.calledOnce, "onSelectionChanged called");
    assert.ok(setCreateButtonEnabledStub.calledOnce, "setCreateButtonEnabled called");
    onSelectionChangeStub.restore();
    setCreateButtonEnabledStub.restore();
  });

  QUnit.test("Should disable create button when the maximum level count is reached", function (assert) {
    var MAX_LEVEL_COUNT = 50;
    var oMockEvent = {
      getParameter: sinon.stub()
    };
    oMockEvent.getParameter.withArgs("actual").returns(MAX_LEVEL_COUNT);

    var setEnabledStub = sinon.stub();
    var oViewStub = {
      byId: sinon.spy(function () {
        return {
          setEnabled: setEnabledStub
        };
      })
    };

    sinon.stub(this.oProficiencyLevelsTabelController, "getView").returns(oViewStub);

    this.oProficiencyLevelsTabelController.setCreateButtonEnabled(oMockEvent);
    assert.ok(setEnabledStub.calledOnce, "setEnabled called");
    assert.strictEqual(setEnabledStub.firstCall.args[0], false, "The right result is displayed to the user");
  });

  QUnit.test("Should enable create button when the maximum level count is not reached", function (assert) {
    var MAX_LEVEL_COUNT = 50;
    var oMockEvent = {
      getParameter: sinon.stub()
    };
    oMockEvent.getParameter.withArgs("actual").returns(MAX_LEVEL_COUNT - 10);

    var setEnabledStub = sinon.stub();
    var oViewStub = {
      byId: sinon.spy(function () {
        return {
          setEnabled: setEnabledStub
        };
      })
    };

    sinon.stub(this.oProficiencyLevelsTabelController, "getView").returns(oViewStub);

    this.oProficiencyLevelsTabelController.setCreateButtonEnabled(oMockEvent);
    assert.ok(setEnabledStub.calledOnce, "setEnabled called");
    assert.strictEqual(setEnabledStub.firstCall.args[0], true, "The right result is displayed to the user");
  });

  QUnit.test("Move rank four under rank three", function (assert) {

    var aContexts = elementList();

    this.oProficiencyLevelsTabelController.reorderContexts(aContexts.slice(), "4", "3", "After");

    assert.equal(aContexts[0].getProperty("rank"), 3);
    assert.equal(aContexts[1].getProperty("rank"), 4);
    assert.equal(aContexts[2].getProperty("rank"), 2);
    assert.equal(aContexts[3].getProperty("rank"), 1);
    assert.ok(aContexts[2].setProperty.notCalled);
    assert.ok(aContexts[3].setProperty.notCalled);
  });

  QUnit.test("Move rank one over rank two", function (assert) {
    var aContexts = elementList();

    this.oProficiencyLevelsTabelController.reorderContexts(aContexts.slice(), "1", "2", "Before");

    assert.equal(aContexts[0].getProperty("rank"), 4);
    assert.equal(aContexts[1].getProperty("rank"), 3);
    assert.equal(aContexts[2].getProperty("rank"), 1);
    assert.equal(aContexts[3].getProperty("rank"), 2);
    assert.ok(aContexts[0].setProperty.notCalled);
    assert.ok(aContexts[1].setProperty.notCalled);
  });

  QUnit.test("Move rank one under rank one", function (assert) {

    var aContexts = elementList();

    this.oProficiencyLevelsTabelController.reorderContexts(aContexts.slice(), "1", "1", "After");

    assert.ok(aContexts[0].setProperty.notCalled);
    assert.ok(aContexts[1].setProperty.notCalled);
    assert.ok(aContexts[2].setProperty.notCalled);
    assert.ok(aContexts[3].setProperty.notCalled);
  });

  QUnit.test("Move rank one over rank four", function (assert) {

    var aContexts = elementList();

    this.oProficiencyLevelsTabelController.reorderContexts(aContexts.slice(), "1", "4", "Before");

    assert.equal(aContexts[0].getProperty("rank"), 3);
    assert.equal(aContexts[1].getProperty("rank"), 2);
    assert.equal(aContexts[2].getProperty("rank"), 1);
    assert.equal(aContexts[3].getProperty("rank"), 4);

    assert.ok(aContexts[0].setProperty.calledOnce);
    assert.ok(aContexts[1].setProperty.calledOnce);
    assert.ok(aContexts[2].setProperty.calledOnce);
    assert.ok(aContexts[3].setProperty.calledOnce);
  });

  QUnit.test("Move rank four over rank one", function (assert) {

    var aContexts = elementList();

    this.oProficiencyLevelsTabelController.reorderContexts(aContexts.slice(), "4", "1", "After");

    assert.equal(aContexts[0].getProperty("rank"), 1);
    assert.equal(aContexts[1].getProperty("rank"), 4);
    assert.equal(aContexts[2].getProperty("rank"), 3);
    assert.equal(aContexts[3].getProperty("rank"), 2);

    assert.ok(aContexts[0].setProperty.calledOnce);
    assert.ok(aContexts[1].setProperty.calledOnce);
    assert.ok(aContexts[2].setProperty.calledOnce);
    assert.ok(aContexts[3].setProperty.calledOnce);
  });

  function elementList() {
    return [
      stubContext(4),
      stubContext(3),
      stubContext(2),
      stubContext(1)
    ];
  }

  var Mock = ManagedObject.extend("Mock", {
    metadata : {
      properties : {
        ID: "string",
        rank: "int"
      }
    }
  });

  function stubContext(iId) {

    var mockObject = new Mock();
    mockObject.setProperty("ID", String(iId));
    mockObject.setProperty("rank", iId);

    sinon.spy(mockObject, "setProperty");

    return mockObject;
  }
});
