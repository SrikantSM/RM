sap.ui.define([
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox",
  "sap/ui/thirdparty/sinon",
  "skill/custom/CustomActions"
], function (Filter, FilterOperator, MessageBox, sinon, cut) {
  "use strict";

  var SOME_ID = "SOME_ID";
  var ASSIGNMENT_DIALOG = "ASSIGNMENT_DIALOG";

  var oMockExtensionApi;
  var oMockBinding;
  var oMockDialog;
  var oMockI18nResourceBundle;
  var oMockEvent;
  var oMockBindingContext;
  var oMockModel;
  var oMockAssignCatalogsModel;
  var fnGetModelStub;
  var oMockActionContext;
  var aMockCatalogIds;

  QUnit.module("CustomActions", {
    beforeEach: function () {

      oMockI18nResourceBundle = {
        getText : sinon.stub()
      };

      oMockBindingContext = sinon.stub();

      oMockModel = {
        getResourceBundle: function () {
          return oMockI18nResourceBundle;
        },
        bindContext: function () {
          return oMockActionContext;
        }
      };

      oMockAssignCatalogsModel = {
        setProperty: sinon.stub()
      };

      fnGetModelStub = sinon.stub();
      fnGetModelStub.withArgs("catalogAssignment").returns(oMockAssignCatalogsModel);
      fnGetModelStub.withArgs().returns(oMockModel);

      oMockActionContext = {
        setParameter: sinon.stub(),
        execute: sinon.stub()
      };

      oMockActionContext.execute.returns(Promise.resolve());

      oMockEvent = {
        getParameter: function () {
          return {
            map: function () {
              return aMockCatalogIds;
            }
          };
        },
        getSource: function () {
          return {
            getBindingContext: function () {
              return oMockBindingContext;
            },
            getModel: fnGetModelStub,
            data: function () {
              return "SkillService.assignCatalogs(...)";
            }
          };
        }
      };

      oMockBinding = {
        filter: sinon.stub(),
        changeParameters: sinon.stub()
      };

      oMockDialog = {
        getBindingContext: function () {
          return {
            getProperty: sinon.stub().withArgs("ID").returns(SOME_ID)
          };
        },
        getBinding: sinon.stub(),
        open: sinon.stub(),
        getModel: fnGetModelStub,
        setModel: sinon.stub()
      };

      oMockDialog.getBinding.returns(oMockBinding);

      oMockExtensionApi = {
        editFlow: {
          securedExecution: function (cb) {
            cb();
          }
        },
        refresh: sinon.stub(),
        loadFragment: sinon.stub()
      };
      oMockExtensionApi.refresh.returns(Promise.resolve());
      oMockExtensionApi.loadFragment.returns(Promise.resolve(ASSIGNMENT_DIALOG));
    }
  });

  QUnit.test("Should create a correct assignment dialog", function (assert) {
    cut._getCatalogsAssignmentDialog(oMockExtensionApi).then(function (assignmentDialog) {

      assert.ok(oMockExtensionApi.loadFragment.calledOnce, "The fragment was loaded");
      assert.deepEqual(oMockExtensionApi.loadFragment.firstCall.args[0], {
        id: "skill::SkillsObjectPage",
        name: "skill.view.CatalogsAssignmentDialog",
        controller: cut
      });
      assert.strictEqual(assignmentDialog, ASSIGNMENT_DIALOG, "The returned dialog is the correct one");
    });
  });

  QUnit.test("Should reuse an existing assignment dialog", function (assert) {
    oMockExtensionApi.pDialogPromise = Promise.resolve(oMockDialog);
    cut._getCatalogsAssignmentDialog(oMockExtensionApi).then(function (oMockDialog) {

      assert.ok(oMockExtensionApi.loadFragment.notCalled, "The fragment was not loaded");
    });
  });

  QUnit.test("Should open assign dialog correctly", function (assert) {
    oMockExtensionApi.pDialogPromise = Promise.resolve(oMockDialog);
    cut._openDialog(oMockExtensionApi, true);
    Promise.resolve().then(function () {
      assert.deepEqual(oMockBinding.filter.firstCall.args[0], new Filter({
        path: "skillAssociations",
        operator: FilterOperator.All,
        variable: "c2s",
        condition: new Filter("c2s/skill_ID", FilterOperator.NE, SOME_ID)
      }));

      assert.ok(oMockDialog.open.calledOnce);
      assert.deepEqual(oMockBinding.changeParameters.firstCall.args[0],{ "$search":undefined });
    });
  });

  QUnit.test("Should open unassign dialog correctly", function (assert) {
    oMockExtensionApi.pDialogPromise = Promise.resolve(oMockDialog);
    cut._openDialog(oMockExtensionApi, false);
    Promise.resolve().then(function () {
      assert.deepEqual(oMockBinding.filter.firstCall.args[0], new Filter({
        path: "skillAssociations",
        operator: FilterOperator.Any,
        variable: "c2s",
        condition: new Filter("c2s/skill_ID", FilterOperator.EQ, SOME_ID)
      }));

      assert.ok(oMockDialog.open.calledOnce);
      assert.deepEqual(oMockBinding.changeParameters.firstCall.args[0],{ "$search":undefined });
    });
  });

  QUnit.test("Should throws an warning message when no catalog is selected", function (assert) {
    aMockCatalogIds = [];
    var messageBoxStub = sinon.stub(MessageBox, "warning");
    cut.onConfirmDialog(oMockEvent);
    assert.ok(messageBoxStub.calledOnce, "MessageBox warning was called");
    messageBoxStub.restore();
  });

  QUnit.test("Should trigger assign action when catalog is selected", function (assert) {
    aMockCatalogIds = ["ID"];
    var messageBoxStub = sinon.stub(MessageBox, "warning");
    cut.onConfirmDialog(oMockEvent);
    assert.ok(messageBoxStub.notCalled, "The fragment was loaded");
    assert.ok(oMockActionContext.setParameter.calledWith("catalog_IDs", aMockCatalogIds));
    assert.ok(oMockActionContext.execute.calledOnce, "Assign action is executed");
    messageBoxStub.restore();
  });
});



