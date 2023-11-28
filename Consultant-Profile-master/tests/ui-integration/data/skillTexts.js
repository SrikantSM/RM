const uuid = require('uuid').v4;
const skills = require('./skills');

const skillText1 = { ID_texts: uuid() };
const skillText2 = { ID_texts: uuid() };
const skillText3 = { ID_texts: uuid() };
const skillText4 = { ID_texts: uuid() };
const skillText5 = { ID_texts: uuid() };

Object.assign(skillText1, skills.skill1);
Object.assign(skillText2, skills.skill2);
Object.assign(skillText3, skills.skill3);
Object.assign(skillText4, skills.skill4);
Object.assign(skillText5, skills.skill5);

const skillTexts = [
    skillText1,
    skillText2,
    skillText3,
    skillText4,
    skillText5,
];

module.exports = {
    skillTexts,
    skillText1,
    skillText2,
    skillText3,
    skillText4,
    skillText5,
};
