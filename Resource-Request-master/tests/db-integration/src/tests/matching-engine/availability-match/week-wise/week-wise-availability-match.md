# Week-Wise Availability Match Test Cases

In order to test the Availability match in case of week-wise effort distribution, we are considering a resource request which
is of one month duration and is distributed week-wise. The demanded efforts are 100 H are distributed as shown below.

## Resource Request

| ID  | Start Date | End Date  | Requested Minutes |
| --- | ---------- | --------- | ----------------- |
| 1   | 1/1/2020   | 31/1/2020 | 6000              |

## Resource Request Capacity

| ID  | Resource Request  | Start Date  | End Date   | Requested Minutes | Assignment |
| --- | ----------------  | ----------  | ---------  | ----------------- | ---------- |
| 1   | 1                 | 1/1/2020    | 4/1/2020   | 1000               | 0          |
| 2   | 1                 | 5/1/2020    | 11/1/2020   | 1200               | 0          |
| 3   | 1                 | 12/1/2020    | 18/1/2020   | 1300               | 0          |
| 4   | 1                 | 19/1/2020    | 25/1/2020   | 1400               | 0          |
| 5   | 1                 | 26/1/2020    | 31/1/2020   | 1100               | 0          |

## Scenarios

---

### 1.Resource is available as requested

