import config from '../config.json';
import { authRegisterV2ServerSide } from '../wrapped.auth';
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
  test('Adding 1 member', () => {
    const kevin = authRegisterV2ServerSide('kevinyu@email.com',
      'KevinsPassword0', 'Kevin', 'Yu');
    const bob = authRegisterV2ServerSide('bob@email.com', 'BobsPassword', 'Bob', 'Smith');
    const kevinProfile = userProfileV2ServerSide(kevin.token, kevin.authUserId);
    const bobProfile = userProfileV2ServerSide(bob.token, bob.authUserId);
    let res = request('POST', `${url}:${port}/channels/create/v2`,
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
    res = request('GET', `${url}:${port}/channel/details/v2`,
      {
        qs: {
          token: kevin.token,
          channelId: channelId
        }
      });
    const channel = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(channel.allMembers).toStrictEqual([kevinProfile.user, bobProfile.user]);
    expect(channel.ownerMembers).toStrictEqual([kevinProfile.user]);
  });
  test('Inviting a user who is already a member', () => {
    const kevin = authRegisterV2ServerSide('kevinyu@email.com',
      'KevinsPassword0', 'Kevin', 'Yu');
    const bob = authRegisterV2ServerSide('bob@email.com', 'BobsPassword', 'Bob', 'Smith');
    // const kevinProfile = userProfileV2ServerSide(kevin.token, kevin.authUserId);
    // const bobProfile = userProfileV2ServerSide(bob.token, bob.authUserId);
    let res = request('POST', `${url}:${port}/channels/create/v2`,
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
    res = request('POST', `${url}:${port}/channel/invite/v2`,
      {
        json: {
          token: kevin.token,
          channelId: channelId,
          uId: bob.authUserId
        }
      });
    expect(res.statusCode).toBe(OK);
    expect(JSON.parse(res.body as string)).toStrictEqual({ error: 'error' });
  });
});
