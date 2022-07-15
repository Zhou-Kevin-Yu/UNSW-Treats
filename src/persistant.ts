import { Data } from './dataStore';
import fs from 'fs';

// later add error checking for this
function persistantSaveData(toSave: Data) {
  const path = 'data.json';
  console.log("TO SAVE");
  console.log(JSON.stringify(toSave))
  fs.writeFileSync(path, JSON.stringify(toSave), { flag: 'w' });
}

function persistantReadData(): Data {
  const path = 'data.json';
  const data = JSON.parse(String(fs.readFileSync(path, { flag: 'r' })));
  console.log(data);
  return data;
}

export { persistantSaveData, persistantReadData };
