sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/m/GroupHeaderListItem",
		"staffResourceRequest/utils/CompareUtil",
	],
	function(Controller, JSONModel, GroupHeaderListItem, CompareUtil) {
		return Controller.extend(
			"staffResourceRequest.ext.controller.CompareResources",
			{
				onInit: function() {
					this.oRouter = this.getOwnerComponent().getRouter();
					this.Fcl = this.getOwnerComponent().getRootContainer();
					this.Fcl.attachColumnResize(this.onResize, this);
					this.oRouter.getRoute("CompareResources").attachPatternMatched(this.onRouteMatched, this);
					this.setModels();
				},

				onRouteMatched: function(oEvent) {
					// initialize the resource model here.
					this.resourceModel = this.getModel("resourceModel");
					if (this.resourceModel) {
						this._iFirstItem = 0;
						const oView = this.getView();
						this._aSelectedItems = this.getModel("resourceModel").getData();

						this._iPagesCount = CompareUtil.getPagesCount(
							oView.$().innerWidth(),
							this._aSelectedItems.length
						);
						this._bIsDesktop = CompareUtil.checkIsDesktop(this._iPagesCount);
						this.updateFirstPage();

						this._aResourcesToShow = [];
						for (let i = this._iFirstItem; i < this._iPagesCount; i++) {
							this._aResourcesToShow.push(this._aSelectedItems[i]);
						}

						oView.getModel("resourcesToShow").setData(this._aResourcesToShow);

						this.getModel("settings")
							.setData({
								pagesCount: this._iPagesCount,
								isDesktop: this._bIsDesktop
							});
						const layout = oEvent.getParameters().arguments["?query"] ?
							oEvent.getParameters().arguments["?query"].layout : null;
						if (layout == null) {
							this.setAvailabilityComparePanelExpand(false);
						}
						this.buildSkillComparisonData(oView);
						this.setPageIndicatorVisibility();
					} else {
						// When the user refreshes or reloads the CompareResources target page without
						// any selected contexts then user is redirected to the corresponding
						// Object page of Resource Request
						const reqId = oEvent.getParameter("arguments").key;
						this.oRouter.navTo("ResourceRequestDetails", {"key": reqId, "?layout": "OneColumn"}, true);
					}
				},

				onAfterRendering: function() {
					this._oCarouselSnapped = this.getView().byId("carousel-snapped");
					this._oCarouselExpanded = this.getView().byId("carousel-expanded");
					this._oDynamicPage = this.getView().byId("dynamic-page");
				},

				onPageChanged: function(oEvent) {
					this._activePages = oEvent.getParameter("activePages");

					// The data about the selected products (in the table-like view) needs to be
					// updated, according to the new active (visible) pages of the Carousel control.
					// This event is triggered upon sliding through Carousel's pages.
					this._iFirstItem = this._activePages[0];
					this._iLastItem = this._activePages[this._activePages.length - 1] + 1;

					this._aSelectedItems = this.getModel("resourceModel").getData();

					this._aResourcesToShow = [];
					for (let i = this._iFirstItem; i < this._iLastItem; i++) {
						this._aResourcesToShow.push(this._aSelectedItems[i]);
					}

					this.updateCarouselsActivePage();

					this.getView().getModel("resourcesToShow").setData(this._aResourcesToShow);
				},

				handleFullScreen: function() {
					this.setEnterExitButtonVisibility(false, true);
					this.Fcl.setLayout("MidColumnFullScreen");
				},
				handleExitFullScreen: function() {
					this.setEnterExitButtonVisibility(true, false);
					this.Fcl.setLayout("TwoColumnsMidExpanded");
				},
				handleClose: function() {
					const reqId = this.getModel("resourceModel").getData()[0].resourceRequestID;
					this.setEnterExitButtonVisibility(true, false);
					this.oRouter.navTo("ResourceRequestDetails", {"key": reqId, "?layout": "OneColumn"}, true);
				},

				onSkillComparePanelExpand: function(oEvent) {
					const oView = this.getView();
					const oSource = oEvent.getSource();
					const bIsExpanded = oSource.getExpanded();
					if (bIsExpanded) {
						this.buildSkillComparisonData(oView);
					}
				},

				onStateChange: function(oEvent) {
					const bIsExpanded = oEvent.getParameter("isExpanded");

					// This is needed because of animation issues with Carousel control
					// when it is placed in the Title area of the DynamicPage
					if (bIsExpanded && this._oDynamicPage) {
						this._oDynamicPage.removeSnappedContent(this._oCarouselSnapped);
					} else {
						this._oDynamicPage.addSnappedContent(this._oCarouselSnapped);
					}
				},

				buildSkillComparisonData: function(oView) {
					oView.byId("skillComparePanel").setBusy(true);
					const that = this;
					const oModel = oView.getModel();
					if (this._oCarouselSnapped) {
						this._activePages = this._oCarouselSnapped._aAllActivePagesIndexes;
					} else {
						this._activePages = this._oCarouselExpanded._aAllActivePagesIndexes;
					}
					this._iPagesCount = this.getModel("settings").getProperty("/pagesCount");
					const oResourceModel = this.getModel("resourceModel");
					this._aSelectedItems = oResourceModel.getData();
					// Set group
					oModel.sGroupId = "$direct";
					const sResourceRequestId = this._aSelectedItems[0].resourceRequestID;
					let sLength = this._aSelectedItems.length - 1;
					let sResourceString = "";
					this._aSelectedItems.forEach(function(oResource) {
						sResourceString = sResourceString + "resourceID eq " + oResource.resourceID;
						if (sLength > 0) {
							sResourceString = sResourceString + " or ";
							sLength = sLength - 1;
						}
					});
					const sUrl = "/ResourceRequests(ID=" + sResourceRequestId + ")" +
                        "?$expand=skillRequirements($expand=skill($select=name),proficiencyLevel($select=name,rank)," +
                        "importance($select=name)),skillCompare($filter=" + sResourceString + ")";
					this.oContext = oModel.bindContext(sUrl);
					this.oContext
						.requestObject()
						.then(function(oSkillsContext) {
							const aSkillRequirements = oSkillsContext.skillRequirements;
							const aMatchedSkills = oSkillsContext.skillCompare;
							const oResourcesToShow = [];
							const aResourceSkills = [];
							const resourceProficiency = null;
							const oResourceToShowModel = new JSONModel();

							aSkillRequirements.forEach(function(oSkills) {
								const requestedSkillId = oSkills.skill_ID;
								const requestedSkillName = oSkills.skill.name;
								const requestedProficiency = oSkills.proficiencyLevel.name;
								const requestedProficiencyRank = oSkills.proficiencyLevel.rank;
								const requestedImportanceCode = oSkills.importance.code;
								const bIsMatched = false;
								const resourceProficiencyRank = null;
								const proficiencySetMaxRank = null;

								aResourceSkills.push({
									requestedSkillId,
									requestedSkillName,
									requestedImportanceCode,
									requestedProficiency,
									requestedProficiencyRank,
									resourceProficiency,
									resourceProficiencyRank,
									proficiencySetMaxRank,
									bIsMatched
								});
							});

							that._aSelectedItems.forEach(function(oResource) {
								 // eslint-disable-next-line no-undef
								oResource.resourceSkills = structuredClone(aResourceSkills);

								aMatchedSkills.forEach(function(oMatchedSkill) {
									if (oMatchedSkill.resourceID === oResource.resourceID) {
										const foundSkill = oResource.resourceSkills.find((object) => {
											return object.requestedSkillId === oMatchedSkill.skillId;
										  });

										  if (foundSkill !== undefined) {
											foundSkill.bIsMatched = true;
											foundSkill.resourceProficiency =
												oMatchedSkill.resourceProficiencyLevelName;
											foundSkill.resourceProficiencyRank =
												oMatchedSkill.resourceProficiencyLevelRank;
											foundSkill.proficiencySetMaxRank =
												oMatchedSkill.proficiencySetMaxRank;
											foundSkill.skillThresholds =
												that.getThresholds(foundSkill.proficiencySetMaxRank);
										  }
									}
								});
							});

							if (that._activePages != null && that._activePages.length != 0) {
								that._iFirstItem = that._activePages[0];
							} else {
								that._iFirstItem = 0;
							}

							for (let i = that._iFirstItem; i < (that._iPagesCount + that._iFirstItem ); i++) {
								oResourcesToShow.push(that._aSelectedItems[i]);
							}
							oResourceToShowModel.setData(oResourcesToShow);
							oView.setModel(oResourceToShowModel, "resourcesToShow");
							oView.byId("skillComparePanel").setBusy(false);
						});
				},

				getModel: function(sModelName) {
					return this.getOwnerComponent().getModel(sModelName);
				},

				onResize: function(oEvent) {
					if (this._aSelectedItems) {
						const iWidth = this.getView().$().innerWidth();
						const iNewPagesCount = CompareUtil.getPagesCount(iWidth, this._aSelectedItems.length);

						if (iNewPagesCount !== this._iPagesCount) {
							this._iPagesCount = iNewPagesCount;
							this.getModel("settings")
								.setProperty("/pagesCount", this._iPagesCount);

							this._bIsDesktop = CompareUtil.checkIsDesktop(this._iPagesCount);
							this.getModel("settings")
								.setProperty("/isDesktop", this._bIsDesktop);

							this.updateFirstPage();
							this.updateResourceData();
							this.setPageIndicatorVisibility();
						}
					}
				},

				onAvailabilityComparePanelExpand: function(oEvent) {
					const oView = this.getView();
					const oSource = oEvent.getSource();
					const bIsExpanded = oSource.getExpanded();
					if (bIsExpanded) {
						this.buildAvailabilityComparisonData(oView);
					}
				},

				buildAvailabilityComparisonData: function(oView) {
					oView.byId("availabilityComparePanel").setBusy(true);
					const that = this;
					const oModel = oView.getModel();
					if (this._oCarouselSnapped) {
						this._activePages = this._oCarouselSnapped._aAllActivePagesIndexes;
					} else {
						this._activePages = this._oCarouselExpanded._aAllActivePagesIndexes;
					}
					this._iPagesCount = this.getModel("settings").getProperty("/pagesCount");
					const oResourceModel = this.getModel("resourceModel");
					this._aSelectedItems = oResourceModel.getData();

					// Set group
					oModel.sGroupId = "$direct";
					const sResourceRequestId = this._aSelectedItems[0].resourceRequestID;
					let sLength = this._aSelectedItems.length - 1;
					let sResourceString = "";
					this._aSelectedItems.forEach(function(oResource) {
						sResourceString = sResourceString + "resourceId eq " + oResource.resourceID;
						if (sLength > 0) {
							sResourceString = sResourceString + " or ";
							sLength = sLength - 1;
						}
					});
					const sUrl = "/ResourceRequests(ID=" + sResourceRequestId + ")" +
                        "?$select=ID" + "&$expand=staffingStatus($select=remainingCapacity)" +
						",availabilityCompare($filter=" + sResourceString + ")";
					this.oContext = oModel.bindContext(sUrl);
					this.oContext
						.requestObject()
						.then(function(oAvailContent) {
							const oResourcesToShow = [];
							const oResourceToShowModel = new JSONModel();
							that._aSelectedItems.forEach(function(oResource) {
								const resourceAvailability = oAvailContent.availabilityCompare
									.find((element) =>
										element.resourceId === oResource.resourceID
									);
								let resourceNetCapacity = 0;
								if (resourceAvailability) {
									resourceNetCapacity = resourceAvailability.netCapacityInHours;
								}
							   oResource.resourceAvailability = parseInt(
									resourceNetCapacity
								);
								oResource.requiredCapacity = parseInt(oAvailContent.staffingStatus.remainingCapacity);
							});

							if (that._activePages != null && that._activePages.length != 0) {
								that._iFirstItem = that._activePages[0];
							} else {
								that._iFirstItem = 0;
							}

							for (let i = that._iFirstItem; i < (that._iPagesCount + that._iFirstItem ); i++) {
								oResourcesToShow.push(that._aSelectedItems[i]);
							}
							oResourceToShowModel.setData(oResourcesToShow);
							oView.setModel(oResourceToShowModel, "resourcesToShow");
							oView.byId("availabilityComparePanel").setBusy(false);
						});
				},

				setModels: function() {
					this.getView().setModel(new JSONModel(), "visibility");
					this.visibilityModel = this.getView()
						.getModel("visibility");
					this.setEnterExitButtonVisibility(true, false);
				},

				setPageIndicatorVisibility: function() {
					this.visibilityModel.setProperty("/pageIndicator",
						this._iPagesCount !== this._aSelectedItems.length
					);
				},

				setEnterExitButtonVisibility(bEnterButton, bExitButton) {
					this.visibilityModel.setProperty("/enterButton", bEnterButton);
					this.visibilityModel.setProperty("/exitButton", bExitButton);
				},

				setSkillComparePanelExpand: function(bValue) {
					const skillComparePanel = this.getView().byId("skillComparePanel");
					if (skillComparePanel) {
						skillComparePanel.setExpanded(bValue);
					}
				},

				setAvailabilityComparePanelExpand: function(bValue) {
					const availabilityComparePanel = this.getView().byId("availabilityComparePanel");
					if (availabilityComparePanel) {
						availabilityComparePanel.setExpanded(bValue);
					}
				},

				updateFirstPage: function() {
					const iAllProductsCount = this._aSelectedItems.length;

					// In some cases we need to adjust the first visible page, because it may
					// happen that the screen was smaller and we only showed 1 item, but then
					// the screen becomes bigger and we need to show, for example, 3 items.
					// If the user was on the last page of the Carousel control (considered
					// as first and only visibile page),  when the screen gets bigger and the
					// visible pages become more, the first page should be adjusted in a way
					// that allows us to show the required number of visible pages.
					if (this._iFirstItem + this._iPagesCount > iAllProductsCount) {
						this._iFirstItem = iAllProductsCount - this._iPagesCount;
						this.updateCarouselsActivePage();
					}
				},

				updateCarouselsActivePage: function() {
					// Synchronization of the two Carousels
					this._oCarouselSnapped.setActivePage(
						this._oCarouselSnapped.getPages()[this._iFirstItem]
					);
					this._oCarouselExpanded.setActivePage(
						this._oCarouselExpanded.getPages()[this._iFirstItem]
					);
				},

				updateResourceData: function() {
					// Adjust the resourceToshow model as per the resize

					const oResourcesToShow = [];
					const oResourceToShowModel = new JSONModel();

					if (this._activePages != undefined ) {
						this._iFirstItem = this._activePages[0];
					} else {
						this._iFirstItem = 0;
					}

					for (let i = this._iFirstItem; i < (this._iPagesCount + this._iFirstItem ); i++) {
					  oResourcesToShow.push(this._aSelectedItems[i]);
					}


					oResourceToShowModel.setData(oResourcesToShow);
					this.getView().setModel(oResourceToShowModel, "resourcesToShow");
				},

				getThresholds: function(maxValue) {
					return Array.from(Array(maxValue + 1).keys());
				},

				getGroupHeader: function(oGroup) {
					const i18nModel = this.getView().getModel("i18n");
					let groupTitle;
					if (oGroup.key == 1) {
						groupTitle = i18nModel.getProperty("mandatorySkills");
					} else {
						groupTitle = i18nModel.getProperty("preferredSkills");
					}
					return new GroupHeaderListItem({
						title: groupTitle,
						upperCase: false
					});
				}
			}
		);
	}
);
