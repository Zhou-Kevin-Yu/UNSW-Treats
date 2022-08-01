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

export function channelMessagesV2SS(token: string, channelId: number, start: number) {
const res = request('GET', `${url}:${port}/channel/messages/v2`,
      {
        qs: {
          token: token,
          channelId: channelId,
          start: start
        }
      });
  return JSON.parse(res.body as string);
}