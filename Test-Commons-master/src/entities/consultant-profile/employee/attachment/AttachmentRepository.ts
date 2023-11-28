import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
  TYPE_BINARY,
  TYPE_TIMESTAMP,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { Attachment } from './Attachment';

export class AttachmentRepository extends EntityRepository<Attachment> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_EMPLOYEE_ATTACHMENT';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['modifiedAt', TYPE_TIMESTAMP],
      ['ID', TYPE_STRING],
      ['employee_ID', TYPE_STRING],
      ['content', TYPE_BINARY],
      ['fileName', TYPE_STRING],
    ]);
  }
}
