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
/////////// Iteration 3 Wrap requests ////////////
export function channelMessagesV3SS(token: string, channelId: number, start: number) {
  const res = request('GET', `${url}:${port}/channel/messages/v3`,
      {
        headers:  {
          token: token,
        },
        qs: {
          channelId: channelId,
          start: start
        }
      });
  return JSON.parse(res.body as string);
}

export function channelLeaveV2SS(token: string, channelId: number) {
  const res = request('POST', `${url}:${port}/channel/leave/v2`,
      {
        headers:  {
          token: token,
        },
        json: {
          channelId: channelId
        }
      });
  return JSON.parse(res.body as string);
}

/////////// Iteration 2 Wrap requests ////////////
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

export function channelDetailsV2SS(token: string, channelId: number) {
  const res = request('GET', `${url}:${port}/channel/details/v2`,
      {
        qs: {
          token: token,
          channelId: channelId
        }
      });
  return JSON.parse(res.body as string);
}

export function channelJoinV2SS(token: string, channelId: number) {
  const res = request('POST', `${url}:${port}/channel/join/v2`,
      {
        json: {
          token: token,
          channelId: channelId
        }
      });
  return JSON.parse(res.body as string);
}

export function channelAddOwnerV1SS(token: string, channelId: number, uId: number) {
  const res = request('POST', `${url}:${port}/channel/addowner/v1`,
      {
        json: {
          token: token,
          channelId: channelId,
          uId: uId
        }
      });
  return JSON.parse(res.body as string);
}

export function channelRemoveOwnerV1SS(token: string, channelId: number, uId: number) {
  const res = request('POST', `${url}:${port}/channel/removeowner/v1`,
      {
        json: {
          token: token,
          channelId: channelId,
          uId: uId
        }
      });
  return JSON.parse(res.body as string);
}