import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../../utils';
import { ExternalWorkExperience } from './ExternalWorkExperience';
import { DraftEnabledEntityRepository } from '../../../DraftEnabledEntityRepository';
import { EntityDraftMode } from '../../../EntityDraftMode.enum';

export class ExternalWorkExperienceRepository extends DraftEnabledEntityRepository<ExternalWorkExperience> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_EMPLOYEE_PRIOREXPERIENCE_EXTERNALWORKEXPERIENCE';
  }

  get draftTableName(): string {
    return 'MYPROJECTEXPERIENCESERVICE_EXTERNALWORKEXPERIENCE_DRAFTS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['companyName', TYPE_STRING],
      ['projectName', TYPE_STRING],
      ['workPackage', TYPE_STRING],
      ['customer', TYPE_STRING],
      ['rolePlayed', TYPE_STRING],
      ['startDate', TYPE_STRING],
      ['endDate', TYPE_STRING],
      ['employee_ID', TYPE_STRING],
      ['comments', TYPE_STRING],
    ]);
  }

  public async deleteMany(externalWorkExperience: ExternalWorkExperience[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    await super.deleteMany(externalWorkExperience, draftMode);
  }
}
