import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../../utils';
import { ExternalWorkExperienceSkill } from './ExternalWorkExperienceSkill';
import { EntityRepository } from '../../../EntityRepository';

export class ExternalWorkExperienceSkillRepository extends EntityRepository<ExternalWorkExperienceSkill> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_EMPLOYEE_PRIOREXPERIENCE_EXTERNALWORKEXPERIENCESKILLS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['workExperience_ID', TYPE_STRING],
      ['skill_ID', TYPE_STRING],
      ['employee_ID', TYPE_STRING],
      ['proficiencyLevel_ID', TYPE_STRING],
    ]);
  }
}
