import { ProjectRoleText } from 'test-commons';
import { v4 as uuidv4 } from 'uuid';
import { correctDefaultLanguage, correctNonDefaultLanguage } from './Languages';
import { projectRoleDescription, projectRoleWithDescription3, projectRoleWithDescription4 } from './ProjectRoles';

const projectRoleDescriptionDe = {
    description: 'API-Projekt Rollenbeschreibung.',
};

const projectRoleWithDescription3En: ProjectRoleText = {
    ID_texts: uuidv4(),
    ID: projectRoleWithDescription3.ID,
    name: projectRoleWithDescription3.name,
    description: projectRoleDescription.description,
    locale: correctDefaultLanguage.code,
};

const projectRoleWithDescription3De: ProjectRoleText = {
    ID_texts: uuidv4(),
    ID: projectRoleWithDescription3.ID,
    name: 'Rollenname3',
    description: projectRoleDescriptionDe.description,
    locale: correctNonDefaultLanguage.code,
};

const projectRoleWithDescription4En: ProjectRoleText = {
    ID_texts: uuidv4(),
    ID: projectRoleWithDescription4.ID,
    name: projectRoleWithDescription4.name,
    description: projectRoleDescription.description,
    locale: correctDefaultLanguage.code,
};

const projectRoleWithDescription4De: ProjectRoleText = {
    ID_texts: uuidv4(),
    ID: projectRoleWithDescription4.ID,
    name: 'Rollenname4',
    description: projectRoleDescriptionDe.description,
    locale: correctNonDefaultLanguage.code,
};

const allProjectRolesTexts = [
    projectRoleWithDescription3En,
    projectRoleWithDescription3De,
    projectRoleWithDescription4En,
    projectRoleWithDescription4De,
];

export {
    allProjectRolesTexts,
    projectRoleWithDescription3En,
    projectRoleWithDescription3De,
    projectRoleWithDescription4En,
    projectRoleWithDescription4De,
};
