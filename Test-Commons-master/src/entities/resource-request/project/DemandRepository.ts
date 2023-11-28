import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { Demand } from './Demand';

export class DemandRepository extends EntityRepository<Demand> {
  public constructor(
    statementExecutor: StatementExecutor,
    sqlGenerator: SqlGenerator = new HanaSqlGenerator(),
  ) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_PROJECT_DEMANDS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', 'string'],
      ['externalID', 'string'],
      ['startDate', 'string'],
      ['endDate', 'string'],
      ['requestedQuantity', 'string'],
      ['requestedUoM', 'string'],
      ['workItem', 'string'],
      ['workItemName', 'string'],
      ['billingRole_ID', 'string'],
      ['billingCategory_ID', 'string'],
      ['workPackage_ID', 'string'],
      ['deliveryOrganization_code', 'string'],
    ]);
  }
}
