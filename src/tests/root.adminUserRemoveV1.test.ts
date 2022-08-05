import config from '../config.json';
import { userProfileV2ServerSide } from '../wrapped.user';

const request = require('sync-request');

import os from 'os';
import { tokenToAuthUserId } from '../token';
import { authRegisterV2ServerSide } from '../wrapped.auth';

const OK = 200;
const port = config.port;
let url = config.url;

if (os.platform() === 'darwin') {
  url = 'http://localhost';
}

beforeEach(() => request('DELETE', `${url}:${port}/clear/v1`));

describe('Testing basic functionality', () => {
  test('Removing a single user', () => {
    // MISSING MESSAGE TESTING
    const owner = authRegisterV2ServerSide('kevinyu@unsw.com', 'KevinsPassword0', 'Kevin', 'Yu');
    const user = authRegisterV2ServerSide('Bob@email.com', 'Bobspassword0', 'Bob', 'Smith');
    let res = request('DELETE', `${url}:${port}/admin/user/remove/v1`, {
      headers: {
        'token': owner.token
      },
      qs: {
        uId: user.authUserId
      }
    });
    res = request('GET', `${url}:${port}/users/all/v3`), {
      headers: {
        'token': owner.token
      },
      qs: {}
    };
    expect(JSON.parse(res.body as string)).toStrictEqual({ users: [] });
    res = request('GET', `${url}:${port}/user/profile/v3`, {
      headers: {
        'token': owner.token
      },
      qs: {
        uId: user.authUserId
      }
    });
    const profile = JSON.parse(res.body as string);
    expect(profile).toStrictEqual({
      user: {
        uId: user.authUserId,
        email: profile.email + '(removed user)',
        nameFirst: 'Removed',
        nameLast: 'user',
        handleStr: profile.handleStr + '(removed user)',
      }
    });
  });
});
