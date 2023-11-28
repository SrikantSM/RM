import { Catalogs2Skills } from 'test-commons';
import { v4 as uuid } from 'uuid';
import {
    skillWithDescription1, skillWithDescription2, skillWithDescription3, skillWithDescription4,
} from './skill';

const { catalog1, catalog2 } = require('./catalogs');

const c2s1: Catalogs2Skills = {
    ID: uuid(),
    skill_ID: skillWithDescription1.ID,
    catalog_ID: catalog1.ID,
};

const c2s2: Catalogs2Skills = {
    ID: uuid(),
    skill_ID: skillWithDescription2.ID,
    catalog_ID: catalog2.ID,
};

const c2s3: Catalogs2Skills = {
    ID: uuid(),
    skill_ID: skillWithDescription3.ID,
    catalog_ID: catalog1.ID,
};

const c2s4: Catalogs2Skills = {
    ID: uuid(),
    skill_ID: skillWithDescription4.ID,
    catalog_ID: catalog1.ID,
};

const c2s5: Catalogs2Skills = {
    ID: uuid(),
    skill_ID: skillWithDescription3.ID,
    catalog_ID: catalog2.ID,
};

const c2s6: Catalogs2Skills = {
    ID: uuid(),
    skill_ID: skillWithDescription4.ID,
    catalog_ID: catalog2.ID,
};

const catalogs2skills = [
    c2s1,
    c2s2,
    c2s3,
    c2s4,
    c2s5,
    c2s6,
];

export {
    catalogs2skills,
    c2s1,
    c2s2,
    c2s3,
    c2s4,
    c2s5,
    c2s6,
};
