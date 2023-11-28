# Fill Time Dimension Test Cases

Procedure **RM_FILL_TIME_DIMENSION** is used to fill time dimension data in **COM_SAP_RESOURCEMANAGEMENT_SYSTEM_DATA_TIMEDIMENSION_DATA**.

The below logic uses the input **start_date** and **end_date** and generates records to be inserted 
into the time dimension data table for every interval specified by the input **time_bucket_type_code** and returns the number of records inserted into the table.

Below are the scenarios which are covered for testing this procedure.

## Scenarios
---

### 1. Bucket type - 01 - (Year)

Input:
| IV_TIME_BUCKET_TYPE_CODE |      IV_START_TIME      |       IV_END_TIME       |
|:------------------------:|:-----------------------:|:-----------------------:|
|            01            | 1996-12-28 09:00:00.000 | 1998-01-31 00:00:00.000 |

Output:
| EV_NUMBER_OF_RECORDS |
|----------------------|
|           3          |

### 2. Bucket type - 02 - (Quarter)

Input:
| IV_TIME_BUCKET_TYPE_CODE |      IV_START_TIME      |       IV_END_TIME       |
|:------------------------:|:-----------------------:|:-----------------------:|
|            02            | 1996-12-01 00:00:00.000 | 1997-02-01 00:00:00.000 |

Output:
| EV_NUMBER_OF_RECORDS |
|----------------------|
|           2          |

### 3. Bucket type - 03 - (Month)

Input:
| IV_TIME_BUCKET_TYPE_CODE | IV_START_TIME | IV_END_TIME |
|--------------------------|---------------|-------------|
|            03            |   1990/10/1   |  1990/11/1  |

Output:
| EV_NUMBER_OF_RECORDS |
|----------------------|
|           2          |

### 4. Bucket type - 04 - (Week)

Input:
| IV_TIME_BUCKET_TYPE_CODE | IV_START_TIME | IV_END_TIME |
|:------------------------:|:-------------:|:-----------:|
|            04            |   1994-01-01  |  1994-01-07 |

Output:
| EV_NUMBER_OF_RECORDS |
|----------------------|
|           2          |

### 5. Bucket type - 05 - (Date)

Input:
| IV_TIME_BUCKET_TYPE_CODE |         IV_START_TIME         |          IV_END_TIME          |
|:------------------------:|:-----------------------------:|:-----------------------------:|
|            05            | 1995-01-01 10:35:00.000000000 | 1995-01-07 22:12:00.000000000 |

Output:
| EV_NUMBER_OF_RECORDS |
|----------------------|
|           7          |

### 6. Bucket type - 06 - (Hour)

Input:
| IV_TIME_BUCKET_TYPE_CODE |      IV_START_TIME      |       IV_END_TIME       |
|:------------------------:|:-----------------------:|:-----------------------:|
|            06            | 1986-01-29 08:00:00.000 | 1986-01-29 23:00:00.000 |

Output:
| EV_NUMBER_OF_RECORDS |
|----------------------|
|          16          |

### 7. Bucket type - 07 - (30 minutes)

Input:
| IV_TIME_BUCKET_TYPE_CODE |         IV_START_TIME         |          IV_END_TIME          |
|:------------------------:|:-----------------------------:|:-----------------------------:|
|            07            | 1987-01-29 20:00:00.000000000 | 1987-01-29 23:00:00.000000000 |

Output:
| EV_NUMBER_OF_RECORDS |
|----------------------|
|           8          |

### 8. Bucket type - 08 - (15 minutes)

Input:
| IV_TIME_BUCKET_TYPE_CODE |         IV_START_TIME         |          IV_END_TIME          |
|:------------------------:|:-----------------------------:|:-----------------------------:|
|            08            | 1988-01-29 20:00:00.000000000 | 1988-01-29 22:00:00.000000000 |

Output:
| EV_NUMBER_OF_RECORDS |
|----------------------|
|          12          |

### 9. start_time > end_time
When start time is greater than end time, no record is generated and hence 0 is returned

Input:
| IV_TIME_BUCKET_TYPE_CODE |         IV_START_TIME         |          IV_END_TIME          |
|:------------------------:|:-----------------------------:|:-----------------------------:|
|            04            | 1971-01-29 23:00:00.000000000 | 1970-01-29 21:00:00.000000000 |

Output:
| EV_NUMBER_OF_RECORDS |
|----------------------|
|           0          |

### 10. Bucket type - Incorrect
When incorrect bucket type code is entered, no record is generated and hence 0 is returned

Input:
| IV_TIME_BUCKET_TYPE_CODE |         IV_START_TIME         |          IV_END_TIME          |
|:------------------------:|:-----------------------------:|:-----------------------------:|
|            99            | 1988-01-29 23:00:00.000000000 | 1988-01-29 21:00:00.000000000 |

Output:
| EV_NUMBER_OF_RECORDS |
|----------------------|
|           0          |