import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { WorkPackage } from './WorkPackage';

export class WorkPackageRepository extends EntityRepository<WorkPackage> {
  public constructor(
    statementExecutor: StatementExecutor,
    sqlGenerator: SqlGenerator = new HanaSqlGenerator(),
  ) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_PROJECT_WORKPACKAGES';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', 'string'],
      ['name', 'string'],
      ['startDate', 'string'],
      ['endDate', 'string'],
      ['project_ID', 'string'],
    ]);
  }
}
