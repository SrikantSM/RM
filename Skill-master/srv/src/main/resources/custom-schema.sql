CREATE VIEW COM_SAP_RESOURCEMANAGEMENT_SKILL_SKILLSDOWNLOAD AS
SELECT skill.ID AS skillUUID,
  skill.EXTERNALID AS conceptUri,
  texts.LOCALE AS locale,
  texts.NAME AS preferredLabel,
  texts.DESCRIPTION AS description,
  GROUP_CONCAT(altLabels.NAME, CHAR(10)) AS altLabels,
  skill.LIFECYCLESTATUS_CODE AS usage,
  catalogs.NAMES AS catalogs,
  proficiency.PROFICIENCYSET_NAME AS proficiencySet,
  proficiency.PROFICIENCYLEVEL_UUID AS proficiencyLevelUUID,
  proficiency.PROFICIENCYLEVEL AS proficiencyLevel,
  proficiency.PROFICIENCYLEVEL_NAME AS proficiencyLevelName
FROM "COM_SAP_RESOURCEMANAGEMENT_SKILL_SKILLS" skill
  LEFT JOIN "COM_SAP_RESOURCEMANAGEMENT_SKILL_SKILLS_TEXTS" texts ON skill.ID = texts.ID
  LEFT JOIN "COM_SAP_RESOURCEMANAGEMENT_SKILL_ALTERNATIVELABELS" altLabels ON skill.ID = altLabels.SKILL_ID
  LEFT JOIN (
    SELECT proficiencySets.ID AS PROFICIENCYSET_UUID,
      proficiencySets.NAME AS PROFICIENCYSET_NAME,
      proficiencyLevelTexts.LOCALE AS PROFICIENCYTEXT_LOCALE,
      GROUP_CONCAT(proficiencyLevels.ID, CHAR(10)) AS PROFICIENCYLEVEL_UUID,
      GROUP_CONCAT(proficiencyLevels.RANK, CHAR(10)) AS PROFICIENCYLEVEL,
      GROUP_CONCAT(proficiencyLevelTexts.NAME, CHAR(10)) AS PROFICIENCYLEVEL_NAME
    FROM COM_SAP_RESOURCEMANAGEMENT_SKILL_PROFICIENCYSETS proficiencySets
      INNER JOIN COM_SAP_RESOURCEMANAGEMENT_SKILL_PROFICIENCYLEVELS proficiencyLevels ON proficiencySets.ID = proficiencyLevels.PROFICIENCYSET_ID
      LEFT JOIN COM_SAP_RESOURCEMANAGEMENT_SKILL_PROFICIENCYLEVELS_TEXTS proficiencyLevelTexts ON proficiencyLevels.ID = proficiencyLevelTexts.ID
    GROUP BY proficiencySets.ID,
      proficiencySets.NAME,
      proficiencyLevelTexts.LOCALE
  ) proficiency ON skill.PROFICIENCYSET_ID = proficiency.PROFICIENCYSET_UUID
  AND texts.LOCALE = proficiency.PROFICIENCYTEXT_LOCALE
  LEFT JOIN (
    SELECT innerCatalogAssociations.SKILL_ID AS SKILL_ID,
      GROUP_CONCAT(innerCatalogs.NAME, CHAR(10)) AS NAMES
    FROM COM_SAP_RESOURCEMANAGEMENT_SKILL_CATALOGS innerCatalogs
      INNER JOIN COM_SAP_RESOURCEMANAGEMENT_SKILL_CATALOGS2SKILLS innerCatalogAssociations ON innerCatalogs.ID = innerCatalogAssociations.CATALOG_ID
    GROUP BY innerCatalogAssociations.SKILL_ID
  ) catalogs ON skill.ID = catalogs.SKILL_ID
WHERE altLabels.ID IS NULL
  OR texts.LOCALE = altLabels.LANGUAGE_CODE
GROUP BY skill.ID,
  skill.EXTERNALID,
  texts.LOCALE,
  texts.NAME,
  texts.DESCRIPTION,
  skill.LIFECYCLESTATUS_CODE,
  catalogs.NAMES,
  proficiency.PROFICIENCYSET_NAME,
  proficiency.PROFICIENCYLEVEL_UUID,
  proficiency.PROFICIENCYLEVEL,
  proficiency.PROFICIENCYLEVEL_NAME
ORDER BY skill.ID;
