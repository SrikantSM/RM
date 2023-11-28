
import { TestEnvironment, IEnvironment } from 'test-commons';
import { getTestEnvironment, measureAsync, measureAsyncWrap } from './utils';
import * as staticData from './data/staticData';
import * as dataGenerator from './generator';

let testEnvironmentInstance: TestEnvironment<IEnvironment>;

export class StaticBulkLoad {
  constructor() {
  }

  @measureAsync
  async setup() {
    testEnvironmentInstance = await getTestEnvironment();
    await testEnvironmentInstance.getDatabaseClient();
  }

  @measureAsync
  async insertStaticData(): Promise<any> {
    try {
      return (await testEnvironmentInstance.getDatabaseClient()).tx(async () => {
        let promiseArray = [];
        // -------------------------Static/config/master one time load data section starts---------------------------
        // Skill
        promiseArray.push(measureAsyncWrap(dataGenerator.getInsertStaticDataSkillEntitiesPromises)(testEnvironmentInstance, staticData));
        // Consultant-Profile
        promiseArray.push(measureAsyncWrap(dataGenerator.getInsertStaticDataConsultantProfileEntitiesPromises)(testEnvironmentInstance, staticData));
        // Resource-Request
        promiseArray.push(measureAsyncWrap(dataGenerator.getInsertStaticDataResourceRequestEntitiesPromises)(testEnvironmentInstance, staticData));
        // ------------------------Static/config/master(one time load) data section ends---------------------------
        await Promise.all(promiseArray);
      });
    } catch (e) {
      console.error('insertStaticData failed.');
      throw e;
    }
  }

  async load() {
    try {
      await this.setup();
      await this.insertStaticData();
    } catch (err) {
      console.error('Static bulk load function failed:');
      console.error(err);
    }
  }
}
