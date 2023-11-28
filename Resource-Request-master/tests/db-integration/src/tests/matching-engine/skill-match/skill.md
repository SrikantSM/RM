# Skill match Test Cases

**Table of Contents**
- [Skill match Test Cases](#skill-match-test-cases)
  - [1. Skill Match Formula](#1-skill-match-formula)
  - [2. Test Cases](#2-test-cases)
    - [2.1 No Skill is maintained for the Resource](#21-no-skill-is-maintained-for-the-resource)
    - [2.2 Resource Request doesn't request for any skill](#22-resource-request-doesnt-request-for-any-skill)
    - [2.3 Resource has all the Skills requested](#23-resource-has-all-the-skills-requested)
    - [2.4 Resource has no Skills requested](#24-resource-has-no-skills-requested)
    - [2.5 Resource has partial matched Skills requested](#25-resource-has-partial-matched-skills-requested)
    - [2.6 Resource Request has mandatory and preferred Skills, matching only on mandatory skills](#26-resource-request-has-mandatory-and-preferred-skills-matching-only-on-mandatory-skills)
    - [2.7 Resource Request has only preferred Skills](#27-resource-request-has-only-preferred-skills)
    - [2.8 Resource does not have the requested Skill](#28-resource-does-not-have-the-requested-skill)
    - [2.9 Resource has skill assigned to default proficiency level](#29-resource-has-skill-assigned-to-default-proficiency-level)
    - [2.10 Resource Request has skill assigned to default proficiency level](#210-resource-request-has-skill-assigned-to-default-proficiency-level)

## 1. Skill Match Formula

The percentage of skill match is calculated as follows
```
   Skill Match % = SUM(
                       MIN(1,
                             (normalized_resource_prof_level_rank_i / normalized_request_prof_level_rank_i)
                          )
                       ) / count_of_requested_skills
```
> The percentage is calculated up to 2 decimal places.<br>
> If there are no skills requested, the match is 100 % (this prevents a division by zero)

This formula calculates an average overall requested skills, while each skill match is calculated by dividing the proficiency rank of the resource's skill by the one of the resource request's skill. Each separate skill match can result in a maximum of `1` (`100%`), hence a `MIN` function is applied in this formula.
 
- The normalized rank of skill proficiency level for both resoure (`normalized_resource_prof_level_rank_i`) as well as request (`normalized_request_prof_level_rank_i`) are calculated using formula `rank / max_rank_of_proficiency_set`.
- `normalized_resource_prof_level_rank_i`: A value between `0` and `1`, showing the relative location of the proficiency level rank of skill `i` of the resource compared to its proficiency set
- `normalized_request_prof_level_rank_i`: A value between `0` and `1`, showing the relative location of skill `i` of the resource request compared to its proficiency set
- `count_of_requested_skills`: Natural number, describing how many mandatory skills are requested in the resource request  

## 2. Test Cases


### 2.1 No Skill is maintained for the Resource

**Given:** The resource requests with below data:

| Resource Request | Skill       | Importance | Rank       | Max Rank |
|------------------|-------------|------------|------------|----------|
| RR1              | SAP ABAP    | Mandatory  | _default_  | _1_      |
| RR1              | SAP SCP     | Mandatory  | _default_  | _1_      |
| RR2              | SAP HANA    | Mandatory  | _default_  | _1_      |
| RR3              | SAP HANA    | Mandatory  | _default_  | _1_      |

**When:** Resource has no skill maintained as below

| ID | Resource | Skill Label | Rank        | Max Rank   |
| -- | -------- |-------------| ----------- |------------|
| 1  | Randy    | null        | null        | null       |

**Then:** Skill match percentage is 0 as below
    
| Resource Request | Resource  | Skill Match Percentage |
|------------------|-----------|------------------------|
| RR1              | Randy     | 0                      |
| RR2              | Randy     | 0                      |
| RR3              | Randy     | 0                      |

### 2.2 Resource Request doesn't request for any skill

**Given:** The resource request doesn't have any requested skill as below:

| Resource Request | Skill       | Importance | Rank     | Max Rank   |
|------------------|-------------|------------| -------- |------------|
| RR1              | null        | null       | null     | null       |

**When:** Resources with below Skills

| ID | Resource    | Skill Label | Rank      | Max Rank |
| ---|---------    | ----------- | --------- |----------|
| 1  | Ward        |  SAP ABAP   | _default_ | _1_      |
| 2  | Mary        |  Core JAVA  | _default_ | _1_      |

**Then:** Skill match percentage is 100 as below
    
| Resource Request | Resource  | Skill Match Percentage |
|------------------|-----------|------------------------|
| RR1              | Ward      | 100                    |
| RR1              | Mary      | 100                    |


### 2.3 Resource has all the Skills requested

**Given:** The resource request requested for below skills

| Resource Request | Skill       | Importance | Rank      | Max Rank |
|------------------|-------------|------------| --------- |----------|
| RR1              | SAP ABAP    | Mandatory  | _default_ | _1_      |
| RR1              | SAP SCP     | Mandatory  | _default_ | _1_      |

**When:** Resource has all the skills requested

| ID | Resource | Skill Label | Rank      | Max Rank |
| -- | -------- |-------------| --------- |----------|
| 1  | Joy      |   SAP ABAP  | _default_ | _1_      |
| 1  | Joy      |   SAP SCP   | _default_ | _1_      |

**Then:** Skill match percentage is 100 as below
    
| Resource Request | Resource  | Skill Match Percentage |
|------------------|-----------|------------------------|
| RR1              | Joy       | 100                    |

### 2.4 Resource has no Skills requested

**Given:** The resource request requested for below skills

| Resource Request | Skill       | Importance | Rank      | Max Rank |
|------------------|-------------|------------| --------  |----------|
| RR1              | SAP HANA    | Mandatory  | _default_ | _1_      |
| RR2              | SAP SCP     | Mandatory  | _default_ | _1_      |
| RR2              | SAP HANA    | Mandatory  | _default_ | _1_      |

**When:** Resources doesn't have any skills requested

| ID | Resource | Skill Label | Rank      | Max Rank |
| -- | -------- |-------------| --------- |----------|
| 1  | Collen   |  Core JAVA  | _default_ | _1_      |
| 1  | Collen   |  JAVA OOPS  | _default_ | _1_      |

**Then:** Skill match percentage is 0 as below
    
| Resource Request | Resource  | Skill Match Percentage |
|------------------|-----------|------------------------|
| RR1              | Collen    |      0                 |
| RR2              | Collen    |      0                 |

### 2.5 Resource has partial matched Skills requested

**Given:** The resource request requested for below skills

| Resource Request | Skill                | Importance | Rank      | Max Rank |
|------------------|----------------------|------------| --------- |----------|
| RR1              | SAP ABAP             | Mandatory  | _default_ | _1_      |
| RR1              | SAP SCP              | Mandatory  | _default_ | _1_      |
| RR1              | JAVA OOPS            | Mandatory  | _default_ | _1_      |
| RR1              | CORE JAVA            | Preferred  | _default_ | _1_      |
| RR2              | SAP ABAP             | Mandatory  | _default_ | _1_      |
| RR2              | JAVA OOPS            | Mandatory  | _default_ | _1_      |

**When:** Resources do not have all the skills requested

| ID | Resource    | Skill Label | Rank      | Max Rank |
| ---|-------------| ------------| --------- |----------|
| 1  | Claire      |  SAP ABAP   | _default_ | _1_      |
| 1  | Claire      |  SAP HANA   | _default_ | _1_      |
| 2  | Ward        |  SAP ABAP   | _default_ | _1_      |

**Then:** Skill match percentage is as below
    
| Resource Request | Resource  | Skill Match Percentage |
|------------------|-----------|------------------------|
| RR1              | Claire    |      33.33             |
| RR2              | Claire    |      50                |
| RR1              | Ward      |      33.33             |
| RR2              | Ward      |      50                |

### 2.6 Resource Request has mandatory and preferred Skills, matching only on mandatory skills

**Given:** The resource request requested for below skills

| Resource Request | Skill     | Importance | Rank      | Max Rank |
|------------------|-----------|------------| --------- |----------|
| RR1              | SAP ABAP  | Mandatory  | _default_ | _1_      |
| RR1              | SAP SCP   | Mandatory  | _default_ | _1_      |
| RR1              | JAVA OOPS | Mandatory  | _default_ | _1_      |
| RR1              | CORE JAVA | Preferred  | _default_ | _1_      |

**When:** Resources have below skills

| ID | Resource | Skill Label  | Rank      | Max Rank |
| -- | -------- |--------------| --------- |----------|
| 1  | Joy      |  SAP ABAP    | _default_ | _1_      |
| 1  | Joy      |  SAP SCP     | _default_ | _1_      |
| 1  | Joy      |  SAP HANA    | _default_ | _1_      |
| 2  | Claire   |  SAP ABAP    | _default_ | _1_      |
| 2  | Claire   |  SAP HANA    | _default_ | _1_      |

**Then:** Skill match should be done on only Mandatory Skills, preferred skills should be ignored

| Resource Request | Resource  | Skill Match Percentage |
|------------------|-----------|------------------------|
| RR1              | Joy       |      66.66             |
| RR1              | Claire    |      33.33             |

### 2.7 Resource Request has only preferred Skills

**Given:** The resource request requested for below skills

| Resource Request | Skill      | Importance | Rank      | Max Rank |
|------------------|------------|------------| --------- |----------|
| RR1              | SAP ABAP   | Preferred  | _default_ | _1_      |
| RR1              | SAP HANA   | Preferred  | _default_ | _1_      |

**When:** Resources have below skills

| ID | Resource | Skill Label | Rank      | Max Rank |
| -- | -------- |-------------| --------- |----------|
| 1  | Joy      |  SAP ABAP   | _default_ | _1_      |
| 1  | Joy      |  SAP SCP    | _default_ | _1_      |
| 2  | Claire   |  SAP ABAP   | _default_ | _1_      |
| 2  | Claire   |  SAP HANA   | _default_ | _1_      |

**Then:** Skill match is 100 %

| Resource Request | Resource  | Skill Match Percentage |
|------------------|-----------|------------------------|
| RR1              | Joy       |            100.00      | 
| RR1              | Claire    |            100.00      |

### 2.8 Resource does not have the requested Skill

> If resource does not have the skill requested, then the rank is considered as zero.

**Given:** The resource request requested for below skills

| Resource Request | Skill       | Importance | Rank    | Max Rank |
|------------------|-------------|------------|---------|----------|
| RR1              | JAVA        | Mandatory  | 3       | 4        |
| RR1              | ABAP        | Mandatory  | 3       | 3        |
| RR1              | SCP         | Mandatory  | 3       | 3        |

**When:** Resource has below skills

|ID | Resource | Skill       | Rank   | Max Rank   |
|---|----------|-------------|--------|------------| 
|1  | Joy      |  ABAP       | 1      | 3          |
|1  | Joy      |  SCP        | 3      | 3          |


**Then:** Rank of Joy for JAVA is considered as zero and the skill match percentage is as below

| Resource Request | Resource  | Skill Match Percentage |
|------------------|-----------|------------------------|
| RR1              | Joy       |      44.44             | 

### 2.9 Resource has skill assigned to default proficiency level

> If a resource has skill assigned to default proficiency level, then the rank is normalized using the maximum rank of the resource request


**Given:** The resource request requested for below skills

| Resource Request | Skill       | Importance |Rank     | Max Rank |
|------------------|-------------|------------|---------|----------|
| RR1              | JAVA        | Mandatory  | 3       | 4        |
| RR1              | ABAP        | Mandatory  | 3       | 3        |
| RR1              | SCP         | Mandatory  | 3       | 3        |

**When:** Resource has below skills

| ID | Resource | Skill       | Rank        | Max Rank   |
| -- | -------- |-------------|-------------|------------| 
| 1  | Claire   |  JAVA       | _default_   | _1_        |
| 1  | Claire   |  ABAP       | 3           | 3          |
| 1  | Claire   |  SCP        | 2           | 4          |


**Then:** To calcluate the normalized resource rank for JAVA, max rank is taken as 4 i.e. max rank of the requested proficiency set

| Resource Request | Resource  | Skill Match Percentage |
|------------------|-----------|------------------------|
| RR1              | Claire    |      61.11             | 

### 2.10 Resource Request has skill assigned to default proficiency level

> If default proficiency level is assigned to the resource request skill, then the rank is normalized using the maximum rank of the resource

**Given:** The resource request requested for below skills

| Resource Request | Skill       | Importance | Rank       | Max Rank |
|------------------|-------------|------------|------------|----------|
| RR1              | JAVA        | Mandatory  | 2          | 4        |
| RR1              | ABAP        | Mandatory  | 1          | 3        |
| RR1              | SCP         | Mandatory  | 2          | 4        |
| RR1              | HANA        | Mandatory  | _default_  | _1_      |

**When:** Resource has below skills

| ID | Resource | Skill       | Rank        | Max Rank   |
| -- | -------- |-------------|-------------|------------| 
| 1  | Claire   |  JAVA       | 1           | 3          |
| 1  | Claire   |  ABAP       | 2           | 3          |
| 1  | Claire   |  SCP        | 3           | 4          |
| 1  | Claire   |  HANA       | 2           | 4          |

**Then:** To calcluate the normalized requested rank for HANA, max rank is taken as 4 i.e. max rank of the resource proficiency set

| Resource Request | Resource  | Skill Match Percentage |
|------------------|-----------|------------------------|
| RR1              | Claire    |      91.66             | 
