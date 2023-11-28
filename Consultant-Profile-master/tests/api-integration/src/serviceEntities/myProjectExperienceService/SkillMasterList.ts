export interface SkillMasterList {
    ID: string;
    commaSeparatedAlternativeLabels?: string;
    commaSeparatedCatalogs?: string;
    catalogAssociations?: Catalogs2Skills[],
    description?: string;
    name: string;
    lifecycleStatus_code: number;
    modifiedAt?: Date;
    createdAt?: Date;
    modifiedBy?: string;
    proficiencySet_ID?: string;
}

export interface Catalogs2Skills {
    ID: string;
    catalog_ID: string;
    skill_ID: string;
}
