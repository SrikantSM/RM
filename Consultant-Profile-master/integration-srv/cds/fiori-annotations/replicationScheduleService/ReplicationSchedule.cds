using ReplicationScheduleService from '../../replicationScheduleService';

annotate ReplicationScheduleService.ReplicationSchedule with {
    jobID
    @(Common : {Label : '{i18n>REPLICATION_SCHEDULE_JOB_ID}'});

    jobName
    @(Common : {Label : '{i18n>REPLICATION_SCHEDULE_JOB_NAME}'});

    scheduleID
    @(Common : {Label : '{i18n>REPLICATION_SCHEDULE_SCHEDULE_ID}'});

    replicationObject
    @(Common : {Label : '{i18n>REPLICATION_SCHEDULE_BUSINESS_OBJECT_TYPE}'});

    description
    @(Common : {Label : '{i18n>REPLICATION_SCHEDULE_DESCRIPTION}'});

    pattern
    @(Common : {Label : '{i18n>REPLICATION_SCHEDULE_PATTERN}'});

    nextRun
    @(Common : {Label : '{i18n>REPLICATION_SCHEDULE_NEXT_RUN}'});

    scheduleStatusLabel
    @(Common : {Label : '{i18n>REPLICATION_SCHEDULE_STATUS}'});

    actionCall 
    @(Common : {Label : '{i18n>ACTION}'});

    isActive                  @UI.Hidden : true;
    isInactive                @UI.Hidden : true;
    isRecurring               @UI.Hidden : true;
    isOneTime                 @UI.Hidden : true;
    scheduleStatusCriticality @UI.Hidden : true;
    patternValue              @UI.Hidden : true;
};

// Replication Schedule List Report
annotate ReplicationScheduleService.ReplicationSchedule with @(
    Common : {
        SemanticKey    : [
            jobID,
            scheduleID
        ],
        Label          : '{i18n>REPLICATION_SCHEDULE}',
        SemanticObject : '{i18n>REPLICATION_SCHEDULES}',
    },
    UI : {
        HeaderInfo : {
            TypeName       : '{i18n>REPLICATION_SCHEDULE}',
            TypeNamePlural : '{i18n>REPLICATION_SCHEDULES}'
        },
        FieldGroup #DeactivateSchedule : {
            Data : [
                {
                    $Type         : 'UI.DataFieldForAction',
                    Label         : '{i18n>DEACTIVATE}',
                    Action        : 'ReplicationScheduleService.deactivate',
                    ![@UI.Hidden] : isInactive
                }
            ]
        },
        PresentationVariant : {
            RequestAtLeast : [
                'isRecurring',
                'isOneTime',
                'nextRun'
            ],
            Visualizations : ['@UI.LineItem'],
        },
        LineItem : [
            {
                Value : replicationObject,
                Label : '{i18n>REPLICATION_SCHEDULE_BUSINESS_OBJECT_TYPE}'
            },
            {
                Value : description,
                Label : '{i18n>REPLICATION_SCHEDULE_DESCRIPTION}'
            },
            {
                Value : scheduleStatusLabel,
                Label : '{i18n>REPLICATION_SCHEDULE_STATUS}',
                Criticality : scheduleStatusCriticality,
                CriticalityRepresentation : #WithoutIcon
            },
            {
                Value : pattern,
                Label : '{i18n>REPLICATION_SCHEDULE_PATTERN}'
            },
            {
                Value : nextRun,
                Label : '{i18n>REPLICATION_SCHEDULE_NEXT_RUN}'
            },
            {
                $Type  : 'UI.DataFieldForAction',
                Label  : '{i18n>EDIT_SCHEDULE}',
                Action : 'ReplicationScheduleService.editSchedule',
            },
            {
                $Type : 'UI.DataFieldForAction',
                Label : '{i18n>SET_FOR_INITIAL_LOAD}',
                Action : 'ReplicationScheduleService.setForInitialLoad',
                InvocationGrouping : #Isolated
            },
            {
                Value  : actionCall,
                $Type  : 'UI.DataFieldForAnnotation',
                Target : '@UI.FieldGroup#DeactivateSchedule',
                Label  : '{i18n>ACTION}'
            },
        ]
    },
);

annotate ReplicationScheduleService.ReplicationSchedule actions {
    editSchedule(
        interval
        @(title : '{i18n>SELECT_INTERVAL}', ),

        nextRun
        @(title : '{i18n>SELECT_ONE_TIME_DATE_TIME}')
    );
};
