const uuid = require('uuid').v4;

const correctCatalog = Object.freeze({
  ID: uuid(),
  name: 'CorrectCatalog',
  description: 'CorrectCatalog',
});

const correctDraftCatalog = Object.freeze({
  ID: uuid(),
  name: 'CorrectDraftCatalog',
  description: 'CorrectDraftCatalog',
});

const programmingCatalog = Object.freeze({
  ID: uuid(),
  name: 'programming',
  description: 'programming',
});

const musicCatalog = Object.freeze({
  ID: uuid(),
  name: 'music',
  description: 'music',
});

const otherCatalog = Object.freeze({
  ID: uuid(),
  name: 'other',
  description: 'other',
});

const allCatalogs = [correctCatalog, correctDraftCatalog, programmingCatalog, musicCatalog, otherCatalog];
module.exports = {
  allCatalogs, correctCatalog, correctDraftCatalog, programmingCatalog, musicCatalog, otherCatalog,
};
