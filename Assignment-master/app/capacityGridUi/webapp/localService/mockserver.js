/* eslint-disable no-undef,no-console */
sap.ui.define(["sap/ui/model/json/JSONModel", "sap/ui/thirdparty/sinon", "sap/base/Log"], function (JSONModel, sinon, Log) {
	("use strict");

	let oSandbox = sinon.sandbox.create();
	let aResourceOrgs; // The array that holds the cached Resource Org data
	let aCostCenters; // The array that holds the cached cost centers
	let aProjectsVH; // The array that holds the projects
	let aCustomersVH; // The array that holds the customers
	let aProjectRolesVH; // The array that holds the Project Roles
	let aWorkerTypesVH; // The array that holds the Worker Types
	let aRequestsVH; // The array that holds the Requests
	let aReferenceObjects;
	let aReferenceObjectTypes;
	let aResourceDetails;
	let aHeaders; // The array that holds the cached Header data
	let aMonthlyUtils; // The array that holds the cached Daily Utlization table data
	let aDailyUtils; // The array that holds the cached Monthly Utlization table data
	let aWeeklyUtils; // The array that holds the cached WeeklyUtlization table data
	let aMonthlyAssignments;
	let aDailyAssignments;
	let aWeeklyAssignments;
	let aAssignmentsHeader; // The array that holds the cached assignments
	let aMonthlyAssignmentsLineItems; // The array that holds the cached assignments for Monthly
	let aDailyAssignmentsLineItems; // The array that holds the cached assignments for Daily
	let aWeeklyAssignmentsLineItems; // The array that holds the cached assignments for Weekly
	let aHeaderKPIs; // The array that holds the cached Header KPIs
	let aRequestDetailsForEachAssignment; // The array that holds Requestdetails of particular assignment
	let sMetadata; // The string that holds the cached mock service metadata
	let sNamespace = "capacityGridUi";
	let sLogComponent = "capacityGridUi.mockserver"; // Component for writing logs into the console
	let rBaseUrl = /odata\/v4\/CapacityService/;
	let rBaseUrlLrep = /lrep/;
	let BASE_MONTH_FOR_TEST_DATA = "202101";
	let BASE_DATE_FOR_TEST_DATA = "20210101";
	let aRequests = [];
	let oErrorOnNextRequest = null;
	let oMessageOnNextRequest = null

	return {
		/**
		 * Creates a Sinon fake service, intercepting all http requests to
		 * the URL defined in variable sBaseUrl above.
		 * @return {Promise} a promise that is resolved when the mock server is started
		 */
		init: function () {
			// Read the mock data
			return readData().then(function () {
				// Initialize the sinon fake server
				oSandbox.useFakeServer();
				// Make sure that requests are responded to automatically. Otherwise we would need to do that manually.
				oSandbox.server.autoRespond = true;

				//  oSandbox.server.autoRespondAfter = 3000;
				oSandbox.server.respondImmediately = true;

				// Register the requests for which responses should be faked.
				oSandbox.server.respondWith(rBaseUrl, handleAllRequests);
				oSandbox.server.respondWith(rBaseUrlLrep, handleLrepRequests);

				// Apply a filter to the fake XmlHttpRequest.
				// Otherwise, ALL requests (e.g. for the component, views etc.) would be intercepted.
				sinon.FakeXMLHttpRequest.useFilters = true;
				sinon.FakeXMLHttpRequest.addFilter(function (sMethod, sUrl) {
					// If the filter returns true, the request will NOT be faked.
					// We only want to fake requests that go to the intended service.
					return !rBaseUrl.test(sUrl) && !rBaseUrlLrep.test(sUrl);
				});

				mergeMonthlyAssignmentExpand();
				mergeDailyAssignmentExpand();
				mergeWeeklyAssignmentExpand();

				// Set the logging level for console entries from the mock server
				Log.setLevel(1, sLogComponent);

				Log.info("Running the app with mock data", sLogComponent);
			});
		},

		failOnNextRequest: function (oParams) {
			oErrorOnNextRequest = {
				code: 500,
				batch: false,
				count: 1
			};
			if (oParams && oParams.code) {
				oErrorOnNextRequest.code = oParams.code;
			}
			if (oParams && oParams.batch) {
				oErrorOnNextRequest.batch = oParams.batch;
			}
			if (oParams && oParams.count) {
				oErrorOnNextRequest.count = oParams.count;
			}
			if (oParams && oParams.target) {
				oErrorOnNextRequest.target = oParams.target;
			}
		},

		messageOnNextRequest:function(oParams){
			oMessageOnNextRequest = {
				messageType:4,
				target:null
			};
			if (oParams && oParams.messageType) {
				if(oParams.messageType === "Information"){
					oMessageOnNextRequest.messageType = 2;
				}else if(oParams.messageType === "Warning"){
					oMessageOnNextRequest.messageType = 3;
				}else{
					oMessageOnNextRequest.messageType = 4;
				}
			}
			if (oParams && oParams.target) {
				oMessageOnNextRequest.target = oParams.target;
			}
		},

		getRequests: function () {
			return aRequests;
		},

		resetRequests: function () {
			aRequests = [];
		},

		/**
		 * Stops the request interception and deletes the Sinon fake server.
		 */
		stop: function () {
			sinon.FakeXMLHttpRequest.filters = [];
			sinon.FakeXMLHttpRequest.useFilters = false;
			oSandbox.restore();
			oSandbox = null;
		}
	};

	/**
	 * Returns the base URL from a given URL.
	 * @param {string} sUrl - the complete URL
	 * @return {string} the base URL
	 */
	function getBaseUrl(sUrl) {
		// let aMatches = sUrl.match(/http.+\(S\(.+\)\)\//);
		let aMatches = sUrl.match(/([^$]+)/);

		if (!Array.isArray(aMatches) || aMatches.length < 1) {
			throw new Error("Could not find a base URL in " + sUrl);
		}

		return aMatches[0];
	}

	// requests for the layer repository are send by the SmartVariantManagement control
	// the fake data is invalid but at least the call ends with 200
	function handleLrepRequests() {
		return [200, {}, {}];
	}

	function getSAPCoreMessage(oXhr){
		let sTarget = oMessageOnNextRequest.target;
		if (oXhr.method !== "GET" && !sTarget) {
			sTarget = oXhr.url.match(/=(.*),/)?oXhr.url.match(/=(.*),/).pop():null;
			if (!sTarget) {
				sTarget = oXhr.url.match(/\(([^)]*)\)/)?oXhr.url.match(/\(([^)]*)\)/).pop():null;
			}
		}
		return [{"message":"test message from mockserver","target":sTarget,"numericSeverity":oMessageOnNextRequest.messageType, }]
	}

	function createResponse(oResponse, iStatus, sContext,oXhr) {
		let aMessages =null;
		if(oMessageOnNextRequest && oXhr){
			aMessages = getSAPCoreMessage(oXhr);
			oMessageOnNextRequest = null;
		}
		let sResponseBody = JSON.stringify(oResponse);
		if (sContext) {
			sResponseBody = "{\"@odata.context\": \"$metadata#" + sContext + "\"," + "\"value\": " + sResponseBody + "}";
		}
		return [
			iStatus,
			{
				"Content-Type": "application/json; odata.metadata=minimal",
				"OData-Version": "4.0"
			},
			sResponseBody,
			{
            "sap-messages":aMessages
		    }
		];
	}

	function readMetadata() {
		return new Promise(function (fnResolve, fnReject) {
			let sResourcePath = sap.ui.require.toUrl(sNamespace + "/localService/metadata.xml");
			let oRequest = new XMLHttpRequest();

			oRequest.onload = function () {
				// 404 is not an error for XMLHttpRequest so we need to handle it here
				if (oRequest.status === 404) {
					let sError = "resource " + sResourcePath + " not found";
					Log.error(sError, sLogComponent);
					fnReject(new Error(sError, sLogComponent));
				}
				fnResolve(this.responseText);
			};
			oRequest.onerror = function () {
				let sError = "error loading resource '" + sResourcePath + "'";
				Log.error(sError, sLogComponent);
				fnReject(new Error(sError, sLogComponent));
			};
			oRequest.open("GET", sResourcePath);
			oRequest.send();
		});
	}

	function readCSV(sFileName, sBaseCalMonth, sView) {
		return new Promise(function (fnResolve, fnReject) {
			let sResourcePath = sap.ui.require.toUrl(sNamespace + "/localService/mockdata/" + sFileName);
			let oRequest = new XMLHttpRequest();

			oRequest.onload = function () {
				// 404 is not an error for XMLHttpRequest so we need to handle it here
				if (oRequest.status === 404) {
					let sError = "resource " + sResourcePath + " not found";
					Log.error(sError, sLogComponent);
					fnReject(new Error(sError, sLogComponent));
				}
				let aResults = convertCSVToJSON(this.responseText, sBaseCalMonth, sView);
				fnResolve(aResults);
			};
			oRequest.onerror = function () {
				let sError = "error loading resource '" + sResourcePath + "'";
				Log.error(sError, sLogComponent);
				fnReject(new Error(sError, sLogComponent));
			};
			oRequest.open("GET", sResourcePath);
			oRequest.send();
		});
	}

	/**
	 * Reads and caches the fake service metadata and data from their respective files.
	 * @return {Promise} a promise that is resolved when the data is loaded
	 */
	function readData() {
		let oMetadataPromise = readMetadata();
		oMetadataPromise.then((sResult) => (sMetadata = sResult));

		let oResourceOrgPromise = readCSV("ResourceOrganizations.csv", null, null);
		oResourceOrgPromise.then((aResults) => (aResourceOrgs = aResults));

		let oCostCenterPromise = readCSV("ResourceOrganizationCostCenters.csv", null, null);
		oCostCenterPromise.then((aResults) => (aCostCenters = aResults));

		let oProjectPromise = readCSV("Projects.csv", null, null);
		oProjectPromise.then((aResults) => (aProjectsVH = aResults));

		let oCustomerPromise = readCSV("Customers.csv", null, null);
		oCustomerPromise.then((aResults) => (aCustomersVH = aResults));

		let oProjectRolePromise = readCSV("ProjectRoles.csv", null, null);
		oProjectRolePromise.then((aResults) => (aProjectRolesVH = aResults));

		let oWorkerTypePromise = readCSV("WorkerTypes.csv", null, null);
		oWorkerTypePromise.then((aResults) => (aWorkerTypesVH = aResults));

		let oRequestPromise = readCSV("Requests.csv", null, null);
		oRequestPromise.then((aResults) => (aRequestsVH = aResults));

		let oReferenceObjectPromise = readCSV("ReferenceObject.csv", null, null);
		oReferenceObjectPromise.then((aResults) => (aReferenceObjects = aResults));

		let oReferenceObjectTypePromise = readCSV("ReferenceObjectType.csv", null, null);
		oReferenceObjectTypePromise.then((aResults) => (aReferenceObjectTypes = aResults));

		let oResourceDetailsPromise = readCSV("ResourceDetails.csv", null, null);
		oResourceDetailsPromise.then((aResults) => (aResourceDetails = aResults));

		let oCapaGridHeaderPromise = readCSV("capacityGridHeaderTemporal.csv", BASE_MONTH_FOR_TEST_DATA, "Monthly");
		oCapaGridHeaderPromise.then((aResults) => (aHeaders = aResults));

		let oCapaGridHeaderMonthlyUtilPromise = readCSV("capacityGridMonthlyUtilizationTemporal.csv", BASE_MONTH_FOR_TEST_DATA, "Monthly");
		oCapaGridHeaderMonthlyUtilPromise.then((aResults) => (aMonthlyUtils = aResults));

		let oCapaGridHeaderDailyUtilPromise = readCSV("capacityGridDailyUtilizationTemporal.csv", BASE_DATE_FOR_TEST_DATA, "Daily");
		oCapaGridHeaderDailyUtilPromise.then((aResults) => (aDailyUtils = aResults));

		let oCapaGridHeaderWeeklyUtilPromise = readCSV("capacityGridWeeklyUtilizationTemporal.csv", BASE_MONTH_FOR_TEST_DATA, "Weekly");
		oCapaGridHeaderWeeklyUtilPromise.then((aResults) => (aWeeklyUtils = aResults));

		let oAssignmentsHeaderPromise = readCSV("AssignmentsDetailsForCapacityGrid.csv", null, null);
		oAssignmentsHeaderPromise.then((aResults) => (aAssignmentsHeader = aResults));

		let oMonthlyAssignmentsLineItemsPromise = readCSV("AssignmentBucketsYearMonthAggregate.csv", BASE_MONTH_FOR_TEST_DATA, "Monthly");
		oMonthlyAssignmentsLineItemsPromise.then((aResults) => (aMonthlyAssignmentsLineItems = aResults));

		let oDailyAssignmentsLineItemsPromise = readCSV("AssignmentBucketsPerDay.csv", BASE_DATE_FOR_TEST_DATA, "Daily");
		oDailyAssignmentsLineItemsPromise.then((aResults) => (aDailyAssignmentsLineItems = aResults));

		let oWeeklyAssignmentsLineItemsPromise = readCSV("AssignmentBucketsYearWeekAggregate.csv", BASE_MONTH_FOR_TEST_DATA, "Weekly");
		oWeeklyAssignmentsLineItemsPromise.then((aResults) => (aWeeklyAssignmentsLineItems = aResults));

		let oHeaderKPIsPromise = readCSV("capacityGridHeaderKPITemporal.csv", null, null);
		oHeaderKPIsPromise.then((aResults) => (aHeaderKPIs = aResults));

		let oRequestDetailsForEachAssignmentPromise = readCSV("RequestDetailsForEachAssignment.csv", null, null);
		oRequestDetailsForEachAssignmentPromise.then((aResults) => (aRequestDetailsForEachAssignment = aResults));

		return Promise.all([
			oMetadataPromise,
			oResourceOrgPromise,
			oCostCenterPromise,
			oResourceDetailsPromise,
			oCapaGridHeaderPromise,
			oCapaGridHeaderMonthlyUtilPromise,
			oCapaGridHeaderDailyUtilPromise,
			oCapaGridHeaderWeeklyUtilPromise,
			oAssignmentsHeaderPromise,
			oMonthlyAssignmentsLineItemsPromise,
			oDailyAssignmentsLineItemsPromise,
			oWeeklyAssignmentsLineItemsPromise,
			oHeaderKPIsPromise,
			oRequestDetailsForEachAssignmentPromise
		]);
	}

	/**
	 * Reduces a given result set by applying the OData URL parameters 'skip' and 'top' to it.
	 * Does NOT change the given result set but returns a new array.
	 * @param {Object} oXhr - the Sinon fake XMLHttpRequest
	 * @param {Array} aResultSet - the result set to be reduced.
	 * @return {Array} the reduced result set.
	 */
	function applySkipTop(oXhr, aResultSet) {
		let iSkip;
		let iTop;
		let aReducedData = [].concat(aResultSet);
		let aMatches = oXhr.url.match(/\$skip=(\d+)&\$top=(\d+)/);

		if (Array.isArray(aMatches) && aMatches.length >= 3) {
			iSkip = aMatches[1];
			iTop = aMatches[2];
			return aResultSet.slice(iSkip, iSkip + iTop);
		}

		return aReducedData;
	}

	/**
	 * Sorts a given result set by applying the OData URL parameter 'orderby'.
	 * Does NOT change the given result set but returns a new array.
	 * @param {Object} oXhr - the Sinon fake XMLHttpRequest
	 * @param {Array} aResultSet - the result set to be sorted.
	 * @return {Array} the sorted result set.
	 */
	function applySort(oXhr, aResultSet) {
		let sFieldName;
		let sDirection;
		let aSortedUsers = [].concat(aResultSet); // work with a copy
		let aMatches = oXhr.url.match(/\$orderby=(\w*)(?:%20(\w*))?/);

		if (!Array.isArray(aMatches) || aMatches.length < 2) {
			return aSortedUsers;
		} else {
			sFieldName = aMatches[1];
			sDirection = aMatches[2] || "asc";
			if (sFieldName === "resourceName") {
				aSortedUsers.sort(function (a, b) {
					let nameA = a.resourceName.toUpperCase();
					let nameB = b.resourceName.toUpperCase();
					let bAsc = sDirection === "asc";

					if (nameA < nameB) {
						return bAsc ? -1 : 1;
					}
					if (nameA > nameB) {
						return bAsc ? 1 : -1;
					}
					return 0;
				});
			} else {
				console.error("mockserver does not support sorting for property: " + sFieldName);
			}

			return aSortedUsers;
		}
	}

	/**
	 * Filters a given result set by applying the OData URL parameter 'filter'.
	 * Does NOT change the given result set but returns a new array.
	 * @param {Object} oXhr - the Sinon fake XMLHttpRequest
	 * @param {Array} aResultSet - the result set to be filtered.
	 * @return {Array} the filtered result set.
	 */
	function applyHeadersFilter(oXhr, aResultSet) {
		let sUrl = (" " + oXhr.url).slice(1);
		let aSplit = sUrl.split("&");
		let iIndex = aSplit.findIndex((sElement) => sElement.includes("$filter"));
		let sDecodedFilter = decodeURI(aSplit[iIndex]);
		let aRootFilter = sDecodedFilter.match(/\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/g);

		let aFilteredHeaders = [].concat(aResultSet); // work with a copy

		if (iIndex === -1) {
			return aFilteredHeaders;
		}

		let sCondition = "";
		aRootFilter = aRootFilter.filter((sQuery) => !sQuery.includes("resourceAssignment/any")); // Remove Filter Type Any
		aRootFilter.forEach(function (sFilter, iFilterIndex) {
			if (sFilter.includes("contains")) {
				let aTags = sFilter.match(/contains([^)]+\))/g);
				aTags.forEach(function (sTag, iTagIndex) {
					if (iTagIndex === 0) {
						sCondition += "(";
					}
					let aData = sTag.match(/.*\((.*),'(.*)'\)/);
					sCondition += "oHeader['" + aData[1] + "'].indexOf(decodeURI('" + aData[2] + "')) !== -1";
					if (iTagIndex === aTags.length - 1) {
						sCondition += ")";
					} else {
						sCondition += " || ";
					}
				});
			} else if (sFilter.includes("avgUtilization")) {
				let aAllUtils = sFilter.split("or");
				aAllUtils.forEach(function (sAllUtil, iAllUtilIndex) {
					if (iAllUtilIndex === 0) {
						sCondition += "(";
					}
					switch (true) {
						case sAllUtil.includes("avgUtilization gt 120"):
							sCondition += "oHeader['avgUtilization'] > 120";
							break;
						case sAllUtil.includes("avgUtilization ge 111 and avgUtilization le 120"):
							sCondition += "(oHeader['avgUtilization'] >= 111 && oHeader['avgUtilization'] <= 120)";
							break;
						case sAllUtil.includes("avgUtilization ge 80 and avgUtilization le 110"):
							sCondition += "(oHeader['avgUtilization'] >= 80 && oHeader['avgUtilization'] <= 110)";
							break;
						case sAllUtil.includes("avgUtilization ge 70 and avgUtilization le 79"):
							sCondition += "(oHeader['avgUtilization'] >= 70 && oHeader['avgUtilization'] <= 79)";
							break;
						case sAllUtil.includes("avgUtilization lt 70"):
							sCondition += "oHeader['avgUtilization'] < 70";
							break;
						default:
							break;
					}
					if (iAllUtilIndex === aAllUtils.length - 1) {
						sCondition += ")";
					} else {
						sCondition += " || ";
					}
				});
			} else if (sFilter.includes("freeHours")) {
				let sHrs = sFilter.match(/\(freeHours ge ([0-9]+)\)/)[1];
				sCondition += "(oHeader['freeHours'] >= " + sHrs + ")";
			}
			if (iFilterIndex !== aRootFilter.length - 1) {
				sCondition += " && ";
			}
		});

		aFilteredHeaders = aHeaders.filter(function (oHeader) {
			return eval(sCondition);
		});

		return aFilteredHeaders;
	}

	function applyAssignmentFilter(oXhr, aAssignments) {
		let aResults = [];
		const resourceID = decodeURIComponent(oXhr.url).match(/(\$filter=resource_ID eq )([^\s]+)/i);

		for (const assignment of aAssignments) {
			if (assignment.resource_ID === resourceID[2]) {
				aResults.push(assignment);
			}
		}
		return aResults;
	}

	/**
	 * Handles GET requests for metadata.
	 * @return {Array} an array with the response information needed by Sinon's respond() function
	 */
	function handleGetMetadataRequests() {
		return [
			200,
			{
				"Content-Type": "application/xml",
				"odata-version": "4.0"
			},
			sMetadata
		];
	}

	function handleGetResOrgRequests() {
		return createResponse(aResourceOrgs, 200, "ResourceOrganizations");
	}

	function handleGetCostCenterRequests() {
		return createResponse(aCostCenters, 200, "ResourceOrganizationCostCenters(costCenterId,resourceOrganizationDisplayId)");
	}

	function handleGetProjectRequests() {
		return createResponse(aProjectsVH, 200, "ProjectsVH(ID,name)");
	}

	function handleGetCustomerRequests() {
		return createResponse(aCustomersVH, 200, "CustomerVH(ID,name)");
	}

	function handleGetProjectRoleRequests() {
		return createResponse(aProjectRolesVH, 200, "ProjectRoles(projectRole_ID,name)");
	}

	function handleGetReferenceObject() {
		return createResponse(aReferenceObjects, 200, "ReferenceObject(ID,displayId,name)");
	}

	function handleGetReferenceObjectType() {
		for (let i = 0; i < aReferenceObjectTypes.length; i++) {
			aReferenceObjectTypes[i].code = Number(aReferenceObjectTypes[i].code);
		}
		return createResponse(aReferenceObjectTypes, 200, "ReferenceObjectType(code,name)");
	}

	function handleGetWorkerTypeRequests() {
		return createResponse(aWorkerTypesVH, 200, "WorkerTypesVH(workerTypeName,workerTypeDescription)");
	}

	function handleGetRequestRequests() {
		return createResponse(aRequestsVH, 200, "RequestsVH(Id,displayId,name,projectId,projectName,projectRoleName,processingResourceOrganizationId,processingResourceOrganizationName,customerId,customerName,requestedCapacityInHours,startDate,endDate)");
	}

	function handleGetResourceDetailRequests() {
		return createResponse(aResourceDetails, 200, "ResourceDetails(resource_ID,firstName,lastName,fullName)");
	}

	function handleGetHeaderRequests(oXhr) {
		let aResult = applyHeadersFilter(oXhr, aHeaders);
		aResult = applySort(oXhr, aResult);
		aResult = applySkipTop(oXhr, aResult);
		return createResponse(aResult, 200, "capacityGridHeader");
	}

	function handleResourceQuickView(oXhr) {
	    let aResult = [];
		let sUrl = decodeURI(oXhr.url);
		for (let i=0;i<aHeaders.length;i++){
			if(sUrl.includes(aHeaders[i].ID)){
				aHeaders[i].managerDetails = {
					"managerName":aHeaders[i].managerName
				};
				aResult.push(aHeaders[i]);
				return createResponse(aResult, 200, "capacityGridHeader");
			}
		}

	}

	function handleGetMonthlyUtilsRequests() {
		return createResponse(aMonthlyUtils, 200, "capacityGridMonthlyUtilization");
	}

	function handleGetDailyUtilsRequests() {
		return createResponse(aDailyUtils, 200, "capacityGridDailyUtilization");
	}

	function handleGetWeeklyUtilsRequests() {
		return createResponse(aWeeklyUtils, 200, "capacityGridWeeklyUtilizationTemporal");
	}

	function handleGetAssignmentsMonthlyRequests(oXhr) {
		let aResult = applyAssignmentFilter(oXhr, aMonthlyAssignments);
		return createResponse(aResult, 200, "AssignmentsDetailsForCapacityGrid(monthlyAggregatedAssignments())");
	}

	function handleGetAssignmentsDailyRequests(oXhr) {
		let aResult = applyAssignmentFilter(oXhr, aDailyAssignments);
		return createResponse(aResult, 200, "AssignmentsDetailsForCapacityGrid(dailyAssignments())");
	}

	function handleGetAssignmentsWeeklyRequests(oXhr) {
		let aResult = applyAssignmentFilter(oXhr, aWeeklyAssignments);
		return createResponse(aResult, 200, "AssignmentsDetailsForCapacityGrid(dailyAssignments())");
	}

	function handleGetRequestDetailsForAsssignmentRequests() {
		return createResponse(aRequestDetailsForEachAssignment, 200, "RequestDetailsForEachAssignment");
	}

	function handleGetHeaderKPIsRequests() {
		return createResponse(aHeaderKPIs, 200, "capacityGridHeaderKPI");
	}

	function trackRequest(oXhr) {
		let oRequest = {
			url: decodeURI(oXhr.url),
			requestBody: oXhr.requestBody ? JSON.parse(oXhr.requestBody) : null
		};
		aRequests.push(oRequest);
		console.dir(oRequest); // filter your console by "object" to view the request data
	}

	/**
	 * Builds a response to direct (= non-batch) requests.
	 * Supports GET, PATCH, DELETE and POST requests.
	 * @param {Object} oXhr - the Sinon fake XMLHttpRequest
	 * @return {Array} an array with the response information needed by Sinon's respond() function
	 */
	function handleDirectRequest(oXhr) {
		let aResponse;
		let oBody;

		trackRequest(oXhr);
		if (oErrorOnNextRequest && !oErrorOnNextRequest.batch) {
			let bFailOnlyTargetedRequest = isTargetedRequestForFail(oXhr,oErrorOnNextRequest.target);
		    if(bFailOnlyTargetedRequest){
			aResponse = handleTestError(oXhr, oErrorOnNextRequest.code,oErrorOnNextRequest.target);
			oErrorOnNextRequest.count--;
			if (oErrorOnNextRequest.count === 0) {
				oErrorOnNextRequest = null;
			}
			return aResponse;
		}
		}

		switch (oXhr.method) {
			case "GET":
				if (/\$metadata/.test(oXhr.url)) {
					aResponse = handleGetMetadataRequests();
				} else if (/ResourceOrganizations.*\?/.test(oXhr.url)) {
					aResponse = handleGetResOrgRequests();
				} else if (/ResourceOrganizationCostCenters.*\?/.test(oXhr.url)) {
					aResponse = handleGetCostCenterRequests();
				} else if (/WorkerTypesVH.*\?/.test(oXhr.url)) {
					aResponse = handleGetWorkerTypeRequests();
				} else if (/ProjectsVH.*\?/.test(oXhr.url)) {
					aResponse = handleGetProjectRequests();
				} else if (/CustomerVH.*\?/.test(oXhr.url)) {
					aResponse = handleGetCustomerRequests();
				} else if (/ProjectRoles.*\?/.test(oXhr.url)) {
					aResponse = handleGetProjectRoleRequests();
				} else if (/RequestsVH.*\?/.test(oXhr.url)) {
					aResponse = handleGetRequestRequests();
				}else if (/ReferenceObjectType.*\?/.test(oXhr.url)) {
					aResponse = handleGetReferenceObjectType();
				} else if (/ReferenceObject.*\?/.test(oXhr.url)) {
					aResponse = handleGetReferenceObject();
				}  else if (/ResourceDetails.*\?/.test(oXhr.url)) {
					aResponse = handleGetResourceDetailRequests();
				} else if (/capacityGridHeaderKPITemporal.*\?/.test(oXhr.url)) {
					aResponse = handleGetHeaderKPIsRequests();
				}else if (/capacityGridHeaderTemporal.*\?/.test(oXhr.url) &&  oXhr.url.includes("&$filter=ID")) {
					aResponse = handleResourceQuickView(oXhr);
				}else if (/capacityGridHeaderTemporal.*\?/.test(oXhr.url)) {
					aResponse = handleGetHeaderRequests(oXhr);
				} else if (/capacityGridMonthlyUtilizationTemporal.*\?/.test(oXhr.url)) {
					aResponse = handleGetMonthlyUtilsRequests();
				} else if (/capacityGridDailyUtilization.*\?/.test(oXhr.url)) {
					aResponse = handleGetDailyUtilsRequests();
				} else if (/capacityGridWeeklyUtilizationTemporal.*\?/.test(oXhr.url)) {
					aResponse = handleGetWeeklyUtilsRequests();
				} else if (/AssignmentsDetailsForCapacityGrid\?\$expand=monthlyAggregatedAssignments.*/.test(oXhr.url)) {
					aResponse = handleGetAssignmentsMonthlyRequests(oXhr);
				} else if (/AssignmentsDetailsForCapacityGrid\?\$expand=dailyAssignments.*/.test(oXhr.url)) {
					aResponse = handleGetAssignmentsDailyRequests(oXhr);
				} else if (/AssignmentsDetailsForCapacityGrid\?\$expand=weeklyAggregatedAssignments.*/.test(oXhr.url)) {
					aResponse = handleGetAssignmentsWeeklyRequests(oXhr);
				} else if (/RequestDetailsForEachAssignment.*\?/.test(oXhr.url)) {
					aResponse = handleGetRequestDetailsForAsssignmentRequests();
				} else {
					aResponse = handleUnknownUrl(oXhr);
				}
				break;

			case "HEAD":
				aResponse = handleHeadQuery();
				break;

			case "PATCH":
				oBody = JSON.parse(oXhr.requestBody);
				if (/AssignmentsDetailsForCapacityGrid/.test(oXhr.url) && oBody.action === 0) { // UPDATE
					aResponse = handlePatchAssignmentsDetails(oXhr);
				} else if (/AssignmentsDetailsForCapacityGrid/.test(oXhr.url) && oBody.action === 1) { // CREATE
					aResponse = handlePatchAssignmentsDetails(oXhr);
				} else if (/AssignmentsDetailsForCapacityGrid/.test(oXhr.url) && oBody.action === 2) { // ACTIVATE
					aResponse = handlePatchAssignmentsDetails(oXhr);
				} else if (/AssignmentsDetailsForCapacityGrid/.test(oXhr.url) && oBody.action === 3) { // DELETE
					aResponse = handlePatchAssignmentsDetails(oXhr);
				} else if (/AssignmentsDetailsForCapacityGrid/.test(oXhr.url) ) { // NONE
					aResponse = handlePatchAssignmentsDetails(oXhr);
				} else if (/AssignmentBucketsYearMonthAggregate/.test(oXhr.url)) {
					aResponse = handlePatchAssignmentBucketsMonthly(oXhr);
				} else if (/AssignmentBucketsYearWeekAggregate/.test(oXhr.url)) {
					aResponse = handlePatchAssignmentBucketsWeekly(oXhr);
				} else if (/AssignmentBucketsPerDay/.test(oXhr.url)) {
					aResponse = handlePatchAssignmentBucketsDaily(oXhr);
				} else {
					aResponse = handleUnknownUrl(oXhr);
				}
				break;
				
			case "POST":
				if (/AssignmentsDetailsForCapacityGrid/.test(oXhr.url)) {
					aResponse = handleCreateAssignment(oXhr);
				}
				break;

			case "DELETE":
				if (/AssignmentsDetailsForCapacityGrid/.test(oXhr.url)) {
					aResponse = handleDeleteAssignment(oXhr);
				}
				break;

			default:
				aResponse = handleUnknownUrl(oXhr);
				break;
		}

		return aResponse;
	}

	function isTargetedRequestForFail(oXhr,sInputTarget){
		let sUrlTarget;
		let bFailOnlyTargetedRequest =true;
		if (oXhr.method !== "GET") {
			sUrlTarget = oXhr.url.match(/=(.*),/)?oXhr.url.match(/=(.*),/).pop():null;
			if (!sUrlTarget) {
				sUrlTarget = oXhr.url.match(/\(([^)]*)\)/)?oXhr.url.match(/\(([^)]*)\)/).pop():null;
			}
		}
		if(oXhr.method !== "POST" && sInputTarget && sInputTarget !== sUrlTarget){
			bFailOnlyTargetedRequest =false
		}
		return bFailOnlyTargetedRequest;
	}

	function handleTestError(oXhr, iStatusCode,sTarget) {
		if (!iStatusCode) {
			iStatusCode = 500;
		}
		if (iStatusCode === 406) {
			return createResponse(
				{
					error: {
						code: "406",
						message: "Cost center 0010101902 is not assigned to service org Service Organization - Company DE.,",
						"@Core.ContentID": "0.0",
						target: "188bb8e8-5f04-4503-973a-773ef0fccc00",
						"@Common.numericSeverity": 4
					}
				},
				406
			);
		} else {
			if (oXhr.method !== "GET" && !sTarget) {
				sTarget = oXhr.url.match(/=(.*),/)?oXhr.url.match(/=(.*),/).pop():null;
				if (!sTarget) {
					sTarget = oXhr.url.match(/\(([^)]*)\)/)?oXhr.url.match(/\(([^)]*)\)/).pop():null;
				}
			}
			return createResponse(
				{
					error: {
						code: iStatusCode,
						message: "test error " + iStatusCode + " from mockserver",
						target:sTarget
					}
				},
				iStatusCode
			);
		}
	}

	function handleUnknownUrl(oXhr) {
		return [500, {}, "unknown url " + oXhr.url];
	}

	/**
	 * Builds a response to batch requests.
	 * Unwraps batch request, gets a response for each individual part and
	 * constructs a fitting batch response.
	 * @param {Object} oXhr - the Sinon fake XMLHttpRequest
	 * @return {Array} an array with the response information needed by Sinon's respond() function
	 */
	function handleBatchRequest(oXhr) {
		let aResponse;
		let sResponseBody = "";
		let bErrorEncountered =false;
		let sOuterBoundary = oXhr.requestBody.match(/(.*)/)[1]; // First line of the body
		let aOuterParts = oXhr.requestBody.split(sOuterBoundary).slice(1, -1); // The individual requests
		let createStandAloneResponse = function(sPart,iIndex,sPartBoundary,bMultipleRequest){
			let aMatches = sPart.match(/(GET|DELETE|PATCH|POST) (\S+)(?:.|\r?\n)+\r?\n(.*)\r?\n$/);
			let aPartResponse = handleDirectRequest({
				method: aMatches[1],
				url: getBaseUrl(oXhr.url) + aMatches[2],
				requestBody: aMatches[3]
			});
			if(aPartResponse[0] >=400){
				bErrorEncountered = true;
			}
			sResponseBody += sPartBoundary + "\r\n" + "Content-Type: application/http\r\n";
			// If there are several change sets, we need to add a Content ID header
			if(bMultipleRequest){
			sResponseBody += "Content-ID:" + iIndex + ".0\r\n";
			}
			sResponseBody += "\r\nHTTP/1.1 " + aPartResponse[0] + "\r\n";
			// Add any headers from the request - unless this response is 204 (no content)
			if (aPartResponse[1] && aPartResponse[0] !== 204) {
				for (let sHeader in aPartResponse[1]) {
					if (Object.prototype.hasOwnProperty.call(aPartResponse[1], sHeader)) {
						sResponseBody += sHeader + ": " + aPartResponse[1][sHeader] + "\r\n";
					}
				}
			}
			if(aPartResponse[3] && aPartResponse[3]["sap-messages"]){
				sResponseBody += "sap-messages:" +JSON.stringify(aPartResponse[3]["sap-messages"])+ "\r\n";
			}
			sResponseBody += "\r\n";
			if (aPartResponse[2]) {
				sResponseBody += aPartResponse[2];
			}
			sResponseBody += "\r\n";
		}
	   // Under each batch there can be multiple requests under same changesets/requests per changest.
	   // Based on the changesets construct the response in the desired oData format.
        for(let i=0;i<aOuterParts.length;i++){
		let aOuterPartsMatch = aOuterParts[i].match(/multipart\/mixed;boundary=(.+)/);
		if (aOuterPartsMatch && aOuterPartsMatch.length > 0) {
			let sInnerBoundary = aOuterPartsMatch[1];
			let aParts = aOuterParts[i].split("--" + sInnerBoundary).slice(1, -1);
			sResponseBody += sOuterBoundary + "\r\n" ;
			let sPartBoundary = "--" + sInnerBoundary;
			sResponseBody += "Content-Type: multipart/mixed; boundary=" + sInnerBoundary + "\r\n\r\n";
			aParts.forEach(function (sPart, iIndex) {
			//    fail all subsequent request on error.
				if(bErrorEncountered){
					return;
				}
				createStandAloneResponse(sPart,iIndex,sPartBoundary,true);
			});
			sResponseBody += sPartBoundary + "\r\n";
		} else{
			 // fail all subsequent request on error.
			if(bErrorEncountered){
				break;
			}
			let sPart = aOuterParts[i];
				// Construct the batch response body out of the single batch request parts.
				// The RegExp looks for a request body at the end of the string, framed by two line breaks.
				createStandAloneResponse(sPart,null,sOuterBoundary,false);
		
		}

		
	}
		sResponseBody += sOuterBoundary + "--";
		// Build the final batch response
		let iStatusCode;
		if (oErrorOnNextRequest && oErrorOnNextRequest.batch) {
			iStatusCode = oErrorOnNextRequest.code;
			oErrorOnNextRequest.count--;
			if (oErrorOnNextRequest.count === 0) {
				oErrorOnNextRequest = null;
			}
		} else {
			iStatusCode = 200;
		}
		aResponse = [
			iStatusCode,
			{
				"Content-Type": "multipart/mixed;boundary=" + sOuterBoundary.slice(2),
				"OData-Version": "4.0"
			},
			sResponseBody
		];
		return aResponse;
	}

	/**
	 * Handles any type of intercepted request and sends a fake response.
	 * Logs the request and response to the console.
	 * Manages batch requests.
	 * @param {Object} oXhr - the Sinon fake XMLHttpRequest
	 */
	function handleAllRequests(oXhr) {
		let aResponse;

		// Log the request
		Log.info(
			"Mockserver: Received " + oXhr.method + " request to URL " + oXhr.url,
			(oXhr.requestBody ? "Request body is:\n" + oXhr.requestBody : "No request body.") + "\n",
			sLogComponent
		);

		if (oXhr.method === "POST" && /\$batch$/.test(oXhr.url)) {
			aResponse = handleBatchRequest(oXhr);
		} else {
			aResponse = handleDirectRequest(oXhr);
		}

		oXhr.respond(aResponse[0], aResponse[1], aResponse[2]);

		// Log the response
		Log.info(
			"Mockserver: Sent response with return code " + aResponse[0],
			"Response headers: " + JSON.stringify(aResponse[1]) + "\n\nResponse body:\n" + aResponse[2] + "\n",
			sLogComponent
		);
	}

	function handleHeadQuery() {
		return [
			200,
			{
				"OData-Version": "4.0"
			},
			""
		];
	}

	function getNumberOfDays(iMonth) {
		if (iMonth === 1 || iMonth === 3 || iMonth === 5 || iMonth === 7 || iMonth === 8 || iMonth === 10 || iMonth === 12) {
			return 31;
		} else if (iMonth === 2) {
			return 28;
		}

		return 30;
	}

	function getWeekNo(oDate) {
		oDate.setHours(0, 0, 0);
		oDate.setDate(oDate.getDate() + 4 - (oDate.getDay() || 7));
		let calendarWeek = Math.ceil(((oDate - new Date(oDate.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7);

		return calendarWeek;
	}

	function convertCSVToJSON(csv, sBaseCalMonth, sView) {
		// remove any unnecessary EOL characters and split the CSV into individual lines
		let lines = csv.replace(/\r/g, "").split("\n");
		let result = [];
		// console.log(sView);
		let headers = lines[0].split(",");
		let today = new Date();
		let oToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		let currentYear = today.getUTCFullYear();
		let currentMonth = today.getUTCMonth();
		let currentDate = today.getUTCDate();
		let currentWeek = getWeekNo(oToday) - 1;
		let iMonthDiff = 0;
		let iDateDiff = 0;
		let iWeekDiff = 0;
		if (sBaseCalMonth) {
			let iBaseMonth = parseInt(sBaseCalMonth.substr(4, 2), 10);
			let iBaseYear = parseInt(sBaseCalMonth.substr(0, 4), 10);
			let iBaseWeek = parseInt(sBaseCalMonth.substr(4, 2), 10);
			if (sView === "Monthly") {
				iMonthDiff = (currentYear - iBaseYear) * 12 + (currentMonth - iBaseMonth);
			}
			if (sView === "Daily") {
				let iBaseDate = parseInt(sBaseCalMonth.substr(6, 2), 10);
				iDateDiff = currentDate - iBaseDate;
			}
			if (sView === "Weekly") {
				iWeekDiff = (currentYear - iBaseYear) * 52 + (currentWeek - iBaseWeek);
			}
		}
		for (let i = 1; i < lines.length; i++) {
			let obj = {};
			let currentline = lines[i].split(",");
			for (let j = 0; j < headers.length; j++) {
				if (sBaseCalMonth && (headers[j].indexOf("timePeriod") !== -1 || headers[j].indexOf("CALMONTH") !== -1)) {
					if (sView === "Daily") {
						let iMonthInCSV = parseInt(currentline[j].substr(3, 2), 10);
						let iYearInCSV = parseInt(currentline[j].substr(6, 4), 10);
						let iDateInCSV = parseInt(currentline[j].substr(0, 2), 10);
						let targetMonth = iMonthInCSV + iMonthDiff;
						let targetYear = iYearInCSV + Math.floor(targetMonth / 12);

						let targetDate = iDateInCSV + iDateDiff;
						targetMonth = targetMonth + Math.floor(targetDate / getNumberOfDays(targetMonth));
						targetMonth = (targetMonth % 12) + 1;
						targetDate = targetDate % getNumberOfDays(targetMonth);
						targetMonth = targetMonth < 10 ? 0 + targetMonth.toString() : targetMonth.toString();
						targetDate = targetDate < 10 ? 0 + targetDate.toString() : targetDate.toString();
						obj[headers[j]] = targetYear + "-" + targetMonth + "-" + targetDate;
					} else if (sView === "Monthly") {
						let iMonthInCSV = parseInt(currentline[j].substr(4, 2), 10);
						let iYearInCSV = parseInt(currentline[j].substr(0, 4), 10);
						let targetMonth = iMonthInCSV + iMonthDiff;
						let targetYear = iYearInCSV + Math.floor(targetMonth / 12);
						targetMonth = (targetMonth % 12) + 1;
						targetMonth = targetMonth < 10 ? 0 + targetMonth.toString() : targetMonth.toString();
						obj[headers[j]] = targetYear + targetMonth;
					} else if (sView === "Weekly") {
						let iWeekInCSV = parseInt(currentline[j].substr(4, 2), 10);
						let iYearInCSV = parseInt(currentline[j].substr(0, 4), 10);
						let targetWeek = iWeekInCSV + iWeekDiff;
						let targetYear = iYearInCSV + Math.floor(targetWeek / 52);
						targetWeek = (targetWeek % 52) + 1;
						targetWeek = targetWeek < 10 ? 0 + targetWeek.toString() : targetWeek.toString();
						obj[headers[j]] = targetYear + targetWeek;
					}
				} else {
					if (currentline[j] === "TRUE") currentline[j] = true;
					if (currentline[j] === "FALSE") currentline[j] = false;
					if (headers[j].indexOf("assignmentDurationInHours") !== -1) currentline[j] = parseInt(currentline[j]);
					if (headers[j].indexOf("availableHours") !== -1) currentline[j] = parseInt(currentline[j]);
					if (headers[j].indexOf("freeHours") !== -1) currentline[j] = parseInt(currentline[j]);
					if (headers[j].indexOf("utilization") !== -1) currentline[j] = parseInt(currentline[j]);
					obj[headers[j]] = currentline[j];
				}
			}
			result.push(obj);
		}

		return result;
	}

	function mergeMonthlyAssignmentExpand() {
		if (aAssignmentsHeader && aMonthlyAssignmentsLineItems && aAssignmentsHeader.length > 0 && aMonthlyAssignmentsLineItems.length > 0) {
			// arrays are really filled with data crom CSV
			// eslint-disable-next-line no-sequences
			let headerAssignmentMap = aAssignmentsHeader.reduce((map, header) => ((map[header.assignment_ID] = header), map), {});
			aMonthlyAssignmentsLineItems.reduce(
				(map, lineItem) => (
					!headerAssignmentMap[lineItem.assignment_ID].monthlyAggregatedAssignments
						? (headerAssignmentMap[lineItem.assignment_ID].monthlyAggregatedAssignments = [])
						// eslint-disable-next-line no-sequences
						: null,
						headerAssignmentMap[lineItem.assignment_ID].monthlyAggregatedAssignments.push(lineItem),
						headerAssignmentMap
				),
				{}
			);
			aMonthlyAssignments = [];
			// eslint-disable-next-line no-unused-vars
			for (const [key, value] of Object.entries(headerAssignmentMap)) {
				aMonthlyAssignments.push(value);
			}
		}
	}

	function mergeDailyAssignmentExpand() {
		if (aAssignmentsHeader && aDailyAssignmentsLineItems && aAssignmentsHeader.length > 0 && aDailyAssignmentsLineItems.length > 0) {
			// arrays are really filled with data crom CSV
			// eslint-disable-next-line no-sequences
			let headerAssignmentMap = aAssignmentsHeader.reduce((map, header) => ((map[header.assignment_ID] = header), map), {});
			aDailyAssignmentsLineItems.reduce(
				(map, lineItem) => (
					!headerAssignmentMap[lineItem.assignment_ID].dailyAssignments ? (headerAssignmentMap[lineItem.assignment_ID].dailyAssignments = [])
						// eslint-disable-next-line no-sequences
						: null,
						headerAssignmentMap[lineItem.assignment_ID].dailyAssignments.push(lineItem),
						headerAssignmentMap
				),
				{}
			);
			aDailyAssignments = [];
			// eslint-disable-next-line no-unused-vars
			for (const [key, value] of Object.entries(headerAssignmentMap)) {
				aDailyAssignments.push(value);
			}
		}
	}

	function mergeWeeklyAssignmentExpand() {
		if (aAssignmentsHeader && aWeeklyAssignmentsLineItems && aAssignmentsHeader.length > 0 && aWeeklyAssignmentsLineItems.length > 0) {
			// arrays are really filled with data crom CSV
			// eslint-disable-next-line no-sequences
			let headerAssignmentMap = aAssignmentsHeader.reduce((map, header) => ((map[header.assignment_ID] = header), map), {});
			aWeeklyAssignmentsLineItems.reduce(
				(map, lineItem) => (
					!headerAssignmentMap[lineItem.assignment_ID].weeklyAggregatedAssignments
						? (headerAssignmentMap[lineItem.assignment_ID].weeklyAggregatedAssignments = [])
						// eslint-disable-next-line no-sequences
						: null,
						headerAssignmentMap[lineItem.assignment_ID].weeklyAggregatedAssignments.push(lineItem),
						headerAssignmentMap
				),
				{}
			);
			aWeeklyAssignments = [];
			// eslint-disable-next-line no-unused-vars
			for (const [key, value] of Object.entries(headerAssignmentMap)) {
				aWeeklyAssignments.push(value);
			}
		}
	}

	function handlePatchAssignmentsDetails(oXhr) {
		let reqBody = JSON.parse(oXhr.requestBody);
		return createResponse(
			{
				"@odata.context": "$metadata#AssignmentsDetailsForCapacityGrid/$entity",
				"@odata.metadataEtag": "W/\"f16458d498836254282accc9f2973cc96d589c993bf1f7df20492e4df1a773e1\"",
				assignmentStatusCode: reqBody.assignmentStatusCode,
				action: reqBody.action
			},
			200,
			null,
			oXhr
		);
	}

	function handlePatchAssignmentBucketsMonthly(oXhr) {
		let reqBody = JSON.parse(oXhr.requestBody);
		return createResponse(
			{
				"@odata.context": "$metadata#AssignmentBucketsYearMonthAggregate/$entity",
				"@odata.metadataEtag": "W/\"f16458d498836254282accc9f2973cc96d589c993bf1f7df20492e4df1a773e1\"",
				assignment_ID: oXhr.url.match(/=(.*),/).pop(),
				timePeriod: oXhr.url.match(/'(.*)'/).pop(),
				startDate: reqBody.startDate,
				endDate: reqBody.endDate,
				action: reqBody.action,
				bookedCapacityInHours: reqBody.bookedCapacityInHours,
			},
			200,
			null,
			oXhr
		);
	}

	function handlePatchAssignmentBucketsWeekly(oXhr) {
		let reqBody = JSON.parse(oXhr.requestBody);
		return createResponse(
			{
				"@odata.context": "$metadata#AssignmentBucketsYearWeekAggregate/$entity",
				"@odata.metadataEtag": "W/\"f16458d498836254282accc9f2973cc96d589c993bf1f7df20492e4df1a773e1\"",
				assignment_ID: oXhr.url.match(/=(.*),/).pop(),
				timePeriod: oXhr.url.match(/'(.*)'/).pop(),
				startDate: reqBody.startDate,
				endDate: reqBody.endDate,
				action: reqBody.action,
				bookedCapacityInHours: reqBody.bookedCapacityInHours
			},
			200,
			null,
			oXhr
		);
	}

	function handlePatchAssignmentBucketsDaily(oXhr) {
		let reqBody = JSON.parse(oXhr.requestBody);
		return createResponse(
			{
				"@odata.context": "$metadata#AssignmentBucketsPerDay/$entity",
				"@odata.metadataEtag": "W/\"f16458d498836254282accc9f2973cc96d589c993bf1f7df20492e4df1a773e1\"",
				assignment_ID: oXhr.url.match(/=(.*),/).pop(),
				timePeriod: oXhr.url.match(/'(.*)'/).pop(),
				date: reqBody.date,
				action: reqBody.action,
				bookedCapacityInHours: reqBody.bookedCapacityInHours
			},
			200,
			null,
			oXhr
		);
	}

	function handleCreateAssignment(oXhr, sTest) {
		let oAssignment = applyAssignmentFilterByRequestId(oXhr);
		let oResponse = {
			"@odata.context": "$metadata#AssignmentsDetailsForCapacityGrid/$entity"
		};
		oResponse = Object.assign(oResponse, oAssignment);
		return createResponse(oResponse, 201,null,oXhr);
	}

	function applyAssignmentFilterByRequestId(oXhr) {
		let sRequestID = JSON.parse(oXhr.requestBody).resourceRequest_ID;
		for (let oAssignment of aMonthlyAssignments) {
			if (oAssignment.resourceRequest_ID === sRequestID) {
				return oAssignment;
			}
		}
	}

	function handleDeleteAssignment (oXhr){
		return createResponse(oXhr, 201,null,oXhr);
	}

});