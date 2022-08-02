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
  const res = request('GET', `${url}:${port}/dm/messages/v1`, {
    qs: {
      token: token,
      dmId: dmId, 
      start: start,
    }
  });
  return JSON.parse(res.body as string);
}

function dmCreateV1SS(token: string, uIds: number[]) {
  const res = request(
    'POST',
    `${url}:${port}/dm/create/v1`,
    {
      json: {
        token: token,
        uIds: uIds,
      }
    }
  );
  return JSON.parse(res.body as string);
}

export { dmMessagesV1SS, dmCreateV1SS };
