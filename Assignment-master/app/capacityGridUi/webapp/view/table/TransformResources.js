sap.ui.define(["capacityGridUi/reuse/DateUtils", "capacityGridUi/view/Views"], function (Utils, Views) {
	"use strict";
	return {
		transform: function (oTimeColumnsMap, aResources, aAllUtilContexts, sView) {
			let oResourceToUtilContextsMap = this._mapResourcesToUtilizationContexts(aResources, aAllUtilContexts);
			const aResult = [];
			for (let [sResourceId, aUtilContexts] of oResourceToUtilContextsMap) {
				let oResource = this._getResource(aResources, sResourceId);
				let oTransform = this._transformResource(oTimeColumnsMap, oResource, aUtilContexts, sView);
				aResult.push(oTransform);
			}
			return aResult;
		},

		_mapResourcesToUtilizationContexts: function (aResources, aAllUtilContexts) {
			let oMap = new Map();
			for (let oResource of aResources) {
				oMap.set(oResource.ID, []);
			}
			for (let oUtilContext of aAllUtilContexts) {
				let sResourceId = oUtilContext.getObject().ID;
				if (oMap.has(sResourceId)) {
					let aUtilContexts = oMap.get(sResourceId);
					aUtilContexts.push(oUtilContext);
				}
			}
			return oMap;
		},

		_getResource: function (aResources, sResourceId) {
			for (let oResource of aResources) {
				if (oResource.ID === sResourceId) {
					return oResource;
				}
			}
			throw Error("failed to find resource " + sResourceId);
		},

		_transformResource: function (oTimeColumnsMap, oResource, aUtilContexts, sView) {
			let oNewResource = {};
			this._transformProperties(oResource, oNewResource);
			this._transformUISpecifics(oResource, oNewResource);
			oNewResource.utilization = this._transformUtilizations(oTimeColumnsMap, aUtilContexts, sView);
			return oNewResource;
		},

		_transformProperties: function (oResource, oNewResource) {
			oNewResource.resourceID = oResource.ID;
			oNewResource.ID = oResource.ID;
			oNewResource.resourceName = oResource.resourceName;
			oNewResource.avgUtilization = Math.round(oResource.avgUtilization);
			oNewResource.costCenter = oResource.costCenterForDisplay;
			oNewResource.workforcePersonID = oResource.workforcePersonID;
			oNewResource.assignmentExistsForTheResource = oResource.assignmentExistsForTheResource;
			oNewResource.isPhotoPresent  = oResource.isPhotoPresent;
			oNewResource.resourceOrganizationIdForDisplay = oResource.resourceOrganizationIdForDisplay;
			oNewResource.resourceOrganizationNameForDisplay = oResource.resourceOrganizationNameForDisplay;
			oNewResource.workerType = oResource.workerType;
		},

		_transformUISpecifics: function (oResource, oNewResource) {
			if (oResource.assignmentExistsForTheResource) {
				// the assignments are initially empty and only loaded on expand
				// but the array must contain at least one object to make the tree table display an expand arrow
				oNewResource.assignments = [{}];
			} else {
				oNewResource.assignments = null;
			}
			if (oResource.isPhotoPresent) {
				oNewResource.profilePicture = "../capacityGridUi/odata/v4/profilePhoto/profileThumbnail("+oResource.workforcePersonID+")";
			} else {
				oNewResource.profilePicture = null;
			}
			oNewResource.assignmentsLoaded = false;
			oNewResource.parent = true;
			oNewResource.child = false;
			oNewResource.expanded = false;
			oNewResource.error = false;
			oNewResource.warning = false;
			oNewResource.changed = false;
		},

		_transformUtilizations: function (oTimeColumnsMap, aUtilContexts, sView) {
			let aTransformedUtils = [];

			let oUiOnlyTimeColumnsMap = new Map(oTimeColumnsMap);
			aUtilContexts.forEach((oUtilContext) => {
				let oUtil = oUtilContext.getObject();
				let sKey = oTimeColumnsMap.getKeyByTimePeriod(oUtil.timePeriod, sView);
				oUiOnlyTimeColumnsMap.delete(sKey);
				let oTransformedUtil = this._transformUtilization(sKey, oUtil);
				aTransformedUtils.push(oTransformedUtil);
			});

			// Keep blank for columns that are only shown in the UI
			if (aUtilContexts.length !== oTimeColumnsMap.size) {
				oUiOnlyTimeColumnsMap.forEach((oUtil, sUtilKey) => {
					let oEmptyUtil = this._transformUtilization(sUtilKey, null);
					aTransformedUtils.push(oEmptyUtil);
				});
			}

			// Sort array in yearmonth order
			aTransformedUtils.sort((a, b) => {
				return a.key - b.key;
			});

			return aTransformedUtils;
		},

		_transformUtilization: function (sKey, oUtil) {
			return {
				// backend
				utilization: oUtil ? oUtil.utilization : 0,
				freeHours: oUtil ? oUtil.freeHours : 0,
				availableHours: oUtil ? oUtil.availableHours : 0,
				// ui specifics
				key: parseInt(sKey, 10),
				parent: true,
				child: false
			};
		}
	};
});