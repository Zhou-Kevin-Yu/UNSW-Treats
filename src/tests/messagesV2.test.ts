import config from '../config.json';

const request = require('sync-request');

import os from 'os';

// const OK = 200;
const port = config.port;
let url = config.url;

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

beforeEach(() => request('DELETE', `${url}:${port}/clear/v1`));

describe('Testing basic functionality', () => {
  test('single message in channel', () => {
    let res = request('POST', `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'kevinyu@email.com',
          password: 'KevinsPassword0',
          nameFirst: 'Kevin',
          nameLast: 'Yu'
        }
      });
    const kevin = JSON.parse(res.body as string);
    res = request('POST', `${url}:${port}/channels/create/v2`,
      {
        json: {
          token: kevin.token,
          name: 'name',
          isPublic: true
        }
      });
    const { channelId } = JSON.parse(res.body as string);
    res = request('POST', `${url}:${port}/message/send/v1`,
      {
        json: {
          token: kevin.token,
          channelId: channelId,
          message: 'Hello World!'
        }
      });
    console.log(JSON.parse(res.body as string));
    const timeSent = Math.floor((new Date()).getTime() / 1000);
    const { messageId } = JSON.parse(res.body as string);
    res = request('GET', `${url}:${port}/channel/messages/v2`,
      {
        qs: {
          token: kevin.token,
          channelId: channelId,
          start: 0
        }
      });
    const data = JSON.parse(res.body as string);
    expect(data).toStrictEqual({
      messages: [
        {
          messageId: messageId,
          uId: kevin.authUserId,
          message: 'Hello World!',
          timeSent: timeSent,
          reacts: [],
          isPinned: false,
        }
      ],
      start: 0,
      end: -1
    });
  });
  test('invalid channelId', () => {
    let res = request('POST', `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'kevinyu@email.com',
          password: 'KevinsPassword0',
          nameFirst: 'Kevin',
          nameLast: 'Yu'
        }
      });
    const kevin = JSON.parse(res.body as string);
    res = request('POST', `${url}:${port}/channels/create/v2`,
      {
        json: {
          token: kevin.token,
          name: 'name',
          isPublic: true
        }
      });
    const { channelId } = JSON.parse(res.body as string);
    res = request('POST', `${url}:${port}/message/send/v1`,
      {
        json: {
          token: kevin.token,
          channelId: channelId,
          message: 'Hello World!'
        }
      });
    console.log(JSON.parse(res.body as string));
    // const timeSent = Math.floor((new Date()).getTime() / 1000);
    // const { messageId } = JSON.parse(res.body as string);
    res = request('GET', `${url}:${port}/channel/messages/v2`,
      {
        qs: {
          token: kevin.token,
          channelId: 1,
          start: 0
        }
      });
    const data = JSON.parse(res.body as string);
    expect(data).toStrictEqual({ error: 'error' });
  });
});
