sap.ui.define(["sap/ui/model/json/JSONModel", "capacityGridUi/view/table/TablePathAnalysis", "sap/ui/model/Filter",
"sap/ui/model/FilterOperator",], function (JSONModel, TablePathAnalysis, Filter, FilterOperator) {
	"use strict";

	return JSONModel.extend("capacityGridUi.view.table.TableModel", {
		constructor: function (oBundle) {
			JSONModel.call(this, {
				sortProperty: null,
				sortOrder: null,
				resources: [],
				resourcesCount: 0,
				rows: [],
				columns: [],
				cancelEnabled: false,
				busy: false,
				resetBusyOnRowUpdated: false,
				addAsgEnabled: false,
				deleteAsgEnabled: false,
				copyAsgEnabled: false,
				pasteAsgEnabled: false,
				filterDropDownEnabled: false,
				SelectedEditStatus: "All",
				SelectedResourceCount: 0,
				SelectedResourcesID: [],
				IsFocusedEditOnLimit: true
			});
			this.oBundle = oBundle;
		},

		countExpandedAssignments: function () {
			let iAssignments = 0;
			let aRows = this.getProperty("/rows");
			for (let oRow of aRows) {
				if (oRow.expanded) {
					iAssignments += oRow.assignments.length;
				}
			}
			return iAssignments;
		},
		getAssignmentPaths: function (sAsgId) {
			let aResources = this.getProperty("/rows");
			for (let r = 0; r < aResources.length; r++) {
				let oResource = aResources[r];
				if (oResource.assignments) {
					for (let a = 0; a < oResource.assignments.length; a++) {
						let oAssignment = oResource.assignments[a];
						if (oAssignment.asgId === sAsgId) {
							return {
								resourcePath: "/rows/" + r,
								asgPath: "/rows/" + r + "/assignments/" + a
							};
						}
					}
				}
			}
			throw new Error("assignment not found " + sAsgId);
		},

		getChangedAssignmentPaths: function () {
			let aAsgPaths = [];
			let aResources = this.getProperty("/rows");
			for (let r = 0; r < aResources.length; r++) {
				let oResource = aResources[r];
				if (oResource.assignments) {
					for (let a = 0; a < oResource.assignments.length; a++) {
						let oAssignment = oResource.assignments[a];
						if (oAssignment.changed) {
							let sAsgPath = "/rows/" + r + "/assignments/" + a;
							aAsgPaths.push(sAsgPath);
						}
					}
				}
			}
			return aAsgPaths;
		},

		getCopiedAssignmentPaths: function () {
			let aAsgPaths = [];
			let aResources = this.getProperty("/rows");
			for (let r = 0; r < aResources.length; r++) {
				let oResource = aResources[r];
				if (oResource.assignments) {
					for (let a = 0; a < oResource.assignments.length; a++) {
						let oAssignment = oResource.assignments[a];
						if (oAssignment.copyState === "CopyPaste" || oAssignment.copyState === "CutPaste") {
							let sAsgPath = "/rows/" + r + "/assignments/" + a;
							aAsgPaths.push(sAsgPath);
						}
					}
				}
			}
			return aAsgPaths;
		},

		getAssignmentPathsByRequest: function (sRequestId) {
			let aResources = this.getProperty("/rows");
			let aResult = [];
			for (let r = 0; r < aResources.length; r++) {
				let oResource = aResources[r];
				if (oResource.assignments) {
					for (let a = 0; a < oResource.assignments.length; a++) {
						let oAssignment = oResource.assignments[a];
						if (oAssignment.resourceRequest_ID === sRequestId) {
							let sAsgPath = "/rows/" + r + "/assignments/" + a;
							aResult.push(sAsgPath);
						}
					}
				}
			}
			return aResult;
		},

		getDraftAsgByRequest: function (sRequestId) {
			let aResources = this.getProperty("/rows");
			for (let r = 0; r < aResources.length; r++) {
				let oResource = aResources[r];
				if (oResource.assignments) {
					for (let a = 0; a < oResource.assignments.length; a++) {
						let oAssignment = oResource.assignments[a];
						if (oAssignment.resourceRequest_ID === sRequestId && oAssignment.draftExists) {
							return oAssignment;
						}
					}
				}
			}
			return null;
		},

		getUtilizationPath: function (sAsgId, sTimePeriod) {
			let aResources = this.getProperty("/rows");
			for (let r = 0; r < aResources.length; r++) {
				let oResource = aResources[r];
				if (oResource.assignments) {
					for (let a = 0; a < oResource.assignments.length; a++) {
						let oAssignment = oResource.assignments[a];
						if (oAssignment.asgId === sAsgId) {
							for (let u = 0; u < oAssignment.utilization.length; u++) {
								let oUtil = oAssignment.utilization[u];
								if (oUtil.timePeriod === sTimePeriod) {
									return "/rows/" + r + "/assignments/" + a + "/utilization/" + u;
								}
							}
						}
					}
				}
			}
			throw new Error("utilization not found " + sAsgId);
		},

		atLeastOneAssignmentChanged: function (aAsgPaths) {
			for (let sAsgPath of aAsgPaths) {
				let oAsg = this.getProperty(sAsgPath);
				if (oAsg.changed) {
					return true;
				}
			}
			return false;
		},

		atLeastOneAssignmentNotDeleted: function (aAsgPaths) {
			for (let sAsgPath of aAsgPaths) {
				if (this.getProperty(sAsgPath + "/changeState") !== "deleted") {
					return true;
				}
			}
			return false;
		},

		calculateAssignmentChanged: function (sAsgPath, sChangeState) {
			let bDraftExists = sChangeState === "created" || sChangeState === "changed" || sChangeState === "deleted";
			this.setProperty(sAsgPath + "/changeState", sChangeState);
			this.setProperty(sAsgPath + "/changed", sChangeState !== "unChanged");
			this.setProperty(sAsgPath + "/draftExists", bDraftExists);
			this.setProperty(sAsgPath + "/draftTime", bDraftExists ? new Date().getTime() : null);
			let oAnalysis = new TablePathAnalysis(sAsgPath);
			this.aggregateAssignmentChanged(oAnalysis.resourcePath);
		},

		aggregateAssignmentChanged: function (sResourcePath) {
			let bChanged = false;
			let oResource = this.getProperty(sResourcePath);
			for (let a = 0; a < oResource.assignments.length; a++) {
				let oAsg = oResource.assignments[a];
				if (oAsg.changed) {
					bChanged = true;
					break;
				}
			}
			this.setProperty(sResourcePath + "/changed", bChanged);
		},

		calculateAssignmentError: function (sAsgPath) {
			let oAsg = this.getProperty(sAsgPath);
			let bUtilizationErrors = false;
			let bUtilizationWarnings = false;
			for (let u = 0; u < oAsg.utilization.length; u++) {
				let oUtil = oAsg.utilization[u];
				if (oUtil.utilizationValueState === "Error") {
					bUtilizationErrors = true;
				} else if (oUtil.utilizationValueState === "Warning") {
					bUtilizationWarnings = true;
				}
			}
			let bError =
				bUtilizationErrors ||
				oAsg.assignmentStatusValueState === "Error" ||
				oAsg.assignmentValueState === "Error" ||
				oAsg.requestValueState === "Error";
			let bWarning =
				bUtilizationWarnings ||
				oAsg.assignmentStatusValueState === "Warning" ||
				oAsg.assignmentValueState === "Warning" ||
				oAsg.requestValueState === "Warning";
			this.setProperty(sAsgPath + "/error", bError);
			this.setProperty(sAsgPath + "/warning", bWarning);
			let oAnalysis = new TablePathAnalysis(sAsgPath);
			this.aggregateAssignmentError(oAnalysis.resourcePath);
		},

		aggregateAssignmentError: function (sResourcePath) {
			let oResource = this.getProperty(sResourcePath);
			oResource.error = false;
			oResource.warning = false;
			for (let a = 0; a < oResource.assignments.length; a++) {
				let sAsgPath = sResourcePath + "/assignments/" + a;
				let oAsg = this.getProperty(sAsgPath);
				if (oAsg.error) {
					oResource.error = true;
				} else if (oAsg.warning) {
					oResource.warning = true;
				}
			}
			this.setProperty(sResourcePath, oResource);
		},

		updateUtilizationsOnDelete: function (sAsgPath) {
			let oAssignment = this.getProperty(sAsgPath);
			let aUtilizations = oAssignment.utilization;
			for (let i = 0; i < aUtilizations.length; i++) {
				this._updateUtilizationOnDelete(sAsgPath + "/utilization/" + i);
			}
			this._calculateAssignmentUtilOnDelete(sAsgPath);
		},

		_calculateAssignmentUtilOnDelete: function (sAsgPath) {
			let oAssignment = this.getProperty(sAsgPath);
			let iUpdatedStafedHours = oAssignment.staffedHours - oAssignment.assignmentDurationInHours;
			this._updateDependentStaffingSummary(oAssignment, iUpdatedStafedHours);
		},

		_calculateAssignmentUtilOnDiscardDelete: function (sAsgPath) {
			let oAssignment = this.getProperty(sAsgPath);
			let iUpdatedStafedHours = oAssignment.staffedHours + oAssignment.assignmentDurationInHours;
			this._updateDependentStaffingSummary(oAssignment, iUpdatedStafedHours);
		},

		_updateUtilizationOnDelete: function (sUtilPath) {
			let oAssignmentUtil = this.getProperty(sUtilPath);
			let iDifference = oAssignmentUtil.bookedCapacity ? -parseInt(oAssignmentUtil.bookedCapacity) : 0;
			this._calculateResourceUtilization(sUtilPath, iDifference);
		},

		updateUtilizationsOnCreate: function (sAsgPath) {
			let oAssignment = this.getProperty(sAsgPath);
			let aUtilizations = oAssignment.utilization;
			for (let i = 0; i < aUtilizations.length; i++) {
				this._updateUtilOnCreateAndDiscardDeletion(sAsgPath + "/utilization/" + i);
			}
			this._updateDependentStaffingSummary(oAssignment, oAssignment.staffedHours);
		},

		_updateUtilOnCreateAndDiscardDeletion: function (sUtilPath) {
			let oAssignmentUtil = this.getProperty(sUtilPath);
			let iDifference = oAssignmentUtil.bookedCapacity ? parseInt(oAssignmentUtil.bookedCapacity) : 0;
			this._calculateResourceUtilization(sUtilPath, iDifference);
		},

		updateUtilizationsOnDiscardDeletion: function (sAsgPath) {
			let oAssignment = this.getProperty(sAsgPath);
			let aUtilizations = oAssignment.utilization;
			for (let i = 0; i < aUtilizations.length; i++) {
				this._updateUtilOnCreateAndDiscardDeletion(sAsgPath + "/utilization/" + i);
			}
			this._calculateAssignmentUtilOnDiscardDelete(sAsgPath);
		},

		updateUtilizationsOnChange: function (sUtilPath) {
			let oAssignmentUtil = this.getProperty(sUtilPath);
			let iDifference = parseInt(oAssignmentUtil.bookedCapacity) - parseInt(oAssignmentUtil.copyBookedCapacity);
			oAssignmentUtil.copyBookedCapacity = oAssignmentUtil.bookedCapacity;
			this._calculateAssignmentUtilization(sUtilPath, iDifference);
			this._calculateResourceUtilization(sUtilPath, iDifference);
		},

		_calculateAssignmentUtilization: function (sUtilPath, iDifference) {
			let oAnalysis = new TablePathAnalysis(sUtilPath);
			let oAssignment = this.getProperty(oAnalysis.assignmentPath);
			oAssignment.assignmentDurationInHours = oAssignment.assignmentDurationInHours + iDifference;
			let iUpdatedStaffedHours = (oAssignment.staffedHours += iDifference);
			this._updateDependentStaffingSummary(oAssignment, iUpdatedStaffedHours);
		},

		// replace all staffing summary with updated calculation
		_updateDependentStaffingSummary: function (oAssignment, iUpdatedStafedHours) {
			let sStaffedHoursText = this.oBundle.getText("STAFFED_HOURS", [iUpdatedStafedHours, oAssignment.requestedCapacityInHours]);
			let iRemainingEffort = oAssignment.RequiredEffort - iUpdatedStafedHours;
			let aAsgPaths = this.getAssignmentPathsByRequest(oAssignment.resourceRequest_ID);
			aAsgPaths.forEach((sAsgPathOfResource) => {
				let oAsgOfResource = this.getProperty(sAsgPathOfResource);
				oAsgOfResource.staffedHours = iUpdatedStafedHours;
				oAsgOfResource.staffedHoursText = sStaffedHoursText;
				oAsgOfResource.RemainingEffort = iRemainingEffort;
			});
		},

		_calculateResourceUtilization: function (sUtilPath, iDifference) {
			let oAnalysis = new TablePathAnalysis(sUtilPath);

			let oResource = this.getProperty(oAnalysis.resourcePath);
			let oResourceUtilization = this.getProperty(oAnalysis.resourceUtilizationPath);

			oResourceUtilization.freeHours -= iDifference;

			// utilization
			if (oResourceUtilization.availableHours !== 0) {
				oResourceUtilization.utilization = Math.floor(
					((oResourceUtilization.availableHours - oResourceUtilization.freeHours) * 100) / oResourceUtilization.availableHours
				);
			} else {
				oResourceUtilization.utilization = oResourceUtilization.freeHours === 0 ? 0 : 999;
			}

			// avgUtilization
			let iCumulativeFreeHours = 0;
			let iCumulativeTotalHours = 0;
			oResource.utilization.forEach((oUtilColumn) => {
				iCumulativeFreeHours += oUtilColumn.freeHours;
				iCumulativeTotalHours += oUtilColumn.availableHours;
			});
			if (iCumulativeTotalHours !== 0) {
				oResource.avgUtilization = Math.floor(((iCumulativeTotalHours - iCumulativeFreeHours) / iCumulativeTotalHours) * 100);
			} else {
				oResource.avgUtilization = iCumulativeFreeHours === 0 ? 0 : 999;
			}

			this.setProperty(oAnalysis.resourcePath, oResource);
		},

		removeAssignment: function (sAsgPath) {
			let oAnalysis = new TablePathAnalysis(sAsgPath);
			let aAssignments = this.getProperty(oAnalysis.resourcePath + "/assignments");
			aAssignments.splice(oAnalysis.assignmentIndex, 1);
			this.setProperty(oAnalysis.resourcePath + "/assignments", aAssignments);
		},

		getNewAsgIndex: function (sResourcePath) {
			let aAssignments = this.getProperty(sResourcePath + "/assignments") ? this.getProperty(sResourcePath + "/assignments") : [];
			for (let i = aAssignments.length - 1; i >= 0; i--) {
				if (aAssignments[i].changeState === "created" || aAssignments[i].changeState === "empty") {
					return i;
				}
			}
			return null;
		},

		resetAsgValueStates: function (sAsgPath) {
			let oAsg = this.getProperty(sAsgPath);
			// assignment status
			let bAsgStatusChanged = oAsg.assignmentStatusValueState === "Information" || oAsg.assignmentStatusValueState === "Error";
			if (bAsgStatusChanged) {
				this.setProperty(sAsgPath + "/assignmentStatusValueState", "None");
				this.setProperty(sAsgPath + "/assignmentStatusValueStateText", "");
			}
			this.setProperty(sAsgPath + "/assignmentValueState", "None");

			// utilization
			for (let u = 0; u < oAsg.utilization.length; u++) {
				let oUtilization = oAsg.utilization[u];
				let bUtilizationChanged = oUtilization.utilizationValueState === "Information" || oUtilization.utilizationValueState === "Error";
				if (bUtilizationChanged) {
					let sUtilPath = sAsgPath + "/utilization/" + u;
					this.setProperty(sUtilPath + "/utilizationValueState", "None");
					this.setProperty(sUtilPath + "/utilizationValueStateText", "");
				}
			}
		},

		markAssignmentCopiedOrCut: function (aAsgPaths, sKey) {
			for (let i = 0; i < aAsgPaths.length; i++) {
				this.setProperty(aAsgPaths[i] + "/copyState", sKey);
			}
		},

		unmarkAssignmentCopiedOrCut: function (aAsgPaths) {
			aAsgPaths = aAsgPaths.slice();
			for (let i = 0; i < aAsgPaths.length; i++) {
				let sAsgPath = aAsgPaths[i];
				this._unmarkAssignment(sAsgPath);
			}
		},

		_unmarkAssignment: function (sAsgPath) {
			this.setProperty(sAsgPath + "/copyState", "NO_COPIED_ASSIGNMENT");
		},

		getDraftAssignmentPathForRequest: function (sRequestId, sAsgPath) {
			let oAnalysis = new TablePathAnalysis(sAsgPath);
			let aAssignments = this.getProperty(oAnalysis.resourcePath + "/assignments") || [];
			for (let i = 0; i < aAssignments.length; i++) {
				if (aAssignments[i].changeState === "created" && aAssignments[i].resourceRequest_ID === sRequestId) {
					return this.getAssignmentPaths(aAssignments[i].asgId);
				}
			}
			return null;
		},

		isDraftExistsForRequestSelected: function (sRequestId, sAsgPath) {
			let oAsgPaths = this.getDraftAssignmentPathForRequest(sRequestId, sAsgPath);
			if (oAsgPaths) {
				return true;
			}
			return false;
		},
		getResourceIdsForChangedResources: function (sRequestId) {
			let aResources = this.getProperty("/rows");
			let aChangedResourceIds = [];
			for (let r = 0; r < aResources.length; r++) {
				let oResource = aResources[r];
				if (oResource.changed) {
					aChangedResourceIds.push(oResource.ID);
				}
			}
			return aChangedResourceIds;
		},

		getFocusedEditFilters: function () {
			let aFilters = [];
			let aSelectedResources = this.getProperty("/SelectedResourcesID");
			let aSelectionFilter = [];
			for (let i = 0; i < aSelectedResources.length; i++) {
				aSelectionFilter.push(new Filter("ID", FilterOperator.EQ, aSelectedResources[i]));
			}
			aFilters.push(
				new Filter({
					filters: aSelectionFilter,
					and: false
				})
			);
			return aFilters;
		}
	});
});
