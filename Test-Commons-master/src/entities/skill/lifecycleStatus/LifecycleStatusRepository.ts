import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_NUMBER, TYPE_STRING,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { LifecycleStatus } from './LifecycleStatus';

export class LifecycleStatusRepository extends EntityRepository<LifecycleStatus> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_SKILL_LIFECYCLESTATUS';
  }

  get keyAttributeName(): string {
    return 'code';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['code', TYPE_NUMBER],
      ['name', TYPE_STRING],
      ['descr', TYPE_STRING],
    ]);
  }
}
