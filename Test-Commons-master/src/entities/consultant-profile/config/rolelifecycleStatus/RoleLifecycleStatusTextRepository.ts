import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_NUMBER, TYPE_STRING,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { RoleLifecycleStatusText } from './RoleLifecycleStatusText';

export class RoleLifecycleStatusTextRepository extends EntityRepository<RoleLifecycleStatusText> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_CONFIG_ROLELIFECYCLESTATUS_TEXTS';
  }

  get keyAttributeName(): string {
    return 'ID_texts';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID_texts', TYPE_STRING],
      ['code', TYPE_NUMBER],
      ['name', TYPE_STRING],
      ['descr', TYPE_STRING],
    ]);
  }
}
