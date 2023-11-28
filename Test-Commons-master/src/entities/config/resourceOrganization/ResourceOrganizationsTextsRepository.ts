import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { ResourceOrganizationsTexts } from './ResourceOrganizationsTexts';

export class ResourceOrganizationsTextsRepository extends EntityRepository<ResourceOrganizationsTexts> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_CONFIG_RESOURCEORGANIZATIONS_TEXTS';
  }

  get keyAttributeName(): string {
    return 'ID_texts';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID_texts', TYPE_STRING],
      ['locale', TYPE_STRING],
      ['ID', TYPE_STRING],
      ['name', TYPE_STRING],
      ['description', TYPE_STRING],
    ]);
  }
}
