using ManageResourceRequestService from '../../services/manage';

annotate ManageResourceRequestService.StaffingStatuses with {
    staffingCode
@Common : {
        Label                    : '{i18n>STAFFING_STATUS}',
        FieldControl             : #ReadOnly,
        Text                     : {
            $value                : description,
            @UI.TextArrangement : #TextOnly
        },
        ValueList : {
            CollectionPath : 'StaffingStatusCodes',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : 'staffingCode',
                    ValueListProperty : 'StaffingCode',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'description',
                }
            ],
            PresentationVariantQualifier: 'sortByStaffingCode'
        },
        ValueListWithFixedValues : true
    };

    requestedCapacity
    @Measures.Unit : requestedUnit
    @Common : {
        FieldControl             : #ReadOnly
    };
    bookedCapacity
    @Measures.Unit : requestedUnit
    @Common : {
        FieldControl             : #ReadOnly
    };
    remainingCapacity
    @Measures.Unit : requestedUnit
    @Common : {
        FieldControl             : #ReadOnly
    };
    bookedCapacitySoft
    @Common.Label: '{i18n>SOFT_BOOKED}'
    @UI.Hidden: true
    @UI.HiddenFilter: true;

    bookedCapacityHard
    @Common.Label: '{i18n>HARD_BOOKED}'
    @UI.Hidden: true
    @UI.HiddenFilter: true;

    remainingCapacity
    @Common.Label: '{i18n>REMAINING_EFFORT}'
    @UI.Hidden: true
    @UI.HiddenFilter: true;
};