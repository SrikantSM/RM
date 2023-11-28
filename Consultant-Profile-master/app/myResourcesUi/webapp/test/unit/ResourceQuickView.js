sap.ui.define([
    "myResourcesUi/controller/ResourceQuickView",
    "sap/ui/thirdparty/sinon",
    "sap/ui/model/json/JSONModel",
    "myResourcesUi/test/unit/helper/FakeI18nModel"
], function (ResourceQuickView, sinon, JSONModel, FakeI18nModel) {
    "use strict";
    var oEmployee;
    var resourceID;
    var oi18nModel;
    var expectedResultData;
    var oEmployeeNull;
    var expectedEmptyData;

    QUnit.module('My Resources Contact Card Qunit',{

        before: function () {
            oEmployee = {
                name:"Test User (test.user)",
                titleUrl: "dummy_url",
                role:"Senior Consultant",
                firstName:"Test",
                lastName:"User",
                mobilePhoneNumber:"+91-9999999999",
                emailAddress:"test.user@sap.corp",
                officeLocation:"India",
                resourceOrg:"Resource Org(India)",
                costCenter:"CCIN",
                costCenterDescription: "CCIN",
                ID: "someGuid",
                initials: 'TU',
                workerType: {
                    name: 'External Worker'
                },
                toManager: {
                    managerName: 'Test User (employee ID)'
                }
            };
            oEmployeeNull = {
                name:"",
                role:"",
                firstName:"",
                lastName:"",
                mobilePhoneNumber:"",
                emailAddress:"",
                officeLocation:"",
                resourceOrg:"",
                costCenter:"",
                costCenterDescription:"",
                ID: "",
                initials: '',
                workerType: {
                    name: ''
                },
                toManager: {
                    managerName: ''
                }
            };
            var oi18nModelData = {
                QUICKVIEW_TITLE: "Resource",
                CONTACT_INFORMATION:"Contact Information",
                FIRST_NAME:"First Name",
                LAST_NAME:"Last Name",
                MOBILE_NUMBER:"Mobile",
                EMAIL_ID:"Email",
                OFFICE_LOCATION:"Office Location",
                ORGANIZATIONAL_INFORMATION:"Organizational Information",
                RESOURCE_ORGANIZATION:"Resource Organization",
                COST_CENTER:"Cost Center",
                WORKER_TYPE: 'Worker Type',
                MANAGER_NAME: 'Manager'
            };
            oi18nModel = new FakeI18nModel(oi18nModelData);
            expectedResultData = {
                "pages": [{
                    "pageId": "employeePageId",
                    "header": oi18nModelData.QUICKVIEW_TITLE,
                    "title": oEmployee.name,
                    "titleUrl": oEmployee.titleUrl,
                    "description": oEmployee.role,
                    "ID": `../myResourcesUi/odata/v4/MyResourcesService/ProjectExperienceHeader(ID=${oEmployee.ID},IsActiveEntity=true)/profilePhoto/profileThumbnail`,
                    "initials": oEmployee.initials,
                    "groups": [{
                        "heading": oi18nModelData.ORGANIZATIONAL_INFORMATION,
                        "elements": [{
                            "label": oi18nModelData.WORKER_TYPE,
                            "value": oEmployee.workerType.name
                        },
                        {
                            "label": oi18nModelData.RESOURCE_ORGANIZATION,
                            "value": oEmployee.resourceOrg
                        },
                        {
                            "label": oi18nModelData.COST_CENTER,
                            "value": "CCIN (CCIN)"
                        },
                        {
                            "label": oi18nModelData.MANAGER_NAME,
                            "value": oEmployee.toManager.managerName
                        }
                        ]
                    },
                    {
                        "heading": oi18nModelData.CONTACT_INFORMATION,
                        "elements": [{
                            "label": oi18nModelData.MOBILE_NUMBER,
                            "value": oEmployee.mobilePhoneNumber,
                            "elementType": "phone"
                        },
                        {
                            "label": oi18nModelData.EMAIL_ID,
                            "value": oEmployee.emailAddress,
                            "emailSubject": "Subject",
                            "elementType": "email"

                        },
                        {
                            "label": oi18nModelData.OFFICE_LOCATION,
                            "value": oEmployee.officeLocation
                        }
                        ]
                    }
                    ]
                }]
            };

            expectedEmptyData = {
                "pages": [{
                    "pageId": "employeePageId",
                    "header": oi18nModelData.QUICKVIEW_TITLE,
                    "title": "-",
                    "titleUrl":"-",
                    "description": "-",
                    "ID": `../myResourcesUi/odata/v4/MyResourcesService/ProjectExperienceHeader(ID=,IsActiveEntity=true)/profilePhoto/profileThumbnail`,
                    "initials": "-",
                    "groups": [{
                        "heading": oi18nModelData.ORGANIZATIONAL_INFORMATION,
                        "elements": [{
                            "label": oi18nModelData.WORKER_TYPE,
                            "value": "-"
                        },
                        {
                            "label": oi18nModelData.RESOURCE_ORGANIZATION,
                            "value": "-"
                        },
                        {
                            "label": oi18nModelData.COST_CENTER,
                            "value": "-"
                        },
                        {
                            "label": oi18nModelData.MANAGER_NAME,
                            "value": "-"
                        }
                        ]
                    },
                    {
                        "heading": oi18nModelData.CONTACT_INFORMATION,
                        "elements": [{
                            "label": oi18nModelData.MOBILE_NUMBER,
                            "value": "-",
                            "elementType": "phone"
                        },
                        {
                            "label": oi18nModelData.EMAIL_ID,
                            "value": "-",
                            "emailSubject": "Subject",
                            "elementType": "email"
                        },
                        {
                            "label": oi18nModelData.OFFICE_LOCATION,
                            "value": "-"
                        }
                        ]
                    }
                    ]
                }]
            };
        }});

    QUnit.test('Test quickViewPopupModel', async function (assert) {
        var oCut = new ResourceQuickView();
        let stub = sinon.stub(oCut, "onNavigatetoResourceObjectPage");
        stub.returns("dummy_url");
        var expectedResult = new JSONModel();
        var observedResult = await oCut.getResourcePopupModel(oEmployee, resourceID, oi18nModel);
        expectedResult.setData(expectedResultData);
        assert.deepEqual(observedResult.oData, expectedResult.oData);
    });

    QUnit.test('Test quickViewPopupModel with null employee', async function (assert) {
        var oCut = new ResourceQuickView();
        let stub = sinon.stub(oCut, "onNavigatetoResourceObjectPage");
        stub.returns("-");
        var expectedEmptyResult = new JSONModel();
        var observedNullResult = await oCut.getResourcePopupModel(oEmployeeNull, resourceID, oi18nModel);
        expectedEmptyResult.setData(expectedEmptyData);
        assert.deepEqual(observedNullResult.oData, expectedEmptyResult.oData);
    });



}
);
