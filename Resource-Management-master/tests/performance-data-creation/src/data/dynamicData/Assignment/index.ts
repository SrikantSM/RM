import { getAssignmentAPIPayloads, getAssignmentDBPayloads } from './assignments';

export async function getAssignmentBatchDynamicData(batchNum: number, asgnCreationByAPI: boolean) {
  if (asgnCreationByAPI) {
    console.log('getAssignmentBatchDynamicData is called for batchNum: ', batchNum);
    const assignmentBatchDynamicData = new Map<string, any[]>();
    const assignmentAPIPayloads: { resourceId: string, resourceRequestId: string, start: string, end: string, duration: string }[] = await getAssignmentAPIPayloads(batchNum);
    assignmentBatchDynamicData.set('assignmentsAPIPayloads', assignmentAPIPayloads);
    return assignmentBatchDynamicData;
  }
  else {
    console.log('getAssignmentBatchDynamicDBData is called for batchNum: ', batchNum);
    return getAssignmentDBPayloads(batchNum);
  }
}