import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../../utils';
import { EmployeeHeader } from './EmployeeHeader';
import { DraftEnabledEntityRepository } from '../../../DraftEnabledEntityRepository';
import { EntityDraftMode } from '../../../EntityDraftMode.enum';

export class EmployeeHeaderRepository extends DraftEnabledEntityRepository<EmployeeHeader> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_EMPLOYEE_HEADERS';
  }

  get draftTableName(): string {
    return 'MYPROJECTEXPERIENCESERVICE_MYPROJECTEXPERIENCEHEADER_DRAFTS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
    ]);
  }

  public async deleteMany(employeeHeader: EmployeeHeader[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    await super.deleteMany(employeeHeader, draftMode);
  }
}
