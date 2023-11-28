sap.ui.define([
  "skill/ext/controller/ListReportExtension.controller",
  "sap/base/Log",
  "sap/ui/thirdparty/sinon"
], function (ListReportExtension, Log, sinon) {
  "use strict";

  QUnit.module("Test List Report Controller Extension", {
    beforeEach: function () {
      this.oControllerExtension = new ListReportExtension();
      this.oControllerExtension.oLogger = Log;

      this.refreshStub = sinon.stub();

      this.oControllerExtension.base = { getExtensionAPI: sinon.stub().returns({
        refresh: this.refreshStub
      }) };


      this.oControllerExtension.oAssignCatalogsModel = {
        getProperty: sinon.stub(),
        setProperty: sinon.stub()
      };
    },
    afterEach: function () {
    }
  });

  QUnit.test("Test List Report is refreshed when assignment changed and navigating back", function (assert) {

    var oEventStub = {
      getParameter: sinon.stub().returns("SkillsList")
    };
    this.oControllerExtension.oAssignCatalogsModel.getProperty = sinon.stub().withArgs("/hasChanged").returns(true);

    this.oControllerExtension.onRoutePatternChanged(oEventStub);
    assert.ok(this.refreshStub.calledOnce, "ExtensionAPI should be called for a refresh");
  });

  QUnit.test("Test List Report is not refreshed when assignment changed but not navigating back", function (assert) {

    var oEventStub = {
      getParameter: sinon.stub().returns("SkillsDetails")
    };
    this.oControllerExtension.oAssignCatalogsModel.getProperty = sinon.stub().withArgs("/hasChanged").returns(true);

    this.oControllerExtension.onRoutePatternChanged(oEventStub);
    assert.notOk(this.refreshStub.calledOnce, "ExtensionAPI should not be called for a refresh");
  });

  QUnit.test("Test List Report is not refreshed when navigating back but assignment did not change", function (assert) {
    var oEventStub = {
      getParameter: sinon.stub().returns("SkillsList")
    };
    this.oControllerExtension.oAssignCatalogsModel.getProperty = sinon.stub().withArgs("/hasChanged").returns(false);

    this.oControllerExtension.onRoutePatternChanged(oEventStub);
    assert.notOk(this.refreshStub.calledOnce, "ExtensionAPI should not be called for a refresh");
  });

  QUnit.test("Test List Report is not refreshed when navigating elsewhere and assignment did not change", function (assert) {
    var oEventStub = {
      getParameter: sinon.stub().returns("CatalogsDetails")
    };
    this.oControllerExtension.oAssignCatalogsModel.getProperty = sinon.stub().withArgs("/hasChanged").returns(false);

    this.oControllerExtension.onRoutePatternChanged(oEventStub);
    assert.notOk(this.refreshStub.calledOnce, "ExtensionAPI should not be called for a refresh");
  });


});
