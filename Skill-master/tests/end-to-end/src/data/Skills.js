const uuid = require('uuid').v4;

const correctSkill = Object.freeze({
  ID: uuid(),
  externalID: uuid(),
  lifecycleStatus_code: 0,
  name: 'CorrectSkill',
  description: 'CorrectSkill',
});

const correctDraftSkill = Object.freeze({
  ID: uuid(),
  externalID: uuid(),
  lifecycleStatus_code: 0,
  name: 'CorrectDraftSkill',
  description: 'CorrectDraftSkill',
});

const multiLanguageSkill = Object.freeze({
  ID: uuid(),
  externalID: uuid(),
  lifecycleStatus_code: 0,
  name: 'DownloadMessageCheckSkill1',
  description: 'DownloadMessageCheckSkill1',
});

const allSkills = [correctSkill, correctDraftSkill, multiLanguageSkill];
module.exports = {
  allSkills, correctSkill, correctDraftSkill, multiLanguageSkill,
};
