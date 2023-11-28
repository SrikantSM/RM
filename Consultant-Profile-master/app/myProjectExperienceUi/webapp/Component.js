sap.ui.define(
    ["sap/fe/core/AppComponent",
        'sap/m/MessageBox'
    ],
    function (ac, MessageBox) {
        "use strict";

        return ac.extend("myProjectExperienceUi.Component", {
            metadata: { manifest: 'json' },

            createContent: function() {
                var oModel = this.getModel();

                var oMyProjectExperienceHeader = oModel.bindList('/MyProjectExperienceHeader');

                oMyProjectExperienceHeader.requestContexts().then(function(oContexts){
                    if (oContexts.length > 0){
                        var loggedInUserId = oContexts[0].getObject().ID;
                        /*
                    * Use the hashChanger to add the missing context to the URL, so that we navigate directly to the ObjectPage
                */
                        var oHashChanger = sap.ushell.Container.getService("ShellNavigation").hashChanger;
                        if (!oHashChanger.getAppHash().includes("ID=")) { oHashChanger.replaceHash(`MyProjectExperienceHeader(${loggedInUserId})`);}
                    } else {
                        MessageBox.error(this.getModel('i18n')._oResourceBundle.getText("INVALID_EMAIL_ID", sap.ushell.Container.getService("UserInfo").getEmail()));
                    }
                }.bind(this));

                // call the base component's createContent function
                return ac.prototype.createContent.apply(this, arguments);
            }
        });
    });
