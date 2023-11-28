using Assignment from '../services/assignmentAPI';


annotate Assignment with @(
    Core.Description     : 'Assignment',
    Core.LongDescription : 'This API enables you to manage assignments in SAP S/4HANA Cloud for projects, resource management. You can create new assignments or update and delete existing ones. You can also read assignments, either of resources to monitor their utilization or of resource requests to check the staffing status.'
);

annotate Assignment.Assignments with @(
    Core.LongDescription                                            : 'Assignments',
    Core.Description                                                : 'Assignments',
    Capabilities.ReadRestrictions.Description                       : 'Read assignments.',
    Capabilities.UpdateRestrictions.Description                     : 'Update assignments',
    Capabilities.Updatable                                          : true,
    Capabilities.Deletable                                          : true,
    Capabilities.DeleteRestrictions.Description                     : 'Delete assignments.',
    Capabilities.ReadRestrictions.ReadByKeyRestrictions.Description : 'Read a single assignment.',
    Capabilities.SearchRestrictions.Searchable                      : false
);

annotate Assignment.DailyAssignmentDistribution with @(
    Core.LongDescription                       : 'DailyAssignmentDistribution',
    Core.Description                           : 'The daily distribution of the assignment.',
    Capabilities.SearchRestrictions.Searchable : false
);

annotate Assignment.WeeklyAssignmentDistribution with @(
    Core.LongDescription                       : 'WeeklyAssignmentDistribution',
    Core.Description                           : 'The weekly distribution of the assignment.',
    Capabilities.SearchRestrictions.Searchable : false
);

annotate Assignment.MonthlyAssignmentDistribution with @(
    Core.LongDescription                       : 'MonthlyAssignmentDistribution',
    Core.Description                           : 'The monthly distribution of the assignment.',
    Capabilities.SearchRestrictions.Searchable : false
);

annotate Assignment.WorkAssignment with @(
    Core.LongDescription                       : 'WorkAssignment',
    Core.Description                           : 'The workAssignment of the resource.',
    Capabilities.SearchRestrictions.Searchable : false
);

annotate Assignment.Assignments with {


    @Core.Description : 'The identifier of the assignment.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '01234567-89ab-cdef-0123-456789abc001'
    }
    ID;


    @Core.Description : 'The identifier of the resource request.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '51455673-456d-abc1-def1-756789def005'
    }
    requestID;


    @Core.Description : 'The identifier of the resource.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '04444567-89ab-cde5-4444-456789ccc333'
    }
    resourceID;


    @Core.Description : 'The start date of the assignment.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '2022-12-25'
    }
    startDate;

    @Core.Description : 'The end date of the assignment.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '2022-12-30'
    }
    endDate;

    @Core.Description : 'The total number of assigned hours.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '250'
    }
    bookedCapacity;

    @Core.Description : 'Indicator for soft-booked assignments.'
    @Core.Computed: false
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : 'true'
    }
    isSoftBooked;


    @Core.Description : 'The workAssignment of the resource.'
    _workAssignment;

    @Core.Description : 'The daily distribution of the assignment.'
    _dailyAssignmentDistribution;

    @Core.Description : 'The weekly distribution of the assignment.'
    _weeklyAssignmentDistribution;

    @Core.Description : 'The monthly distribution of the assignment.'
    _monthlyAssignmentDistribution;

}

annotate Assignment.WorkAssignment with {

    @Core.Description : 'The identifier of the resource.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '04444567-89ab-cde5-4444-456789ccc333'
    }
    resourceID;

    @Core.Description : 'The identifier of the work assignment.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : 'RES.001.EXAMPLE'
    }
    workAssignmentID;

}

annotate Assignment.DailyAssignmentDistribution with {

    @Core.Description : 'The identifier of the daily assignment distribution.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '06744567-89ab-cde5-7897-456789ccc333'
    }
    ID;

    @Core.Description : 'The identifier of the assignment.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '01234567-89ab-cdef-0123-456789abc001'
    }
    assignmentID;

    @Core.Description : 'The date of the daily assignment distribution.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '2022-03-31'
    }
    date;

    @Core.Description : 'The calendar week of the daily assignment distribution according to ISO specification.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '202213'
    }
    calendarWeek;

    @Core.Description : 'The calendar month of the daily assignment distribution.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '202203'
    }
    calendarMonth;

    @Core.Description : 'The calendar year of the daily assignment distribution.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '2022'
    }
    calendarYear;

    @Core.Description : 'The number of assigned hours on this day.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '8'
    }
    bookedCapacity;

}

annotate Assignment.WeeklyAssignmentDistribution with {

    @Core.Description : 'The identifier of the assignment.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '01234567-89ab-cdef-0123-456789abc001'
    }
    assignmentID;

    @Core.Description : 'The calendar week of the weekly assignment distribution according to ISO specification.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '202213'
    }
    calendarWeek;

    @Core.Description : 'The number of assigned hours on this week.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '8'
    }
    bookedCapacity;

    @Core.Description : 'The start date of the calendar week.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '2022-03-28'
    }
    weekStartDate;

    @Core.Description : 'The end date of the calendar week.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '2022-04-03'
    }
    weekEndDate;

}

annotate Assignment.MonthlyAssignmentDistribution with {

    @Core.Description : 'The identifier of the assignment.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '01234567-89ab-cdef-0123-456789abc001'
    }
    assignmentID;

    @Core.Description : 'The calendar month of the monthly assignment distribution.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '202203'
    }
    calendarMonth;

    @Core.Description : 'The number of assigned hours on this month.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '8'
    }
    bookedCapacity;

    @Core.Description : 'The start date of the calendar month.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '2022-03-01'
    }
    monthStartDate;

    @Core.Description : 'The end date of the calendar month.'
    @Core.Example     : {
        $Type : 'Core.PrimitiveExampleValue',
        Value : '2022-03-31'
    }
    monthEndDate;

}