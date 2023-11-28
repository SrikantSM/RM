import { SkillAssignment, EmployeeHeader } from 'test-commons';
import * as staticData from '../../staticData';
import { getEmployeeHeadersBatchDynamicData } from './employeeHeaders';
import { SKILL_ASSIGNMENT_COUNT, SKILL_ASSIGNMENT_CATEGORY_BATCH_SIZE } from './config';
import { proficiencyLevels } from '../../staticData/Skill/proficiencyLevels';

const uuid = require('uuid').v4;

const { skills } = staticData;
let lastBatchNum: number | null = null;
let skillAssignments: SkillAssignment[] = [];

export function getSkillAssignmentsBatchDynamicData(batchNum: number) {
	if (batchNum !== lastBatchNum) {
		const employeeHeaders: EmployeeHeader[] = getEmployeeHeadersBatchDynamicData(batchNum);
		skillAssignments = [];
		const num = (batchNum - 1) * 4;
		let skillStartIndex = 0;
		for (let count = 0; count < employeeHeaders.length; count += 1) {
			const empHeader = employeeHeaders[count];
			if ((count !== 0) && ((count % SKILL_ASSIGNMENT_CATEGORY_BATCH_SIZE) === 0)) {
				skillStartIndex += 1;
			}
			for (let x = 0; x < SKILL_ASSIGNMENT_COUNT; x += 1) {
				const skillTextIndex = ((num + x + skillStartIndex) % (skills.length));
				const assignSkill = skills[skillTextIndex];
				const levels = proficiencyLevels.filter((l) => l.proficiencySet_ID === assignSkill.proficiencySet_ID);
				const skillAssignment: SkillAssignment = {
					ID: uuid(),
					skill_ID: assignSkill.ID!,
					employee_ID: empHeader.ID,
					proficiencyLevel_ID: levels[(count * SKILL_ASSIGNMENT_COUNT + x) % (levels.length)].ID,
				};
				skillAssignments.push(skillAssignment);
			}
		}
		lastBatchNum = batchNum;
	}
	return skillAssignments;
}
