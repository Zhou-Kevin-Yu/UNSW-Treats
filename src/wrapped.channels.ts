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

export function channelsCreateV2SS(token: string, name: string, isPublic: boolean) {
  const res = request('POST', `${url}:${port}/channels/create/v2`,
        {
          json: {
            token: token,
            name: name,
            isPublic: isPublic
          }
        });
  return JSON.parse(res.body as string);
}

