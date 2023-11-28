sap.ui.define([
    'sap/ui/test/Opa5',
    'staffResourceRequest/test/integration/pages/Common'
], function (Opa5, Common) {


    Opa5.createPageObjects({
        onTheMainPage: {
            baseClass: Common,
            //actions: MainActions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE),
            //assertions: MainAssertions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE)

            assertions: {
                iShouldSeeTheElement: function (sId) {
                    const LISTREPORT_PREFIX_ID = 'staffResourceRequest::resourceRequestListReport--';

                    return this.waitFor({
                        //id: LISTREPORT_PREFIX_ID + sId,
                        controlType:"sap.ui.mdc.Table",
                        timeout: 70,
                        matchers:function(oTable){
                            if (oTable.getProperty("header") == "Resource Requests") {return true;} else {return false;}
                        },
                        success: function () {
                            Opa5.assert.ok(true, 'Seen');
                        },
                        errorMessage: 'Can\'t see ' + LISTREPORT_PREFIX_ID + sId
                    });
                }
            }
        }
    });
});
