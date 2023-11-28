using ProcessResourceRequestService from '../../services/process';

annotate ProcessResourceRequestService.StaffingStatusCodes with {
    StaffingCode
@UI.Hidden : true
@Common : {
        Label        : '{i18n>ID}',
        FieldControl : #ReadOnly,
        Text         : {
            $value                : description,
            @UI.TextArrangement : #TextOnly
        }
    };
    description
@Common : {
        Label        : '{i18n>STAFFING_STATUS}',
        FieldControl : #ReadOnly
    };
};

annotate ProcessResourceRequestService.StaffingStatusCodes with @(UI:{
    PresentationVariant #sortByStaffingCode: {
        SortOrder : [
            {
                Property   : 'StaffingCode',
                Descending : false
            }
        ]
    }
}); 