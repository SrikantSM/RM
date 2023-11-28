import { Photo } from 'test-commons';
import { v4 as uuid } from 'uuid';
import {
    workforcePersonWithDescription1,
    workforcePersonWithDescription2,
    workforcePersonWithDescription3,
    workforcePersonManagerWithDescription,
} from './WorkforcePerson';

const photo1: Photo = {
    ID: uuid(),
    parent: workforcePersonWithDescription1.ID,
    imageURL: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
    type_code: '1',
    isMediaStream: false,
};

const photo2: Photo = {
    ID: uuid(),
    parent: workforcePersonWithDescription2.ID,
    imageURL: 'https://homepages.cae.wisc.edu/~ece533/images/baboon.png',
    type_code: '1',
    isMediaStream: false,
};

const photo3: Photo = {
    ID: uuid(),
    parent: workforcePersonManagerWithDescription.ID,
    imageURL: 'https://homepages.cae.wisc.edu/~ece533/images/cat.png',
    type_code: '1',
    isMediaStream: false,
};

const photo4: Photo = {
    ID: uuid(),
    parent: workforcePersonWithDescription3.ID,
    imageURL: 'https://homepages.cae.wisc.edu/~ece533/images/fan.png',
    type_code: '1',
    isMediaStream: false,
};

const allPhotos = [
    photo1,
    photo2,
    photo3,
    photo4,
];

export {
    allPhotos,
    photo1,
    photo2,
    photo3,
    photo4,
};
