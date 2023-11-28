import { initializeRepositories, dataLoader, prepareData } from '../utils/processor';

async function loadData() {
  await initializeRepositories();
  const data = await prepareData();
  await dataLoader(data);
}

loadData();
