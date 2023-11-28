export interface SkillMasterListAll {
    ID: string;
    commaSeparatedAlternativeLabels?: string;
    description?: string;
    name: string;
    lifecycleStatus_code: number;
    modifiedAt?: Date;
    createdAt?: Date;
    modifiedBy?: string;
    proficiencySet_ID?: string;
}
