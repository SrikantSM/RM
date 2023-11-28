sap.ui.define(
	["sap/ui/model/json/JSONModel", "staffResourceRequest/utils/CompareUtil"],
	function(JSONModel, CompareUtil) {
		return {
			onCompareActionPress: function(oBindingContext, aSelectedContexts) {
				const oView = this._view;
				this.oRouter = oView.getController().getAppComponent().getRouter();
				this.oComponent = oView.getController().getAppComponent();
				this.Fcl = this.oComponent
					.getRootViewController()
					.getFclControl();
				const midColumnPage = this.Fcl.getCurrentMidColumnPage();
				const sId = oBindingContext.getObject("ID");
				const iNumberOfResources = aSelectedContexts.length;
				const aResourceInfo = [];
				const aResourcesToShow = [];
				const oResourceModel = new JSONModel();
				const oResourceToShowModel = new JSONModel();
				const oSettingModel = new JSONModel();

				for (let i = 0; i < iNumberOfResources; i++) {
					const oCandidate = aSelectedContexts[i].getObject();
					const totalMatchCriticality =
						CompareUtil.getObjectStatusCriticality(oCandidate.totalMatchPercentage);
					const skillMatchStatusCriticality =
						CompareUtil.getObjectStatusCriticality(oCandidate.skillMatchPercentage);
					const skillMatchCriticality =
						CompareUtil.getMicrochartCriticality(oCandidate.skillMatchPercentage);
					const availMatchCriticality =
						CompareUtil.getMicrochartCriticality(oCandidate.availabilityMatchPercentage);
					const availMatchStatusCriticality =
						CompareUtil.getObjectStatusCriticality(oCandidate.availabilityMatchPercentage);

					aResourceInfo.push({
						resourceRequestID: sId,
						resourceID: aSelectedContexts[i].getObject("resources").resource_ID,
						resourceName: aSelectedContexts[i].getProperty("resourceName"),
						resourceRole: aSelectedContexts[i].getObject("resources").role,
						workerTypeName: aSelectedContexts[i].getObject("resources").workerType.name,
						emailAddress: aSelectedContexts[i].getObject("resources")
							.emailAddress,
						initials: aSelectedContexts[i].getProperty("initials"),
						workforcePersonID: aSelectedContexts[i].getProperty("workforcePersonID"),
						totalMatchPercentage: oCandidate.totalMatchPercentage,
						totalMatchCriticality: totalMatchCriticality,
						skillMatchPercentage: parseFloat(oCandidate.skillMatchPercentage),
						skillMatchCriticality: skillMatchCriticality,
						skillMatchStatusCriticality: skillMatchStatusCriticality,
						availMatchPercentage: parseFloat(oCandidate.availabilityMatchPercentage),
						availMatchCriticality: availMatchCriticality,
						availMatchStatusCriticality: availMatchStatusCriticality,
						utilizationPercentage: oCandidate.utilizationPercentage
					});
				}

				this._aSelectedItems = aResourceInfo;

				this._iPagesCount = CompareUtil.getPagesCount(
					this.oComponent
						.getRootControl()
						.$()
						.innerWidth(),
					iNumberOfResources
				);

				this._bIsDesktop = CompareUtil.checkIsDesktop(this._iPagesCount);

				if (midColumnPage) {
					this._iPagesCount = CompareUtil.getPagesCount(
						midColumnPage.$().innerWidth(),
						iNumberOfResources
					);
					midColumnPage.getController()._aSelectedItems = this._aSelectedItems;
					if (midColumnPage.$().innerWidth() != 0) {
						this._iPagesCount = CompareUtil.getPagesCount(
							midColumnPage.$().innerWidth(),
							iNumberOfResources
						);
						this._bIsDesktop = CompareUtil.checkIsDesktop(this._iPagesCount);
					}
				}

				this._iFirstItem = 0;
				for (let i = this._iFirstItem; i < this._iPagesCount; i++) {
					aResourcesToShow.push(aResourceInfo[i]);
				}

				oResourceToShowModel.setData(aResourcesToShow);
				this.oComponent.setModel(oResourceToShowModel, "resourcesToShow");

				oResourceModel.setData(aResourceInfo);
				this.oComponent.setModel(oResourceModel, "resourceModel");


				oSettingModel.setData({
					pagesCount: this._iPagesCount,
					isDesktop: this._bIsDesktop
				});

				this.oComponent.setModel(oSettingModel, "settings");

				if (midColumnPage && this.Fcl.getLayout() !== "OneColumn") {
					midColumnPage.getController()._iPagesCount = this._iPagesCount;
					midColumnPage.getController()._bIsDesktop = this._bIsDesktop;
					midColumnPage.getController()._iFirstItem = this._iFirstItem;
					midColumnPage.getController()._aResourcesToShow = aResourcesToShow;
					midColumnPage.getController().buildSkillComparisonData(midColumnPage);
					midColumnPage.getController().updateCarouselsActivePage();
					midColumnPage.getController().setPageIndicatorVisibility();
					midColumnPage
						.byId("availabilityComparePanel")
						.setExpanded(false);
				}

				this.oRouter.navTo("CompareResources", {key: sId}, true);
			},
			enabledIfTwoToEightSelected: function(oContext, aSelectedContexts) {
				const oCompareButton = this._controller
					.getView()
					.byId(
						"staffResourceRequest::ResourceRequestObjectPage--fe::table::matchingCandidates" +
		  "::LineItem::CustomAction::CompareAction"
					);
				const i18nBundle = this.getModel("i18n").getResourceBundle();
				CompareUtil.setTextForAction(aSelectedContexts, i18nBundle, oCompareButton);
				return aSelectedContexts.length >= 1 && aSelectedContexts.length <= 8;
			}
		};
	}


);
