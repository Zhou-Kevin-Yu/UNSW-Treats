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

//////////// Iteration 3 wrapped requests - updated routes and token in header ////////////
export function messageShareV1SS(token: string, ogMessageId: number, message: string, channelId: number, dmId: number) {
  const res = request(
    'POST',
        `${url}:${port}/message/share/v1`,
        {
          headers: {
            'token': token,
          },
          json: {
            ogMessageId,
            message,
            channelId,
            dmId,
          }
        }
  );
  return res;
}

export function messageReactV1SS(token: string, messageId: number, reactId: number) {
  const res = request(
    'POST',
        `${url}:${port}/message/react/v1`,
        {
          headers: {
            'token': token,
          },
          json: {
            messageId,
            reactId,
          }
        }
  );
  return {
    body: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  }
}

export function messageUnreactV1SS(token: string, messageId: number, reactId: number) {
  const res = request(
    'POST',
        `${url}:${port}/message/unreact/v1`,
        {
          headers: {
            'token': token,
          },
          json: {
            messageId,
            reactId,
          }
        }
  );
  return {
    body: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  }
}

export function messagePinV1SS(token: string, messageId: number) {
  const res = request(
    'POST',
        `${url}:${port}/message/pin/v1`,
        {
          headers: {
            'token': token,
          },
          json: {
            messageId,
          }
        }
  );
  return {
    body: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  }
}

export function messageUnpinV1SS(token: string, messageId: number) {
  const res = request(
    'POST',
        `${url}:${port}/message/unpin/v1`,
        {
          headers: {
            'token': token,
          },
          json: {
            messageId,
          }
        }
  );
  return {
    body: JSON.parse(res.body as string),
    statusCode: res.statusCode,
  }
}

export function messageSendlaterV1SS(token: string, channelId: number, message: string, timeSent: number) {
  const res = request(
    'POST',
        `${url}:${port}/message/sendlater/v1`,
        {
          headers: {
            'token': token,
          },
          json: {
            channelId,
            message,
            timeSent,
          }
        }
  );
  return JSON.parse(res.body as string);
}

export function messageSendlaterDmV1SS(token: string, channelId: number, message: string, timeSent: number) {
  const res = request(
    'POST',
        `${url}:${port}/message/sendlaterdm/v1`,
        {
          headers: {
            'token': token,
          },
          json: {
            channelId,
            message,
            timeSent,
          }
        }
  );
  return JSON.parse(res.body as string);
}

//////////// Old message wrapped requests - updated routes and token in header ////////////
function messageRemoveV2SS(token: string, messageId: number) {
  const res = request('DELETE', `${url}:${port}/message/remove/v2`, {
    headers: {
      'token': token,
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
          'token': token,
        },
        json: {
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
            'token': token,
          },
          json: {
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
            'token': token,
          },
          json: {
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