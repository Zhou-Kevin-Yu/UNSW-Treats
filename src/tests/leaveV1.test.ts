import config from '../config.json';

const request = require('sync-request');

import os from 'os';

const OK = 200;
const port = config.port;
let url = config.url;

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

beforeEach(() => request('DELETE', `${url}:${port}/clear/v1`));

describe('Testing basic functionality', () => {
  test('Leaving server with 2 members', () => {
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
    res = request('POST', `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'bob@email.com',
          password: 'BobsPassword',
          nameFirst: 'Bob',
          nameLast: 'Smith'
        }
      });
    const bob = JSON.parse(res.body as string);
    res = request('GET', `${url}:${port}/user/profile/v2`,
      {
        qs: {
          token: kevin.token,
          uId: kevin.authUserId
        }
      });
    const kevinProfile = JSON.parse(res.body as string);
    res = request('POST', `${url}:${port}/channels/create/v2`,
      {
        json: {
          token: kevin.token,
          name: 'name',
          isPublic: true
        }
      });
    const { channelId } = JSON.parse(res.body as string);
    res = request('POST', `${url}:${port}/channel/invite/v2`,
      {
        json: {
          token: kevin.token,
          channelId: channelId,
          uId: bob.authUserId
        }
      });
    res = request('POST', `${url}:${port}/channel/leave/v1`,
      {
        json: {
          token: bob.token,
          channelId: channelId,
        }
      });
    expect(res.statusCode).toBe(OK);
    res = request('GET', `${url}:${port}/channel/details/v2`,
      {
        qs: {
          token: kevin.token,
          channelId: channelId
        }
      });
    const data = JSON.parse(res.body as string);
    expect(data.allMembers).toStrictEqual([kevinProfile.user]);
  });
  test('user was originally not in the channel', () => {
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
    res = request('POST', `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'bob@email.com',
          password: 'BobsPassword',
          nameFirst: 'Bob',
          nameLast: 'Smith'
        }
      });
    const bob = JSON.parse(res.body as string);
    res = request('GET', `${url}:${port}/user/profile/v2`,
      {
        qs: {
          token: kevin.token,
          uId: kevin.authUserId
        }
      });
    // const kevinProfile = JSON.parse(res.body as string);
    res = request('POST', `${url}:${port}/channels/create/v2`,
      {
        json: {
          token: kevin.token,
          name: 'name',
          isPublic: true
        }
      });
    const channelId = JSON.parse(res.body as string).channelId;
    res = request('POST', `${url}:${port}/channel/leave/v1`,
      {
        json: {
          token: bob.token,
          channelId: channelId,
        }
      });
    expect(res.statusCode).toBe(OK);
    const data = JSON.parse(res.body as string);
    expect(data).toStrictEqual({ error: 'error' });
  });
});
