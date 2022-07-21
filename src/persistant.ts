import { Data } from './dataStore';
import fs from 'fs';

// later add error checking for this
function persistantSaveData(toSave: Data) {
  const path = 'data.json';
  // Gary: Ideally don't read from the file everytime, just need to read from it once at the beginning
  fs.writeFileSync(path, JSON.stringify(toSave), { flag: 'w' });
}

function persistantReadData(): Data {
  const path = 'data.json';
  const data = JSON.parse(String(fs.readFileSync(path, { flag: 'r' })));
  return data;
}

export { persistantSaveData, persistantReadData };
