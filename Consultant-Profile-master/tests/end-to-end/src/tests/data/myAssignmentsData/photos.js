const uuid = require('uuid').v4;
const { employeeHeaders } = require('./employeeHeaders');

const employeeHeader1 = employeeHeaders[0];
const employeeHeader2 = employeeHeaders[1];

const employeePhoto = {
    parent: employeeHeader1.ID,
    ID: uuid(),
    imageURL: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
    type_code: '1',
    isMediaStream: false,
};

const managerPhoto = {
    parent: employeeHeader2.ID,
    ID: uuid(),
    imageURL: 'https://homepages.cae.wisc.edu/~ece533/images/cat.png',
    type_code: '1',
    isMediaStream: false,
};

const photos = [
    employeePhoto,
    managerPhoto,
];

module.exports = {
    photos,
};
