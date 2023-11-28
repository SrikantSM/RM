const { CsvWriter } = require('test-commons');

module.exports = class SkillCsvGenerator {
  async generateCsvFile(testRunId, skillCount, filePath) {
    console.log(`[INFO] Starting generating a CSV file with ${skillCount} skills`);
    const skills = this.generateSkills(testRunId, skillCount);

    console.log(`[INFO] Writing generated CSV file to ${filePath}`);
    const csvWriter = new CsvWriter();
    await csvWriter.createCsvFile(filePath, skills);

    console.log('[INFO] Finished Skill CSV generation');
  }

  generateSkills(testRunId, skillCount) {
    const skills = [];
    for (let i = 0; i < skillCount; i += 1) {
      const skill = {
        conceptType: 'KnowledgeSkillCompetence',
        conceptUri: `SUPA/${testRunId}/${i}`,
        skillType: 'skill/competence',
        reuseLevel: 'occupation-specific',
        preferredLabel: `SUPA Preferred Label Upload Performance Test ${testRunId}/${i}`,
        altLabels: `SUPA Alternative Label Upload Performance Test 1 ${testRunId}/${i}
              SUPA Alternative Label Upload Performance Test 2 ${testRunId}/${i}
              SUPA Alternative Label Upload Performance Test 3 ${testRunId}/${i}`,
        description: `SUPA Description Upload Performance Test ${testRunId}/${i}`,
        catalogs: this.getCatalogNames(i),
      };
      skills.push(skill);
    }
    return skills;
  }

  getCatalogNames(index) {
    switch (index % 3) {
      case 0:
        return '';
      case 1:
        return 'Catalog Name 1';
      case 2:
        return `Catalog Name 2
              Catalog Name 3
              Catalog Name 4
              Catalog Name 5`;
      default:
        throw new Error();
    }
  }
};
