import { Attachment, EmployeeHeader } from 'test-commons';
import { getEmployeeHeadersBatchDynamicData } from './employeeHeaders';
import { promises as fs } from 'fs';

const file_name = require('crypto-random-string');
const uuid = require('uuid').v4;
let attachments: Attachment[] = [];
let lastBatchNum: number | null = null;

export async function getAttachmentsBatchDynamicData(batchNum: number) {
  if (batchNum !== lastBatchNum) {
      const attachment = await fs.readFile('./src/data/dynamicData/Consultant-Profile/test-resume.pdf');
      const attachmentBuf = Buffer.from(attachment).toString('hex');
      const employeeHeaders: EmployeeHeader[] = getEmployeeHeadersBatchDynamicData(batchNum);
	    attachments = [];
	  for (let i = 0; i < employeeHeaders.length; i += 1) {
		    const empHeader = employeeHeaders[i];
        let fileName = file_name({length: 6}) + '_' + i + '_' + batchNum + '.pdf';
		    const attachment: Attachment = {
            ID: uuid(),
            employee_ID: empHeader.ID,
            content: attachmentBuf,
            fileName: fileName,
        };
        attachments.push(attachment);
  	}
  	lastBatchNum = batchNum;
  return attachments;
}
}