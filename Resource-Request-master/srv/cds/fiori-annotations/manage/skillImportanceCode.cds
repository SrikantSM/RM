using ManageResourceRequestService from '../../services/manage';

@cds.odata.valuelist
annotate ManageResourceRequestService.SkillImportanceCodes with {
    code
@UI.Hidden : true
@Common : {
        Label        : '{i18n>ID}',
        FieldControl : #ReadOnly,
        Text         : {
            $value                : name,
            @UI.TextArrangement : #TextOnly
        }
    };
    name
@Common : {
        Label        : '{i18n>IMPORTANCE}',
        FieldControl : #ReadOnly
    };
};