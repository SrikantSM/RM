import { ProfilePhoto } from 'test-commons';
import { v4 as uuid } from 'uuid';
import {
    employeeHeaderWithDescription1, employeeHeaderWithDescription2, employeeHeaderWithDescription3, employeeHeaderWithDescription4,
} from './Headers';

const ProfilePhoto1: ProfilePhoto = {
    ID: uuid(),
    employee_ID: employeeHeaderWithDescription1.ID,
    profileImage: null!,
    profileThumbnail: null!,
    fileName: null!,
};

const ProfilePhoto2: ProfilePhoto = {
    ID: uuid(),
    employee_ID: employeeHeaderWithDescription2.ID,
    profileImage: null!,
    profileThumbnail: null!,
    fileName: null!,
};

const ProfilePhoto3: ProfilePhoto = {
    ID: uuid(),
    employee_ID: employeeHeaderWithDescription3.ID,
    profileImage: null!,
    profileThumbnail: null!,
    fileName: null!,
};

const ProfilePhoto4: ProfilePhoto = {
    ID: uuid(),
    employee_ID: employeeHeaderWithDescription4.ID,
    profileImage: null!,
    profileThumbnail: null!,
    fileName: null!,
};

const allProfilePhotos = [
    ProfilePhoto1,
    ProfilePhoto2,
    ProfilePhoto3,
    ProfilePhoto4,
];

export {
    allProfilePhotos,
    ProfilePhoto1,
    ProfilePhoto2,
    ProfilePhoto3,
    ProfilePhoto4,
};
