import {
  HanaSqlGenerator,
  SqlGenerator,
  StatementExecutor,
} from '../../../utils';
import { EntityRepository } from '../../EntityRepository';
import { DemandCapacityRequirement } from './DemandCapacityRequirement';

export class DemandCapacityRequirementRepository extends EntityRepository<
DemandCapacityRequirement
> {
  public constructor(
    statementExecutor: StatementExecutor,
    sqlGenerator: SqlGenerator = new HanaSqlGenerator(),
  ) {
    super(statementExecutor, sqlGenerator);
  }

  get tableName(): string {
    return 'COM_SAP_RESOURCEMANAGEMENT_PROJECT_DEMANDCAPACITYREQUIREMENTS';
  }

  get keyAttributeName(): string {
    return 'ID';
  }

  get attributeNames(): Map<string, string> {
    return new Map([
      ['ID', 'string'],
      ['startDate', 'string'],
      ['endDate', 'string'],
      ['requestedQuantity', 'string'],
      ['requestedUoM', 'string'],
      ['demand_ID', 'string'],
    ]);
  }
}
