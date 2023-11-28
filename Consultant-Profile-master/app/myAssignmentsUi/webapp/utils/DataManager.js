sap.ui.define([
    'sap/ui/base/EventProvider',
    'sap/ui/model/json/JSONModel'
], function(EventProvider, JSONModel) {
    'use strict';

    var DataManager = EventProvider.extend('myAssignmentsUi.utils.DataManager', {

        myAssignmentsModel: new JSONModel({}, true),
        _oOdataModel: null,
        _oi18nModel: null,

        constructor: function(oODataModel, oi18nModel) {
            EventProvider.apply(this, arguments);
            this._oODataModel = oODataModel;
            this._oi18nModel = oi18nModel;
        },

        metdata: {
            properties: ['myAssignmentsModel'],
            publicMethods: ['fetchTableData']
        }

    });

    return DataManager;

});
