import { initializeRepositories, dataUnloader, prepareData } from '../utils/processor';

async function unloadData() {
  await initializeRepositories();
  const data = await prepareData();
  await dataUnloader(data);
}

unloadData();
