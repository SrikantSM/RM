using com.sap.resourceManagement as rm from '../../db';
using sap.common as common from '@sap/cds/common';

service ReplicationScheduleService @(requires : 'authenticated-user') {

    @cds.persistence.skip
    entity ReplicationSchedule @(
        Capabilities : {
            InsertRestrictions : {Insertable : false},
            UpdateRestrictions : {Updatable : false},
            DeleteRestrictions : {Deletable : false},
            SearchRestrictions : {Searchable : false},
        },
        restrict     : [
            {
                grant : ['READ'],
                to    : 'ReplicationSchedules.Read'
            },
            {
                grant : ['activate', 'deactivate', 'editSchedule', 'setForInitialLoad'],
                to    : 'ReplicationSchedules.Edit'
            }
        ]
    ) as projection on rm.consultantProfile.integration.ReplicationSchedule actions {
        action deactivate() returns ReplicationSchedule;

        @cds.odata.bindingparameter.name : '_it'
        @Common.SideEffects : {TargetEntities : [ReplicationSchedule]}
        action editSchedule(
            @UI.ParameterDefaultValue : _it.patternValue
            @UI.Hidden : _it.isOneTime
            interval : Integer,

            @UI.ParameterDefaultValue : _it.nextRun
            @UI.Hidden : _it.isRecurring
            nextRun : DateTime
        ) returns ReplicationSchedule;

        @cds.odata.bindingparameter.collection
        @Common.IsActionCritical : true
        action setForInitialLoad() returns array of ReplicationSchedule;
    };

    @(requires: 'ReplicationSchedules.Read')
    function isInitialLoadCandidate () returns Boolean;

}
