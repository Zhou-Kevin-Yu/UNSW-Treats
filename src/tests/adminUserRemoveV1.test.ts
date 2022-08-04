import config from '../config.json';
import { userProfileV2ServerSide } from '../wrapped.user';

const request = require('sync-request');

import os from 'os';
import { tokenToAuthUserId } from '../token';

const OK = 200;
const port = config.port;
let url = config.url;

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

beforeEach(() => request('DELETE', `${url}:${port}/clear/v1`));

describe('Testing basic functionality', () => {
  test('Removing a single user', () => {
    //MISSING MESSAGE TESTING
    let res = request('POST', `${url}:${port}/auth/register/v2`, {
    json: {
        email: 'kevinyu@unsw.com',
        password: 'KevinsPassword0',
        nameFirst: 'Kevin',
        nameLast: 'Yu'
    }});
    const user = JSON.parse(res.body.toString());
    const uId = user.authUserId;
    res = request('DELETE', `${url}:${port}/admin/user/remove/v1`, { qs: { uId: uId }});
    res = request('GET', `${url}:${port}/users/all/v3`), { qs: {} };
    expect(JSON.parse(res.body.toString())).toStrictEqual({ users: [] });
    res = request('GET', `${url}:${port}/user/profile/v3`, { qs: { uId: uId } });
    const profile = JSON.parse(res.body.toString());
    expect(profile).toStrictEqual({
        user: {
            uId: uId,
            email: profile.email,
            nameFirst: 'Removed',
            nameLast: 'user',
            handleStr: 'profile.handleStr',
            permission: 0
        }
    });
  });
});