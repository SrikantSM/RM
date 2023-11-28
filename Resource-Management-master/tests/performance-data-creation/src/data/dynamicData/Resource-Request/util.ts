const moment = require('moment');

export function getStartDate(iterator: number, maxValue: number) {
    /* 
    1. Get Month Start Date based on todays date.
    2. Find which quarter of maxValue the iterator falls in.
        - For entries falling in 1st quarter of maxValue we add 6 months
        - For entries falling in 2nd quarter of maxValue we add 0 months
        - For entries falling in 3rd quarter of maxValue we add -6 months(equivalent to substracting 6 month)
        - For entries falling in 4th quarter of maxValue we add -12 months(equivalent to subtracting 12 month)
    3. Get Month Start Date of above date.
    4. Change format.
    */
    return moment().startOf('month').add(6 - (Math.floor((iterator*4)/maxValue)*6), 'months').startOf('month').format('YYYY-MM-DD')
}

export function getEndDate(iterator: number, maxValue: number) {
    /* 
    1. Get Month End Date based on todays date.
    2. Find which quarter of maxValue the iterator falls in.
        - For entries falling in 1st quarter of maxValue we add 11 months
        - For entries falling in 2nd quarter of maxValue we add 5 months
        - For entries falling in 3rd quarter of maxValue we add -1 months(equivalent to substracting 1 month)
        - For entries falling in 4th quarter of maxValue we add -7 months(equivalent to subtracting 7 month)
    3. Get Month End Date of above date.
    4. Change format.
    */
    return moment().startOf('month').add(11 - (Math.floor((iterator*4)/maxValue)*6), 'months').startOf('month').format('YYYY-MM-DD')
}
