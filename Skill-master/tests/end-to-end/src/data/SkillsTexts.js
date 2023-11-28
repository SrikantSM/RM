const uuid = require('uuid').v4;
const { correctSkill, correctDraftSkill, multiLanguageSkill } = require('./Skills');

const correctSkillText = Object.freeze({
  ID_texts: uuid(),
  locale: 'en',
  name: 'CorrectSkill',
  description: 'CorrectSkill',
  ID: correctSkill.ID,
});

const correctDraftSkillText = Object.freeze({
  ID_texts: uuid(),
  locale: 'en',
  name: 'CorrectDraftSkill',
  description: 'CorrectDraftSkill',
  ID: correctDraftSkill.ID,
});

const multiLanguageSkillText0 = Object.freeze({
  ID_texts: uuid(),
  locale: 'en',
  name: 'MultiLanguageSkillText0',
  description: 'MultiLanguageSkillText0',
  ID: multiLanguageSkill.ID,
});

const multiLanguageSkillText1 = Object.freeze({
  ID_texts: uuid(),
  locale: 'de',
  name: 'MultiLanguageSkillText1',
  description: 'MultiLanguageSkillText1',
  ID: multiLanguageSkill.ID,
});

const allSkillTexts = [correctSkillText, correctDraftSkillText, multiLanguageSkillText0, multiLanguageSkillText1];
module.exports = {
  allSkillTexts, correctSkillText, correctDraftSkillText, multiLanguageSkillText0, multiLanguageSkillText1,
};
