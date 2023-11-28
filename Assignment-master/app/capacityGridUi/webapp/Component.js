sap.ui.define(
	[
		"sap/ui/core/UIComponent",
		"capacityGridUi/reuse/controller/Controllers",
		"capacityGridUi/reuse/Tracer",
		"capacityGridUi/ValueHelpConfigCollectionFactory",
		"capacityGridUi/view/draft/DraftUpdateHours",
		"capacityGridUi/view/draft/DraftUpdateStatus",
		"capacityGridUi/view/draft/DraftChangesTracker",
		"capacityGridUi/view/draft/DraftSave",
		"capacityGridUi/view/draft/DraftCancel",
		"capacityGridUi/view/draft/DraftKeepAlive",
		"capacityGridUi/view/message/MessageDialog.controller",
		"capacityGridUi/view/draft/DraftCreate",
		"capacityGridUi/view/draft/DraftDelete",
		"capacityGridUi/view/draft/CutCopyPaste",
		"capacityGridUi/view/draft/DragAndDrop",
		"capacityGridUi/view/AppModel",
		"capacityGridUi/view/message/MessageModel",
		"capacityGridUi/view/header/DateModel",
		"capacityGridUi/view/table/TableModel"
	],
	function (
		UIComponent,
		Controllers,
		Tracer,
		ValueHelpConfigCollectionFactory,
		DraftUpdateHours,
		DraftUpdateStatus,
		DraftChangesTracker,
		DraftSave,
		DraftCancel,
		DraftKeepAlive,
		MessageDialogController,
		DraftCreate,
		DraftDelete,
		CutCopyPaste,
		DragAndDrop,
		AppModel,
		MessageModel,
		DateModel,
		TableModel
	) {
		"use strict";

		return UIComponent.extend("capacityGridUi.Component", {
			metadata: {
				manifest: "json",
				config: {
					fullWidth: true
				}
			},

			oValueHelpConfigCollection: undefined,
			oControllers: undefined,
			models: undefined,
			oTimeColumnsMap: undefined,

			init: function () {
				UIComponent.prototype.init.apply(this, arguments);

				let oBundle = this.getModel("i18n").getResourceBundle();

				this._createModels(oBundle);

				this.oValueHelpConfigCollection = ValueHelpConfigCollectionFactory.get(oBundle, this.models);

				let aEssentialControllers = ["header", "variant", "page", "filterBar"];
				this.oControllers = new Controllers(aEssentialControllers);

				this.oControllers.add("messageDialog", new MessageDialogController(this));
				this.oControllers.add("draftSave", new DraftSave(this));
				this.oControllers.add("draftCancel", new DraftCancel(this));
				this.oControllers.add("draftUpdateHours", new DraftUpdateHours(this));
				this.oControllers.add("draftUpdateStatus", new DraftUpdateStatus(this));
				this.oControllers.add("draftKeepAlive", new DraftKeepAlive(this));
				this.oControllers.add("draftChangesTracker", new DraftChangesTracker(this));
				this.oControllers.add("draftCreate", new DraftCreate(this));
				this.oControllers.add("draftDelete", new DraftDelete(this));
				this.oControllers.add("cutCopyPaste", new CutCopyPaste(this));
				this.oControllers.add("dragAndDrop", new DragAndDrop(this));
				this.oControllers.add("tracer", new Tracer(this));

				this.oTimeColumnsMap = null;

				// enable routing (to be called at last, it triggers creation of views)
				this.getRouter().initialize();
			},

			_createModels: function (oBundle) {
				let oAppModel = new AppModel(oBundle);
				let oDateModel = new DateModel(oBundle);
				let oTableModel = new TableModel(oBundle);
				let oMessageModel = new MessageModel(oBundle, oTableModel);

				this.setModel(oAppModel, "app");
				this.setModel(oDateModel, "date");
				this.setModel(oTableModel);
				this.setModel(oMessageModel, "message");

				this.models = {
					oDataV4: this.getModel("oDataV4"),
					app: oAppModel,
					date: oDateModel,
					table: oTableModel,
					message: oMessageModel
				};
			},

			exit: function () {
				this.oControllers.messageDialog.destroy();
				this.oControllers.draftKeepAlive.stop();
				let aChangedAsgPaths = this.models.table.getChangedAssignmentPaths();
				if (aChangedAsgPaths.length > 0) {
					this.oControllers.draftCancel.sendCancelRequests(aChangedAsgPaths);
				}
			}
		});
	}
);
