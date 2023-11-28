import {
  HanaSqlGenerator, SqlGenerator, StatementExecutor, TYPE_STRING,
} from '../../../../../utils';
import { EntityRepository } from '../../../../EntityRepository';
import { MonthsOfTheYear } from './MonthsOfTheYear';

export class MonthsOfTheYearRepository extends EntityRepository<MonthsOfTheYear> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_EMPLOYEE_AVAILABILITY_MONTHSOFTHEYEAR';
  }

  get keyAttributeName(): string {
    return 'month';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['month', TYPE_STRING],
      ['description', TYPE_STRING],
    ]);
  }
}
