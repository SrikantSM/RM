using ProcessResourceRequestService from '../../services/process';

annotate ProcessResourceRequestService.Demands with {
    ID
@UI.HiddenFilter: true
@Common : {
        Label : '{i18n>DEMAND}',
        Text  : {
            $value                : billingRoleName,
            @UI.TextArrangement : #TextOnly
        }
    };
    externalID
@UI.Hidden : true;
    billingRole
@UI.Hidden : true
@Common : {
        Label     : '{i18n>BILLINGROLE_NAME}',
        Text      : {
            $value                : billingRole.name,
            @UI.TextArrangement : #TextOnly
        },
        ValueList : {
            CollectionPath  : 'BillingRoles',
            SearchSupported : true,
            Parameters      : [
                {
                    $Type             : 'Common.ValueListParameterOut',
                    LocalDataProperty : 'billingRole_ID',
                    ValueListProperty : 'ID'
                },
                {
                    $Type             : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'name'
                },
            ]
        }
    };
    billingCategory
@UI.Hidden : true
@Common : {
        Label        : '{i18n>BILLING_CATEGORY}',
        FieldControl : #ReadOnly,
        Text         : {
            $value                : billingCategory.name,
            @UI.TextArrangement : #TextOnly
        }
    };
    workPackage
@UI.Hidden : true
@Common : {
        Label        : '{i18n>WORKPACKAGE_NAME}',
        FieldControl : #ReadOnly,
        Text         : {
            $value                : workPackage.name,
            @UI.TextArrangement : #TextOnly
        },
        ValueList    : {
            CollectionPath  : 'WorkPackages',
            SearchSupported : true,
            Parameters      : [
                {
                    $Type             : 'Common.ValueListParameterOut',
                    LocalDataProperty : 'workPackage_ID',
                    ValueListProperty : 'ID'
                },
                {
                    $Type             : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'name'
                },
            ]
        }
    };
    billingRoleName
@Common    : {Label : '{i18n>DEMAND}'};
    workPackageName
@Common    : {Label : '{i18n>WORKPACKAGE_NAME}'};
   workItem
@UI.Hidden : true
@Common    : {Label : '{i18n>WORKITEM_ID}'};
    workItemName
@Common    : {Label : '{i18n>WORKITEM_NAME}'};
    projectName
@Common    : {Label : '{i18n>PROJECT_NAME}'};
    startDate
@UI.Hidden : true;
    endDate
@UI.Hidden : true;
    requestedQuantity
@UI.HiddenFilter : true
@Common : {
        Label        : '{i18n>DEMANDED_EFFORT}',
        FieldControl : #ReadOnly
    };
    requestedUoM
@UI.Hidden : true;
    deliveryOrganization
@UI.Hidden : true;
  deliveryOrganization_code
@UI.Hidden       : true;
};
