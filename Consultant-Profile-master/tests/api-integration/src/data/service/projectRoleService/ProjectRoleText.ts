import { v4 as uuid } from 'uuid';
import { ProjectRoleText } from '../../../serviceEntities/projectRoleService';
import { correctDefaultLanguage, correctNonDefaultLanguage } from '../../db/config/Languages';

const projectRoleTextDescription = {
    description: 'API-Project Role Text Description.',
};

const correctRoleText: ProjectRoleText = {
    ID_texts: uuid(),
    ID: uuid(),
    locale: correctDefaultLanguage.code,
    name: 'Test role text',
    description: projectRoleTextDescription.description,
};

const correctRoleTextInAnotherLanguage: ProjectRoleText = {
    ID_texts: uuid(),
    ID: uuid(),
    locale: correctNonDefaultLanguage.code,
    name: 'Role non default language',
    description: projectRoleTextDescription.description,
};

const roleTextWithNullName: ProjectRoleText = {
    ID: uuid(),
    ID_texts: uuid(),
    name: ' ',
    locale: correctDefaultLanguage.code,
    description: projectRoleTextDescription.description,
};

const roleTextWithEmptyName: ProjectRoleText = {
    ID_texts: uuid(),
    ID: uuid(),
    locale: correctDefaultLanguage.code,
    name: '',
    description: projectRoleTextDescription.description,
};

const roleTextWithNonExistingLanguage: ProjectRoleText = {
    ID_texts: uuid(),
    ID: uuid(),
    locale: 'JA',
    name: 'Non existing language code',
    description: projectRoleTextDescription.description,
};

const roleTextWithNullLanguage: ProjectRoleText = {
    ID_texts: uuid(),
    ID: uuid(),
    name: 'No language code',
    description: projectRoleTextDescription.description,
};

const evilRoleTextName: ProjectRoleText = {
    ID_texts: uuid(),
    ID: uuid(),
    locale: correctDefaultLanguage.code,
    name: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
    description: projectRoleTextDescription.description,
};

export {
    correctRoleText,
    projectRoleTextDescription,
    correctRoleTextInAnotherLanguage,
    roleTextWithNullName,
    roleTextWithEmptyName,
    roleTextWithNonExistingLanguage,
    roleTextWithNullLanguage,
    evilRoleTextName,
};
