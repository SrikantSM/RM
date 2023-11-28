const uuid = require('uuid').v4;
const employeeHeaders = require('./employeeHeaders');

const photo2 = {
    ID: uuid(),
    parent: employeeHeaders.employeeHeader2.ID,
    imageURL: 'https://homepages.cae.wisc.edu/~ece533/images/baboon.png',
    type_code: '1',
    isMediaStream: false,
};

const photo3 = {
    ID: uuid(),
    parent: employeeHeaders.employeeHeader3.ID,
    imageURL: 'https://homepages.cae.wisc.edu/~ece533/images/monarch.png',
    type_code: '1',
    isMediaStream: false,
};

const photo4 = {
    ID: uuid(),
    parent: employeeHeaders.employeeHeader4.ID,
    imageURL: 'https://homepages.cae.wisc.edu/~ece533/images/zelda.png',
    type_code: '1',
    isMediaStream: false,
};

const photos = [
    photo2,
    photo3,
    photo4,
];

module.exports = {
    photos,
    photo2,
    photo3,
    photo4,
};
