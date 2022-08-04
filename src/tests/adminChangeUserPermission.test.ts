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

const ownerPermission = 1;
const memberPermission = 2;

describe('Testing basic functionality', () => {
  test('Setting to new permission', () => {
    let res = request('POST', `${url}:${port}/auth/register/v3`, {
        json: {
            email: 'kevinyu@unsw.com',
            password: 'KevinsPassword0',
            nameFirst: 'Kevin',
            nameLast: 'Yu'
        }
    });
    const owner = JSON.parse(res.body.toString());
    res = request('POST', `${url}:${port}/auth/register/v3`, {
      json: {
          email: 'Bob@email.com',
          password: 'Bobspassword0',
          nameFirst: 'Bob',
          nameLast: 'Smith'
      }
    });
    const user = JSON.parse(res.body.toString());
    res = request('POST', `${url}:${port}/admin/userpermission/change/v1`, {
      json: {
            uId: user.uId,
            permissionId: ownerPermission
        }
    });
    res = request('GET', `${url}:${port}/user/profile/v3`, {
        qs: {
          uId: user.uId
        }
    });
    const userProfile = JSON.parse(res.body.toString());
    expect(userProfile.permission).toStrictEqual(ownerPermission);
  });
});