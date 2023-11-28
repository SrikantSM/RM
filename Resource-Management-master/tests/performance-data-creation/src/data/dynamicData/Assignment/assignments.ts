import { getResourceHeadersBatchDynamicData } from "../Consultant-Profile/resourceHeaders";
import { ResourceSupply, ResourceHeader, ResourceRequest, ResourceCapacity, AssignmentBucket, Assignments, WorkAssignmentRepository, IEnvironment, TestEnvironment, ResourceRequestRepository } from "test-commons";
import { OVERSTAFFED_ASSIGNMENT_HOURS, P25_AVAILABILITY_ASSIGNMENT_HOURS, P50_AVAILABILITY_ASSIGNMENT_HOURS, P75_AVAILABILITY_ASSIGNMENT_HOURS, NUMBER_OF_RESOURCES, NUMBER_OF_RESOURCES_PER_BLOCK, RR_PER_MONTH_RANGE, NON_OVERLAP_MONTHS_RANGE, OVERLAP_MONTH_RANGE } from "./config";
import { getRequestBatchDynamicData } from "../Resource-Request/resourceRequest";
import { AssignmentAPIPayload } from "../../../utils/util";
import { getResourceCapacitiesBatchDynamicData } from "../Consultant-Profile/resourceCapacities";
import { EMPLOYEE_HEADER_NUMBER_OF_EMPLOYEE_PER_RM } from "../Consultant-Profile/config";
import { getTestEnvironment } from "../../../utils";

const moment = require('moment');
const uuid = require('uuid').v4;

let assignmentAPIPayloads: AssignmentAPIPayload[] = [];

interface DBEntity {
    ID: string;
}

export async function getAssignmentAPIPayloads(batchNum: number) {
    assignmentAPIPayloads = [];
    console.log("Assignment payload was requested for batch No. #" + batchNum);
    let resources: DBEntity[] = await getResourceHeadersFromDBForBatch(batchNum);
    let requests: ResourceRequest[] = await getRequestsFromDBForBatch(batchNum);
    let hours_to_assign = 0;
    for (let index = 0; index < requests.length; index += 1) {
        const request = requests[index];
        hours_to_assign = getHoursToAssign(index);
        let start_date = request.startDate;
        let end_date = request.endDate;

        let payLoad = {
            resourceId: resources[index % NUMBER_OF_RESOURCES].ID,
            resourceRequestId: request.ID,
            start: start_date,
            end: end_date,
            duration: '' + hours_to_assign,
            mode: "I"
        }
        if (hours_to_assign) {
            assignmentAPIPayloads.push(payLoad);
        }

    }
    console.log('Assignments payload created for batch #' + batchNum + '. Total assignments to be created = ' + assignmentAPIPayloads.length);
    return assignmentAPIPayloads;
}

