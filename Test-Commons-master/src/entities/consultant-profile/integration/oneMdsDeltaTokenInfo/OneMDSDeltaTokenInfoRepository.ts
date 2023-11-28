import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_STRING,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { OneMDSDeltaTokenInfo } from './OneMDSDeltaTokenInfo';

export class OneMDSDeltaTokenInfoRepository extends EntityRepository<OneMDSDeltaTokenInfo> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_CONSULTANTPROFILE_INTEGRATION_ONEMDSDELTATOKENINFO';
  }

  get keyAttributeName(): string {
    return 'entityName';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['entityName', TYPE_STRING],
      ['deltaToken', TYPE_STRING],
    ]);
  }
}
