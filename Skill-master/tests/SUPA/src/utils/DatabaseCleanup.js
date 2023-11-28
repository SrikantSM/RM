/**
 * Add needed clean up statements to this array
 */
const cleanupStatements = [
  'DELETE FROM COM_SAP_RESOURCEMANAGEMENT_SKILL_ALTERNATIVELABELS WHERE NAME LIKE \'SUPA%\'',
  'DELETE FROM COM_SAP_RESOURCEMANAGEMENT_SKILL_CATALOGS2SKILLS WHERE SKILL_ID IN (SELECT ID FROM COM_SAP_RESOURCEMANAGEMENT_SKILL_SKILLS WHERE EXTERNALID LIKE \'SUPA%\')',
  'DELETE FROM COM_SAP_RESOURCEMANAGEMENT_SKILL_SKILLS_TEXTS WHERE NAME LIKE \'SUPA%\'',
  'DELETE FROM COM_SAP_RESOURCEMANAGEMENT_SKILL_SKILLS WHERE EXTERNALID LIKE \'SUPA%\'',
  'DELETE FROM SKILLSERVICE_SKILLS_TEXTS_DRAFTS WHERE NAME LIKE \'SUPA%\'',
  'DELETE FROM SKILLSERVICE_ALTERNATIVELABELS_DRAFTS WHERE NAME LIKE \'SUPA%\'',
  'DELETE FROM SKILLSERVICE_SKILLS_DRAFTS WHERE EXTERNALID LIKE \'SUPA%\'',
];

module.exports = class DatabaseCleanup {
  constructor(testEnvironment) {
    this.testEnvironment = testEnvironment;
  }

  /*
   * Run the predefined SQL statements to clean up the database after a test run.
   */
  async execute() {
    const databaseClient = await this.testEnvironment.getDatabaseClient();
    console.log('[INFO] Starting database cleanup');

    for (const statement of cleanupStatements) {
      console.log(`[INFO] Executing >>> ${statement} <<<`);
      try {
        await databaseClient.execute(statement);
        console.log(`[INFO] Finished executing >>> ${statement} <<<`);
      } catch (e) {
        console.error(`[ERROR] Failed executing >>> ${statement} <<<`, e);
      }
    }

    console.log('[INFO] Finished database cleanup');
  }
};
