using ProcessResourceRequestService from '../../services/process';

annotate ProcessResourceRequestService.WorkerType with {
    isContingentWorker
    @UI.Hidden: true
@Common : {
        FieldControl : #ReadOnly,
        Text         : {
            $value                : name,
            @UI.TextArrangement : #TextOnly
        }
    };
    name
@Common : {
        FieldControl : #ReadOnly
    };

    descr
    @UI.Hidden: true;

};
