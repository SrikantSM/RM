# Compute Calendar Week Test Cases

Procedure **RM_COMPUTE_CALENDAR_WEEK** is responsible to return different date parameters based on input timestamp.

The logic uses the input timestamp and computes and returns various date and time fields.
It is currently used in Procedure **RM_FILL_TIME_DIMENSION**.

Below are the scenarios which are covered for testing this procedure.


## Scenarios
---

### 1. IV_TIME: '2019-01-01 00:00:00.000'
Here the start of the week for the input date is in the previous year.

Output:
| EV_START_TIME                 | EV_END_TIME                   | EV_YEAR | EV_QUARTER | EV_YEAR_QUARTER | EV_MONTH | EV_YEAR_MONTH | EV_WEEK | EV_YEAR_WEEK |
|-------------------------------|-------------------------------|---------|------------|-----------------|----------|---------------|---------|--------------|
| 2018-12-31 00:00:00.000000000 | 2019-01-06 23:59:59.999999900 | 2018    | Q4         | 2018-Q4         | 12       | 2018-12       | 01      | 2019         |

### 2. IV_TIME: '2020/01/10'
A different format of the date is given as input. 

Output:
| EV_START_TIME                 | EV_END_TIME                   | EV_YEAR | EV_QUARTER | EV_YEAR_QUARTER | EV_MONTH | EV_YEAR_MONTH | EV_WEEK | EV_YEAR_WEEK |
|-------------------------------|-------------------------------|---------|------------|-----------------|----------|---------------|---------|--------------|
| 2020-01-06 00:00:00.000000000 | 2020-01-12 23:59:59.999999900 | 2020    | Q1         | 2020-Q1         | 01       | 2020-01       | 02      | 2020         |