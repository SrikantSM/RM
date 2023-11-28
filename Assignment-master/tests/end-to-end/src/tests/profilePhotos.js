const { ProfilePhoto, EmployeeHeader } = require("test-commons");
const { employeeHeaders } = require('./employeeHeaders');
const uuid = require("uuid").v4;
const fs = require("fs");
const path = require("path");

const file_name = require("crypto-random-string");

module.exports = {
	getProfilePhotosBatchDynamicData: async function () {
		const profilePhoto = fs.readFileSync(path.resolve(__dirname, "../data/profilePhoto/ProfilePhoto.png"));
		const profilePhotoThumbnail = fs.readFileSync(path.resolve(__dirname, "../data/profilePhoto/ProfilePhotoThumbnail.png"));
		const profilePhotoBuf = Buffer.from(profilePhoto).toString("hex");
		const profilePhotoThumbnailBuf = Buffer.from(profilePhotoThumbnail).toString("hex");
		const employeeHeadersBuff = employeeHeaders;

		let profilePhotos = [];
		let batchNum = 0;
		for (let i = 0; i < employeeHeadersBuff.length; i += 1) {
			const empHeader = employeeHeadersBuff[i];
			let fileName = file_name({ length: 6 }) + "_" + i + "_" + batchNum + ".jpg";
			const profilePhoto = {
				modifiedAt: "2023-03-02 10:27:34.028000000",
				ID: uuid(),
				employee_ID: empHeader.ID,
				profileImage: profilePhotoBuf,
				profileThumbnail: profilePhotoThumbnailBuf,
				fileName: fileName
			};
			profilePhotos.push(profilePhoto);
		}
		return profilePhotos;
	}
};
