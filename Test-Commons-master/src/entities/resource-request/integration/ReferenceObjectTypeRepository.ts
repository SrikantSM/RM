import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
  TYPE_NUMBER,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { ReferenceObjectType } from './ReferenceObjectType';

export class ReferenceObjectTypeRepository extends EntityRepository<ReferenceObjectType> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_INTEGRATION_REFERENCEOBJECTTYPES';
  }

  get keyAttributeName(): string {
    return 'code';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['code', TYPE_NUMBER],
      ['name', TYPE_STRING],
    ]);
  }
}
