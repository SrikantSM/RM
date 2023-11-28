function getCSVData(testRunId) {
  const data = [
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/0005c151-5b5a-4a66-8aac-60e734beb1ab${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'sector-specific',
      preferredLabel: `manage musical staff ${testRunId}`,
      altLabels: `manage staff of music ${testRunId}\n`
        + `coordinate duties of musical staff ${testRunId}\n`
        + `manage music staff ${testRunId}`,
      description: `Assign and manage staff tasks in areas such as scoring, arranging, copying music and vocal coaching.   ${testRunId}`,
      catalogs: `music${testRunId}`,
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
      description: `Supervise the operations of a correctional facility or other correctional procedures, ensuring that they are compliant with legal regulations, and ensure that the staff complies with regulations, and aim to improve the facility's efficiency and safety.   ${testRunId}`,
      catalogs: `other${testRunId}\n`
        + `programming${testRunId}`,
    },
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/00064735-8fad-454b-90c7-ez758cc993f2${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'occupation-specific',
      preferredLabel: `java programming ${testRunId}`,
      altLabels: `java ${testRunId}\n`
        + `spring boot ${testRunId}\n`
        + `JAVA ${testRunId}`,
      description: `Java programming.  ${testRunId}`,
      catalogs: `programming${testRunId}`,
    },
  ];
  return data;
}

