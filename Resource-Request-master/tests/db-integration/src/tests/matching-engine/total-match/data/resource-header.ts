import { ResourceHeader } from 'test-commons';

let resourceHeaderData: ResourceHeader[] = [];

const resourceHeader: ResourceHeader[] = [
  {
    ID: '027e84cc-4d62-4146-8b06-37b44f3f6552',
    type_code: '',
  },
  {
    ID: '16afa716-7d2e-48dc-9272-56774e769f9a',
    type_code: '',
  },
  {
    ID: '8c65ba27-523c-4f4e-940c-5bb6a4867db5',
    type_code: '',
  },
  {
    ID: 'eb4b6d3d-bbf1-4b20-ad61-78f6b06d72e0',
    type_code: '',
  },
  {
    ID: 'aeab0b4c-b955-4740-a3ac-32d753aa0c5b',
    type_code: '',
  },
  {
    ID: '9266657a-f0ce-4d7d-94bc-ff2b8321eb34',
    type_code: '',
  },
];

/*
 * For Resource Request With Day Wise Split
*/
const resourceHeaderForRRWithDayWiseSplit: ResourceHeader[] = [
  {
    ID: 'bb08eb6f-47bb-4e26-a701-16a075d0b905',
    type_code: '',
  },
];

/*
 * For Resource Request With Week-Wise Split
*/
const resourceHeaderForRRWithWeekWiseSplit: ResourceHeader[] = [
  {
    ID: 'b6170953-b353-40cf-b86a-c0a3ce55ad1d',
    type_code: '',
  },
];

resourceHeaderData = [...resourceHeader, ...resourceHeaderForRRWithDayWiseSplit, ...resourceHeaderForRRWithWeekWiseSplit];

/*
 * resourceHeader is exported seperately,
 * since it is needed  in resource-capacity
 * to generate capacity data for RR without split,
*/

export {
  resourceHeader,
  resourceHeaderData,
};
