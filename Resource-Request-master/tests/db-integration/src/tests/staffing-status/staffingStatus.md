# Staffing Status

## Testcase 1

**Given**:

Resource Request capacity requirement: 100 H <br>
Assignment Done: 0 H <br>

**When**:

Resource Manager tries to see the Staffing Status

**Then**:

Staffing Status calculated: Un-Staffed

## Testcase 2

**Given**:

Resource Request capacity requirement: 100 H <br>
Assignment Done: 50 H <br>

**When**:

Resource Manager tries to see the Staffing Status

**Then**:

Staffing Status calculated: Partially Staffed

## Testcase 3

**Given**:

Resource Request capacity requirement: 100 H <br>
Assignment Done: 100 H <br>

**When**:

Resource Manager tries to see the Staffing Status

**Then**:

Staffing Status calculated: Fully Staffed

## Testcase 4

**Given**:

Resource Request capacity requirement: 100 H <br>
Assignment Done: 150 H <br>

**When**:

Resource Manager tries to see the Staffing Status

**Then**:

Staffing Status calculated: Over-Staffed.
