using ProcessResourceRequestService from '../../services/process';

@cds.search: {ID, name}
annotate ProcessResourceRequestService.WorkPackages with {
    ID
@Common : {
        Label        : '{i18n>ID}',
        FieldControl : #ReadOnly,
        Text         : {
            $value                : name,
            @UI.TextArrangement : #TextFirst
        }
    };
    name
@Common : {
        Label        : '{i18n>WORKPACKAGE_NAME}',
        FieldControl : #ReadOnly,
    };
    project
@Common : {
        Label        : '{i18n>PROJECT_NAME}',
        FieldControl : #ReadOnly,
        Text         : {
            $value                : project.name,
            @UI.TextArrangement : #TextOnly
        },
        ValueList    : {
            CollectionPath  : 'Projects',
            SearchSupported : true,
            Parameters      : [
                {
                    $Type             : 'Common.ValueListParameterOut',
                    LocalDataProperty : 'project_ID',
                    ValueListProperty : 'ID'
                },
                {
                    $Type             : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'name'
                },
            ]
        }
    }
@UI.HiddenFilter: true;
    startDate
@Common.Label                : '{i18n>START_TIME}'
@UI.HiddenFilter: true;
    endDate
@Common.Label                : '{i18n>END_TIME}'
@UI.HiddenFilter: true;
};

annotate ProcessResourceRequestService.WorkPackages with @(UI : {
    QuickViewFacets                  : [{
        $Type  : 'UI.ReferenceFacet',
        Label  : '{name}',
        Target : '@UI.FieldGroup#WorkPackageQuickView'
    }],
    Identification                   : [{
        $Type : 'UI.DataField',
        Value : name
    }],
    FieldGroup #WorkPackageQuickView : {Data : [
        {
            $Type : 'UI.DataField',
            Value : project_ID
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>START_TIME}',
            Value : project.startDate
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>END_TIME}',
            Value : project.endDate
        }
    ]}
}, );