// This script can be used to generate the data from png/jpeg file that is needed for profile photo of the consultant for local dev/test
const fs = require('fs');

// provide the path for the normal and thumbnail image in below 2 lines
const profilePhoto =  fs.readFileSync('provide png/jpeg file path here');
const profilePhotoThumbnail =  fs.readFileSync('provide png/jpeg file path here');
const profilePhotoBuf = Buffer.from(profilePhoto).toString('hex');
const profilePhotoThumbnailBuf = Buffer.from(profilePhotoThumbnail).toString('hex');

// replace ID and employee_ID with the actual GUUID's
console.log("ID,employee_ID," + profilePhotoBuf + "," + profilePhotoThumbnailBuf);
// copy the output to the tests/ui-integration/test-data/csv/com.sap.resourceManagement.employee-ProfilePhoto.csv file