service RequesterAssignmentService @(requires : ['RsceReq.Edit']) {

    @(restrict: [{
        grant: '*',
        to   : 'RsceReq.Edit'
    }])
    action SetAssignmentStatus(assignmentID : String, status : Integer);
};
