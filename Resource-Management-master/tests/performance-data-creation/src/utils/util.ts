/**
 * Assignment API Interface 
 * Lists all properties needed in the create Assignment API request payload
 */
export interface AssignmentAPIPayload {
    resourceId: string;
    resourceRequestId: string; 
    start: string; 
    end: string; 
    duration: string;
    mode: string;
}

/**
 * Utility function to extract batches of sub arrays as defined in the batchsize
 * TODO: move to Test-commons or utils 
 * @param array 
 * @param batchSize 
 */
export function batchArray<T>(array: T[], batchSize: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += batchSize) {
      result.push(array.slice(i, i + batchSize));
    }
    return result;
  }
  
  /**
 * Utility function to retrurn the date for a given month and day.
 * @param month reference, '0' refers current month, 1 refers to next month.
 * @param day reference, '0' refers last day of last month, '1' refer to 1st day of the month.  
 */
export function getDate(month: number, day: number) {
    let dateJson;
    const date = new Date(Date.now());  
    var startWorkingDayDate = new Date(Date.UTC(date.getFullYear(), date.getMonth() + month, day));
    dateJson = startWorkingDayDate.toJSON();
    return dateJson;
  }

export function getNoOfDaysInMonth(monthOffset: number) {
    const now = new Date(Date.now()); 
    var date = new Date(Date.UTC(now.getFullYear(), now.getMonth() + monthOffset +1 , 0));
    return date.getDate();
  }