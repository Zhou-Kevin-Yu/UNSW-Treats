import config from '../config.json';
// import { authRegisterV2ServerSide } from '../wrapped.auth';
import { userProfileV2ServerSide } from '../wrapped.user';

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
  test('Joining server with 1 owner member', () => {
    let res = request('POST', `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'kevinyu@unsw.com',
          password: 'KevinsPassword0',
          nameFirst: 'Kevin',
          nameLast: 'Yu'
        }
      });
    const kevin = JSON.parse(res.body as string);
    console.log(kevin);
    res = request('POST', `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'bob@unsw.com',
          password: 'BobsPassword0',
          nameFirst: 'Bob',
          nameLast: 'Smith'
        }
      });
    const bob = JSON.parse(res.body as string);
    const kevinProfile = userProfileV2ServerSide(kevin.token, kevin.authUserId);
    const bobProfile = userProfileV2ServerSide(bob.token, bob.authUserId);
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
    res = request('POST', `${url}:${port}/channel/addowner/v1`,
      {
        json: {
          token: kevin.token,
          channelId: channelId,
          uId: bob.authUserId
        }
      });
    res = request('POST', `${url}:${port}/channel/removeowner/v1`,
      {
        json: {
          token: kevin.token,
          channelId: channelId,
          uId: bob.authUserId
        }
      });
    console.log(JSON.parse(res.body as string));
    res = request('GET', `${url}:${port}/channel/details/v2`,
      {
        qs: {
          token: kevin.token,
          channelId: channelId
        }
      });
    const data = JSON.parse(res.body as string);
    console.log(data);
    expect(data.allMembers).toStrictEqual([kevinProfile.user, bobProfile.user]);
    expect(data.ownerMembers).toStrictEqual([kevinProfile.user]);
    expect(res.statusCode).toBe(OK);
  });
  test('case where owner to be removed isn\'t an owner', () => {
    let res = request('POST', `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'kevinyu@unsw.com',
          password: 'KevinsPassword0',
          nameFirst: 'Kevin',
          nameLast: 'Yu'
        }
      });
    const kevin = JSON.parse(res.body as string);
    console.log(kevin);
    res = request('POST', `${url}:${port}/auth/register/v3`,
      {
        json: {
          email: 'bob@unsw.com',
          password: 'BobsPassword0',
          nameFirst: 'Bob',
          nameLast: 'Smith'
        }
      });
    const bob = JSON.parse(res.body as string);
    // const kevinProfile = userProfileV2ServerSide(kevin.token, kevin.authUserId);
    // const bobProfile = userProfileV2ServerSide(bob.token, bob.authUserId);
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
    res = request('POST', `${url}:${port}/channel/removeowner/v1`,
      {
        json: {
          token: kevin.token,
          channelId: channelId,
          uId: bob.authUserId
        }
      });
    expect(JSON.parse(res.body as string)).toStrictEqual({ error: 'error' });
  });
});
