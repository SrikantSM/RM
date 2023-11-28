import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_STRING,
} from '../../../../../utils';
import { EntityRepository } from '../../../../EntityRepository';
import { MonthsOfTheYearText } from './MonthsOfTheYearText';

export class MonthsOfTheYearTextRepository extends EntityRepository<MonthsOfTheYearText> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_EMPLOYEE_AVAILABILITY_MONTHSOFTHEYEAR_TEXTS';
  }

  get keyAttributeName(): string {
    return 'ID_texts';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['locale', TYPE_STRING],
      ['month', TYPE_STRING],
      ['description', TYPE_STRING],
    ]);
  }
}
