import { getData, setData } from './dataStore.js';

function clearV1() {
  let data = getData();
  data = { users: [], channels: [] };
  setData(data);
}

export { clearV1 };
