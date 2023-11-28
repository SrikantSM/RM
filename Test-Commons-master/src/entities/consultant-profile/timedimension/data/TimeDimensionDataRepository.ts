import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { TimeDimensionData } from './TimeDimensionData';

export class TimeDimensionDataRepository extends EntityRepository<TimeDimensionData> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_SYSTEM_DATA_TIMEDIMENSION_DATA';
  }

  get keyAttributeName(): string {
    return 'DATETIMESTAMP';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['DATETIMESTAMP', TYPE_STRING],
      ['DATE_SQL', TYPE_STRING],
      ['DATETIME_SAP', TYPE_STRING],
      ['DATE_SAP', TYPE_STRING],
      ['YEAR', TYPE_STRING],
      ['QUARTER', TYPE_STRING],
      ['MONTH', TYPE_STRING],
      ['WEEK', TYPE_STRING],
      ['WEEK_YEAR', TYPE_STRING],
      ['DAY_OF_WEEK', TYPE_STRING],
      ['DAY', TYPE_STRING],
      ['HOUR', TYPE_STRING],
      ['MINUTE', TYPE_STRING],
      ['CALQUARTER', TYPE_STRING],
      ['CALMONTH', TYPE_STRING],
      ['CALWEEK', TYPE_STRING],
    ]);
  }
}
