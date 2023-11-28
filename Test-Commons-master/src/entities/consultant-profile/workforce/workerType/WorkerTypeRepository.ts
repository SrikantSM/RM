import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_STRING, TYPE_BOOLEAN,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { WorkerType } from './WorkerType';

export class WorkerTypeRepository extends EntityRepository<WorkerType> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_WORKFORCE_WORKASSIGNMENT_WORKERTYPE';
  }

  get keyAttributeName(): string {
    return 'isContingentWorker';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['isContingentWorker', TYPE_BOOLEAN],
      ['name', TYPE_STRING],
    ]);
  }
}
