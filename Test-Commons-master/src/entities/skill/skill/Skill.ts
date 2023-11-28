export interface Skill {
  createdAt?: string;
  modifiedAt?: string;
  modifiedBy?: string;
  ID: string;
  OID?: string;
  externalID?: string;
  commaSeparatedAlternativeLabels?: string;
  description?: string;
  name?: string;
  lifecycleStatus_code: number;
  proficiencySet_ID?: string; // Optional for now (migration), but we should aim to make it mandatory
}
