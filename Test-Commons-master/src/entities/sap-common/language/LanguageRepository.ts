import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_STRING,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { Language } from './Language';

export class LanguageRepository extends EntityRepository<Language> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'SAP_COMMON_LANGUAGES';
  }

  get keyAttributeName(): string {
    return 'code';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['code', TYPE_STRING],
      ['name', TYPE_STRING],
      ['descr', TYPE_STRING],
    ]);
  }
}