export function getAssignmentDBPayloads(batchNum: number) {

    console.log("Assignment dynamic DB data was requested for batch No. #" + batchNum);

    const assignmentDynamicData = new Map<string, any[]>();
    const assignmentHeaderDynamicData: Assignments[] = [];
    const assignmentBucketsDynamicData: AssignmentBucket[] = [];
    const resourceSupplyDynamicData: ResourceSupply[] = [];

    const NUMBER_OF_MINUTES_IN_HOUR: number = 60;

    let resources: ResourceHeader[] = getResourceHeadersBatchDynamicData(batchNum);
    let resourceCapacities: ResourceCapacity[] = getResourceCapacitiesBatchDynamicData(batchNum);
    let requests: ResourceRequest[] = getRequestBatchDynamicData(batchNum);

    for (let i = 0; i < requests.length; i += 1) {
        let request = requests[i];

        let hoursToStaff: number = getHoursToAssign(i);
        if (hoursToStaff < 1) {
            continue;
        }

        let startOfAssignmentDistributionPeriod = request.startDate;
        let endOfAssignmentDistributionPeriod = request.endDate;

        let resource = resources[i % EMPLOYEE_HEADER_NUMBER_OF_EMPLOYEE_PER_RM];
        let resourceCapacity = resourceCapacities.filter(resCap => (resCap.resource_id == resource.ID)
            && (resCap.startTime >= startOfAssignmentDistributionPeriod && resCap.startTime <= endOfAssignmentDistributionPeriod));

        let numAvailableDays: number = resourceCapacity.length;
        if (numAvailableDays <= 0) {
            continue;
        }

        let hoursAssignedEqually: number = Math.floor(hoursToStaff / numAvailableDays);
        let hoursAssignedSequentially: number = Math.floor(hoursToStaff % numAvailableDays);

        let assignmentHeader: Assignments = {
            ID: uuid(),
            resourceRequest_ID: request.ID,
            resource_ID: resource.ID,
            assignmentstatus_code: 0,
            bookedCapacityInMinutes: hoursToStaff * NUMBER_OF_MINUTES_IN_HOUR
        };

        let resourceSupply: ResourceSupply = {
            assignment_ID: assignmentHeader.ID,
            resourceSupply_ID: '1010'
        };

        if (hoursAssignedEqually > 0) {
            for (let j = 0; j < resourceCapacity.length; j += 1) {
                let bookedHours: number = hoursAssignedEqually + (hoursAssignedSequentially > 0 ? 1 : 0);
                hoursAssignedSequentially -= 1;
                const assignmentBucket: AssignmentBucket = {
                    ID: uuid(),
                    bookedCapacityInMinutes: bookedHours * NUMBER_OF_MINUTES_IN_HOUR,
                    assignment_ID: assignmentHeader.ID,
                    startTime: resourceCapacity[j].startTime
                };
                assignmentBucketsDynamicData.push(assignmentBucket);
            }
        }
        else if (hoursAssignedSequentially > 0) {
            for (let j = 0; j < resourceCapacity.length; j += 1) {
                if (hoursAssignedSequentially <= 0) break;
                let bookedHours: number = (hoursAssignedSequentially > 0 ? 1 : 0);
                hoursAssignedSequentially -= 1;
                const assignmentBucket: AssignmentBucket = {
                    ID: uuid(),
                    bookedCapacityInMinutes: bookedHours * NUMBER_OF_MINUTES_IN_HOUR,
                    assignment_ID: assignmentHeader.ID,
                    startTime: resourceCapacity[j].startTime
                };
                assignmentBucketsDynamicData.push(assignmentBucket);
            }
        }
        assignmentHeaderDynamicData.push(assignmentHeader);
        resourceSupplyDynamicData.push(resourceSupply);
    }
    assignmentDynamicData.set('Assignments', assignmentHeaderDynamicData);
    assignmentDynamicData.set('AssignmentBucket', assignmentBucketsDynamicData);
    assignmentDynamicData.set('Supply', resourceSupplyDynamicData);

    return assignmentDynamicData;
}

function getHoursToAssign(index: number): number {
    let hours_to_assign: number = 0;
    switch (Math.floor((index % NUMBER_OF_RESOURCES) / NUMBER_OF_RESOURCES_PER_BLOCK)) {
        case 0: { //overstaffed
            hours_to_assign = OVERSTAFFED_ASSIGNMENT_HOURS;
            break;
        }
        case 1: { // 25% Availability 
            hours_to_assign = P25_AVAILABILITY_ASSIGNMENT_HOURS;
            break;
        }
        case 2: { // 50% Availability 
            hours_to_assign = P50_AVAILABILITY_ASSIGNMENT_HOURS;
            break;
        }
        case 3: { // 75% Availability 
            hours_to_assign = P75_AVAILABILITY_ASSIGNMENT_HOURS;
            break;
        }
        default: { // free resources
            hours_to_assign = 0;
            break;
        }
    }
    return hours_to_assign;
}

async function getResourceHeadersFromDBForBatch(batchNum: number): Promise<DBEntity[]> {
    // workAssignmentID = resourceID
    const testEnvironment: TestEnvironment<IEnvironment> = await getTestEnvironment();
    const workAssignmentRepository: WorkAssignmentRepository = await testEnvironment.getWorkAssignmentRepository();

    const statement =
        'SELECT ID FROM COM_SAP_RESOURCEMANAGEMENT_WORKFORCE_WORKASSIGNMENT_WORKASSIGNMENTS where workAssignmentID like' + ' \'%.' + batchNum + '\'';

    const result: DBEntity[] = await workAssignmentRepository.statementExecutor.execute(statement);
    console.log("Fetched " + result.length + " resource IDs from DB!");
    return result;
}

async function getRequestsFromDBForBatch(batchNum: number): Promise<ResourceRequest[]> {
    const testEnvironment: TestEnvironment<IEnvironment> = await getTestEnvironment();
    const resourceRequestRepository: ResourceRequestRepository = await testEnvironment.getResourceRequestRepository();

    const statement =
        'SELECT ID FROM COM_SAP_RESOURCEMANAGEMENT_RESOURCEREQUEST_RESOURCEREQUESTS where description like' + ' \'RequestDescription_' + batchNum + '\'';

    const result: ResourceRequest[] = await resourceRequestRepository.statementExecutor.execute(statement);
    console.log("Fetched " + result.length + " request IDs from DB!");
    return result;
}
