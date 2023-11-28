import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../../utils';
import { SkillAssignment } from './SkillAssignment';
import { DraftEnabledEntityRepository } from '../../../DraftEnabledEntityRepository';
import { EntityDraftMode } from '../../../EntityDraftMode.enum';

export class SkillAssignmentRepository extends DraftEnabledEntityRepository<SkillAssignment> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_EMPLOYEE_QUALIFICATIONS_SKILLASSIGNMENTS';
  }

  get draftTableName(): string {
    return 'MYPROJECTEXPERIENCESERVICE_SKILLS_DRAFTS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', TYPE_STRING],
      ['skill_ID', TYPE_STRING],
      ['employee_ID', TYPE_STRING],
      ['proficiencyLevel_ID', TYPE_STRING],
    ]);
  }

  public async deleteMany(skillAssignment: SkillAssignment[], draftMode: EntityDraftMode = EntityDraftMode.BOTH): Promise<any> {
    await super.deleteMany(skillAssignment, draftMode);
  }
}
