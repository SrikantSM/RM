export const NUMBER_OF_PROJECTS_PER_RM = 144;
export const NUMBER_OF_WORKPACKAGES_PER_PROJECT = 9;
export const NUMBER_OF_DEMANDS_PER_WP = 8;
export const NUMBER_OF_RESOURCEREQUESTS_PER_DEMAND = 1;
export const NUMBER_OF_SKILLS_PER_RR = 4;
export const REQUESTED_QUANTITY_PER_DEMAND = 120;
export const NUMBER_OF_TEST_PROJECTS_PER_RM = 1;
// General Customer scenario will have Resource Request duration as 6 months.
// But we want to test the matching candidate for a Resource Request that is valid for 2 years.
// For this we create some projects that are valid for 2 years.
export const NUMBER_OF_STRESS_TEST_PROJECTS_PER_RM = 1;
export const REQUESTED_UNIT ='H';
export const REQUESTED_RR_UNIT ='duration-hour';
export const NUMBER_OF_NON_S4_RESOURCEREQUESTS = 14400 - ( NUMBER_OF_PROJECTS_PER_RM * NUMBER_OF_WORKPACKAGES_PER_PROJECT * NUMBER_OF_DEMANDS_PER_WP );