function getCSVDataDE(testRunId) {
  const data = [
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/0005c151-5b5a-4a66-8aac-60e734beb1ab${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'sector-specific',
      preferredLabel: `de manage musical staff ${testRunId}`,
      altLabels: `manage staff of music ${testRunId}\n`
        + `coordinate duties of musical staff ${testRunId}\n`
        + `manage music staff ${testRunId}`,
      description: `Assign and manage staff tasks in areas such as scoring, arranging, copying music and vocal coaching.   ${testRunId}`,
    }, {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/00064735-8fad-454b-90c7-ed858cc993f2${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'occupation-specific',
      preferredLabel: `de supervise correctional procedures ${testRunId}`,
      altLabels: `oversee prison procedures ${testRunId}\n`
        + `manage correctional procedures ${testRunId}\n`
        + `monitor correctional procedures ${testRunId}\n`
        + `manage prison procedures ${testRunId}\n`
        + `monitor prison procedures ${testRunId}\n`
        + `oversee correctional procedures ${testRunId}`,
      description: `Supervise the operations of a correctional facility or other correctional procedures, ensuring that they are compliant with legal regulations, and ensure that the staff complies with regulations, and aim to improve the facility's efficiency and safety.   ${testRunId}`,
    },
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/00064735-8fad-454b-90c7-ez758cc993f2${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'occupation-specific',
      preferredLabel: `de java programming ${testRunId}`,
      altLabels: `java ${testRunId}\n`
        + `spring boot ${testRunId}\n`
        + `JAVA ${testRunId}`,
      description: `Java programming.  ${testRunId}`,
    },
  ];
  return data;
}

function getDuplicateCSVData(testRunId) {
  const data = [
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/0005c151-5b5a-4a66-8aac-60e734beb1hh${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'sector-specific',
      preferredLabel: `abap ${testRunId}`,
      altLabels: `ABAP ${testRunId}\n`
        + `abap programming ${testRunId}`,
      description: `SAP abap programming.   ${testRunId}`,
    }, {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/0005c151-5b5a-4a66-8aac-60e734beb1hh${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'occupation-specific',
      preferredLabel: `abap ${testRunId}`,
      altLabels: `ABAP ${testRunId}\n`
        + `abap programming ${testRunId}`,
      description: `SAP abap programming.   ${testRunId}`,
    },
  ];
  return data;
}

function getTooLongNameCSVData(testRunId) {
  const data = [
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/00064735-8fad-454b-90c7-ez758cc993f8${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'occupation-specific',
      preferredLabel: `too long name orem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lore${testRunId}`,
      altLabels: `java ${testRunId}\n`
        + `spring boot ${testRunId}\n`
        + `JAVA ${testRunId}`,
      description: `Java programming.  ${testRunId}`,
    },
  ];
  return data;
}

function getTooLongDescriptionCSVData(testRunId) {
  const data = [
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/00064735-8fad-454b-90c7-ez758cc993f6${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'occupation-specific',
      preferredLabel: `too long description ${testRunId}`,
      altLabels: `java ${testRunId}\n`
        + `spring boot ${testRunId}\n`
        + `JAVA ${testRunId}`,
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie, mauris at pharetra ullamcorper, nisi neque volutpat eros, eu vehicula purus mi quis magna. Nunc nec tortor vitae purus tristique euismod. In ornare nisi a metus iaculis, porttitor varius diam venenatis. Donec vel tortor nec turpis convallis ullamcorper pharetra at ante. Proin sed libero at nunc accumsan mattis vitae vel enim. Integer eu vestibulum nisl, quis ultricies nisi. Mauris gravida maximus purus nec tincidunt. Nulla rutrum pulvinar vestibulum. Suspendisse auctor lobortis ligula vitae porttitor. Praesent molestie, turpis quis consequat eleifend, enim lorem scelerisque ligula, non auctor est risus a mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis, lorem ut pulvinar sollicitudin, quam sem fermentum urna, semper pharetra turpis lectus ut dolor. Quisque arcu augue, tincidunt in massa nec, dignissim tempus mi. Maecenas vitae arcu ut risus porttitor suscipit. Aliquam sed mattis lacus, vel pretium elit. Aenean rhoncus nunc a leo gravida, at facilisis metus mattis. Suspendisse porttitor in nibh eget malesuada. Ut id lobortis justo. Suspendisse viverra odio nunc, a laoreet arcu volutpat ac. Mauris magna ex, rhoncus feugiat mi eget, tempus dapibus tortor. Mauris egestas accumsan rutrum. Etiam pulvinar lorem auctor magna molestie, in fringilla velit maximus. Fusce vel lacus efficitur, interdum tellus at, gravida nibh. Fusce a molestie lectus. Curabitur libero erat, dignissim ac libero at, imperdiet ultricies risus. Sed mattis non dolor in eleifend. Ut interdum est ac imperdiet dapibus. Pellentesque finibus justo tellus. Ut ultrices purus at magna tempus, ut sodales odio pretium. Sed ex dui, tincidunt id scelerisque vel, tempor ac nisi. Donec id gravida quam, eget consequat turpis. Morbi luctus felis eu ornare condimentum. Curabitur nec orci finibus, condimentum odio vitae, congue magna. Mauris gravida, mi in consectetur efficitur, orci nunc tincidunt libero, ut molestie sem orci vestibulum neque. In nulla diam, condimentum vel feugiat et, dictum eget lacus. In gravida odio quis luctus hendrerit. Cras ut molestie risus, iaculis aliquet libero. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean in cursus ante. Integer cursus accumsan ultrices. Donec vitae iaculis neque, vitae dapibus magna. Nulla nec turpis vehicula, tempus libero a, mattis sem. Mauris pretium sollicitudin mauris non commodo. Quisque placerat justo est, sit amet ultricies enim facilisis eget. Nulla facilisis ac metus at porta. Vestibulum vestibulum iaculis diam non varius. Sed at justo tempus, feugiat odio at, pharetra velit. Nam mauris libero, pharetra eget pharetra et, vestibulum nec arcu. Cras vulputate eget sapien quis consectetur. In scelerisque arcu at libero accumsan, eu molestie ante venenatis. Pellentesque luctus elit mattis tortor sagittis, at vestibulum erat porta. Aenean maximus felis sit amet est tempus, et ultrices ligula volutpat. Nunc fringilla, nisi sit amet aliquam porta, sem est fringilla tortor, at mattis metus erat ut turpis. Quisque vel molestie urna. Maecenas sapien erat, tempor in nisi quis, bibendum scelerisque lorem. Integer massa ligula, maximus et erat at, suscipit dictum arcu. Aenean turpis lorem, aliquam vitae risus sed, venenatis tempus mi. Pellentesque iaculis molestie volutpat. Proin sem enim, semper eu iaculis ut, accumsan a eros. In metus purus, suscipit ac leo et, scelerisque ultrices nunc. Aliquam dapibus augue a mollis congue. Nunc et arcu vitae odio tempor venenatis a eget tortor. Nam vestibulum mauris et nibh volutpat imperdiet. Fusce vitae dictum massa. Aenean quis lacus et sapien luctus tincidunt interdum et augue. Fusce consectetur aliquam efficitur. Vestibulum sodales lorem ac est ornare euismod eu gravida mi. Etiam facilisis et orci nec dictum. Nunc egestas, eros ultricies maximus ultricies, ante ligula venenatis diam, non congue quam mauris vel ex. Pellentesque ac viverra est turpis.${testRunId}`,
    },
  ];
  return data;
}

function getUsageData(testRunId) {
  const data = [
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/0005c151-5b5a-4a66-8aac-60e734beb1ab${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'sector-specific',
      preferredLabel: `restricted ${testRunId}`,
      altLabels: `restricted ${testRunId}`,
      description: `restricted ${testRunId}`,
    }, {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/00064735-8fad-454b-90c7-ed858cc993f2${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'occupation-specific',
      preferredLabel: `unrestricted ${testRunId}`,
      altLabels: `unrestricted ${testRunId}`,
      description: `unrestricted ${testRunId}`,
    },
  ];
  return data;
}

function getWrongUsageData(testRunId) {
  const data = [
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/wrong-usage-data-${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'occupation-specific',
      preferredLabel: `wrong usage data ${testRunId}`,
      altLabels: `wrong usage data ${testRunId}`,
      description: `wrong usage data ${testRunId}`,
      usage: 'xyz',
    },
  ];
  return data;
}

function getDeltaUploadInitialCsvData(testRunId) {
  const data = [
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/delta-first-${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'sector-specific',
      preferredLabel: `first ${testRunId}`,
      altLabels: `first alt label 1${testRunId}`,
      description: `first description${testRunId}`,
    },
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/delta-second-${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'sector-specific',
      preferredLabel: `second ${testRunId}`,
      altLabels: `second alt label 1 ${testRunId}`,
      description: `second description ${testRunId}`,
    },
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/delta-third-${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'sector-specific',
      preferredLabel: `third ${testRunId}`,
      altLabels: `third alt label 1 ${testRunId}`,
      description: `third description ${testRunId}`,
    },
  ];
  return data;
}

function getDeltaUploadUpdatedCsvData(testRunId) {
  const data = [
    // Add a new skill
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/delta-fourth-${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'sector-specific',
      preferredLabel: `fourth ${testRunId}`,
      altLabels: `fourth alt label 1 ${testRunId}`,
      description: `fourth description ${testRunId}`,
    },
    // Update the description of an existing skill
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/delta-first-${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'sector-specific',
      preferredLabel: `first ${testRunId}`,
      altLabels: `first alt label 1 ${testRunId}`,
      description: `updated first description ${testRunId}`,
    },
    // Update alternative names of an existing skill
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/delta-second-${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'sector-specific',
      preferredLabel: `second ${testRunId}`,
      altLabels: `additional second alt label 1 ${testRunId}\n`
        + `additional second alt label 2 ${testRunId}`,
      description: `second description ${testRunId}`,
    },
    // Change the (primary) name for an existing skill
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/delta-third-${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'sector-specific',
      preferredLabel: `updated third ${testRunId}`,
      altLabels: `third alt label 1 ${testRunId}`,
      description: `third description ${testRunId}`,
    },
  ];
  return data;
}

function getEvilSkillCSVData(testRunId) {
  const data = [
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `<script src="https://evilpage.de/assets/js/evilScript.js"></script>${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'sector-specific',
      preferredLabel: `evil manage musical staff ${testRunId}`,
      altLabels: `manage staff of music ${testRunId}\n`
        + `coordinate duties of musical staff ${testRunId}\n`
        + `manage music staff ${testRunId}`,
      description: `Assign and manage staff tasks in areas such as scoring, arranging, copying music and vocal coaching.   ${testRunId}`,
    },
  ];
  return data;
}

function getForbiddenFirstCharacterSkillCSVData(testRunId) {
  const data = [
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/00064735-8fad-454b-90c7-eb758cc993f2${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'sector-specific',
      preferredLabel: `evil manage musical staff ${testRunId}`,
      altLabels: `manage staff of music ${testRunId}\n`
        + `coordinate duties of musical staff ${testRunId}\n`
        + `manage music staff ${testRunId}`,
      description: `@Assign and manage staff tasks in areas such as scoring, arranging, copying music and vocal coaching.   ${testRunId}`,
    },
  ];
  return data;
}

function getWrongConceptTypeCSVData(testRunId) {
  const data = [
    {
      conceptType: 'TestSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/00064735-8fad-454b-90c7-eb758cc993f2${testRunId}`,
      skillType: 'skill/competence',
      reuseLevel: 'occupation-specific',
      preferredLabel: `wrong concept type ${testRunId}`,
      altLabels: `wrong ${testRunId}`,
      description: `wrong concept type  ${testRunId}`,
    },
  ];
  return data;
}

function getMissingSkillTypeCSVData(testRunId) {
  const data = [
    {
      conceptType: 'KnowledgeSkillCompetence',
      conceptUri: `http://data.europa.eu/esco/skill/00064735-8fad-454b-90c7-eb758cc993f2${testRunId}`,
      skillType: ' ',
      reuseLevel: 'occupation-specific',
      preferredLabel: `missing skill type ${testRunId}`,
      altLabels: `missing ${testRunId}`,
      description: `missing skill type   ${testRunId}`,
    },
  ];
  return data;
}

module.exports.getCSVData = getCSVData;
module.exports.getCSVDataDE = getCSVDataDE;
module.exports.getDuplicateCSVData = getDuplicateCSVData;
module.exports.getTooLongNameCSVData = getTooLongNameCSVData;
module.exports.getTooLongDescriptionCSVData = getTooLongDescriptionCSVData;
module.exports.getUsageData = getUsageData;
module.exports.getWrongUsageData = getWrongUsageData;
module.exports.getDeltaUploadInitialCsvData = getDeltaUploadInitialCsvData;
module.exports.getDeltaUploadUpdatedCsvData = getDeltaUploadUpdatedCsvData;
module.exports.getEvilSkillCSVData = getEvilSkillCSVData;
module.exports.getForbiddenFirstCharacterSkillCSVData = getForbiddenFirstCharacterSkillCSVData;
module.exports.getWrongConceptTypeCSVData = getWrongConceptTypeCSVData;
module.exports.getMissingSkillTypeCSVData = getMissingSkillTypeCSVData;
