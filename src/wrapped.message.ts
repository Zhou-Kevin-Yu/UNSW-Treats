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

//////////// Old message wrapped requests - updated routes and token in header ////////////
function messageRemoveV2SS(token: string, messageId: number) {
  const res = request('DELETE', `${url}:${port}/message/remove/v2`, {
    headers: {
      token: token,
    },
    qs: {
      messageId: messageId
    }
  });
  return JSON.parse(res.body as string);
}

function messageEditV2SS(token: string, messageId: number, message: string) {
  const res6 = request(
      'PUT',
      `${url}:${port}/message/edit/v2`,
      {
        headers: {
          token: token,
        },
        json: {
          token: token,
          messageId: messageId,
          message: message,
        }
      }
    );
    return JSON.parse(res6.getBody() as string);
}

function messageSendDmV2SS(token: string, dmId: number, message: string) {
  const res = request(
    'POST',
        `${url}:${port}/message/senddm/v2`,
        {
          headers: {
            token: token,
          },
          json: {
            token,
            dmId,
            message,
          }
        }
  );
  return JSON.parse(res.body as string);
}

function messageSendV2SS(token: string, channelId: number, message: string) {
  const res = request(
    'POST',
        `${url}:${port}/message/send/v2`,
        {
          headers: {
            token: token,
          },
          json: {
            token,
            channelId,
            message,
          }
        }
  );
  return JSON.parse(res.body as string);
}
//////////// Old message wrapped requests ////////////
function messageRemoveV1SS(token: string, messageId: number) {
  const res = request('DELETE', `${url}:${port}/message/remove/v1`, {
    qs: {
      token: token,
      messageId: messageId
    }
  });
  return JSON.parse(res.body as string);
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

export { messageSendDmV1SS, messageSendV1SS, messageEditV1SS, messageRemoveV1SS };
export { messageSendDmV2SS, messageSendV2SS, messageEditV2SS, messageRemoveV2SS };