import { getData, setData } from './dataStore';

function clearV1() {
  let data = getData();
  data = { 
    users: [],
    channels: [],
    dms: [], 
    systemInfo: {
      messageTotal: 0, 
      globalOwners: 0,
    }, 
    standups: [],
    delayedMessages: [],
  };
  setData(data);
  return {};
}

export { clearV1 };
