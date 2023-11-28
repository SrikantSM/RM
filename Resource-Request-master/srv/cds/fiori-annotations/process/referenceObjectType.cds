using ProcessResourceRequestService from '../../services/process';

annotate ProcessResourceRequestService.ReferenceObjectType with {
    
    code
    @UI.Hidden : true
    @UI.HiddenFilter: true
    @Common : {
        Label     :  '{i18n>REFERENCE_OBJECT_TYPE}',
        FieldControl : #ReadOnly,
        Text : {
            $value   : name,
            @UI.TextArrangement : #TextOnly
        },
    };

    name
    @Common: {
        Label     :  '{i18n>REFERENCE_OBJECT_TYPE}',
        FieldControl : #ReadOnly
    };
}