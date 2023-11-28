# WorkAssignmentFirstJobDetail View Test

There is a native Hana view created for other domains to provide the first JobDetail for a given time slice.

Below are the scenarios for which tests are in place.

### Sample JobDetails Data

| S. No.      | JobDetails/validFrom | JobDetails/validTo |
|:-----------:|:--------------------:|:------------------:|
| JobDetails1 | 2018-01-01           | 2018-09-09         |
| JobDetails2 | 2018-09-09           | 2019-11-24         |
| JobDetails3 | 2019-11-24           | 9999-12-31         |

## Scenarios

| Scenario                                                                      | Time slice                                                            | Expected First JobDetails     |
|-------------------------------------------------------------------------------|-----------------------------------------------------------------------|-------------------------------|
| Get JobDetail valid as of today.                                              | validFrom: `today` <br /> validTo: `today`                            | `JobDetails3`                 |
| Get JobDetails for a given timeSlice.                                         | validFrom: `2014-01-01` <br /> validTo: `2023-12-31`                  | `JobDetails1`                 |
| Get no JobDetails defined timeSlice does not match any of JobDetail.          | validFrom: `1950-01-01` <br /> validTo: `1960-12-31`                  | `None`                        |
| Get JobDetails when input_timeSlice/validTo is same as JobDetails/validFrom.  | validFrom: `2016-01-01` <br /> validTo: `2018-09-09`                  | `JobDetails1`                 |
| Get JobDetails when input_timeSlice/validFrom is same as JobDetails/validTo.  | validFrom: `2019-11-24` <br /> validTo: `2020-09-09`                  | `jobDetails3`                 |
| Get No JobDetails when either only validFrom is defined.                      | validFrom: `2018-01-01` <br /> validTo: `None`                        | `None`                        |
| Get No JobDetails when either only validTo is defined.                        | validFrom: `None` <br /> validTo: `2020-01-01`                        | `None`                        |
| Get JobDetail if validFrom and validTo Values are defined in TimeStamp format.| validFrom: `2018-01-01T00:00:00` <br /> validTo: `2018-03-01T00:00:00`| `JobDetails1`                 |
| Get No JobDetails when vaidTo Date is before validFrom date.                  | validFrom: `2019-12-31` <br /> validTo: `2018-01-01`                  | `None`                        |
