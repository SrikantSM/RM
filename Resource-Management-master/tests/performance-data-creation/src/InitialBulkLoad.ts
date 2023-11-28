
import { TestEnvironment, IEnvironment } from 'test-commons';
import { getTestEnvironment, getBatchRange, measureAsync, measureAsyncWrap, isAssignmentCreationByAPI } from './utils';
import {
  getConsultantProfileBatchDynamicData, getAssignmentBatchDynamicData, getResourceRequestBatchDynamicData,
} from './data/dynamicData';
import * as dataGenerator from './generator';

let testEnvironmentInstance: TestEnvironment<IEnvironment>;
let batchRange: number[] = [0, 0];
let asgnCreationByAPI: boolean = true;

export class InitialBulkLoad {
  constructor() {
  }

  @measureAsync
  async setup() {
    testEnvironmentInstance = await getTestEnvironment();
    await testEnvironmentInstance.getDatabaseClient();
    batchRange = await getBatchRange();
    asgnCreationByAPI = await isAssignmentCreationByAPI();
  }

  @measureAsync
  async insertAllParallelly(): Promise<any> {
    try {
      let promiseArray = [];
      // **********************************Dynamic data load section starts***************************************
      // ---------------------Iteration of dynamic data load as per number of data Batches to be loaded
      for (let i = batchRange[0]; i <= batchRange[1]; i += 1) {
        promiseArray = [];

        // ----------------------Loading dynamic data for each domain per batch iteration.
        const consultantProfileBatchDynamicData = await getConsultantProfileBatchDynamicData(i);
        const resourceRequestBatchDynamicData = getResourceRequestBatchDynamicData(i);
        // ---------------------Inserting dynamic data for each domain each batch iteration.

        // Consultant-Profile
        promiseArray.push(measureAsyncWrap(dataGenerator.getInsertDynamicDataConsultantProfileEntitiesPromises)(testEnvironmentInstance, consultantProfileBatchDynamicData));

        // Resource-Request
        promiseArray.push(measureAsyncWrap(dataGenerator.getInsertDynamicDataResourceRequestEntitiesPromises)(testEnvironmentInstance, resourceRequestBatchDynamicData));

        /* eslint-disable no-await-in-loop */
        await Promise.all(promiseArray);

        promiseArray = [];

        // Assignment as part of same stage only if asked to create via DB inserts
        if (!asgnCreationByAPI) {
          const assignmentBatchDynamicData = await getAssignmentBatchDynamicData(i, asgnCreationByAPI);
          console.info("Creating Assignment data via Direct DB Inserts");
          promiseArray.push(measureAsyncWrap(dataGenerator.getInsertDynamicDataAssignmentDBEntitiesPromises)(testEnvironmentInstance, assignmentBatchDynamicData));
        }
        /* eslint-disable no-await-in-loop */
        await Promise.all(promiseArray);
      }
    } catch (e) {
      console.error('insertAllParallelly failed.');
      throw e;
    }
  }

  async load() {
    try {
      await this.setup();
      await this.insertAllParallelly();
    } catch (err) {
      console.error('Load function failed:');
      console.error(err);
    }
  }

  async loadAssignments() {
    try {
      await this.setup();
      await this.insertAssignments();
    } catch (err) {
      console.error('Load Assignments function failed:');
      console.error(err);
    }
  }

  @measureAsync
  async insertAssignments(): Promise<any> {

    if (!asgnCreationByAPI) {
      console.info("Assignments were already inserted via direct DB inserts, nothing to look here. Good day!");
      return;
    }

    try {
      let promiseArray = [];
      for (let i = batchRange[0]; i <= batchRange[1]; i += 1) {

        promiseArray = [];
        const assignmentBatchDynamicData = await getAssignmentBatchDynamicData(i, asgnCreationByAPI);

        console.info("Creating Assignment data via APIs");
        promiseArray.push(measureAsyncWrap(dataGenerator.getInsertDynamicDataAssignmentAPIEntitiesPromises)(testEnvironmentInstance, assignmentBatchDynamicData));

        /* eslint-disable no-await-in-loop */
        await Promise.all(promiseArray);
      }
    } catch (e) {
      console.error('insertAllParallelly failed.');
      throw e;
    }
  }

}
