import { Data } from './dataStore';
import { setData } from './dataStore';
import fs from 'fs';

// later add error checking for this
function persistantSaveData(toSave: Data) {
  const path = 'data.json';
  fs.writeFileSync(path, JSON.stringify(toSave), { flag: 'w' });
}

function persistantReadData(): Data {
  const path = 'data.json';
  if(!(fs.existsSync(path))) {
    let data: Data = {
      users: [],
      channels: [],
      dms: [],
      systemInfo: {
        messageTotal: 0,
      },
      standups: [],
    };
    setData(data)
  }
  const data = JSON.parse(String(fs.readFileSync(path, { flag: 'r' })));
  return data;
}

export { persistantSaveData, persistantReadData };
