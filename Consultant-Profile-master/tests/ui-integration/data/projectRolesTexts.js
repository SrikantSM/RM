const uuid = require('uuid').v4;
const projectRoles = require('./projectRoles');
const languages = require('./languages');

const projectRoleText1 = {
    ID_texts: uuid(),
    ID: projectRoles.projectRole1.ID,
    locale: languages.languageEN.code,
    name: projectRoles.projectRole1.name,
    description: projectRoles.projectRole1.description,
};
const projectRoleText2 = {
    ID_texts: uuid(),
    ID: projectRoles.projectRole2.ID,
    locale: languages.languageEN.code,
    name: projectRoles.projectRole2.name,
    description: projectRoles.projectRole2.description,
};
const projectRoleText3 = {
    ID_texts: uuid(),
    ID: projectRoles.projectRole3.ID,
    locale: languages.languageEN.code,
    name: projectRoles.projectRole3.name,
    description: projectRoles.projectRole3.description,
};
const projectRoleText4 = {
    ID_texts: uuid(),
    ID: projectRoles.projectRole4.ID,
    locale: languages.languageEN.code,
    name: projectRoles.projectRole4.name,
    description: projectRoles.projectRole4.description,
};
const projectRoleText5 = {
    ID_texts: uuid(),
    ID: projectRoles.projectRole5.ID,
    locale: languages.languageEN.code,
    name: projectRoles.projectRole5.name,
    description: projectRoles.projectRole5.description,
};
const projectRoleText6 = {
    ID_texts: uuid(),
    ID: projectRoles.projectRole1.ID,
    locale: languages.languageDE.code,
    name: 'Junior Consultant_de',
    description: 'Junior Consultant German',
};

const projectRolesTexts = [
    projectRoleText1,
    projectRoleText2,
    projectRoleText3,
    projectRoleText4,
    projectRoleText5,
    projectRoleText6,
];

module.exports = {
    projectRolesTexts,
    projectRoleText1,
    projectRoleText2,
    projectRoleText3,
    projectRoleText4,
    projectRoleText5,
    projectRoleText6,
};