**Given**: 
Consider [Resource Request](#resource-request) and [Resource Request Capacity Requirement](#resource-request-capacity) Data as mentioned.

**When**:

Consider the below week-wise data of a resource (Bran) for this scenario.

| Start Date | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
|------------|-------------------------|------------------|-----------------------------|
| 01-01-2020 | 360                     | 0                | 360                         |
| 02-01-2020 | 480                     | 0                | 480                         |
| 03-01-2020 | 160                     | 0                | 160                         |
| 04-01-2020 | 0                       | 0                | 0                           |
| 05-01-2020 | 0                       | 0                | 0                           |
| 06-01-2020 | 360                     | 0                | 360                         |
| 07-01-2020 | 240                     | 0                | 240                         |
| 08-01-2020 | 240                     | 0                | 240                         |
| 09-01-2020 | 360                     | 0                | 360                         |
| 10-01-2020 | 0                       | 0                | 0                           |
| 11-01-2020 | 0                       | 0                | 0                           |
| 12-01-2020 | 0                       | 0                | 0                           |
| 13-01-2020 | 0                       | 0                | 0                           |
| 14-01-2020 | 360                     | 0                | 360                         |
| 15-01-2020 | 260                     | 0                | 260                         |
| 16-01-2020 | 200                     | 0                | 200                         |
| 17-01-2020 | 480                     | 0                | 480                         |
| 18-01-2020 | 0                       | 0                | 0                           |
| 19-01-2020 | 0                       | 0                | 0                           |
| 20-01-2020 | 360                     | 0                | 360                         |
| 21-01-2020 | 240                     | 0                | 240                         |
| 22-01-2020 | 360                     | 0                | 360                         |
| 23-01-2020 | 440                     | 0                | 440                         |
| 24-01-2020 | 0                       | 0                | 0                           |
| 25-01-2020 | 0                       | 0                | 0                           |
| 26-01-2020 | 0                       | 0                | 0                           |
| 27-01-2020 | 360                     | 0                | 360                         |
| 28-01-2020 | 120                     | 0                | 120                         |
| 29-01-2020 | 60                      | 0                | 60                          |
| 30-01-2020 | 200                     | 0                | 200                         |
| 31-01-2020 | 360                     | 0                | 360                         |

Week-wise aggregation data based on Resource Request data as below:

| Start Date           | End Date   | Remaining Available Minutes | Matched Effort |
|----------------------|------------|-----------------------------|----------------|
| 01-01-2020           | 04-01-2020 | 1000                        | 1000           |
| 05-01-2020           | 11-01-2020 | 1200                        | 1200           |
| 12-01-2020           | 18-01-2020 | 1300                        | 1300           |
| 19-01-2020           | 25-01-2020 | 1400                        | 1400           |
| 26-01-2020           | 31-01-2020 | 1100                        | 1100           |
| Total Matched Effort |            |                             | 6000           |

**Then**:

| RR | Resource | Availability Match % |
|----|----------|----------------------|
| 1  | Bran   | 100                  |

### 2. Resource is partially available as requested

**Given**: 
Consider [Resource Request](#resource-request) and [Resource Request Capacity Requirement](#resource-request-capacity) Data as mentioned.

**When**:
   Consider the below week-wise data of a resource (Mandy) for this scenario.

| Start Date | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
|------------|-------------------------|------------------|-----------------------------|
| 01-01-2020 | 0                       | 0                | 0                           |
| 02-01-2020 | 240                     | 0                | 240                         |
| 03-01-2020 | 360                     | 0                | 360                         |
| 04-01-2020 | 0                       | 0                | 0                           |
| 05-01-2020 | 0                       | 0                | 0                           |
| 06-01-2020 | 360                     | 0                | 360                         |
| 07-01-2020 | 240                     | 0                | 240                         |
| 08-01-2020 | 240                     | 0                | 240                         |
| 09-01-2020 | 0                       | 0                | 0                           |
| 10-01-2020 | 0                       | 0                | 0                           |
| 11-01-2020 | 0                       | 0                | 0                           |
| 12-01-2020 | 0                       | 0                | 0                           |
| 13-01-2020 | 0                       | 0                | 0                           |
| 14-01-2020 | 360                     | 0                | 360                         |
| 15-01-2020 | 240                     | 0                | 240                         |
| 16-01-2020 | 0                       | 0                | 0                           |
| 17-01-2020 | 480                     | 0                | 480                         |
| 18-01-2020 | 0                       | 0                | 0                           |
| 19-01-2020 | 0                       | 0                | 0                           |
| 20-01-2020 | 360                     | 0                | 360                         |
| 21-01-2020 | 0                       | 0                | 0                           |
| 22-01-2020 | 0                       | 0                | 0                           |
| 23-01-2020 | 480                     | 0                | 480                         |
| 24-01-2020 | 360                     | 0                | 360                         |
| 25-01-2020 | 0                       | 0                | 0                           |
| 26-01-2020 | 0                       | 0                | 0                           |
| 27-01-2020 | 360                     | 0                | 360                         |
| 28-01-2020 | 0                       | 0                | 0                           |
| 29-01-2020 | 240                     | 0                | 240                         |
| 30-01-2020 | 240                     | 0                | 240                         |
| 31-01-2020 | 360                     | 0                | 360                         |

Week-wise aggregation data based on Resource Request data as below:

| Start Date           | End Date   | Remaining Available Minutes | Matched Effort |
|----------------------|------------|-----------------------------|----------------|
| 01-01-2020           | 04-01-2020 | 600                         | 600            |
| 05-01-2020           | 11-01-2020 | 840                         | 840            |
| 12-01-2020           | 18-01-2020 | 1080                        | 1080           |
| 19-01-2020           | 25-01-2020 | 1200                        | 1200           |
| 26-01-2020           | 31-01-2020 | 1200                        | 1100           |
| Total Matched effort |            |                             | 4820           |

**Then**:

| RR | Resource | Availability Match % |
|----|----------|----------------------|
| 1  | Mandy    | 80.33333333          |

### 3. Resource is not available as requested

**Given**: 
Consider [Resource Request](#resource-request) and [Resource Request Capacity Requirement](#resource-request-capacity) Data as mentioned.

**When**:

Consider the below week-wise data of a resource (Ryan) for this scenario.

| Start Date | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
|------------|-------------------------|------------------|-----------------------------|
| 01-01-2020 | 0                       | 0                | 0                           |
| 02-01-2020 | 240                     | 300              | -60                         |
| 03-01-2020 | 360                     | 360              | 0                           |
| 04-01-2020 | 0                       | 0                | 0                           |
| 05-01-2020 | 0                       | 0                | 0                           |
| 06-01-2020 | 360                     | 360              | 0                           |
| 07-01-2020 | 240                     | 240              | 0                           |
| 08-01-2020 | 240                     | 240              | 0                           |
| 09-01-2020 | 0                       | 0                | 0                           |
| 10-01-2020 | 0                       | 0                | 0                           |
| 11-01-2020 | 0                       | 0                | 0                           |
| 12-01-2020 | 0                       | 0                | 0                           |
| 13-01-2020 | 0                       | 0                | 0                           |
| 14-01-2020 | 360                     | 360              | 0                           |
| 15-01-2020 | 240                     | 240              | 0                           |
| 16-01-2020 | 0                       | 0                | 0                           |
| 17-01-2020 | 480                     | 480              | 0                           |
| 18-01-2020 | 0                       | 0                | 0                           |
| 19-01-2020 | 0                       | 0                | 0                           |
| 20-01-2020 | 360                     | 360              | 0                           |
| 21-01-2020 | 0                       | 0                | 0                           |
| 22-01-2020 | 0                       | 0                | 0                           |
| 23-01-2020 | 480                     | 480              | 0                           |
| 24-01-2020 | 360                     | 360              | 0                           |
| 25-01-2020 | 0                       | 0                | 0                           |
| 26-01-2020 | 0                       | 0                | 0                           |
| 27-01-2020 | 360                     | 360              | 0                           |
| 28-01-2020 | 0                       | 0                | 0                           |
| 29-01-2020 | 240                     | 240              | 0                           |
| 30-01-2020 | 240                     | 300              | -60                         |
| 31-01-2020 | 360                     | 480              | -120                        |

Week-wise aggregation data based on Resource Request data as below:

| Start Date | End Date   | Remaining Available Minutes | Matched Effort |
|------------|------------|-----------------------------|----------------|
| 01-01-2020 | 04-01-2020 | -60                         | 0              |
| 05-01-2020 | 11-01-2020 | 0                           | 0              |
| 12-01-2020 | 18-01-2020 | 0                           | 0              |
| 19-01-2020 | 25-01-2020 | 0                           | 0              |
| 26-01-2020 | 31-01-2020 | -180                        | 0              |

**Then**:

| RR | Resource | Availability Match % |
|----|----------|----------------------|
| 1  | Ryan     | 0                    |

### 4. Resource has more available minutes than requested

**Given**: 
Consider [Resource Request](#resource-request) and [Resource Request Capacity Requirement](#resource-request-capacity) Data as mentioned.

**When**:

Consider the below week-wise data of a resource (Adam) for this scenario.

| Start Date | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
|------------|-------------------------|------------------|-----------------------------|
| 01-01-2020 | 480                     | 0                | 480                         |
| 02-01-2020 | 480                     | 0                | 480                         |
| 03-01-2020 | 480                     | 0                | 480                         |
| 04-01-2020 | 0                       | 0                | 0                           |
| 05-01-2020 | 0                       | 0                | 0                           |
| 06-01-2020 | 360                     | 0                | 360                         |
| 07-01-2020 | 240                     | 0                | 240                         |
| 08-01-2020 | 240                     | 0                | 240                         |
| 09-01-2020 | 480                     | 0                | 480                         |
| 10-01-2020 | 0                       | 0                | 0                           |
| 11-01-2020 | 0                       | 0                | 0                           |
| 12-01-2020 | 0                       | 0                | 0                           |
| 13-01-2020 | 480                     | 0                | 480                         |
| 14-01-2020 | 360                     | 0                | 360                         |
| 15-01-2020 | 240                     | 0                | 240                         |
| 16-01-2020 | 0                       | 0                | 0                           |
| 17-01-2020 | 480                     | 0                | 480                         |
| 18-01-2020 | 0                       | 0                | 0                           |
| 19-01-2020 | 0                       | 0                | 0                           |
| 20-01-2020 | 480                     | 0                | 480                         |
| 21-01-2020 | 240                     | 0                | 240                         |
| 22-01-2020 | 360                     | 0                | 360                         |
| 23-01-2020 | 480                     | 0                | 480                         |
| 24-01-2020 | 120                     | 0                | 120                         |
| 25-01-2020 | 0                       | 0                | 0                           |
| 26-01-2020 | 0                       | 0                | 0                           |
| 27-01-2020 | 480                     | 0                | 480                         |
| 28-01-2020 | 120                     | 0                | 120                         |
| 29-01-2020 | 120                     | 0                | 120                         |
| 30-01-2020 | 240                     | 0                | 240                         |
| 31-01-2020 | 240                     | 0                | 240                         |

Week-wise aggregation data based on Resource Request data as below:

| Start Date           | End Date   | Remaining Available Minutes | Matched Effort |
|----------------------|------------|-----------------------------|----------------|
| 01-01-2020           | 04-01-2020 | 1440                        | 1000           |
| 05-01-2020           | 11-01-2020 | 1320                        | 1200           |
| 12-01-2020           | 18-01-2020 | 1560                        | 1300           |
| 19-01-2020           | 25-01-2020 | 1680                        | 1400           |
| 26-01-2020           | 31-01-2020 | 1200                        | 1100           |
| Total Matched effort |            |                             | 6000           |

**Then**:

| RR | Resource | Availability Match % |
|----|----------|----------------------|
| 1  | Adam     | 100                  |

### 5. Resource has zero availability

**Given**: 
Consider [Resource Request](#resource-request) and [Resource Request Capacity Requirement](#resource-request-capacity) Data as mentioned.

**When**:

Consider the below week-wise data of a resource (Joey) for this scenario.

| Start Date | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
|------------|-------------------------|------------------|-----------------------------|
| 01-01-2020 | 0                       | 0                | 0                           |
| 02-01-2020 | 0                       | 0                | 0                           |
| 03-01-2020 | 0                       | 0                | 0                           |
| 04-01-2020 | 0                       | 0                | 0                           |
| 05-01-2020 | 0                       | 0                | 0                           |
| 06-01-2020 | 0                       | 0                | 0                           |
| 07-01-2020 | 0                       | 0                | 0                           |
| 08-01-2020 | 0                       | 0                | 0                           |
| 09-01-2020 | 0                       | 0                | 0                           |
| 10-01-2020 | 0                       | 0                | 0                           |
| 11-01-2020 | 0                       | 0                | 0                           |
| 12-01-2020 | 0                       | 0                | 0                           |
| 13-01-2020 | 0                       | 0                | 0                           |
| 14-01-2020 | 0                       | 0                | 0                           |
| 15-01-2020 | 0                       | 0                | 0                           |
| 16-01-2020 | 0                       | 0                | 0                           |
| 17-01-2020 | 0                       | 0                | 0                           |
| 18-01-2020 | 0                       | 0                | 0                           |
| 19-01-2020 | 0                       | 0                | 0                           |
| 20-01-2020 | 0                       | 0                | 0                           |
| 21-01-2020 | 0                       | 0                | 0                           |
| 22-01-2020 | 0                       | 0                | 0                           |
| 23-01-2020 | 0                       | 0                | 0                           |
| 24-01-2020 | 0                       | 0                | 0                           |
| 25-01-2020 | 0                       | 0                | 0                           |
| 26-01-2020 | 0                       | 0                | 0                           |
| 27-01-2020 | 0                       | 0                | 0                           |
| 28-01-2020 | 0                       | 0                | 0                           |
| 29-01-2020 | 0                       | 0                | 0                           |
| 30-01-2020 | 0                       | 0                | 0                           |
| 31-01-2020 | 0                       | 0                | 0                           |

Week-wise aggregation data based on Resource Request data as below:

| Start Date | End Date   | Remaining Available Minutes | Matched Effort |
|------------|------------|-----------------------------|----------------|
| 01-01-2020 | 04-01-2020 | 0                           | 0              |
| 05-01-2020 | 11-01-2020 | 0                           | 0              |
| 12-01-2020 | 18-01-2020 | 0                           | 0              |
| 19-01-2020 | 25-01-2020 | 0                           | 0              |
| 26-01-2020 | 31-01-2020 | 0                           | 0              |


**Then**:

| RR | Resource | Availability Match % |
|----|----------|----------------------|
| 1  | Joey     | 0                    |

### 6. Resource has partial availability maintained

**Given**: 
Consider [Resource Request](#resource-request) and [Resource Request Capacity Requirement](#resource-request-capacity) Data as mentioned.

**When**:

Consider the below week-wise data of a resource (Katharina) for this scenario.

| Start Date | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
|------------|-------------------------|------------------|-----------------------------|
| 03-01-2020 | 480                     | 0                | 480                         |
| 04-01-2020 | 0                       | 0                | 0                           |
| 05-01-2020 | 0                       | 0                | 0                           |
| 06-01-2020 | 360                     | 0                | 360                         |
| 09-01-2020 | 480                     | 0                | 480                         |
| 10-01-2020 | 0                       | 0                | 0                           |
| 11-01-2020 | 0                       | 0                | 0                           |
| 12-01-2020 | 0                       | 0                | 0                           |
| 13-01-2020 | 480                     | 0                | 480                         |
| 14-01-2020 | 360                     | 0                | 360                         |
| 15-01-2020 | 240                     | 0                | 240                         |
| 16-01-2020 | 0                       | 0                | 0                           |
| 17-01-2020 | 480                     | 0                | 480                         |
| 18-01-2020 | 0                       | 0                | 0                           |
| 19-01-2020 | 0                       | 0                | 0                           |
| 20-01-2020 | 480                     | 0                | 480                         |
| 21-01-2020 | 240                     | 0                | 240                         |
| 22-01-2020 | 360                     | 0                | 360                         |

Week-wise aggregation data based on Resource Request data as below:

| Start Date           | End Date   | Remaining Available Minutes | Matched Effort |
|----------------------|------------|-----------------------------|----------------|
| 01-01-2020           | 04-01-2020 | 480                         | 480            |
| 05-01-2020           | 11-01-2020 | 840                         | 840            |
| 12-01-2020           | 18-01-2020 | 1560                        | 1300           |
| 19-01-2020           | 25-01-2020 | 1080                        | 1080           |
| 26-01-2020           | 31-01-2020 | 0                           | 0              |
| Total Matched effort |            |                             | 3700           |

**Then**:

| RR | Resource  | Availability Match % |
|----|-----------|----------------------|
| 1  | Katharina | 61.66666667          |

### 7. Resource Request start and end is mid of a month and resource has availability maintained for both the months

**Given**: 

Consider the Resource Request and Resource Request Capacity Requirement as below:

**Resource Request**

| ID  | Start Date | End Date  | Requested Minutes |
| --- | ---------- | --------- | ----------------- |
| 2   | 15/1/2020   | 18/2/2020 | 7200              |

**Resource Request Capacity**

| ID  | Resource Request  | Start Date  | End Date   | Requested Minutes | Assignment |
| --- | ----------------  | ----------  | ---------  | ----------------- | ---------- |
| 1 | 2 | 15-01-2020 | 18-01-2020 | 1000 | 0 |
| 2 | 2 | 19-01-2020 | 25-01-2020 | 1200 | 0 |
| 3 | 2 | 26-01-2020 | 01-02-2020 | 1300 | 0 |
| 4 | 2 | 02-02-2020 | 08-02-2020 | 1400 | 0 |
| 5 | 2 | 09-02-2020 | 15-02-2020 | 1100 | 0 |
| 6 | 2 | 16-02-2020 | 18-02-2020 | 1200 | 0 |

**When**:

Consider the below week-wise data of a resource (Dexter) for this scenario:

| Start Date | Total Available Minutes | Assigned Minutes | Remaining Available Minutes |
|------------|-------------------------|------------------|-----------------------------|
| 01-01-2020 | 360                     | 0                | 360                         |
| 02-01-2020 | 480                     | 0                | 480                         |
| 03-01-2020 | 160                     | 0                | 160                         |
| 04-01-2020 | 0                       | 0                | 0                           |
| 05-01-2020 | 0                       | 0                | 0                           |
| 06-01-2020 | 360                     | 0                | 360                         |
| 07-01-2020 | 240                     | 0                | 240                         |
| 08-01-2020 | 240                     | 0                | 240                         |
| 09-01-2020 | 360                     | 0                | 360                         |
| 10-01-2020 | 0                       | 0                | 0                           |
| 11-01-2020 | 0                       | 0                | 0                           |
| 12-01-2020 | 0                       | 0                | 0                           |
| 13-01-2020 | 0                       | 0                | 0                           |
| 14-01-2020 | 360                     | 0                | 360                         |
| 15-01-2020 | 260                     | 0                | 260                         |
| 16-01-2020 | 200                     | 0                | 200                         |
| 17-01-2020 | 480                     | 0                | 480                         |
| 18-01-2020 | 0                       | 0                | 0                           |
| 19-01-2020 | 0                       | 0                | 0                           |
| 20-01-2020 | 360                     | 0                | 360                         |
| 21-01-2020 | 240                     | 0                | 240                         |
| 22-01-2020 | 360                     | 0                | 360                         |
| 23-01-2020 | 440                     | 0                | 440                         |
| 24-01-2020 | 0                       | 0                | 0                           |
| 25-01-2020 | 0                       | 0                | 0                           |
| 26-01-2020 | 0                       | 0                | 0                           |
| 27-01-2020 | 360                     | 0                | 360                         |
| 28-01-2020 | 120                     | 0                | 120                         |
| 29-01-2020 | 60                      | 0                | 60                          |
| 30-01-2020 | 200                     | 0                | 200                         |
| 31-01-2020 | 360                     | 0                | 360                         |
| 01-02-2020 | 0                       | 0                | 0                           |
| 02-02-2020 | 0                       | 0                | 0                           |
| 03-02-2020 | 480                     | 0                | 480                         |
| 04-02-2020 | 480                     | 120              | 360                         |
| 05-02-2020 | 360                     | 360              | 0                           |
| 06-02-2020 | 480                     | 0                | 480                         |
| 07-02-2020 | 0                       | 0                | 0                           |
| 08-02-2020 | 0                       | 0                | 0                           |
| 09-02-2020 | 0                       | 0                | 0                           |
| 10-02-2020 | 360                     | 120              | 240                         |
| 11-02-2020 | 480                     | 480              | 0                           |
| 12-02-2020 | 360                     | 0                | 360                         |
| 13-02-2020 | 240                     | 0                | 240                         |
| 14-02-2020 | 480                     | 0                | 480                         |
| 15-02-2020 | 0                       | 0                | 0                           |
| 16-02-2020 | 0                       | 0                | 0                           |
| 17-02-2020 | 360                     | 0                | 360                         |
| 18-02-2020 | 360                     | 0                | 360                         |
| 19-02-2020 | 360                     | 0                | 360                         |
| 20-02-2020 | 360                     | 0                | 360                         |
| 21-02-2020 | 360                     | 0                | 360                         |
| 22-02-2020 | 0                       | 0                | 0                           |
| 23-02-2020 | 0                       | 0                | 0                           |
| 24-02-2020 | 480                     | 360              | 120                         |
| 25-02-2020 | 360                     | 360              | 0                           |
| 26-02-2020 | 240                     | 0                | 240                         |
| 27-02-2020 | 240                     | 0                | 240                         |
| 28-02-2020 | 240                     | 0                | 240                         |
| 29-02-2020 | 0                       | 0                | 0                           |

Week-wise aggregation data based on Resource Request data as below:

| Start Date           | End Date   | Remaining Available Minutes | Matched Effort |
|----------------------|------------|-----------------------------|----------------|
| 15-01-2020           | 18-01-2020 | 940                         | 940            |
| 19-01-2020           | 25-01-2020 | 1400                        | 1200           |
| 26-01-2020           | 01-02-2020 | 1100                        | 1100           |
| 02-02-2020           | 08-02-2020 | 1320                        | 1320           |
| 09-02-2020           | 15-02-2020 | 1320                        | 1100           |
| 16-02-2020           | 18-02-2020 | 720                         | 720            |
| Total Matched effort |            |                             | 6380           |

**Then**:

| RR | Resource | Availability Match % |
|----|----------|----------------------|
| 2  | Dexter   | 88.61111111          |