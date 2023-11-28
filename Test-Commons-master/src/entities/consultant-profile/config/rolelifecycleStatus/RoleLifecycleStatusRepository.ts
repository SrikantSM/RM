import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_NUMBER, TYPE_STRING,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { RoleLifecycleStatus } from './RoleLifecycleStatus';

export class RoleLifecycleStatusRepository extends EntityRepository<RoleLifecycleStatus> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_CONFIG_ROLELIFECYCLESTATUS';
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
