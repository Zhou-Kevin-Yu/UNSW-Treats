import { getData, setData } from './dataStore';

function clearV1() {
  let data = getData();
  data = { users: [], channels: [], dms: [], systemInfo: { messageTotal: 0 }, standups: [], notifications: [],};
  setData(data);
  return {};
}

export { clearV1 };
