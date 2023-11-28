import { WorkAssignment } from 'test-commons';

export const resource1: WorkAssignment = {
  ID: 'rs111e36-ae2a-11e9-a2a3-2a2ae2dbres1',
  parent: 'e1111e36-ae2a-11e9-a2a3-2a2ae2dbcce1',
  workAssignmentID: '5wa1aa7d-a1dd-4de1-afbd-9adb433395bf',
  externalID: 'EXTERNALID1',
  startDate: '2018-01-01',
  endDate: '2020-01-01',
};
export const resource2: WorkAssignment = {
  ID: 'rs111e36-ae2a-11e9-a2a3-2a2ae2dbres2',
  parent: 'e1111e36-ae2a-11e9-a2a3-2a2ae2dbcce2',
  workAssignmentID: '5wa2aa7d-a1dd-4de1-afbd-9adb433395bf',
  externalID: 'EXTERNALID2',
  startDate: '2018-01-01',
  endDate: '2020-01-01',
};
export const resource3: WorkAssignment = {
  ID: 'rs111e36-ae2a-11e9-a2a3-2a2ae2dbres3',
  parent: 'e1111e36-ae2a-11e9-a2a3-2a2ae2dbcce3',
  workAssignmentID: '5wa2aa7d-a1dd-4de1-afbd-9adb433395bf',
  externalID: 'EXTERNALID2',
  startDate: '2018-01-01',
  endDate: '2020-01-01',
};

export const workAssignmentData: WorkAssignment[] = [
  resource1,
  resource2,
];
