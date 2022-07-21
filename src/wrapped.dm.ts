import request from 'sync-request';
import config from './config.json';
import os from 'os';

// const OK = 200;
const port = config.port;
let url = config.url;

// console.log(os.platform());

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

function dmMessagesV1SS(token: string, dmId: number, start: number) {
  const res = request('POST', `${url}:${port}/dm/messages/v1`, {
    json: {
      token: token,
      dmId: dmId, // no Dm has been created so any number here should fail
      start: start,
    }
  });
  return JSON.parse(res.body as string);
}

export { dmMessagesV1SS };
