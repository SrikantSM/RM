import { CsvParser, CsvWriter, ProficiencyLevel, Skill, SkillAssignment } from "test-commons";
import { proficiencyLevelFileName, skillAssignmentFileName, skillFileName } from "./config";

/**
 * Small helper script to add random valid proficiency levels to skill assignments
 */

const parser = new CsvParser();
const writer = new CsvWriter();

async function main() {
    const skills = await parser.parseFile<Skill>('csv/' + skillFileName + '.csv', ',');
    const proficiencyLevels = await parser.parseFile<ProficiencyLevel>('csv/' + proficiencyLevelFileName + '.csv', ',');
    const skillAssignments = await parser.parseFile<SkillAssignment>('csv/' + skillAssignmentFileName + '.csv', ',');
    for (const a of skillAssignments) {
        const skill = skills.find(s => s.ID === a.skill_ID);
        if (!skill) throw new Error("skill not found");
        const pls = proficiencyLevels.filter(l => l.proficiencySet_ID === skill.proficiencySet_ID);
        if (pls.length === 0) throw new Error("pls not found");
        const random = pls[Math.floor(Math.random() * pls.length)];
        if (!random) throw new Error("random went wrong");
        a.proficiencyLevel_ID = random.ID;
    }
    writer.createCsvFile('csv/' + skillAssignmentFileName + '_new.csv', skillAssignments);
}

main();
