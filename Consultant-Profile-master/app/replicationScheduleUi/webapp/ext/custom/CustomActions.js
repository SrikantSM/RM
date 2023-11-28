sap.ui.define([], function () {
    "use strict";

    return {
        enabledIfCandidate: function () {
            var btnFlag;
            jQuery.ajax({
                async: false,
                method: "GET",
                url: this.getModel().sServiceUrl + "isInitialLoadCandidate()",
                headers: {
                    "Accept-Language": sap.ui.getCore().getConfiguration().getLanguageTag()
                },
                success: function(oResponse) {
                    btnFlag = oResponse.value;
                },
                error: function(oResponse) {
                    btnFlag = false;
                    /* eslint-disable */
                    console.log(oResponse);
                    /* eslint-enable */
                }
            });
            return btnFlag;
        },

        isActivationCandidate: function () {
            var btnFlag;
            jQuery.ajax({
                async: false,
                method: "GET",
                url: this.getModel().sServiceUrl + "isInitialLoadCandidate()",
                headers: {
                    "Accept-Language": sap.ui.getCore().getConfiguration().getLanguageTag()
                },
                success: function(oResponse) {
                    btnFlag = oResponse.value;
                },
                error: function(oResponse) {
                    btnFlag = false;
                    /* eslint-disable */
                    console.log(oResponse);
                    /* eslint-enable */
                }
            });
            return !btnFlag;
        }
    };
});
