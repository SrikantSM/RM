# Role Match Test Cases

In order to test Role Match, we have considered three resources as mentioned below:

## Resources

| ID  | Name | Role Assigned       |
| --- | ---- | ------------------- |
| 1   | Tom  | Junior Consultant   |
| 2   | Mary | Junior Consultant   |
|     |      | Platinum Consultant |
|     |      | Senior Consultant   |
| 3   | John |                     |

As you see in the above table, reosurce `Mary` has three roles assigned and resource `John` has not maintaied any role in his profile.

## Scenarios

1.  ### One role filter is passed

    Scenario 1 tells about a filter passed for the role match.

    Role match logic is called with Role filter of `Junior Consultant`.

    Input:

    1. Resources:

       | ID  | Name |
       | --- | ---- |
       | 1   | Tom  |
       | 2   | Mary |
       | 3   | John |

    2. Role filter: `Junior Consultant`

    Output:

    | ID  | Name | Role              |
    | --- | ---- | ----------------- |
    | 1   | Tom  | Junior Consultant |
    | 2   | Mary | Junior Consultant |

2.  ### No role filter is passed

    Scenario 2 tells about no filter passed for the role match.


    Input:

    1. Resources:

       | ID  | Name |
       | --- | ---- |
       | 1   | Tom  |
       | 2   | Mary |
       | 3   | John |

    2. Role filter: `''`

    Output:

    | ID  | Name | Role                |
    | --- | ---- | ------------------- |
    | 1   | Tom  | Junior Consultant   |
    | 2   | Mary | Junior Consultant   |
    | 2   | Mary | Platinum Consultant |
    | 2   | Mary | Senior Consultant   |
    | 3   | John |                     |
