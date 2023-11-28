export interface SkillAssignments {
    ID?: string;
    profileID?: string;
    skillID?: string;
    proficiencyLevelID?: string;
    skillName?: string | null;
    proficiencyLevelName?: string | null;
    skillUsage?: number | null;
    changedAt?: string | null;
    changedBy?: string | null;
}
