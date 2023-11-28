import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_STRING, TYPE_NUMBER,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { DefaultLanguage } from './DefaultLanguage';

export class DefaultLanguageRepository extends EntityRepository<DefaultLanguage> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_CONFIG_DEFAULTLANGUAGES';
  }

  get keyAttributeName(): string {
    return 'language_code';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['language_code', TYPE_STRING],
      ['rank', TYPE_NUMBER],
    ]);
  }
}
