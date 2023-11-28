import { ProficiencyLevels } from './ProficiencyLevels';

export interface ProficiencySets {
    ID: string;
    name: string;
    description: string;
    maxRank: number;
    proficiencyLevels?: ProficiencyLevels[],
}
