import { program } from 'commander';
import { InitialBulkLoad } from './InitialBulkLoad';
import { BulkDelete } from './BulkDelete';
import { StaticBulkLoad } from './StaticBulkLoad';

program
  .command('bulk-delete')
  .description('Delete all existing data')
  .action(async () => {
    try {
      await new BulkDelete().deleteAll();
      console.log('Bulk Delete successful');
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

program
  .command('static-load')
  .description('Perform initial static load of data (e.g. skills)')
  .action(async () => {
    try {
      await new StaticBulkLoad().load();
      console.log('Static Load successful');
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

program
  .command('bulk-load')
  .description('Perform subsequent bulk load of data, with PERF_TESTDATA_BATCH_RANGE read from default-env.json')
  .action(async () => {
    try {
      await new InitialBulkLoad().load();
      console.log('Bulk Load successful');
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

program
  .command('bulk-load-assignments')
  .description('Perform subsequent bulk load of only assignment data via API')
  .action(async () => {
    try {
      await new InitialBulkLoad().loadAssignments();
      console.log('Bulk Load successful');
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  });

program.parse(process.argv);
