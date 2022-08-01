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

function messageEditV1SS(token: string, messageId: number, message: string) {
  const res6 = request(
      'PUT',
      `${url}:${port}/message/edit/v1`,
      {
        json: {
          token: token,
          messageId: messageId,
          message: message,
        }
      }
    );
    return JSON.parse(res6.getBody() as string);
}

function messageSendDmV1SS(token: string, dmId: number, message: string) {
  const res = request(
    'POST',
        `${url}:${port}/message/senddm/v1`,
        {
          json: {
            token,
            dmId,
            message,
          }
        }
  );
  return JSON.parse(res.body as string);
}

function messageSendV1SS(token: string, channelId: number, message: string) {
  const res = request(
    'POST',
        `${url}:${port}/message/send/v1`,
        {
          json: {
            token,
            channelId,
            message,
          }
        }
  );
  return JSON.parse(res.body as string);
}

export { messageSendDmV1SS, messageSendV1SS, messageEditV1SS };
