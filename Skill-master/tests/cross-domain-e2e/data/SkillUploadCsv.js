function getSkillUploadCsvData(testRunId) {
  const data = [
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/0005c151-5b5a-4a66-8aac-60e734beb1ab${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'sector-specific',
      preferredLabel: `manage musical staff ${testRunId}`,
      altLabels: `manage staff of music ${testRunId}\n`
        + `coordinate duties of musical staff ${testRunId}\n`
        + `manage music staff ${testRunId}\n`
        + `direct musical staff ${testRunId}`,
      description: `Assign and manage staff tasks in areas such as scoring, arranging, copying music and vocal coaching. ${testRunId}`,
    }, {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/00064735-8fad-454b-90c7-ed858cc993f2${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'occupation-specific',
      preferredLabel: `supervise correctional procedures ${testRunId}`,
      altLabels: `oversee prison procedures ${testRunId}\n`
        + `manage correctional procedures ${testRunId}\n`
        + `monitor correctional procedures ${testRunId}\n`
        + `manage prison procedures ${testRunId}\n`
        + `monitor prison procedures ${testRunId}\n`
        + `oversee correctional procedures ${testRunId}`,
      description: `Supervise the operations of a correctional facility or other correctional procedures, ensuring that they are compliant with legal regulations, and ensure that the staff complies with regulations, and aim to improve the facility's efficiency and safety. ${testRunId}`,
    },
  ];
  return data;
}

module.exports = getSkillUploadCsvData;
