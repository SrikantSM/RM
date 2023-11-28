sap.ui.define([
    'resourceRequestLibrary/resourceRequestLibrary/controller/ResourceQuickView',
    "sap/ui/thirdparty/sinon",
    "sap/ui/model/json/JSONModel",
    "resourceRequestLibrary/resourceRequestLibrary/test/unit/helper/FakeI18nModel"
], function (ResourceQuickView, sinon, JSONModel, FakeI18nModel) {

    var oEmployee;
    var oi18nModel;
    var expectedResultData;

    QUnit.module('Contact Card QUnit | ResourceQuickView',{

        before: function () {
            oEmployee = {
                fullName:"Paul Singh",
                titleUrl: "http://localhost:9876/context.htmlfake_url",
                role:"Developer",
                externalID: "paul.singh",
                // firstName:"Paul",
                // lastName:"Singh",
                workerType:{
                    name:"Employee"
                },
                mobilePhoneNumber:"+91-9999999999",
                emailAddress:"paul.singh@sap.corp",
                // eslint-disable-next-line camelcase
                country_name:"India",
                resourceOrg:"Delivery Org(India)",
                resourceOrgCode: "1010",
                costCenterID:"CCIN",
                costCenterDesc: "CCIN (CCIN)",
                workforcePersonID: 'someGuid',
                initials: 'consultant initials',
                toManager:{
                    managerFullName:"Diane Jobs (diane.jobs)"
                }
            };
            const oi18nModelData = {
                RESOURCE: "Resource",
                ORGANIZATIONAL_INFORMATION:"Organizational Information",
                WORKER_TYPE:"Worker Type",
                RESOURCE_ORGANIZATION:"Resource Organization",
                COST_CENTER:"Cost Center",
                MANAGER:"Manager",
                CONTACT_INFORMATION:"Contact Information",
                MOBILE:"Mobile",
                EMAIL:"Email",
                OFFICE_LOCATION:"Office Location"
            };
            oi18nModel = new FakeI18nModel(oi18nModelData);
            expectedResultData = {
                "pages": [{
                    "pageId": "employeePageId",
                    "header": oi18nModelData.RESOURCE,
                    "icon": `../staffResourceRequest/odata/v4/ProcessResourceRequestService/ConsultantProfileHeaders(${oEmployee.workforcePersonID})/profilePhoto/profileThumbnail`,
                    "title": oEmployee.fullName + ' (' + oEmployee.externalID + ')',
                    "description": oEmployee.role,
                    "initials": oEmployee.initials,
                    "groups": [
                        {
                            "heading": oi18nModelData.ORGANIZATIONAL_INFORMATION,
                            "elements": [{
                                "label": oi18nModelData.WORKER_TYPE,
                                "value": oEmployee.workerType.name
                            },
                            {
                                "label": oi18nModelData.RESOURCE_ORGANIZATION,
                                "value": oEmployee.resourceOrg + ' (' + oEmployee.resourceOrgCode + ') '
                            },
                            {
                                "label": oi18nModelData.COST_CENTER,
                                "value": oEmployee.costCenterDesc
                            },
                            {
                                "label": oi18nModelData.MANAGER,
                                "value": oEmployee.toManager.managerFullName
                            }
                            ]
                        },
                        {
                            "heading": oi18nModelData.CONTACT_INFORMATION,
                            "elements": [{
                                "label": oi18nModelData.MOBILE,
                                "value": oEmployee.mobilePhoneNumber,
                                "elementType": "phone"
                            },
                            {
                                "label": oi18nModelData.EMAIL,
                                "value": oEmployee.emailAddress,
                                "emailSubject": "Subject",
                                "elementType": "email"

                            },
                            {
                                "label": oi18nModelData.OFFICE_LOCATION,
                                "value": oEmployee.country_name
                            }
                            ]
                        }
                    ]
                }]
            };
        }});

    QUnit.test('Test getResourcePopupModel when navigation not allowed', async function (assert) {
        let oCut = new ResourceQuickView();
        let stub = sinon.stub(oCut, "getNavigationHash");
        stub.returns(false);
        const expectedResult = new JSONModel();
        const observedResult = await oCut.getResourcePopupModel(oEmployee, oi18nModel, true);
        expectedResult.setData(expectedResultData);
        assert.deepEqual(observedResult.oData, expectedResult.oData);
    });

    QUnit.test('Test getResourcePopupModel when navigation allowed', async function (assert) {
        let oCut = new ResourceQuickView();
        let stub = sinon.stub(oCut, "getNavigationHash");
        stub.returns("fake_url");

        const expectedResult = new JSONModel();
        expectedResultData["pages"][0]["titleUrl"] = oEmployee.titleUrl;
        const observedResult = await oCut.getResourcePopupModel(oEmployee, oi18nModel, true);
        expectedResult.setData(expectedResultData);
        assert.deepEqual(observedResult.oData, expectedResult.oData);
    });

    // QUnit.test('Test getResourcePopupModel when manager details are not passed', async function (assert) {
    // 	let oCut = new ResourceQuickView();
    // 	let stub = sinon.stub(oCut, "getNavigationHash");
    // 	stub.returns("fake_url");

    // 	const expectedResult = new JSONModel();
    // 	// Remove manager data for input.
    // 	oEmployee.toManager = null;
    // 	// expected result should have manager name as '-'
    // 	expectedResultData.pages[0].groups[1].elements[2].value = "-";
    // 	const observedResult = await oCut.getResourcePopupModel(oEmployee, oi18nModel, true);
    // 	expectedResult.setData(expectedResultData);
    // 	assert.deepEqual(observedResult.oData, expectedResult.oData);
    // });

    QUnit.test('Test getNavigationHash when navigation not allowed', async function (assert) {
        sap.ushell = {
            Container : {
                getService : function (sService) {
                    return {
                        isNavigationSupported : async function (oIntent) {
                            return new Promise( (resolve, reject) => {
                                resolve([{supported: false}]);
                            });
                        }
                    };
                }
            }
        };

        let oCut = new ResourceQuickView();
        const observedResult = await oCut.getNavigationHash("dummyID");
        assert.deepEqual(observedResult, false);
    });

    QUnit.test('Test getNavigationHash when navigation allowed', async function (assert) {
        sap.ushell = {
            Container : {
                getService : function (sService) {
                    return {
                        isNavigationSupported : async function (oIntent) {
                            return new Promise( (resolve, reject) => {
                                resolve([{supported: true}]);
                            });
                        },
                        hrefForExternal : function (oIntent) {
                            return "dummyID";
                        }
                    };
                }
            }
        };

        let oCut = new ResourceQuickView();
        const observedResult = await oCut.getNavigationHash("dummyID");
        assert.deepEqual(observedResult, "dummyID");
    });
}
);
