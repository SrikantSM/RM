import { ProfilePhoto, EmployeeHeader } from 'test-commons';
import { getEmployeeHeadersBatchDynamicData } from './employeeHeaders';
import { promises as fs } from 'fs';

const file_name = require('crypto-random-string');
const uuid = require('uuid').v4;
let profilePhotos: ProfilePhoto[] = [];
let lastBatchNum: number | null = null;

export async function getProfilePhotosBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum) {
      const profilePhoto = await fs.readFile('./src/data/dynamicData/Consultant-Profile/ProfilePhoto.png');
      const profilePhotoThumbnail = await fs.readFile('./src/data/dynamicData/Consultant-Profile/ProfilePhotoThumbnail.png');
      const profilePhotoBuf = Buffer.from(profilePhoto).toString('hex');
      const profilePhotoThumbnailBuf = Buffer.from(profilePhotoThumbnail).toString('hex');
      console.log( profilePhotoBuf, profilePhotoThumbnailBuf);
      const employeeHeaders: EmployeeHeader[] = getEmployeeHeadersBatchDynamicData(batchNum);
	    profilePhotos = [];
	  for (let i = 0; i < employeeHeaders.length; i += 1) {
		    const empHeader = employeeHeaders[i];
        let fileName = file_name({length: 6}) + '_' + i + '_' + batchNum + '.jpg';
		    const profilePhoto: ProfilePhoto = {
            modifiedAt: '2023-03-02 10:27:34.028000000',
            ID: uuid(),
            employee_ID: empHeader.ID,
            profileImage: profilePhotoBuf,
            profileThumbnail: profilePhotoThumbnailBuf,
            fileName: fileName,
        };
        profilePhotos.push(profilePhoto);
  	}
  	lastBatchNum = batchNum;
  return profilePhotos;
}
}