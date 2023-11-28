import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
  TYPE_STRING,
  TYPE_NUMBER,
} from '../../../../utils';
import { EntityRepository } from '../../../EntityRepository';
import { BookedCapacityAggregate } from './BookedCapacityAggregate';

export class BookedCapacityAggregateRepository extends EntityRepository<BookedCapacityAggregate> {
  public constructor(statementExecutor: StatementExecutor, sqlGenerator: SqlGenerator = new HanaSqlGenerator()) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_RESOURCE_BOOKEDCAPACITYAGGREGATE';
  }

  get keyAttributeName(): string {
    return 'resourceID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['resourceID', TYPE_STRING],
      ['startTime', TYPE_STRING],
      ['bookedCapacityInMinutes', TYPE_NUMBER],
      ['softBookedCapacityInMinutes', TYPE_NUMBER],
    ]);
  }

  public async deleteAll() {
    const statement = 'DELETE FROM COM_SAP_RESOURCEMANAGEMENT_RESOURCE_BOOKEDCAPACITYAGGREGATE';
    return this.statementExecutor.execute(statement);
  }

  public async populateTable() {
    const statement = 'UPSERT COM_SAP_RESOURCEMANAGEMENT_RESOURCE_BOOKEDCAPACITYAGGREGATE SELECT RESOURCE_ID AS RESOURCEID, STARTTIME, TOTALRESOURCEBOOKEDCAPACITYINMINUTES AS BOOKEDCAPACITYINMINUTES, TOTALRESOURCESOFTBOOKEDCAPACITYINMINUTES AS SOFTBOOKEDCAPACITYINMINUTES FROM COM_SAP_RESOURCEMANAGEMENT_ASSIGNMENT_RESOURCEAGGREGATEDBOOKEDCAPACITY';
    return this.statementExecutor.execute(statement);
  }
}
