# Utilization Test Cases

Utilization algorithm is responsible, to find the utilization percentage of each resource who is eligible for the resource request for the next 90 days (from the current date).

Below are the scenarios which are covered for testing this algorithm.

As maintaining 90 days availability data and assignment data was difficult we have maintained only 3 days data. So the test case will be mocking 90 days with 3 days to cover all the test cases.

Input to the algorithm is the start date, end date and resources to calculate the utilization percentage.

> Utilization Percentage Formula: ( Booked Capacity / Gross capacity ) \* 100

## Scenarios

---

### 1. A resource is not utilized for the next 90 days

Consider the following three days of availability and assignment data for this scenario.

| Resource | Working Time | Over Time | Planned Working Time | Booked Time | Gross Capacity | Booked Capacity | Net Capacity |
| -------- | ------------ | --------- | -------------------- | ----------- | -------------- | --------------- | ------------ |
| 1        | 5082         | 30        | 45                   | 67          | 5000           | 0               | 5000         |
|          | 3082         | 30        | 45                   | 67          | 3000           | 0               | 3000         |
|          | 2082         | 30        | 45                   | 67          | 2000           | 0               | 2000         |

As the resource has no booked capacity(assignment) data his utilization percentage would be 0.00 %.

### 2. A resource is utilized for the next 90 days

Consider the following three days of availability and assignment data for this scenario.

| Resource | Working Time | Over Time | Planned Working Time | Booked Time | Gross Capacity | Booked Capacity | Net Capacity |
| -------- | ------------ | --------- | -------------------- | ----------- | -------------- | --------------- | ------------ |
| 2        | 5082         | 30        | 45                   | 67          | 5000           | 5000            | 0            |
|          | 3082         | 30        | 45                   | 67          | 3000           | 3000            | 0            |
|          | 2082         | 30        | 45                   | 67          | 2000           | 2000            | 0            |

As the resource is completely assigned hence the utilization percentage for this scenario is 100%.

### 3. A resource is partially utilized for the next 90 days

Consider the following three days of availability and assignment data for this scenario.

| Resource | Working Time | Over Time | Planned Working Time | Booked Time | Gross Capacity | Booked Capacity | Net Capacity |
| -------- | ------------ | --------- | -------------------- | ----------- | -------------- | --------------- | ------------ |
| 3        | 5082         | 30        | 45                   | 67          | 5000           | 2000            | 3000         |
|          | 3082         | 30        | 45                   | 67          | 3000           | 3000            | 0            |
|          | 2082         | 30        | 45                   | 67          | 2000           | 1000            | 1000         |

As the resource is partially assigned the utilization percentage for this scenario is 60%.

### 4. A resource is partially available & completely utilized for those available dates

Consider the following three days of availability and assignment data for this scenario.

| Resource | Working Time | Over Time | Planned Working Time | Booked Time | Gross Capacity | Booked Capacity | Net Capacity |
| -------- | ------------ | --------- | -------------------- | ----------- | -------------- | --------------- | ------------ |
| 4        | 5082         | 30        | 45                   | 67          | 5000           | 5000            | 0            |
|          | 3082         | 30        | 45                   | 67          | 3000           | 3000            | 0            |

As the resource is partially available(say here only 2 days in example) and is completely assigned for those 2 days hence the utilization percentage is 100%.

### 5. A resource is over-utilized for the next 90 days

Consider the following three days of availability and assignment data for this scenario.

| Resource | Working Time | Over Time | Planned Working Time | Booked Time | Gross Capacity | Booked Capacity | Net Capacity |
| -------- | ------------ | --------- | -------------------- | ----------- | -------------- | --------------- | ------------ |
| 5        | 5082         | 30        | 45                   | 67          | 5000           | 6000            | -1000        |
|          | 3082         | 30        | 45                   | 67          | 3000           | 3000            | 0            |
|          | 2082         | 30        | 45                   | 67          | 2000           | 5000            | -3000        |

As the resource is over assigned already hence the utilization percentage for the above test data is 140%.

### 6. A resource is not utilized as availability data is not maintained

Consider the following three days of availability and assignment data for this scenario.

| Resource | Working Time | Over Time | Planned Working Time | Booked Time | Gross Capacity | Booked Capacity | Net Capacity |
| -------- | ------------ | --------- | -------------------- | ----------- | -------------- | --------------- | ------------ |
| 6        | 0            | 0         | 0                    | 0           | 0              | 0               | 0            |
|          | 0            | 0         | 0                    | 0           | 0              | 0               | 0            |
|          | 0            | 0         | 0                    | 0           | 0              | 0               | 0            |

As the resource is new to the organization and has no availability data maintained, utilization percentage algorithm will return 0.00% as a result.
