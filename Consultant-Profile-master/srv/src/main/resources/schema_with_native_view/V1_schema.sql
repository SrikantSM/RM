CREATE VIEW COM_SAP_RESOURCEMANAGEMENT_WORKFORCE_WORKASSIGNMENT_JOBDETAILSMAXEVENTSEQEXTRACTOR AS SELECT
  JD1.ID,
    JD1.parent,
    JD1.validFrom,
    JD1.validTo,
    JD1.costCenterExternalID,
    JD1.country_code,
    "Germany" as country_name,
    JD1.fte,
    JD1.workingHoursPerWeek,
    JD1.workingDaysPerWeek,
    JD1.jobExternalID,
    JD1.jobTitle,
    JD1.supervisorWorkAssignmentExternalID,
    JD1.status_code,
    JD1.eventReason_code,
    JD1.eventSequence
FROM
  COM_SAP_RESOURCEMANAGEMENT_WORKFORCE_WORKASSIGNMENT_JOBDETAILS AS JD1
INNER JOIN
  (
    SELECT
      parent,
      validFrom,
      validTo,
      max(eventSequence) as maxEventSequence
    FROM
      COM_SAP_RESOURCEMANAGEMENT_WORKFORCE_WORKASSIGNMENT_JOBDETAILS
    GROUP BY
      parent,
      validFrom,
      validTo
  ) AS JD2
ON
  JD1.validFrom = JD2.validFrom
AND
  JD1.validTo = JD2.validTo
AND
  JD1.parent = JD2.parent
AND
  JD1.eventSequence = JD2.maxEventSequence;
