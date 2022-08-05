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

export function wrappedStandupStartServerSide(token: string, channelId: number, length: number) {
    const res = request(
        'POST',
            `${url}:${port}/standup/start/v1`,
            {
                json: {
                    channelId: channelId,
                    length: length,
                },
                headers: {
                    'token': token,
                  }
                }
    );
    return {
        statusCode: res.statusCode,
        body: JSON.parse(res.body as string),
    }
}

export function wrappedStandupActiveServerSide(token: string, channelId: number) {
    const res = request(
        'GET',
            `${url}:${port}/standup/active/v1`,
            {
                headers: {
                    'token': token,
                  },
                  qs: {
                    channelId: channelId,
                  }
                }
    );
    return {
        statusCode: res.statusCode,
        body: JSON.parse(res.body as string),
    }
}

export function wrappedStandupSendServerSide(token: string, channelId: number, message: string) {
    const res = request(
        'POST',
            `${url}:${port}/standup/send/v1`,
            {
                json: {
                    channelId: channelId,
                    message: message,
                },
                headers: {
                    'token': token,
                  }
                }
    );
    return {
        statusCode: res.statusCode,
        body: JSON.parse(res.body as string),
    }
}