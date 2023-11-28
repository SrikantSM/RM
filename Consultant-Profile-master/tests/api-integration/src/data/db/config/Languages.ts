import { Language } from 'test-commons';

const correctDefaultLanguage: Language = {
    code: 'en',
    name: 'English',
    descr: 'English language',
};

const correctNonDefaultLanguage: Language = {
    code: 'de',
    name: 'German',
    descr: 'German language',
};

const createlanguage: Language = {
    code: 'ja',
    name: 'Japanese',
    descr: 'Japanese language',
};

export {
    createlanguage,
    correctDefaultLanguage,
    correctNonDefaultLanguage,
};
