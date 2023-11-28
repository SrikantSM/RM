using MyResourcesService from '../../myResourcesService';

annotate MyResourcesService.WorkerType with {
    name @Common : {
        Label : '{i18n>WORKER_TYPE}',
        ValueListWithFixedValues : true,
        FieldControl : #ReadOnly,
        ValueList : {
            CollectionPath  : 'WorkerType',
            Parameters      : [
            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty :  name,
                ValueListProperty : 'name'
            }]
        },
    };
};